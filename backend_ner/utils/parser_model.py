from utils.parser_related_function import create_result_list, create_semantic_object
import re
import copy

class ParserModel:
    def __init__(self):
        self.semantic_object_list = []
        self.last_pdre_state = {'command': None}
        self.available_teeth_dict = {
            1: [[1, x] for x in range(8, 0, -1)], 
            2: [[2, x] for x in range(1, 9)], 
            3: [[3, x] for x in range(8, 0, -1)], 
            4: [[4, x] for x in range(1, 9)]
        }
        self.last_symbol = False
        self.is_zee = False

    def inference(self, sentence, token_classifier, save=False, threshold=5):
        ''' 
        Input: 
            - sentence: a consider sentence which want to parse
            - token_classifier: a token classifier (WanChangBerta) for tokenize the sentence
            - save: whether, save the new parameters to the old parameters or not
            - threshold: CER threshold
        '''
        tokens = token_classifier.inference(sentence)
        semantic = self.parse(tokens, threshold=threshold) # Don't save parser, check alternate first
        result = self.alternate_parse_zee(sentence, tokens, token_classifier, semantic, save, threshold)

        return result # result

    def alternate_parse_zee(self, sentence, tokens, token_classifier, semantic, save=False, threshold=5):
        if semantic["command"] == "Missing": # No zee in this command
            return semantic

        result_tokens = tokens
        result_semantic = semantic

        if semantic["command"] in ["PDRE", "MGJ"]  and not self.is_zee and "สี่" in sentence: # No zee in this command
            new_sentence = re.sub("สี่", "ซี่", sentence, 1) # replace the first occurance of สี่ with ซี่ 
            new_tokens = token_classifier.inference(new_sentence)
            new_semantic = self.parse(new_tokens, threshold=threshold)
            if new_semantic["is_zee"]:
                result_tokens = new_tokens
                result_semantic = new_semantic

        if save:
            _ = self.parse(result_tokens, save=save, threshold=threshold)

        return result_semantic


    def parse(self, tokens, save=False, threshold=5):
        '''
        Input: 
            - tokens: a list of tokens which obtains from the token classifier model
            - save: whether, save the new parameters to the old parameters or not
            - threshold: CER threshold
        '''
        new_semantic_object_list = copy.deepcopy(self.semantic_object_list)
        new_last_pdre_state = copy.deepcopy(self.last_pdre_state)
        
        word_list = create_result_list(tokens, threshold, self.last_symbol)
        result = create_semantic_object(new_semantic_object_list, word_list, self.available_teeth_dict, new_last_pdre_state)

        is_zee = result["tooth"] is not None
        if is_zee == False:
            for token in tokens:
                if token[1] == "Zee":
                    is_zee = True

        result["is_zee"] = is_zee

        if save:
            self.semantic_object_list = new_semantic_object_list
            self.last_pdre_state = new_last_pdre_state
            self.last_symbol = False
            self.is_zee = is_zee

            if len(tokens) > 0:
                self.last_symbol = tokens[-1][1] == "Symbol"

        return result

    def reset(self):
        self.semantic_object_list = []
        self.last_pdre_state = {'command': None}
        self.available_teeth_dict = {
            1: [[1, x] for x in range(8, 0, -1)], 
            2: [[2, x] for x in range(1, 9)], 
            3: [[3, x] for x in range(8, 0, -1)], 
            4: [[4, x] for x in range(1, 9)]
        }
        self.last_symbol = False


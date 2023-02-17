from utils.parser_related_function import create_result_list, create_semantic_object
from prob.mo_prob import MOProb
from prob.bop_prob import BOPProb
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
        self.prev_token = "None"
        self.prev_distant = -1

        self.mo_prob = MOProb()
        self.bop_prob = BOPProb()

    def inference(self, sentence, token_classifier, save=False, alternate_parse_zee=True, threshold=5):
        ''' 
        Input: 
            - sentence: a consider sentence which want to parse
            - token_classifier: a token classifier (WanChangBerta) for tokenize the sentence
            - save: whether, save the new parameters to the old parameters or not
            - threshold: CER threshold
        '''
        tokens = token_classifier.inference(sentence)
        semantic = self.parse(tokens, threshold=threshold, save=save and not alternate_parse_zee) # Don't save parser, check alternate first
        if alternate_parse_zee:
            semantic = self.alternate_parse_zee(sentence, tokens, token_classifier, semantic, save, threshold)

        return semantic # result

    def alternate_parse_zee(self, sentence, tokens, token_classifier, semantic, save=False, threshold=5):
        result_tokens = copy.deepcopy(tokens)
        result_semantic = copy.deepcopy(semantic)

        if semantic["command"] in ["PDRE", "MGJ"] and not semantic["is_zee"] and "สี่" in sentence: # No zee in this command
            new_sentence = re.sub("สี่", "ซี่", sentence, 1) # replace the first occurance of สี่ with ซี่ 
            new_tokens = token_classifier.inference(new_sentence)
            new_semantic = self.parse(new_tokens, threshold=threshold)
            if new_semantic["is_zee"]:
                result_tokens = new_tokens
                result_semantic = new_semantic
        elif semantic["command"] in ["MO", "BOP"] and "สี่" in sentence:
            # index_four = self.find_first_tag_four_index(tokens)
            index_four = self.find_max_replacement_prob(tokens, semantic["command"])
            if index_four != -1:
                dist_four = self.distance_lastest_zee_token(tokens, self.prev_distant)

                new_tokens = copy.deepcopy(tokens)
                new_tokens[index_four][1] = "Zee"
                dist_zee = self.distance_lastest_zee_token(new_tokens, self.prev_distant)

                tokens.insert(0, ["", self.prev_token])
                new_tokens.insert(0, ["", self.prev_token])
                dist_four.insert(0, self.prev_distant)
                dist_zee.insert(0, self.prev_distant)
                index_four += 1


                # print("token_four", tokens)
                # print("token_zee", new_tokens)
                # print("dist_four", dist_four)
                # print("dist_zee", dist_zee)
                score = 1
                for idx in range(index_four, len(tokens)):
                    cur_tag = new_tokens[idx][1]
                    prev_tag = new_tokens[idx-1][1]
                    score *= self.get_prob_by_command(cur_tag, prev_tag, dist_zee[idx], semantic["command"]) # self.mo_prob.prob_tag_given_prev_tag_and_n(cur_tag, prev_tag, dist_zee[idx])

                    cur_tag = tokens[idx][1]
                    prev_tag = tokens[idx-1][1]
                    score /= self.get_prob_by_command(cur_tag, prev_tag, dist_four[idx], semantic["command"]) # self.mo_prob.prob_tag_given_prev_tag_and_n(cur_tag, prev_tag, dist_four[idx])

                if score > 1:
                    new_sentence = re.sub("สี่", "ซี่", sentence, 1) # replace the first occurance of สี่ with ซี่ 
                    result_tokens = token_classifier.inference(new_sentence)
                    result_semantic = self.parse(new_tokens, threshold=threshold)
            


        if save:
            self.prev_token = result_tokens[-1][1] if len(result_tokens) > 0 else "None"
            self.prev_distant = self.distance_lastest_zee_token(result_tokens, self.prev_distant)[-1] if len(result_tokens) > 0 else -1
            _ = self.parse(result_tokens, save=save, threshold=threshold)

        return result_semantic

    def find_first_tag_four_index(self, tags):
        for idx, tag in enumerate(tags):
            if tag[0] == "สี่" and tag[1] == "Number":
                return idx
        return -1

    def find_max_replacement_prob(self, tags, command):
        buf_tag = []
        result_idx = -1
        max_prob = -1
        for idx, tag in enumerate(tags):
            if tag[0] == "สี่" and tag[1] == "Number":
                dist = self.distance_lastest_zee_token(buf_tag+[["", "Zee"]], self.prev_distant)[-1]
                cur_tag = "Zee"
                prev_tag = tags[idx-1][1] if idx != 0 else self.prev_token
                prob = self.get_prob_by_command(cur_tag, prev_tag, dist, command) # self.mo_prob.prob_tag_given_prev_tag_and_n(cur_tag, prev_tag, dist)
                if  prob > max_prob:
                    max_prob = prob
                    result_idx = idx
            buf_tag.append(["", tag[1]])

        return result_idx

    def get_prob_by_command(self, cur_tag, prev_tag, dist, command):
        if command == "MO":
            return self.mo_prob.prob_tag_given_prev_tag_and_n(cur_tag, prev_tag, dist)
        elif command == "BOP":
            return self.bop_prob.prob_tag_given_prev_tag_and_n(cur_tag, prev_tag, dist)
        return NotImplementedError

    def distance_lastest_zee_token(self, tags, prev_distant):
        result = []
        COMMAND = ["PDRE", "MO", "MGJ", "BOP", "Missing"]
        for idx, tag in enumerate(tags):
            tag = tag[1]
            if tag in COMMAND:
                prev_distant = -1
            
            if prev_distant == -1 and tag != "Zee":
                result.append(-1)
            elif prev_distant == -1 and tag == "Zee":
                result.append(0)
            else:
                prev_distant += 1
                result.append(prev_distant)

            if tag == "Zee":
                prev_distant = 0

        return result


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
                    break

        result["is_zee"] = is_zee

        if save:
            self.semantic_object_list = new_semantic_object_list
            self.last_pdre_state = new_last_pdre_state
            self.last_symbol = False
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


from utils.ner_model_pb2 import NERResponse, Zee, CommandData, SemanticCommand

def create_ner_response(semantics):
    response = []
    for semantic in semantics:
        command = semantic.get("command", None)
        if command == "BOP":
            data = CommandData(
                        zee = create_zee(semantic.get("data", dict()).get("zee", None)),
                        tooth_side = semantic.get("data", dict()).get("tooth_side", None),
                        position = semantic.get("data", dict()).get("position", None),
                        is_number_PD = semantic.get("data", dict()).get("is_number_PD", None),
                        BOP_payload = semantic.get("data", dict()).get("payload", []),
                        missing = create_missing(semantic.get("data", dict()).get("missing", None)),
                    )
        else:
            data = CommandData(
                        zee = create_zee(semantic.get("data", dict()).get("zee", None)),
                        tooth_side = semantic.get("data", dict()).get("tooth_side", None),
                        position = semantic.get("data", dict()).get("position", None),
                        is_number_PD = semantic.get("data", dict()).get("is_number_PD", None),
                        payload = semantic.get("data", dict()).get("payload", 100),
                        missing = create_missing(semantic.get("data", dict()).get("missing", None)),
                    )
        is_complete = semantic.get("is_complete", True)
        semantic_command = SemanticCommand(command=command, data=data, is_complete=is_complete)
        response.append(semantic_command)
    return NERResponse(response=response)

def create_zee(list_zee):
    if list_zee is None:
        return None
    first_zee = None
    second_zee = None

    if len(list_zee) >= 1:
        first_zee = list_zee[0]
    if len(list_zee) == 2:
        second_zee = list_zee[1]
    
    
    return Zee(first_zee = first_zee, second_zee = second_zee)

def create_missing(list_missing):
    if list_missing is None:
        return None
    
    result = []
    for missing in list_missing:
        result.append(create_zee(missing))
    return result

def create_incomplete_semantic(command, tooth, tooth_side):
    return {
                "command": command,
                "data": {
                    "zee": tooth,
                    "tooth_side": tooth_side,
                },
                "is_complete": False
            }

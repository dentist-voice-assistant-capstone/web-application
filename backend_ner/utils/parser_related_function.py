import copy

MISSING = 'Missing'
PDRE = 'PDRE'
BOP = 'BOP'
MGJ = 'MGJ'
MO = 'MO'
EDIT = 'Edit'
ZEE = 'Zee'
YOK = 'Yok'
SYMBOL = 'Symbol'
BUCCAL = 'Buccal'
MESIAL = 'Mesial'
DISTAL = 'Distal'
LINGUAL = 'Lingual'

number_mapper = {'ศูนย์': 0, 'หนึ่ง': 1, 'สอง': 2, 'สาม': 3, 'สี่': 4, 'ห้า': 5, 'หก': 6, 'เจ็ด': 7, 'แปด': 8,
                 'เก้า': 9, 'สิบ': 10, 'สิบเอ็ด': 11, 'สิบสอง': 12, 'สิบสาม': 13, 'สิบสี่': 14, 'สิบห้า': 15,            
                 }

# Add vocabulary here
command_mapper = {MISSING: ['มิซซิ่ง', 'มิชซิ่ง', 'มิซชิ่ง', 'มิสซิ่ง', 'missing', 'miss ing'],
                  PDRE: ['พีดีอาร์อี', 'พีดีอาอี', 'พีดีอาร์อีร'],
                  BOP: ['บีโอพี', 'บีโอที', 'บีโอพีย'],
                  MGJ: ['เอ็มจีเจ', 'เอมจีเจ', 'เองจีเจ', 'เอ็มจีเจย'],
                  MO: ['เอ็มโอ', 'เอมโอ', 'เอ็มโอน'],
                  EDIT: ['แก้', 'แจ้', 'แก่', 'แค่', 'แก้อ่'],
                  ZEE: ['ซี่', 'ซี', 'ที่', 'จี้', 'ขี้', 'ซี่ย'],
                  YOK: ['โยก', 'ยก', 'โยค', 'โยกค'],
                  SYMBOL: ['ลบ'],
                  }

side_mapper = {'บัคเคิล': BUCCAL, 'บัคคอล': BUCCAL, 'บัคคัร': BUCCAL, 'บักคัล': BUCCAL,
               'มีเซี่ยว': MESIAL, 'มีเสี้ยว': MESIAL, 'มีเสี่ยว': MESIAL, 'มิเซี่ยว': MESIAL, 'มีเซี่ยวย': MESIAL,
               'ดิสทรัล': DISTAL, 'ดิสทอล': DISTAL, 'ดิสทัล': DISTAL, 'ดิสทรอล': DISTAL,
               'ลิงกวล': LINGUAL,'ลิงกัว': LINGUAL, 'ลิงเกิล': LINGUAL, 'ลิงโก้': LINGUAL, 'ลิงกลัว': LINGUAL,
               }

def editDistDP(str1, str2):
  # INPUT:  str1: first string
  #         str2: second string
  # OUTPUT: edit distance between first string and second string
  str1 = str1.replace(' ', '')
  str2 = str2.replace(' ', '')
  m = len(str1)
  n = len(str2)
  # Create a table to store results of subproblems
  dp = [[0 for _ in range(n + 1)] for _ in range(m + 1)]
  for i in range(m + 1):
    for j in range(n + 1):
      if i == 0:
        dp[i][j] = j
      elif j == 0:
        dp[i][j] = i
      elif str1[i-1] == str2[j-1]:
        dp[i][j] = dp[i-1][j-1]
      else:
        dp[i][j] = 1+min(dp[i][j-1], dp[i-1][j], dp[i-1][j-1])
  return dp[m][n]

def check_text_misspelling(word, related_word_list, threshold):
  # INPUT:  word: word that will be checked
  #         related_word_list: list that contains words that have the same meaning as this word
  #         threshold: maximum character error value
  # OUTPUT: return True if edit distance between this word and any word in 
  #         related_word_list is less than threshold value 
  for related_word in related_word_list:
    word_distance = editDistDP(word, related_word)
    if word_distance < threshold:
      return True
  return ''

def get_nearest_word(word, related_word_dict, threshold):
  # INPUT:  word: word that will be checked
  #         str2: second string
  #         threshold: maximum character error value
  # OUTPUT: return the word in related_word_dict value that closest to this word
  #         (minimum edit distance and less than threshold value)
  lowest_distance = len(word)
  nearest_word = ''
  for related_word in related_word_dict:
    word_distance = editDistDP(word, related_word)
    if word_distance < lowest_distance:
      nearest_word = related_word_dict[related_word]
      lowest_distance = word_distance
  if lowest_distance <= threshold:
    return nearest_word
  return ''

def create_result_list(sentence_list, threshold, have_symbol):
  # INPUT:  str1: first string
  #         str2: second string
  #         have_symbol: boolean check whether minus sign existed or not
  # OUTPUT: edit distance between first string and second string
  result = []
  for i in range(len(sentence_list)):
    word = sentence_list[i][0]
    entity = sentence_list[i][1]
    # 1. command: ['Missing', 'PDRE', 'BOP', 'MGJ', 'MO', 'Edit', 'Zee', 'Yok', 'Symbol']
    if entity in list(command_mapper.keys()):
      related_word_list = command_mapper[entity]
      # check if distance below threshold 
      if check_text_misspelling(word, related_word_list, threshold):
        if entity == SYMBOL:
          have_symbol = True
        else:
          result.append(entity)
    elif entity in ['Number', 'Side']:
      # 2. number: ['Number']
      if entity == 'Number':
        nearest_number = get_nearest_word(word, number_mapper, threshold)
        # merge symbol (-) with number
        if have_symbol == True:
          result.append(-1*nearest_number)
          have_symbol = False
        else:
          result.append(nearest_number)
      # 3. side: ['Side']
      elif entity == 'Side':
        nearest_side = get_nearest_word(word, side_mapper, threshold)
        result.append(nearest_side)
    else:
      print("Remove unwanted entity for word '"+word+"'.")
  # Remove ''
  new_result = []
  for i in range(len(result)):
    if result[i] != '':
      new_result.append(result[i])
  return new_result

def create_empty_semantic_object(command):
  # INPUT:  command: command that will be used to create empty semantic object
  # OUTPUT: empty semantic object with suitable parameter
  semantic_object = {'command': command}
  # 'Missing'
  if command == MISSING:
    semantic_object['data'] = {
        'missing': []
        }
  # ['PDRE', 'BOP', 'MGJ', 'MO', 'Edit']
  else:
    semantic_object['data'] = {
        'zee': None,
        'payload': None,
    }
    if command in [PDRE, BOP, EDIT]:
      semantic_object['data']['tooth_side'] = None # 'Buccal' or 'Lingual'
      # 'BOP'
      if command == BOP:
        semantic_object['data']['payload'] = [False, False, False] # [False, True, True]; For Q1, Q4: ['Distal', 'Buccal'/'Lingual', 'Mesial']
                                                                   # For Q2, Q3: ['Mesial', 'Buccal'/'Lingual', 'Distal']
      # 'PDRE'
      elif command == PDRE:
        semantic_object['data']['position'] = None # 'Mesial' or ['Lingual', 'Buccal'] or 'Distal'
        semantic_object['data']['is_number_PD'] = True # True or False
      # 'Edit'
      else:
        semantic_object['data']['position'] = None # 'Mesial' or ['Lingual', 'Buccal'] or 'Distal'
        semantic_object['data']['type'] = PDRE
  return semantic_object

def find_next_available_tooth(latest_semantic_object, available_teeth_dict, mode):
  # INPUT:  latest_semantic_object
  #         available_teeth_dict: dict that contains list of non-missing teeth in each quadrant
  #         mode: rev = reverse available_teeth_dict, not_rev = not reverse available_teeth_dict
  # OUTPUT: next teeth that nearest to current teeth
  latest_quadrant = latest_semantic_object['data']['zee'][0]
  old_index = available_teeth_dict[latest_quadrant].index(latest_semantic_object['data']['zee'])
  if old_index == -1:
    return None
  else:
    # Case 1: not cross to other quadrant
    if old_index+1 < len(available_teeth_dict[latest_quadrant]):
      return available_teeth_dict[latest_quadrant][old_index+1]
    # Case 2: cross to other quadrant and not exceed Q4
    elif old_index+1 >= len(available_teeth_dict[latest_quadrant]):
      if mode == 'not_rev':
        if latest_quadrant in [1, 3] and len(available_teeth_dict[latest_quadrant+1])!=0:
          return available_teeth_dict[latest_quadrant+1][0]
      elif mode == 'rev':
        if latest_quadrant in [2, 4] and len(available_teeth_dict[latest_quadrant-1])!=0:
          return available_teeth_dict[latest_quadrant-1][0]
  return None

def choose_start_tooth_position(semantic_object):
  # INPUT:  semantic_object
  # OUTPUT: appropriate start tooth position
  if semantic_object['data']['zee'] != None and len(semantic_object['data']['zee']) == 2 and semantic_object['data']['tooth_side'] != None:
    quadrant = semantic_object['data']['zee'][0]
    if (semantic_object['data']['tooth_side'] == BUCCAL and quadrant in [1, 3]) or (semantic_object['data']['tooth_side'] == LINGUAL and quadrant in [2, 4]):
      return DISTAL
    else:
      return MESIAL
  return None

def find_first_tooth_in_quadrant(available_teeth_dict):
  # INPUT:  available_teeth_dict: dict of available teeth
  # OUTPUT: list of first tooth in each quadrant (list[0] -> Q1)
  first_tooth_list = [None, None, None, None]
  for i in range(len(first_tooth_list)):
    if len(available_teeth_dict[i+1]) != 0:
      first_tooth_list[i] = available_teeth_dict[i+1][0]
  return first_tooth_list
  
def find_last_tooth_in_quadrant(available_teeth_dict):
  # INPUT:  available_teeth_dict: dict of available teeth
  # OUTPUT: list of last tooth in each quadrant (list[0] -> Q1)
  last_tooth_list = [None, None, None, None]
  for i in range(len(last_tooth_list)):
    if len(available_teeth_dict[i+1]) != 0:
      last_tooth_list[i] = available_teeth_dict[i+1][len(available_teeth_dict[i+1])-1]
  return last_tooth_list

def find_next_tooth_position(semantic_object, latest_semantic_object, using_available_teeth_dict, first_tooth_list, last_tooth_list):
  # INPUT:  semantic_object, latest_semantic_object, using_available_teeth_dict, first_tooth_list, last_tooth_list
  # OUTPUT: semantic_object
  quadrant = semantic_object['data']['zee'][0]
  find_tooth_mode = 'not_rev'
  edge_case = []
  tooth_position_arrange = [DISTAL, [BUCCAL, LINGUAL], MESIAL] # For Buccal: Q1 and Q3, For Lingual: Q2 and Q4
  if (semantic_object['data']['tooth_side'] == BUCCAL and quadrant in [2, 4]) or (semantic_object['data']['tooth_side'] == LINGUAL and quadrant in [1, 3]):
    tooth_position_arrange = [MESIAL, [BUCCAL, LINGUAL], DISTAL]
  # if 'position' != third position -> change only 'position', no need to change 'zee'
  if semantic_object['data']['position'] == tooth_position_arrange[0]:
    semantic_object['data']['position'] = semantic_object['data']['tooth_side']
  elif semantic_object['data']['position'] in tooth_position_arrange[1]:
    semantic_object['data']['position'] = tooth_position_arrange[2]
  # if 'position' == third position -> change 'position' and 'zee' to next tooth that does not missing
  elif semantic_object['data']['position'] == tooth_position_arrange[2]:
    semantic_object['data']['position'] = tooth_position_arrange[0]
    ## Special case
    if (semantic_object['data']['tooth_side'] == BUCCAL and quadrant in [1, 3]) or (semantic_object['data']['tooth_side'] == LINGUAL and quadrant in [2, 4]):
      if quadrant in [1, 3]:
        edge_case = [last_tooth_list[0], last_tooth_list[2]]
      elif quadrant in [2, 4]:
        find_tooth_mode = 'rev'
        edge_case = [first_tooth_list[1], first_tooth_list[3]]
      ### if tooth is on the middle ex. [1, 1]  [2, 1] -> change tooth position order and change mode find_next_available_tooth
      if semantic_object['data']['zee'] in edge_case:
        semantic_object['data']['position'] = MESIAL
      semantic_object['data']['zee'] = find_next_available_tooth(latest_semantic_object, using_available_teeth_dict, find_tooth_mode)
    elif (semantic_object['data']['tooth_side'] == BUCCAL and quadrant in [2, 4]) or (semantic_object['data']['tooth_side'] == LINGUAL and quadrant in [1, 3]):
      if quadrant in [1, 3]:
        edge_case = [first_tooth_list[0], first_tooth_list[2]]
      elif quadrant in [2, 4]:
        edge_case = [last_tooth_list[1], last_tooth_list[3]]
      ### if tooth is on the edge ex. [1, 8] or [3, 8] -> Change 'zee' to None
      if semantic_object['data']['zee'] in edge_case:
        semantic_object['data']['zee'] = None
      else:
        semantic_object['data']['zee'] = find_next_available_tooth(latest_semantic_object, using_available_teeth_dict, 'not_rev') 
  return semantic_object

def check_tooth_appopriate(semantic_object, available_teeth_dict):
  # INPUT:  semantic_object, latest_semantic_object, using_available_teeth_dict, first_tooth_list, last_tooth_list
  # OUTPUT: semantic_object
  quadrant = semantic_object['data']['zee'][0]
  if not(1<=quadrant<=4) or [quadrant, semantic_object['data']['zee'][1]] not in available_teeth_dict[quadrant]:
    print('Teeth '+str(semantic_object['data']['zee'])+' is not available. Please try again.')
    semantic_object['data']['zee'] = None
  else:
    if semantic_object['command'] == PDRE:
      semantic_object['data']['position'] = choose_start_tooth_position(semantic_object)
    elif semantic_object['command'] == EDIT:
      semantic_object['data']['payload'] = []
  return semantic_object

def append_zee_to_available_teeth_dict(zee, available_teeth_dict):
  # INPUT:  zee: tooth that you want to insert back to available_teeth_dict ex. [1, 4]
  #         available_teeth_dict: dict of available teeth
  # OUTPUT: available_teeth_dict
  quadrant = zee[0]
  # Append zee to the quadrant if not already exists
  if 1<=quadrant<=4:
    if zee not in available_teeth_dict[quadrant]:
      available_teeth_dict[quadrant].append(zee)
      # Sort value in that quardrant
      # Case 1: Q1 and Q3 -> sort by descending order
      if quadrant == 1 or quadrant == 3:
        available_teeth_dict[quadrant].sort(reverse=True) 
      else:
        available_teeth_dict[quadrant].sort()    
  return available_teeth_dict

def create_semantic_object(semantic_object_list, word_list, available_teeth_dict, last_pdre_state):
  # INPUT:  semantic_object_list: semantic object result list
  #         word_list: list of processed word from token classification model
  #         available_teeth_dict: list of available teeth in each quadrant
  #         last_pdre_state: semantic object of last PDRE command
  # OUTPUT: result_dict: dict contains 'command', 'zee', 'tooth_side', 'semantic_list' 

  result = []
  # get latest semantic object list if not empty
  if len(semantic_object_list) !=0 :
    latest_semantic_object = copy.deepcopy(semantic_object_list[len(semantic_object_list)-1])
  else:
    latest_semantic_object = {'command': None}
  
  bop_mapper = {1: {DISTAL: 0, BUCCAL: 1, LINGUAL: 1, MESIAL: 2},
                2: {MESIAL: 0, BUCCAL: 1, LINGUAL: 1, DISTAL: 2},
                3: {MESIAL: 0, BUCCAL: 1, LINGUAL: 1, DISTAL: 2},
                4: {DISTAL: 0, BUCCAL: 1, LINGUAL: 1, MESIAL: 2},} 

  first_tooth_list = find_first_tooth_in_quadrant(available_teeth_dict)
  last_tooth_list = find_last_tooth_in_quadrant(available_teeth_dict)

  # reversion of available_teeth_dict value in each quadrant
  rev_available_teeth_dict = {}
  for e in available_teeth_dict:
    rev_available_teeth_dict[e] = available_teeth_dict[e].copy()
    rev_available_teeth_dict[e].reverse()

  for i in range(len(word_list)):
    semantic_object = copy.deepcopy(latest_semantic_object)
    # 1. command -> Append new empty semantic object in result list
    # if word_list[i] in [PDRE, BOP, MGJ, MO, MISSING, EDIT]:
    if word_list[i] in [PDRE, BOP, MGJ, MO, MISSING]:
      semantic_object = copy.deepcopy(create_empty_semantic_object(word_list[i]))
      # 1.1 command = 'Edit'
      if word_list[i] == EDIT:
        # if latest command is pdre -> get latest tooth_side
        if latest_semantic_object['command'] == PDRE:
          semantic_object['data']['tooth_side'] = latest_semantic_object['data']['tooth_side']
    # 2. 'Zee'
    elif word_list[i] == ZEE:
      if semantic_object['command'] in [PDRE, BOP, MGJ, MO, EDIT]:
        semantic_object['data']['zee'] = []
        # Reset payload value for BOP command
        if semantic_object['command']==BOP:
          semantic_object['data']['payload'] = [False, False, False]
        # Reset payload value for other command
        else:
          semantic_object['data']['payload'] = None
    # 3. 'Side'
    elif word_list[i] in [BUCCAL, MESIAL, DISTAL, LINGUAL]:
      # 3.1 Side for 'PDRE'
      if semantic_object['command'] == PDRE:
        # 3.1.1 tooth_side not filled yet -> fill tooth_side and tooth position
        if semantic_object['data']['tooth_side'] == None and word_list[i] in [BUCCAL, LINGUAL]:
          semantic_object['data']['tooth_side'] = word_list[i]
          # Choose start tooth position based on tooth_side and quadrant
          semantic_object['data']['position'] = choose_start_tooth_position(semantic_object)
      # 3.2 Side for 'BOP'
      elif semantic_object['command'] == BOP:
        # 3.2.1 tooth_side not filled yet -> fill tooth_side first
        if semantic_object['data']['tooth_side'] == None and word_list[i] in [BUCCAL, LINGUAL]:
          semantic_object['data']['tooth_side'] = word_list[i]
        # 3.2.2 tooth_side and zee already filled -> can fill payload value
        elif semantic_object['data']['tooth_side'] != None and semantic_object['data']['zee'] != None and len(semantic_object['data']['zee'])==2:
          if (word_list[i] in [BUCCAL, LINGUAL] and semantic_object['data']['tooth_side'] == word_list[i]) or word_list[i] not in [BUCCAL, LINGUAL]:
            semantic_object['data']['payload'][bop_mapper[semantic_object['data']['zee'][0]][word_list[i]]] = True
      # 3.3 Side for 'Edit'
      elif semantic_object['command'] == EDIT:
        semantic_object['data']['position'] = word_list[i]
        semantic_object['data']['payload'] = []
    # 4. 'Yok' -> do nothing
    # 5. 'Number'
    elif word_list[i] not in [YOK, EDIT]: 
      # 5.1 Number for 'Missing' 
      if semantic_object['command'] == MISSING:
        # 5.1.1 missing = []
        if len(semantic_object['data']['missing']) == 0:
          semantic_object['data']['missing'].append([word_list[i], None])
        # 5.1.2 missing = [[1, None], ...]
        elif len(semantic_object['data']['missing']) != 0 and semantic_object['data']['missing'][len(semantic_object['data']['missing'])-1][1] == None:
          semantic_object['data']['missing'][len(semantic_object['data']['missing'])-1][1] = word_list[i]
          latest_zee = semantic_object['data']['missing'][len(semantic_object['data']['missing'])-1]
          quadrant = latest_zee[0]
          if 1<=quadrant<=4 and latest_zee in available_teeth_dict[quadrant]:
            # Remove this tooth from available_teeth_dict
            available_teeth_dict[quadrant].remove(latest_zee)
            # Find new first and last tooth list
            first_tooth_list = find_first_tooth_in_quadrant(available_teeth_dict)
            last_tooth_list = find_last_tooth_in_quadrant(available_teeth_dict)
          else:
            # Remove unavailable teeth (last element) from missing list
            print('Teeth '+str(latest_zee)+' is not available. Please try again.')
            semantic_object['data']['missing'].pop()
        # 5.1.3 missing = [[1, 2], ...]
        elif len(semantic_object['data']['missing']) != 0 and semantic_object['data']['missing'][len(semantic_object['data']['missing'])-1][1] != None:
          semantic_object['data']['missing'].append([word_list[i], None])
      # 5.2 Number for 'PDRE'
      elif semantic_object['command'] == PDRE:
        # 5.2.1 zee not filled yet and in range 1-4 and 1-8 -> fill zee first
        if semantic_object['data']['zee'] != None and len(semantic_object['data']['zee']) < 2:
          semantic_object['data']['zee'].append(word_list[i])
          # if zee completely filled -> Choose start tooth position based on tooth_side and quadrant
          if len(semantic_object['data']['zee']) == 2:
            semantic_object = check_tooth_appopriate(semantic_object, available_teeth_dict)
        # 5.2.2 zee and tooth_side already filled -> can fill payload value
        elif semantic_object['data']['zee'] != None and len(semantic_object['data']['zee']) == 2 and semantic_object['data']['tooth_side'] != None:
          # choose appropriate available_teeth_dict
          if semantic_object['data']['tooth_side'] == BUCCAL:
            using_available_teeth_dict = available_teeth_dict
          elif semantic_object['data']['tooth_side'] == LINGUAL:
            using_available_teeth_dict = rev_available_teeth_dict
          # 5.2.2.1 if number already filled in payload -> move to next teeth side/ value
          if semantic_object['data']['payload'] != None:
            # 5.2.2.1.1 if 'is_number_PD' == True -> change to False (for RE value)
            if semantic_object['data']['is_number_PD']:
              semantic_object['data']['is_number_PD'] = False
            # 5.2.2.1.2 if 'is_number_PD' == False -> change to True (for PD value) and change 'position'
            else:
              semantic_object['data']['is_number_PD'] = True
              semantic_object = find_next_tooth_position(semantic_object, latest_semantic_object, using_available_teeth_dict, first_tooth_list, last_tooth_list)
          # Fill the current payload
          semantic_object['data']['payload'] = word_list[i]
      # 5.3 Number for ['MGJ', 'BOP', 'MO', 'Edit']
      elif semantic_object['command'] in [MGJ, BOP, MO, EDIT]:
        # 5.3.1 zee not filled yet -> fill zee first
        if semantic_object['data']['zee'] != None and len(semantic_object['data']['zee']) < 2:
          semantic_object['data']['zee'].append(word_list[i])
          if len(semantic_object['data']['zee']) == 2:
            semantic_object = check_tooth_appopriate(semantic_object, available_teeth_dict) 
        # 5.3.2 zee already filled -> can fill payload value according to each command
        elif semantic_object['data']['zee'] != None and len(semantic_object['data']['zee']) == 2:
          # 5.3.2.1 MGJ
          if semantic_object['command'] == MGJ:
            ## Number already filled in payload -> move to next teeth side
            if semantic_object['data']['payload'] != None:
              semantic_object['data']['zee'] = find_next_available_tooth(latest_semantic_object, available_teeth_dict, 'not_rev')
            ## Fill the current payload
            semantic_object['data']['payload'] = word_list[i]
          # 5.3.2.2 MO: Fill the current payload
          elif semantic_object['command'] == MO:
            if semantic_object['data']['payload'] == None:
              semantic_object['data']['payload'] = word_list[i]
          # 5.3.2.3 Edit: Fill the current payload
          elif semantic_object['command'] == EDIT:    
            if semantic_object['data']['tooth_side'] != None and semantic_object['data']['payload'] != None and len(semantic_object['data']['payload']) != 2:
              semantic_object['data']['payload'].append(word_list[i])
      
    # Append semantic object to result list
    # if semantic got updated -> append to the result
    if semantic_object != latest_semantic_object:
      semantic_object_list.append(semantic_object)
      result.append(semantic_object)
    latest_semantic_object = copy.deepcopy(semantic_object)
    # if payload completely filled -> append latest pdre semantic in to result list
    if semantic_object['command']==EDIT and semantic_object['data']['payload']!=None and len(semantic_object['data']['payload'])==2:
      for j in range(len(semantic_object_list)):
        if semantic_object_list[len(semantic_object_list)-j-1]['command']==PDRE:
          last_pdre_state = copy.deepcopy(semantic_object_list[len(semantic_object_list)-j-1])
          latest_semantic_object = copy.deepcopy(semantic_object_list[len(semantic_object_list)-j-1])
          semantic_object_list.append(last_pdre_state)
          break
  
  # get 'command', 'zee', 'tooth_side' for result_dict
  command = None
  zee = None
  tooth_side = None
  if len(semantic_object_list) != 0:
    last_s_object = semantic_object_list[len(semantic_object_list)-1]
    command = last_s_object['command']
    if 'data' in last_s_object.keys():
      if 'zee' in last_s_object['data'].keys() and last_s_object['data']['zee']!=None:
        if len(last_s_object['data']['zee'])==2:
          zee = last_s_object['data']['zee']
      if 'tooth_side' in last_s_object['data'].keys():
        tooth_side = last_s_object['data']['tooth_side']
      # special for 'Missing' case
      if 'missing' in last_s_object['data'].keys():
        missing_list = last_s_object['data']['missing']
        if len(missing_list)!=0:
          if None not in missing_list[len(missing_list)-1]:
            zee = missing_list[len(missing_list)-1]
          else:
            if len(missing_list) >= 2:
              zee = missing_list[len(missing_list)-2]
            
  # Remove incompleted semantic object from result
  new_result = copy.deepcopy(result)
  for i in range(len(result)):
    if result[i]['command'] == None:
      new_result.remove(result[i])
    if 'data' in result[i].keys() and result[i] in new_result:
      if (None in result[i]['data'].values() or [] in result[i]['data'].values()): 
        new_result.remove(result[i])
      # Not 'Missing' command
      elif 'zee' in result[i]['data'].keys() and len(result[i]['data']['zee'])==1:
        new_result.remove(result[i])
      # 'Missing' command
      if 'missing' in result[i]['data'].keys():
        for e in result[i]['data']['missing']:
          if None in e:
            new_result.remove(result[i])
      # special for 'Edit' case
      if result[i]['command'] == 'Edit':
        if isinstance(result[i]['data']['payload'], list):
          if len(result[i]['data']['payload'])!=2 and result[i] in new_result:
            new_result.remove(result[i])

  ## BOP special
  final_result = copy.deepcopy(new_result)
  latest_zee = [None, None]
  for k in range(len(new_result)-1, -1, -1):
    if new_result[k]['command'] == BOP:
      if new_result[k]['data']['zee'] != latest_zee:
        latest_zee = new_result[k]['data']['zee']
      else:
        final_result.remove(new_result[k])
  
  result_dict = {'command': command,
                 'tooth': zee,
                 'tooth_side': tooth_side,
                 'semantic_list': final_result,
                 }
  return result_dict
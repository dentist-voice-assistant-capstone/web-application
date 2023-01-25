import copy

# Semantic Parser model
number_mapper = {'ศูนย์': 0,
                 'หนึ่ง': 1,
                 'สอง': 2,
                 'สาม': 3,
                 'สี่': 4,
                 'ห้า': 5,
                 'หก': 6,
                 'เจ็ด': 7,
                 'แปด': 8,
                 'เก้า': 9,
                 'สิบ': 10,
                 'สิบเอ็ด': 11,
                 'สิบสอง': 12,
                 'สิบสาม': 13,
                 'สิบสี่': 14,
                 'สิบห้า': 15,            
                 }

# Add vocabulary here
command_mapper = {'Missing': ['missing', 'มิซซิ่ง'],
                  'PDRE': ['พีดีอาร์อี'],
                  'BOP': ['บีโอพี'],
                  'MGJ': ['เอ็มจีเจ'],
                  'MO': ['เอ็มโอ'],
                  'Edit': ['แก้'],
                  'Zee': ['ซี่'],
                  'Yok': ['โยก'],
                  'Symbol': ['ลบ'],
                  }

side_mapper = {'บัคคอล': 'Buccal',
               'มีเซี่ยว': 'Mesial',
               'ดิสทรัล': 'Distal',
               'ลิงกวล': 'Lingual',
               }

def editDistDP(str1, str2):
  # INPUT:  str1: first string
  #         str2: second string
  # OUTPUT: edit distance between first string and second string

  # Remove space in each string 
  str1 = str1.replace(' ', '')
  str2 = str2.replace(' ', '')
  m = len(str1)
  n = len(str2)

  # Create a table to store results of subproblems
  dp = [[0 for x in range(n + 1)] for x in range(m + 1)]
 
  # Fill d[][] in bottom up manner
  for i in range(m + 1):
    for j in range(n + 1):
      # If first string is empty, only option is to
      # insert all characters of second string
      if i == 0:
        dp[i][j] = j    # Min. operations = j
 
      # If second string is empty, only option is to
      # remove all characters of second string
      elif j == 0:
        dp[i][j] = i    # Min. operations = i
 
      # If last characters are same, ignore last char
      # and recur for remaining string
      elif str1[i-1] == str2[j-1]:
        dp[i][j] = dp[i-1][j-1]
 
      # If last character are different, consider all
      # possibilities and find minimum
      else:
        dp[i][j] = 1 + min(dp[i][j-1],        # Insert
                           dp[i-1][j],        # Remove
                           dp[i-1][j-1])    # Replace
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

  # initial lowest distance
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

  # Normal check
  result = []
  for i in range(len(sentence_list)):
    word = sentence_list[i][0]
    entity = sentence_list[i][1]
    # 1. command: ['Missing', 'PDRE', 'BOP', 'MGJ', 'MO', 'Edit', 'Zee', 'Yok', 'Symbol']
    if entity in list(command_mapper.keys()):
      related_word_list = command_mapper[entity]
      # check if distance below threshold 
      if check_text_misspelling(word, related_word_list, threshold):
        if entity == 'Symbol':
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
    if result[i]!='':
      new_result.append(result[i])
  return new_result

def create_empty_semantic_object(command):
  # INPUT:  command: command that will be used to create empty semantic object
  # OUTPUT: empty semantic object with suitable parameter

  semantic_object = {'command': command}
  # 'Missing'
  if command=='Missing':
    semantic_object['data'] = {
        'missing': []
        }
  # ['PDRE', 'BOP', 'MGJ', 'MO', 'Edit']
  else:
    semantic_object['data'] = {
        'zee': None,
        'payload': None,
    }
    if command in ['PDRE', 'BOP', 'Edit']:
      semantic_object['data']['tooth_side'] = None # 'Buccal' or 'Lingual'
      # 'BOP'
      if command=='BOP':
        semantic_object['data']['payload'] = [False, False, False] # [False, True, True]; For Q1, Q4: ['Distal', 'Buccal'/'Lingual', 'Mesial']
                                                                  # For Q2, Q3: ['Mesial', 'Buccal'/'Lingual', 'Distal']
      # 'PDRE'
      elif command=='PDRE':
        semantic_object['data']['position'] = None # 'Mesial' or ['Lingual', 'Buccal'] or 'Distal'
        semantic_object['data']['is_number_PD'] = True # True or False
      # 'Edit'
      else:
        semantic_object['data']['position'] = None # 'Mesial' or ['Lingual', 'Buccal'] or 'Distal'
        semantic_object['data']['type'] = 'PDRE' # 'PDRE'
  return semantic_object

# def create_error_semantic_object(invalid_word):
#   semantic_object = { 'command': 'Error'}
#   semantic_object['data'] = {
#       'message': 'Invalid word '+invalid_word+' is not used in the flow.'
#    } 
#   return semantic_object

def find_next_available_tooth(latest_semantic_object, available_teeth_dict, mode):
  # INPUT:  latest_semantic_object
  #         available_teeth_dict: dict that contains list of non-missing teeth in each quadrant
  #         mode: rev = reverse available_teeth_dict, not_rev = not reverse available_teeth_dict
  # OUTPUT: next teeth that nearest to current teeth

  latest_quadrant = latest_semantic_object['data']['zee'][0]
  if latest_semantic_object['data']['zee'] not in available_teeth_dict[latest_quadrant]:
    print('Teeth not available.')
    return 'Error'
  old_index = available_teeth_dict[latest_quadrant].index(latest_semantic_object['data']['zee'])
  if old_index == -1:
    print('Teeth not available.')
    return 'Error'
  else:
    # Case 1: not cross to other quadrant
    if old_index+1 < len(available_teeth_dict[latest_quadrant]):
      return available_teeth_dict[latest_quadrant][old_index+1]
    # Case 2: cross to other quadrant and not exceed Q4
    elif old_index+1 >= len(available_teeth_dict[latest_quadrant]):
      if mode=='not_rev':
        if latest_quadrant < 4:
          return available_teeth_dict[latest_quadrant+1][0]
      elif mode=='rev':
        if latest_quadrant > 1:
          return available_teeth_dict[latest_quadrant-1][0]
  return 'Error'

def choose_start_tooth_position(semantic_object):
  # INPUT:  semantic_object
  # OUTPUT: appropriate start tooth position

  if semantic_object['data']['zee'] != None and len(semantic_object['data']['zee'])==2 and semantic_object['data']['tooth_side']!=None:
    if (semantic_object['data']['tooth_side']=='Buccal' and semantic_object['data']['zee'][0] in [1, 3]) \
      or (semantic_object['data']['tooth_side']=='Lingual' and semantic_object['data']['zee'][0] in [2, 4]):
      return 'Distal'
    else:
      return 'Mesial'
  return None

def create_semantic_object(semantic_object_list, word_list, available_teeth_dict, last_pdre_state):
  # INPUT:  semantic_object_list: semantic object result list
  #         word_list: list of processed word from token classification model
  #         available_teeth_dict: list of available teeth in each quadrant
  #         last_pdre_state: semantic object of last PDRE command
  # OUTPUT: new_result: list contains preprocessed and updated semantic object

  result = []

  # get latest semantic object list if not empty
  if len(semantic_object_list)!=0:
    latest_semantic_object = semantic_object_list[len(semantic_object_list)-1]
  else:
    latest_semantic_object = {'command': None}
  
  bop_mapper = {1: {'Distal': 0, 'Buccal': 1, 'Lingual': 1, 'Mesial': 2},
                2: {'Mesial': 0, 'Buccal': 1, 'Lingual': 1, 'Distal': 2},
                3: {'Mesial': 0, 'Buccal': 1, 'Lingual': 1, 'Distal': 2},
                4: {'Distal': 0, 'Buccal': 1, 'Lingual': 1, 'Mesial': 2},} 

  first_q1_tooth = None
  first_q2_tooth = None
  first_q3_tooth = None
  first_q4_tooth = None

  last_q1_tooth = None
  last_q2_tooth = None
  last_q3_tooth = None
  last_q4_tooth = None

  if len(available_teeth_dict[1])!=0:
    first_q1_tooth = available_teeth_dict[1][0]
    last_q1_tooth = available_teeth_dict[1][len(available_teeth_dict[1])-1]
  if len(available_teeth_dict[2])!=0:
    first_q2_tooth = available_teeth_dict[2][0]
    last_q2_tooth = available_teeth_dict[2][len(available_teeth_dict[2])-1]
  if len(available_teeth_dict[3])!=0:
    first_q3_tooth = available_teeth_dict[3][0]
    last_q3_tooth = available_teeth_dict[3][len(available_teeth_dict[3])-1]
  if len(available_teeth_dict[4])!=0:
    first_q4_tooth = available_teeth_dict[4][0]
    last_q4_tooth = available_teeth_dict[4][len(available_teeth_dict[4])-1]

  # reversion of available_teeth_dict value in each quadrant
  rev_available_teeth_dict = {}
  for e in available_teeth_dict:
    rev_available_teeth_dict[e] = available_teeth_dict[e].copy()
    rev_available_teeth_dict[e].reverse()

  for i in range(len(word_list)):
    semantic_object = copy.deepcopy(latest_semantic_object)
    # 1. command -> Append new empty semantic object in result list
    if word_list[i] in ['PDRE', 'BOP', 'MGJ', 'MO', 'Missing', 'Edit']:
      semantic_object = copy.deepcopy(create_empty_semantic_object(word_list[i]))
      # 1.1 command = 'Edit'
      if word_list[i] == 'Edit':
        # if latest command is pdre -> get latest tooth_side
        if latest_semantic_object['command'] == 'PDRE':
          semantic_object['data']['tooth_side'] = latest_semantic_object['data']['tooth_side']
    # 2. 'Zee'
    elif word_list[i] == 'Zee':
      if semantic_object['command'] in ['PDRE', 'BOP', 'MGJ', 'MO', 'Edit']:
        semantic_object['data']['zee'] = []
        # Reset payload value for BOP command
        if semantic_object['command']=='BOP':
          semantic_object['data']['payload'] = [False, False, False]
        # Reset payload value for other command
        else:
          semantic_object['data']['payload'] = None
    # 3. 'Side'
    elif word_list[i] in ['Buccal', 'Mesial', 'Distal', 'Lingual']:
      # 3.1 Side for 'PDRE'
      if semantic_object['command']=='PDRE':
        # 3.1.1 tooth_side not filled yet -> fill tooth_side and tooth position
        if semantic_object['data']['tooth_side']==None and word_list[i] in ['Buccal', 'Lingual']:
          semantic_object['data']['tooth_side'] = word_list[i]
          # Choose start tooth position based on tooth_side and quadrant
          semantic_object['data']['position'] = choose_start_tooth_position(semantic_object)
      # 3.2 Side for 'BOP'
      elif semantic_object['command']=='BOP':
        # 3.2.1 tooth_side not filled yet -> fill tooth_side first
        if semantic_object['data']['tooth_side']==None and word_list[i] in ['Buccal', 'Lingual']:
          semantic_object['data']['tooth_side'] = word_list[i]
        # 3.2.2 tooth_side and zee already filled -> can fill payload value
        elif semantic_object['data']['tooth_side']!=None and semantic_object['data']['zee']!=None and len(semantic_object['data']['zee'])==2:
          if (word_list[i] in ['Buccal', 'Lingual'] and semantic_object['data']['tooth_side'] == word_list[i]) or \
            (word_list[i] not in ['Buccal', 'Lingual']):
            semantic_object['data']['payload'][bop_mapper[semantic_object['data']['zee'][0]][word_list[i]]] = not semantic_object['data']['payload'][bop_mapper[semantic_object['data']['zee'][0]][word_list[i]]]
      # 3.3 Side for 'Edit'
      elif semantic_object['command']=='Edit':
        semantic_object['data']['position'] = word_list[i]
        semantic_object['data']['payload'] = []
    # 4. 'Yok'
    elif word_list[i] == 'Yok':
      continue
    # 5. 'Number'
    else: 
      # 5.1 Number for 'Missing' 
      if semantic_object['command']=='Missing':
        # 5.1.1 missing = []
        if len(semantic_object['data']['missing'])==0:
          if 1<=word_list[i]<=4:
            semantic_object['data']['missing'].append([word_list[i], None])
          else:
            print('Wrong input '+str(word_list[i])+' for Missing command. Please try again.')
        # 5.1.2 missing = [[1, None], ...]
        elif len(semantic_object['data']['missing'])!=0 and semantic_object['data']['missing'][len(semantic_object['data']['missing'])-1][1]==None:
          if 1<=word_list[i]<=8:
            semantic_object['data']['missing'][len(semantic_object['data']['missing'])-1][1] = word_list[i]
            # Remove this tooth from available_teeth_dict
            latest_quadrant = semantic_object['data']['missing'][len(semantic_object['data']['missing'])-1][0]
            if [latest_quadrant, word_list[i]] in available_teeth_dict[latest_quadrant]:
              available_teeth_dict[latest_quadrant].remove([latest_quadrant, word_list[i]])
          else:
            print('Wrong input '+str(word_list[i])+' for Missing command. Please try again.')
        # 5.1.3 missing = [[1, 2], ...]
        elif len(semantic_object['data']['missing'])!=0 and semantic_object['data']['missing'][len(semantic_object['data']['missing'])-1][1]!=None:
          if 1<=word_list[i]<=4:
            semantic_object['data']['missing'].append([word_list[i], None])
          else:
            print('Wrong input '+str(word_list[i])+' for Missing command. Please try again.')
      # 5.2 Number for 'PDRE'
      elif semantic_object['command']=='PDRE':
        # 5.2.1 zee not filled yet and in range 1-4 and 1-8 -> fill zee first
        if semantic_object['data']['zee']!=None and ((len(semantic_object['data']['zee'])==0 and 1<=word_list[i]<=4) or (len(semantic_object['data']['zee'])==1 and 1<=word_list[i]<=8)):
          semantic_object['data']['zee'].append(word_list[i])
          # if zee completely filled -> Choose start tooth position based on tooth_side and quadrant
          if len(semantic_object['data']['zee'])==2:
              semantic_object['data']['position'] = choose_start_tooth_position(semantic_object)
        # 5.2.2 zee and tooth_side already filled -> can fill payload value
        elif semantic_object['data']['zee']!=None and len(semantic_object['data']['zee'])==2 and semantic_object['data']['tooth_side']!=None:
          latest_quadrant = latest_semantic_object['data']['zee'][0]
          # choose appropriate available_teeth_dict
          if semantic_object['data']['tooth_side'] == 'Buccal':
            using_available_teeth_dict = available_teeth_dict
          elif semantic_object['data']['tooth_side'] == 'Lingual':
            using_available_teeth_dict = rev_available_teeth_dict
          # 5.2.2.1 if number already filled in payload -> move to next teeth side/ value
          if semantic_object['data']['payload']!=None:
            # 5.2.2.1.1 if 'is_number_PD' == True -> change to False (for RE value)
            if semantic_object['data']['is_number_PD']:
              semantic_object['data']['is_number_PD'] = False
            # 5.2.2.1.2 if 'is_number_PD' == False -> change to True (for PD value) and change 'position'
            else:
              semantic_object['data']['is_number_PD'] = True
              # Q1 and Q3
              if semantic_object['data']['zee'][0] == 1 or semantic_object['data']['zee'][0] == 3:
                ## Buccal side
                if semantic_object['data']['tooth_side'] == 'Buccal':
                  ###  if 'position' != 'Mesial' -> change only 'position', no need to change 'zee'
                  if semantic_object['data']['position'] == 'Distal':
                    semantic_object['data']['position'] = semantic_object['data']['tooth_side']
                  elif semantic_object['data']['position'] == 'Buccal' or semantic_object['data']['position'] == 'Lingual':
                    semantic_object['data']['position'] = 'Mesial'
                  ### if 'position' == 'Mesial' -> change 'position' and 'zee' to next tooth that does not missing
                  elif semantic_object['data']['position'] == 'Mesial':
                    semantic_object['data']['position'] = 'Distal'
                    #### Special Case: if tooth is on the middle ex. [1, 1] or [3, 1] -> change tooth position order
                    if semantic_object['data']['zee'] in [last_q1_tooth, last_q3_tooth]:
                      semantic_object['data']['position'] = 'Mesial'
                    semantic_object['data']['zee'] = find_next_available_tooth(latest_semantic_object, using_available_teeth_dict, 'not_rev')
                ## Lingual side
                elif semantic_object['data']['tooth_side'] == 'Lingual':
                  ### if 'position' != 'Distal' -> change only 'position', no need to change 'zee'
                  if semantic_object['data']['position'] == 'Mesial':
                    semantic_object['data']['position'] = semantic_object['data']['tooth_side']
                  elif semantic_object['data']['position'] == 'Buccal' or semantic_object['data']['position'] == 'Lingual':
                    semantic_object['data']['position'] = 'Distal'
                  ### if 'position' == 'Distal' -> change 'position' and 'zee' to next tooth that does not missing
                  elif semantic_object['data']['position'] == 'Distal':
                    semantic_object['data']['position'] = 'Mesial'
                    #### Special Case: if tooth is on the edge ex. [1, 8] or [3, 8] -> return payload on that tooth 
                    if semantic_object['data']['zee'] in [first_q1_tooth, first_q3_tooth]:
                      semantic_object['data']['zee'] = latest_semantic_object['data']['zee'].copy()
                    else:
                      semantic_object['data']['zee'] = find_next_available_tooth(latest_semantic_object, using_available_teeth_dict, 'not_rev')     
              # Q2 and Q4
              elif semantic_object['data']['zee'][0] == 2 or semantic_object['data']['zee'][0] == 4:
                ## Buccal side
                if semantic_object['data']['tooth_side'] == 'Buccal':
                  ### if 'position' != 'Distal' -> change only 'position', no need to change 'zee'
                  if semantic_object['data']['position'] == 'Mesial':
                    semantic_object['data']['position'] = semantic_object['data']['tooth_side']
                  elif semantic_object['data']['position'] == 'Buccal' or semantic_object['data']['position'] == 'Lingual':
                    semantic_object['data']['position'] = 'Distal'
                  ### if 'position' == 'Distal' -> change 'position' and 'zee' to next tooth that does not missing
                  elif semantic_object['data']['position'] == 'Distal':
                    semantic_object['data']['position'] = 'Mesial'
                    #### Special Case: if tooth is on the edge ex. [2, 8] or [4, 8] -> change tooth_side and reverse using_available_teeth_dict
                    if semantic_object['data']['zee'] in [last_q2_tooth, last_q4_tooth]:
                      # change tooth side
                      semantic_object['data']['position'] = 'Distal'
                      semantic_object['data']['tooth_side'] = 'Lingual'
                      using_available_teeth_dict = rev_available_teeth_dict
                    else:
                      semantic_object['data']['zee'] = find_next_available_tooth(latest_semantic_object, using_available_teeth_dict, 'not_rev')
                ## Lingual side
                elif semantic_object['data']['tooth_side'] == 'Lingual':
                  ### if 'position' != 'Mesial' -> change only 'position', no need to change 'zee'
                  if semantic_object['data']['position'] == 'Distal':
                    semantic_object['data']['position'] = semantic_object['data']['tooth_side']
                  elif semantic_object['data']['position'] == 'Buccal' or semantic_object['data']['position'] == 'Lingual':
                    semantic_object['data']['position'] = 'Mesial'
                  ### if 'position' == 'Mesial' -> change 'position' and 'zee' to next tooth that does not missing
                  elif semantic_object['data']['position'] == 'Mesial':
                    semantic_object['data']['position'] = 'Distal'
                    #### Special Case: if tooth is on the middle ex. [2, 1] or [4, 1] -> change tooth position order and change mode find_next_available_tooth
                    if semantic_object['data']['zee'] in [first_q2_tooth, first_q4_tooth]:
                      semantic_object['data']['position'] = 'Mesial'
                    semantic_object['data']['zee'] = find_next_available_tooth(latest_semantic_object, using_available_teeth_dict, 'rev')
          # Fill the current payload
          semantic_object['data']['payload'] = word_list[i]
      # 5.3 Number for 'MGJ'
      elif semantic_object['command']=='MGJ':
        # 5.3.1 zee not filled yet -> fill zee first
        if semantic_object['data']['zee']!=None and ((len(semantic_object['data']['zee'])==0 and 1<=word_list[i]<=4) or (len(semantic_object['data']['zee'])==1 and 1<=word_list[i]<=8)):
          semantic_object['data']['zee'].append(word_list[i])
        # 5.3.2 zee  already filled -> can fill payload value
        elif semantic_object['data']['zee']!=None and len(semantic_object['data']['zee'])==2:
          # 5.3.2.1 Number already filled in payload -> move to next teeth side
          if semantic_object['data']['payload']!=None:
            semantic_object['data']['zee'] = find_next_available_tooth(latest_semantic_object, available_teeth_dict, 'not_rev')
          # Fill the current payload
          semantic_object['data']['payload'] = word_list[i]
      # 5.4 Number for 'BOP'
      elif semantic_object['command']=='BOP':
        # 5.4.1 zee not filled yet -> fill zee first
        if semantic_object['data']['zee']!=None and ((len(semantic_object['data']['zee'])==0 and 1<=word_list[i]<=4) or (len(semantic_object['data']['zee'])==1 and 1<=word_list[i]<=8)):
          semantic_object['data']['zee'].append(word_list[i])
      # 5.5 Number for 'MO'
      elif semantic_object['command']=='MO':
        # 5.5.1 zee not filled yet -> fill zee first
        if semantic_object['data']['zee']!=None and ((len(semantic_object['data']['zee'])==0 and 1<=word_list[i]<=4) or (len(semantic_object['data']['zee'])==1 and 1<=word_list[i]<=8)):
          semantic_object['data']['zee'].append(word_list[i])
        elif semantic_object['data']['zee']!=None and len(semantic_object['data']['zee'])==2 and semantic_object['data']['payload']==None:
          semantic_object['data']['payload'] = word_list[i]
      # 5.6 Number for 'Edit'
      elif semantic_object['command']=='Edit':
        # 5.6.1 zee not filled yet -> fill zee first
        if semantic_object['data']['zee']!=None and ((len(semantic_object['data']['zee'])==0 and 1<=word_list[i]<=4) or (len(semantic_object['data']['zee'])==1 and 1<=word_list[i]<=8)):
          semantic_object['data']['zee'].append(word_list[i])
          if len(semantic_object['data']['zee'])==2:
            semantic_object['data']['payload'] = []
        elif semantic_object['data']['zee']!=None and len(semantic_object['data']['zee'])==2 and semantic_object['data']['tooth_side']!=None \
         and semantic_object['data']['type']!=None and semantic_object['data']['payload']!=None and len(semantic_object['data']['payload'])!=2:
          semantic_object['data']['payload'].append(word_list[i])

    # Append semantic object to result list
    latest_semantic_object = copy.deepcopy(semantic_object)
    semantic_object_list.append(semantic_object)
    result.append(semantic_object)
    # if payload completely filled -> append latest pdre semantic in to result list
    if semantic_object['command']=='Edit' and semantic_object['data']['payload']!=None and len(semantic_object['data']['payload'])==2:
      for j in range(len(semantic_object_list)):
        if semantic_object_list[len(semantic_object_list)-j-1]['command']=='PDRE':
          last_pdre_state = copy.deepcopy(semantic_object_list[len(semantic_object_list)-j-1])
          latest_semantic_object = copy.deepcopy(semantic_object_list[len(semantic_object_list)-j-1])
          semantic_object_list.append(last_pdre_state)
          result.append(semantic_object)
          break
  
  # Remove incompleted semantic object from result
  new_result = copy.deepcopy(result)
  for s_object in result:
    if s_object['command'] == None:
      new_result.remove(s_object)
    if 'data' in s_object.keys():
      if (None in s_object['data'].values() or [] in s_object['data'].values()):
        new_result.remove(s_object)
      # Not 'Missing' command
      elif 'zee' in s_object['data'].keys() and len(s_object['data']['zee'])==1:
        new_result.remove(s_object)
      if 'missing' in s_object['data'].keys():
        for e in s_object['data']['missing']:
          if None in e:
            new_result.remove(s_object)
  ## BOP special
  final_result = copy.deepcopy(new_result)
  latest_zee = [None, None]
  for k in range(len(new_result)-1, -1, -1):
    if new_result[k]['command'] == 'BOP':
      if new_result[k]['data']['zee'] != latest_zee:
        latest_zee = new_result[k]['data']['zee']
      else:
        final_result.remove(new_result[k])
  return final_result
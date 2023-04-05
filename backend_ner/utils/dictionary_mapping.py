import pandas as pd
import re

class DictionaryMapping:
  def __init__(self, dictionary_path):
    self.dict = pd.read_csv(dictionary_path)
    self.dict["Wrong transcript"] = self.dict["Wrong transcript"].apply(lambda transcripts: transcripts.split(", "))

  def normalize(self, text):
    for idx, data in self.dict.iterrows():
      correct, wrong_list = data
      for wrong in wrong_list:
        text = re.sub(wrong, correct, text)
    return text

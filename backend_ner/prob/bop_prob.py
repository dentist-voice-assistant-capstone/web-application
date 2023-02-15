from prob.base_prob import BaseProb
import numpy as np
import json

class BOPProb(BaseProb):
  def __init__(self, prob_table=None):
    if prob_table is None:
      prob_table = json.load(open("model/bop_prob.json", "r"))
    super().__init__(prob_table)

  def prob_tag_given_prev_tag_and_n(self, tag, prev_tag, n):
    if n == -1:
      return 1e-12
    if n < 7:
      prob = self.prob_table.get(str(n), {}).get(prev_tag, {}).get(tag, 0)
      if prob == 0:
        prob = 1e-12
      return prob
    
    return self.sigmoid_prob(tag, prev_tag, n)

  def sigmoid_prob(self, tag, prev_tag, n):
    if prev_tag != "Side":
      return 1e-12

    zee_prob = self.sigmoid(n-8)*0.7 + 0.3
  
    if tag == "Zee":
      return zee_prob
    elif tag == "Side":
      return 1-zee_prob
    return 1e-12

  def sigmoid(self, x):
    return 1 / (1 + np.exp(-x))

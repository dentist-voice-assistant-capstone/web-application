from abc import ABC

class BaseProb(ABC):
  def __init__(self, prob_table):
    self.prob_table = prob_table

  def prob_tag_given_prev_tag_and_n(self, tag, prev_tag, n):
    return NotImplementedError

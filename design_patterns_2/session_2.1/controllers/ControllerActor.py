import abc
from abc import abstractmethod

from models.Actor import Actor


class ControllerActor(abc.ABC):  # no parameters cause its abstract class

    def __init__(self):
        self.actor: Actor = None  # stores pointer to Actor datatype from game data structure

    @abstractmethod
    def update(self):
        pass


import abc
from abc import abstractmethod

from models.Actor import Actor


class ControllerActor(abc.ABC):  # no parameters cause its abstract class
    @abstractmethod
    def update(self):
        pass

    # @abstractmethod
    # def execute_turn(self):
    #     pass


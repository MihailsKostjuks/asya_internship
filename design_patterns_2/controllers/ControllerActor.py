import abc
from abc import abstractmethod

from models.Actor import Actor


class ControllerActor(abc.ABC):  # no parameters cause its abstract class
    def __init__(self, actor: Actor):
        self.actor = actor

    @abstractmethod
    def execute_turn(self):
        pass

    @abstractmethod
    def update(self, mouse_pos, delta_secs):
        pass

    # @abstractmethod
    # def execute_turn(self):
    #     pass


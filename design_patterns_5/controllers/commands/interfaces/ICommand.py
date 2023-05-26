import abc
from abc import abstractmethod
from models.Actor import Actor


class ICommand(abc.ABC):
    @abstractmethod
    def do_turn(self):
        pass

    @abstractmethod
    def undo_turn(self):
        pass


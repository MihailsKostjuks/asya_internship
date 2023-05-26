from controllers.commands.interfaces.ICommand import ICommand
from models.Actor import Actor
from models.Vector2D import Vector2D


# TODO CommandActorMove
class CommandActorMove(ICommand):  # placeholder for prev/current actors position
    def __init__(self, actor: Actor, position_target: Vector2D):
        self.actor = actor
        self.position_before = actor.position.copy()
        self.position_target = position_target

    def do_turn(self):
        self.actor.position_target = self.position_target.copy()
        # assigning to actor position (original dataclass instance) provided position

    def undo_turn(self):
        self.actor.position_target = self.position_before.copy()
        # assigning to actor position (original dataclass instance) previously saved position

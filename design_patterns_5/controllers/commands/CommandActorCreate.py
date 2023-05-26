from typing import List

from controllers.commands.interfaces.ICommand import ICommand
from models.Actor import Actor
from models.Game import Game
from views.components.ComponentButton import ComponentButton


# TODO CommandActorCreate
class CommandActorCreate(ICommand):
    def __init__(self, game: Game, actor: Actor, ui_components: List[ComponentButton]):
        self.game = game
        self.actor = actor
        self.ui_components = ui_components

    def do_turn(self):
        self.game.actors.append(self.actor)

    def undo_turn(self):
        self.game.actors.remove(self.actor)
        for ui_component in self.ui_components:
            if ui_component.linked_item == self.actor:
                self.ui_components.remove(ui_component)

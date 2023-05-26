import os.path
import random
from typing import Tuple, List

from controllers.ControllerMap import ControllerMap
from controllers.commands.CommandActorMove import CommandActorMove
from controllers.commands.interfaces.ICommand import ICommand
from models.Actor import Actor
from models.Game import Game
from models.MapTile import MapTile
from models.Vector2D import Vector2D
from models.enums.EnumActor import EnumActor
from models.enums.EnumMapTile import EnumMapTile


class ControllerGame:
    __instance = None

    @staticmethod
    def instance():
        if ControllerGame.__instance is None:
            ControllerGame.__instance = ControllerGame()
        return ControllerGame.__instance

    def __init__(self):
        if ControllerGame.__instance is not None:
            raise Exception("Only one instance of singleton allowed")
        ControllerGame.__instance = self
        self.game = None
        self.all_commands: List[ICommand] = []  # all commands ever executed
        self.current_commands: List[ICommand] = []  # currently displayed commands

    def new_game(self):
        game = Game()
        self.game = game
        self.all_commands: List[ICommand] = []
        self.current_commands: List[ICommand] = []

        game.window_size.x = 8
        game.window_size.y = 32

        ControllerMap.generate_map(game)
        ControllerMap.generate_initial_buildings(game)
        return game

    # TODO ControllerGame
    def execute_command(self, command: ICommand):
        self.all_commands.append(command)
        self.current_commands.append(command)
        command.do_turn()

    def undo_command(self):
        if len(self.current_commands) and len(self.all_commands):
            command = self.current_commands.pop()
            command.undo_turn()

    def redo_command(self):  # determines the order
        length = len(self.all_commands)
        length_copy = len(self.current_commands)
        if length > length_copy:
            command = self.all_commands[length_copy]
            self.current_commands.append(command)
            command.do_turn()

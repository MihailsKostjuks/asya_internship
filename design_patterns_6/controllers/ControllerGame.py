import os.path
import random
from typing import Tuple

from controllers.ControllerMap import ControllerMap
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
        self.command_history = []

    def new_game(self):
        game = Game()
        self.game = game
        self.command_history = []

        game.window_size.x = 8
        game.window_size.y = 32

        ControllerMap.generate_map(game)
        ControllerMap.generate_initial_buildings(game)
        return game

    def execute_command(self, command: ICommand):
        self.command_history.append(command)
        command.execute()

    def undo_command(self):
        if len(self.command_history):
            command = self.command_history.pop() # stack type of behavior last element
            command.undo()
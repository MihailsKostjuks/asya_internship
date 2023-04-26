import os.path
import random

from controllers.ControllerMap import ControllerMap
from models.Actor import Actor
from models.Game import Game
from models.MapTile import MapTile
from models.Vector2D import Vector2D
from models.enums.EnumActor import EnumActor
from models.enums.EnumMapTile import EnumMapTile
from models.enums.EnumTribe import EnumTribe


class ControllerGame:
    __instance = None  # ? no typing otherwise he won't understand what we imported right here

    @staticmethod
    def instance():
        if ControllerGame.__instance is None:
            ControllerGame.__instance = ControllerGame()
        return ControllerGame.__instance

    def __init__(self):
        if ControllerGame.__instance is not None:  # cannot create the 2nd WindowMain class instance
            raise Exception("Only one instance of singleton allowed")
        ControllerGame.__instance = self
        self.game = None

    def new_game(self):
        game = Game()
        self.game = game
        game.window_size.x = 8
        game.window_size.y = 32

        ControllerMap.generate_map(game)
        ControllerMap.generate_initial_buildings(game)

        # for j in range(game.map_size.y):
        #
        #     game.map_tiles.append([]) # add col to each row
        #
        #     for i in range(game.map_size.x):
        #         map_tile = MapTile()
        #
        #         random_tile_type = random.choice([
        #             EnumMapTileType.Ground,
        #             EnumMapTileType.Ground,
        #             EnumMapTileType.Ground,
        #             EnumMapTileType.Water
        #         ])
        #
        #         map_tile.tile_type = random_tile_type
        #
        #         if len(game.actors) < 2:
        #             if i < 8 and j < 8:
        #                 if map_tile.tile_type == EnumMapTileType.Ground:
        #                     actor = Actor()
        #                     actor.position.x = i
        #                     actor.position.y = j
        #
        #                     if len(game.actors) == 0:
        #                         actor.actor_type = EnumActorType.Warrior
        #                         game.actors.append(actor)
        #                     elif len(game.actors) == 1:
        #                         actor.actor_type = EnumActorType.Rider
        #                         game.actors.append(actor)
        #
        #         game.map_tiles[j].append(map_tile)
        return game

    def create_actors(
                      self,
                      actor: Actor,
                      actor_position: Vector2D,
                      actor_tribe: EnumTribe,
                      actor_type: EnumActor
                    ) -> Actor:
        actor = actor
        actor_position: actor_position
        actor_tribe: actor_tribe
        actor_type: actor_type

        actor.position = actor_position.copy()
        actor.position.x += random.randint(-2, 2)
        actor.position.y += random.randint(-2, 2)
        actor.tribe = actor_tribe
        actor.actor_type = actor_type

        self.game.actors.append(actor)


        return actor


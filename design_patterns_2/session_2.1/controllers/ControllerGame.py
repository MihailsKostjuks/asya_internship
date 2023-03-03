import random
from typing import List
from controllers.ControllerActor import ControllerActor
from models.Game import Game
from models.MapTile import MapTile
from models.Vector2D import Vector2D
from models.enums.EnumMapTileType import EnumMapTileType


class ControllerGame:
    def __init__(self):
        self.__actor_controllers: List[ControllerActor] = []


    @staticmethod  # doesn't refer to any class instance (works just a basic function but defined in a class)
    def new_game():
        game = Game()
        game.map_size.x = 100
        game.map_size.y = 100

        for j in range(game.map_size.y):  # creating an array 100x100
            game.map_tiles.append([])  # add col to each row. So we have a list of 100 lists
            for i in range(game.map_size.x):
                map_tile = MapTile()  # creating a class instance
                random_tile_type = random.choice(
                    [EnumMapTileType.Ground, EnumMapTileType.Ground, EnumMapTileType.Ground, EnumMapTileType.Ground, EnumMapTileType.Water]
                )
                map_tile.tile_type = random_tile_type  # assigning to its tile_type value of ENUM
                game.map_tiles[j].append(map_tile)  # map_tiles is a BIG list
                # that stores 100 another lists with 100 Ground/Water values each.
                # j is the number(index) of these 100 lists.
                # Outer loop (j) loops 100 times so we append
                # to each of those 100 lists 100 map_tile values (assigned using EnumMapTileType).

        return game  # returns game object back to WindowMain


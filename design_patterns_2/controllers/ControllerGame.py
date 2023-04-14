import random
from typing import List
from controllers.ControllerActor import ControllerActor
from controllers.ControllerActorRider import ControllerActorRider
from controllers.ControllerActorWarrior import ControllerActorWarrior
from models.Actor import Actor
from models.Game import Game
from models.MapTile import MapTile
from models.Vector2D import Vector2D
from models.enums.EnumActorType import EnumActorType
from models.enums.EnumMapTileType import EnumMapTileType



class ControllerGame:
    def __init__(self):
        self.actor_controllers: List[ControllerActor] = []

    def new_game(self):
        game = Game()
        game.map_size.x = 100
        game.map_size.y = 100

        for j in range(game.map_size.y):  # creating an array 100x100
            game.map_tiles.append([])  # add col to each row. So we have a list of 100 lists
            for i in range(game.map_size.x):
                map_tile = MapTile()  # creating a class instance
                map_tile.tile_type = random.choice(
                    [EnumMapTileType.Ground, EnumMapTileType.Ground, EnumMapTileType.Ground, EnumMapTileType.Water]
                ) # assigning to its tile_type value of ENUM
                game.map_tiles[j].append(map_tile)  # map_tiles is a BIG list
                # that stores 100 another lists with 100 Ground/Water values each.
                # j is the number(index) of these 100 lists.
                # Outer loop (j) loops 100 times so we append
                # to each of those 100 lists 100 map_tile values (assigned using EnumMapTileType).

        # list of dataclasses
        game.actors = []
        warrior = Actor()
        warrior.actor_type = EnumActorType.Warrior
        game.actors.append(warrior)

        rider = Actor()
        rider.actor_type = EnumActorType.Horseman
        game.actors.append(rider)

        # list of controllers
        for actor in game.actors:
            if actor.actor_type == EnumActorType.Warrior:
                controller_actor_warrior = ControllerActorWarrior(actor)
                self.actor_controllers.append(controller_actor_warrior)
            elif actor.actor_type == EnumActorType.Horseman:
                controller_actor_rider = ControllerActorRider(actor)
                self.actor_controllers.append(controller_actor_rider)

        return game  # returns game object back to WindowMain

    def execute_turn(self):
        for i in self.actor_controllers:
            i.execute_turn()

    def update(self, mouse_pos, delta_secs):
        self.actor_controllers[0].update(mouse_pos, delta_secs)


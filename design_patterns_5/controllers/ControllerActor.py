import random
import struct
from typing import BinaryIO

from models.Actor import Actor
from models.Game import Game
from models.enums.EnumActor import EnumActor
from models.enums.EnumTribe import EnumTribe


class ControllerActor:

    @staticmethod
    def write_binary(fp: BinaryIO, actor: Actor):
        bin_data = struct.pack('i', actor.position.x)
        fp.write(bin_data)
        bin_data = struct.pack('i', actor.position.y)
        fp.write(bin_data)

        actor_type = 0
        if actor.actor_type == EnumActor.Warrior:
            actor_type = 1
        elif actor.actor_type == EnumActor.Knight:
            actor_type = 2
        elif actor.actor_type == EnumActor.Rider:
            actor_type = 3
        bin_data = struct.pack('i', actor_type)
        fp.write(bin_data)

        actor_tribe = 0
        if actor.tribe == EnumTribe.Imperius:
            actor_tribe = 1
        elif actor.tribe == EnumTribe.Hoodrick:
            actor_tribe = 2
        bin_data = struct.pack('i', actor_tribe)
        fp.write(bin_data)

    @staticmethod
    def read_binary(fp: BinaryIO, game: Game, offset: int, data_type: str, size: int):
        actor = Actor()
        fp.seek(offset * size)
        pos_x_binary = fp.read(size)
        pos_x = struct.unpack(data_type, pos_x_binary)
        actor.position.x = pos_x[0]
        actor.position_target.x = pos_x[0]

        fp.seek(offset * size + size)
        pos_y_binary = fp.read(size)
        pos_y = struct.unpack(data_type, pos_y_binary)
        actor.position.y = pos_y[0]
        actor.position_target.y = pos_y[0]

        fp.seek(offset * size + size*2)
        actor_type_binary = fp.read(size)
        actor_type = struct.unpack(data_type, actor_type_binary)
        actor_type = actor_type[0]
        if actor_type == 1:
            actor.actor_type = EnumActor.Warrior
        elif actor_type == 2:
            actor.actor_type = EnumActor.Knight
        elif actor_type == 3:
            actor.actor_type = EnumActor.Rider
        else:
            actor.actor_type = EnumActor.NotSet

        fp.seek(offset * size + size*3)
        tribe_binary = fp.read(size)
        tribe = struct.unpack(data_type, tribe_binary)
        tribe = tribe[0]
        if tribe == 1:
            actor.tribe = EnumTribe.Imperius
        elif tribe == 2:
            actor.tribe = EnumTribe.Hoodrick
        else:
            actor.tribe = EnumTribe.NotSet

        game.actors.append(actor)





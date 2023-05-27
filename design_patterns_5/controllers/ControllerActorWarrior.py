import random
import struct
from typing import BinaryIO

from controllers.ControllerGame import ControllerGame
from controllers.interfaces.IControllerActor import IControllerActor
from models.Actor import Actor
from models.Game import Game


class ControllerActorWarrior(IControllerActor):
    def __init__(self, actor):
        super().__init__(actor)
        self._actor = actor
        self.speed = 1.5

    @property
    def actor(self) -> Actor:
        return self._actor

    def do_turn(self):
        self.actor.position_target.x = self.actor.position.x + random.randint(-3, 3)
        self.actor.position_target.y = self.actor.position.y + random.randint(-3, 3)
        # check positions that are free and then select randomly from free positions
        ControllerGame.instance().game.stars += 1

    def update(self, delta_time):
        if self.actor.position.x != self.actor.position_target.x or self.actor.position.y != self.actor.position_target.y:
            self.actor.position.x += (1 if (
                                                       self.actor.position_target.x - self.actor.position.x) > 0 else -1) * delta_time * self.speed
            self.actor.position.y += (1 if (
                                                       self.actor.position_target.y - self.actor.position.y) > 0 else -1) * delta_time * self.speed

            if abs(self.actor.position.x - self.actor.position_target.x) < 1e-1:
                self.actor.position.x = self.actor.position_target.x
            if abs(self.actor.position.y - self.actor.position_target.y) < 1e-1:
                self.actor.position.y = self.actor.position_target.y
    #
    # @staticmethod
    # def write_binary(fp: BinaryIO, actor: Actor):
    #     # bin_data = struct.pack(f'{len(actor.uuid)}s', actor.uuid)  # uuid
    #     # fp.write(bin_data)
    #     bin_data = struct.pack('i', actor.position.x)  # x pos
    #     fp.write(bin_data)
    #     bin_data = struct.pack('i', actor.position.y)  # y pos
    #     fp.write(bin_data)
    #
    # def read_binary(self, fp: BinaryIO, game: Game, offset: int, data_type: str, volume: int):
    #     game.actors






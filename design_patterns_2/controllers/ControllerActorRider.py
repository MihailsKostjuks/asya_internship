import random
import pygame
from controllers.ControllerActor import ControllerActor
from models.Actor import Actor
from models.enums.EnumActorType import EnumActorType


class ControllerActorRider(ControllerActor):  # inherit abc class
    def __init__(self, actor: Actor):
        super().__init__(actor)

    def execute_turn(self):
        if self.actor.position.x == 0:
            self.actor.position.x += 52
        else:
            self.actor.position.x += random.choice([52, -52])

        if self.actor.position.y == 0:
            self.actor.position.y += 30
        else:
            self.actor.position.y += random.choice([30, -30])

    def update(self, mouse_pos, delta_secs):
        pass


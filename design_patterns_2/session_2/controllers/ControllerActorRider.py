import random
import pygame
from controllers.ControllerActor import ControllerActor
from models.Actor import Actor
from models.enums.EnumActorType import EnumActorType


class ControllerActorRider(ControllerActor):  # inherit abc class
    def __init__(self):
        self.actor = Actor()

    def update(self):
        if self.actor.position.x == 0:
            self.actor.position.x += 104
        else:
            self.actor.position.x += random.choice([104, -104])

        if self.actor.position.y == 0:
            self.actor.position.y += 30
        else:
            self.actor.position.y += random.choice([30, -30])
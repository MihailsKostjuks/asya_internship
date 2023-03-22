import random

import pygame

from controllers.ControllerActor import ControllerActor
from models.Actor import Actor
from models.enums.EnumActorType import EnumActorType


class ControllerActorWarrior(ControllerActor):  # inherit abc class
    def __init__(self):
        self.actor = Actor()


    def update(self):
        if self.actor.position.x == 0:
            self.actor.position.x += 52
        else:
            self.actor.position.x += random.choice([52, -52])

        if self.actor.position.y == 0:
            self.actor.position.y += 15
        else:
            self.actor.position.y += random.choice([15, -15])





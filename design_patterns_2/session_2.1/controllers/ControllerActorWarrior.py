import pygame

from controllers.ControllerActor import ControllerActor
from models.Actor import Actor


class ControllerActorWarrior(ControllerActor):  # inherit abc class
    def __init__(self, actor):
        super().__init__()
        self.actor: Actor = actor
        # self.surface_warriorr = pygame.image.load('./resources/Tribes/Imperius/Units/warrior.png')

    def update(self):
        # actual implementation (change position for animation etc)
        # self.actor.position.x += 26
        # self.actor.position.y += 15






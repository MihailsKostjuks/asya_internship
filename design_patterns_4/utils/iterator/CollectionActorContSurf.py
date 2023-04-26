from collections import OrderedDict
from typing import List

import pygame

from controllers.interfaces.IControllerActor import IControllerActor


class CollectionActorContSurf:
    """returns a tuple of actor_controller & its surface"""
    def __init__(
            self,
            actor_controllers: List[IControllerActor],
            actor_surfaces: List[pygame.Surface],
            building_surfaces: List[pygame.Surface] = None
    ):
        super().__init__()
        self.actor_controllers = actor_controllers
        self.actor_surfaces = actor_surfaces
        self.building_surfaces = building_surfaces
        self.idx = 0

    def __len__(self):
        return len(self.actor_controllers)

    def __iter__(self):
        return self

    def __next__(self):
        if self.idx >= len(self.actor_controllers):
            raise StopIteration()

        actor_controller = self.actor_controllers[self.idx]
        surface = self.actor_surfaces[self.idx]
        self.idx += 1
        return actor_controller, surface



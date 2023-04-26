from typing import Dict

import pygame
from pygame import Surface

from controllers.ControllerActorKnight import ControllerActorKnight
from controllers.ControllerActorRider import ControllerActorRider
from controllers.ControllerActorWarrior import ControllerActorWarrior
from controllers.interfaces.IControllerActor import IControllerActor
from models.Actor import Actor
from models.enums.EnumActor import EnumActor


class FactoryControllerActor:

    def __init__(self, actor: Actor):
        self.actor = actor
        self.actors_by_types: Dict[EnumActor, IControllerActor] = {
            EnumActor.Warrior: ControllerActorWarrior(self.actor),
            EnumActor.Knight: ControllerActorKnight(self.actor),
            EnumActor.Rider: ControllerActorRider(self.actor)
        }

    def get_controller_actor(self, enum_actor: EnumActor) -> IControllerActor:
        return self.actors_by_types[enum_actor]

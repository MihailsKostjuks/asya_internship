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

    @staticmethod
    def create_controller(actor: Actor) -> IControllerActor:
        if actor.actor_type == EnumActor.Warrior:
            return ControllerActorWarrior(actor)
        elif actor.actor_type == EnumActor.Knight:
            return ControllerActorKnight(actor)
        elif actor.actor_type == EnumActor.Rider:
            return ControllerActorRider(actor)

import random

import pygame

from controllers.ControllerActor import ControllerActor
from models.Actor import Actor
from models.enums.EnumActorType import EnumActorType


class ControllerActorWarrior(ControllerActor):  # inherit abc class
    def __init__(self, actor: Actor):
        super().__init__(actor)
        self.movement_speed = 100


    def execute_turn(self):
        if self.actor.position.x == 0:
            self.actor.position.x += 26
        else:
            self.actor.position.x += random.choice([26, -26])

        if self.actor.position.y == 0:
            self.actor.position.y += 15
        else:
            self.actor.position.y += random.choice([15, -15])

    def update(self, mouse_pos, delta_secs):
        mouse_pox_x: int = mouse_pos[0] - 35
        mouse_pox_y: int = mouse_pos[1] - 10

        distance_x: int = abs(mouse_pox_x - self.actor.position.x)
        distance_y: int = abs(mouse_pox_y - self.actor.position.y)
        proportion: float = 1

        if distance_y != 0:
            proportion = distance_x / distance_y  # ja distance_x > distance_y tad kustas lenak y virziena.

        if proportion >= 1: # ja x lielak tad samazinam y atrumu
            if mouse_pox_x > self.actor.position.x:
                self.actor.position.x += (delta_secs * self.movement_speed)
                if mouse_pox_x < self.actor.position.x:
                    self.actor.position.x = mouse_pox_x
            elif mouse_pox_x < self.actor.position.x:
                self.actor.position.x -= (delta_secs * self.movement_speed)
                if mouse_pox_x > self.actor.position.x:
                    self.actor.position.x = mouse_pox_x

            if mouse_pox_y > self.actor.position.y:
                self.actor.position.y += (delta_secs * self.movement_speed / proportion)
                if mouse_pox_y < self.actor.position.y:
                    self.actor.position.y = mouse_pox_y
            elif mouse_pox_y < self.actor.position.y:
                self.actor.position.y -= (delta_secs * self.movement_speed / proportion)
                if mouse_pox_y > self.actor.position.y:
                    self.actor.position.y = mouse_pox_y
        else:  # ja y ir lielak tad samazinam x atrumu
            if mouse_pox_x > self.actor.position.x:
                self.actor.position.x += (delta_secs * self.movement_speed * proportion)
                if mouse_pox_x < self.actor.position.x:
                    self.actor.position.x = mouse_pox_x
            elif mouse_pox_x < self.actor.position.x:
                self.actor.position.x -= (delta_secs * self.movement_speed * proportion)
                if mouse_pox_x > self.actor.position.x:
                    self.actor.position.x = mouse_pox_x

            if mouse_pox_y > self.actor.position.y:
                self.actor.position.y += (delta_secs * self.movement_speed)
                if mouse_pox_y < self.actor.position.y:
                    self.actor.position.y = mouse_pox_y
            elif mouse_pox_y < self.actor.position.y:
                self.actor.position.y -= (delta_secs * self.movement_speed)
                if mouse_pox_y > self.actor.position.y:
                    self.actor.position.y = mouse_pox_y


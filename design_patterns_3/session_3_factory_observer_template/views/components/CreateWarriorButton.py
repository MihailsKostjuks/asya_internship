from typing import List
import pygame

from models.enums.EnumTribe import EnumTribe
from views.components.ComponentButton import ComponentButton


class CreateWarriorButton(ComponentButton):
    def __init__(self, button_rect: pygame.Rect, tribe: EnumTribe):
        super().__init__(button_rect, "Create Warrior")
        # Vareju ari izdarit to buttontext as optional attribute lai nerakstitu buttontext kas es neizmantosu

        self.tribe = tribe
        self.button_up.set_alpha(0)

    def draw(self, surface: pygame.Surface):
        surface.blit(
            source=self.button_up,
            dest=(self.button_rect.x, self.button_rect.y)
        )

    def call_listener(self):
        for listener in self.listener_click:
            listener(self.tribe)

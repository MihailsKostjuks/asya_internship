from typing import List
import pygame
from models.enums.EnumTribe import EnumTribe
from design_patterns_3.session_3_factory_observer_template.views.components.ParentButton import ParentButton
pygame.init()


class CreateWarriorButton(ParentButton):
    def __init__(self, button_rect: pygame.Rect, tribe: EnumTribe):
        super().__init__(button_rect)

        self.tribe = tribe
        self.button_up.set_alpha(0)

    def trigger_mouse(self, mouse_position, mouse_button_state):  # overriding this method
        if any(mouse_button_state):
            if self.button_rect.x < mouse_position[0] < self.button_rect.x + self.button_rect.width:
                if self.button_rect.y < mouse_position[1] < self.button_rect.y + self.button_rect.height:
                    for listener in self.listener_click:
                        listener(self.tribe)  # self.tribe is the only thing that distinguishes from CB

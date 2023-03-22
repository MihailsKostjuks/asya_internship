from typing import List
import pygame

from models.enums.EnumTribe import EnumTribe

pygame.init()

class CreateWarriorButton:
    def __init__(self, button_rect: pygame.Rect, tribe: EnumTribe):
        self.button_rect = button_rect
        self.tribe = tribe
        self.button_up = pygame.Surface((self.button_rect.width, self.button_rect.height), pygame.SRCALPHA)  # caurspidigs

        pygame.draw.rect(
            surface=self.button_up,
            color=(0,0,0),
            rect=pygame.Rect(0,0, self.button_rect.width, self.button_rect.height)
        )
        self.button_up.set_alpha(0)
        self.listener_click: List[callable] = []  # list of functions

    def draw(self, surface: pygame.Surface):
        surface.blit(
            source=self.button_up,
            dest=(self.button_rect.x, self.button_rect.y)
        )

    # triggers any time the user clicks on the map (is called in WindowMain)
    def trigger_mouse(self, mouse_position, mouse_button_state):  # hover . call in update()?
        if any(mouse_button_state):  # checks if mouse position coincides with button position
            if self.button_rect.x < mouse_position[0] < self.button_rect.x + self.button_rect.width:
                if self.button_rect.y < mouse_position[1] < self.button_rect.y + self.button_rect.height:
                    for listener in self.listener_click:
                        listener(self.tribe)

    def add_listener_click(self, event_listener):
        if event_listener not in self.listener_click:
            self.listener_click.append(event_listener)

    def remove_listener_click(self, event_listener):
        if event_listener in self.listener_click:
            self.listener_click.remove(event_listener)
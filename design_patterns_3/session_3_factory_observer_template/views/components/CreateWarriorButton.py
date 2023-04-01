from typing import List
import pygame

from models.enums.EnumTribe import EnumTribe

from design_patterns_3.session_3_factory_observer_template.views.components.ComponentButton import ComponentButton

pygame.init()

class CreateWarriorButton(ComponentButton):
    def __init__(self, button_rect: pygame.Rect, tribe: EnumTribe):
        super().__init__(button_rect, "Create Warrior")
        # Vareju ari izdarit to buttontext as optional attribute lai nerakstitu buttontext kas es neizmantosu

        self.tribe = tribe
        self.button_up.set_alpha(0)

    def draw(self, surface: pygame.Surface):
        # nevajag super() jo ir parak dauzd lieku kodu kurs attelos textu piemeram
        surface.blit(
            source=self.button_up,
            dest=(self.button_rect.x, self.button_rect.y)
        )

    def trigger_mouse(self, mouse_position, mouse_button_state):
        if any(mouse_button_state):
            if self.button_rect.x < mouse_position[0] < self.button_rect.x + self.button_rect.width:
                if self.button_rect.y < mouse_position[1] < self.button_rect.y + self.button_rect.height:
                    for listener in self.listener_click:
                        listener(self.tribe)  # self.tribe is the only thing that distinguishes from CB

    def add_listener_click(self, event_listener):  # to vispar vajadzeja darit?
        super().add_listener_click(event_listener)

    def remove_listener_click(self, event_listener):
        super().remove_listener_click(event_listener)

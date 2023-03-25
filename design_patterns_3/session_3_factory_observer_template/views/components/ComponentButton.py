from typing import List

import pygame

from design_patterns_3.session_3_factory_observer_template.views.components.ParentButton import ParentButton

pygame.init()

class ComponentButton(ParentButton):
    def __init__(self, button_rect: pygame.Rect, button_text: str):
        super().__init__(button_rect) # inheriting everything from ParentButton but adding additionally textbutton
        self.button_text = button_text

        font = pygame.font.Font('freesansbold.ttf', 23)
        self.text = font.render(button_text, True, (0,0,0), (255,255,255))

        pygame.draw.rect(
            surface=self.button_up,
            color=(255, 255, 255),
            rect=pygame.Rect(2, 2, self.button_rect.width-4, self.button_rect.height-4)
        )
        # rectangle with text
        self.text_rect = self.text.get_rect()
        self.text_rect.center = (
            self.button_rect.width/2 + self.button_rect.x,
            self.button_rect.height/2 + self.button_rect.y
        )

    def draw(self, surface: pygame.Surface):
        super().draw(surface)
        if self.button_up.get_rect().collidepoint(pygame.mouse.get_pos()):
            surface.blit(
                source=self.text,
                dest=self.text_rect
            )

from dataclasses import dataclass
from typing import Tuple

import pygame
import react.Component
from react.Component import Component


@dataclass
class Props(react.Component.Props):
    text: str = ''
    color_font: Tuple = (0, 0, 0)


@dataclass
class State:
    pass


class TextField(Component):
    def __init__(self, props):
        super().__init__(props)
        if self.props.color_font is None:
            self.props.color_font = (0, 0, 0)

    def render(self):
        return []

    def draw(self, screen):
        if self.shouldComponentUpdate(self.props, self.state):
            font = pygame.font.SysFont('arial', 24)
            img_font = font.render(self.props.text, True, self.props.color_font)
            screen.blit(img_font, (self.props.x, self.props.y))
        super().draw(screen)
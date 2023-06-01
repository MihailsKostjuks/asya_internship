from dataclasses import dataclass
from typing import Tuple

import pygame
import react.Component
from react.Component import Component


@dataclass
class Props(react.Component.Props):
    isTextBox: bool = False
    text: str = ''
    color_font: Tuple = (0, 0, 0)


@dataclass
class State:
    text: str = ''
    trimmedText: str = ''


class TextField(Component):
    def __init__(self, props):
        super().__init__(props)
        if self.props.color_font is None:
            self.props.color_font = (0, 0, 0)

        self.state = State(
            text=self.props.text
        )

    def render(self):
        return []

    def trimTextInput(self, textInput: str, width: int):
        textInput = textInput[1:]
        return textInput

    def draw(self, screen):
        if self.shouldComponentUpdate(self.props, self.state):
            font = pygame.font.SysFont('arial', 24)
            img_font = font.render(self.props.text, True, self.props.color_font)
            if (self.props.isTextBox):
                self.setState(  # assigns state if this is the input field
                    State(
                        text=self.props.text,
                        trimmedText=self.props.text
                    )
                )
                while img_font.get_width() >= self.props.width:  # while loop for trimming
                    trimmedText = self.trimTextInput(self.state.trimmedText, self.props.width)
                    self.setState(
                        State(
                            trimmedText=trimmedText
                        )
                    )
                    img_font = font.render(self.state.trimmedText, True, self.props.color_font)

            screen.blit(img_font, (self.props.x, self.props.y))
        super().draw(screen)
        
from dataclasses import dataclass
from typing import Tuple

import pygame
import components.TextField
from events.EventKey import EventKey
from react.Component import Component


@dataclass
class Props(components.TextField.Props):
    color_border: Tuple = (0, 0, 0)
    color_background: Tuple = (255, 255, 255)
    onTextChange: callable = None


@dataclass
class State:
    text: str = ""


class TextBox(Component):
    def __init__(self, props):
        super().__init__(props)
        self.state = State(
            text=self.props.text
        )

    def render(self):
        return [components.TextField.TextField(
            props=components.TextField.Props(
                x=self.props.x + 5,
                y=self.props.y + 5,
                width=self.props.width-5,
                height=self.props.height-5,
                text=self.state.text
            )
        )]

    def onKeyDown(self, event: EventKey):
        event.is_handled = True
        text = self.state.text
        if event.key_code == pygame.K_BACKSPACE:
            text = text[:-1]
        elif event.key_code == pygame.K_SPACE:
            text += " "
        else:
            if len(event.key_name) == 1:
                text += event.key_name
        self.setState(State(
            text=text
        ))
        if self.props.onTextChange:
            self.props.onTextChange(text)

    def draw(self, screen):
        if self.shouldComponentUpdate(self.props, self.state):
            pygame.draw.rect(
                screen,
                self.props.color_background,
                (self.props.x, self.props.y, self.props.width, self.props.height)
            )
            pygame.draw.rect(
                screen,
                self.props.color_border,
                (self.props.x, self.props.y, self.props.width, self.props.height),
                1
            )
        super().draw(screen)
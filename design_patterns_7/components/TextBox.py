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
    onChangeText: callable = None


@dataclass
class State:
    text: str = ""


class TextBox(Component):
    def __init__(self, props: Props):
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
                text=self.state.text,
                isTextBox=True
            )
        )]

    def onKeyDown(self, event: EventKey):
        if event.key_code == 32:
            self.setState(
                State(
                    text=self.state.text + ' '
                )
            )
        elif event.key_code == 8:
            self.setState(
                State(
                    text=self.state.text[:-1]
                )
            )
        else :
            self.setState(
                State(
                    text= self.state.text + event.key_name
                )
            )
        if self.props.onChangeText is not None:
            self.props.onChangeText(self.state.text)

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
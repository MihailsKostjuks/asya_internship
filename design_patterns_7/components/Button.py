from dataclasses import dataclass
from typing import Callable

import pygame
import react.Component
import components.TextField
from components.TextField import TextField
from events.EventMouse import EventMouse
from react.Component import Component


@dataclass
class Props(react.Component.Props):
    title: str = ''
    onPress: Callable = None


@dataclass
class State:
    isMouseOver: bool = False


class Button(Component):
    def __init__(self, props):
        super().__init__(props)

        self.state = State()

    def onPress(self, event: EventMouse):  # if mouse pos coincise with button pos
        if self.props.x < event.x < self.props.x + self.props.width:
            if self.props.y < event.y < self.props.y + self.props.height:
                event.is_handled = True  # this click is handled
                self.props.onPress()  # calls props function

    def onMouseMove(self, event: EventMouse):
        isMouseOver = False
        if self.props.x < event.x < self.props.x + self.props.width:
            if self.props.y < event.y < self.props.y + self.props.height:
                isMouseOver = True

        if self.state.isMouseOver != isMouseOver:
            event.is_handled = True
            self.setState(State(isMouseOver=isMouseOver))

    def render(self):
        return [
            TextField(
                props=components.TextField.Props(
                    x=self.props.x + 5,
                    y=self.props.y + 5,
                    width=self.props.width,
                    height=self.props.height,
                    text=self.props.title
                )
            ),
        ]

    def draw(self, screen):
        if self.shouldComponentUpdate(self.props, self.state):
            pygame.draw.rect(
                screen,
                color=(100, 100, 100) if not self.state.isMouseOver else (200, 200, 200),
                rect=pygame.Rect(
                    self.props.x,
                    self.props.y,
                    self.props.width,
                    self.props.height
                )
            )
        super().draw(screen)
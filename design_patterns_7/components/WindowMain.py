from dataclasses import dataclass, field
from typing import List

import pygame
import react.Component
import components.Button
import components.TextField
from components.Button import Button
from components.TextBox import TextBox
from components.TextField import TextField
from react.Component import Component


@dataclass
class Props(react.Component.Props):
    pass

@dataclass
class State:
    text: str
    messages: List[str] = field(default_factory=list)


class WindowMain(Component):
    def __init__(self, props):
        super().__init__(props)
        self.state = State(
            text = '',
            messages=['test']
        )

    def onChangeText(self, text):
        self.setState(
            State(
                text=text,
                messages=self.state.messages
            )
        )

    def onPressSend(self):
        self.setState(
            State(
                messages=self.state.messages + [self.state.text],  # list append
                text=''
            )
        )

    def onPressClear(self):
        self.setState(
            State(
                text=self.state.text,
                messages=[]
            )
        )

    def render(self):
        messages_text_fields = []
        for i, message in enumerate(self.state.messages):
            messages_text_fields.append(TextField(
                props=components.TextField.Props(
                    x=self.props.x + 10,
                    y=self.props.y + 10 + i * 40,
                    width=self.props.width,
                    height=40,
                    text=message
                )
            ))

        return messages_text_fields + [
            Button(
                props=components.Button.Props(
                    x=self.props.x + self.props.width - 90,
                    y=self.props.y + self.props.height - 50,
                    width=80,
                    height=40,
                    title="Clear",
                    onPress=self.onPressClear
                )
            ),
            Button(
                props=components.Button.Props(
                    x=self.props.x + self.props.width - 180,
                    y=self.props.y + self.props.height - 50,
                    width=80,
                    height=40,
                    title="Send",
                    onPress=self.onPressSend
                )
            ),
            TextBox(
                props=components.TextBox.Props(
                    x=self.props.x + 10,
                    y=self.props.y + self.props.height - 50,
                    width=self.props.width - 200,
                    height=40,
                    text=self.state.text,
                    onChangeText=self.onChangeText
                )
            )
        ]

    def draw(self, screen):
        if self.shouldComponentUpdate(self.props, self.state):
            pygame.draw.rect(
                screen,
                color=(255, 255, 255),
                rect=pygame.Rect(
                    self.props.x,
                    self.props.y,
                    self.props.width,
                    self.props.height
                )
            )
        super().draw(screen)
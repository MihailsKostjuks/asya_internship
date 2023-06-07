from dataclasses import dataclass, field
from typing import List

import pygame
import react.Component
import components.Button
import components.TextField
from actions import actions_chat
from components.Button import Button
from components.TextBox import TextBox
from components.TextField import TextField
from react.Component import Component
from stores.store_main import store_main


@dataclass
class Props(react.Component.Props):
    pass


@dataclass
class State:
    pass


class WindowMain(Component):
    def __init__(self, props):
        super().__init__(props)
        self.state = {}
        store_main.subscribe(lambda: self.forceUpdate())

    def onPressSend(self):
        action = actions_chat.action_chat_add_message(
            store_main.get_state()['current_message']
        )
        store_main.dispatch(action)

    def onPressClear(self):
        action = actions_chat.action_chat_clear_all_messages()
        store_main.dispatch(action)

    def onTextChange(self, text):
        action = actions_chat.action_chat_change_current_message(
            text
        )
        store_main.dispatch(action)

    def onPressUndo(self):
        action = actions_chat.action_chat_undo()
        store_main.dispatch(action)

    def render(self):
        messages_text_fields: List = []
        for i, message in enumerate(store_main.get_state()['messages']):
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
                    title="Undo",
                    onPress=self.onPressUndo
                )
            ),
            Button(
                props=components.Button.Props(
                    x=self.props.x + self.props.width - 180,
                    y=self.props.y + self.props.height - 50,
                    width=80,
                    height=40,
                    title="Clear",
                    onPress=self.onPressClear
                )
            ),
            Button(
                props=components.Button.Props(
                    x=self.props.x + self.props.width - 270,
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
                    width=self.props.width - 290,
                    height=40,
                    text=store_main.get_state()['current_message'],
                    onTextChange=self.onTextChange
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

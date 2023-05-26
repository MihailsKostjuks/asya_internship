import abc
from abc import abstractmethod

import pygame


class IComponent(abc.ABC):

    def __init__(
            self,
            rect: pygame.Rect,
            text: str = None,
            is_transparent: bool = False,
            linked_item: object = None,
            linked_enum: object = None,
            is_visible: bool = True,
            is_toggle_button: bool = False
    ):
        pass
    @abstractmethod
    def generate_transparent_button_surface(self, color_background, color_border):
        pass

    def generate_button_surface(self, color_background, color_font):
        pass

    def draw(self, surface: pygame.Surface):
        pass

    def trigger_mouse(self, mouse_position, mouse_buttons):
        pass

    def add_listener_click(self, func_on_click):
        pass

    def remove_listener_click(self, func_on_click):
        pass


import pygame
from views.components.ComponentButton import ComponentButton


class DecoratorComponentButton(ComponentButton):
    def __init__(self, button: ComponentButton):
        super().__init__(  # set these underlined attrs to None in IComponent
            button.button_rect,
            text=button.button_text,
            is_transparent=button.is_transparent,
            linked_item=button.linked_item,
            linked_enum=button.linked_enum,
            is_visible=button.is_visible,
            is_toggle_button=button.is_toggle_button,
        )
        self._button = button
        self._button.font = pygame.font.SysFont('inkfree', 24)
        self._button.button_up = self._button.generate_button_surface(
            color_background=(240, 159, 159),
            color_font=(0, 0, 0)
        )
        self._button.button_over = self._button.generate_button_surface(
            color_background=(155, 155, 155),
            color_font=(0, 0, 0)
        )
        self._button.button_down = self._button.generate_button_surface(
            color_background=(0, 0, 0),
            color_font=(255, 255, 255)
        )

    def draw(self, surface: pygame.Surface):
        self._button.draw(surface)

    def trigger_mouse(self, mouse_position, mouse_buttons):
        self._button.trigger_mouse(mouse_position, mouse_buttons)

    def add_listener_click(self, func_on_click):
        self._button.add_listener_click(func_on_click)

    def remove_listener_click(self, func_on_click):
        self._button.remove_listener_click(func_on_click)


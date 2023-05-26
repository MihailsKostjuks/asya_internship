import pygame
from views.components.ComponentButton import ComponentButton
from views.components.interfaces.IComponentButton import IComponent


class DecoratorComponentButton(IComponent):
    def __init__(self, button: IComponent):
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
        self._button.font_family = 'inkfree'
        # self.font_size = 10
        self._button.font_size = 10

    # AttributeError: 'DecoratorComponentButton' object has no attribute 'linked_item'

    # excuse: after using DecoratorFasterActor, the instance becomes of a class DecoratorFasterActor, not ControllerActorRider.
    # but it works because we dont need Controller itself, but the actor that we provide by @property, so it works well.
    # methods can also be accesses. But I cant provide the pointer for ComponentButton class
    # Here, however, we cant provide @property for further use, but WindowMain needs

    # @property # dont work (obviously) need somehow return button (7.th line) but no idea how
    # def self(self):
    #     return self._button

    # @property
    # def font_size(self):
    #     return self._button.font_size

    def generate_transparent_button_surface(self, color_background, color_border):
        self._button.generate_transparent_button_surface(color_background, color_border)

    def generate_button_surface(self, color_background, color_font):
        self._button.generate_button_surface(color_background, color_font)

    def draw(self, surface: pygame.Surface):
        self._button.draw(surface)

    def trigger_mouse(self, mouse_position, mouse_buttons):
        self._button.trigger_mouse(mouse_position, mouse_buttons)

    def add_listener_click(self, func_on_click):
        self._button.add_listener_click(func_on_click)

    def remove_listener_click(self, func_on_click):
        self._button.remove_listener_click(func_on_click)

    # def __getattr__(self, attr):
    #     return getattr(self._button, attr)

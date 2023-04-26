from typing import List
import pygame
pygame.init()

class ComponentButton:
    def __init__(self, button_rect: pygame.Rect, button_text: str):
        self.button_rect = button_rect
        self.button_text = button_text

        font = pygame.font.Font('freesansbold.ttf', 23)
        self.text = font.render(button_text, True, (0,0,0), (255,255,255))

        self.button_up = pygame.Surface((self.button_rect.width, self.button_rect.height), pygame.SRCALPHA)  # caurspidigs

        pygame.draw.rect(
            surface=self.button_up,
            color=(0,0,0),
            rect=pygame.Rect(0,0, self.button_rect.width, self.button_rect.height)
        )
        pygame.draw.rect(
            surface=self.button_up,
            color=(255, 255, 255),
            rect=pygame.Rect(2, 2, self.button_rect.width-4, self.button_rect.height-4)
        )

        # rectangle with text
        self.text_rect = self.text.get_rect()
        self.text_rect.center = (
            self.button_rect.width/2 + self.button_rect.x,
            self.button_rect.height/2 + self.button_rect.y
        )
        self.is_hover: bool = False
        self.listener_click: List[callable] = []  # list of functions

    def draw(self, surface: pygame.Surface):
        surface.blit(
            source=self.button_up,
            dest=(self.button_rect.x, self.button_rect.y)
        )
        if self.is_hover:
            surface.blit(
                source=self.text,
                dest=self.text_rect
            )

    # triggers any time the user clicks on the map (is called in WindowMain)
    def trigger_mouse(self):
        mouse_pos = pygame.mouse.get_pos()
        # QUESTIONS! if I define a variable outside __init__, do I use self. or no?
        mouse_buttons = pygame.mouse.get_pressed()
        if mouse_buttons[0]:  # checks if mouse position coincides with button position
            if self.button_rect.x < mouse_pos[0] < self.button_rect.x + self.button_rect.width:
                if self.button_rect.y < mouse_pos[1] < self.button_rect.y + self.button_rect.height:
                    self.call_listener()
        if self.button_up.get_rect().collidepoint(mouse_pos):
            self.is_hover = True
        else:
            self.is_hover = False

    def call_listener(self):
        for listener in self.listener_click:
            listener()

    def add_listener_click(self, event_listener):
        if event_listener not in self.listener_click:
            self.listener_click.append(event_listener)

    def remove_listener_click(self, event_listener):
        if event_listener in self.listener_click:
            self.listener_click.remove(event_listener)
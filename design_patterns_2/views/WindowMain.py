import random
import time
from random import randint
import pygame
from pygame import key

from controllers.ControllerActor import ControllerActor
from controllers.ControllerActorRider import ControllerActorRider
from controllers.ControllerActorWarrior import ControllerActorWarrior
from controllers.ControllerGame import ControllerGame
from models.Actor import Actor
from models.enums.EnumMapTileType import EnumMapTileType

movement_speed: int = 300

class WindowMain:
    def __init__(self):
        self.not_walking_maptiles = []
        self.screen = pygame.display.set_mode(
            (520, 500)
        )
        self.is_game_running = True
        self.clock = pygame.time.Clock()

        # SURFACES
        self.surface_ground = pygame.image.load('./resources/Tribes/Imperius/Imperius ground.png')
        self.surface_water = pygame.image.load('./resources/Miscellaneous/Shallow water.png')
        # self.surface_dummy.set_colorkey((0,0,0)) # black -> transparent
        self.surface_warrior = pygame.image.load('./resources/Tribes/Imperius/Units/warrior.png')
        self.surface_rider = pygame.image.load('./resources/Tribes/Imperius/Units/rider.png')



        self.game_controller = ControllerGame()  # lai izsauktu controllera metodes
        self.game = self.game_controller.new_game()  # lai nolasitu datus no models

        self.actor_x_temp: int = 0
        self.actor_y_temp: int = 0

        self.mouse_pos = None

    def show(self):
        # main game loop
        time_last = time.time()
        while self.is_game_running:
            # get delta seconds
            self.screen.fill((0, 0, 0))
            time_current = time.time()
            delta_sec = time_current - time_last  # delta_sec == 0.03
            time_last = time_current

            # update
            self.update(delta_sec)

            pygame.display.update()
            time.sleep(0.01)

    def update(self, delta_sec):
        self.user_event(delta_sec)
        self.draw()
        if self.mouse_pos:
            if self.mouse_pos[0] - 35 - self.game.window_location.x == self.game.actors[0].position.x:
                if self.mouse_pos[1] - 10 - self.game.window_location.y == self.game.actors[0].position.y:
                    self.mouse_pos = None
        if self.mouse_pos:  # if was ever clicked at all (initially equals None, and if movement completed also becomes None)
            mouse_pos_updated_x: float = self.mouse_pos[0] - self.game.window_location.x
            mouse_pos_updated_y: float = self.mouse_pos[1] - self.game.window_location.y
            mouse_pos_updated = [mouse_pos_updated_x, mouse_pos_updated_y]
            self.game_controller.update(mouse_pos_updated, delta_sec)
        self.draw_actors()

    def draw(self):
        self.not_walking_maptiles = []
        for j in range(self.game.map_size.y):
            for i in range(self.game.map_size.x):
                if self.game.map_tiles[j][i].tile_type == EnumMapTileType.Ground:
                    if j % 2:
                        self.screen.blit(self.surface_ground, dest=(i * 52 + self.game.window_location.x, j * 15 + self.game.window_location.y))
                    else:
                        self.screen.blit(self.surface_ground, dest=(26 + (i * 52) + self.game.window_location.x, j * 15 + self.game.window_location.y))
                elif self.game.map_tiles[j][i].tile_type == EnumMapTileType.Water:
                    if j % 2:
                        self.screen.blit(self.surface_water, dest=(i * 52 + self.game.window_location.x, j * 15 + self.game.window_location.y))
                        self.not_walking_maptiles.append({'x': i * 52 + self.game.window_location.x, 'y': j * 15 + self.game.window_location.y})
                    else:
                        self.screen.blit(self.surface_water, dest=(26 + (i * 52) + self.game.window_location.x, j * 15 + self.game.window_location.y))
                        self.not_walking_maptiles.append({'x': 26 + (i * 52) + self.game.window_location.x, 'y': j * 15 + self.game.window_location.y})

    def draw_actors(self):
        warrior_x: int = 35 + self.game.actors[0].position.x + self.game.window_location.x
        warrior_y: int = 10 + self.game.actors[0].position.y + self.game.window_location.y

        rider_x: int = 35 + self.game.actors[1].position.x + self.game.window_location.x
        rider_y: int = 10 + self.game.actors[1].position.y + self.game.window_location.y

        # for not_walking_maptile in self.not_walking_maptiles:
        #     if not_walking_maptile['x'] == actor_x - 35 + 26:
        #         if not_walking_maptile['y'] == actor_y - 10 + 30:
        #             self.game.actors[0].position.x = self.actor_x_temp
        #             self.game.actors[0].position.y = self.actor_y_temp

        # self.screen.blit(self.surface_rider, dest=(
        #     rider_x,
        #     rider_y)
        # )

        self.screen.blit(self.surface_warrior, dest=(
            warrior_x,
            warrior_y)
                         )
        # self.actor_x_temp = self.game.actors[0].position.x
        # self.actor_y_temp = self.game.actors[0].position.y

    def user_event(self, delta_sec):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    self.game_controller.execute_turn()
            if event.type == pygame.MOUSEBUTTONDOWN and event.button == 1:
                self.mouse_pos = pygame.mouse.get_pos()
        # MAP MOVEMENT
        keys_pressed = key.get_pressed()

        if keys_pressed[pygame.K_DOWN]:
            self.game.window_location.y -= movement_speed * delta_sec

        if keys_pressed[pygame.K_UP]:
            self.game.window_location.y += movement_speed * delta_sec
            if self.game.window_location.y > 0:
                self.game.window_location.y = 0

        if keys_pressed[pygame.K_LEFT]:
            self.game.window_location.x += movement_speed * delta_sec
            if self.game.window_location.x > 0:
                self.game.window_location.x = 0

        if keys_pressed[pygame.K_RIGHT]:
            self.game.window_location.x -= movement_speed * delta_sec





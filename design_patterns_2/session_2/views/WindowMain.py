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





        self.game = ControllerGame.new_game()  # calling new_game instance
        self.controller_game = ControllerGame()
        # self.controller_game.actor_controllers = [  # nestrada (abie controlleri manipule to pasu Actor() instanci)
        #     ControllerActorWarrior(),
        #     ControllerActorRider()
        # ]
        self.controller_game.actor_controllers = [ControllerActorWarrior(), ControllerActorRider()]
        self.game.actors = list(self.controller_game.actor_controllers)
        print(self.game.actors)

    def show(self):
        # main game loop
        time_last = time.time()
        while self.is_game_running:
            # get delta seconds
            self.screen.fill((0, 0, 0))
            time_current = time.time()
            delta_sec = time_current - time_last  # delta_sec == 0.01
            time_last = time_current

            # update
            self.update(delta_sec)

            pygame.display.update()
            time.sleep(0.01)

    def update(self, delta_sec):
        self.user_event(delta_sec)
        self.draw()
        self.draw_actors()

    def draw(self):
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
                        self.not_walking_maptiles.append([i * 52, j * 15])
                    else:
                        self.screen.blit(self.surface_water, dest=(26 + (i * 52) + self.game.window_location.x, j * 15 + self.game.window_location.y))
                        self.not_walking_maptiles.append([26 + (i * 52), j * 15])

    def draw_actors(self):
        self.screen.blit(self.surface_warrior, dest=(
            50 + self.controller_game.actor_controllers[0].actor.position.x + self.game.window_location.x,
            50 + self.controller_game.actor_controllers[0].actor.position.y + self.game.window_location.y)
                         # parvietojas nevis uz 52 bet uz 52 + 104. Tas nozime ka nevaru stradat ar atsevisko indeksu...
                         )

    def user_event(self, delta_sec):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    self.controller_game.update(self.game)

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





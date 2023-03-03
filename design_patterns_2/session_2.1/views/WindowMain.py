import random
import time
from random import randint
import pygame
from controllers.ControllerGame import ControllerGame
from models.enums.EnumMapTileType import EnumMapTileType


class WindowMain:
    def __init__(self):

        self.not_walking_maptiles = []
        self.direction = None  # warrior move direction
        self.screen = pygame.display.set_mode(
            (520, 500)
        )
        self.is_game_running = True
        self.clock = pygame.time.Clock()

        # SURFACES
        self.surface_ground = pygame.image.load('./resources/Tribes/Imperius/Imperius ground.png')
        self.surface_water = pygame.image.load('./resources/Tribes/Polaris/Polaris ground.png')
        # self.surface_dummy.set_colorkey((0,0,0)) # black -> transparent
        self.surface_warrior = pygame.image.load('./resources/Tribes/Imperius/Units/warrior.png')
        self.surface_rider = pygame.image.load('./resources/Tribes/Imperius/Units/rider.png')



        # movement
        self.vert_move = 0
        self.hor_move = 0

        # movement warrior
        self.vert_move_war = 0
        self.hor_move_war = 0

        # movement rider
        self.vert_move_rider = 0
        self.hor_move_rider = 0

        self.game = ControllerGame.new_game()  # calling new_game instance

    def show(self):
        # main game loop
        # time_last = pygame.time.get_ticks()
        while self.is_game_running:
            # get delta seconds
            # time_current = pygame.time.get_ticks()
            # delta_milisec = time_current - time_last
            # time_last = time_current

            # update
            self.update()

            pygame.display.update()
            self.clock.tick(60)
            # time.sleep(0.01)

    def update(self):
        if self.hor_move == 0 and self.vert_move == 0:  # game starts (map wasn't moved)
            self.draw()
            self.draw_warrior()
            self.draw_rider()
        if self.hor_move_war == 0 and self.vert_move_war == 0:  # start pos
            self.draw_warrior()
        if self.hor_move_rider == 0 and self.vert_move_rider == 0:  # start pos
            self.draw_rider()
        self.user_event()  # move_warrior() move_rider()

    def draw_warrior(self):
        self.screen.blit(self.surface_warrior, dest=(33 + self.hor_move_war, 8 + self.vert_move_war))  # 33/8 : center of a tile

    def draw_rider(self):
        self.screen.blit(self.surface_rider, dest=(59 + self.hor_move_rider, -7 + self.vert_move_rider))

    def move_warrior(self):
        while True:
            self.direction = random.choice([[26,15], [26,-15], [-26,15], [-26,-15]])
            self.hor_move_war += self.direction[0]
            self.vert_move_war += self.direction[1]

            if self.hor_move_war < 0:  # out of the map
                self.hor_move_war = 0
                self.vert_move_war -= self.direction[1]
                self.move_warrior()

            elif self.vert_move_war < 0:  # out of the map
                self.vert_move_war = 0
                self.hor_move_war -= self.direction[0]
                self.move_warrior()

            for i in range(len(self.not_walking_maptiles)):  # walks on water
                if self.not_walking_maptiles[i][0] == (self.hor_move_war + 26):
                    if self.not_walking_maptiles[i][1] == (self.vert_move_war + 30):  # if both coordinates match:
                        self.hor_move_war -= self.direction[0]  # cancel position changes
                        self.vert_move_war -= self.direction[1]
                        # nezinu ka pariet pie 80 rindas si vieta... continue / rekursija / else nestradaja
            self.screen.blit(self.surface_warrior, dest=(33 + self.hor_move_war, 8 + self.vert_move_war))
            return

    def move_rider(self):
        while True:
            self.direction = random.choice([[52,30], [52,-30], [-52,30], [-52,-30]])
            self.hor_move_rider += self.direction[0]
            self.vert_move_rider += self.direction[1]

            if self.hor_move_rider < 0:  # out of the map
                self.hor_move_rider = 0
                self.vert_move_rider -= self.direction[1]
                self.move_rider()

            elif self.vert_move_rider < 0:  # out of the map
                self.vert_move_rider = 0
                self.hor_move_rider -= self.direction[0]
                self.move_rider()

            for i in range(len(self.not_walking_maptiles)):
                if self.not_walking_maptiles[i][0] == (self.hor_move_rider + 52):
                    if self.not_walking_maptiles[i][1] == (self.vert_move_rider + 15):
                        self.hor_move_rider -= self.direction[0]
                        self.vert_move_rider -= self.direction[1]
            self.screen.blit(self.surface_rider, dest=(59 + self.hor_move_rider, -7 + self.vert_move_rider))
            return

    def draw(self):
        for j in range(self.game.map_size.y):
            for i in range(self.game.map_size.x):
                if self.game.map_tiles[i][j].tile_type == EnumMapTileType.Ground:
                    # surface = self.surface_ground
                    if j % 2:
                        self.screen.blit(self.surface_ground, dest=(i * 52, j * 15))
                    else:
                        self.screen.blit(self.surface_ground, dest=(26 + (i * 52), j * 15))
                elif self.game.map_tiles[i][j].tile_type == EnumMapTileType.Water:
                    if j % 2:
                        self.screen.blit(self.surface_water, dest=(i * 52, j * 15))
                        self.not_walking_maptiles.append([i * 52, j * 15])
                    else:
                        self.screen.blit(self.surface_water, dest=(26 + (i * 52), j * 15))
                        self.not_walking_maptiles.append([26 + (i * 52), j * 15])

    def move(self, horizontal: int = 0, vertical: int = 0):
        # slightly change dest parameters and add key events (after video)
        self.screen.fill('black')

        self.hor_move += horizontal
        self.vert_move += vertical

        if self.hor_move <= -4710: self.hor_move = -4710
        if self.hor_move >= 0: self.hor_move = 0

        if self.vert_move <= -1035: self.vert_move = -1035
        if self.vert_move >= 0: self.vert_move = 0

        for j in range(self.game.map_size.y):
            for i in range(self.game.map_size.x):
                if self.game.map_tiles[i][j].tile_type == EnumMapTileType.Ground:
                    # surface = self.surface_ground
                    if j % 2:
                        self.screen.blit(self.surface_ground, dest= (i * 52 + self.hor_move, j * 15 + self.vert_move))
                    else:
                        self.screen.blit(self.surface_ground, dest= (26 + (i * 52) + self.hor_move, j * 15 + self.vert_move))

                elif self.game.map_tiles[i][j].tile_type == EnumMapTileType.Water:
                    if (j % 2):
                        self.screen.blit(self.surface_water, dest= (i * 52 + self.hor_move, j * 15 + self.vert_move))
                    else:
                        self.screen.blit(self.surface_water, dest= (26 + (i * 52) + self.hor_move, j * 15 + self.vert_move))

    def user_event(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                exit()
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_DOWN:
                    self.move(vertical=-50)
                elif event.key == pygame.K_UP:
                    self.move(vertical=50)
                elif event.key == pygame.K_RIGHT:
                    self.move(horizontal=-50)
                elif event.key == pygame.K_LEFT:
                    self.move(horizontal=50)
                elif event.key == pygame.K_SPACE:
                    self.move_warrior()
                    self.move_rider()



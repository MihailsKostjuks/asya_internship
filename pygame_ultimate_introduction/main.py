import pygame
from sys import exit
from random import randint, random, choice


class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        player_walk_1 = pygame.image.load('graphics/player/player_walk_1.png').convert_alpha()
        player_walk_2 = pygame.image.load('graphics/player/player_walk_2.png').convert_alpha()
        self.player_jump = pygame.image.load('graphics/player/jump.png').convert_alpha()

        self.player_walk = [player_walk_1, player_walk_2]
        self.player_index = 0
        self.gravity = 0

        self.image = self.player_walk[self.player_index]
        self.rect = self.image.get_rect(midbottom=(80, 300))

    def player_input(self):
        keys = pygame.key.get_pressed()
        if keys[pygame.K_SPACE] and self.rect.bottom >= 300:
            self.gravity = -20

    def apply_gravity(self):
        self.gravity += 1
        self.rect.y += self.gravity
        if self.rect.bottom >= 300:
            self.rect.bottom = 300
            self.gravity = 0

    def animation_state(self):
        if self.rect.bottom < 300:  # in air
            self.image = self.player_jump
        else:
            self.player_index += 0.1
            if self.player_index >= len(self.player_walk):
                self.player_index = 0  # 0...1.9
            self.image = self.player_walk[int(self.player_index)]  # 0...0.9 == 0;  1...1.9 == 1

    def update(self):
        self.player_input()
        self.apply_gravity()
        self.animation_state()


class Obstacles(pygame.sprite.Sprite):
    def __init__(self, type_of_obstacle):
        super().__init__()
        if type_of_obstacle == 'fly':
            fly_1 = pygame.image.load('graphics/Fly/Fly1.png').convert_alpha()
            fly_2 = pygame.image.load('graphics/Fly/Fly2.png').convert_alpha()
            self.frames = [fly_1, fly_2]
            y_pos = 210
        else:
            snail_1 = pygame.image.load('graphics/snail/snail1.png').convert_alpha()
            snail_2 = pygame.image.load('graphics/snail/snail2.png').convert_alpha()
            self.frames = [snail_1, snail_2]
            y_pos = 300

        self.animation_index = 0
        self.image = self.frames[self.animation_index]
        self.rect = self.image.get_rect(midbottom=(randint(900, 1200), y_pos))

    def animation_state(self):
        self.animation_index += 0.1
        if self.animation_index >= len(self.frames):
            self.animation_index = 0  # 0...1.9
        self.image = self.frames[int(self.animation_index)]  # 0...0.9 == 0;  1...1.9 == 1

    def destroy(self):
        if self.rect.right < 0:
            self.kill()

    def update(self):
        self.animation_state()
        self.destroy()
        self.rect.x -= 6


def display_score():
    current_time = pygame.time.get_ticks() - start_time
    score_surface = text_font.render(f'score: {int(current_time/1000)}', False, (64, 64, 64))
    score_rectangle = score_surface.get_rect(center=(400, 50))
    pygame.draw.rect(screen, '#c0e8ec', score_rectangle)
    screen.blit(score_surface, score_rectangle)
    return current_time


def obstacle_movement(obstacle_list):  # functions that adds into the list snails
    if obstacle_list:  # checks whether emtpy or not
        for obstacle_rect in obstacle_list:
            obstacle_rect.x -= 5
            if obstacle_rect.right <= 0:
                obstacle_list.remove(obstacle_rect)
            if obstacle_rect.bottom == 300:
                screen.blit(snail_surface, obstacle_rect)
            else:
                screen.blit(fly_surface, obstacle_rect)

        return obstacle_list  # returns new obstacle_rect_list
    else:
        return []  # returns em


def collision(player, obstacles):
    if obstacles:
        for obstacle in obstacles:
            if obstacle.colliderect(player):
                return False
    return True


def player_animation():  # walking/ jumping
    global player_surface, player_index
    if player_rectangle.bottom < 300:  # in air
        player_surface = player_jump
    else:
        player_index += 0.1
        if player_index >= len(player_walk):
            player_index = 0  # 0...1.9
        player_surface = player_walk[int(player_index)]  # 0...0.9 == 0;  1...1.9 == 1


def sprite_collision():
    if pygame.sprite.spritecollide(player.sprite, obstacle_group, False):
        obstacle_group.empty()
        return False
    return True


pygame.init()  # starts pygame basically (images, sound etc)
game_active: bool = False
start_time: int = 0
score = 0
screen = pygame.display.set_mode((800, 400))  # size
pygame.display.set_caption('Runner')  # caption (window title)
clock = pygame.time.Clock()  # creating FPS clock
text_font = pygame.font.Font('font/Pixeltype.ttf', 50)  # initializing font

sky_surface = pygame.image.load('graphics/Sky.png').convert()  # loading and storing some images into variables
ground_surface = pygame.image.load('graphics/ground.png').convert()

player = pygame.sprite.GroupSingle()
player.add(Player())
obstacle_group = pygame.sprite.Group()

# intro screen
player_stand_surf = pygame.image.load('graphics/player/player_stand.png').convert_alpha()
player_stand_surf_scales = pygame.transform.scale2x(player_stand_surf)
player_stand_rect = player_stand_surf_scales.get_rect(center=(400, 200))

game_name = text_font.render('Pixel Runner', False, (111, 196, 169))
game_name_rectangle = game_name.get_rect(center=(400, 70))

game_message = text_font.render('Press SPACE to start', False, (111, 196, 169))
game_message_rectangle = game_message.get_rect(center=(400, 330))

# TIMER
obstacle_timer = pygame.USEREVENT + 1  # each 1.5s
pygame.time.set_timer(obstacle_timer, 1500)


while True:  # draw + update happens only in this while loop (60 times / second)
    # EVENT LOOP
    for event in pygame.event.get():
        if event.type == pygame.QUIT:  # for quitting
            pygame.quit()  # kills all the pygame content so any command starts with pygame can't be executed.
            exit()  # leaves this while loop (after we left the game we don't need to process other pygame commands).
        if game_active:
            if event.type == obstacle_timer:  # each 1.5s appends one snail to the list
                obstacle_group.add(Obstacles(choice(['fly', 'snail', 'snail', 'snail'] )))
        else:
            if event.type == pygame.KEYDOWN and event.key == pygame.K_SPACE:
                game_active = True
                start_time = pygame.time.get_ticks()

    if game_active:
        # SCORE
        score = display_score()

        # BACKGROUND
        screen.blit(sky_surface, (0, 0))
        screen.blit(ground_surface, (0, 300))

        # TITLE
        display_score()

        player.draw(screen)
        player.update()
        obstacle_group.draw(screen)
        obstacle_group.update()

        game_active = sprite_collision()

    else:
        screen.fill((94,129,162))

        score_message = text_font.render(f'Score: {int(score / 1000)}', False, (111, 196, 169))
        score_message_rectangle = score_message.get_rect(center=(400, 330))

        screen.blit(player_stand_surf_scales, player_stand_rect)
        screen.blit(game_name, game_name_rectangle)
        if score == 0:
            screen.blit(game_message, game_message_rectangle)
        else:
            screen.blit(score_message, score_message_rectangle)

    pygame.display.update()
    clock.tick(60)  # while loop runs with 60 FPS (frames per second)

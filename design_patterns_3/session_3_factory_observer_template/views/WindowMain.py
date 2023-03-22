import time
import random
from typing import Dict

import pygame
from pygame import Surface, key, Rect

from controllers.ControllerGame import ControllerGame
from models.Actor import Actor
from models.MapBuilding import MapBuilding
from models.enums.EnumActor import EnumActor
from models.enums.EnumBuilding import EnumBuilding
from models.enums.EnumMapTile import EnumMapTile
from models.enums.EnumTribe import EnumTribe
from views.components.ComponentButton import ComponentButton
from views.components.CreateWarriorButton import CreateWarriorButton
from views.resources.FactoryHoodrick import ResourceFactoryHoodrick
from views.resources.FactoryImperius import ResourceFactoryImperius
from views.resources.interfaces.IResourceFactory import IResourceFactory

#  from views.components.ComponentButton import ComponentButton
# from views.resources.ResourcesHoodrick import ResourcesHoodrick
# from views.resources.ResourcesImperius import ResourcesImperius
# from views.resources.interfaces.IResourceFactory import IResourceFactory

MAP_MOVEMENT_SPEED = 30

class WindowMain:
    def __init__(self):
        self.screen = pygame.display.set_mode(
            (500, 500)
        )
        self.is_game_running = True

        self.surfaces_by_map_tiles: Dict[EnumMapTile, Surface] = {
            EnumMapTile.Ground: pygame.image.load('./resources/Tribes/Imperius/Imperius ground.png'),
            EnumMapTile.Water: pygame.image.load('./resources/Miscellaneous/Shallow water.png')
        }
        self.surfaces_by_buildings: Dict[MapBuilding, Surface] = {}
        self.surfaces_by_actors: Dict[Actor.tribe, Surface] = {}
        """ seit vajag Actor nevis Actor.tribe bet es nesapratu kā tika izveidotas MapBuilding instances,
        tapec ari nevareju (nezinaju kā) to atkartot Actoriem. Nesapratu kur tur vispar tika izveidotas
        tie clašu MapBuilding instances un kā vini automatiski atrodas self.game.buildings sarakstā. """
        
        self.resource_factories_by_tribes: Dict[EnumTribe, IResourceFactory] = {  # abc class is used for typing
            EnumTribe.Imperius: ResourceFactoryImperius(),
            EnumTribe.Hoodrick: ResourceFactoryHoodrick()
        }

        self.game = ControllerGame.new_game()

        self.ui_button_new_game = ComponentButton(
            button_rect=Rect(5,5, 200, 40),
            button_text='New Game'
        )
        self.ui_button_new_game.add_listener_click(
            self.on_click_new_game  # pointer bez (). Nevis izsauc bet padod pointeri uz realo funkciju
        )
        self.ui_button_create_warrior: CreateWarriorButton = None

    def on_click_new_game(self):
        random.seed(time.time())
        self.game = ControllerGame.new_game()
        self.surfaces_by_actors = {}

    def on_click_create_warrior(self, tribe: EnumTribe):
        factory = self.resource_factories_by_tribes[tribe]
        if tribe == EnumTribe.Hoodrick:
            surface_warrior_hoodrick = factory.create_actor(EnumActor.Warrior)
            self.surfaces_by_actors[tribe] = surface_warrior_hoodrick
        elif tribe == EnumTribe.Imperius:
            surface_warrior_imperius = factory.create_actor(EnumActor.Warrior)
            self.surfaces_by_actors[tribe] = surface_warrior_imperius

    def show(self):
        # main game loop
        time_last = time.time()
        while self.is_game_running:
            self.screen.fill((0, 0, 0))

            # get delta seconds
            time_current = time.time()
            delta_sec = time_current - time_last
            time_last = time_current

            # update
            self.update(delta_sec)

            # draw
            self.draw()

            # update display
            pygame.display.flip()

            time.sleep(0.01)

    def update(self, delta_sec):

        self.mouse_pos = pygame.mouse.get_pos()
        self.mouse_buttons = pygame.mouse.get_pressed()
        self.ui_button_new_game.trigger_mouse(
            mouse_position=self.mouse_pos,
            mouse_button_state=self.mouse_buttons
        )

        buildings_unused = list(self.surfaces_by_buildings.keys())  # list of MapBuilding id's, List[MapBuilding]
        # from start - empty
        missing_buildings = list(self.game.buildings)  # copy a list only this way
        # also empty

        for building in self.surfaces_by_buildings.keys():  # iterating through dataclass MapBuilding instances
            if building in self.game.buildings:  # if this instance is in a List
                missing_buildings.remove(building)  # delete that instance from missing_buildings

        for building in self.game.buildings:  
            if building in buildings_unused:
                buildings_unused.remove(building)

        for new_building in missing_buildings:
            factory = self.resource_factories_by_tribes[new_building.tribe]
            self.surfaces_by_buildings[new_building] = factory.create_building(
                new_building.building_type,
                new_building.level
            )

        for building in buildings_unused:
            self.surfaces_by_buildings.pop(building)


        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.is_game_running = False
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    self.is_game_running = False

        keys_pressed = key.get_pressed()
        if keys_pressed[pygame.K_LEFT]:
            self.game.window_location.x -= MAP_MOVEMENT_SPEED * delta_sec
        if keys_pressed[pygame.K_RIGHT]:
            self.game.window_location.x += MAP_MOVEMENT_SPEED * delta_sec
        if keys_pressed[pygame.K_UP]:
            self.game.window_location.y -= MAP_MOVEMENT_SPEED * delta_sec
        if keys_pressed[pygame.K_DOWN]:
            self.game.window_location.y += MAP_MOVEMENT_SPEED * delta_sec

        self.game.window_location.x = max(0, self.game.window_location.x)
        self.game.window_location.x = min(self.game.map_size.x - self.game.window_size.x - 1,
                                          self.game.window_location.x)
        self.game.window_location.y = max(0, self.game.window_location.y)
        self.game.window_location.y = min(self.game.map_size.y - self.game.window_size.y - 1,
                                          self.game.window_location.y)

    def draw(self):
        view_x_start = int(self.game.window_location.x)
        view_x_end = view_x_start + self.game.window_size.x + 1
        view_y_start = int(self.game.window_location.y)
        view_y_end = view_y_start + self.game.window_size.y + 1

        # show map edges
        view_i_offset = 0
        if view_x_start > 0:
            view_x_start -= 1
            view_i_offset -= 52
        if view_x_end < self.game.map_size.x:
            view_x_end += 1

        view_j_offset = 0
        if view_y_start > 0:
            view_y_start -= 1
            view_j_offset -= 15
        if view_y_end < self.game.map_size.y:
            view_y_end += 1

        for view_j, j in enumerate(range(view_y_start, view_y_end)):
            for view_i, i in enumerate(range(view_x_start, view_x_end)):
                map_tile = self.game.map_tiles[j][i]
                map_tile_type = map_tile.tile_type
                map_tile_surface = self.surfaces_by_map_tiles[map_tile_type]
                i_offset = 26 if j % 2 == 1 else 0
                self.screen.blit(map_tile_surface, (
                    view_i * 52 + i_offset + view_i_offset,
                    view_j * 15 + view_j_offset
                ))

        for building, surface in self.surfaces_by_buildings.items():  # its dictionary so we can iterate key/values
            i = building.position.x - int(self.game.window_location.x)
            j = building.position.y - int(self.game.window_location.y)
            i_offset = 26 if building.position.y % 2 == 1 else 0
            self.screen.blit(surface, (
                i * 52 + i_offset + view_i_offset,
                j * 15 + view_j_offset
            ))


            self.ui_button_create_warrior = CreateWarriorButton(
                button_rect=Rect(
                    i * 52 + i_offset + view_i_offset,
                    j * 15 + view_j_offset, 40, 40
                ),
                tribe = building.tribe
            )
            self.ui_button_create_warrior.draw(self.screen)
            self.ui_button_create_warrior.add_listener_click(
                self.on_click_create_warrior
            )
            self.ui_button_create_warrior.trigger_mouse(
                mouse_position=self.mouse_pos,
                mouse_button_state=self.mouse_buttons
            )
            # seit ari padot blit pogu pie katras building ar atbilstosiem koordinatiem
            try:
                for tribe in self.surfaces_by_actors.keys():
                    if tribe == building.tribe:
                        self.screen.blit(
                            self.surfaces_by_actors[tribe],
                            dest=(
                                i * 52 + i_offset + view_i_offset + 50,
                                j * 15 + view_j_offset, 40, 40 + 50
                            )
                        )
            except:
                pass

        self.ui_button_new_game.draw(self.screen)

        # TODO buildings DONE
        # TODO actors
        # TODO UI











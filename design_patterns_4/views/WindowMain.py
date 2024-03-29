import time
import random
from typing import Dict, List

import pygame
from pygame import Surface, key, Rect

from controllers.ControllerActorKnight import ControllerActorKnight
from controllers.ControllerActorRider import ControllerActorRider
from controllers.ControllerActorWarrior import ControllerActorWarrior
from controllers.ControllerGame import ControllerGame
from models.Actor import Actor
from models.enums.EnumActor import EnumActor
from models.enums.EnumBuilding import EnumBuilding
from models.enums.EnumMapTile import EnumMapTile
from models.enums.EnumTribe import EnumTribe
from utils.FactoryActor import FactoryControllerActor
from utils.iterator.CollectionActorContSurf import CollectionActorContSurf
from utils.iterator.CollectionActorControllers import CollectionActorControllers
from views.components.ComponentButton import ComponentButton
from views.resources.ResourcesHoodrick import ResourcesHoodrick
from views.resources.ResourcesImperius import ResourcesImperius
from views.resources.interfaces.IResourceFactory import IResourceFactory

MAP_MOVEMENT_SPEED = 30


class WindowMain:
    __instance = None  # ? no typing otherwise he won't understand what we imported right here

    @staticmethod
    def instance():
        if WindowMain.__instance is None:
            WindowMain.__instance = WindowMain()
        return WindowMain.__instance

    def __init__(self):
        if WindowMain.__instance is not None:  # cannot create the 2nd WindowMain class instance
            raise Exception("Only one instance of singleton allowed")
        WindowMain.__instance = self

        pygame.init()

        self.screen = pygame.display.set_mode(
            (500, 500)
        )
        self.font_stats = pygame.font.SysFont('Comic Sans MS', 18)

        self.is_game_running = True
        self.selected_building = None
        self.collection_cont_actors = None

        self.turn_tribe = EnumTribe.NotSet
        self.turn_actors_played = []
        self.turn_actors_played_timeout = 0

        self.resources_by_tribe: Dict[EnumTribe, IResourceFactory] = {
            EnumTribe.Imperius: ResourcesImperius(),
            EnumTribe.Hoodrick: ResourcesHoodrick(),
        }

        self.surfaces_by_map_tiles: Dict[EnumMapTile, Surface] = {
            EnumMapTile.Ground: pygame.image.load('./resources/Tribes/Imperius/Imperius ground.png'),
            EnumMapTile.Water: pygame.image.load('./resources/Miscellaneous/Shallow water.png')
        }

        self.controllers_actors = []

        self.ui_components = []
        self.ui_actor_buttons = []

        ui_button_new_game = ComponentButton(
            Rect(5, 5, 140, 40),
            'New game'
        )

        ui_button_new_game.add_listener_click(self.on_click_new_game)
        self.ui_components.append(ui_button_new_game)

        ui_button_actor = ComponentButton(
            Rect(100, 430, 100, 40),
            'Warrior',
            linked_enum=EnumActor.Warrior,
            is_visible=False
        )
        ui_button_actor.add_listener_click(self.on_click_create_actor)
        self.ui_components.append(ui_button_actor)
        self.ui_actor_buttons.append(ui_button_actor)

        ui_button_actor = ComponentButton(
            Rect(215, 430, 80, 40),
            'Rider',
            linked_enum=EnumActor.Rider,
            is_visible=False
        )
        ui_button_actor.add_listener_click(self.on_click_create_actor)
        self.ui_components.append(ui_button_actor)
        self.ui_actor_buttons.append(ui_button_actor)

        ui_button_actor = ComponentButton(
            Rect(310, 430, 90, 40),
            'Knight',
            linked_enum=EnumActor.Knight,
            is_visible=False
        )
        ui_button_actor.add_listener_click(self.on_click_create_actor)
        self.ui_components.append(ui_button_actor)
        self.ui_actor_buttons.append(ui_button_actor)

        self.actor_surfaces: List[pygame.Surface] = []

        self.collectionActorContSurf: List[CollectionActorContSurf] = []

        self.tribe_turn: EnumTribe = EnumTribe.NotSet  # which tribe does a turn rn

        self.turn_counter_imperius: int = 0
        self.turn_counter_hoodrick: int = 0

        self.turn_counter: int = 0

        self.new_game()

    def new_game(self):
        self.game = ControllerGame.instance().new_game()

        # remove buttons that are linked with game elements
        self.ui_components = [it for it in self.ui_components if it.linked_item is None]

        # add ComponentButton over each building
        for building in self.game.buildings:
            ui_button_building = ComponentButton(
                rect=Rect(
                    0,
                    0,
                    52,
                    52
                ),
                is_transparent=True,
                linked_item=building
            )
            if building.tribe == EnumTribe.Imperius:
                ui_button_do_turn: ComponentButton = ComponentButton(
                    rect=Rect(400, 5, 95, 35),
                    text='Imperius',
                    linked_enum=EnumTribe.Imperius
                )
            else:
                ui_button_do_turn = ComponentButton(
                    rect=Rect(400, 45, 95, 35),
                    text='Hoodrick',
                    linked_enum=EnumTribe.Hoodrick
                )

            self.ui_components.append(ui_button_building)
            self.ui_components.append(ui_button_do_turn)

            ui_button_building.add_listener_click(self.on_click_building)
            ui_button_do_turn.add_listener_click(self.on_click_do_turn)

        self.turn_tribe = EnumTribe.Imperius
        self.turn_actors_played = []

        self.controllers_actors = []

        self.turn_counter = 0

    def on_click_new_game(self, button):
        random.seed(time.time())
        self.new_game()

    def on_click_building(self, button):
        self.selected_building = button.linked_item
        if self.selected_building:
            for ui_button in self.ui_actor_buttons:
                ui_button.is_visible = True

    def hide_ui_actor_buttons(self):
        if self.ui_actor_buttons[0].is_visible:
            for ui_button in self.ui_actor_buttons:
                ui_button.is_visible = False

    ############### actor & cont_actor factory ###############
    def on_click_create_actor(self, button: ComponentButton):  # after button is clicked,
        """creates an actor dataclass and appropriate controller"""
        # TODO create factory for actors
        # actor = Actor()
        # actor.position = self.selected_building.position.copy()
        # actor.position.x += random.randint(-2, 2)
        # actor.position.y += random.randint(-2, 2)
        # actor.tribe = self.selected_building.tribe
        # actor.actor_type = button.linked_enum
        # actor_type = actor.actor_type
        # self.game.actors.append(actor)
        actor_position = self.selected_building.position
        actor_tribe = self.selected_building.tribe
        actor_type = button.linked_enum

        actor = ControllerGame.instance().create_actors(  # migrate windowmain code into controller. (good try)?
            actor=Actor(),
            actor_position=self.selected_building.position,
            actor_tribe=self.selected_building.tribe,
            actor_type=button.linked_enum
        )
        controller = None
        # 1.point (punkts)
        controller = FactoryControllerActor().create_controller(actor)  # ?(type_error) 1. factory cont
        self.controllers_actors.append(controller)  # 2. append cont into list
        self.collection_cont_actors = CollectionActorControllers(self.controllers_actors)  # update iterator

        actor_type = actor.actor_type
        actor_surface = self.resources_by_tribe[actor.tribe].get_actor(
            enum_actor=actor_type
        )
        self.actor_surfaces.append(actor_surface)

    ############### TURN IMPLEMENTATION ###############
    def on_click_do_turn(self, button: ComponentButton):
        # observer pattern (one of the listeners)
        button = button
        # TODO make turn for actors
        for actor_tribe, controller_actors in self.collection_cont_actors:
            if actor_tribe == button.linked_enum:
                # connecting tribe & button (by the tribe)
                if actor_tribe == EnumTribe.Imperius:
                    self.turn_counter_imperius += 1
                elif actor_tribe == EnumTribe.Hoodrick:
                    self.turn_counter_hoodrick += 1
                for controller_actor in controller_actors:
                    # iterating through all controllers
                    # that have button's tribe
                    controller_actor.do_turn()

    # main loop
    def show(self):
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

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                self.is_game_running = False
            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_ESCAPE:
                    self.is_game_running = False

        keys_pressed = key.get_pressed()
        if keys_pressed[0]:
            self.hide_ui_actor_buttons()
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

        mouse_pos = pygame.mouse.get_pos()
        mouse_buttons = pygame.mouse.get_pressed()

        is_clicked = False
        for ui_component in self.ui_components:
            is_clicked = ui_component.trigger_mouse(mouse_pos, mouse_buttons)
            if is_clicked:
                break
        if mouse_buttons[0] and not is_clicked:
            self.selected_building = None
            self.hide_ui_actor_buttons()

        # updates iterator
        self.collectionActorContSurf = CollectionActorContSurf(
            actor_controllers=self.controllers_actors,  # manipulates actor
            actor_surfaces=self.actor_surfaces  # draws appropriate model using actor's coordinates
        )

        # self.turn_actors_played_timeout += delta_sec
        # if self.turn_actors_played_timeout > 5:  # each 5 sec make a turn
        #     self.turn_actors_played_timeout = 0
            # # TODO make turn for actors
            # for each in self.collection_cont_actors:  # always using a once made list of 2 tuples (ofc it updates)
            #     tribe = each[0]
            #     controller_actors: List = each[1]
            #     if tribe == self.turn_tribe:  # checking which tribe makes a turn now
            #         for controller_actor in controller_actors:  # iterating through all controllers
            #             if controller_actor.actor not in self.turn_actors_played:  # if turn was not executed yet
            #                 controller_actor.do_turn()
            #                 # break  # add some 5 lines to implement this for loop correctly

        # gets self.tribe_turn value (needed for displaying turn counter rect)
        for actor_controller in self.controllers_actors:
            if actor_controller.update(delta_sec):  # calls update method & gets true/false if model is moving rn
                self.tribe_turn = actor_controller.actor.tribe  # which model tribe is moving - this tribe has a turn
            else:
                self.tribe_turn = EnumTribe.NotSet

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
                if j < len(self.game.map_tiles) >= 0 and i < len(self.game.map_tiles[j]) >= 0:
                    map_tile = self.game.map_tiles[j][i]
                    map_tile_type = map_tile.tile_type
                    map_tile_surface = self.surfaces_by_map_tiles[map_tile_type]
                    i_offset = 26 if j % 2 == 1 else 0
                    self.screen.blit(map_tile_surface, (
                        view_i * 52 + i_offset + view_i_offset,
                        view_j * 15 + view_j_offset
                    ))

        # draws buildings
        for item in self.game.buildings:
            item_surface: pygame.Surface
            item_surface = self.resources_by_tribe[item.tribe].get_building(
                item.building_type,
                item.level
            )
            i = item.position.x - int(self.game.window_location.x)
            j = item.position.y - int(self.game.window_location.y)
            i_offset = 26 if item.position.y % 2 == 1 else 0
            x = i * 52 + i_offset + view_i_offset
            y = j * 15 + view_j_offset
            self.screen.blit(item_surface, (x, y))

            for ui_component in self.ui_components:
                if ui_component.linked_item == item:
                    ui_component.offset_x = x
                    ui_component.offset_y = y
                    break

        # draws buttons
        for ui_component in self.ui_components:
            ui_component.draw(self.screen)

        # reads actor positions and draws appropriate surface
        for actor_cont, actor_surface in self.collectionActorContSurf:
            actor: Actor = actor_cont.actor
            i = actor.position.x - int(self.game.window_location.x)  # a bit repeated code but no idea how to avoid it
            j = actor.position.y - int(self.game.window_location.y)
            i_offset = 26 if actor.position.y % 2 == 1 else 0
            x = i * 52 + i_offset + view_i_offset
            y = j * 15 + view_j_offset
            self.screen.blit(actor_surface, (x, y))

        # displays tribe & turn
        if self.tribe_turn != EnumTribe.NotSet:
            if self.tribe_turn == EnumTribe.Imperius:
                self.turn_counter = self.turn_counter_imperius
            elif self.tribe_turn == EnumTribe.Hoodrick:
                self.turn_counter = self.turn_counter_hoodrick
            text_stats = self.font_stats.render(f'{self.tribe_turn}: {self.turn_counter}', True, pygame.Color("black"))
            text_stats_rect = text_stats.get_rect()
            text_stats_rect.center = (250, 20)
            pygame.draw.ellipse(self.screen, pygame.Color("white"), (150, -50, 200, 100))
            self.screen.blit(text_stats, text_stats_rect)

"""
1. done
2. why return building?
3. EventComponentButton not implemented,
everything was done via ComponentButton & new listener func in WM
4. was pretty hard. Do I need to implement many methods 
in CongrollerGame and call them inside WindowMain? (see example)
5. done
"""
















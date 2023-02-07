from abc import ABCMeta, abstractmethod


class Game:
    def __init__(self, map_size, turn, x, y, season, items, actor):
        self.map_size = map_size
        self.turn = turn
        self.__map_tiles = MapTile(x, y, season, items, actor) # AGGREGATION

    def get_map_tiles(self):
        return self.__map_tiles.get_Vector2D(), self.__map_tiles.get_season(), self.__map_tiles.get_items(), self.__map_tiles.get_actor()

    def new_game(self):
        pass

    def update_step(self, tribe, actor):
        pass


class MapTile:
    def __init__(self, x, y, season, items, actor):
        # Making an object in which we are
        # calling the Vector2D class
        # with proper arguments.
        self.position = Vector2D(x, y)  # COMPOSITION

        self.season = EnumSeason(season)  # no idea how to use association, so I decided to use the composition again
        self.items_on_tile = items # AGGREGATION. Initializing the item parameter
        self.actor_on_tile = actor

    # Method which gets x and y positions
    # with the help of get_Vector2D() method
    # declared in the Vector2D class
    def get_Vector2D(self):
        return self.position.get_Vector2D()

    def get_season(self):
        return self.season.get_season()

    def get_items(self):
        return self.items_on_tile.get_items()

    def get_actor(self):
        return self.actor_on_tile.get_actor()


class Vector2D:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def get_Vector2D(self):
        return self.x, self.y

    def __add__(self, other):
        pass

    def __sub__(self, other):
        pass


class EnumSeason:
    def __init__(self, season): # SETTING Season
        if season == 'Winter':
            self.season = 'Winter'
        elif season == 'Summer':
            self.season = 'Summer'
        else:
            self.season = None

    def get_season(self):
        return self.season


class Land(MapTile):
    pass


class Mountain(MapTile):
    pass


class Water(MapTile):
    pass


class Item:
    def __init__(self, is_consumable, coins_collect): # SETTING ITEM ATTRIBUTES
        self.is_consumable = is_consumable
        self.coins_collect = coins_collect

    def get_items(self):
        return self.is_consumable, self.coins_collect


class Fruit(Item):
    def collect(self):
        pass


class Forest(Item):
    pass


class Building(Item): # Class Building inherits class Item
    def __init__(self, is_consumable, coins_collect, level):
        super().__init__(is_consumable, coins_collect)
        self.level = level  # additionally overrides one  attribute

    def get_items(self):
        return super().get_items(), self.level


class Sawmill(Building):
    pass


class Village(Building):
    def capture(self):
        pass


class City(Village):
    pass


class IActor(metaclass=ABCMeta): # interface implemented as abstract class
    @abstractmethod # with abstract methods
    def move(self):
        pass

    @abstractmethod
    def get_actor(self):
        pass


class Actor(IActor):
    def __init__(self, tribe, coins_cost, move_steps, power_attack, power_defense, experience, level):
        self.tribe = EnumTribe(tribe)
        self.coins_cost = coins_cost
        self.move_steps = move_steps
        self.power_attack = power_attack
        self.power_defense = power_defense
        self.experience = experience
        self.level = level

    def move(self, x, y):
        self.x = x
        self.y = y

    def get_actor(self):
        return self.tribe.get_tribe(), self.coins_cost, self.move_steps, self.power_attack, self.power_defense, self.experience, self.level


class EnumTribe:
    def __init__(self, tribe):
        if tribe == 'Player':
            self.tribe = 'Player'
        elif tribe == 'Opponent':
            self.tribe = 'Opponent'
        else:
            self.tribe = None

    def get_tribe(self):
        return self.tribe


class Warrior(Actor):
    pass


class Horseman(Actor):
    pass


class Knight(Horseman):
    pass

# AGGREGATION: creating an object of the abstract class Actor (Interface) in which we are passing the required parameters
knight = Knight('Player', 10, 10, 20, 30, 0, 3)

# AGGREGATION: creating an object of the Item class in which we are passing the required parameters
items = Item(True, 100)

# Now we are passing the same 'items' and 'knight' objects we created earlier as a parameter to Game class
game = Game(10,5,100,200,'Winter', items, knight)

print(game.get_map_tiles())


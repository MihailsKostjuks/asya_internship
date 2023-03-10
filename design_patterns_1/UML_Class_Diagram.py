from abc import ABCMeta, abstractmethod
from enum import Enum
from typing import List


class EnumTribe(str, Enum):
    NotSet = 'NotSet'
    Player = 'Player'
    Opponent = 'Opponent'

    def __str__(self):
        return self.value

    def __hash__(self):
        return self.value


class EnumSeason(str, Enum):
    NotSet = 'NotSet'
    Winter = 'Winter'
    Summer = 'Summer'

    def __str__(self):
        return self.value

    def __hash__(self):
        return self.value


class MapTile:
    def __init__(self):
        self.position = Vector2D()
        self.season: EnumSeason = EnumSeason.NotSet
        self.tribe: EnumTribe = EnumTribe.NotSet
        self.items_on_tile: List[Item] = []
        self.actor_on_tile: List[Actor] = []


class Game:
    def __init__(self):
        self.map_size: int = 0
        self.turn: int = 0
        self.__mapTiles: List[MapTile] = []

    def get_map_tiles(self) -> List[MapTile]:
        return self.__mapTiles

    def new_game(self):
        pass

    def update_step(self, tribe: EnumTribe, actor: Actor()):
        pass


class Vector2D:
    def __init__(self):
        self.x: float
        self.y: float

    def __add__(self):
        pass

    def __sub__(self):
        pass


class Land(MapTile):
    def __init__(self):
        super().__init__()


class Mountain(MapTile):
    def __init__(self):
        super().__init__()


class Water(MapTile):
    def __init__(self):
        super().__init__()


class Item:
    def __init__(self):  # SETTING ITEM ATTRIBUTES
        self.is_consumable: bool
        self.coins_collect: bool


class Fruit(Item):
    def __init__(self):
        super().__init__()

    def collect(self):
        pass


class Forest(Item):
    def __init__(self):
        super().__init__()


class Building(Item):  # Class Building inherits class Item
    def __init__(self):
        super().__init__()
        self.level: int  # additionally overrides one  attribute


class Sawmill(Building):
    def __init__(self):
        super().__init__()


class Village(Building):
    def __init__(self):
        super().__init__()

    def capture(self):
        pass


class City(Village):
    def __init__(self):
        super().__init__()


class IActor(metaclass=ABCMeta):  # interface implemented as abstract class
    @abstractmethod  # with abstract methods
    def move(self, position: Vector2D()):
        pass


class Actor(IActor):
    def __init__(self):
        self.tribe = EnumTribe.NotSet
        self.coins_cost: int
        self.move_steps: int
        self.power_attack: int
        self.power_defense: int
        self.experience: int
        self.level: int

    def move(self, position: Vector2D()):
        pass


class Warrior(Actor):
    def __init__(self):
        super().__init__()


class Horseman(Actor):
    def __init__(self):
        super().__init__()


class Knight(Horseman):
    def __init__(self):
        super().__init__()


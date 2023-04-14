from dataclasses import field
from dataclasses import dataclass
from typing import List

from dataclasses_json import dataclass_json

from models.Actor import Actor
from models.MapItem import MapItem
from models.MapTile import MapTile
from models.Vector2D import Vector2D


@dataclass_json
@dataclass
class Game:
    turn: int = 0
    start: int = 0
    map_size: Vector2D = field(default_factory=Vector2D)
    window_size: Vector2D = field(default_factory=Vector2D)
    window_location: Vector2D = field(default_factory=Vector2D)
    map_tiles: List[List[MapTile]] = field(default_factory=list)
    map_items: List[MapItem] = field(default_factory=list)
    actors: List[Actor] = field(default_factory=list)

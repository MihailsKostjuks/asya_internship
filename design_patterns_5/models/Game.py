from dataclasses import field
from dataclasses import dataclass
from typing import List

from dataclasses_json import dataclass_json

from models.Actor import Actor
from models.MapBuilding import MapBuilding
from models.MapItem import MapItem
from models.MapTile import MapTile
from models.Vector2D import Vector2D
from models.enums.EnumTribe import EnumTribe


@dataclass_json
@dataclass
class Game:
    map_size: Vector2D = field(default_factory=Vector2D)

    window_size: Vector2D = field(default_factory=Vector2D)
    window_location: Vector2D = field(default_factory=Vector2D)

    # Python 3.10
    # map_tiles: list[list[MapTile]] = field(default_factory=list)
    map_tiles: List[List[MapTile]] = field(default_factory=list)
    items: List[MapItem] = field(default_factory=list)
    buildings: List[MapBuilding] = field(default_factory=list)
    actors: List[Actor] = field(default_factory=list)

    turn_actors_uuid_played: List[str] = field(default_factory=list)
    turn_actors_played_timeout: float = 0

    turn: int = 1
    stars: int = 0

    player_tribe = EnumTribe.Imperius
    turn_tribe = EnumTribe.Imperius

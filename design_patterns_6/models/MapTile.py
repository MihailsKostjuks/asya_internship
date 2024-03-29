from dataclasses import field
from dataclasses import dataclass
from models.Vector2D import Vector2D
from models.enums.EnumMapTile import EnumMapTile
from dataclasses_json import dataclass_json
import uuid

@dataclass_json
@dataclass
class MapTile:
    uuid: str = uuid.uuid4()
    position: Vector2D = field(default_factory=Vector2D)
    tile_type: EnumMapTile = EnumMapTile.NotSet


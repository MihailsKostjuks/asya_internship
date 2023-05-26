from dataclasses import field
from dataclasses import dataclass
from models.Vector2D import Vector2D
from dataclasses_json import dataclass_json
from models.enums.EnumMapItem import EnumMapItem
import uuid


@dataclass_json
@dataclass
class MapItem:
    uuid: str = uuid.uuid4()
    position: Vector2D = field(default_factory=Vector2D)
    item_type: EnumMapItem = EnumMapItem.NotSet

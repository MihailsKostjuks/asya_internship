from dataclasses import field
from dataclasses import dataclass
from models.Vector2D import Vector2D
from dataclasses_json import dataclass_json

from models.enums.EnumBuilding import EnumBuilding
from models.enums.EnumTribe import EnumTribe
import uuid

@dataclass_json
@dataclass
class MapBuilding:
    uuid: str = uuid.uuid4()
    position: Vector2D = field(default_factory=Vector2D)
    building_type: EnumBuilding = EnumBuilding.NotSet
    tribe: EnumTribe = EnumTribe.NotSet
    level = 1
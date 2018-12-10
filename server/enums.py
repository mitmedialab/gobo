import enum
import json

# class EnumEncoder(json.JSONEncoder):
#     def default(self, obj):
#         if isinstance(obj, enum.Enum):
#             return obj.name
#         return json.JSONEncoder.default(self, obj)


class GenderEnum(enum.Enum):
    female = 1
    male = 2
    unknown = 3

    @classmethod
    def fromString(cls, string):
        if string.lower() == "female":
            return cls.female
        elif string.lower() == "male":
            return cls.male
        else:
            return cls.unknown


class PoliticsEnum(enum.Enum):
    left = 1
    center_left = 2
    center = 3
    center_right = 4
    right = 5


class EchoRangeEnum(enum.Enum):
    narrow = 0
    mid_narrow = 1
    mid = 2
    mid_wide = 3
    wide = 4

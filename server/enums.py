import enum


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
        return cls.unknown

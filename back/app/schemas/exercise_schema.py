from pydantic import BaseModel

class ExerciseSchema(BaseModel):
    name: str
    muscle_group: str
    sets: int
    reps: int
    weight: float
    day: str
    completed: bool = False

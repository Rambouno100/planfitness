from app.models.exercise_model import Exercise
from app.schemas.exercise_schema import ExerciseSchema
from db import db

class ExerciseService:
    def get_all(self, user_id: int) -> list[Exercise]:
        exercises = Exercise.query.filter_by(
            user_id=user_id,
            is_active=True
        )
        return exercises

    def get_by_id(self, id: int, user_id: int) -> Exercise | None:
        exercise = Exercise.query.filter_by(
            id=id,
            user_id=user_id,
            is_active=True
        ).first()
        return exercise

    def create(self, data: ExerciseSchema, user_id: int) -> Exercise:
        exercise = Exercise(
            name=data.name,
            muscle_group=data.muscle_group,
            sets=data.sets,
            reps=data.reps,
            weight=data.weight,
            day=data.day,
            user_id=user_id
        )
        db.session.add(exercise)
        db.session.commit()
        return exercise

    def update(self, exercise: Exercise, data: ExerciseSchema) -> Exercise:
        exercise.name = data.name
        exercise.muscle_group = data.muscle_group
        exercise.sets = data.sets
        exercise.reps = data.reps
        exercise.weight = data.weight
        exercise.day = data.day
        exercise.completed = data.completed
        db.session.commit()
        return exercise

    def delete(self, exercise: Exercise) -> None:
        exercise.is_active = False
        db.session.commit()
        return None

exercise_service = ExerciseService()

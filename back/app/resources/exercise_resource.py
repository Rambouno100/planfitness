from flask_restful import Resource
from flask import request
from pydantic import ValidationError
from app.schemas.exercise_schema import ExerciseSchema
from app.services.exercise_service import exercise_service
from app.utils.helpers import CryptoHelper
from flask_jwt_extended import jwt_required, get_jwt_identity

crypto = CryptoHelper()

def current_user_id():
    identity = get_jwt_identity()
    return int(crypto.decrypt(identity))

class ExerciseResource(Resource):
    @jwt_required()
    def get(self):
        """Lista los ejercicios del usuario
        ---
        tags: [Exercises]
        responses:
          200: {description: Lista de ejercicios}
        """
        try:
            exercises = exercise_service.get_all(current_user_id())
            return [exercise.to_json() for exercise in exercises], 200
        except Exception as e:
            return {
                'error': str(e)
            }, 400

    @jwt_required()
    def post(self):
        """Crea un ejercicio
        ---
        tags: [Exercises]
        parameters:
          - in: body
            name: body
            schema:
              properties:
                name: {type: string}
                muscle_group: {type: string}
                sets: {type: integer}
                reps: {type: integer}
                weight: {type: number}
                day: {type: string}
        responses:
          200: {description: Ejercicio creado}
          400: {description: Datos invalidos}
        """
        try:
            data = request.get_json()
            validated_data = ExerciseSchema.model_validate(data)

            exercise = exercise_service.create(validated_data, current_user_id())

            return exercise.to_json(), 200
        except ValidationError as e:
            return {
                'error': e.errors()
            }, 400
        except Exception as e:
            return {
                'error': str(e)
            }, 400

class ManageExerciseResource(Resource):
    @jwt_required()
    def get(self, exercise_id: int):
        """Trae un ejercicio por su id
        ---
        tags: [Exercises]
        parameters:
          - {in: path, name: exercise_id, type: integer, required: true}
        responses:
          200: {description: Ejercicio}
          404: {description: No existe}
        """
        try:
            exercise = exercise_service.get_by_id(exercise_id, current_user_id())

            if not exercise:
                return {
                    'error': 'Exercise not found'
                }, 404

            return exercise.to_json(), 200
        except Exception as e:
            return {
                'error': str(e)
            }, 400

    @jwt_required()
    def put(self, exercise_id: int):
        """Edita un ejercicio (tambien sirve para marcarlo como hecho)
        ---
        tags: [Exercises]
        parameters:
          - {in: path, name: exercise_id, type: integer, required: true}
          - in: body
            name: body
            schema:
              properties:
                name: {type: string}
                muscle_group: {type: string}
                sets: {type: integer}
                reps: {type: integer}
                weight: {type: number}
                day: {type: string}
                completed: {type: boolean}
        responses:
          200: {description: Ejercicio actualizado}
          404: {description: No existe}
        """
        try:
            data = request.get_json()
            validated_data = ExerciseSchema.model_validate(data)

            exercise = exercise_service.get_by_id(exercise_id, current_user_id())

            if not exercise:
                return {
                    'error': 'Exercise not found'
                }, 404

            updated_exercise = exercise_service.update(exercise, validated_data)

            return updated_exercise.to_json(), 200
        except ValidationError as e:
            return {
                'error': e.errors()
            }, 400
        except Exception as e:
            return {
                'error': str(e)
            }, 400

    @jwt_required()
    def delete(self, exercise_id: int):
        """Elimina un ejercicio
        ---
        tags: [Exercises]
        parameters:
          - {in: path, name: exercise_id, type: integer, required: true}
        responses:
          200: {description: Eliminado}
          404: {description: No existe}
        """
        try:
            exercise = exercise_service.get_by_id(exercise_id, current_user_id())

            if not exercise:
                return {
                    'error': 'Exercise not found'
                }, 404

            exercise_service.delete(exercise)

            return None, 200
        except Exception as e:
            return {
                'error': str(e)
            }, 400

class ExerciseProgressResource(Resource):
    @jwt_required()
    def get(self):
        """Progreso de la semana

        Cuenta por dia cuantos ejercicios van completados y saca el porcentaje.
        ---
        tags: [Exercises]
        responses:
          200: {description: Progreso por dia y de la semana}
        """
        try:
            progress = exercise_service.get_progress(current_user_id())
            return progress, 200
        except Exception as e:
            return {
                'error': str(e)
            }, 400
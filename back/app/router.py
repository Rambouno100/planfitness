from flask_restful import Api
from app import app
from app.resources.auth_resource import *
from app.resources.exercise_resource import *

api = Api(app, prefix='/api/v1')

api.add_resource(RegisterResource, '/auth/register')
api.add_resource(LoginResource, '/auth/login')

api.add_resource(ExerciseResource, '/exercises')
api.add_resource(ExerciseProgressResource, '/exercises/progress')
api.add_resource(ManageExerciseResource, '/exercises/<int:exercise_id>')

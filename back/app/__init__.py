from flask import Flask
from db import db
from config import Config
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flasgger import Swagger

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)
CORS(app)
swagger = Swagger(app)

from app.models import (
    user_model,
    exercise_model
)

from app import router

from db import db
from sqlalchemy import Integer, String, Float, Boolean, DateTime, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from datetime import datetime

class Exercise(db.Model):
    __tablename__ = 'exercises'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, unique=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    muscle_group: Mapped[str] = mapped_column(String(100), nullable=False)
    sets: Mapped[int] = mapped_column(Integer, nullable=False)
    reps: Mapped[int] = mapped_column(Integer, nullable=False)
    weight: Mapped[float] = mapped_column(Float, nullable=False)
    day: Mapped[str] = mapped_column(String(20), nullable=False)
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=func.now())

    def to_json(self):
        return {
            'id': self.id,
            'name': self.name,
            'muscle_group': self.muscle_group,
            'sets': self.sets,
            'reps': self.reps,
            'weight': self.weight,
            'day': self.day,
            'completed': self.completed,
            'is_active': self.is_active,
            'user_id': self.user_id,
            'created_at': str(self.created_at)
        }

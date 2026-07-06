# 🏋️ PlanFitness

REST API para registrar y gestionar ejercicios de fitness, con autenticación JWT y un
frontend en React. Proyecto del curso.

- **Backend:** Flask + SQLAlchemy + PostgreSQL + JWT + Pydantic + Swagger
- **Frontend:** React + Vite + Tailwind + TanStack Query + TanStack Store (opcional, consume la API)

---

## ✅ Requisitos del proyecto cubiertos

| Requisito | Dónde |
|---|---|
| Framework Flask | `back/` (Flask + Flask-RESTful) |
| ORM SQLAlchemy | `back/app/models/` |
| Base de datos PostgreSQL | `back/config.py` + `.env` |
| Autenticación JWT (rutas protegidas) | `@jwt_required()` en `exercise_resource.py` |
| CRUD | CRUD completo de **Exercise** |
| Endpoint con lógica de negocio | `GET /exercises/progress` (progreso por día y de la semana) |
| Validaciones con Pydantic | `back/app/schemas/` |
| Documentación con Swagger | `http://localhost:5000/apidocs` |
| Frontend (opcional) | `front/` |

---

## 📂 Estructura

```
planfitness/
├── back/                # API Flask
│   ├── app/
│   │   ├── models/      # SQLAlchemy (User, Exercise)
│   │   ├── schemas/     # Pydantic
│   │   ├── services/    # Acceso a datos
│   │   ├── resources/   # Endpoints (Flask-RESTful)
│   │   ├── utils/       # bcrypt + Fernet (JWT)
│   │   └── router.py
│   ├── config.py
│   ├── db.py
│   ├── run.py
│   └── requirements.txt
└── front/               # React + Vite
    └── src/
        ├── features/exercises/   # hook + servicios + página
        ├── pages/LoginPage.jsx
        ├── store/                # TanStack Store (token)
        └── lib/api.js            # axios + interceptor JWT
```

---

## 🚀 Backend — cómo correr

Requisitos: Python 3.12+ y PostgreSQL.

```bash
cd back

# 1. Entorno virtual
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/Mac

# 2. Dependencias
pip install -r requirements.txt

# 3. Variables de entorno
copy .env.example .env       # y edita DATABASE_URI y FERNET_SECRET_KEY
# Genera una FERNET_SECRET_KEY con:
python key_generator.py

# 4. Crear la base de datos en PostgreSQL
#    CREATE DATABASE planfitness;

# 5. Migraciones
set FLASK_APP=run.py         # Windows (Linux/Mac: export FLASK_APP=run.py)
flask db init
flask db migrate -m "migracion inicial"
flask db upgrade

# 6. Levantar el servidor
python run.py
```

API en `http://localhost:5000/api/v1` · Swagger en `http://localhost:5000/apidocs`

---

## 🎨 Frontend — cómo correr

Requisitos: Node.js 18+.

```bash
cd front
npm install
npm run dev
```

App en `http://localhost:5173` (el backend debe estar corriendo).

---

## 📡 Endpoints

Base: `/api/v1`

| Método | Ruta | Protegido | Descripción |
|---|---|---|---|
| POST | `/auth/register` | No | Registrar usuario |
| POST | `/auth/login` | No | Login → `access` y `refresh` token |
| GET | `/exercises` | 🔒 | Listar ejercicios del usuario |
| POST | `/exercises` | 🔒 | Crear ejercicio |
| GET | `/exercises/<id>` | 🔒 | Ver un ejercicio |
| PUT | `/exercises/<id>` | 🔒 | Editar ejercicio |
| DELETE | `/exercises/<id>` | 🔒 | Eliminar (lógico) ejercicio |
| GET | `/exercises/progress` | 🔒 | **Lógica de negocio**: progreso semanal |

🔒 = requiere header `Authorization: Bearer <access_token>`

### Lógica de negocio — `GET /exercises/progress`
Cada ejercicio pertenece a un día de la semana (`day`) y se puede marcar como
hecho (`completed`). El endpoint agrupa por día y calcula:
- Total y completados por día, con su **porcentaje de avance**
- El **porcentaje de la semana** completa

El frontend usa esto para pintar la barra de progreso de cada día.

---

## 🔑 Autenticación

- Contraseñas hasheadas con **bcrypt**.
- El login encripta el `id` del usuario con **Fernet** y lo usa como identidad del token JWT.
- Las rutas de ejercicios están protegidas con `@jwt_required()`.

---

## 🧪 Ejemplo rápido (curl)

```bash
# Registro
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Gustavo","email":"g@test.com","password":"123456"}'

# Login
curl -X POST http://localhost:5000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"g@test.com","password":"123456"}'

# Crear ejercicio (usa el access token del login)
curl -X POST http://localhost:5000/api/v1/exercises \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Press banca","muscle_group":"Pecho","sets":4,"reps":10,"weight":60,"day":"Lunes"}'

# Ver el progreso de la semana
curl http://localhost:5000/api/v1/exercises/progress \
  -H "Authorization: Bearer <TOKEN>"
```

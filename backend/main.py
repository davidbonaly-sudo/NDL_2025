from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import datetime

from utils.request_mistral import ask_mistral # Importation pour simuler un champ 'created_at'

app = FastAPI()

# Configuration du CORS (essentiel pour la communication front-back)
origins = [
    "http://localhost",
    "http://localhost:8080",
    "http://localhost:5173",
    "http://127.0.0.1:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modèle de données (Schema) - Doit correspondre au payload envoyé par Vue.js
class Resource(BaseModel):
    name: str
    content: str
    status: str = "pending" # Attente d'un champ 'status', par défaut 'pending'

# Endpoint POST qui reçoit le contenu du frontend
@app.post("/api/resources")
async def create_resource(resource: Resource):
    """
    Récupère le payload dans l'objet 'resource'.
    """
    resource_name = resource.name
    resource_status = resource.status

    print(f"Nom de la ressource : {resource_name}")
    print(f"Statut de la ressource : {resource_status}")
    
    # Logique de traitement (simulation de la création d'une ressource)
    new_resource_id = 456  # Simule l'ID après insertion en base de données
    current_time = datetime.datetime.now().isoformat()
    
    # ----------------------------------------------------
    # Envoi de la réponse au frontend
    # Le frontend (Vue.js) affichera cette réponse JSON.
    # ----------------------------------------------------
    return {
        "message": f"Ressource '{resource_name}' a été créée et affichée.",
        "id": new_resource_id,
        "created_at": current_time,
        "content_received": {
            "name": resource_name,
            "status": resource_status,
        }
    }

@app.post("/api/chien_gpt")
async def chien_gpt(resource: Resource):
    """
    Récupère le payload dans l'objet 'resource'.
    """
    ressource_name = resource.name
    ressource_content = resource.content
    resource_status = resource.status

    print(f"Nom de la ressource : {ressource_name}")
    print(f"Contenu de la ressource : {ressource_content}")
    print(f"Statut de la ressource : {resource_status}")
    
    return_message = ask_mistral(ressource_content)
    

    # ----------------------------------------------------
    # Envoi de la réponse au frontend
    # Le frontend (Vue.js) affichera cette réponse JSON.
    # ----------------------------------------------------
    return {
        "message": f"Ressource '{ressource_name}' a été créée et affichée.",
        "return_message": return_message,
        "content_received": {
            "name": ressource_name,
            "content": ressource_content,
            "status": resource_status,
        }
    }

# Endpoint de test (GET)
@app.get("/")
async def root():
    return {"message": "Le backend FastAPI fonctionne."}
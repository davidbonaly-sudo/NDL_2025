import os
import requests

from dotenv import load_dotenv

# Chargement des clés API
load_dotenv()
MISTRAL_API_KEY = os.getenv("MISTRAL_API_KEY")

MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions"

def ask_mistral(prompt: str) -> str:
    headers = {
        "Authorization": f"Bearer {MISTRAL_API_KEY}",
        "Content-Type": "application/json",
    }

    update_prompt = f"" \
    "Fait moi une réponse absurde pour répondre à se prompt en prenant le rôle d'un fou scientifique du 18ème siècle. Dans ta réponse, ne fait aucune mention au " \
    "prompt et limite toi à 3 lignes. Glisse un woaf de temps en temps. Voici le prompt : {prompt}"

    print(update_prompt)

    payload = {
        "model": "mistral-tiny",   # ou "mistral-small", "mistral-medium"
        "messages": [
            {"role": "user", "content": update_prompt}
        ]
    }

    response = requests.post(MISTRAL_API_URL, headers=headers, json=payload)

    if response.status_code != 200:
        return f"Erreur Mistral: {response.status_code}, {response.text}"

    data = response.json()
    return data["choices"][0]["message"]["content"]

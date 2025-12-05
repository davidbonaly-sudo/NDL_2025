// api/chien_gpt.js

// Importez 'dotenv' pour gérer les variables d'environnement localement
// (Assurez-vous que votre MISTRAL_API_KEY est configurée comme variable d'environnement
// dans les réglages de votre projet Vercel)
require('dotenv').config();

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_API_URL = "https://api.mistral.ai/v1/chat/completions";

/**
 * Fonction pour interroger l'API Mistral.
 * @param {string} prompt - Le contenu envoyé par le client.
 * @returns {Promise<string>} - La réponse absurde de Mistral.
 */
async function askMistral(prompt) {
    if (!MISTRAL_API_KEY) {
        return "Erreur de configuration: MISTRAL_API_KEY n'est pas définie.";
    }

    const updatePrompt = 
        `Fait moi une réponse absurde pour répondre à se prompt en prenant le rôle d'un fou scientifique du 18ème siècle. Dans ta réponse, ne fait aucune mention au ` +
        `prompt et limite toi à 3 lignes. Glisse un woaf de temps en temps. Voici le prompt : ${prompt}`;

    console.log(`Prompt envoyé à Mistral : ${updatePrompt}`);

    const payload = {
        model: "mistral-tiny",
        messages: [
            {"role": "user", "content": updatePrompt}
        ]
    };

    try {
        const response = await fetch(MISTRAL_API_URL, {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${MISTRAL_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            const errorText = await response.text();
            return `Erreur Mistral: ${response.status}, ${errorText}`;
        }

        const data = await response.json();
        return data.choices[0].message.content;

    } catch (error) {
        console.error("Erreur lors de l'appel à l'API Mistral:", error);
        return `Erreur de connexion: ${error.message}`;
    }
}

/**
 * La fonction Serverless principale qui gère la requête POST.
 * L'URL sera: YOUR_VERCEL_DOMAIN/api/chien_gpt
 */
module.exports = async (req, res) => {
    // Vercel/Node.js gère le CORS et les méthodes HTTP de base.
    
    if (req.method !== 'POST') {
        // Renvoie une erreur si ce n'est pas une méthode POST (bonne pratique)
        return res.status(405).json({ message: "Méthode non autorisée. Utilisez POST." });
    }

    // Le corps de la requête (payload) est dans req.body
    const resource = req.body;
    
    // Simuler le modèle Pydantic
    const resourceName = resource?.name || "Sans Nom";
    const resourceContent = resource?.content || ""; // Le prompt de l'utilisateur
    const resourceStatus = resource?.status || "pending";

    console.log(`Nom de la ressource : ${resourceName}`);
    console.log(`Contenu de la ressource : ${resourceContent}`);
    console.log(`Statut de la ressource : ${resourceStatus}`);
    
    // Appel à la logique Mistral
    const returnMessage = await askMistral(resourceContent);
    
    // ----------------------------------------------------
    // Envoi de la réponse au frontend
    // ----------------------------------------------------
    res.status(200).json({
        "message": `Ressource '${resourceName}' a été traitée.`,
        "return_message": returnMessage,
        "content_received": {
            "name": resourceName,
            "content": resourceContent,
            "status": resourceStatus,
        }
    });
};

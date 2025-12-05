// src/services/apiService.js

/**
 * Fonction générique pour effectuer une requête POST.
 * @param {string} endpoint - Le chemin spécifique de l'API (ex: '/users').
 * @param {object} payload - Les données à envoyer dans le corps de la requête.
 * @returns {Promise<object>} La réponse JSON du serveur.
 */
export async function createResource(endpoint, payload) {
  const url = `http://http://145.223.81.154/api${endpoint}`; 

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
      throw new Error(errorData.message || `Erreur serveur : ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Erreur lors de l'appel API:", error);
    throw error;
  }
}

/**
 * Fonction pour récupérer une ressource (GET).
 * @param {string} endpoint - Le chemin spécifique de l'API.
 * @returns {Promise<object>} La réponse JSON du serveur.
 */
export async function fetchResource(endpoint) {
  const url = `/api${endpoint}`; // Utilisation du préfixe /api
  
  // Implémentez ici la logique du GET
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Erreur inconnue' }));
      throw new Error(errorData.message || `Erreur serveur : ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error("Erreur lors de l'appel API (GET):", error);
    throw error;
  }
}
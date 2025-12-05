<script setup>
import { ref, watch } from 'vue';
import { createResource } from '@/services/apiService'; 

// États réactifs du Formulaire
const content = ref('');
const isLoading = ref(false);
const errorMessage = ref(null);
const successMessage = ref(null);

// États réactifs pour l'Affichage de la Réponse
const apiResponseData = ref(null);
// 1. Pour stocker le texte final à animer (le message de l'API)
const fullResponseText = ref(''); 
// 2. Pour stocker le texte affiché au fur et à mesure
const displayedText = ref('');
// 3. Pour suivre si l'animation est en cours
const isTyping = ref(false); 


/**
 * Fonction pour simuler l'affichage caractère par caractère.
 * @param {string} text Le texte complet à afficher.
 */
const typeResponse = (text) => {
    fullResponseText.value = text;
    displayedText.value = ''; // Réinitialiser le texte affiché
    isTyping.value = true;
    
    const characters = text.split('');
    let i = 0;
    const delay = 50; // Délai en ms entre chaque caractère

    function typeNextCharacter() {
        if (i < characters.length) {
            displayedText.value += characters[i];
            i++;
            setTimeout(typeNextCharacter, delay);
        } else {
            isTyping.value = false;
        }
    }

    typeNextCharacter();
};

// 🌟 NOUVEAU : Un observateur pour démarrer l'animation
// dès que apiResponseData.value change et contient un message
watch(apiResponseData, (newResponse) => {
    // Vérifier si la nouvelle réponse est non-nulle et contient le message
    if (newResponse && newResponse.return_message) {
        // Déclencher l'effet de frappe avec le message de l'API
        typeResponse(newResponse.return_message);
    }
});


// Fonction de soumission du formulaire (inchangée dans sa logique API)
const submitForm = async () => {
    // 1. Réinitialisation de l'état
    errorMessage.value = null;
    successMessage.value = null;
    apiResponseData.value = null; 
    displayedText.value = ''; // Réinitialiser l'affichage
    isTyping.value = false;

    if (!content.value) {
        errorMessage.value = 'Le nom de la ressource est requis.';
        return;
    }
    
    isLoading.value = true;
    
    const payload = {
        name: content.value,
        content: content.value,
        status: 'active'
    };

    try {
        const responseData = await createResource('/chien_gpt', payload);
        
        // CORRECTION CLÉ : Affecter la réponse complète à la variable
        apiResponseData.value = responseData; // L'observateur (watch) va déclencher l'animation
        
        // 4. Gérez le succès
        successMessage.value = `Ressource ID ${responseData.id} créée avec succès.`;
        content.value = ''; // Vider le champ
        
    } catch (error) {
        // 5. Gérez l'échec
        errorMessage.value = `Erreur: ${error.message}`;
        console.error("Erreur de l'appel API:", error); 
        
    } finally {
        isLoading.value = false;
    }
};
</script>

<style scoped>
/* Style pour un effet visuel plus propre */
pre {
    background-color: #f4f4f4;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
    white-space: pre-wrap;
    font-family: monospace;
}

/* 🌟 NOUVEAU : Le curseur clignotant */
.typing-cursor {
  /* Le curseur (barre verticale) */
  border-right: 0.1em solid orange; 
  animation: blink-caret 0.75s step-end infinite;
  display: inline-block; /* Pour qu'il s'aligne bien avec le texte */
  height: 1em; /* Ajuster la hauteur à la ligne de texte */
  vertical-align: middle;
}

/* Définition de l'animation pour le clignotement */
@keyframes blink-caret {
  from, to { border-color: transparent }
  50% { border-color: orange; }
}
</style>

<template>
  <div>
    <h2>Créer une Nouvelle Ressource</h2>
    <input 
      type="text" 
      v-model="content" 
      placeholder="Entrez le nom" 
      :disabled="isLoading" 
    />
    <button @click="submitForm" :disabled="isLoading || !content">
      {{ isLoading ? 'Envoi en cours...' : 'Soumettre' }}
    </button>
    
    <p v-if="successMessage" style="color: green;">{{ successMessage }}</p>
    <p v-if="errorMessage" style="color: red;">{{ errorMessage }}</p>
    
    <div v-if="apiResponseData">
      <hr>
      <h3>Réponse complète de l'API :</h3>
      <pre>
        {{ displayedText }}<span v-if="isTyping" class="typing-cursor"></span>
      </pre>
      <details>
        <summary>Voir les données brutes (non animées)</summary>
        <pre>{{ apiResponseData }}</pre>
      </details>
    </div>
  </div>
</template>
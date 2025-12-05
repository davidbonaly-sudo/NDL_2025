<script setup>
import { ref, watch, nextTick } from "vue";
import Fond from "./Fond.vue";
import { createResource } from '@/services/apiService'; 

const inputText = ref("");
const placeholderText = ref("Entrez un texte ...");
const expanded = ref(false);

// Référence à l'input
const messageInput = ref(null);

// Fonction pour focus l'input
const focusInput = () => {
  messageInput.value?.focus();
};

const handleFocus = () => {
  placeholderText.value = "";
  expanded.value = true; // montre la div intermédiaire
};

const handleBlur = () => {
  // MODIFICATION : Vérifier aussi si content est vide
  if (content.value === "") {
    placeholderText.value = "Entrez un texte ...";
    expanded.value = false; // cache la div intermédiaire
  }
};

// --- VARIABLES EXISTANTES ET NOUVELLES ---
const content = ref('');           // Champ de saisie utilisateur
const isLoading = ref(false);
const chatMessages = ref([]);      // Le tableau qui stocke tous les messages
const displayedText = ref('');     // Texte en cours d'animation (pour le bot)
const isTyping = ref(false);       // État de l'animation

// ... (Vos variables d'erreur/succès si besoin)

// --- Fonction d'animation de texte (adaptée pour le dernier message) ---
// La fonction d'animation est maintenant une fonction interne
const animateResponse = (fullText) => {
    displayedText.value = "";
    isTyping.value = true;
    const chars = fullText.split("");
    let charIndex = 0;
    const interval = 50; // vitesse en ms

    function typeChar() {
        if (charIndex < chars.length) {
            displayedText.value += chars[charIndex];
            charIndex++;
            setTimeout(typeChar, interval);
        } else {
            isTyping.value = false;
        }
    }
    typeChar();
};

const submitForm = async () => {
    // ... (Réinitialisation d'erreurs/messages si vous les utilisez)
    
    if (!content.value) {
      console.log("Clic bloqué: le champ est vide.");
      return;
    }

    // 1. AJOUTER LE MESSAGE UTILISATEUR
    const userMessage = {
        id: Date.now(),
        text: content.value,
        type: 'user',
        // Utiliser les classes/IDs utilisateur
        containerClass: 'Container-Gauche-chatbox',
        imgSrc: '/votre-avatar-user.png', 
        imgId: 'Container-Gauche-intermediate-zone-texte-User-Image',
        texteId: 'Container-Gauche-intermediate-zone-texte-User-Texte'
    };
    chatMessages.value.push(userMessage);

    const userContent = content.value; 
    content.value = ''; // Vider le champ de saisie
    isLoading.value = true;
    
    // AJOUT : Refocus l'input après l'envoi
    await nextTick();
    messageInput.value?.focus();
    
    // 2. PRÉPARER LE CONTENEUR BOT (avec un texte temporaire ou vide)
    const botMessage = {
        id: Date.now() + 1,
        text: '...', // Texte temporaire qui sera remplacé
        type: 'bot',
        isAnimating: true, // Marqueur pour l'animation
        // Utiliser les classes/IDs Bot
        containerClass: 'Container-Droite-chatbox',
        imgSrc: '/Images/oscar.png', 
        imgId: 'Container-Droite-intermediate-zone-texte-Bot-Image',
        texteId: 'Container-Droite-intermediate-zone-texte-Bot-Texte'
    };
    chatMessages.value.push(botMessage);
    
    try {
        const payload = { 
            name: userContent, 
            content: userContent, 
            status: 'active' 
        };
        const responseData = await createResource('/chien_gpt', payload);
        const fullText = responseData.return_message;
        
        // 3. REMPLACER le message temporaire par le texte complet
        // C'est maintenant le message animé qui portera le texte
        botMessage.text = fullText; 
        
        // 4. Lancer l'animation de displayedText (qui est lié au dernier message)
        animateResponse(fullText);
        
    } catch (error) {
        // En cas d'échec, mettre le message d'erreur directement et annuler l'animation
        botMessage.text = `Erreur: ${error.message}`;
        botMessage.isAnimating = false;
        isTyping.value = false;
        
    } finally {
        isLoading.value = false;
        // nextTick permet de garantir que le DOM est mis à jour pour le défilement
        await nextTick(); 
        // Ajoutez ici la logique de défilement vers le bas
    }
};

// ... Votre watch sur apiResponseData n'est plus nécessaire si vous intégrez l'animation ici
</script>

<template>
  <main>
    <!-- Section Gauche -->
    <section id="Container-Gauche">
      <div class="Main-Container" id="Main-Container-Gauche">
        <div id="Container-Gauche-Titre">
          <h1>OBI-TECHSHARE</h1>
        </div>
        <Fond/>
        <div id="Container-Gauche-Image">
          <img src="/Images/OBTS.svg" alt="Logo OBI-TECHSHARE">
        </div>
      </div>
    </section>

    <!-- Section Droite -->
    <section id="Container-Droite">
      <div class="Main-Container" id="Main-Container-Droite">

        <!-- Div du haut -->
        <div class="Container-Droite" id="Container-Droite-haut"></div>

        <!-- Nouvelle div intermédiaire superposée qui s'étend vers le haut -->
        <div class="Container-Droite" 
          id="Container-Droite-intermediate" 
          :class="{ expanded: expanded }">
          <div class="Container-Droite" id="Container-Droite-intermediate-zone-texte">
              
            <div v-for="(message, index) in chatMessages" 
              :key="message.id"
              :class="message.containerClass"
              class="Container-chatbox"
              :id="message.containerClass.replace('-', '_')"
            >
              <div :class="[message.containerClass, 'ChatBoxImg']" :id="message.imgId">
                <img :src="message.imgSrc" alt="">
              </div>
              
              <div :class="[message.containerClass, 'ChatBoxTexte']" :id="message.texteId">
                  <p v-if="message.type === 'bot' && message.isAnimating && index === chatMessages.length - 1">
                      {{ displayedText }} 
                      <span v-if="isTyping" class="typing-cursor"></span>
                  </p>
                  <p v-else>
                      {{ message.text }}
                  </p>
              </div>
          </div>

          </div>
        </div>

        <!-- Parent du bas avec input + icône -->
        <div class="Container-Droite" 
          id="Container-Droite-bas"
          @click="focusInput">
        
          <input
            id="Container-Droite-bas-texte"
            ref="messageInput"
            type="text"
            v-model="content"
            placeholder="Entrez votre message ..."
            @focus="handleFocus"
            @blur="handleBlur"
          />
        
          <div class="Container-Droite" id="Container-Droite-bas-icone" 
          @click.stop="submitForm">
            <img src="/Images/send.png" alt="">
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style>
@font-face {
  font-family: 'HeadingNowPolice';
  src: url('/HeadingNowTrial-67Extrabold.ttf');
}

:root {
  --bleu-fonce: #0e2862;
  --bleu-clair: #194096;
}

html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  background-color: var(--bleu-fonce);
  overflow: hidden;
}

main {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: flex-start;
  width: 100%;
  height: 100vh;
}

h1 {
  font-size: clamp(80px, 12vw, 1100%);
  font-family: 'HeadingNowPolice', sans-serif;
  font-weight: bold;
  font-style: italic;
  color: white;
  margin: 0;
}

#Container-Gauche {
  height: 100%;
  width: 75%;
  box-sizing: border-box;
  padding: 1%;
  position: relative;
  overflow: hidden;
}

#Container-Gauche h1 {
  margin-top: -3%;
  margin-left: 1%;
  letter-spacing: -13px;
}

#Container-Gauche-Image {
  position: absolute;
  top: 200px;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
}

#Container-Gauche-Image img {
  width: 67%;
  max-width: none; 
  height: auto;
  transform: rotate(-4.2deg);
  opacity: 13%;
  filter: blur(3px);
  position: absolute;
  left: -9%;
  top: 1%;
}

#Container-Droite {
  height: 100%;
  width: 25%;
  position: relative;
}

#Main-Container-Droite {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  position: relative; /* pour que la div intermédiaire soit positionnée par rapport à ce conteneur */
}

.Container-Droite {
  border-radius: 26px;
  background-color: var(--bleu-clair);
}

/* Haut de la colonne droite */
#Container-Droite-haut {
  margin-top: 10%;
  display: flex;
  width: 80%;
  height: 80%;
  position: relative;
  z-index: 1;
}

/* Nouvelle div intermédiaire superposée */
#Container-Droite-intermediate {
  position: absolute;
  bottom: 18%; /* ancrée au-dessus de l'input */
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 0;
  background-color: white;
  border-radius: 26px;
  opacity: 0;
  transition: all 0.3s ease-in-out;
  z-index: 5;
}

#Container-Droite-intermediate.expanded {
  height: 77%; /* hauteur finale */
  opacity: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 26px;
}

#Container-Droite-intermediate-zone-texte{
  width: 90% ;
  height: 95%;
  background-color: white;
  border-radius: 0;
  overflow-y: auto; /* scroll verticale si nécessaire */
  overflow-x: hidden;
}

/* Parent du bas */
#Container-Droite-bas {
  display: flex;
  width: 80%;
  height: 10%;
  margin-top: 5%;
  margin-bottom: 10%;
  flex-direction: row;
  justify-content: space-around;
  gap: 2%;
  align-items: center;
  position: relative;
  z-index: 20; /* au-dessus de la div intermédiaire */
  cursor: text; /* Indique visuellement que la zone est cliquable pour écrire */
}

/* Input fixe */
#Container-Droite-bas-texte {
  width: 75%;
  height: 60%;
  background-color: white;
  border-radius: 26px;
  border: none;
  padding-left: 10px;
  font-size: 1rem;
  outline: none;
  position: relative;
  z-index: 20;
  font-family: 'Poppins', sans-serif;
  color: var(--bleu-fonce);
  font-weight: 600;
  margin-left: 2%;
}

#Container-Droite-bas-texte::placeholder {
  color: darkgrey;
  opacity: 1;
  font-size: 26px;
  padding: 3%;
}

#Container-Droite-bas-texte:focus {
  box-shadow: 0 0 10px rgba(25, 64, 150, 0.5);
}

/* Icône fixe */
#Container-Droite-bas-icone {
  width: 15%;
  height: 60%;
  margin-right: 2%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  position: relative;
  z-index: 20;
  cursor: pointer; /* Curseur pointeur pour l'icône */
}

#Container-Droite-bas-icone img {
  width: 75%;
  background-color: white;
  border-radius: 100%;
  padding: 10%;
  box-shadow: 4px 4px darkgray;
}

.Container-chatbox{
  display: flex;
  flex-direction: row;
  background-color: white;
  width: 100%;
  height: auto;
  margin-bottom: 2%;
}

.ChatBoxImg{
  width: 20%;
  height: 100%;
  background-color: white;
}

.ChatBoxImg img{
  width: 100%;
}

.ChatBoxTexte{
  width: 80%;
  height: auto;
  background-color: white;
}

.ChatBoxTexte p{
  margin-left: 2%;
  margin-right: 2%;
}
</style>

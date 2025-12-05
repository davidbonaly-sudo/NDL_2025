<script setup>
defineProps({
  label: {
    type: String,
    required: true,
  },
  onClick: {
    type: Function,
    required: false,
    default: () => {},
  },
  customClass: {          // Classe personnalisée pour le style
    type: String,
    required: false,
    default: "button"    // style par défaut
  }
});
</script>

<template>
  <button :class="customClass" @click="onClick">
    {{ label }}
  </button>
</template>

<style>
/* Bouton normal */
.button {
  padding-left: 2%;
  padding-right: 2%;
  padding-top: 8px;
  padding-bottom: 8px;
  border-radius: 15px;
  font-size: 16px;
  font-weight: 600;
  color: var(--bleu-fonce);
  border: none;
  background-color: white;
  transition: all 0.2s ease-out;
}

.button:hover {
  box-shadow: 3px 3px darkgray;
  cursor:pointer ;
}

/* Boutons popup */
.popup-btn {
  width: 45%;
  padding: 14px;
  background: #2196f3;
  border: none;
  color: white;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.popup-btn:hover {
  background: #0f73c9;
}

.popup-close {
  margin-top: 10px;
  background: #444;
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  color: white;
  cursor: pointer;
}

/* ========= MENU IA STYLE ========= */
.wrapper {
  position: relative;
}

.ia-menu {
  position: absolute;
  top: 60px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: rgba(30, 30, 30, 0.9);
  backdrop-filter: blur(6px);
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
  animation: pop 0.18s ease-out;
}

/* ========= POPUP IA STYLE ========= */
.ia-popup-overlay {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(4px);
  z-index: 1000;
}

.ia-popup {
  background: #1c1c1c;
  padding: 30px;
  width: 380px;
  border-radius: 16px;
  text-align: center;
  color: white;
  animation: popup 0.22s ease-out;
}

.popup-options {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin: 20px 0;
}

/* Animations */
@keyframes pop {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}

@keyframes popup {
  0% { transform: scale(0.8); opacity: 0; }
  100% { transform: scale(1); opacity: 1; }
}
</style>

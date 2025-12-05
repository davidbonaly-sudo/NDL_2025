<script setup>
import { ref } from "vue";

// Liste des composants avec positions en % (correct)
const listeComposants = [
  { id: 1, name: "Carte mère", description: "La carte mère connecte tous les composants", image: "../Images/CM.png", top: 45, left: 39 },
  { id: 2, name: "SSD", description: "Stockage rapide pour le système et les fichiers", image: "../Images/SSD.png", top: 65, left: 14 },
  { id: 3, name: "RAM", description: "Mémoire vive pour exécuter les programmes", image: "../Images/RAM.png", top: 60, left: 54 },
  { id: 4, name: "Processeur", description: "Cerveau du PC, exécute les calculs", image: "../Images/Processeur.png", top: 39, left: 8 },
  { id: 5, name: "Batterie", description: "Alimente le PC en énergie", image: "../Images/Batterie.png", top: 62, left: 80 },
  { id: 6, name: "Carte wifi", description: "Permet la connexion sans fil", image: "../Images/Carte-wifi.png", top: 44, left: 74 },
  { id: 7, name: "Ventilateur", description: "Refroidit les composants", image: "../Images/Ventilateur.png", top: 29, left: 16 },
];

const displayedComponents = ref([]);
const activeComponent = ref(null);

const handleNext = () => {
  const nextIndex = displayedComponents.value.length;
  if (nextIndex < listeComposants.length+1) {
    const comp = listeComposants[nextIndex];

    const compWithPosition = {
      ...comp,
      currentTop: 120, // arrive du bas
      currentLeft: 120,
    };

    displayedComponents.value.push(compWithPosition);
    activeComponent.value = compWithPosition;

    setTimeout(() => {
      compWithPosition.currentTop = comp.top;
      compWithPosition.currentLeft = comp.left;
    }, 50);
  }
};
</script>

<template>
  <div class="fond-container">

    <!-- Zone PC -->
    <div class="pc-zone">
      <div class="pc-image-container">
        <div class="components-layer">
          <transition-group name="fly" tag="div">
            <img
              v-for="comp in displayedComponents"
              :key="comp.id"
              :src="comp.image"
              class="component-image"
              :style="{
                top: comp.currentTop + '%',
                left: comp.currentLeft + '%'
              }"
            />
          </transition-group>
        </div>
      </div>
    </div>

    <!-- Panneau droit -->
    <div class="right-panel">

      <!-- Description -->
      <div class="controls">
        <div v-if="activeComponent" class="component-info">
          <h3>{{ activeComponent.name }}</h3>
          <p>{{ activeComponent.description }}</p>
        </div>
      </div>

      <!-- Bouton fixé en bas -->
      <div class="bottom-panel">
        <button class="button-next" @click="handleNext">Suivant</button>
      </div>

    </div>

  </div>
</template>

<style scoped>

/* Container global */
.fond-container {
  display: flex;
  width: 100%;
  height: 600px;
  background: #0f1e4c;
}

/* Zone PC */
.pc-zone {
  width: 65%;
  position: relative;
}

.pc-image-container {
  position: relative;
  width: 100%;
  height: 100%;
  background-image: url("../Images/fPC.png");
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
}

.components-layer {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

.component-image {
  position: absolute;
  width: 12%;      /* taille responsive */
  transition: top 0.8s ease, left 0.8s ease;
}

/* Panneau droit */
.right-panel {
  width: 35%;
  display: flex;
  flex-direction: column;
  padding: 10px;
}

/* Description */
.controls {
  flex-grow: 1;
  overflow: hidden;
}

.component-info {
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 12px;
  border-radius: 8px;
}

/* Section bas fixe */
.bottom-panel {
  height: 60px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

/* Bouton */
.button-next {
  padding: 12px 20px;
  border: none;
  border-radius: 12px;
  background: #43a047;
  color: white;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.button-next:hover {
  transform: translateY(-3px);
}

/* Animation */
.fly-enter-active,
.fly-leave-active {
  transition: all 0.8s ease;
}
.fly-enter-from {
  opacity: 0;
  transform: scale(0.5);
}
.fly-enter-to {
  opacity: 1;
  transform: scale(1);
}
</style>

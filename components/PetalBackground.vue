<template>
  <div class="petals-container" id="petals">
    <div 
      v-for="(petal, index) in petals" 
      :key="index" 
      class="petal"
      :style="{
        left: petal.left + '%',
        width: petal.size + 'px',
        height: (petal.size * 1.3) + 'px',
        animationDuration: (petal.duration * speedMultiplier) + 's',
        animationDelay: petal.delay + 's',
        opacity: petal.opacity
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

interface Petal {
  left: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

const props = defineProps<{
  speed: 'slow' | 'fast';
}>();

const petals = ref<Petal[]>([]);

const speedMultiplier = computed(() => {
  return props.speed === 'fast' ? 0.5 : 1; 
});

const generatePetals = () => {
  const newPetals: Petal[] = [];
  // Create 16 random petals
  for (let i = 0; i < 16; i++) {
    newPetals.push({
      left: Math.random() * 100, // 0-100%
      size: Math.random() * 10 + 10, // 10-20px
      duration: Math.random() * 5 + 10, // 10-15s base speed
      delay: Math.random() * 10,
      opacity: Math.random() * 0.5 + 0.3
    });
  }
  petals.value = newPetals;
};

onMounted(() => {
  generatePetals();
});
</script>
<template>
  <div 
    v-if="lightbox.lightboxImage.value" 
    class="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center cursor-zoom-out animate-fade-in p-4"
    @click.self="lightbox.closeLightbox()"
  >
     <img :src="lightbox.lightboxImage.value" class="max-w-full max-h-full rounded-lg shadow-2xl scale-100 object-contain transition-transform duration-300" alt="Fullscreen preview" />
     <div class="absolute bottom-10 text-white/50 text-sm bg-black/50 px-4 py-2 rounded-full">Click outside to close</div>
  </div>
</template>

<script setup lang="ts">
import { useLightbox } from '../../composables/useLightbox';

const lightbox = useLightbox();
</script>

<template>
  <transition name="fade" appear>
    <div ref="root">
      <h1
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-humongous font-bold pointer-events-none"
        :style="`opacity: ${largeTextOpacity}`"
      >
        projects
      </h1>
      <div style="height: 90vh"></div>
      <div
        class="grid gap-x-12 gap-y-14 mx-52 mb-32"
        style="grid-template-columns: repeat(auto-fit, minmax(360px, 1fr))"
      >
        <project-tile
          v-for="project in projects"
          :key="project.id"
          :project="project"
          class="z-10"
        />
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ProjectTile from '@/components/ProjectTile.vue';
import { projects } from '@/data/projects';

const largeTextOpacity = ref(0.05);
const root = ref<HTMLDivElement | null>(null);

onMounted(() => {
  const scrollDiv = root.value!.parentElement as HTMLDivElement;
  scrollDiv.scrollTo(0, 0);
  scrollDiv.addEventListener('scroll', () => {
    const x = scrollDiv.scrollTop / window.innerHeight;
    largeTextOpacity.value = x > 0.7 ? 0 : -0.05 * (1 / 0.7) * x + 0.05;
  });
});
</script>

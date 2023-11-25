<template>
  <router-link
    :to="`/project/${project.id}`"
    class="group flex flex-col items-start cursor-pointer"
  >
    <img
      :src="project.coverImage"
      class="w-full h-64 rounded-2xl mb-6 object-cover transition-transform group-hover:-translate-y-2 group-hover:scale-102 group-hover:shadow-lg group-active:-translate-y-1 group-active:scale-101 group-active:shadow-sm outline outline-1 outline-offset-4 outline-transparent group-active:outline-black/20"
    />
    <span class="mx-2 text-sm font-medium opacity-40 uppercase tracking-wider">
      {{ project.tags }}
    </span>
    <h3 class="mx-2 text-2xl font-medium mb-4">{{ project.title }}</h3>
    <p class="mx-2">{{ project.description }}</p>
  </router-link>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';
import type { Project } from '@/types/Project';

defineProps({
  project: {
    type: Object as PropType<Project>,
    required: true
  }
});
</script>

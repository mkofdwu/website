<template>
  <div class="h-screen relative">
    <div class="flex flex-col items-center">
      <div class="relative w-1/2 overflow-clip">
        <div class="flex items-center transition-transform duration-500 cursor-zoom-in"
          :style="`transform: translateX(-${carouselIndex}00%)`">
          <img v-for="image in project.images" :key="image" :src="image" class="w-full h-1/2 mt-16 mb-14 object-cover"
            onclick="window.open(this.src, '_blank')" />
        </div>
        <button
          class="material-symbols-outlined w-8 h-8 rounded-full bg-white border grid place-items-center absolute left-5 top-1/2 -translate-y-1/2"
          @click="carouselIndex--">
          chevron_left
        </button>
        <button
          class="material-symbols-outlined w-8 h-8 rounded-full bg-white border grid place-items-center absolute right-5 top-1/2 -translate-y-1/2"
          @click="carouselIndex++">
          chevron_right
        </button>
      </div>
      <div class="w-1/2 px-10 flex flex-col items-start mb-14">
        <span class="text-lg font-medium opacity-40 uppercase tracking-wider mb-2">
          {{ project.tags }}
        </span>
        <h3 class="text-3xl font-bold mb-5">{{ project.title }}</h3>
        <p class="text-lg mb-10">{{ project.description }}</p>
        <div class="flex gap-x-3">
          <a v-if="project.siteUrl" :href="project.siteUrl" target="_blank"
            class="h-12 px-6 border-3 border-black flex items-center text-xl font-medium hover:opacity-60 hover:-translate-y-1 active:opacity-100 active:translate-y-0 transition-all">
            Visit site
          </a>
          <a :href="project.githubUrl" target="_blank"
            class="h-12 pl-5 pr-6 bg-almost-black flex items-center hover:bg-almost-black-lighter hover:-translate-y-1 active:bg-black active:translate-y-0 transition-all">
            <img src="@/assets/images/mdi_github.svg" alt="" class="w-6 h-6 mr-3" />
            <span class="text-white text-xl font-medium">View on GitHub</span>
          </a>
        </div>
      </div>
    </div>
    <router-link to="/projects"
      class="fixed top-24 left-24 flex uppercase tracking-wider hover:tracking-hover active:tracking-normal active:opacity-60 transition-all">
      <span class="material-symbols-outlined mr-3">chevron_left</span>
      Projects
    </router-link>
    <div class="fixed top-24 right-24 flex flex-col items-end gap-y-3">
      <router-link v-for="project in projects" :key="project.id" :to="`/project/${project.id}`"
        :disabled="project.id === thisId" class="transition-opacity hover:opacity-100"
        :class="project.id === thisId ? 'opacity-100' : 'opacity-40'">{{ project.title }}</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { projects } from "@/data/projects";

const route = useRoute();
const thisId = parseInt(route.params.id as string);
const project = projects[thisId];

const carouselIndex = ref(0);
</script>

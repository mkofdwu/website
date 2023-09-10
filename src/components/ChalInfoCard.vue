<script setup lang="ts">
import type { ChalInfo } from '@/types/ChalInfo';
import MaterialIcon from './MaterialIcon.vue';

defineProps<{ info: ChalInfo }>();

const catIcons: { [cat: string]: string } = {
  web: 'language',
  misc: 'help'
};
</script>

<template>
  <div class="flex items-start">
    <div class="mr-24 flex flex-col items-start" style="min-width: 56%; max-width: 56%">
      <h1 class="text-3xl font-bold mb-2">{{ info.title }}</h1>
      <span class="text-sm opacity-60 mb-6">{{ info.subtitle }}</span>
      <p class="mb-8">{{ info.description }}</p>
      <div class="flex">
        <div class="h-9 bg-black bg-opacity-5 rounded-full flex items-center mr-3">
          <material-icon sm :name="catIcons[info.cat]!" class="ml-3 mr-2" />
          <span class="mr-4">{{ info.cat }}</span>
        </div>
        <div class="h-9 bg-black bg-opacity-5 rounded-full px-5 flex items-center">
          <span class="mr-4">{{ info.numSolves }} solves</span>
          <span class="opacity-60">{{ info.numPoints }} points</span>
        </div>
      </div>
    </div>
    <div class="flex flex-col items-start">
      <span class="text-sm opacity-60 mb-3">Attachments</span>
      <div class="flex flex-wrap gap-3 mb-7">
        <div
          v-for="attachment in info.attachments"
          :key="attachment.url"
          class="h-10 bg-almost-black rounded-full px-5 flex items-center cursor-pointer hover:bg-primary"
        >
          <a :href="attachment.url" class="text-white font-medium">{{ attachment.name }}</a>
        </div>
      </div>
      <span class="text-sm opacity-60 mb-3">Source code</span>
      <div
        class="w-max h-10 bg-almost-black rounded-full flex items-center cursor-pointer hover:bg-primary"
      >
        <img src="@/assets/images/mdi_github.svg" alt="" class="w-5 h-5 ml-4 mr-3" />
        <span class="text-white font-medium mr-5">Github</span>
      </div>
    </div>
  </div>
</template>

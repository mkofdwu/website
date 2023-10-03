<script setup lang="ts">
import type { ChalInfo } from '@/types/ChalInfo';
import MaterialIcon from './MaterialIcon.vue';

defineProps<{ info: ChalInfo }>();

const catIcons: { [cat: string]: string } = {
  web: 'language',
  misc: 'help',
  forensics: 'fingerprint',
  crypto: 'key',
  cloud: 'cloud'
};
</script>

<template>
  <div
    class="flex flex-col items-start box-content px-9 py-8 rounded-2.5xl bg-gradient-to-r from-primary/75 to-[#49735A]"
  >
    <h1 class="text-3xl font-bold mb-2">{{ info.title }}</h1>
    <span class="text-sm opacity-60 mb-6">{{ info.subtitle }}</span>
    <p class="mb-6 whitespace-pre-wrap">{{ info.description }}</p>
    <div class="flex">
      <div class="h-9 bg-black bg-opacity-10 rounded-full flex items-center mr-3">
        <material-icon sm :name="catIcons[info.cat]!" class="ml-3 mr-2" />
        <span class="mr-4">{{ info.cat }}</span>
      </div>
      <div class="h-9 bg-black bg-opacity-10 rounded-full px-5 flex items-center">
        <span class="mr-4">{{ info.numSolves }} solves</span>
        <span class="opacity-60">{{ info.numPoints }} points</span>
      </div>
    </div>
    <div v-if="info.attachments.length" class="w-full h-px bg-black bg-opacity-10 mt-8 mb-5"></div>
    <div v-if="info.attachments.length" class="self-stretch flex">
      <div class="flex-1 flex flex-col">
        <span class="text-sm opacity-60 mb-3">Attachments</span>
        <div class="flex flex-wrap gap-3">
          <a
            v-for="attachment in info.attachments"
            :key="attachment.url"
            :href="attachment.url"
            class="h-10 text-white font-medium bg-almost-black rounded-full px-5 flex items-center cursor-pointer hover:bg-white hover:text-black transition-colors"
          >
            {{ attachment.name }}
          </a>
        </div>
      </div>
      <div v-if="info.sourceUrl" class="flex-1 flex flex-col">
        <span class="text-sm opacity-60 mb-3">Source code</span>
        <div
          class="group w-max h-10 bg-almost-black rounded-full flex items-center cursor-pointer hover:bg-white transition-colors"
        >
          <img
            src="@/assets/images/mdi_github.svg"
            alt=""
            class="w-5 h-5 ml-4 mr-3 group-hover:invert transition-all"
          />
          <span class="text-white font-medium mr-5 transition-colors group-hover:text-black">
            Github
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

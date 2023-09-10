<script setup lang="ts">
import { RouterLink } from 'vue-router';

const ctfs = [
  {
    name: 'SekaiCTF 2023',
    chals: [{ name: 'Frog WAF', slug: 'frog-waf' }]
  },
  {
    name: 'LITCTF 2023',
    chals: [{ name: 'the other obligatory pyjail', slug: 'the-other-obligatory-pyjail' }]
  }
];
</script>

<template>
  <div class="w-80 flex flex-col pt-30">
    <div v-for="ctf in ctfs" :key="ctf.name" class="flex flex-col mb-10">
      <span class="text-sm font-bold opacity-40 uppercase ml-10 mb-3">{{ ctf.name }}</span>
      <router-link
        v-for="chal in ctf.chals"
        :key="chal.slug"
        :to="`/writeups/${chal.slug}`"
        class="w-72 h-12 rounded-r-full flex items-center pl-10 transition-colors"
        :class="
          $route.path.includes(chal.slug)
            ? 'bg-primary bg-opacity-10 text-primary font-medium'
            : 'hover:bg-black hover:bg-opacity-5'
        "
      >
        {{ chal.name }}
      </router-link>
    </div>
  </div>
</template>

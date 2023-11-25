<script setup lang="ts">
import { RouterLink } from 'vue-router';

const ctfs = [
  {
    name: 'TISC 2023',
    chals: [
      { name: 'Level 1', slug: 'disk-archaeology' },
      { name: 'Level 2', slug: 'reckless-mistake' },
      { name: 'Level 3', slug: 'kpa' },
      { name: 'Level 4', slug: 'rubg' },
      { name: 'Level 5', slug: 'palindromes-invitation' },
      { name: 'Level 6', slug: 'the-chosen-ones' },
      { name: 'Level 7', slug: 'devsecmeow' },
      { name: 'Level 8', slug: 'blind-sql-injection' }
    ]
  },
  {
    name: 'LITCTF 2023',
    chals: [{ name: 'the other obligatory pyjail', slug: 'the-other-obligatory-pyjail' }]
  }
];
</script>

<template>
  <div class="w-80 flex flex-col pt-24 overflow-auto">
    <div class="flex flex-col mb-10">
      <router-link
        to="/writeups/overview"
        class="w-72 h-12 rounded-r-full flex items-center pl-10 transition-colors"
        :class="
          $route.path === '/writeups/overview'
            ? 'bg-primary bg-opacity-10 text-primary font-medium'
            : 'hover:bg-black hover:bg-opacity-5'
        "
      >
        Overview & awards
      </router-link>
    </div>
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

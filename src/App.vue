<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavWrapper from './components/NavWrapper.vue';
</script>

<template>
  <div>
    <nav-wrapper>
      <router-view />
    </nav-wrapper>
  </div>
</template>

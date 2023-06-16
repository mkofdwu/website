<script setup lang="ts">
import { RouterView } from 'vue-router';
import NavWrapper from './components/NavWrapper.vue';
</script>

<template>
  <div>
    <nav-wrapper>
      <router-view :key="$route.path" />
    </nav-wrapper>
  </div>
</template>

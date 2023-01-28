<script setup lang="ts">
import { RouterView } from "vue-router";
</script>

<template>
  <div>
    <router-view :key="$route.path" />
    <!-- <router-view v-slot="{ Component, route }">
      <transition name="fade">
        <component :is="Component" :key="route.path" />
      </transition>
    </router-view> -->
  </div>
</template>

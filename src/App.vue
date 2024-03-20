<script setup>
import { RouterView } from 'vue-router'
import { Notifications } from '@kyvg/vue3-notification'
import NavBar from '@/views/NavBar.vue'
</script>

<template>
  <NavBar />

  <RouterView />

  <notifications />
</template>

<style scoped>
</style>

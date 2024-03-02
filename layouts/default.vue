<script setup>
import AppHeader from '@/components/organisms/AppHeader.vue'
</script>

<template lang="pug">
div
  NuxtLoadingIndicator
  AppHeader
  slot
</template>

<style lang="scss" scoped></style>

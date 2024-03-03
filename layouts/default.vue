<script setup>
import AppHeader from '@/components/organisms/AppHeader.vue'
import Toaster from '@/components/ui/toast/Toaster.vue'
</script>

<template lang="pug">
div
  NuxtLoadingIndicator
  AppHeader
  slot
  ClientOnly
    Toaster

</template>

<style lang="scss" scoped></style>

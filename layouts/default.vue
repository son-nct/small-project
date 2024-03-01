<script setup>
import AppSideBar from '@/components/organisms/AppSideBar.vue'
import AppHeader from '@/components/organisms/AppHeader.vue'
</script>

<template>
  <NuxtLoadingIndicator />
  <div>
    <div class="flex w-full h-full">
      <app-side-bar />
      <div class="container mx-auto max-w-screen-2xl">
        <app-header />
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped></style>

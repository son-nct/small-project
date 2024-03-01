<script setup>
import AppSideBar from '@/components/organisms/AppSideBar.vue'
import AppHeader from '@/components/organisms/AppHeader.vue'
</script>

<template>
<div>
    <div class='flex w-full h-full'>
        <app-side-bar />
        <app-header />
    </div>
    <slot></slot>
</div>
</template>

<style lang="scss" scoped></style>

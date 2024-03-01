<script lang="ts" setup>
withDefaults(
  defineProps<{
    home?: string
    currentPageName: string
    slug?: string
  }>(),
  {
    home: 'Home',
  },
)
</script>

<template>
  <nav class="flex" aria-label="Breadcrumb">
    <ol
      class="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse"
    >
      <li class="inline-flex items-center">
        <NuxtLink
          to="/"
          class="inline-flex items-center text-base font-medium text-gray-700 hover:text-green-600"
        >
          <Icon name="fluent:home-20-regular" size="1.5rem" class="mr-1" />
          Home
        </NuxtLink>
      </li>
      <li>
        <div class="flex items-center">
          <Icon name="iconamoon:arrow-right-2" size="1.5rem" />
          <a
            href="#"
            class="text-base font-medium text-gray-700 ms-1 hover:text-green-600 md:ms-2"
            >{{ currentPageName }}</a
          >
        </div>
      </li>
      <li v-if="slug" aria-current="page">
        <div class="flex items-center">
          <Icon name="iconamoon:arrow-right-2" size="1.5rem" />
          <span class="text-sm font-medium text-gray-500 ms-1 md:ms-2">
            {{ slug }}</span
          >
        </div>
      </li>
    </ol>
  </nav>
</template>

<style lang="scss" scoped></style>

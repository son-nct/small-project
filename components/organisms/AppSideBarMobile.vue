<script setup lang="ts">
import { inject, ref } from "vue";
import { useRouter } from "vue-router";

const openMobileMenu = inject("openMobileMenuState");
const navigator = [
  {
    text: "Home",
    to: "/",
  },
  {
    text: "Blocks",
    to: "/blocks",
  },
  {
    text: "Validators",
    to: "/validators",
  },
  {
    text: "Transaction",
    to: "/transaction",
  },
];

const closeMenu = () => {
  openMobileMenu.value = false;
};

const searchAddr = ref("");

const router = useRouter();
const navigateToAddress = () => {
  router.push({
    name: "validators-address",
    params: { address: searchAddr.value },
  });
  searchAddr.value = "";
};
</script>

<template lang="pug">
Transition(name='menu')
  template(v-if='openMobileMenu')
    .fixed(class='top-0 bottom-0 right-0 z-50 w-2/3 h-screen bg-mobileMenu')
      NuxtImg.img-investor(src='/imgs/svg/close-icon.svg' alt='close icon' width='40' height='40' class='relative float-right top-3 right-3' loading='lazy' @click='closeMenu')
      .flex.flex-col.w-full.h-full
        .relative.w-full.items-center(class='flex mt-10')
          input(class='w-full placeholder:text-primary' v-model='searchAddr' @keyup.enter='navigateToAddress')#search.pl-10.bg-transparent.outline-none.bg-transparent.text-primary.border.border-primary.p-1(type='text' placeholder='Search by address...')
          span.absolute.start-0.inset-y-0.flex.items-center.justify-center.px-2(@click='')
            Icon(@click='navigateToAddress' name="ph:magnifying-glass" size="1.5rem" class='cursor-pointer').text-primary
        ul.list-none.p-0.flex.flex-col.w-full.gap-6.mt-10
          li.inline-block.list-none.ml-7.text-white(v-for='(item,index) in navigator' :key='item')
            NuxtLink(:to='item.to' v-if='item.text !== "Validators"').text-lightGray {{ item.text }}
              span.link__style
              | &nbsp;
            NuxtLink.link(:to='item.to' v-else).text-white {{ item.text }}
              span.link__style
              | &nbsp;
   
</template>

<style lang="scss" scoped>
.router-link-active {
  @apply border-b border-primary cursor-default;
}

.link {
  @apply relative;

  &__style {
    @apply h-[1px] inline-block w-0 bg-primary absolute -bottom-0.5 left-0 z-10;
  }

  &:not(.active):hover {
    .link__style {
      @apply w-full ease-out duration-300;
    }
  }
}

.menu-enter-active,
.menu-leave-active {
  @apply translate-x-0 duration-500 ease-out;
}

.menu-enter-from,
.menu-leave-to {
  @apply translate-x-60 duration-500 ease-in-out;
}
</style>

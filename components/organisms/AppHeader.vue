<script setup lang="ts">
import { provide, ref } from "vue";
import { useHead } from "#imports";

import { Input } from "@/components/ui/input";
import { useRouter } from "vue-router";
import AppSideBarMobile from "./AppSideBarMobile.vue";

const searchValue = ref("");

// const head = useHead({
//   script: [
//     {
//       hid: "stripe",
//       src: "https://cryptorank.io/widget/marquee.js",
//       defer: true,
//     },
//   ],
// });

const openMobileMenu = ref(false);
provide("openMobileMenuState", openMobileMenu);

const toggleMobileMenu = () => {
  openMobileMenu.value = !openMobileMenu.value;
};

const navigator = [
  // {
  //   text: "Home",
  //   to: "/",
  // },
  {
    text: "Blocks",
    to: "/blocks",
  },
  {
    text: "Validators",
    to: "/validators",
  },
  {
    text: "Transactions",
    to: "/transactions",
  },
];

const router = useRouter();

const globalSearch = () => {
  const trimmedSearchValue = searchValue.value.trim();
  let routeDetails = { name: "", params: {} };

  if (trimmedSearchValue.length === 64) {
    routeDetails = {
      name: "transactions-hash",
      params: { hash: trimmedSearchValue },
    };
  } else if (trimmedSearchValue.length === 40) {
    routeDetails = {
      name: "validators-address",
      params: { address: trimmedSearchValue },
    };
  } else {
    routeDetails = {
      name: "blocks-height",
      params: { height: trimmedSearchValue },
    };
  }

  router.push(routeDetails);

  // Clear the search input
  searchValue.value = "";
};
</script>

<template lang="pug">
div
  header.relative.z-10
    section.bg-black
      //- #cr-widget-marquee(data-coins='ethereum,lido-staked-ether,aleph-zero,injective-protocol,sei-network,cosmos,sui,aptos,matic-network,avalanche,kava,celestia,agoric' data-theme='dark' data-show-symbol='true' data-show-icon='true' data-show-period-change='true' data-period-change='24H' data-api-url='https://api.cryptorank.io/v0')
    section(class='bg-dark').p-8.w-full.mx-auto
      div.container.mx-auto
        div(class='flex items-center')
          div(class='hidden w-1/3 lg:block')
            .px-2.flex.items-center.justify-between
              ul.list-none.p-0.flex.w-full
                li.inline-block.list-none.ml-7.text-white(v-for='(item,index) in navigator' :key='item')
                  //- span(:to='item.to' v-if='item.text !== "Validators"').text-lightGray {{ item.text }}
                  //-   span.link__style
                  //-     | &nbsp;
                  NuxtLink.link(:to='item.to').text-white {{ item.text }}
                    span.link__style
                      | &nbsp;

          div(class='flex items-center justify-start w-1/3 text-white lg:justify-center')
          div(class='w-2/3 lg:w-full').flex.justify-end.items-end
            .relative.w-full.items-center(class='hidden lg:flex')
              input(class='w-full placeholder:text-primary' v-model='searchValue' @keyup.enter='globalSearch')#search.pl-10.bg-transparent.outline-none.bg-transparent.text-primary.border.border-primary.p-1(type='text' placeholder='Search by height/ tx hash/ validator address...')
              span.absolute.start-0.inset-y-0.flex.items-center.justify-center.px-2(@click='')
                Icon(@click='globalSearch' name="ph:magnifying-glass" size="1.5rem" class='cursor-pointer').text-primary

            div(class='w-2/3 lg:w-1/3').flex.justify-end
              NuxtImg(src='/imgs/svg/menu.svg' alt='Logo' width='19' height='14' class='w-10' loading='lazy' class='block lg:hidden' @click='toggleMobileMenu')
  AppSideBarMobile

                
                
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
</style>

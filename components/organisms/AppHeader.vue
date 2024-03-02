<!-- <script lang="ts" setup></script>

<template>
  <header
    class="relative flex items-center justify-start w-full h-20 px-4 mx-auto mt-4 border shadow-md border-slate-200 px- rounded-3xl"
  >
    <NuxtImg src="/imgs/svg/radar.svg" class="w-8" />
    <div class="flex flex-col justify-center pl-2">
      <p class="font-bold">shielded-expedition.88f17d1d14</p>
      <p class="text-sm">https://rpc.namada.stakeup.tech</p>
    </div>
  </header>
</template>

<style lang="scss" scoped></style> -->
<script setup lang="ts">
import { provide, ref } from 'vue'
import { useHead } from '#imports'

const head = useHead({
  script: [
    {
      hid: 'stripe',
      src: 'https://cryptorank.io/widget/marquee.js',
      defer: true,
    },
  ],
})

const openMobileMenu = ref(false)
provide('openMobileMenuState', openMobileMenu)

const toggleMobileMenu = () => {
  openMobileMenu.value = !openMobileMenu.value
}

const navigator = [
  {
    text: 'Home',
    to: '/',
  },
  {
    text: 'Blocks',
    to: '/blocks',
  },
  {
    text: 'Validators',
    to: '/validators',
  },
  {
    text: 'Transaction',
    to: '/transaction',
  },
]
</script>

<template lang="pug">
div
  header.relative.z-10
    section.bg-black
      #cr-widget-marquee(data-coins='ethereum,lido-staked-ether,aleph-zero,injective-protocol,sei-network,cosmos,sui,aptos,matic-network,avalanche,kava,celestia,agoric' data-theme='dark' data-show-symbol='true' data-show-icon='true' data-show-period-change='true' data-period-change='24H' data-api-url='https://api.cryptorank.io/v0')
    section(class='bg-dark').p-8.w-full.mx-auto
      div.container.mx-auto
        div.flex.items-center
          div(class='w-1/3 lg:block')
            .px-2.flex.items-center.justify-between
              ul.list-none.p-0.flex.w-full
                li.inline-block.list-none.ml-7.text-white(v-for='(item,index) in navigator' :key='item')
                  NuxtLink(:to='item.to' v-if='index % 2 !== 0').text-lightGray {{ item.text }}
                    span.link__style
                      | &nbsp;
                  NuxtLink.link(:to='item.to' v-else).text-white {{ item.text }}
                    span.link__style
                      | &nbsp;

          div(class='flex items-center justify-start w-1/3 text-white lg:justify-center')
            //- img(src='~/assets/imgs/logo.svg' alt='Logo' width='207' height='32' class='w-10' loading='lazy')

          div(class='w-2/3 lg:w-1/3').flex.justify-end
            //- AtomsCustomButton(type='small' class='cursor-not-allowed' class='hidden lg:block') Login
            //- img(src='~/assets/imgs/icons/menu.svg' alt='Logo' width='19' height='14' class='w-10' loading='lazy' class='block lg:hidden' @click='toggleMobileMenu')
  //- AppSidebarMobile

                
                
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

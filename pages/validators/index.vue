<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAsyncData, useLazyAsyncData, useRuntimeConfig } from "#app";
import { Loader2 } from 'lucide-vue-next'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useValidatorStore } from "~/stores/validators.store";
// COMMIT SIGNATURES,	PARTICIPATION
const header = [
  "No",
  "Validator",
  "Moniker",
  "Up Time",
  "Voting Power",
  "Commit Signatures",
  "Participation",
];

const searchValue = ref("");
const currentPage = ref(1);
const isLoading = ref(false)

const validatorStore = useValidatorStore();

if (validatorStore.allValidators.length === 0) {
  const { data: allValidators } = await useAsyncData("all-validators", () =>
    validatorStore.fetchValidatorList()
  );
}

const { data: paginatedValidators } = await useAsyncData(
  `validators-pagination-${currentPage.value}`,
  () => validatorStore.paginationValidator(currentPage.value)
);

const loadMoreData = async () => {
  isLoading.value = true
  currentPage.value += 1
  await validatorStore.paginationValidator(currentPage.value)
  isLoading.value = false
}
</script>

<template lang="pug">
main
    article
        section.bg-dark.relative.overflow-hidden.min-h-screen
            .container(class='z-10 p-8 mx-auto lg:p-10')
                  div(class='relative w-full h-fit rounded-3xl')
                      .flex.flex-col.items-center.justify-center.gap-10.w-full
                          h2.uppercase.font-ultraBold.text-white.text-center
                              | Validators
                          div(class='flex flex-col items-center w-full space-y-5 lg:space-y-0 lg:flex-row')
                              div.flex.w-full.items-center.justify-center
                                  div(class='w-full lg:w-1/3').border.border-primary.h-14
                                      input(type='text' v-model='searchValue' class='placeholder:text-primary' placeholder="You email address...").w-full.h-full.p-4.outline-none.border-none.bg-transparent.text-primary
                                  button(type='button' class='w-full px-6 py-3 cursor-pointer bg-primary font-ultraBold lg:w-fit h-14') Search
                          div.container.mx-auto
                            div(class='flex items-center justify-center w-full px-10')
                              Table.mt-3
                                //- TableCaption.text-white A list of your recent validators.
                                TableHeader
                                    TableRow
                                        TableHead(v-for='text in header' class='w-[100px] text-primary font-semibold')
                                            | {{ text }}
                                TableBody
                                    TableRow(v-for='(validator,index) in validatorStore.validatorPagination' :key='validator.address')
                                      TableCell.text-white {{ index }}
                                      TableCell.font-medium.text-white
                                        | {{ validator.address }}
                                      TableCell.text-white {{ validator.moniker}}
                                      TableCell.text-white {{ validator.uptime }}
                                      TableCell.text-right.text-white {{ validator.voting_power }}
                                      TableCell.text-right.text-white {{ validator.commitSignature }}
                                      TableCell.text-right.text-white {{ validator.voting_percentage }}%
                          Button.flex.items-center(@click='loadMoreData')
                            span(class='-translate-y-[2px]')
                              Loader2(class="w-4 h-4 mr-2 animate-spin" v-if='isLoading')
                            | Load More                  
</template>

<style lang="scss" scoped>
// .roadmap-pagination {
//   .btn-pagination {
//     @apply w-4 h-1 bg-lightGray rounded-lg duration-300 ease-out cursor-pointer;

//     &.active {
//       @apply w-8 h-1 bg-black #{!important};
//     }
//   }
// }
</style>

<script setup lang="ts">
import { ref } from "vue";
import { useAsyncData, useRuntimeConfig } from "#app";
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
  "Validator",
  "Moniker",
  "Up Time",
  "Voting Power",
  "Commit Signatures",
  "Participation",
];
const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
  },
];

const searchValue = ref("");

const currentPage = 1;
const validatorStore = useValidatorStore();

await useAsyncData("validators", () =>
  validatorStore.fetchValidator(currentPage)
);
</script>

<template lang="pug">
main
    article
        section.bg-dark.relative.overflow-hidden
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
                                TableCaption.text-white A list of your recent invoices.
                                TableHeader
                                    TableRow
                                        TableHead(v-for='text in header' class='w-[100px] text-primary font-semibold')
                                            | {{ text }}
                                TableBody
                                    TableRow(v-for='invoice in invoices' :key='invoice.invoice')
                                      TableCell.font-medium.text-white
                                        | {{ invoice.invoice }}
                                      TableCell.text-white {{ invoice.paymentStatus }}
                                      TableCell.text-white {{ invoice.paymentMethod }}
                                      TableCell.text-right.text-white {{ invoice.totalAmount }}
</template>

<style lang="scss" scoped>
.roadmap-pagination {
  .btn-pagination {
    @apply w-4 h-1 bg-lightGray rounded-lg duration-300 ease-out cursor-pointer;

    &.active {
      @apply w-8 h-1 bg-black #{!important};
    }
  }
}
</style>

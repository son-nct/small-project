import { defineStore, acceptHMRUpdate } from "pinia";
import { useFetch, useNuxtApp, useRuntimeConfig } from "#app";
import { h } from "vue";
import { useToast } from "@/components/ui/toast/use-toast";
import { ToastAction } from "@/components/ui/toast";

interface Transaction {
  hash: string;
  block_id: string;
  tx_type: string;
  wrapper_id: string;
  fee_amount_per_gas_unit: string;
  fee_token: string;
  gas_limit_multiplier: number;
  code: string;
  data: string;
  return_code: null | string;
  tx: null | string;
}

interface TransactionsResponse {
  data: Transaction[];
  total: number;
}

export const useTransactionStore = defineStore("transactions", {
  state: () => ({
    latestTransaction: [] as Transaction[],
  }),
  actions: {
    showErrToast(msg: string) {
      const { toast } = useToast();
      toast({
        title: `Uh oh! Something went wrong with ${msg}.`,
        description: "There was a problem with your request.",
        variant: "destructive",
        action: h(
          ToastAction,
          {
            altText: "Try again",
          },
          {
            default: () => "Try again",
          }
        ),
      });
    },
    async fetchLatestTransactionList() {
      try {
        const runtimeConfig = useRuntimeConfig();
        const baseURI = "/tx";
        const apiUrl = runtimeConfig.public.NAMANDA_BASE_URL + baseURI;
        const size_of_page = 10;
        const page = 1;

        const { data, error } = await useFetch(`${apiUrl}`, {
          params: {
            page,
            size_of_page,
          },
        });

        if (data.value) {
          const newData = await this.normalizeTransactionData(data.value.data);
          this.latestTransaction = [...newData]  

          // return data.value.data;
        } else if (error.value) {
          this.showErrToast("fetch transaction list");
        }
      } catch (error) {
        this.showErrToast("fetch transaction list");
      }
    },
    formatTimeAgo(dateTime: string) {
      if (!dateTime) return;
      const nuxtApp = useNuxtApp();
      const timeAgo = nuxtApp.$TimeFormatter;
      const date = new Date(dateTime).getTime();
      return timeAgo.format(date);
    },
    async normalizeTransactionData(transactions: Transaction[]) {
      if (!transactions) return null;

      const transactionsPromises = transactions.map(
        async (transaction: Transaction) => {
          const { height, time } = await this.fetchLatestHeightBlockById(
            transaction.block_id
          ); // Await the height here
          return {
            tx: transaction.hash,
            type:
              transaction.tx && Object.keys(transaction.tx).length > 0
                ? Object.keys(transaction.tx)[0]
                : transaction?.tx_type,
            shielded:
              transaction.tx?.Transfer && transaction.tx.Transfer?.shielded
                ? "Yes"
                : "No",
            status: transaction.tx_type === "Wrapper" ? "Success" : "Fail",
            height, // Use the awaited height
            time: this.formatTimeAgo(time),
          };
        }
      );

      const transactionWithBlock = await Promise.all(transactionsPromises);
      return transactionWithBlock
    },
    async fetchLatestHeightBlockById(blockId: string) {
      try {
        const runtimeConfig = useRuntimeConfig();
        const baseURI = "/block/hash";
        const apiUrl = runtimeConfig.public.NAMANDA_BASE_URL + baseURI;
        const { data, error } = await useFetch(`${apiUrl}/${blockId}`);

        if (data.value) {
          return {
            time: data.value.header.time,
            height: data.value.header.height,
          };
        } else if (error.value) {
          this.showErrToast("fetch transaction list");
        }
      } catch (error) {
        this.showErrToast("fetch transaction list");
      }
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTransactionStore, import.meta.hot));
}

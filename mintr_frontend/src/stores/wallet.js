import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useWalletStore = defineStore('wallet', () => {
  const connected = ref(false);
  const weth = ref(null);

  const address = computed(() => {
    if (connected.value && weth.value) {
      return weth.value.selectedAddress;
    } else {
      return '';
    }
  })

  return { connected, weth, address };
},
{
  persist: {
    storage: sessionStorage,
    paths: ['connected']
  }
})

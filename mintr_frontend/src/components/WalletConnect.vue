<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { useWalletStore } from '@/stores/wallet';
import useEventsBus from '@/eventbus/eventBus.js';

const { emit } = useEventsBus();

const wallet = useWalletStore();

const disableButton = ref(false);
const connected = ref(wallet.connected);
const addressToShow = ref('0x0000...0000');

async function connectWallet() {
    if (window.ethereum && typeof window.ethereum != "undefined") {
        try {
            // Connect to wallet:
            disableButton.value = true;
            await window.ethereum.request({ method: "eth_requestAccounts" });
            wallet.weth = window.ethereum;
            wallet.connected = true;
            disableButton.value = false;
            // Refresh addressToShow:
            addressToShow.value = wallet.weth.selectedAddress.slice(0, 6) + '...' + wallet.weth.selectedAddress.slice(-4);
        } catch (error) {
            wallet.connected = false;
            disableButton.value = false;
            emit('errorEmit', 'Error during wallet connection. If you are using a browser and you don\'t have a wallet yet, install one and retry (we recommend using Metamask browser extension: https://metamask.io).');
        }
    } else {
        wallet.connected = false;
        disableButton.value = false;
        emit('errorEmit', 'Please install a browser compatible wallet first (we recommend using Metamask browser extension: https://metamask.io).');
    }
    connected.value = wallet.connected;
}

onBeforeMount(async() => {
    if (wallet.connected) {
        await connectWallet();
        addressToShow.value = wallet.address.slice(0, 6) + '...' + wallet.address.slice(-4);
    }
});

onMounted(async() => {
    if (window.ethereum) {
        window.ethereum.on('accountsChanged', async () => {
            await connectWallet();
            addressToShow.value = wallet.address.slice(0, 6) + '...' + wallet.address.slice(-4);
            emit('reloadEmit', true);
        })
    }
});
</script>

<template>
    <div v-if="connected" class="card text-center text-bg-dark connector">
        <div class="card-body content-wrapper pt-2">
            <img class="wallet-logo me-2" src="@/assets/wallet-solid-light.svg" alt="wallet icon">
            <p class="card-text">{{ addressToShow }}</p>
        </div>
    </div>
    <button v-else class="btn btn-dark connector" @click="connectWallet" :disabled="disableButton">Connect wallet</button>
</template>

<style scoped>
.connector {
    height: 2.6rem;
}
</style>

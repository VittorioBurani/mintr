<script setup>
import { useWalletStore } from '@/stores/wallet';

const wallet = useWalletStore();
</script>

<template>
    <div class="d-flex justify-content-center">
        <div class="content-wrapper">
            <img class="homepage-logo me-2" src="@/assets/mintr.svg" alt="Mintr logo. Author: https://blog.icon-icons.com/">
            <h1 class="fs-1"><span class="mint">Mintr</span> - Open Source NFT Marketplace</h1>
        </div>
    </div>
    <div class="d-flex flex-column justify-content-center align-items-center">
        <p class="fs-3 mt-4" v-if="!wallet.connected">To get started, <span class="mint">connect your wallet</span> (as of today only browser extensions are supported)!</p>
        <p class="fs-3 my-4">The only NFT marketplace you'll ever need for your next project</p>
        <p class="fs-4 mb-4">Built on top of Web3. By the community, for the community</p>
        <p class="fs-5 mb-4">The source code is open and is available on GitHub: <a href="https://github.com/VittorioBurani/mintr">https://github.com/VittorioBurani/mintr</a></p>
        <p class="fs-5 mb-4">Mintr logo by <a href="https://icon-icons.com/users/Icon-Icons/icon-sets/">Icon-Icons</a></p>
    </div>
</template>

<style scoped>
.homepage-logo {
    width: 4rem;
    height: auto;
}
</style>

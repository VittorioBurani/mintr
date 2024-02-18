<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { ethers } from 'ethers';
import { useWalletStore } from '@/stores/wallet';
import { putUpFromSale, removeFromSale, buyNFT } from '@/helpers/mintr-contract-helpers.js';
import useEventsBus from '@/eventbus/eventBus.js';

const MINTR_NFT_CONTRACT_ADDRESS = import.meta.env.VITE_MINTR_NFT_CONTRACT_ADDRESS;
const wallet = useWalletStore();
const router = useRouter();
const { emit } = useEventsBus();

const refreshPage = () => {
  router.go(); // Reloads the current route
};

const props = defineProps({
    tokenId: Number,
    tokenUri: String,
    to: String,
    from: String,
    price: Number,
    name: String,
    description: String,
    imageUrl: String
})

const formCloseBtn = ref(null);
const priceInput = ref('');
const disableButtons = ref(false);

const ethPrice = computed(() => {
    return (props.price / 1000000000000000) / 1000;
});

async function abortSale() {
    disableButtons.value = true;
    try {
        await removeFromSale(wallet.weth, props.tokenId);
        formCloseBtn.value.click();
        disableButtons.value = false;
        refreshPage();
    } catch (error) {
        formCloseBtn.value.click();
        disableButtons.value = false;
        emit('errorEmit', 'Transaction aborted');
    }
}

async function buy() {
    disableButtons.value = true;
    try {
        await buyNFT(wallet.weth, props.tokenId, props.price);
        formCloseBtn.value.click();
        disableButtons.value = false;
        refreshPage();
    } catch (error) {
        formCloseBtn.value.click();
        disableButtons.value = false;
        emit('errorEmit', 'Transaction aborted');
    }
}

async function sell() {
    disableButtons.value = true;
    if (priceInput.value == '') {
        formCloseBtn.value.click();
        disableButtons.value = false;
        emit('errorEmit', 'Invalid price');
    } else {
        try {
            const wei = ethers.utils.parseEther(priceInput.value);
            if (wei.lte(0)) {
                formCloseBtn.value.click();
                disableButtons.value = false;
                emit('errorEmit', 'Invalid price');
            } else {
                try {
                    await putUpFromSale(wallet.weth, props.tokenId, wei);
                    formCloseBtn.value.click();
                    disableButtons.value = false;
                    refreshPage();
                } catch (error) {
                    formCloseBtn.value.click();
                    disableButtons.value = false;
                    emit('errorEmit', 'Transaction aborted');
                }
            }
        } catch (error) {
            formCloseBtn.value.click();
            disableButtons.value = false;
            emit('errorEmit', 'Invalid price');
        }
    }
}
</script>

<template>
<div class="card me-2 mb-2">
    <img :src="imageUrl" class="card-img-top" :alt="name">
    <div class="card-body text-bg-dark d-flex flex-column align-items-center">
        <h5 class="card-title">{{ tokenId }} - {{ name }}</h5>
        <p class="card-text">{{ description }}</p>
        <div v-if="disableButtons" class="card text-center text-bg-light fakebtn">
            <img class="loading-gif mb-1 mx-auto" src="@/assets/loading.gif" alt="loading gif">
        </div>
        <button v-else-if="to == wallet.address && !disableButtons" class="btn btn-light" data-bs-toggle="modal" :data-bs-target="'#staticBackdrop'+tokenId">
            Sell this NFT
        </button>
        <span v-else-if="to == MINTR_NFT_CONTRACT_ADDRESS && !disableButtons" class="d-flex flex-column align-items-center" style="width: 100%;">
            <button v-if="from == wallet.address" class="btn btn-light" data-bs-toggle="modal" :data-bs-target="'#staticBackdrop'+tokenId" style="width: 100%;">
                Remove from sale
            </button>
            <button v-else class="btn btn-light content-wrapper" data-bs-toggle="modal" :data-bs-target="'#staticBackdrop'+tokenId" style="width: 100%;">
                {{ ethPrice }}
                <img class="eth-logo mb-1" src="@/assets/ethereum.svg" alt="Ethereum brand">
            </button>
        </span>
    </div>
</div>

<!-- Modal -->
<div class="modal fade" :id="'staticBackdrop'+tokenId" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" :aria-labelledby="'staticBackdrop'+tokenId+'Label'" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">

      <!-- Header -->
      <div class="modal-header">
        <h1 v-if="to == wallet.address" class="modal-title fs-5" :id="'staticBackdrop'+tokenId+'Label'">
            Enter a valid ETH price
        </h1>

        <h1 v-else-if="to == MINTR_NFT_CONTRACT_ADDRESS" class="modal-title fs-5" :id="'staticBackdrop'+tokenId+'Label'">
            <span v-if="from == wallet.address">
                Do you want to remove NFT-{{ tokenId }} from sale?
            </span>
            <span v-else>
                Do you want to buy NFT-{{ tokenId }} ({{ name }})?
            </span>
        </h1>
        <button ref="formCloseBtn" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" style="width: 20px;"></button>
      </div>

      <!-- Content -->
      <div v-if="to == wallet.address" class="modal-body">
          <form @submit.prevent="sell" ref="sellForm" class="d-flex" action="#" method="post">
              <input v-model="priceInput" name="priceInput" type="text" class="nft-price form-control" placeholder="Price" aria-label="Price">
              <div v-if="disableButtons" class="card text-center text-bg-dark fakebtn" style="width: 30%;">
                <img class="loading-gif mb-1 mx-auto" src="@/assets/loading.gif" alt="loading gif">
              </div>
              <button v-else type="submit" class="btn btn-dark" style="width: 30%;">Sell</button>
          </form>
      </div>

      <div v-else-if="to == MINTR_NFT_CONTRACT_ADDRESS" class="modal-body">
        <div v-if="from == wallet.address">
            <div v-if="disableButtons" class="card text-center text-bg-dark fakebtn" style="width: 100%;">
                <img class="loading-gif mb-1 mx-auto" src="@/assets/loading.gif" alt="loading gif">
            </div>
            <div v-else class="d-flex">
                <button type="button" class="btn btn-danger me-1" data-bs-dismiss="modal">Dismiss</button>
                <button @click="abortSale" type="button" class="btn btn-success ms-1">Confirm</button>
            </div>
        </div>

        <div v-else>
            <div v-if="disableButtons" class="card text-center text-bg-dark fakebtn" style="width: 100%;">
                <img class="loading-gif mb-1 mx-auto" src="@/assets/loading.gif" alt="loading gif">
            </div>
            <div v-else class="d-flex">
                <button type="button" class="btn btn-danger me-1" data-bs-dismiss="modal">Dismiss</button>
                <button @click="buy" type="button" class="btn btn-success ms-1">Confirm</button>
            </div>
        </div>
      </div>

    </div>
  </div>
</div>
</template>

<style scoped>
.card {
    width: 18.5rem;
}

.card-img-top {
    max-width: 300px;
    height: 500px;
}

.card-title {
    color: #4caf6d;
}

.card-text {
    color: whitesmoke;
}

.fakebtn {
    height: 2.375rem;
    width: 100%;
}

button {
    width: 100%;
}
</style>

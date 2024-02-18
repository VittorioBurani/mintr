<script setup>
import { ref } from 'vue';
import ImageUpload from '@/components/ImageUpload.vue';
import { useWalletStore } from '@/stores/wallet';
import { NFTStorage, File } from 'nft.storage'
import { safeMint } from '@/helpers/mintr-contract-helpers.js';
import useEventsBus from '@/eventbus/eventBus.js';

const NFT_STORAGE_KEY = import.meta.env.VITE_NFT_STORAGE_KEY
const nftStorageClient = new NFTStorage({ token: NFT_STORAGE_KEY });

const wallet = useWalletStore();

const { emit } = useEventsBus();

const nftForm = ref(null);
const fileName = ref('');
const fileContent = ref('');
const disableButton = ref(false);

function fromDataUrl2Buffer (dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], fileName.value, { type: mime });
}

async function mintNFT () {
    disableButton.value = true;
    try {
        var formData = new FormData(nftForm.value);
        if (!(formData.get('name') && formData.get('description'))) {
            disableButton.value = false;
            emit('errorEmit', 'Missing name or description');
            return;
        }
        if (!fileContent.value) {
            disableButton.value = false;
            emit('errorEmit', 'No image selected');
            return;
        }
        const imageFile = fromDataUrl2Buffer(fileContent.value);
        const metadata = await nftStorageClient.store({
            name: formData.get('name'),
            description: formData.get('description'),
            image: imageFile
        })
        try {
            await safeMint(wallet.weth, metadata.url);
        } catch (error) {
            emit('errorEmit', 'Transaction aborted');
        }
    } catch (error) {
        emit('errorEmit', 'Error while storing the NFT on IPFS. Retry later...');
    }
    disableButton.value = false;
}
</script>

<template>
    <div class="d-flex flex-column align-items-center">
        <p class="fs-2">Mint your NFT!</p>
        <form ref="nftForm" action="#" enctype="multipart/form-data" method="post" class="d-flex justify-content-center align-items-center">
            <ImageUpload @fileEmitted="(fName, fBuf) => {fileContent = fBuf; fileName = fName;}"/>
            <div class="ms-2 p-0">
                <input name="name" type="text" class="nft-name form-control mb-2" placeholder="NFT name" aria-label="NFT name">
                <textarea name="description" class="nft-description form-control mb-2" placeholder="Add description here..." aria-label="NFT description"></textarea>
                <span v-if="disableButton">
                    <div class="card text-center text-bg-dark fakebtn fake-btn">
                        <img class="loading-gif mb-1 mx-auto" src="@/assets/loading.gif" alt="loading gif">
                    </div>
                </span>
                <span v-else>
                    <button @click.prevent="mintNFT" type="submit" class="nft-submit btn btn-dark">
                        Mint NFT!
                        <img class="eth-logo ms-1 mb-1" src="@/assets/ethereum-light.svg" alt="wallet icon">
                    </button>
                </span>
            </div>
        </form>
    </div>
</template>

<style scoped>
.nft-name {
    width: 300px;
}

.nft-description {
    width: 300px;
    height: 408px;
}

.nft-submit {
    width: 300px;
}

.fake-btn {
    width: 300px;
    height: 2.375rem;
}
</style>

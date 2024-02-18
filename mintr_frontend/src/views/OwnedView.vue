<script setup>
import { ref, onMounted } from 'vue';
import NFTDisplayer from '@/components/NFTDisplayer.vue';
import { useWalletStore } from '@/stores/wallet';
import { getOwnedNFTs, getOnSaleNFTs } from '@/graphql/queries';
import { fetchMetadata } from '@/helpers/uri-url-helpers.js';

const wallet = useWalletStore();
const ownedNFTs = ref([]);
const onSaleNFTs = ref([]);

onMounted(async() => {
    let nfts = await getOwnedNFTs(wallet.address);
    for (let nft of nfts) {
        let { name, description, imageUrl } = await fetchMetadata(nft.tokenUri);
        nft.id = Number(nft.id);
        nft.name = name;
        nft.description = description;
        nft.imageUrl = imageUrl;
    }
    ownedNFTs.value = nfts;
})

onMounted(async() => {
    let nfts = await getOnSaleNFTs(wallet.address);
    for (let nft of nfts) {
        let { name, description, imageUrl } = await fetchMetadata(nft.tokenUri);
        nft.id = Number(nft.id);
        nft.name = name;
        nft.description = description;
        nft.imageUrl = imageUrl;
    }
    onSaleNFTs.value = nfts;
})
</script>

<template>
    <div class="col">
        <div class="row">
            <h3 class="mx-auto mb-3">Owned</h3>
            <div v-if="ownedNFTs.length != 0" class="d-flex flex-wrap">
                <div v-for="nft in ownedNFTs">
                    <NFTDisplayer :key="nft.id"
                                  :tokenId="nft.id"
                                  :tokenUri="nft.tokenUri"
                                  :to="nft.to"
                                  :from="nft.from"
                                  :price="Number(nft.price)"
                                  :name="nft.name"
                                  :description="nft.description"
                                  :imageUrl="nft.imageUrl"/>
                </div>
            </div>
            <p v-else-if="onSaleNFTs.length == 0" class="mx-auto fs-5">You don't have any NFTs yet.</p>
            <p v-else class="mx-auto fs-5">All your NFTs are on sale.</p>
        </div>
        <div v-if="onSaleNFTs.length != 0">
            <hr>
            <div class="row">
                <h3 class="mx-auto mb-3">On sale</h3>
                <div class="d-flex flex-wrap">
                    <div v-for="nft in onSaleNFTs">
                        <NFTDisplayer :key="nft.id"
                                      :tokenId="nft.id"
                                      :tokenUri="nft.tokenUri"
                                      :to="nft.to"
                                      :from="nft.from"
                                      :price="Number(nft.price)"
                                      :name="nft.name"
                                      :description="nft.description"
                                      :imageUrl="nft.imageUrl"/>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
hr {
    background-color: #4caf6d;
}
</style>

<script setup>
import { ref, onMounted } from 'vue';
import NFTDisplayer from '@/components/NFTDisplayer.vue';
import { useWalletStore } from '@/stores/wallet';
import { getMarketplaceNFTs } from '@/graphql/queries';
import { fetchMetadata } from '@/helpers/uri-url-helpers.js';

const wallet = useWalletStore();

const marketplaceNFTs = ref([]);

onMounted(async() => {
    let nfts = await getMarketplaceNFTs(wallet.address);
    for (let nft of nfts) {
        let { name, description, imageUrl } = await fetchMetadata(nft.tokenUri);
        nft.id = Number(nft.id);
        nft.name = name;
        nft.description = description;
        nft.imageUrl = imageUrl;
    }
    marketplaceNFTs.value = nfts;
})
</script>

<template>
    <div class="d-flex flex-column justify-content-center">
        <h3 class="mx-auto">NFT Showcase</h3>
        <p class="fs-5 mx-auto">There's plenty of valuable art pieces here: add a new NFT to your collection today!</p>
    </div>
    <div class="d-flex flex-wrap">
        <div v-for="nft in marketplaceNFTs">
            <NFTDisplayer :key="nft.id"
                          :tokenId="nft.id"
                          :tokenURI="nft.tokenURI"
                          :to="nft.to"
                          :from="nft.from"
                          :price="Number(nft.price)"
                          :name="nft.name"
                          :description="nft.description"
                          :imageUrl="nft.imageUrl"/>
        </div>
    </div>
</template>

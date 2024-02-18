import axios from "axios";

const THE_GRAPH_URL = import.meta.env.VITE_THE_GRAPH_URL
const MINTR_NFT_CONTRACT_ADDRESS = import.meta.env.VITE_MINTR_NFT_CONTRACT_ADDRESS

async function getOwnedNFTs(owner) {
    var response = await axios({
        method: "POST",
        url: THE_GRAPH_URL,
        headers: { "content-type": "application/json" },
        data: {
            "operationName": "getOwnedNfts",
            "query": `query getOwnedNfts($owner: String!) {
              nfts(where: {to: $owner}) {
                id
                from
                to
                price
                tokenUri
              }
            }`,
            "variables": {
                "owner": owner
            }
        },
    })
    .catch(e => console.log(e));
    let nfts = response.data.data.nfts;
    return nfts;
}

async function getOnSaleNFTs(owner) {
    var response = await axios({
        method: "POST",
        url: THE_GRAPH_URL,
        headers: { "content-type": "application/json" },
        data: {
            "operationName": "getOwnedNfts",
            "query": `query getOwnedNfts($owner: String!, $marketplace: String!) {
              nfts(where: {from: $owner, to: $marketplace}) {
                id
                from
                to
                price
                tokenUri
              }
            }`,
            "variables": {
                "owner": owner,
                "marketplace": MINTR_NFT_CONTRACT_ADDRESS
            }
        },
    })
    .catch(e => console.log(e));
    let nfts = response.data.data.nfts;
    return nfts;
}

async function getMarketplaceNFTs(userAddress) {
    var response = await axios({
        method: "POST",
        url: THE_GRAPH_URL,
        headers: { "content-type": "application/json" },
        data: {
            "operationName": "getOwnedNfts",
            "query": `query getOwnedNfts($user: String!, $marketplace: String!) {
              nfts(where: {from_not: $user, to: $marketplace}) {
                id
                from
                to
                price
                tokenUri
              }
            }`,
            "variables": {
                "user": userAddress,
                "marketplace": MINTR_NFT_CONTRACT_ADDRESS
            }
        },
    })
    .catch(e => console.log(e));
    let nfts = response.data.data.nfts;
    return nfts;
}

export {
    getOwnedNFTs,
    getOnSaleNFTs,
    getMarketplaceNFTs
}

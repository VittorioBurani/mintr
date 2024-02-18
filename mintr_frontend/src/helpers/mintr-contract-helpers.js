import { ethers } from 'ethers';
import MINTR_NFT_JSON from '../../../mintr_contracts/build/contracts/MintrNFT.json';

const MINTR_NFT_CONTRACT_ADDRESS = import.meta.env.VITE_MINTR_NFT_CONTRACT_ADDRESS

const safeMint = async (windEth, tokenUri) => {
    var contract = new ethers.Contract(
        MINTR_NFT_CONTRACT_ADDRESS,
        MINTR_NFT_JSON.abi,
        new ethers.providers.Web3Provider(windEth).getSigner()
    );
    var tx = await contract.safeMint(tokenUri);
    await tx.wait();
}

const putUpFromSale = async (windEth, tokenId, price) => {
    var contract = new ethers.Contract(
        MINTR_NFT_CONTRACT_ADDRESS,
        MINTR_NFT_JSON.abi,
        new ethers.providers.Web3Provider(windEth).getSigner()
    );
    var tx = await contract.putUpFromSale(tokenId, price);
    await tx.wait();
}

const removeFromSale = async (windEth, tokenId) => {
    var contract = new ethers.Contract(
        MINTR_NFT_CONTRACT_ADDRESS,
        MINTR_NFT_JSON.abi,
        new ethers.providers.Web3Provider(windEth).getSigner()
    );
    var tx = await contract.removeFromSale(tokenId);
    await tx.wait();
}

const buyNFT = async (windEth, tokenId, price) => {
    var contract = new ethers.Contract(
        MINTR_NFT_CONTRACT_ADDRESS,
        MINTR_NFT_JSON.abi,
        new ethers.providers.Web3Provider(windEth).getSigner()
    );
    const options = {value: String(price)}
    var tx = await contract.buyNFT(tokenId, options);
    await tx.wait();
}

export {
    safeMint,
    putUpFromSale,
    removeFromSale,
    buyNFT
};

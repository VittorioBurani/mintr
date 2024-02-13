const { BN, constants, expectEvent, expectRevert } = require('@openzeppelin/test-helpers');
const { web3 } = require('@openzeppelin/test-helpers/src/setup');
const { ZERO_ADDRESS } = constants;

const { expect } = require('chai');

// Contract:
const MintrNFT = artifacts.require("MintrNFT");

// Constants:
const tokenUri1 = "https://ipfs.io/ipfs/QmYnqYH8oJkX2k7b7iXjRJqK5yLw2Uj5VQpKpSs6sDjVjQ";
const tokenUri2 = "https://ipfs.io/ipfs/QmYnqYH8oJkX2k7b7iXjRJqK5yLw2Uj5VQpKpSs6sDjVjR";


// Test:
contract("MintrNFT test", async (accounts) => {
    const [Owner, Account1, Account2, Account3] = accounts;

    it("MintrNFT contract deployed", async () => {
        this.mintrnft = await MintrNFT.deployed();
        expect(this.mintrnft.address).to.not.equal(ZERO_ADDRESS);
        expect(this.mintrnft.address).to.match(/^0x[0-9a-fA-F]{40}$/);
    })

    // Tests for safeMint:
    it("Mint test", async () => {
        expectEvent(
            await this.mintrnft.safeMint(tokenUri1, { from: Account1 }),
            'TransferNFT',
            { tokenId: new BN(0), from: ZERO_ADDRESS, to: Account1, price: new BN(0) }
        );
        expect(await this.mintrnft.ownerOf(0)).to.equal(Account1);
        expect(await this.mintrnft.tokenURI(0)).to.equal(tokenUri1);
    })

    // Tests for putUpFromSale:
    it("putUpForSale test unexistent NFT", async () => {
        await expectRevert(
            this.mintrnft.putUpFromSale(1, 1, { from: Account1 }),
            "MintrNFT: Selected NFT doesn't exist"
        );
    })

    it("putUpFromSale test with wrong account", async () => {
        await expectRevert(
            this.mintrnft.putUpFromSale(0, 1, { from: Account2 }),
            "MintrNFT: You are not the owner of this NFT"
        );
    })

    it("putUpFromSale test with null price", async () => {
        await expectRevert(
            this.mintrnft.putUpFromSale(0, 0, { from: Account1 }),
            "MintrNFT: Invalid price, should be greater than 0"
        );
    })

    it("putUpFromSale ok", async () => {
        expectEvent(
            await this.mintrnft.putUpFromSale(0, 1, { from: Account1 }),
            'TransferNFT',
            { tokenId: new BN(0), from: Account1, to: this.mintrnft.address, price: new BN(1) }
        );
    })

    // Tests for removeFromSale:
    it("removeFromSale test unexistent NFT", async () => {
        await expectRevert(
            this.mintrnft.removeFromSale(1, { from: Account1 }),
            "MintrNFT: Selected NFT doesn't exist"
        );
    })

    it("removeFromSale test with wrong account", async () => {
        await expectRevert(
            this.mintrnft.removeFromSale(0, { from: Account2 }),
            "MintrNFT: You are not the original owner of this NFT"
        );
    })

    it("removeFromSale ok", async () => {
        await expectEvent(
            await this.mintrnft.removeFromSale(0, { from: Account1 }),
            'TransferNFT',
            { tokenId: new BN(0), from: this.mintrnft.address, to: Account1, price: new BN(0) }
        );
    })

    // Mint second NFT:
    it("Mint test", async () => {
        let txData = await this.mintrnft.safeMint(tokenUri2, { from: Account2 });
        console.log(txData);
        expect(await this.mintrnft.ownerOf(1)).to.equal(Account2);
        expect(await this.mintrnft.tokenURI(1)).to.equal(tokenUri2);
    })

    it("putUpFromSale ok", async () => {
        expectEvent(
            await this.mintrnft.putUpFromSale(1, 1, { from: Account2 }),
            'TransferNFT',
            { tokenId: new BN(1), from: Account2, to: this.mintrnft.address, price: new BN(1) }
        );
    })

    // Tests for buyNFT:
    it("buyNFT test unexistent NFT", async () => {
        await expectRevert(
            this.mintrnft.buyNFT(2, { from: Account3, value: 1 }),
            "MintrNFT: Selected NFT doesn't exist"
        );
    })

    it("buyNFT test 'auto-buy'", async () => {
        await expectRevert(
            this.mintrnft.buyNFT(1, { from: Account2, value: 1 }),
            "MintrNFT: You can't buy your own NFT"
        );
    })

    it("buyNFT test value too low", async () => {
        await expectRevert(
            this.mintrnft.buyNFT(1, { from: Account3, value: 0 }),
            "MintrNFT: sent amount doesn't match NFT price"
        );
    })

    it("buyNFT ok", async () => {
        expectEvent(
            await this.mintrnft.buyNFT(1, { from: Account3, value: 1 }),
            'TransferNFT',
            { tokenId: new BN(1), from: this.mintrnft.address, to: Account3, price: new BN(0) }
        );
    })

    // Withdrawal tests:
    it("Withdraw test from wrong account", async () => {
        await expectRevert.unspecified(this.mintrnft.withdrawBalance({ from: Account3 }));
    })

    it("Withdraw test from owner", async () => {
        let oldContractBalance = await web3.eth.getBalance(this.mintrnft.address);
        let oldOwnerBalance = await web3.eth.getBalance(Owner);
        let txData = await this.mintrnft.withdrawBalance({ from: Owner });
        console.log(txData);
        let newContractBalance = await web3.eth.getBalance(this.mintrnft.address);
        let newOwnerBalance = await web3.eth.getBalance(Owner);
        expect(newContractBalance).to.equal("0");
        expect(newContractBalance).to.not.equal(oldContractBalance);
        expect(newOwnerBalance).to.not.equal(oldOwnerBalance);
    })

    it("Withdraw revert on contractBalance = 0", async () => {
        await expectRevert(
            this.mintrnft.withdrawBalance({ from: Owner }),
            "MintrNFT: No balance to withdraw"
        );
    })
})

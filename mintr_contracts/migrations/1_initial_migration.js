const MintrNFT = artifacts.require("MintrNFT");

module.exports = async function (deployer) {
    await deployer.deploy(MintrNFT);
    const mintrnft = await MintrNFT.deployed();
    console.log("Notarize contract deployed @:", mintrnft.address);
}

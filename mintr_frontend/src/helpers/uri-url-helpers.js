import axios from "axios";

const ipfsToHTTPS = (url) => {
    if (!url.startsWith("ipfs://")) throw new Error("Not an IPFS url");
    let matches = url.match(/^ipfs:\/\/(.*)\/(.*)$/);
    const cid = matches[1];
    const filePath = matches[2];
    return `https://${cid}.ipfs.dweb.link/${filePath}`;
};

const fetchMetadata = async (tokenUri) => {
    let redirect = ipfsToHTTPS(tokenUri);
    const metadataResponse = await fetch(redirect);
    if (metadataResponse.status != 200) return;
    const json = await metadataResponse.json();
    return {
        name: json.name,
        description: json.description,
        imageUrl: ipfsToHTTPS(json.image),
    };
};

export {
    fetchMetadata
}

import {
  MintrNFT as MintrNFTContract,
  TransferNFT as TransferNFTEvent
} from "../generated/MintrNFT/MintrNFT"
import { NFT } from "../generated/schema"

export function handleTransferNFT(event: TransferNFTEvent): void {
  let id = event.params.tokenId.toString()
  let entity = NFT.load(id)
  if (entity == null) {
    entity = new NFT(id)
  }
  entity.from = event.params.from;
  entity.to = event.params.to;
  entity.price = event.params.price;
  const contract = MintrNFTContract.bind(event.address);
  entity.tokenUri = contract.tokenURI(event.params.tokenId);
  entity.save();
}

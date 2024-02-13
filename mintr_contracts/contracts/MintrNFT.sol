// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

contract MintrNFT is ERC721, ERC721URIStorage, Ownable {
    /////////////// Attributes ///////////////

    // Contract address to avoid casting:
    address private immutable _contractAddress;

    // The next token ID to mint:
    uint256 private _nextTokenId = 0;

    // Structures for NFT sale data:
    struct SaleData {
        address seller;
        uint256 price;
    }
    mapping(uint256 => SaleData) private _onSaleList;


    /////////////// Events ///////////////

    event TransferNFT(uint256 tokenId, address from, address to, uint256 price);


    /////////////// Functions ///////////////

    // Constructor and ownership functions:
    constructor() ERC721("Mintr NFT", "MNFT") Ownable(_msgSender()) {
        _contractAddress = address(this);
    }

    function withdrawBalance() public onlyOwner {
        uint256 balance = _contractAddress.balance;
        require(balance > 0, "MintrNFT: No balance to withdraw");
        payable(owner()).transfer(balance);
    }


    // Minting:
    function safeMint(string memory uri) public {
        uint256 tokenId = _nextTokenId;
        _safeMint(_msgSender(), tokenId);
        _setTokenURI(tokenId, uri);
        _nextTokenId++;
        emit TransferNFT(tokenId, address(0), _msgSender(), 0);
    }


    // Sale:
    function _transferToContractAtSaleStart(uint256 tokenId, uint256 price) private {
        transferFrom(_msgSender(), _contractAddress, tokenId);
        _onSaleList[tokenId] = SaleData(_msgSender(), price);
        emit TransferNFT(tokenId, _msgSender(), _contractAddress, price);
    }

    function _transferToMsgSenderAtSaleEnd(uint256 tokenId) private {
        this.approve(_msgSender(), tokenId);
        transferFrom(_contractAddress, _msgSender(), tokenId);
        delete _onSaleList[tokenId];
        emit TransferNFT(tokenId, _contractAddress, _msgSender(), 0);
    }

    function putUpFromSale(uint256 tokenId, uint256 price) public {
        require(tokenId < _nextTokenId, "MintrNFT: Selected NFT doesn't exist");
        require(_ownerOf(tokenId) == _msgSender(), "MintrNFT: You are not the owner of this NFT");
        require(price > 0, "MintrNFT: Invalid price, should be greater than 0");
        _transferToContractAtSaleStart(tokenId, price);
    }

    function removeFromSale(uint256 tokenId) public {
        require(tokenId < _nextTokenId, "MintrNFT: Selected NFT doesn't exist");
        require(_onSaleList[tokenId].seller == _msgSender(), "MintrNFT: You are not the original owner of this NFT");
        _transferToMsgSenderAtSaleEnd(tokenId);
    }

    function buyNFT(uint256 tokenId) public payable {
        require(tokenId < _nextTokenId, "MintrNFT: Selected NFT doesn't exist");
        require(_msgSender() != _onSaleList[tokenId].seller, "MintrNFT: You can't buy your own NFT");
        require(msg.value >= _onSaleList[tokenId].price, "MintrNFT: sent amount doesn't match NFT price");
        payable(_onSaleList[tokenId].seller).transfer(Math.mulDiv(msg.value, 99, 100));
        _transferToMsgSenderAtSaleEnd(tokenId);
    }


    // ERC721 Required (parents overrides):
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

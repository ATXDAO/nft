// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

interface IATXDAONFT_V2 {
    function mintSpecial(
        address[] memory recipients,
        string memory tokenURI,
        bool _dynamic
    ) external;

    function transferOwnership(address newOwner) external;

    function owner() external view returns (address);
}

contract ATXDAOMinter is Ownable {
    using MerkleProof for bytes32[];

    IATXDAONFT_V2 public nft;
    bytes32 public merkleRoot;
    uint256 public price;
    bool public isMintable;
    mapping(address => bool) public hasMinted;
    address ethRecipient;

    constructor(address _nftAddress, address _ethRecipient) {
        require(_ethRecipient != address(0), "Recipient is address(0)");
        require(_nftAddress != address(0), "NFT is address(0)");
        nft = IATXDAONFT_V2(_nftAddress);
        ethRecipient = _ethRecipient;
    }

    function transferNftOwnership(address to) external onlyOwner {
        require(
            nft.owner() == address(this),
            "Minter is not owner of the NFT contract"
        );
        require(to != address(0), "Cannot transfer to zero address");
        nft.transferOwnership(to);
    }

    function startMint(bytes32 _merkleRoot, uint256 _price) external onlyOwner {
        require(_price > 0.01 ether, "Price must be greater than 0.01 ether");
        require(_merkleRoot != bytes32(0), "Invalid merkle root");

        price = _price;
        merkleRoot = _merkleRoot;
        isMintable = true;
    }

    function endMint() external onlyOwner {
        isMintable = false;
    }

    function _mint(address to, string memory tokenURI) private {
        address[] memory recipients = new address[](1);
        recipients[0] = to;
        nft.mintSpecial(recipients, tokenURI, false);
    }

    function mint(
        bytes32[] memory proof,
        string memory tokenURI
    ) external payable {
        require(isMintable, "Mint has not been started!");
        require(
            proof.verify(
                merkleRoot,
                keccak256(abi.encodePacked(msg.sender, tokenURI))
            ),
            "Not on the list or invalid token URI!"
        );
        require(!hasMinted[msg.sender], "You have already minted an NFT!");
        require(msg.value >= price, "Not enough ether sent to mint!");

        hasMinted[msg.sender] = true;
        _mint(msg.sender, tokenURI);
    }

    function canMint(
        bytes32[] memory proof,
        string memory tokenURI
    ) external view returns (bool) {
        return
            isMintable &&
            !hasMinted[msg.sender] &&
            proof.verify(
                merkleRoot,
                keccak256(abi.encodePacked(msg.sender, tokenURI))
            );
    }

    function mintSpecial(
        address to,
        string memory tokenURI
    ) external onlyOwner {
        _mint(to, tokenURI);
    }
}

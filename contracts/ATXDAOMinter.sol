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

    function isMintable() external view returns (bool);

    function endMint() external;
}

error ZeroAddress();
error NotOwner();
error InvalidPrice();
error InvalidMerkleRoot();
error InvalidEtherSent();
error InvalidMint();
error FailedTransferToVault();

contract ATXDAOMinter is Ownable {
    using MerkleProof for bytes32[];

    IATXDAONFT_V2 public nft;
    bytes32 public merkleRoot;
    uint256 public price;
    bool public isMintable;
    mapping(address => bool) public hasMinted;
    address payable bank;
    uint256 public lastRoundTokenId;

    constructor(address _nftAddress, address _bank) {
        if (_nftAddress == address(0)) revert ZeroAddress();
        _setBank(_bank);
        nft = IATXDAONFT_V2(_nftAddress);
    }

    function _setBank(address _bank) private {
        if (_bank == address(0)) revert ZeroAddress();
        bank = payable(_bank);
    }

    function setBank(address _bank) external onlyOwner {
        _setBank(_bank);
    }

    function transferNftOwnership(address to) external onlyOwner {
        //if (nft.owner() != address(this)) revert NotOwner(); //TODO: Is this safe to remove?
        if (to == address(0)) revert ZeroAddress();
        nft.transferOwnership(to);
    }

    function startMint(bytes32 _merkleRoot, uint256 _price) external onlyOwner {
        if (_price <= 0.01 ether) revert InvalidPrice();
        if (_merkleRoot == bytes32(0)) revert InvalidMerkleRoot();

        if (nft.isMintable()) {
            nft.endMint();
        }

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
        if (!isMintable) revert InvalidMint();
        if (
            !proof.verify(
                merkleRoot,
                keccak256(abi.encodePacked(msg.sender, tokenURI))
            )
        ) {
            revert InvalidMint();
        }
        if (hasMinted[msg.sender]) revert InvalidMint();

        if (msg.value < price) revert InvalidEtherSent();
        //if (!canMint(msg.sender, proof, tokenURI)) revert InvalidMint();

        (bool success, ) = bank.call{value: address(this).balance}("");
        if (!success) revert FailedTransferToVault();

        hasMinted[msg.sender] = true;
        _mint(msg.sender, tokenURI);
    }

    function canMint(
        address recipient,
        bytes32[] memory proof,
        string memory tokenURI
    ) external view returns (bool) {
        return
            isMintable &&
            !hasMinted[recipient] &&
            proof.verify(
                merkleRoot,
                keccak256(abi.encodePacked(recipient, tokenURI))
            );
    }

    function mintSpecial(
        address to,
        string memory tokenURI
    ) external onlyOwner {
        _mint(to, tokenURI);
    }
}

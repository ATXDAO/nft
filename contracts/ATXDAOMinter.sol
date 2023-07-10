// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

interface IATXDAONFT_V2 {
    function mintSpecial(address[] memory recipients, string memory tokenURI, bool _dynamic) external;

    function transferOwnership(address newOwner) external;

    function owner() external view returns (address);

    function isMintable() external view returns (bool);

    function endMint() external;

    function balanceOf(address _owner) external view returns (uint256);

    function getApproved(uint256 tokenId) external view returns (address);

    function ownerOf(uint256 tokenId) external view returns (address);

    function burn(uint256 tokenId) external;

    function safeTransferFrom(address from, address to, uint256 tokenId) external;
}

contract ATXDAOMinter is Ownable {
    using MerkleProof for bytes32[];

    bytes4 constant ERC721_RECEIVED = 0xf0b9e5ba;

    IATXDAONFT_V2 public nft;
    bytes32 public merkleRoot;
    uint256 public price;
    bool public isMintable;
    mapping(address => bool) public hasMinted;
    address payable bank;
    uint256 public lastRoundTokenId;

    event Mint(address to, string tokenURI, uint256 price);
    event TradeIn(address to, string tokenURI, uint256 oldTokenId);

    constructor(address _nftAddress, address _bank) {
        require(_nftAddress != address(0), "NFT is address(0)");
        _setBank(_bank);
        nft = IATXDAONFT_V2(_nftAddress);
    }

    function _setBank(address _bank) private {
        require(_bank != address(0), "Recipient is address(0)");
        bank = payable(_bank);
    }

    function setBank(address _bank) external onlyOwner {
        _setBank(_bank);
    }

    function transferNftOwnership(address to) external onlyOwner {
        require(nft.owner() == address(this), "Minter is not owner of the NFT contract");
        require(to != address(0), "Cannot transfer to zero address");
        nft.transferOwnership(to);
    }

    function startMint(bytes32 _merkleRoot, uint256 _price) external onlyOwner {
        require(_price > 0.01 ether, "Price must be greater than 0.01 ether");
        require(_merkleRoot != bytes32(0), "Invalid merkle root");

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

    function _mint(address to, string calldata tokenURI) private {
        address[] memory recipients = new address[](1);
        recipients[0] = to;
        nft.mintSpecial(recipients, tokenURI, false);
    }

    function canMint(address recipient, bytes32[] calldata proof, string calldata tokenURI)
        external
        view
        returns (bool)
    {
        return isMintable && !hasMinted[recipient] && nft.balanceOf(recipient) == 0
            && proof.verify(merkleRoot, keccak256(abi.encodePacked(recipient, tokenURI)));
    }

    function mintSpecial(address to, string calldata tokenURI) external onlyOwner {
        _mint(to, tokenURI);
        emit Mint(to, tokenURI, 0);
    }

    function canTradeIn(address recipient, bytes32[] calldata proof, string calldata tokenURI)
        external
        view
        returns (bool)
    {
        return isMintable && !hasMinted[recipient] && nft.balanceOf(recipient) > 0
            && proof.verify(merkleRoot, keccak256(abi.encodePacked(recipient, tokenURI)));
    }

    function _checkMint(address recipient, bytes32[] calldata proof, string calldata tokenURI) private view {
        require(isMintable, "Mint has not been started!");
        require(
            proof.verify(merkleRoot, keccak256(abi.encodePacked(recipient, tokenURI))),
            "Not on the list or invalid token URI!"
        );
        require(!hasMinted[msg.sender], "You have already minted an NFT!");
    }

    function mint(bytes32[] calldata proof, string calldata tokenURI) external payable {
        _checkMint(msg.sender, proof, tokenURI);
        require(nft.balanceOf(msg.sender) == 0, "You already own an NFT!");
        require(msg.value >= price, "Not enough ether sent to mint!");

        (bool success,) = bank.call{value: msg.value}("");
        require(success, "Transfer to vault failed.");

        hasMinted[msg.sender] = true;
        _mint(msg.sender, tokenURI);

        emit Mint(msg.sender, tokenURI, msg.value);
    }

    function tradeIn(bytes32[] calldata proof, string calldata tokenURI, uint256 tokenId) external {
        _checkMint(msg.sender, proof, tokenURI);
        require(nft.ownerOf(tokenId) == msg.sender, "You do not own this NFT!");
        require(nft.getApproved(tokenId) == address(this), "Minter does not have permission to burn this NFT!");

        nft.safeTransferFrom(msg.sender, address(this), tokenId);

        hasMinted[msg.sender] = true;
        _mint(msg.sender, tokenURI);

        emit TradeIn(msg.sender, tokenURI, tokenId);
    }

    function onERC721Received(address, address, uint256, bytes calldata) external pure returns (bytes4) {
        return this.onERC721Received.selector;
    }
}

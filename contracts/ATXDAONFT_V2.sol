/*
  /$$$$$$  /$$$$$$$$ /$$   /$$ /$$$$$$$   /$$$$$$   /$$$$$$
 /$$__  $$|__  $$__/| $$  / $$| $$__  $$ /$$__  $$ /$$__  $$
| $$  \ $$   | $$   |  $$/ $$/| $$  \ $$| $$  \ $$| $$  \ $$
| $$$$$$$$   | $$    \  $$$$/ | $$  | $$| $$$$$$$$| $$  | $$
| $$__  $$   | $$     >$$  $$ | $$  | $$| $$__  $$| $$  | $$
| $$  | $$   | $$    /$$/\  $$| $$  | $$| $$  | $$| $$  | $$
| $$  | $$   | $$   | $$  \ $$| $$$$$$$/| $$  | $$|  $$$$$$/
|__/  |__/   |__/   |__/  |__/|_______/ |__/  |__/ \______/
*/

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import {MerkleProof} from "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

contract ATXDAONFT_V2 is
    Initializable,
    ERC721Upgradeable,
    ERC721URIStorageUpgradeable,
    PausableUpgradeable,
    OwnableUpgradeable,
    ERC721BurnableUpgradeable,
    UUPSUpgradeable
{
    using CountersUpgradeable for CountersUpgradeable.Counter;
    using MerkleProof for bytes32[];

    bool public isMintable = false;
    uint256 public _mintPrice = 512000000000000000; // 0.512 ether
    uint256 public _mintQuantity = 25;

    CountersUpgradeable.Counter private _mintCount;
    CountersUpgradeable.Counter private _tokenIds;

    bytes32 merkleRoot;
    string private _tokenURI;

    function initialize(string memory _name, string memory _symbol)
        public
        initializer
    {
        __ERC721_init(_name, _symbol);
        __ERC721URIStorage_init();
        __Pausable_init();
        __Ownable_init();
        __ERC721Burnable_init();
        __UUPSUpgradeable_init();
    }

    function setMerkleRoot(bytes32 root) public onlyOwner {
        merkleRoot = root;
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }

    function mint(bytes32[] memory proof) external payable {
        require(
            proof.verify(merkleRoot, keccak256(abi.encodePacked(msg.sender))),
            "Not on the list!"
        );
        require(
            isMintable == true,
            "ATX DAO NFT is not mintable at the moment!"
        );
        require(
            balanceOf(msg.sender) == 0,
            "Minting is only available for non-holders"
        );
        require(
            _mintCount.current() < _mintQuantity,
            "No more NFTs remaining!"
        );
        require(msg.value >= _mintPrice, "Not enough ether sent to mint!");
        require(msg.sender == tx.origin, "No contracts!");

        // Mint
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        _mintCount.increment();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _authorizeUpgrade(address newImplementation)
        internal
        override
        onlyOwner
    {}

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId)
        internal
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
    {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721Upgradeable, ERC721URIStorageUpgradeable)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }
}

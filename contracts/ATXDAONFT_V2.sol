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
import {Strings} from "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

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
    using Strings for uint256;

    bool public isMintable;
    uint256 public _mintPrice; // 0.512 ether
    uint256 public _mintQuantity;

    CountersUpgradeable.Counter private _mintCount;
    CountersUpgradeable.Counter private _tokenIds;

    bytes32 merkleRoot;
    string private baseURI;
    string public baseExtension;

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

        isMintable = false;
        _mintPrice = 630000000000000000; // 0.63 ether
        _mintQuantity = 25;
        baseExtension = ".json";
    }

    function setMerkleRoot(bytes32 root) public onlyOwner {
        merkleRoot = root;
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
        _setTokenURI(
            newTokenId,
            string(
                abi.encodePacked(baseURI, newTokenId.toString(), baseExtension)
            )
        );

        _mintCount.increment();
    }

    function mintSpecial(address[] memory recipients, string memory tokenURI_)
        external
        onlyOwner
    {
        for (uint64 i = 0; i < recipients.length; i++) {
            _tokenIds.increment();
            uint256 newTokenId = _tokenIds.current();

            _safeMint(recipients[i], newTokenId);
            _setTokenURI(newTokenId, tokenURI_);
        }
    }

    function startMint(
        uint256 mintPrice,
        uint256 mintQuantity,
        string memory tokenURI_
    ) public onlyOwner {
        isMintable = true;
        _mintPrice = mintPrice;
        _mintQuantity = mintQuantity;
        baseURI = tokenURI_;
        _mintCount.reset();
    }

    function endMint() public onlyOwner {
        isMintable = false;
    }

    function sweepEth() public onlyOwner {
        uint256 _balance = address(this).balance;
        payable(owner()).transfer(_balance);
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

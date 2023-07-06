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

    constructor(address nftAddress) {
        nft = IATXDAONFT_V2(nftAddress);
    }

    function transferNft(address to) external onlyOwner {
        nft.transferOwnership(to);
    }
}

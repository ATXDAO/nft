// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "ds-test/test.sol";
import "contracts/ATXDAONFT_V2.sol";

contract ATXDAONFTV2Test is DSTest {
    ATXDAONFT_V2 nft;
    address addrA = address(0x1);
    address addrB = address(0x2);
    address addrC = address(0x3);

    function setUp() public {
        nft = new ATXDAONFT_V2();
        nft.initialize("ATX DAO", "ATX");
    }

    function testMintSpecial() public {
        // mint first 2
        string memory uri = "foo";
        address[] memory recps = new address[](2);
        recps[0] = addrA;
        recps[1] = addrB;
        nft.mintSpecial(recps, uri);
        assertEq(nft.ownerOf(1), addrA);
        assertEq(nft.ownerOf(2), addrB);
        assertEq(nft.tokenURI(1), uri);
        assertEq(nft.tokenURI(2), uri);
        // mint a 3rd
        string memory uri2 = "bar";
        address[] memory recps2 = new address[](1);
        recps2[0] = addrC;
        nft.mintSpecial(recps2, uri2);
        assertEq(nft.ownerOf(3), addrC);
        assertEq(nft.tokenURI(3), uri2);
    }

    // mintSpecial only sets
    function testFailMintSpecial() public {
        string memory uri = "baz";
        address[] memory recps = new address[](1);
        recps[0] = addrA;
        nft.mintSpecial(recps, uri);
        nft.ownerOf(2);
    }
}

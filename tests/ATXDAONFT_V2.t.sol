// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "ds-test/test.sol";
import "contracts/ATXDAONFT_V2.sol";
import "hardhat/console.sol";
import "tests/utils/vm.sol";

contract ATXDAONFTV2Test is DSTest {
    // see https://github.com/gakonst/foundry/tree/master/forge
    Vm vm = Vm(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);

    ATXDAONFT_V2 nft;
    address addrA = address(0x0000000000000000000000000000000000000001);
    address addrB = address(0x0000000000000000000000000000000000000002);
    address addrC = address(0x0000000000000000000000000000000000000003);

    bytes32[] proofA = new bytes32[](2);

    bytes32 merkeRootABC =
        0x16791c28db4bb211d8c63fead28bdf282d7b29e5424daf0add991a8ab0d68204;

    function setUp() public {
        nft = new ATXDAONFT_V2();
        nft.initialize("ATX DAO", "ATX");

        proofA[
            0
        ] = 0x43678e3b0d0c037990b99215ce550c9478e07cf540f8f843c7b1c9112979496f;
        proofA[
            1
        ] = 0xaa5e58f5c8a07d242c1d1009325e6815281d4aede763b9fb03413c5b2f402b2e;
    }

    function testMint() public {
        nft.startMint(1, "uri", merkeRootABC);
        vm.deal(addrA, 1);
        vm.prank(addrA);
        nft.mint{value: 1}(proofA);
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

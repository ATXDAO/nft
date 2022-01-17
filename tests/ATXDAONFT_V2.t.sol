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
        0x344510bd0c324c3912b13373e89df42d1b50450e9764a454b2aa6e2968a4578a;

    function setUp() public {
        nft = new ATXDAONFT_V2();
        nft.initialize("ATX DAO", "ATX");

        proofA[
            0
        ] = 0xd52688a8f926c816ca1e079067caba944f158e764817b83fc43594370ca9cf62;
        proofA[
            1
        ] = 0x5b70e80538acdabd6137353b0f9d8d149f4dba91e8be2e7946e409bfdbe685b9;
    }

    function testMint() public {
        nft.startMint(1, "uri", merkeRootABC);
        vm.deal(addrA, 1);
        vm.prank(addrA);
        emit log_bytes32((keccak256(abi.encodePacked(addrA))));
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

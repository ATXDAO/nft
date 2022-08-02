// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "ds-test/test.sol";
import "contracts/ATXDAONFT_V2.sol";
import "test/utils/vm.sol";

contract ATXDAONFTV2Test is DSTest {
    // see https://github.com/gakonst/foundry/tree/master/forge
    Vm vm = Vm(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);

    ATXDAONFT_V2 nft;

    // whitelisted addresses
    address addrA = address(0x0000000000000000000000000000000000000001);
    address addrB = address(0x0000000000000000000000000000000000000002);
    address addrC = address(0x0000000000000000000000000000000000000003);

    bytes32[] proofA = new bytes32[](2);
    bytes32[] proofB = new bytes32[](2);

    // > hh merkle-tree 0x0000000000000000000000000000000000000001 \
    //                  0x0000000000000000000000000000000000000002 \
    //                  0x0000000000000000000000000000000000000003 --all-proofs
    bytes32 merkleRootABC =
        0x344510bd0c324c3912b13373e89df42d1b50450e9764a454b2aa6e2968a4578a;

    function setUp() public {
        nft = new ATXDAONFT_V2();
        nft.setMerkleRoot(merkleRootABC);

        proofA[
            0
        ] = 0xd52688a8f926c816ca1e079067caba944f158e764817b83fc43594370ca9cf62;
        proofA[
            1
        ] = 0x5b70e80538acdabd6137353b0f9d8d149f4dba91e8be2e7946e409bfdbe685b9;
        proofB[
            0
        ] = 0x1468288056310c82aa4c01a7e12a10f8111a0560e72b700555479031b86c357d;
        proofB[
            1
        ] = 0x5b70e80538acdabd6137353b0f9d8d149f4dba91e8be2e7946e409bfdbe685b9;
    }

    function testMintBasic() public {
        nft.startMint(1, "ipfs://uri/", merkleRootABC);
        vm.deal(addrA, 1);
        vm.prank(addrA);
        nft.mint{value: 1}(proofA);
        assertEq(nft.balanceOf(addrA), 1);
        assertEq(nft.tokenURI(1), "ipfs://uri/1.json");
        vm.deal(addrB, 1);
        vm.prank(addrB);
        nft.mint{value: 1}(proofB);
        assertEq(nft.balanceOf(addrB), 1);
        assertEq(nft.tokenURI(2), "ipfs://uri/2.json");
    }

    function testMintRequireWhitelistRandom(address randomAddress) public {
        if (randomAddress == addrA) {
            return;
        }
        // random address sends proof A
        nft.startMint(1, "uri", merkleRootABC);
        vm.deal(randomAddress, 1);
        vm.expectRevert("Not on the list!");
        vm.prank(randomAddress);
        nft.mint{value: 1}(proofA);
    }

    function testMintRequireWhitelistInvalidProof() public {
        // random address sends proof A
        nft.startMint(2, "uri", merkleRootABC);
        vm.deal(addrB, 1);
        vm.expectRevert("Not on the list!");
        vm.prank(addrB);
        nft.mint{value: 1}(proofA);
    }

    function testMintRequireMintable() public {
        // before mint starts
        vm.deal(addrA, 1);
        vm.expectRevert("ATX DAO NFT is not mintable at the moment!");
        vm.prank(addrA);
        nft.mint{value: 1}(proofA);
        // after mint ends
        nft.startMint(2, "uri", merkleRootABC);
        nft.endMint();
        vm.deal(addrA, 1);
        vm.expectRevert("ATX DAO NFT is not mintable at the moment!");
        vm.prank(addrA);
        nft.mint{value: 1}(proofA);
    }

    function testMintRequireNotHolder() public {
        nft.startMint(1, "uri", merkleRootABC);
        vm.deal(addrA, 2);
        vm.startPrank(addrA);
        nft.mint{value: 1}(proofA);
        vm.expectRevert("Minting is only available for non-holders");
        nft.mint{value: 1}(proofA);
    }

    function testMintTransfers() public {
        nft.startMint(1, "ipfs://uri/", merkleRootABC);
        vm.deal(addrA, 2);
        vm.startPrank(addrA);
        nft.mint{value: 1}(proofA);
        nft.transferFrom(addrA, addrB, 1);
        vm.expectRevert("Minting is only available for non-holders");
        nft.mint{value: 1}(proofA);
    }

    function testResetHasMinted() public {
        nft.startMint(1, "ipfs://uri/", merkleRootABC);
        vm.deal(addrA, 2);
        vm.prank(addrA);
        nft.mint{value: 1}(proofA);
        vm.prank(addrA);
        nft.transferFrom(addrA, addrB, 1);
        address[] memory resetList = new address[](1);
        resetList[0] = addrA;
        nft.resetHasMinted(resetList);
        vm.prank(addrA);
        nft.mint{value: 1}(proofA);
        assertEq(nft.balanceOf(addrA), 1);
        assertEq(nft.balanceOf(addrB), 1);
    }

    function testMintRequireEth() public {
        nft.startMint(2, "uri", merkleRootABC);
        vm.deal(addrA, 1);
        vm.expectRevert("Not enough ether sent to mint!");
        vm.prank(addrA);
        nft.mint{value: 1}(proofA);
    }

    function testMintSpecialStatic() public {
        // mint first 2
        string memory uri = "foo";
        address[] memory recps = new address[](2);
        recps[0] = addrA;
        recps[1] = addrB;
        nft.mintSpecial(recps, uri, false);
        assertEq(nft.ownerOf(1), addrA);
        assertEq(nft.ownerOf(2), addrB);
        assertEq(nft.tokenURI(1), uri);
        assertEq(nft.tokenURI(2), uri);
        // mint a 3rd
        string memory uri2 = "bar";
        address[] memory recps2 = new address[](1);
        recps2[0] = addrC;
        nft.mintSpecial(recps2, uri2, false);
        assertEq(nft.ownerOf(3), addrC);
        assertEq(nft.tokenURI(3), uri2);
    }

    function testMintSpecialDynamic() public {
        // mint first 2
        address[] memory recps = new address[](2);
        recps[0] = addrA;
        recps[1] = addrB;
        nft.mintSpecial(recps, "foo/", true);
        assertEq(nft.ownerOf(1), addrA);
        assertEq(nft.ownerOf(2), addrB);
        assertEq(nft.tokenURI(1), "foo/1.json");
        assertEq(nft.tokenURI(2), "foo/2.json");
        // mint a 3rd
        address[] memory recps2 = new address[](1);
        recps2[0] = addrC;
        nft.mintSpecial(recps2, "bar/", true);
        assertEq(nft.ownerOf(3), addrC);
        assertEq(nft.tokenURI(3), "bar/3.json");
    }

    // mintSpecial only sets
    function testFailMintSpecial() public {
        string memory uri = "baz";
        address[] memory recps = new address[](1);
        recps[0] = addrA;
        nft.mintSpecial(recps, uri, false);
        nft.ownerOf(2);
    }

    function testSweepEth() public {
        nft.startMint(1, "ipfs://uri/", merkleRootABC);
        vm.deal(addrA, 1);
        vm.prank(addrA);
        nft.mint{value: 1}(proofA);
        vm.deal(addrB, 10);
        vm.prank(addrB);
        nft.mint{value: 10}(proofB);

        assertEq(0, addrC.balance);
        nft.transferOwnership(addrC);
        vm.prank(addrC);
        nft.sweepEth();
        assertEq(11, addrC.balance);
    }

    function testOnlyOwner() public {
        vm.expectRevert("Ownable: caller is not the owner");
        vm.prank(addrA);
        nft.startMint(1, "foo", merkleRootABC);

        vm.expectRevert("Ownable: caller is not the owner");
        vm.prank(addrA);
        nft.sweepEth();

        vm.expectRevert("Ownable: caller is not the owner");
        vm.prank(addrA);
        nft.mintSpecial(new address[](0), "foo", false);

        vm.expectRevert("Ownable: caller is not the owner");
        vm.prank(addrA);
        nft.setMerkleRoot(merkleRootABC);
    }
}

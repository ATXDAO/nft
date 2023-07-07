// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "ds-test/test.sol";
import "forge-std/console2.sol";
import "forge-std/Vm.sol";
import "contracts/ATXDAONFT_V2.sol";
import "contracts/ATXDAOMinter.sol";

contract ATXDAOMinterTest is DSTest {
    // see https://github.com/gakonst/foundry/tree/master/forge
    Vm vm = Vm(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);

    address public constant daoVault = address(0x80);

    bytes32 public constant MERKLE_ROOT =
        0x9decc5afe188d8a4ca9aad9fcc0d5c4ba29ed2473f5c0728c00775b2bb54df47;

    address public constant ADDRESS_A =
        0xabC1000000000000000000000000000000000000;
    string public constant TOKEN_URI_A = "ipfs://born/in-the-usa.json";

    address public constant ADDRESS_B =
        0xAbc2000000000000000000000000000000000000;
    string public constant TOKEN_URI_B = "ipfs://not-born/in-the-usa.json";

    ATXDAONFT_V2 nft;
    ATXDAOMinter minter;

    function setUp() public {
        nft = new ATXDAONFT_V2();
        minter = new ATXDAOMinter(address(nft), daoVault);
        nft.transferOwnership(address(minter));
    }

    // test transfering ownership of underlying NFT contract
    function testTransferOwner() public {
        address nftDeployer = address(0x90);
        address minterDeployer = address(0x91);
        vm.prank(nftDeployer);
        nft = new ATXDAONFT_V2();
        vm.prank(minterDeployer);
        minter = new ATXDAOMinter(address(nft), daoVault);

        assertEq(nft.owner(), nftDeployer);
        assertEq(minter.owner(), minterDeployer);

        // fails because minter is not owner of NFT contract
        vm.expectRevert("Ownable: caller is not the owner");
        minter.transferNftOwnership(address(this));

        vm.prank(nftDeployer);
        nft.transferOwnership(address(minter));
        assertEq(nft.owner(), address(minter));

        // fails because address(this) is not owner of minter contract
        vm.expectRevert("Ownable: caller is not the owner");
        minter.transferNftOwnership(address(this));

        vm.prank(minterDeployer);
        minter.transferNftOwnership(address(this));
        assertEq(nft.owner(), address(this));
    }

    function testStartMintAuth() public {
        nft = new ATXDAONFT_V2();
        minter = new ATXDAOMinter(address(nft), daoVault);

        nft.startMint(1 wei, "foo", bytes32(0x0));
        assert(nft.isMintable());

        // if random address is not the owner of the minter contract
        vm.prank(address(0x1));
        vm.expectRevert("Ownable: caller is not the owner");
        minter.startMint(MERKLE_ROOT, 0.01 ether);

        vm.expectRevert("Price must be greater than 0.01 ether");
        minter.startMint(MERKLE_ROOT, 0.001 ether);

        vm.expectRevert("Invalid merkle root");
        minter.startMint(0x0, 0.02 ether);

        // if minter is not the owner of the nft contract
        vm.expectRevert("Ownable: caller is not the owner");
        minter.startMint(MERKLE_ROOT, 0.02 ether);

        nft.transferOwnership(address(minter));

        assert(!minter.isMintable());
        minter.startMint(MERKLE_ROOT, 0.02 ether);
        assert(minter.isMintable());
        assert(!nft.isMintable());
    }

    function testMint() public {
        assert(!minter.isMintable());
        minter.startMint(MERKLE_ROOT, 0.02 ether);
        assert(minter.isMintable());

        bytes32[] memory proof_a = new bytes32[](1);
        proof_a[
            0
        ] = 0xd505d9d405a036d7cdcb4e90bf4cf6ab97aa16f026089cbd1ec02da2a4915e7f;
        // debug merkle proof construction
        // console2.logBytes32(
        //     keccak256(abi.encodePacked(ADDRESS_A, TOKEN_URI_A))
        // );
        vm.deal(ADDRESS_A, 0.04 ether);
        vm.prank(ADDRESS_A);
        minter.mint{value: 0.02 ether}(proof_a, TOKEN_URI_A);
        assertEq(nft.tokenURI(1), "ipfs://born/in-the-usa.json");

        bytes32[] memory proof_b = new bytes32[](1);
        proof_b[
            0
        ] = 0xdd0183c844aefebba5b4b87b9a7c53e9b1dbeaf2d298164799ff55f32ff8d4eb;
        vm.deal(ADDRESS_B, 0.04 ether);
        vm.prank(ADDRESS_B);

        // fails with the wrong token uri
        vm.expectRevert("Not on the list or invalid token URI!");
        minter.mint{value: 0.02 ether}(proof_b, "im cheating");

        // user should be able to mint
        assert(minter.canMint(ADDRESS_B, proof_b, TOKEN_URI_B));
        vm.prank(ADDRESS_B);
        minter.mint{value: 0.02 ether}(proof_b, TOKEN_URI_B);
        assertEq(nft.tokenURI(1), "ipfs://born/in-the-usa.json");

        // fails if user unauthorized
        address unauthorized = address(0x13);
        vm.prank(unauthorized);
        vm.deal(unauthorized, 0.04 ether);
        vm.expectRevert("Not on the list or invalid token URI!");
        minter.mint{value: 0.02 ether}(proof_b, TOKEN_URI_B);

        // test already minted
        assert(!minter.canMint(ADDRESS_B, proof_b, TOKEN_URI_B));
        vm.prank(ADDRESS_B);
        vm.expectRevert("You have already minted an NFT!");
        minter.mint{value: 0.02 ether}(proof_b, TOKEN_URI_B);
    }
}

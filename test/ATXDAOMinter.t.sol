// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "ds-test/test.sol";
import "contracts/ATXDAONFT_V2.sol";
import "contracts/ATXDAOMinter.sol";
import "test/utils/vm.sol";

contract ATXDAOMinterTest is DSTest {
    // see https://github.com/gakonst/foundry/tree/master/forge
    Vm vm = Vm(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);

    address public constant daoVault = address(0x80);

    bytes32 public constant MERKLE_ROOT =
        0x015f54e898f173304a7c3c7f7c512bf094b48dc992c221e9395e816c4499eb6a;

    address public constant ADDRESS_A =
        0x7109709ECfa91a80626fF3989D68f67F5b1DD12D;
    string public constant TOKEN_URI_A = "ipfs://born/in-the-usa.json";

    address public constant ADDRESS_B =
        0x51040CE6FC9b9C5Da69B044109f637dc997e92DE;
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
        minter.transferNft(address(this));

        vm.prank(nftDeployer);
        nft.transferOwnership(address(minter));
        assertEq(nft.owner(), address(minter));

        // fails because address(this) is not owner of minter contract
        vm.expectRevert("Ownable: caller is not the owner");
        minter.transferNft(address(this));

        vm.prank(minterDeployer);
        minter.transferNft(address(this));
        assertEq(nft.owner(), address(this));
    }

    function testMint() public {
        vm.prank(address(0x1));
        vm.expectRevert("Ownable: caller is not the owner");
        minter.startMint(0x0, 0.01 ether);

        vm.expectRevert("Price must be greater than 0.01 ether");
        minter.startMint(0x0, 0.001 ether);

        vm.expectRevert("Invalid merkle root");
        minter.startMint(0x0, 0.02 ether);

        assert(!minter.isMintable());
        minter.startMint(MERKLE_ROOT, 0.02 ether);
        assert(minter.isMintable());

        vm.deal(ADDRESS_A, 0.04 ether);
        vm.prank(ADDRESS_A);

        bytes32[] memory proof_a = new bytes32[](1);
        proof_a[
            0
        ] = 0xd7caa2ed9297f3c40c06b812fbe902426ec552798ace7049dc4f6a9c0e999bda;
        bytes32[] memory proof_b = new bytes32[](1);
        proof_b[
            0
        ] = 0x97d7b29317dc59e5db1d80b1b4154126870c34edd86c916a6f4857c958c830f5;
        minter.mint{value: 0.02 ether}(proof_a, TOKEN_URI_A);
    }
}

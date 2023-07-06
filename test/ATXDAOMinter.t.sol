// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "ds-test/test.sol";
import "contracts/ATXDAONFT_V2.sol";
import "contracts/ATXDAOMinter.sol";
import "test/utils/vm.sol";

contract ATXDAOMinterTest is DSTest {
    // see https://github.com/gakonst/foundry/tree/master/forge
    Vm vm = Vm(0x7109709ECfa91a80626fF3989D68f67F5b1DD12D);

    ATXDAONFT_V2 nft;
    ATXDAOMinter minter;

    function setUp() public {
        nft = new ATXDAONFT_V2();
        minter = new ATXDAOMinter(address(nft));
        nft.transferOwnership(address(minter));
    }

    // test transfering ownership of underlying NFT contract
    function testTransferOwner() public {
        address nftDeployer = address(0x90);
        address minterDeployer = address(0x91);
        vm.prank(nftDeployer);
        nft = new ATXDAONFT_V2();
        vm.prank(minterDeployer);
        minter = new ATXDAOMinter(address(nft));

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
}

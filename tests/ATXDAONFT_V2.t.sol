// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "ds-test/test.sol";
import "contracts/ATXDAONFT_V2.sol";

contract ATXDAONFTV2Test is DSTest {
    ATXDAONFT_V2 nft;
    address v0person1 = address(0x1);
    address v0person2 = address(0x2);

    function setUp() public {
        nft = new ATXDAONFT_V2();
        nft.initialize("ATX DAO", "ATX");
    }

    function testExample() public {
        address[] memory recps = new address[](2);
        recps[0] = v0person1;
        recps[1] = v0person2;
        nft.mintSpecial(recps, "foo bar");
        assertEq(nft.ownerOf(1), v0person1);
        assertEq(nft.ownerOf(2), v0person2);
    }
}

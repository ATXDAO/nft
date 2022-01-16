// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "ds-test/test.sol";
import "contracts/ATXDAONFT_V2.sol";

contract ATXDAONFTV2Test is DSTest {
    ATXDAONFT_V2 nft;

    function setUp() public {
        nft = new ATXDAONFT_V2();
        nft.initialize("ATX DAO", "ATX");
    }

    function testExample() public pure {
        assert(true);
    }
}

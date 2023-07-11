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

    address public constant bank1 = address(0x80);
    address public constant bank2 = address(0x81);

    bytes32 public constant MERKLE_ROOT = 0x7ee2dcd2a719699cc78051649539508af2ed128303181fa0751dc62919baaed0;

    address public constant NEW_MEMBER_A = 0xabC1000000000000000000000000000000000000;
    string public constant TOKEN_URI_A = "ipfs://QmYVgQoE74xp5TigTe1EC9vDQw7tx39t3U9ySTaNHa7CdV/26.json";

    address public constant NEW_MEMBER_B = 0xAbc2000000000000000000000000000000000000;
    string public constant TOKEN_URI_B = "ipfs://QmYVgQoE74xp5TigTe1EC9vDQw7tx39t3U9ySTaNHa7CdV/27.json";

    address public constant OLD_MEMBER_C = 0xaBc3000000000000000000000000000000000000;
    string public constant TOKEN_URI_C = "ipfs://QmYVgQoE74xp5TigTe1EC9vDQw7tx39t3U9ySTaNHa7CdV/28.json";

    ATXDAONFT_V2 nft;
    ATXDAOMinter minter;

    function setUp() public {
        nft = new ATXDAONFT_V2();
        minter = new ATXDAOMinter(address(nft), bank1);
        nft.transferOwnership(address(minter));
    }

    function _getProofA() private pure returns (bytes32[] memory) {
        bytes32[] memory proof = new bytes32[](3);
        proof[0] = 0x25dffc87238c566203023ffd7d26a3833fa08ab1a98d8bcef029bca26b1d2dc9;
        proof[1] = 0xfbf4ceb2f1443e5e03dc05000b9e1fcbc597fd489f0caa8c80802afaac41e808;
        proof[2] = 0xea8ad6ad448b67b5846b8ff7d25198f19577af4819932e98d7e6a5f9446998fb;
        return proof;
    }

    function _getProofB() private pure returns (bytes32[] memory) {
        bytes32[] memory proof = new bytes32[](3);
        proof[0] = 0xa5d2a00dc1d4eeb07ec917686e56fe00c240c6f85ff79abfc6bd03704755c01a;
        proof[1] = 0xfbf4ceb2f1443e5e03dc05000b9e1fcbc597fd489f0caa8c80802afaac41e808;
        proof[2] = 0xea8ad6ad448b67b5846b8ff7d25198f19577af4819932e98d7e6a5f9446998fb;
        return proof;
    }

    function _getProofC() private pure returns (bytes32[] memory) {
        bytes32[] memory proof = new bytes32[](3);
        proof[0] = 0x62bb8c08e43e16e4b5fdbea7bb1225253e2415e73ac9cb49e49d0cfabd286c97;
        proof[1] = 0xf281f139d4a1621bf1b7dda51af7021da60d554583b18cf8ab6f6e53fbcb8103;
        proof[2] = 0xea8ad6ad448b67b5846b8ff7d25198f19577af4819932e98d7e6a5f9446998fb;
        return proof;
    }

    // test transfering ownership of underlying NFT contract
    function testTransferOwner() public {
        address nftDeployer = address(0x90);
        address minterDeployer = address(0x91);
        vm.prank(nftDeployer);
        nft = new ATXDAONFT_V2();
        vm.prank(minterDeployer);
        minter = new ATXDAOMinter(address(nft), bank1);

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
        minter = new ATXDAOMinter(address(nft), bank1);

        nft.startMint(1 wei, "foo", bytes32(0x0));
        assert(nft.isMintable());

        // if random address is not the owner of the minter contract
        vm.prank(address(0x1));
        vm.expectRevert("Ownable: caller is not the owner");
        minter.startMint(MERKLE_ROOT, 0.01 ether, false);

        vm.expectRevert(InvalidPrice.selector);
        minter.startMint(MERKLE_ROOT, 0.001 ether, false);

        vm.expectRevert(InvalidMerkleRoot.selector);
        minter.startMint(0x0, 0.02 ether, false);

        // if minter is not the owner of the nft contract
        vm.expectRevert("Ownable: caller is not the owner");
        minter.startMint(MERKLE_ROOT, 0.02 ether, false);

        nft.transferOwnership(address(minter));

        assert(!minter.isMintable());
        minter.startMint(MERKLE_ROOT, 0.02 ether, false);
        assert(minter.isMintable());
        assert(!nft.isMintable());
    }

    function testMint() public {
        bytes32[] memory proof_a = _getProofA();
        bytes32[] memory proof_b = _getProofB();
        bytes32[] memory proof_c = _getProofC();

        vm.deal(NEW_MEMBER_A, 0.04 ether);
        vm.deal(NEW_MEMBER_B, 0.04 ether);
        assertEq(bank1.balance, 0);

        assert(!minter.isMintable());
        vm.expectRevert(MintNotStarted.selector);
        minter.mint{value: 0.02 ether}(proof_a, TOKEN_URI_A);

        minter.startMint(MERKLE_ROOT, 0.02 ether, false);
        assert(minter.isMintable());

        assert(minter.canMint(NEW_MEMBER_A, proof_a, TOKEN_URI_A));
        assert(minter.canMint(NEW_MEMBER_B, proof_b, TOKEN_URI_B));
        assert(!minter.canMint(OLD_MEMBER_C, proof_c, TOKEN_URI_C));

        // debug merkle proof construction
        // console2.logBytes32(
        //     keccak256(abi.encodePacked(NEW_MEMBER_A, TOKEN_URI_A))
        // );

        // user a should be able to mint
        assertEq(nft.balanceOf(NEW_MEMBER_A), 0);

        vm.prank(NEW_MEMBER_A);
        vm.expectRevert(InvalidEtherSent.selector);
        minter.mint{value: 0.01 ether}(proof_a, TOKEN_URI_A);

        vm.prank(NEW_MEMBER_A);
        minter.mint{value: 0.02 ether}(proof_a, TOKEN_URI_A);
        assertEq(nft.tokenURI(1), TOKEN_URI_A);
        assertEq(nft.ownerOf(1), NEW_MEMBER_A);

        assertEq(bank1.balance, 0.02 ether);
        vm.prank(address(0x2));
        vm.expectRevert("Ownable: caller is not the owner");
        minter.setBank(bank2);
        minter.setBank(bank2);

        // fails with the wrong token uri
        //vm.expectRevert("Not on the list or invalid token URI!");
        vm.expectRevert(InvalidProof.selector);
        minter.mint{value: 0.02 ether}(proof_b, "im cheating");

        // user b should be able to trade-in, but not mint
        assert(minter.canMint(NEW_MEMBER_B, proof_b, TOKEN_URI_B));
        assertEq(nft.balanceOf(NEW_MEMBER_B), 0);
        vm.prank(NEW_MEMBER_B);
        minter.mint{value: 0.02 ether}(proof_b, TOKEN_URI_B);
        assertEq(nft.tokenURI(2), TOKEN_URI_B);
        assertEq(nft.ownerOf(2), NEW_MEMBER_B);

        // fails if user unauthorized
        address unauthorized = address(0x13);
        vm.prank(unauthorized);
        vm.deal(unauthorized, 0.04 ether);
        vm.expectRevert(InvalidProof.selector);
        minter.mint{value: 0.02 ether}(proof_b, TOKEN_URI_B);

        // test already minted
        assert(!minter.canMint(NEW_MEMBER_B, proof_b, TOKEN_URI_B));
        vm.prank(NEW_MEMBER_B);
        vm.expectRevert(DoubleMint.selector);
        minter.mint{value: 0.02 ether}(proof_b, TOKEN_URI_B);

        // contract should send all eth received directly to the dao vault
        assertEq(bank1.balance, 0.02 ether);
        assertEq(bank2.balance, 0.02 ether);
    }

    function testMintSpecial() public {
        assertEq(nft.balanceOf(NEW_MEMBER_A), 0);
        minter.mintSpecial(NEW_MEMBER_A, "ipfs://special/mint.json");
        assertEq(nft.balanceOf(NEW_MEMBER_A), 1);
    }

    // test address B can perform a trade-in, address A cannot
    function testTradeIn() public {
        bytes32[] memory proof_a = _getProofA();
        bytes32[] memory proof_b = _getProofB();
        bytes32[] memory proof_c = _getProofC();

        vm.deal(NEW_MEMBER_A, 0.05 ether);
        vm.deal(OLD_MEMBER_C, 0.01 ether);

        minter.startMint(MERKLE_ROOT, 0.02 ether, false);
        assert(minter.isMintable());

        minter.mintSpecial(address(0x1), "ipfs://orphan/meta.json");
        minter.mintSpecial(OLD_MEMBER_C, "ipfs://old-nft/meta.json");

        assert(!minter.canTradeIn(NEW_MEMBER_A, proof_a, TOKEN_URI_A));
        assert(!minter.canTradeIn(NEW_MEMBER_B, proof_b, TOKEN_URI_B));
        assert(minter.canTradeIn(OLD_MEMBER_C, proof_c, TOKEN_URI_C));

        vm.prank(NEW_MEMBER_A);
        minter.mint{value: 0.02 ether}(proof_a, TOKEN_URI_A);

        assertEq(nft.ownerOf(1), address(0x1));
        assertEq(nft.ownerOf(2), OLD_MEMBER_C);
        assertEq(nft.ownerOf(3), NEW_MEMBER_A);

        vm.prank(OLD_MEMBER_C);
        vm.expectRevert("ERC721: caller is not token owner or approved");
        minter.tradeIn(proof_c, TOKEN_URI_C, 1);

        vm.prank(OLD_MEMBER_C);
        vm.expectRevert("ERC721: caller is not token owner or approved");
        minter.tradeIn(proof_c, TOKEN_URI_C, 2);

        assertEq(nft.balanceOf(address(minter)), 0);

        vm.prank(OLD_MEMBER_C);
        nft.approve(address(minter), 2);

        vm.prank(OLD_MEMBER_C);
        minter.tradeIn(proof_c, TOKEN_URI_C, 2);

        // test cant trade in twice
        vm.prank(OLD_MEMBER_C);
        vm.expectRevert(DoubleMint.selector);
        minter.tradeIn(proof_c, TOKEN_URI_C, 4);

        // verify owners
        assertEq(nft.ownerOf(1), address(0x1));
        assertEq(nft.ownerOf(2), address(minter));
        assertEq(nft.ownerOf(3), NEW_MEMBER_A);
        assertEq(nft.ownerOf(4), OLD_MEMBER_C);

        // resetHasMinted is only effective for trade-ins, not mints
        address[] memory recipients = new address[](2);
        recipients[0] = NEW_MEMBER_A;
        recipients[1] = OLD_MEMBER_C;
        assert(!minter.canMint(NEW_MEMBER_A, proof_a, TOKEN_URI_A));
        assert(!minter.canTradeIn(NEW_MEMBER_A, proof_a, TOKEN_URI_A));
        assert(!minter.canMint(OLD_MEMBER_C, proof_c, TOKEN_URI_C));
        assert(!minter.canTradeIn(OLD_MEMBER_C, proof_c, TOKEN_URI_C));
        vm.prank(NEW_MEMBER_A);
        vm.expectRevert("Ownable: caller is not the owner");
        minter.resetHasMinted(recipients);

        minter.resetHasMinted(recipients);
        assert(!minter.canMint(NEW_MEMBER_A, proof_a, TOKEN_URI_A));
        assert(!minter.canTradeIn(NEW_MEMBER_A, proof_a, TOKEN_URI_A));
        assert(!minter.canMint(OLD_MEMBER_C, proof_c, TOKEN_URI_C));
        assert(minter.canTradeIn(OLD_MEMBER_C, proof_c, TOKEN_URI_C));
        vm.expectRevert(DoubleMint.selector);
        vm.prank(NEW_MEMBER_A);
        minter.mint{value: 0.02 ether}(proof_a, TOKEN_URI_A);

        vm.prank(OLD_MEMBER_C);
        nft.approve(address(minter), 4);
        vm.prank(OLD_MEMBER_C);
        minter.tradeIn(proof_c, TOKEN_URI_C, 4);

        assertEq(nft.balanceOf(NEW_MEMBER_A), 1);
        assertEq(nft.balanceOf(OLD_MEMBER_C), 1);
        assertEq(nft.ownerOf(4), address(minter));
        assertEq(nft.ownerOf(5), OLD_MEMBER_C);

        // test resetAllHasMinted
        assert(!minter.canTradeIn(OLD_MEMBER_C, proof_c, TOKEN_URI_C));
        minter.startMint(MERKLE_ROOT, 0.02 ether, true);
        assert(minter.canTradeIn(OLD_MEMBER_C, proof_c, TOKEN_URI_C));
    }
}

async function deploy() {
  const MyNFT = await ethers.getContractFactory("ATXDAONFT");

  // Start deployment, returning a promise that resolves to a contract object
  const myNFT = await MyNFT.deploy();
  console.log("ATX DAO Contract deployed to address:", myNFT.address);
}

deploy()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

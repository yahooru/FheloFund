import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // Manager defaults to deployer; can be changed later via setManager
  const manager = process.env.FUND_MANAGER_ADDRESS || deployer.address;

  const FheloFund = await ethers.getContractFactory("FheloFund");
  const fund = await FheloFund.deploy(deployer.address, manager);
  await fund.waitForDeployment();
  const address = await fund.getAddress();
  console.log("FheloFund deployed to:", address);
  console.log("Owner:", deployer.address);
  console.log("Manager:", manager);
  console.log("\nSet in web/.env.local:");
  console.log(`NEXT_PUBLIC_FUND_ADDRESS=${address}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

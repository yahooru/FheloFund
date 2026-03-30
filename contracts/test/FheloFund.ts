import { expect } from "chai";
import { ethers } from "hardhat";

describe("FheloFund", function () {
  async function deployFixture() {
    const [owner, manager, alice, bob] = await ethers.getSigners();
    const FheloFund = await ethers.getContractFactory("FheloFund");
    const fund = await FheloFund.deploy(owner.address, manager.address);
    await fund.waitForDeployment();
    return { fund, owner, manager, alice, bob };
  }

  it("mints 1:1 shares on first deposit", async function () {
    const { fund, alice } = await deployFixture();
    await fund.connect(alice).deposit({ value: ethers.parseEther("1") });
    expect(await fund.sharesOf(alice.address)).to.equal(ethers.parseEther("1"));
    expect(await fund.totalShares()).to.equal(ethers.parseEther("1"));
  });

  it("mints pro-rata on second deposit", async function () {
    const { fund, alice, bob } = await deployFixture();
    await fund.connect(alice).deposit({ value: ethers.parseEther("1") });
    await fund.connect(bob).deposit({ value: ethers.parseEther("1") });
    const aliceShares = await fund.sharesOf(alice.address);
    const bobShares = await fund.sharesOf(bob.address);
    expect(aliceShares).to.equal(bobShares);
  });

  it("withdraws pro-rata ETH", async function () {
    const { fund, alice } = await deployFixture();
    await fund.connect(alice).deposit({ value: ethers.parseEther("2") });
    const before = await ethers.provider.getBalance(alice.address);
    const tx = await fund.connect(alice).withdraw(await fund.sharesOf(alice.address));
    const receipt = await tx.wait();
    const gas = receipt!.gasUsed * receipt!.gasPrice;
    const after = await ethers.provider.getBalance(alice.address);
    expect(after + gas).to.be.closeTo(before + ethers.parseEther("2"), ethers.parseEther("0.01"));
  });

  it("manager can execute trade (PnL)", async function () {
    const { fund, alice, manager } = await deployFixture();
    await fund.connect(alice).deposit({ value: ethers.parseEther("1") });
    await fund.connect(manager).executeTrade(ethers.parseEther("0.1"));
    expect(await fund.totalAssetsTracked()).to.equal(ethers.parseEther("1.1"));
  });
});

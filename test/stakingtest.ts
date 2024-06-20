import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect } from "chai";
import hre from "hardhat";

describe("staketoken ICO", function () {

  async function deployStakeTokenFixture() {
    // Contracts are deployed using the first signer/account by default
    const [owner, bob, jack, alice] = await hre.ethers.getSigners();

    const Token = await hre.ethers.getContractFactory("Staketoken");
    const token = await Token.deploy();

    const StaketokenICO = await hre.ethers.getContractFactory("Staking");
    const staketokenIco = await StaketokenICO.deploy(token.getAddress());

    return { staketokenIco, token, owner, bob, alice, jack };
  }
  it("Should mint token", async function () {
    const { token, owner } = await loadFixture(deployStakeTokenFixture);
    const ownerBalance = await token.balanceOf(owner.getAddress());
    const totalSupply = await token.totalSupply();
    expect(ownerBalance).to.equal(totalSupply);
  });
  it("Should approve token", async function () {
    const { token, owner, staketokenIco } = await loadFixture(deployStakeTokenFixture);
    const ownerBalance = await token.balanceOf(owner.getAddress());
    const totalSupply = await token.totalSupply();
    expect(ownerBalance).to.equal(totalSupply);
  });
  it("should allowance", async function () {
    const { token, staketokenIco, bob, owner } = await loadFixture(deployStakeTokenFixture);
    const allowance = await token.allowance(
      owner.getAddress(),
      staketokenIco.getAddress()
    );
  })
  it("should stake", async function () {
    const { token, staketokenIco, bob, owner } = await loadFixture(deployStakeTokenFixture);
    const initialBalance = hre.ethers.parseEther("10");
    await staketokenIco.connect(bob).stake({ value: initialBalance });
    const stakingMoney = await staketokenIco.stake();
    expect(await staketokenIco.stakedAmount(bob.address)).to.equal(initialBalance);
  })
  it("should unstake", async function () {
    const { token, staketokenIco, bob, owner } = await loadFixture(deployStakeTokenFixture);
    const initialBalance = hre.ethers.parseEther("3");
    const unstakeAmount = hre.ethers.parseEther("0.5");
    await staketokenIco.connect(bob).stake({ value: initialBalance });
    await staketokenIco.connect(bob).unstake(unstakeAmount);
  })
  it("should getreward", async function () {
    const { token, staketokenIco, bob, owner } = await loadFixture(deployStakeTokenFixture);
    const initialBalance = hre.ethers.parseEther("3");
    await token.mint();
    await staketokenIco.connect(bob).stake({ value: initialBalance });
    await staketokenIco.stake();
    const StakingMoney = 3 * 10 ** 18;
    const stakedTimeSeconds = 1;
    const rewardRatePerDays = (5 * 1e18) / 10;
    const reward = ((StakingMoney * rewardRatePerDays) / 1e18) * (stakedTimeSeconds / 10);
    const totalReward = (reward * 2) / 100;
    const rewardAmount = await staketokenIco.connect(bob).getReward();
    const totalreward = await staketokenIco.REWARD_INTERVAL();
  })
});

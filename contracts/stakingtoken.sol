// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "./token.sol";

contract Staking {
    address payable owner;
    uint256 public constant REWARD_INTERVAL = 1 seconds;
    uint256 public constant INITIAL_REWARD_PERCENTAGE = 5;
    uint256 public constant REWARD_PERCENTAGE_INCREMENT =2; 
    Staketoken public token;
    mapping(address => uint256) public stakedAmount;
    mapping(address => uint256) public lastStakeTime;

    constructor(address _tokenAddress) {
        owner = payable(msg.sender);
        token = Staketoken(_tokenAddress);
    }

    function stake() external payable {
        stakedAmount[msg.sender] += msg.value;
        lastStakeTime[msg.sender] = block.timestamp;
    }

    function unstake(uint256 unstakeAmount) external {
        require(stakedAmount[msg.sender] > 0);
         (bool callsuccess,) = payable(msg.sender).call{value:unstakeAmount}("");
         require(callsuccess,"call is failed");
    }

    function getReward() external view returns (uint256) {
        require(stakedAmount[msg.sender] > 0, "no staked amount..");
        uint256 stakedTime = block.timestamp - lastStakeTime[msg.sender];
        require(stakedTime >= REWARD_INTERVAL, "Staking period not reached");
        uint256 rewardRatePerdays = (INITIAL_REWARD_PERCENTAGE * 1e18) /
            REWARD_INTERVAL;
        uint256 reward = ((stakedAmount[msg.sender] * rewardRatePerdays) /
            1e18) * (stakedTime / REWARD_INTERVAL);
        uint256 totalReward = (reward * REWARD_PERCENTAGE_INCREMENT) / 100;
        return totalReward;
    }
}
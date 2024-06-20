// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Staketoken is ERC20 {
    address public owner;

     constructor() ERC20("staketoken", "HNM") {
        owner = msg.sender;
    }
    function mint() external onlyOwner {
        _mint(msg.sender, 1000000000000000000*(10**18));
    }
    modifier onlyOwner (){ 
        require (msg.sender == owner,"only owner can call this function");_;
    }
}
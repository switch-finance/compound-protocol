// SPDX-License-Identifier: MIT
pragma solidity >=0.6.12;

interface ICompoundCToken {
    function underlying() external view returns (address);
    function mint() external payable;
    function mint(uint mintAmount) external returns (uint);
    function redeem(uint redeemTokens) external returns (uint);
    function redeemUnderlying(uint redeemAmount) external returns (uint);
    function exchangeRateStored() external view returns (uint);
}

contract EscrowCompound {
    function fromUnderlying(address _token) public payable {
        ICompoundCToken(_token).mint{value: msg.value}();
    }
}



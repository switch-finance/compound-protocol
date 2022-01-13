pragma solidity ^0.5.16;

import "../../contracts/Comptroller.sol";

contract ComptrollerTest is Comptroller {
    address public compAddress;

    constructor() Comptroller() public {}

    function setCompAddress(address compAddress_) public {
        compAddress = compAddress_;
    }

    function getCompAddress() public view returns (address) {
        return compAddress;
    }
}

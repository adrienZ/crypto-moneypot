// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract SimpleStorage {
    uint256 private value;

    function set(uint256 _value) external {
        value = _value;
    }

    function get() external view returns (uint256) {
        return value;
    }
}

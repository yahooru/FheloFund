// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title FheloFund — Sepolia demo fund (transparent accounting; not FHE)
/// @notice Share-based ETH vault with a manager who can simulate PnL via `executeTrade`.
contract FheloFund is Ownable, ReentrancyGuard {
    address public manager;

    uint256 public totalShares;
    uint256 public totalAssetsTracked;

    mapping(address => uint256) public sharesOf;

    event Deposit(address indexed user, uint256 ethIn, uint256 sharesMinted);
    event Withdraw(address indexed user, uint256 sharesBurned, uint256 ethOut);
    event Trade(address indexed manager, int256 pnlDelta, uint256 newTotalAssets);
    event ManagerUpdated(address indexed oldManager, address indexed newManager);

    constructor(address initialOwner, address _manager) Ownable(initialOwner) {
        require(_manager != address(0), "manager zero");
        manager = _manager;
    }

    modifier onlyManager() {
        require(msg.sender == manager, "FheloFund: not manager");
        _;
    }

    function setManager(address newManager) external onlyOwner {
        require(newManager != address(0), "manager zero");
        emit ManagerUpdated(manager, newManager);
        manager = newManager;
    }

    /// @notice Deposit ETH and receive fund shares (pro-rata after first deposit).
    function deposit() external payable nonReentrant {
        require(msg.value > 0, "FheloFund: zero deposit");
        uint256 minted;
        if (totalShares == 0) {
            minted = msg.value;
            totalShares = minted;
            totalAssetsTracked = msg.value;
        } else {
            minted = (msg.value * totalShares) / totalAssetsTracked;
            totalShares += minted;
            totalAssetsTracked += msg.value;
        }
        sharesOf[msg.sender] += minted;
        emit Deposit(msg.sender, msg.value, minted);
    }

    /// @notice Burn shares and receive ETH (pro-rata of tracked assets).
    function withdraw(uint256 shareAmount) external nonReentrant {
        require(shareAmount > 0, "FheloFund: zero shares");
        require(shareAmount <= sharesOf[msg.sender], "FheloFund: exceeds balance");
        uint256 ethOut = (shareAmount * totalAssetsTracked) / totalShares;
        sharesOf[msg.sender] -= shareAmount;
        totalShares -= shareAmount;
        totalAssetsTracked -= ethOut;
        (bool ok, ) = payable(msg.sender).call{value: ethOut}("");
        require(ok, "FheloFund: ETH transfer failed");
        emit Withdraw(msg.sender, shareAmount, ethOut);
    }

    /// @notice Manager adjusts tracked NAV (simulate profit/loss without moving ETH).
    function executeTrade(int256 pnlDelta) external onlyManager {
        if (pnlDelta >= 0) {
            totalAssetsTracked += uint256(pnlDelta);
        } else {
            uint256 loss = uint256(-pnlDelta);
            require(totalAssetsTracked >= loss, "FheloFund: loss too large");
            totalAssetsTracked -= loss;
        }
        emit Trade(msg.sender, pnlDelta, totalAssetsTracked);
    }

    /// @notice Direct ETH increases pool for all shareholders (no new shares).
    receive() external payable {
        totalAssetsTracked += msg.value;
    }

    function ethShareValue(uint256 shareAmount) external view returns (uint256) {
        if (totalShares == 0 || shareAmount == 0) return 0;
        return (shareAmount * totalAssetsTracked) / totalShares;
    }
}

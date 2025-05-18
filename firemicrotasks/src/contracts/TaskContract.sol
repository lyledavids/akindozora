// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract MicrotaskPlatform {
    IERC20 public fireToken;
    
    struct Task {
        string title;
        string description;
        uint256 reward;
        address client;
        address worker;
        bool completed;
        bool approved;
    }
    
    // Task ID => Task
    mapping(uint256 => Task) public tasks;
    uint256 public taskCount;
    
    // Public array to store all task IDs for easy retrieval
    uint256[] public allTaskIds;
    
    event TaskCreated(uint256 indexed taskId, string title, uint256 reward, address indexed client);
    event TaskAccepted(uint256 indexed taskId, address indexed worker);
    event TaskCompleted(uint256 indexed taskId);
    event TaskApproved(uint256 indexed taskId, uint256 reward);
    
    constructor(address _fireTokenAddress) {
        fireToken = IERC20(_fireTokenAddress);
        taskCount = 0;
    }
    
    function createTask(string memory _title, string memory _description, uint256 _reward) external {
        require(_reward > 0, "Reward must be greater than 0");
        
        // Transfer tokens from client to contract
        require(fireToken.transferFrom(msg.sender, address(this), _reward), "Token transfer failed");
        
        taskCount++;
        tasks[taskCount] = Task({
            title: _title,
            description: _description,
            reward: _reward,
            client: msg.sender,
            worker: address(0),
            completed: false,
            approved: false
        });
        
        // Add task ID to the array
        allTaskIds.push(taskCount);
        
        emit TaskCreated(taskCount, _title, _reward, msg.sender);
    }
    
    function acceptTask(uint256 _taskId) external {
        Task storage task = tasks[_taskId];
        
        require(_taskId > 0 && _taskId <= taskCount, "Invalid task ID");
        require(task.worker == address(0), "Task already accepted");
        require(task.client != msg.sender, "Client cannot accept their own task");
        
        task.worker = msg.sender;
        
        emit TaskAccepted(_taskId, msg.sender);
    }
    
    function completeTask(uint256 _taskId) external {
        Task storage task = tasks[_taskId];
        
        require(_taskId > 0 && _taskId <= taskCount, "Invalid task ID");
        require(task.worker == msg.sender, "Only worker can complete task");
        require(!task.completed, "Task already completed");
        
        task.completed = true;
        
        emit TaskCompleted(_taskId);
    }
    
    function approveTask(uint256 _taskId) external {
        Task storage task = tasks[_taskId];
        
        require(_taskId > 0 && _taskId <= taskCount, "Invalid task ID");
        require(task.client == msg.sender, "Only client can approve task");
        require(task.completed, "Task not completed yet");
        require(!task.approved, "Task already approved");
        
        task.approved = true;
        
        // Transfer reward to worker
        require(fireToken.transfer(task.worker, task.reward), "Token transfer failed");
        
        emit TaskApproved(_taskId, task.reward);
    }
    
    function getTaskCount() external view returns (uint256) {
        return taskCount;
    }
    
    function getAllTaskIds() external view returns (uint256[] memory) {
        return allTaskIds;
    }
}

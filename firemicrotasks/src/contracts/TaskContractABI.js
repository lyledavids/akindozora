export const TaskContractABI = [
  // Task struct is returned by tasks mapping
  "function tasks(uint256 taskId) view returns (string title, string description, uint256 reward, address client, address worker, bool completed, bool approved)",

  // Task management functions
  "function createTask(string memory title, string memory description, uint256 reward) external",
  "function acceptTask(uint256 taskId) external",
  "function completeTask(uint256 taskId) external",
  "function approveTask(uint256 taskId) external",
  "function getTaskCount() view returns (uint256)",
  "function getAllTaskIds() view returns (uint256[])",

  // Public array to store all task IDs
  "function allTaskIds(uint256) view returns (uint256)",

  // Events
  "event TaskCreated(uint256 indexed taskId, string title, uint256 reward, address indexed client)",
  "event TaskAccepted(uint256 indexed taskId, address indexed worker)",
  "event TaskCompleted(uint256 indexed taskId)",
  "event TaskApproved(uint256 indexed taskId, uint256 reward)",
]

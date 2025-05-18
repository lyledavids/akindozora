// Simple utility functions for work submissions
import submissionsData from "./submissions.json"

// In-memory cache of the submissions
let submissionsCache = { ...submissionsData.submissions }

// Get all work submissions
export const getWorkSubmissions = () => {
  return submissionsCache
}

// Get work submission for a specific task
export const getWorkSubmission = (taskId) => {
  return submissionsCache[taskId] || null
}

// Add a new work submission
export const addWorkSubmission = (taskId, data) => {
  // Create the new submission
  const newSubmission = {
    ...data,
    timestamp: new Date().toISOString(),
  }

  // Update the in-memory cache
  submissionsCache = {
    ...submissionsCache,
    [taskId]: newSubmission,
  }

  console.log("Work submission added for task", taskId, ":", newSubmission)
  console.log("All submissions:", submissionsCache)

  return newSubmission
}

// Check if a submission exists for a task
export const hasSubmission = (taskId) => {
  return !!submissionsCache[taskId]
}

// Clear all submissions (for testing)
export const clearSubmissions = () => {
  submissionsCache = {}
  return submissionsCache
}

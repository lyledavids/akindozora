"use client"

import { useEffect, useState } from "react"
import TaskItem from "./TaskItem"
import { ethers } from "ethers"
import { getWorkSubmission } from "../data/workSubmissions"

function TaskList({ tasks, account, acceptTask, completeTask, approveTask, filter, workSubmissions }) {
  // Make sure we handle potential undefined addresses correctly
  const isZeroAddress = (address) => {
    return !address || address === ethers.ZeroAddress
  }

  // Filter tasks based on their status
  const availableTasks = tasks.filter((task) => !task.completed && isZeroAddress(task.worker))
  const inProgressTasks = tasks.filter((task) => !task.completed && !isZeroAddress(task.worker))
  const completedTasks = tasks.filter((task) => task.completed)

  // State to store task submissions
  const [taskSubmissions, setTaskSubmissions] = useState({})

  // Load submissions for all tasks
  useEffect(() => {
    // First, use the submissions passed from props
    if (workSubmissions) {
      setTaskSubmissions(workSubmissions)
    }

    // Then try to load any missing submissions
    const loadMissingSubmissions = async () => {
      const newSubmissions = { ...taskSubmissions }
      let hasChanges = false

      for (const task of tasks) {
        if (!newSubmissions[task.id]) {
          try {
            const submission = await getWorkSubmission(task.id)
            if (submission) {
              newSubmissions[task.id] = submission
              hasChanges = true
            }
          } catch (error) {
            console.error(`Error loading submission for task ${task.id}:`, error)
          }
        }
      }

      if (hasChanges) {
        setTaskSubmissions(newSubmissions)
      }
    }

    loadMissingSubmissions()
  }, [tasks, workSubmissions])

  // Helper function to get submission for a task
  const getSubmissionForTask = (taskId) => {
    // First try from local state
    if (taskSubmissions && taskSubmissions[taskId]) {
      return taskSubmissions[taskId]
    }
    // Then try from props
    if (workSubmissions && workSubmissions[taskId]) {
      return workSubmissions[taskId]
    }
    // Return null if not found
    return null
  }

  return (
    <div className="task-list">
      {filter === "all" && (
        <>
          <h2>Available Tasks ({availableTasks.length})</h2>
          {availableTasks.length > 0 ? (
            <div className="tasks">
              {availableTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  account={account}
                  acceptTask={acceptTask}
                  completeTask={completeTask}
                  approveTask={approveTask}
                  submission={getSubmissionForTask(task.id)}
                />
              ))}
            </div>
          ) : (
            <p className="no-tasks">No available tasks</p>
          )}

          <h2>In Progress Tasks ({inProgressTasks.length})</h2>
          {inProgressTasks.length > 0 ? (
            <div className="tasks">
              {inProgressTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  account={account}
                  acceptTask={acceptTask}
                  completeTask={completeTask}
                  approveTask={approveTask}
                  submission={getSubmissionForTask(task.id)}
                />
              ))}
            </div>
          ) : (
            <p className="no-tasks">No tasks in progress</p>
          )}

          <h2>Completed Tasks ({completedTasks.length})</h2>
          {completedTasks.length > 0 ? (
            <div className="tasks">
              {completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  account={account}
                  acceptTask={acceptTask}
                  completeTask={completeTask}
                  approveTask={approveTask}
                  submission={getSubmissionForTask(task.id)}
                />
              ))}
            </div>
          ) : (
            <p className="no-tasks">No completed tasks</p>
          )}
        </>
      )}

      {filter === "my" && (
        <>
          <h2>My Posted Tasks</h2>
          {tasks.filter((task) => task.client.toLowerCase() === account.toLowerCase()).length > 0 ? (
            <div className="tasks">
              {tasks
                .filter((task) => task.client.toLowerCase() === account.toLowerCase())
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    account={account}
                    acceptTask={acceptTask}
                    completeTask={completeTask}
                    approveTask={approveTask}
                    submission={getSubmissionForTask(task.id)}
                  />
                ))}
            </div>
          ) : (
            <p className="no-tasks">You haven't posted any tasks</p>
          )}

          <h2>My Accepted Tasks</h2>
          {tasks.filter((task) => task.worker.toLowerCase() === account.toLowerCase()).length > 0 ? (
            <div className="tasks">
              {tasks
                .filter((task) => task.worker.toLowerCase() === account.toLowerCase())
                .map((task) => (
                  <TaskItem
                    key={task.id}
                    task={task}
                    account={account}
                    acceptTask={acceptTask}
                    completeTask={completeTask}
                    approveTask={approveTask}
                    submission={getSubmissionForTask(task.id)}
                  />
                ))}
            </div>
          ) : (
            <p className="no-tasks">You haven't accepted any tasks</p>
          )}
        </>
      )}
    </div>
  )
}

export default TaskList

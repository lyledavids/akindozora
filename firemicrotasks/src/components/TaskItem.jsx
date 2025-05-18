"use client"

import { useState } from "react"
import { ethers } from "ethers"

function TaskItem({ task, account, acceptTask, completeTask, approveTask, submission }) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showWorkForm, setShowWorkForm] = useState(false)
  const [workLink, setWorkLink] = useState("")
  const [description, setDescription] = useState("")
  const [showSubmissionDetails, setShowSubmissionDetails] = useState(false)

  const isClient = task.client.toLowerCase() === account.toLowerCase()
  const isWorker = task.worker.toLowerCase() === account.toLowerCase()
  const isAvailable = !task.worker || task.worker === ethers.ZeroAddress

  // Check if work has been submitted for this task
  const hasSubmission = !!submission && Object.keys(submission).length > 0

  const handleSubmitWork = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      // Submit the work with the link and description
      await completeTask(task.id, {
        workLink,
        description,
      })

      // Hide the form
      setShowWorkForm(false)
      // Reset form fields
      setWorkLink("")
      setDescription("")
    } catch (error) {
      console.error("Error submitting work:", error)
      alert("Error submitting work. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={`task-item ${task.completed ? "completed" : ""}`}>
      <div className="task-header">
        <h3>{task.title}</h3>
        <div className="task-reward">{task.reward} FIRE</div>
      </div>

      <p className="task-description">{task.description}</p>

      <div className="task-meta">
        <div className="task-client">
          <span>Posted by:</span>
          {isClient ? "You" : `${task.client.substring(0, 6)}...${task.client.substring(task.client.length - 4)}`}
        </div>

        {!isAvailable && (
          <div className="task-worker">
            <span>Worker:</span>
            {isWorker ? "You" : `${task.worker.substring(0, 6)}...${task.worker.substring(task.worker.length - 4)}`}
          </div>
        )}
      </div>

      <div className="task-status">
        {task.completed ? (
          task.approved ? (
            <span className="status approved">Completed & Paid</span>
          ) : (
            <span className="status pending">Completed, Awaiting Approval</span>
          )
        ) : isAvailable ? (
          <span className="status available">Available</span>
        ) : (
          <span className="status in-progress">In Progress</span>
        )}

        {/* Show submission badge ONLY if work has been submitted AND task is not available */}
        {hasSubmission && !isAvailable && <span className="submission-badge">Work Submitted</span>}
      </div>

      {/* Inline work submission form */}
      {showWorkForm && (
        <div className="work-submission-form">
          <h4>Submit Your Work</h4>
          <form onSubmit={handleSubmitWork}>
            <div className="form-group">
              <label>Work Link</label>
              <input
                type="url"
                value={workLink}
                onChange={(e) => setWorkLink(e.target.value)}
                placeholder="https://example.com/my-work"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what you did..."
                rows={3}
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={() => setShowWorkForm(false)}>
                Cancel
              </button>
              <button type="submit" className="submit-button" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Work"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Work submission details - ONLY show if there's actually a submission */}
      {hasSubmission && showSubmissionDetails && (
        <div className="submission-details">
          <h4>Work Submission</h4>
          <div className="submission-content">
            <div className="submission-field">
              <strong>Submitted By:</strong>
              <span>
                {submission.worker.substring(0, 6)}...{submission.worker.substring(submission.worker.length - 4)}
              </span>
            </div>

            <div className="submission-field">
              <strong>Work Link:</strong>
              <a href={submission.workLink} target="_blank" rel="noopener noreferrer">
                {submission.workLink}
              </a>
            </div>

            <div className="submission-field">
              <strong>Description:</strong>
              <p>{submission.description}</p>
            </div>

            <div className="submission-field">
              <strong>Submitted:</strong>
              <span>{new Date(submission.timestamp).toLocaleString()}</span>
            </div>
          </div>
          <button className="close-button" onClick={() => setShowSubmissionDetails(false)}>
            Close Details
          </button>
        </div>
      )}

      <div className="task-actions">
        {/* Available task - can be accepted by anyone except the client */}
        {isAvailable && !isClient && (
          <button className="accept-button" onClick={() => acceptTask(task.id)}>
            Accept Task
          </button>
        )}

        {/* In progress task - can be marked as completed by the worker */}
        {!isAvailable && !task.completed && isWorker && (
          <button className="submit-work-button" onClick={() => setShowWorkForm(!showWorkForm)}>
            {showWorkForm ? "Cancel Submission" : "Submit Work"}
          </button>
        )}

        {/* Completed task - client can view work and approve */}
        {task.completed && !task.approved && isClient && (
          <>
            {/* Only show View Work button if there's actually a submission */}
            {hasSubmission && (
              <button className="view-work-button" onClick={() => setShowSubmissionDetails(!showSubmissionDetails)}>
                {showSubmissionDetails ? "Hide Work Details" : "View Work"}
              </button>
            )}
            <button className="approve-button" onClick={() => approveTask(task.id)}>
              Approve & Pay
            </button>
          </>
        )}

        {/* Anyone can view completed work - ONLY if there's a submission */}
        {task.completed && task.approved && hasSubmission && (
          <button className="view-work-button" onClick={() => setShowSubmissionDetails(!showSubmissionDetails)}>
            {showSubmissionDetails ? "Hide Work Details" : "View Work"}
          </button>
        )}

        {/* Non-client can view work details for in-progress tasks - ONLY if there's a submission */}
        {!task.completed && !isAvailable && hasSubmission && !isWorker && (
          <button className="view-work-button" onClick={() => setShowSubmissionDetails(!showSubmissionDetails)}>
            {showSubmissionDetails ? "Hide Work Details" : "View Work"}
          </button>
        )}
      </div>
    </div>
  )
}

export default TaskItem

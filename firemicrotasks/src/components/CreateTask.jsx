"use client"

import { useState } from "react"

function CreateTask({ createTask }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [reward, setReward] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title || !description || !reward) {
      alert("Please fill in all fields")
      return
    }

    try {
      setIsSubmitting(true)
      await createTask(title, description, reward)

      // Reset form
      setTitle("")
      setDescription("")
      setReward("")
    } catch (error) {
      console.error("Error in form submission:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="create-task">
      <h2>Create a New Task</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Task Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter a clear title for your task"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description">Task Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what needs to be done in detail"
            rows={5}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="reward">Reward (FIRE tokens)</label>
          <input
            type="number"
            id="reward"
            value={reward}
            onChange={(e) => setReward(e.target.value)}
            placeholder="Enter amount of FIRE tokens"
            min="0.01"
            step="0.01"
            required
          />
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Task"}
        </button>
      </form>
    </div>
  )
}

export default CreateTask

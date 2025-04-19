import axios from "axios";

export async function generateImage(prompt) {
  try {
    const response = await axios.post("https://api.craiyon.com/v1/generate", {
      prompt,
    });
    const images = response.data.images; // Array of image URLs
    return images[0]; // Return first image
  } catch (error) {
    console.error("Craiyon API failed:", error);
    throw new Error("Failed to generate image. Try again or upload manually.");
  }
}
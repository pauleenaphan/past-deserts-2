// Cloudinary configuration
const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'pastdeserts'
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'dessert_uploads'

export interface CloudinaryResponse {
  secure_url: string
  public_id: string
  width: number
  height: number
}

/**
 * Upload an image file to Cloudinary
 * Returns the secure URL of the uploaded image
 */
export const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', 'desserts') // Organize images in a folder

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to upload image')
    }

    const data: CloudinaryResponse = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

/**
 * Upload a base64 image to Cloudinary (for migration)
 * Returns the secure URL of the uploaded image
 */
export const uploadBase64ToCloudinary = async (base64String: string): Promise<string> => {
  const formData = new FormData()
  formData.append('file', base64String)
  formData.append('upload_preset', UPLOAD_PRESET)
  formData.append('folder', 'desserts')

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to upload image')
    }

    const data: CloudinaryResponse = await response.json()
    return data.secure_url
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}


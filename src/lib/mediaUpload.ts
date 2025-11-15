
// Media Upload Utility for Smart Fundi Messaging
// Handles file validation, compression, and simulated upload to Cloud Storage

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const SUPPORTED_IMAGE_FORMATS = ["image/jpeg", "image/jpg", "image/png"];
const SUPPORTED_VIDEO_FORMATS = ["video/mp4", "video/quicktime", "video/mov"];
const IMAGE_MAX_WIDTH = 1920;
const IMAGE_MAX_HEIGHT = 1080;
const THUMBNAIL_SIZE = 200;

export interface MediaUploadResult {
  success: boolean;
  mediaUrl?: string;
  thumbnailUrl?: string;
  mediaType?: "image" | "video";
  fileSize?: number;
  error?: string;
}

export interface UploadProgressCallback {
  (progress: number): void;
}

/**
 * Validates if the file meets size and format requirements
 */
export function validateMediaFile(file: File): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: "File size exceeds 10 MB limit. Please choose a smaller file.",
    };
  }

  // Check file format
  const isImage = SUPPORTED_IMAGE_FORMATS.includes(file.type);
  const isVideo = SUPPORTED_VIDEO_FORMATS.includes(file.type);

  if (!isImage && !isVideo) {
    return {
      valid: false,
      error: "Unsupported file format. Please use JPG, PNG, MP4, or MOV.",
    };
  }

  return { valid: true };
}

/**
 * Compresses an image file for optimized loading
 */
async function compressImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    img.onload = () => {
      let { width, height } = img;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height);
        width = width * ratio;
        height = height * ratio;
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to compress image"));
          }
        },
        "image/jpeg",
        0.85
      );
    };

    img.onerror = () => reject(new Error("Failed to load image"));

    img.src = URL.createObjectURL(file);
  });
}

/**
 * Generates a thumbnail for the media file
 */
async function generateThumbnail(file: File, mediaType: "image" | "video"): Promise<string> {
  if (mediaType === "image") {
    const compressed = await compressImage(file, THUMBNAIL_SIZE, THUMBNAIL_SIZE);
    return URL.createObjectURL(compressed);
  } else {
    // For videos, create a canvas thumbnail from the first frame
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      video.onloadedmetadata = () => {
        canvas.width = THUMBNAIL_SIZE;
        canvas.height = THUMBNAIL_SIZE;
        video.currentTime = 0;
      };

      video.onseeked = () => {
        ctx?.drawImage(video, 0, 0, THUMBNAIL_SIZE, THUMBNAIL_SIZE);
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob));
          } else {
            reject(new Error("Failed to generate video thumbnail"));
          }
        }, "image/jpeg");
      };

      video.onerror = () => reject(new Error("Failed to load video"));

      video.src = URL.createObjectURL(file);
      video.load();
    });
  }
}

/**
 * Simulates uploading a file to Cloud Storage with progress tracking
 * In production, this would use Firebase Storage or Supabase Storage
 */
async function simulateUpload(
  file: File,
  onProgress: UploadProgressCallback
): Promise<string> {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        // Simulate a private, time-limited Cloud Storage URL
        const timestamp = Date.now();
        const fakeUrl = `/storage/private/${timestamp}_${file.name}?token=${Math.random().toString(36).substr(2, 9)}&expires=${timestamp + 3600000}`;
        resolve(fakeUrl);
      }
      onProgress(Math.min(progress, 100));
    }, 200);
  });
}

/**
 * Main upload function that handles the complete media upload workflow
 */
export async function uploadMedia(
  file: File,
  onProgress: UploadProgressCallback
): Promise<MediaUploadResult> {
  try {
    // Step 1: Validate file
    const validation = validateMediaFile(file);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error,
      };
    }

    // Step 2: Determine media type
    const isImage = SUPPORTED_IMAGE_FORMATS.includes(file.type);
    const mediaType: "image" | "video" = isImage ? "image" : "video";

    // Step 3: Compress image if needed
    let uploadFile: File | Blob = file;
    if (mediaType === "image") {
      onProgress(10);
      uploadFile = await compressImage(file, IMAGE_MAX_WIDTH, IMAGE_MAX_HEIGHT);
      onProgress(20);
    }

    // Step 4: Generate thumbnail
    const thumbnailUrl = await generateThumbnail(file, mediaType);
    onProgress(30);

    // Step 5: Upload to Cloud Storage (simulated)
    const mediaUrl = await simulateUpload(
      uploadFile instanceof Blob ? new File([uploadFile], file.name) : uploadFile,
      (uploadProgress) => {
        // Map upload progress to 30-100% range
        onProgress(30 + uploadProgress * 0.7);
      }
    );

    return {
      success: true,
      mediaUrl,
      thumbnailUrl,
      mediaType,
      fileSize: uploadFile.size,
    };
  } catch (error) {
    console.error("Media upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Upload failed. Please try again.",
    };
  }
}

/**
 * Validates user access to media (simulated - in production would check Realtime Database)
 */
export function validateMediaAccess(
  messageId: string,
  conversationId: string,
  currentUserId: string
): boolean {
  // In production, this would:
  // 1. Check if currentUserId is a participant in conversationId
  // 2. Verify the message belongs to that conversation
  // 3. Return true only if user has access
  
  // For now, simulate access validation
  const conversations = localStorage.getItem(`user_${currentUserId}_conversations`);
  if (!conversations) return false;
  
  const userConversations = JSON.parse(conversations);
  return userConversations.includes(conversationId);
}

/**
 * Checks if a URL is expired (for time-limited Cloud Storage URLs)
 */
export function isUrlExpired(url: string): boolean {
  try {
    const urlObj = new URL(url, window.location.origin);
    const expires = urlObj.searchParams.get("expires");
    if (!expires) return false;
    
    return Date.now() > parseInt(expires);
  } catch {
    return false;
  }
}

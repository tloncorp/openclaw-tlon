/**
 * Upload an image from a URL to Tlon storage.
 */

/**
 * Fetch an image from a URL and upload it to Tlon storage.
 * Returns the uploaded URL, or falls back to the original URL on error.
 */
export async function uploadImageFromUrl(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.warn(`[tlon-upload] Failed to fetch image: ${response.status}, using original URL`);
      return imageUrl;
    }

    const blob = await response.blob();
    // Dynamic import to work around type resolution issues
    const { uploadFile } = (await import("@tloncorp/api")) as any;
    const result = await uploadFile({
      blob,
      contentType: blob.type || "application/octet-stream",
    });

    return result.url;
  } catch (error: any) {
    console.warn(`[tlon-upload] Upload failed: ${error?.message ?? error}, using original URL`);
    return imageUrl;
  }
}

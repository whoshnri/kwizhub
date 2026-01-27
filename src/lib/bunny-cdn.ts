/**
 * Bunny CDN Storage API Integration
 * Handles file uploads to Bunny CDN storage
 */

const logBunny = (operation: string, message: string, info: Record<string, unknown> = {}) => {
    console.info(`[bunny-cdn ${operation}] ${message}`, info);
};

interface BunnyUploadResponse {
  HttpCode: number;
  Message: string;
  Success: boolean;
}

interface BunnyFileInfo {
  Guid: string;
  StorageZoneName: string;
  Path: string;
  ObjectName: string;
  Length: number;
  LastChanged: string;
  ServerId: number;
  ArrayNumber: number;
  IsDirectory: boolean;
  UserId: string;
  ContentType: string;
  DateCreated: string;
  StorageZoneId: number;
  Checksum: string;
  ReplicatedZones: string;
}

export class BunnyCDNError extends Error {
  constructor(message: string, public statusCode?: number) {
    super(message);
    this.name = "BunnyCDNError";
  }
}

/**
 * Upload a file to Bunny CDN Storage
 * @param file - File buffer or Blob
 * @param filename - Desired filename in storage
 * @param path - Optional path within storage zone (e.g., "materials/")
 * @returns The CDN URL of the uploaded file
 */
export async function uploadToBunnyCDN(
  file: Buffer | Blob,
  filename: string,
  path: string = "materials/"
): Promise<string> {
  const operationId = Date.now() + Math.random().toString(36).slice(2);
  logBunny(operationId, "🚀 Upload initiated", { filename, path });

  const storageZoneName = process.env.BUNNY_STORAGE_ZONE;
  const storageApiKey = process.env.BUNNY_STORAGE_ACCESS_KEY;
  const pullZoneUrl = process.env.BUNNY_PULL_ZONE_URL;

  if (!storageZoneName || !storageApiKey || !pullZoneUrl) {
    logBunny(operationId, "🔒 Missing credentials");
    throw new BunnyCDNError(
      "Unable to access storage. Please contact support if this persists."
    );
  }

  // Ensure path ends with /
  const normalizedPath = path.endsWith("/") ? path : `${path}/`;
  const fullPath = `${normalizedPath}${filename}`;
  logBunny(operationId, "📝 Path normalized", { fullPath });

  // Convert to ArrayBuffer for fetch
  let body: ArrayBuffer;
  try {
    if (file instanceof Blob) {
      body = await file.arrayBuffer();
    } else {
      // Convert Buffer to ArrayBuffer by copying
      const uint8Array = new Uint8Array(file);
      body = uint8Array.buffer.slice(uint8Array.byteOffset, uint8Array.byteOffset + uint8Array.byteLength);
    }
    logBunny(operationId, "✅ File buffer prepared", { size: body.byteLength });
  } catch (err) {
    logBunny(operationId, "🛑 Failed to prepare buffer", { error: err instanceof Error ? err.message : String(err) });
    throw new BunnyCDNError("Unable to prepare file for upload. Please try again.");
  }

  const uploadUrl = `https://storage.bunnycdn.com/${storageZoneName}/${fullPath}`;
  logBunny(operationId, "🌐 Upload URL ready", { url: uploadUrl });

  try {
    logBunny(operationId, "📤 Sending to storage...");
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        AccessKey: storageApiKey,
        "Content-Type": "application/pdf",
      },
      body: body,
    });

    logBunny(operationId, "📨 Response received", { status: response.status });

    if (!response.ok) {
      const errorText = await response.text();
      logBunny(operationId, "❌ Upload rejected", { status: response.status, message: errorText });
      
      let friendlyMessage = "Upload failed.";
      if (response.status === 401) friendlyMessage = "Storage authentication failed. Please contact support.";
      else if (response.status === 403) friendlyMessage = "Access denied to storage. Please contact support.";
      else if (response.status === 413) friendlyMessage = "File too large for storage.";
      else if (response.status >= 500) friendlyMessage = "Storage service temporarily unavailable. Please retry.";
      
      throw new BunnyCDNError(friendlyMessage, response.status);
    }

    // Construct CDN URL
    // Format: https://chorus.b-cdn.net/{path}
    const cdnUrl = `${pullZoneUrl}/${fullPath}`;
    logBunny(operationId, "✨ Upload complete", { cdnUrl });

    return cdnUrl;
  } catch (error) {
    if (error instanceof BunnyCDNError) {
      logBunny(operationId, "🔥 Upload error", { message: error.message, status: error.statusCode });
      throw error;
    }
    const errMsg = error instanceof Error ? error.message : "Unknown error";
    logBunny(operationId, "🔥 Unexpected error", { message: errMsg });
    throw new BunnyCDNError(
      "Upload service encountered an issue. Please retry."
    );
  }
}

/**
 * Delete a file from Bunny CDN Storage
 * @param filePath - Full path to the file in storage (e.g., "materials/file.pdf")
 */
export async function deleteFromBunnyCDN(filePath: string): Promise<void> {
  const storageZoneName = process.env.BUNNY_STORAGE_ZONE;
  const storageApiKey = process.env.BUNNY_STORAGE_ACCESS_KEY;

  if (!storageZoneName || !storageApiKey) {
    throw new BunnyCDNError(
      "Unable to access storage. Please contact support if this persists."
    );
  }

  // Remove leading / if present
  const normalizedPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;

  const deleteUrl = `https://storage.bunnycdn.com/${storageZoneName}/${normalizedPath}`;

  try {
    const response = await fetch(deleteUrl, {
      method: "DELETE",
      headers: {
        AccessKey: storageApiKey,
      },
    });

    if (!response.ok && response.status !== 404) {
      const errorText = await response.text();
      throw new BunnyCDNError(
        `Bunny CDN delete failed: ${errorText}`,
        response.status
      );
    }
  } catch (error) {
    if (error instanceof BunnyCDNError) {
      throw error;
    }
    throw new BunnyCDNError(
      `Failed to delete from Bunny CDN: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

/**
 * Get file information from Bunny CDN
 * @param filePath - Full path to the file in storage
 */
export async function getBunnyFileInfo(filePath: string): Promise<BunnyFileInfo | null> {
  const storageZoneName = process.env.BUNNY_STORAGE_ZONE;
  const storageApiKey = process.env.BUNNY_STORAGE_ACCESS_KEY;

  if (!storageZoneName || !storageApiKey) {
    throw new BunnyCDNError(
      "Unable to access storage. Please contact support if this persists."
    );
  }

  const normalizedPath = filePath.startsWith("/") ? filePath.slice(1) : filePath;
  const infoUrl = `https://storage.bunnycdn.com/${storageZoneName}/${normalizedPath}`;

  try {
    const response = await fetch(infoUrl, {
      method: "GET",
      headers: {
        AccessKey: storageApiKey,
      },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new BunnyCDNError(
        `Bunny CDN get info failed: ${errorText}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof BunnyCDNError) {
      throw error;
    }
    throw new BunnyCDNError(
      `Failed to get file info from Bunny CDN: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}


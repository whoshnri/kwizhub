/**
 * Utility functions for material file handling
 */

/**
 * Get the best available URL for a material PDF
 * Prefers Bunny CDN URL if available, falls back to local path
 */
export function getMaterialPdfUrl(material: {
    bunnyCdnUrl?: string | null;
    pdfPath: string;
}): string {
    // Prefer Bunny CDN URL if available
    if (material.bunnyCdnUrl) {
        return material.bunnyCdnUrl;
    }

    // Fallback to local path
    // If it's already a full URL, return as is
    if (material.pdfPath.startsWith("http://") || material.pdfPath.startsWith("https://")) {
        return material.pdfPath;
    }

    // Otherwise, construct local URL
    return material.pdfPath;
}


/**
 * Normalizes image URLs to ensure compatibility with backend resource mapping.
 * Replaces '/uploads/' or '/uploads/properties/' with '/images/' to match WebMvcConfig.
 * Handles external URLs by returning them unchanged, with extension correction if needed.
 * @param {string} url - The original image URL.
 * @returns {string|null} The normalized URL, or null if invalid.
 */
const normalizeImageUrl = (url) => {
  // Validate URL input
  if (!url || typeof url !== "string") {
    console.warn("[imageUtils] Invalid image URL provided:", url);
    return null;
  }

  // Handle external URLs
  if (url.startsWith("http://") || url.startsWith("https://")) {
    console.log("[imageUtils] External URL detected:", url);
    // Correct invalid image extensions (e.g., .js to .jpg)
    if (url.endsWith(".js")) {
      const correctedUrl = url.replace(/\.js$/, ".jpg");
      console.warn(
        "[imageUtils] Corrected invalid extension from .js to .jpg:",
        url,
        "->",
        correctedUrl
      );
      return correctedUrl;
    }
    return url;
  }

  // Normalize internal URLs
  let normalizedUrl = url.replace(/^\/uploads(\/properties)?\//, "/images/");
  // Correct invalid image extensions for internal URLs
  if (normalizedUrl.endsWith(".js")) {
    normalizedUrl = normalizedUrl.replace(/\.js$/, ".jpg");
    console.warn(
      "[imageUtils] Corrected invalid extension from .js to .jpg:",
      url,
      "->",
      normalizedUrl
    );
  }
  console.log(
    "[imageUtils] Normalized image URL from",
    url,
    "to",
    normalizedUrl
  );
  return normalizedUrl;
};

export { normalizeImageUrl };

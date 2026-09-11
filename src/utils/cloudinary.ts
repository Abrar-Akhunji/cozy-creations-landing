/**
 * Optimizes a Cloudinary image URL by injecting f_auto (format) and q_auto (quality) parameters.
 * Optionally limits the width with c_limit to prevent upscaling.
 * If the URL is not from Cloudinary, it falls back to returning the original URL.
 *
 * @param url Original product image URL
 * @param width Optional constraint for width resizing
 */
export const optimizeCloudinaryUrl = (url: string, width?: number): string => {
  if (!url || !url.includes("res.cloudinary.com")) return url;

  // Assemble Cloudinary optimization parameters
  let params = "f_auto,q_auto";
  if (width) {
    params += `,w_${width},c_limit`;
  }

  // Insert parameters immediately after the '/upload/' segment
  if (url.includes("/upload/")) {
    return url.replace("/upload/", `/upload/${params}/`);
  }

  return url;
};

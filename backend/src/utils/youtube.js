/**
 * Extract a YouTube video ID from common URL formats or a bare 11-char ID.
 * Returns null when the input is not a recognisable YouTube reference.
 */
export function getYouTubeVideoId(url) {
  if (!url || typeof url !== 'string') return null;

  const trimmed = url.trim();

  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /youtube\.com\/watch\?.*v=([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = trimmed.match(pattern);
    if (match?.[1]) return match[1];
  }

  return null;
}

export function isValidYouTubeUrl(url) {
  return Boolean(getYouTubeVideoId(url));
}

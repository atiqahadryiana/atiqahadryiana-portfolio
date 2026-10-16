export function resumeUrlError(value) {
  if (typeof value !== 'string' || value.length > 2048) {
    return 'Use a resume link shorter than 2,048 characters.';
  }
  if (!value.trim()) return '';
  try {
    const url = new URL(value.trim());
    if (url.protocol === 'https:' && !url.username && !url.password && !value.includes('ADD_')) {
      return '';
    }
  } catch {
    // Show the same useful message for incomplete or unsupported links.
  }
  return 'Enter a complete public HTTPS link to your resume.';
}

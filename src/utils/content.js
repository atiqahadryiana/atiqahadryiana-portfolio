import publicAssets from 'virtual:public-assets';

export function isWebUrl(value) {
  if (typeof value !== 'string' || value.includes('ADD_')) return false;
  try {
    const url = new URL(value);
    return ['https:', 'http:'].includes(url.protocol);
  } catch {
    return false;
  }
}
export function isEmail(value) {
  return (
    typeof value === 'string' && !value.includes('ADD_') && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  );
}
export function publicAsset(value) {
  return typeof value === 'string' && publicAssets.includes(value);
}
export function imageUrl(value) {
  return publicAsset(value) || isWebUrl(value) ? value : null;
}
export function isFormEndpoint(value) {
  if (!isWebUrl(value)) return false;
  const url = new URL(value);
  return url.origin === 'https://formspree.io' && /^\/f\/[a-zA-Z0-9]+$/.test(url.pathname);
}

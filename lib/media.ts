const externalMediaSourcePattern = /^(https?:\/\/|data:|blob:)/i;

const mediaCdnEnabled = process.env.NEXT_PUBLIC_USE_MEDIA_CDN === "true";
const mediaCdnBaseUrl =
  process.env.NEXT_PUBLIC_MEDIA_CDN_BASE_URL?.replace(/\/+$/, "") ?? "";

export function getMediaSrc(src: string) {
  if (externalMediaSourcePattern.test(src)) {
    return src;
  }

  if (
    mediaCdnEnabled &&
    mediaCdnBaseUrl &&
    (src.startsWith("/lab/") || src.startsWith("/works/"))
  ) {
    return `${mediaCdnBaseUrl}${src}`;
  }

  return src;
}

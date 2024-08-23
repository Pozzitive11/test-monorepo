export const b64ToUtf8 = (b64: string): string => decodeURIComponent(escape(atob(b64)))

export const utf8ToB64 = (str: string): string => btoa(unescape(encodeURIComponent(str)))

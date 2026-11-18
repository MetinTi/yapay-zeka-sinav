const inviteKey = 'blanchard:2026-12:1:blanchard-ai-awareness-202612-v1:classroom';
const deviceKey = 'blanchard:assessment-device:v1';
const validSecret = value => typeof value === 'string' && /^[a-f0-9]{64}$/.test(value);
const hex = bytes => Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');

export function savedClassroom(storage = sessionStorage) {
  try {
    const invite = storage.getItem(inviteKey);
    return validSecret(invite) ? invite : '';
  } catch {
    return '';
  }
}

export function enterClassroom(url = new URL(location.href), session = sessionStorage, browserHistory = history) {
  const fragment = url.hash.slice(1);
  const supplied = new URLSearchParams(fragment).getAll('sinif');
  if (!supplied.length) return savedClassroom(session);
  const rest = fragment.split('&').filter(part => !new URLSearchParams(part).has('sinif')).join('&');
  try {
    browserHistory.replaceState(browserHistory.state, '', url.pathname + url.search + (rest ? '#' + rest : ''));
    if (supplied.length !== 1 || !validSecret(supplied[0])) return '';
    session.setItem(inviteKey, supplied[0]);
    return savedClassroom(session);
  } catch {
    return '';
  }
}

export async function deviceIdentity(storage = localStorage) {
  let deviceSecret = storage.getItem(deviceKey);
  if (!validSecret(deviceSecret)) {
    deviceSecret = hex(crypto.getRandomValues(new Uint8Array(32)));
    storage.setItem(deviceKey, deviceSecret);
    // A second tab may have just initialized the same browser identity.
    deviceSecret = storage.getItem(deviceKey);
    if (!validSecret(deviceSecret)) throw new Error('Browser identity unavailable');
  }
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(deviceSecret));
  return { deviceSecret, code: 'AI-' + hex(new Uint8Array(digest)).slice(0, 20).toUpperCase() };
}

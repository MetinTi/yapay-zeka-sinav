import {resolveExamContext} from './exam-context.mjs';
import {BACKEND_ENDPOINT} from '../ozak/backend-config.mjs';

export function createPersistence(endpoint, access, profile = resolveExamContext(location.pathname, location.search)) {
  async function request(action, payload) {
    if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint || '')) {
      throw new Error('Assessment service unavailable');
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    const {invite, deviceSecret} = access;
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
        body: JSON.stringify({
          action,
          data: {...payload, context:profile.context, version:profile.version, invite, deviceSecret},
        }),
        credentials: 'omit',
        referrerPolicy: 'no-referrer',
        cache: 'no-store',
        signal: controller.signal,
      });
      if (!response.ok) throw new Error('Assessment service unavailable');
      const data = await response.json();
      return {saved: data?.status === 'ok' && data.saved === true};
    } finally {
      clearTimeout(timeout);
    }
  }
  return {
    registerParticipant({code,name}) { return request('register-v2',{code,name}); },
    saveResult({id,code,name,phase,answers,elapsed,timedOut,completed}) {
      return request('result-v2',{id,code,name,phase,answers,elapsed,timedOut,clientCompletedAt:completed});
    },
  };
}

export const openPersistence = access => createPersistence(BACKEND_ENDPOINT, access);

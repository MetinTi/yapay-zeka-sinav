import {resolveExamContext} from './exam-context.mjs';
import {BACKEND_ENDPOINT} from './backend-config.mjs';

export function createPersistence(endpoint) {
  function request(action, payload) {
    const profile = resolveExamContext(location.pathname, location.search);
    if (!/^https:\/\/script\.google\.com\/macros\/s\/[A-Za-z0-9_-]+\/exec$/.test(endpoint || '')) {
      return Promise.reject(new Error('Özak kayıt servisi henüz yapılandırılmadı. Eğitmenine haber ver; sonucunu indirerek saklayabilirsin.'));
    }
    return new Promise((resolve,reject) => {
      const callback=`v2_store_${crypto.randomUUID().replaceAll('-','')}`;
      const script=document.createElement('script');
      const cleanup=()=>{clearTimeout(timeout);script.remove();delete window[callback];};
      const timeout=setTimeout(()=>{cleanup();reject(new Error('Kayıt servisine ulaşılamadı.'));},20000);
      window[callback]=data=>{cleanup();data?.status==='ok'&&data.saved===true?resolve({saved:true}):reject(new Error(data?.message||'Kayıt yapılamadı.'));};
      script.onerror=()=>{cleanup();reject(new Error('Kayıt servisine ulaşılamadı.'));};
      script.src=`${endpoint}?${new URLSearchParams({action,callback,data:JSON.stringify({...payload,version:profile.version,context:profile.context})})}`;
      document.head.append(script);
    });
  }
  return {
    registerParticipant({code,name}) {return request('register-v2',{code,name});},
    saveResult({id,code,name,phase,score,correct,wrong,empty,elapsed,timedOut,completed}) {
      return request('result-v2',{id,code,name,phase,score,correct,wrong,empty,elapsed,timedOut,clientCompletedAt:completed});
    }
  };
}

export const {registerParticipant,saveResult} = createPersistence(BACKEND_ENDPOINT);

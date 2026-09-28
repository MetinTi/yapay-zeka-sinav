import {EXAM_VERSION} from './questions.mjs';

const endpoint = 'https://script.google.com/macros/s/AKfycbwMu1jzZcUOJzvbvyCeJNIlTJHHFCqQZSSzN6S5cryZIsj6jDFyCqq31c8_D9NpbWyf/exec';
function request(action, payload) {
  return new Promise((resolve,reject) => {
    const callback=`v2_store_${crypto.randomUUID().replaceAll('-','')}`;
    const script=document.createElement('script');
    const cleanup=()=>{clearTimeout(timeout);script.remove();delete window[callback];};
    const timeout=setTimeout(()=>{cleanup();reject(new Error('Kayıt servisine ulaşılamadı.'));},20000);
    window[callback]=data=>{cleanup();data?.status==='ok'&&data.saved===true?resolve({saved:true}):reject(new Error(data?.message||'Kayıt yapılamadı.'));};
    script.onerror=()=>{cleanup();reject(new Error('Kayıt servisine ulaşılamadı.'));};
    script.src=`${endpoint}?${new URLSearchParams({action,callback,data:JSON.stringify({...payload,version:EXAM_VERSION})})}`;
    document.head.append(script);
  });
}
export function registerParticipant({code,name}) {return request('register-v2',{code,name});}
export function saveResult({id,code,name,phase,score,correct,wrong,empty,elapsed,timedOut}) {
  return request('result-v2',{id,code,name,phase,score,correct,wrong,empty,elapsed,timedOut});
}

"use client";
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { pageView, startMetrika, trackGoal } from './metrika';
export function Analytics() {
  const path=usePathname();
  useEffect(()=>{
    // Local previews never initialize the production counter.
    if(['localhost','127.0.0.1','::1'].includes(location.hostname))return;
    let active=true;
    fetch('/api/analytics/config',{signal:AbortSignal.timeout(5000)})
      .then(r=>r.ok?r.json():null)
      .then(config=>{if(active)startMetrika(config?.counterId,location.pathname);})
      .catch(()=>{});
    const click=(event:MouseEvent)=>{
      const link=event.target instanceof Element?event.target.closest('a'):null;
      if(link && new URL(link.href,location.href).origin===location.origin && new URL(link.href,location.href).hash==='#intake')trackGoal('intake_open');
    };
    document.addEventListener('click',click);
    return ()=>{active=false;document.removeEventListener('click',click);};
  },[]);
  useEffect(()=>{pageView(path);},[path]);
  return null;
}

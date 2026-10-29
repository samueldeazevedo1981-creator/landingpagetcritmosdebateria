(() => {
  'use strict';
  if (window.__tcRhythmsTracking) return;
  window.__tcRhythmsTracking = true;
  const pixel = '940045260820970';
  const product = {content_name:'Trucker Cap Ritmos de Bateria',content_category:'Aplicativo de ritmos de bateria',content_type:'product',content_ids:['trucker_cap_ritmos_bateria_r67'],value:67,currency:'BRL'};
  if (!window.fbq) {
    const q = window.fbq = function(){q.callMethod ? q.callMethod.apply(q, arguments) : q.queue.push(arguments);};
    if (!window._fbq) window._fbq = q;
    q.push=q; q.loaded=true; q.version='2.0'; q.queue=[];
    const script=document.createElement('script'); script.async=true;
    script.src='https://connect.facebook.net/pt_BR/fbevents.js'; document.head.appendChild(script);
  }
  window.fbq('init',pixel);
  const seen = new Set();
  function emit(name, extra={}, once=false) {
    if(once && seen.has(name)) return;
    seen.add(name);
    const standard=['PageView','ViewContent','InitiateCheckout','Contact'].includes(name);
    const eventID='tcr_'+name+'_'+(window.crypto?.randomUUID?.() || Date.now()+'_'+Math.random().toString(36).slice(2));
    window.fbq(standard?'trackSingle':'trackSingleCustom',pixel,name,{...product,...extra},{eventID});
  }
  emit('PageView',{},true); emit('ViewContent',{},true);
  const trackingKeys=['utm_source','utm_medium','utm_campaign','utm_content','utm_term','utm_id','utm_adset','utm_ad','campaign_id','adset_id','ad_id','fbclid','fbc','fbp'];
  function collectAttribution() {
    let stored={};
    try {stored=JSON.parse(localStorage.getItem('tc_ritmos_tracking_params') || '{}') || {};} catch {}
    const incoming=new URLSearchParams(location.search);
    const attribution=new URLSearchParams();
    trackingKeys.forEach(key=>{const value=incoming.get(key) || stored[key];if(value) attribution.set(key,value);});
    const cookie=name=>{const part=(document.cookie || '').split('; ').find(v=>v.startsWith(name+'='));return part?decodeURIComponent(part.slice(name.length+1)):'';};
    const click=incoming.get('fbclid');
    let fbc=cookie('_fbc');
    if(click && (!fbc || !fbc.endsWith('.'+click))) {
      fbc='fb.1.'+Date.now()+'.'+click;
      document.cookie='_fbc='+encodeURIComponent(fbc)+'; Max-Age=7776000; Path=/; SameSite=Lax; Secure';
    }
    if(fbc) attribution.set('fbc',fbc);
    const fbp=cookie('_fbp');if(fbp) attribution.set('fbp',fbp);
    try {localStorage.setItem('tc_ritmos_tracking_params',JSON.stringify(Object.fromEntries(attribution)));} catch {}
    return attribution;
  }
  const attribution=collectAttribution();
  document.querySelectorAll('a[href]').forEach(link=>{
    const url = new URL(link.href,location.href);
    if(url.hostname==='chk.eduzz.com') {
      attribution.forEach((value,key)=>url.searchParams.set(key,value)); link.href=url.href;
      let lastClick=0;
      const checkout=()=>{
        const now=Date.now(); if(now-lastClick<1000) return; lastClick=now;
        const placement=link.closest('header')?'header':link.closest('.hero')?'hero':'offer';
        collectAttribution().forEach((value,key)=>url.searchParams.set(key,value));link.href=url.href;
        const details={button_location:placement,button_text:(link.textContent || '').trim(),destination:link.href};
        emit('BuyButtonClick',details);
        emit('CalculatorBuyIntent',{...details,observacao:'Clique no botão de compra / intenção de compra'});
        emit('InitiateCheckout',{...details,num_items:1});
      };
      link.addEventListener('click',checkout);
      link.addEventListener('auxclick',e=>{if(e.button===1) checkout();});
    }
    if(['wa.me','api.whatsapp.com','chat.whatsapp.com'].includes(url.hostname)) {
      link.addEventListener('click',()=>{const details={button_text:(link.textContent || '').trim(),destination:link.href};emit('WhatsAppClick',details);emit('Contact',details);});
    }
  });
  let activeSeconds=0;
  setInterval(()=>{
    if(document.visibilityState!=='visible') return;
    activeSeconds++;
    [30,60,120].forEach(n=>{if(activeSeconds>=n) emit('Tempo'+n,{active_seconds:n,tempo_segundos:n},true);});
  },1000);
  const checkScroll=()=>{
    const available=document.documentElement.scrollHeight-window.innerHeight;
    if(available<=0) return;
    const depth=Math.min(100,Math.max(0,window.scrollY/available*100));
    [25,50,75,90].forEach(n=>{if(depth>=n) emit('Scroll'+n,{scroll_percent:n},true);});
  };
  window.addEventListener('scroll',checkScroll,{passive:true});
  window.addEventListener('resize',checkScroll); checkScroll();
  if('IntersectionObserver' in window) {
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting) {emit(entry.target.matches('[data-upsell]')?'UpsellView':'OfferView',{},true); observer.unobserve(entry.target);}
    }),{threshold:.5});
    document.querySelectorAll('.offer-card,[data-upsell]').forEach(el=>observer.observe(el));
  }
  // Purchase is deliberately owned by confirmed-payment tracking in Eduzz.
  // No URL query string or purchase-button click can emit a sale here.
  const frame=document.querySelector('.sales-video iframe');
  if(frame) {
    frame.id='tc-sales-video';
    const url=new URL(frame.src); url.searchParams.set('enablejsapi','1'); url.searchParams.set('origin',location.origin); frame.src=url.href;
    let player, timer;
    const videoData={video_id:'ll2--D-7z9I',video_name:'VSL Trucker Cap Ritmos de Bateria'};
    const progress=()=>{
      if(!player || player.getPlayerState()!==1) return;
      const duration=player.getDuration(); if(!duration) return;
      const pct=player.getCurrentTime()/duration*100;
      [25,50,75,90,95].forEach(n=>{if(pct>=n) emit('Video'+n,{...videoData,video_percent:n,measurement:'player_position'},true);});
    };
    const setup=()=>{player=new window.YT.Player(frame.id,{events:{onStateChange:event=>{
      clearInterval(timer);
      if(event.data===1){emit('VideoStart',videoData,true);timer=setInterval(progress,1000);}
      if(event.data===0){progress();emit('VideoComplete',videoData,true);}
    }}});};
    if(window.YT?.Player) setup();
    else {const previous=window.onYouTubeIframeAPIReady;window.onYouTubeIframeAPIReady=()=>{if(previous) previous();setup();};
      const script=document.createElement('script');script.src='https://www.youtube.com/iframe_api';script.async=true;document.head.appendChild(script);}
    document.querySelectorAll('a[href="https://www.youtube.com/watch?v=ll2--D-7z9I"]').forEach(a=>a.addEventListener('click',()=>emit('VideoExternalClick',videoData)));
  }
})();

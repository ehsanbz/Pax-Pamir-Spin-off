/* Search the atlas research, never the embedded image bytes. */
(() => {
  const english = document.documentElement.lang === 'en';
  const words = english ? {title:'Search the whole atlas', hint:'People, places, cards, events, timeline and chapters', empty:'No matches. Try a shorter name or another spelling.', start:'Enter a name, date or topic.', count:'results', clear:'Clear', card:'Card / person or theme', event:'Timeline event', place:'Map location', chapter:'Historical chapter'} : {title:'جست‌وجو در سراسر اطلس', hint:'اشخاص، مکان‌ها، کارت‌ها، رویدادها، گاه‌شمار و فصل‌ها', empty:'نتیجه‌ای پیدا نشد. نام کوتاه‌تر یا املای دیگری را امتحان کنید.', start:'نام، تاریخ یا موضوعی را وارد کنید.', count:'نتیجه', clear:'پاک کردن', card:'کارت / شخصیت یا موضوع', event:'رویداد گاه‌شمار', place:'مکان روی نقشه', chapter:'فصل تاریخی'};
  const flatten = value => Array.isArray(value) ? value.map(flatten).join(' ') : value && typeof value === 'object' ? Object.entries(value).filter(([k])=> !['image','url'].includes(k)).map(([,v])=>flatten(v)).join(' ') : String(value ?? '');
  const normalize = value => norm(value).normalize('NFKD').replace(/[\u0300-\u036f\u064b-\u065f]/g,'').replace(/[٠-٩]/g,d=>'٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/\s+/g,' ');
  const records = [
    ...D.cards.map(x=>({kind:'card',id:x.id,title:x.fa,subtitle:x.en,text:flatten(x)+' '+flatten(D.edges.filter(e=>e.source===x.id||e.target===x.id)),view:'catalog'})),
    ...D.events.map(x=>({kind:'event',id:x.id,title:x.title,subtitle:datelabel(x),text:flatten(x),view:'timeline'})),
    ...D.places.map(x=>({kind:'place',id:x.id,title:x.fa,subtitle:(x.aliases||[]).join(' · '),text:flatten(x),view:'map'})),
    ...D.narrative.map((x,id)=>({kind:'chapter',id,title:x.title,subtitle:x.year,text:flatten(x),view:'story'}))
  ].map(x=>({...x,haystack:normalize(x.text),name:normalize(x.title+' '+x.subtitle)}));
  const box = document.createElement('section');
  box.className='smallpanel';box.id='global-search';
  box.innerHTML=`<h2><label for="globalSearch">${words.title}</label></h2><p class="sub">${words.hint}</p><div class="toolbar"><input type="search" id="globalSearch" autocomplete="off"><button id="globalClear" type="button">${words.clear}</button></div><p id="globalCount" role="status" aria-live="polite"></p><div id="globalResults" style="max-height:420px;overflow:auto"></div>`;
  document.querySelector('main').prepend(box);
  function search(){
    const query=normalize($('globalSearch').value).trim(),tokens=query.split(' ').filter(Boolean);
    const found=tokens.length?records.filter(x=>tokens.every(t=>x.haystack.includes(t))).sort((a,b)=>Number(b.name.includes(query))-Number(a.name.includes(query))||a.title.localeCompare(b.title)):[];
    $('globalCount').textContent=!tokens.length?words.start:found.length?fa(found.length)+' '+words.count:words.empty;
    $('globalResults').innerHTML=found.map(x=>{
      const hash=new URLSearchParams({view:x.view,[x.kind]:String(x.id)});
      return `<article class="ref"><a href="#${hash}" data-search-kind="${x.kind}" data-search-id="${esc(x.id)}"><strong>${esc(x.title)}</strong></a><small>${words[x.kind]} · ${esc(x.subtitle||'')}</small></article>`;
    }).join('');
  }
  box.addEventListener('click',e=>{
    const a=e.target.closest('[data-search-kind]');if(!a||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
    e.preventDefault();const kind=a.dataset.searchKind,id=a.dataset.searchId;
    if(kind==='card')showCard(Number(id));
    if(kind==='event')showEvent(id);
    if(kind==='place'){closeDrawer();$('mapScope').value='all';$('placeSearch').value='';renderPlaceResult(id);$('placeResult').tabIndex=-1;$('placeResult').focus({preventScroll:true});}
    if(kind==='chapter'){closeDrawer();showView('story');const chapter=$('chapters').children[Number(id)];chapter.tabIndex=-1;chapter.focus();chapter.scrollIntoView({block:'center'});history.replaceState(null,'',a.getAttribute('href'));}
  });
  $('globalSearch').addEventListener('input',search);
  $('globalClear').onclick=()=>{$('globalSearch').value='';search();$('globalSearch').focus();};
  search();
  if(new URLSearchParams(location.search).has('search')){box.scrollIntoView();$('globalSearch').focus();}
})();

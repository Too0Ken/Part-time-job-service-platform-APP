(function(global){
  const STORAGE_KEY='banxing.completionConfirmStatesV1';
  const RATING_KEY='banxing.orderRatingStatesV1';

  function normalizeMeta(meta){
    return {
      type:String(meta&&meta.type||'').trim(),
      time:String(meta&&meta.time||'').trim(),
      amount:String(meta&&meta.amount||'').trim()
    };
  }

  function buildSignature(meta){
    const normalized=normalizeMeta(meta);
    return [normalized.type,normalized.time,normalized.amount].join('|');
  }

  function readStore(){
    try{
      const saved=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}');
      return saved&&typeof saved==='object'?saved:{};
    }catch(error){
      return {};
    }
  }

  function writeStore(store){
    try{
      localStorage.setItem(STORAGE_KEY,JSON.stringify(store));
    }catch(error){}
  }

  function readRatingStore(){
    try{
      const saved=JSON.parse(localStorage.getItem(RATING_KEY)||'{}');
      return saved&&typeof saved==='object'?saved:{};
    }catch(error){
      return {};
    }
  }

  function writeRatingStore(store){
    try{
      localStorage.setItem(RATING_KEY,JSON.stringify(store));
    }catch(error){}
  }

  function setState(meta,state){
    const signature=buildSignature(meta);
    const store=readStore();
    store[signature]={
      state:state||'',
      updatedAt:Date.now()
    };
    writeStore(store);
    return state;
  }

  function getState(meta){
    const signature=buildSignature(meta);
    const store=readStore();
    return store[signature]&&store[signature].state?store[signature].state:'';
  }

  function getRatingState(meta){
    const signature=buildSignature(meta);
    const store=readRatingStore();
    const current=store[signature]||{};
    return {
      acceptedRated:!!current.acceptedRated,
      publishedRated:!!current.publishedRated
    };
  }

  function markRated(meta,role){
    const signature=buildSignature(meta);
    const store=readRatingStore();
    const current=store[signature]||{};
    const next={
      acceptedRated:role==='accepted'?true:!!current.acceptedRated,
      publishedRated:role==='published'?true:!!current.publishedRated,
      updatedAt:Date.now()
    };
    store[signature]=next;
    writeRatingStore(store);
    return next;
  }

  function hasRated(meta,role){
    const current=getRatingState(meta);
    return role==='accepted'?current.acceptedRated:current.publishedRated;
  }

  function areBothRated(meta){
    const current=getRatingState(meta);
    return !!(current.acceptedRated&&current.publishedRated);
  }

  function markSubmitted(meta){
    return setState(meta,'submitted');
  }

  function markConfirmed(meta){
    return setState(meta,'confirmed');
  }

  function clear(meta){
    const signature=buildSignature(meta);
    const store=readStore();
    delete store[signature];
    writeStore(store);
  }

  function resolveStatus(baseStatus,meta){
    const state=getState(meta);
    const bothRated=areBothRated(meta);
    if(state==='submitted'&&['serving','review','confirm'].includes(baseStatus)){
      return 'confirm';
    }
    if(state==='confirmed'&&['serving','confirm'].includes(baseStatus)){
      return bothRated?'done':'review';
    }
    if(baseStatus==='review')return bothRated?'done':'review';
    return baseStatus;
  }

  global.BanxingCompletionConfirm={
    buildSignature:buildSignature,
    getState:getState,
    getRatingState:getRatingState,
    hasRated:hasRated,
    areBothRated:areBothRated,
    markSubmitted:markSubmitted,
    markConfirmed:markConfirmed,
    markRated:markRated,
    clear:clear,
    resolveStatus:resolveStatus
  };
})(window);

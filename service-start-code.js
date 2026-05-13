(function(global){
  const STORAGE_KEY='banxing.serviceStartCodesV1';
  const VALIDITY_MS=24*60*60*1000;

  function normalizeMeta(meta){
    return {
      type:String(meta&&meta.type||'').trim(),
      time:String(meta&&meta.time||'').trim(),
      amount:String(meta&&meta.amount||'').trim(),
      providerId:String(meta&&meta.providerId||'').trim(),
	      orderId:String(meta&&meta.orderId||'').trim().toLowerCase()
    };
  }

  function buildSignature(meta){
    const normalized=normalizeMeta(meta);
	    return [normalized.orderId,normalized.type,normalized.time,normalized.amount].join('|');
  }

  function computeCode(signature){
    let hash=0;
    String(signature||'').split('').forEach(function(char,index){
      hash=(hash+char.charCodeAt(0)*(index+17))%900000;
    });
    return String(hash+100000).padStart(6,'0').slice(-6);
  }

  function buildCode(signature,version,seed){
    return computeCode([signature,version||1,seed||''].join('|'));
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

  function buildRecord(meta,current,forceRefresh){
    const normalized=normalizeMeta(meta);
    const signature=buildSignature(normalized);
    const now=Date.now();
    const expired=current.expiresAt&&now>Number(current.expiresAt);
    const shouldRegenerate=forceRefresh||!current.code||expired;
    const version=shouldRegenerate?Number(current.version||0)+1:Number(current.version||1);
    const generatedAt=shouldRegenerate?now:Number(current.generatedAt||now);
    const next={
      ...current,
      code:shouldRegenerate?buildCode(signature,version,now):current.code,
      version:version,
      type:normalized.type||current.type||'',
      time:normalized.time||current.time||'',
      amount:normalized.amount||current.amount||'',
      providerId:normalized.providerId||current.providerId||'',
      orderId:normalized.orderId||current.orderId||'',
      generatedAt:generatedAt,
      expiresAt:generatedAt+VALIDITY_MS,
      previousCode:shouldRegenerate?current.code||'':current.previousCode||'',
      previousInvalidatedAt:shouldRegenerate&&current.code?now:current.previousInvalidatedAt||0,
      updatedAt:Date.now()
    };
    return {signature:signature,record:next};
  }

  function ensureCode(meta){
    const store=readStore();
    const built=buildRecord(meta,store[buildSignature(meta)]||{},false);
    store[built.signature]=built.record;
    writeStore(store);
    return built.record.code;
  }

  function getRecord(meta){
    const signature=buildSignature(meta);
    const store=readStore();
    if(!store[signature]){
      const built=buildRecord(meta,{},false);
      store[built.signature]=built.record;
      writeStore(store);
      return built.record;
    }
    return store[signature];
  }

  function refreshCode(meta){
    const store=readStore();
    const signature=buildSignature(meta);
    const built=buildRecord(meta,store[signature]||{},true);
    store[signature]=built.record;
    writeStore(store);
    return built.record;
  }

  function getCode(meta){
    return getRecord(meta).code;
  }

  function getCodeInfo(meta){
    const record=getRecord(meta);
    return {
      code:record.code,
      version:Number(record.version||1),
      generatedAt:Number(record.generatedAt||0),
      expiresAt:Number(record.expiresAt||0),
      expired:record.expiresAt?Date.now()>Number(record.expiresAt):false
    };
  }

  function validateCodeResult(input,meta){
    const value=String(input||'').trim();
    const record=getRecord(meta);
    if(record.expiresAt&&Date.now()>Number(record.expiresAt)){
      return {ok:false,reason:'expired',code:'SERVICE_CODE_EXPIRED',message:'验证码已过期，请向发布者获取新码。'};
    }
    if(value!==record.code){
      return {ok:false,reason:'invalid',code:'SERVICE_CODE_INVALID',message:'验证码不正确或已更新，请向发布者获取新码。'};
    }
    return {ok:true,reason:'passed',code:'OK',message:'核验通过'};
  }

  function validateCode(input,meta){
    return validateCodeResult(input,meta).ok;
  }

  global.BanxingServiceStartCode={
    ensureCode:ensureCode,
    getCode:getCode,
    getCodeInfo:getCodeInfo,
    refreshCode:refreshCode,
    validateCode:validateCode,
    validateCodeResult:validateCodeResult,
    buildSignature:buildSignature
  };
})(window);

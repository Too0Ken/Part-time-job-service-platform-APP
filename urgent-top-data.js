(function(){
  const STORAGE_KEY='banxing.urgentTopOrders';
  const MIN_RANGE_KM=10;
  const MAX_RANGE_KM=100;
  const RANGE_STEP_KM=10;
  const MIN_DURATION_HOURS=1;
  const MAX_DURATION_HOURS=24;
  const DEFAULT_DURATION_HOURS=2;
  const PRICE_PER_STEP=5;

  function normalizeKm(value){
    const parsed=Math.round(Number(value||MIN_RANGE_KM)/RANGE_STEP_KM)*RANGE_STEP_KM;
    return Math.max(MIN_RANGE_KM,Math.min(MAX_RANGE_KM,parsed));
  }

  function normalizeHours(value){
    const parsed=Math.round(Number(value||DEFAULT_DURATION_HOURS));
    return Math.max(MIN_DURATION_HOURS,Math.min(MAX_DURATION_HOURS,parsed));
  }

  function getFee(km,hours){
    const safeKm=normalizeKm(km);
    const safeHours=normalizeHours(hours);
    const rangeSteps=(safeKm-MIN_RANGE_KM)/RANGE_STEP_KM;
    const durationSteps=safeHours-MIN_DURATION_HOURS;
    return (1+rangeSteps+durationSteps)*PRICE_PER_STEP;
  }

  const RANGE_OPTIONS=Array.from({length:(MAX_RANGE_KM-MIN_RANGE_KM)/RANGE_STEP_KM+1},function(_,index){
    const km=MIN_RANGE_KM+index*RANGE_STEP_KM;
    return {km:km,fee:getFee(km,DEFAULT_DURATION_HOURS)};
  });
  const DURATION_OPTIONS=Array.from({length:MAX_DURATION_HOURS-MIN_DURATION_HOURS+1},function(_,index){
    const hours=MIN_DURATION_HOURS+index;
    return {hours:hours,label:hours+'小时'};
  });

  function formatMoney(amount){
    return '¥'+Number(amount||0).toFixed(2);
  }

  function getFeeByKm(km,hours){
    return getFee(km,typeof hours==='number'?hours:DEFAULT_DURATION_HOURS);
  }

  function getDurationLabel(hours){
    const target=normalizeHours(hours);
    const matched=DURATION_OPTIONS.find(function(item){return item.hours===target;});
    return matched?matched.label:'';
  }

  function toTimestamp(value){
    if(!value)return 0;
    if(typeof value==='number')return value;
    const parsed=new Date(value).getTime();
    return Number.isFinite(parsed)?parsed:0;
  }

  function padNumber(value){
    return String(Math.max(0,Math.floor(value||0))).padStart(2,'0');
  }

  function formatMs(ms){
    const safeMs=Math.max(0,Number(ms)||0);
    const totalSeconds=Math.floor(safeMs/1000);
    const hours=Math.floor(totalSeconds/3600);
    const minutes=Math.floor((totalSeconds%3600)/60);
    const seconds=totalSeconds%60;
    return padNumber(hours)+':'+padNumber(minutes)+':'+padNumber(seconds);
  }

  function normalizeEntry(item){
    if(!item||!item.orderId)return null;
    const now=Date.now();
    const hourMs=60*60*1000;
    let km=normalizeKm(item.km||MIN_RANGE_KM);
    let durationHours=normalizeHours(item.durationHours||DEFAULT_DURATION_HOURS);
    let fee=Number(item.fee||getFeeByKm(km,durationHours));
    let createdAt=toTimestamp(item.createdAt)||now;
    let expiresAt=toTimestamp(item.expiresAt)||(createdAt+durationHours*hourMs);
    const previousKm=Number(item.previousKm||0)||0;
    const previousDurationHours=Number(item.previousDurationHours||0)||0;
    let nextKm=Number(item.nextKm||item.pendingKm||item.queuedKm||0)||0;
    let nextFee=Number(item.nextFee||0)||0;
    let nextDurationHours=Number(item.nextDurationHours||0)||0;
    let nextStartsAt=toTimestamp(item.nextStartsAt||item.pendingStartsAt||item.queuedStartsAt)||0;
    let nextExpiresAt=toTimestamp(item.nextExpiresAt||item.pendingExpiresAt||item.queuedExpiresAt)||0;

    if(!nextDurationHours&&nextStartsAt&&nextExpiresAt>nextStartsAt){
      nextDurationHours=(nextExpiresAt-nextStartsAt)/hourMs;
    }
    if(nextKm&&!nextFee){
      nextFee=getFeeByKm(nextKm,nextDurationHours||DEFAULT_DURATION_HOURS);
    }

    const legacyChangedRange=item.changedRange===true||(previousKm>0&&previousKm!==km);
    if(!nextKm&&legacyChangedRange&&previousKm&&previousKm!==km){
      const currentDuration=previousDurationHours||durationHours||2;
      const currentExpiresAt=createdAt+currentDuration*hourMs;
      nextKm=km;
      nextFee=fee;
      nextDurationHours=durationHours;
      nextStartsAt=currentExpiresAt;
      nextExpiresAt=currentExpiresAt+nextDurationHours*hourMs;
      km=previousKm;
      fee=getFeeByKm(km,durationHours);
      durationHours=currentDuration;
      expiresAt=currentExpiresAt;
    }

    if(nextKm){
      if(!nextStartsAt){
        nextStartsAt=expiresAt;
      }
      if(!nextDurationHours&&nextExpiresAt>nextStartsAt){
        nextDurationHours=(nextExpiresAt-nextStartsAt)/hourMs;
      }
      if(!nextDurationHours){
        nextDurationHours=2;
      }
      if(!nextExpiresAt){
        nextExpiresAt=nextStartsAt+nextDurationHours*hourMs;
      }
    }

    if(expiresAt<=now&&nextKm&&nextExpiresAt>now){
      km=nextKm;
      fee=nextFee||getFeeByKm(nextKm,durationHours);
      durationHours=nextDurationHours||Math.max(1,(nextExpiresAt-nextStartsAt)/hourMs);
      createdAt=nextStartsAt||now;
      expiresAt=nextExpiresAt;
      nextKm=0;
      nextFee=0;
      nextDurationHours=0;
      nextStartsAt=0;
      nextExpiresAt=0;
    }

    return {
      orderId:String(item.orderId).toUpperCase(),
      enabled:item.enabled!==false,
      km:km,
      fee:fee,
      durationHours:durationHours,
      durationLabel:item.durationLabel||getDurationLabel(durationHours),
      createdAt:createdAt,
      expiresAt:expiresAt,
      previousKm:previousKm,
      previousDurationHours:previousDurationHours,
      previousDurationLabel:item.previousDurationLabel||getDurationLabel(previousDurationHours),
      nextKm:nextKm,
      nextFee:nextFee,
      nextDurationHours:nextDurationHours,
      nextDurationLabel:item.nextDurationLabel||getDurationLabel(nextDurationHours),
      nextStartsAt:nextStartsAt,
      nextExpiresAt:nextExpiresAt,
      changedRange:!!(nextKm&&nextKm!==km),
      paidAt:item.paidAt||'',
      paymentMethod:item.paymentMethod||'平台余额'
    };
  }

  function readAll(){
    try{
      const stored=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
      if(Array.isArray(stored)){
        return stored.map(normalizeEntry).filter(Boolean);
      }
    }catch(error){
    }
    return [];
  }

  function writeAll(list){
    localStorage.setItem(STORAGE_KEY,JSON.stringify(list.map(normalizeEntry).filter(Boolean)));
  }

  function getByOrderId(orderId){
    const target=String(orderId||'').toUpperCase();
    return readAll().find(function(item){return item.orderId===target;})||null;
  }

  function saveForOrder(orderId,data){
    const target=String(orderId||'').toUpperCase();
    if(!target)return null;
    const list=readAll().filter(function(item){return item.orderId!==target;});
    const current=getByOrderId(target);
    const now=Date.now();
    const hourMs=60*60*1000;
    const targetKm=normalizeKm(data&&data.km||current&&current.km||MIN_RANGE_KM);
    const durationHours=normalizeHours(data&&data.durationHours||DEFAULT_DURATION_HOURS);
    const durationLabel=data&&data.durationLabel||getDurationLabel(durationHours);
    const durationMs=durationHours*hourMs;
    let nextPayload;

    if(current&&isActive(current)){
      nextPayload={
        ...current,
        orderId:target,
        enabled:true,
        paidAt:data&&data.paidAt||current.paidAt||'',
        paymentMethod:data&&data.paymentMethod||current.paymentMethod||'平台余额'
      };
      if(targetKm===current.km){
        nextPayload.expiresAt=toTimestamp(current.expiresAt)+durationMs;
        nextPayload.durationHours=Number(current.durationHours||0)+durationHours;
        nextPayload.durationLabel=getDurationLabel(nextPayload.durationHours)||durationLabel;
        nextPayload.fee=getFeeByKm(current.km,nextPayload.durationHours);
        if(current.nextKm){
          nextPayload.nextStartsAt=toTimestamp(current.nextStartsAt)+durationMs;
          nextPayload.nextExpiresAt=toTimestamp(current.nextExpiresAt)+durationMs;
        }
      }else if(current.nextKm&&targetKm===current.nextKm){
        nextPayload.nextExpiresAt=toTimestamp(current.nextExpiresAt||current.expiresAt)+durationMs;
        nextPayload.nextDurationHours=Number(current.nextDurationHours||0)+durationHours;
        nextPayload.nextDurationLabel=getDurationLabel(nextPayload.nextDurationHours)||durationLabel;
        nextPayload.nextFee=getFeeByKm(targetKm,nextPayload.nextDurationHours);
      }else{
        const nextStart=toTimestamp(current.expiresAt);
        nextPayload.nextKm=targetKm;
        nextPayload.nextFee=Number(data&&data.fee||getFeeByKm(targetKm,durationHours));
        nextPayload.nextDurationHours=durationHours;
        nextPayload.nextDurationLabel=durationLabel;
        nextPayload.nextStartsAt=nextStart;
        nextPayload.nextExpiresAt=nextStart+durationMs;
      }
    }else{
      nextPayload={
        orderId:target,
        ...data,
        createdAt:now,
        expiresAt:now+durationMs,
        nextKm:0,
        nextFee:0,
        nextDurationHours:0,
        nextDurationLabel:'',
        nextStartsAt:0,
        nextExpiresAt:0
      };
    }

    const normalized=normalizeEntry(nextPayload);
    if(normalized&&normalized.enabled){
      list.unshift(normalized);
    }
    writeAll(list);
    return normalized;
  }

  function getCurrentRemainingMs(entry){
    if(!entry||!entry.enabled)return 0;
    return Math.max(0,toTimestamp(entry.expiresAt)-Date.now());
  }

  function getNextRemainingMs(entry){
    if(!entry||!entry.enabled||!entry.nextKm)return 0;
    const nextStartsAt=toTimestamp(entry.nextStartsAt);
    const nextExpiresAt=toTimestamp(entry.nextExpiresAt);
    return Math.max(0,nextExpiresAt-nextStartsAt);
  }

  function getRemainingMs(entry){
    return getCurrentRemainingMs(entry)+getNextRemainingMs(entry);
  }

  function isActive(entry){
    return !!(entry&&entry.enabled&&getCurrentRemainingMs(entry)>0);
  }

  function formatCountdown(entry){
    const remainMs=getRemainingMs(entry);
    if(!entry||!entry.enabled)return '';
    if(remainMs<=0)return '已失效';
    return '剩余 '+formatMs(remainMs);
  }

  function formatCurrentCountdown(entry){
    const remainMs=getCurrentRemainingMs(entry);
    if(!entry||!entry.enabled)return '';
    if(remainMs<=0)return '已失效';
    return '剩余 '+formatMs(remainMs);
  }

  function getChangeNote(entry){
    if(!entry||!entry.nextKm||entry.nextKm===entry.km||!isActive(entry))return '';
    const remainText=formatCurrentCountdown(entry).replace(/^剩余\s*/,'');
    return remainText+' 后将把范围变更至'+entry.nextKm+'km';
  }

  function formatSummary(entry){
    if(!entry||!entry.enabled)return '未开启';
    return entry.km+'km · '+formatCountdown(entry);
  }

  window.BanxingUrgentTop={
    storageKey:STORAGE_KEY,
    rangeOptions:RANGE_OPTIONS,
    durationOptions:DURATION_OPTIONS,
    read:readAll,
    write:writeAll,
    getByOrderId:getByOrderId,
    saveForOrder:saveForOrder,
    getFee:getFee,
    getFeeByKm:getFeeByKm,
    getDurationLabel:getDurationLabel,
    getCurrentRemainingMs:getCurrentRemainingMs,
    getRemainingMs:getRemainingMs,
    getNextRemainingMs:getNextRemainingMs,
    isActive:isActive,
    formatCountdown:formatCountdown,
    formatCurrentCountdown:formatCurrentCountdown,
    getChangeNote:getChangeNote,
    formatMs:formatMs,
    formatMoney:formatMoney,
    formatSummary:formatSummary,
    normalize:normalizeEntry
  };
})();

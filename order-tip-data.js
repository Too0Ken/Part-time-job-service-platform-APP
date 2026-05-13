(function(){
  const STORAGE_KEY='banxing.orderTips';

  function toOrderId(value){
    return String(value||'').trim().toUpperCase();
  }

  function parseMoney(value){
    return Number(String(value||'').replace(/[^\d.]/g,''))||0;
  }

  function formatMoney(amount){
    return '¥'+parseMoney(amount).toFixed(2);
  }

  function normalizeAliases(value){
    if(!Array.isArray(value))return [];
    return value.map(toOrderId).filter(Boolean).filter(function(item,index,list){
      return list.indexOf(item)===index;
    });
  }

  function normalizeEntry(item){
    const orderId=toOrderId(item&&item.orderId);
    if(!orderId)return null;
    return {
      orderId:orderId,
      amount:parseMoney(item&&item.amount),
      message:String((item&&item.message)||'').trim(),
      paidAt:String((item&&item.paidAt)||'').trim(),
      paymentMethod:String((item&&item.paymentMethod)||'平台余额').trim(),
      recipientName:String((item&&item.recipientName)||'服务者').trim(),
      aliases:normalizeAliases(item&&item.aliases)
    };
  }

  function matchesOrder(entry,target){
    const normalizedTarget=toOrderId(target);
    if(!entry||!normalizedTarget)return false;
    return entry.orderId===normalizedTarget||(entry.aliases||[]).includes(normalizedTarget);
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
    localStorage.setItem(STORAGE_KEY,JSON.stringify((list||[]).map(normalizeEntry).filter(Boolean)));
  }

  function getByOrderId(orderId){
    const target=toOrderId(orderId);
    if(!target)return null;
    return readAll().find(function(item){
      return matchesOrder(item,target);
    })||null;
  }

  function saveForOrder(orderId,data){
    const target=toOrderId(orderId);
    if(!target)return null;
    const current=getByOrderId(target);
    const primaryId=current&&current.orderId?current.orderId:target;
    const aliases=normalizeAliases([]
      .concat(current&&current.aliases||[])
      .concat(data&&data.aliases||[])
      .concat(primaryId===target?[]:[target])
    ).filter(function(item){
      return item!==primaryId;
    });
    const next=normalizeEntry({
      ...current,
      ...data,
      orderId:primaryId,
      aliases:aliases
    });
    const list=readAll().filter(function(item){
      return !matchesOrder(item,primaryId)&&!matchesOrder(item,target);
    });
    if(next&&next.amount>0){
      list.unshift(next);
    }
    writeAll(list);
    return next;
  }

  window.BanxingOrderTips={
    storageKey:STORAGE_KEY,
    parseMoney:parseMoney,
    formatMoney:formatMoney,
    normalize:normalizeEntry,
    read:readAll,
    write:writeAll,
    getByOrderId:getByOrderId,
    saveForOrder:saveForOrder
  };
})();

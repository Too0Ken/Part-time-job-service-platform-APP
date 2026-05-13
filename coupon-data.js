(function(){
  const STORAGE_KEY='banxing.coupons';
  const DEFAULT_COUPONS=[
    {
      id:'coupon-20-001',
      name:'欢庆五一',
      couponType:'立减',
      amount:20,
      threshold:0,
      status:'unused',
      validFrom:'2026-04-16',
      validTo:'2026-05-05'
    },
    {
      id:'coupon-2-001',
      name:'新人优惠券',
      couponType:'立减',
      amount:2,
      threshold:0,
      status:'unused',
      validFrom:'2026-04-01',
      validTo:'2026-05-10'
    },
    {
      id:'coupon-30-001',
      name:'高额任务券',
      couponType:'满减',
      amount:30,
      threshold:100,
      status:'unused',
      validFrom:'2026-04-21',
      validTo:'2026-04-30'
    },
    {
      id:'coupon-15-001',
      name:'本周发布补贴',
      couponType:'满减',
      amount:15,
      threshold:80,
      status:'unused',
      validFrom:'2026-04-21',
      validTo:'2026-04-28'
    },
    {
      id:'coupon-10-001',
      name:'校园任务券',
      couponType:'满减',
      amount:10,
      threshold:50,
      status:'unused',
      validFrom:'2026-04-21',
      validTo:'2026-05-03'
    },
    {
      id:'coupon-5-001',
      name:'轻量任务券',
      couponType:'满减',
      amount:5,
      threshold:20,
      status:'unused',
      validFrom:'2026-04-21',
      validTo:'2026-04-25'
    },
    {
      id:'coupon-1-001',
      name:'转发订单奖励',
      couponType:'满减',
      amount:1,
      threshold:20,
      status:'used',
      validFrom:'2026-03-01',
      validTo:'2026-04-15',
      usedAt:'2026-03-30',
      usedOrderId:'P7',
      usedOrderTitle:'周末 8km 户外任务'
    },
    {
      id:'coupon-2-002',
      name:'转发订单奖励',
      couponType:'满减',
      amount:2,
      threshold:20,
      status:'expired',
      validFrom:'2026-02-15',
      validTo:'2026-03-01'
    }
  ];
  const DEFAULT_COUPON_MAP=DEFAULT_COUPONS.reduce(function(map,item){
    map[item.id]=item;
    return map;
  },{});
  const DEMO_FALLBACK_COUPON={
    id:'coupon-demo-available',
    name:'演示可用券',
    couponType:'立减',
    amount:5,
    threshold:0,
    status:'unused',
    validFrom:'2026-04-01',
    validTo:'2026-12-31',
    useScope:'全部服务项目',
    deductionScope:'仅抵扣任务金额',
    stackable:false
  };

  function formatMoney(amount){
    return '¥'+Number(amount||0).toFixed(2);
  }

  function looksLikeBenefitText(text){
    return /立减\d+(\.\d+)?|满\d+(\.\d+)?减\d+(\.\d+)?|[0-9.]+折/.test(String(text||''));
  }

  function formatDate(dateText){
    const parts=String(dateText||'').split('-');
    if(parts.length!==3)return String(dateText||'');
    return parts[0]+'年'+parts[1]+'月'+parts[2]+'日';
  }

  function formatDateRange(start,end){
    return formatDate(start)+' - '+formatDate(end);
  }

  function getStatusLabel(status){
    if(status==='used')return '已使用';
    if(status==='expired')return '已失效';
    return '待使用';
  }

  function inferCouponType(item){
    const explicitType=String(item&&item.couponType||item&&item.type||'').trim();
    if(explicitType)return explicitType;
    const text=String(item&&item.title||'');
    if(/立减/.test(text))return '立减';
    if(item&&item.discountRate)return '折扣';
    return '满减';
  }

  function getNumberValue(value,fallback){
    const number=Number(value);
    return Number.isFinite(number)?number:fallback;
  }

  function getCouponDisplayText(item){
    const couponType=inferCouponType(item);
    if(couponType==='折扣')return String(item&&item.discountRate||9)+'折';
    if(couponType==='立减')return '立减'+Number(item&&item.amount||0);
    return '满'+Number(item&&item.threshold||20)+'减'+Number(item&&item.amount||0);
  }

  function getThresholdLabel(item){
    const couponType=inferCouponType(item);
    const threshold=Number(item&&item.threshold||0);
    if(couponType==='立减'||threshold<=0)return '无门槛';
    return '满 ¥'+threshold.toFixed(0)+' 可用';
  }

  function normalizeCoupon(item,index){
    const rawId=(item&&item.id)||'';
    const merged={...(DEFAULT_COUPON_MAP[rawId]||{}),...(item||{})};
    const rawTitle=String(merged.title||'').trim();
    const titleLooksLikeBenefit=looksLikeBenefitText(rawTitle);
    const couponType=inferCouponType(merged);
    const name=merged.name||((rawTitle&&!titleLooksLikeBenefit&&rawTitle!=='优惠券名字')?rawTitle:'')||merged.source||'平台优惠券';
    const validFrom=merged.validFrom||merged.startsAt||'2026-04-01';
    const validTo=merged.validTo||merged.expiresAt||'2026-12-31';
    const threshold=couponType==='立减'?0:getNumberValue(merged.threshold,20);

    return {
      id:merged.id||('coupon-'+index),
      name:name,
      couponType:couponType,
      amount:getNumberValue(merged.amount,0),
      threshold:threshold,
      discountRate:getNumberValue(merged.discountRate,0),
      status:merged.status||'unused',
      validFrom:validFrom,
      validTo:validTo,
      expiresAt:validTo,
      useScope:merged.useScope||'全部服务项目',
      deductionScope:merged.deductionScope||'仅抵扣任务金额',
      stackable:merged.stackable===true,
      unavailableReason:merged.unavailableReason||'',
      source:merged.source||name,
      desc:merged.desc||'',
      usedAt:merged.usedAt||'',
      usedOrderId:merged.usedOrderId||'',
      usedOrderTitle:merged.usedOrderTitle||''
    };
  }

  function readCoupons(){
    try{
      const stored=JSON.parse(localStorage.getItem(STORAGE_KEY)||'[]');
      if(Array.isArray(stored)&&stored.length){
        const normalized=stored.map(normalizeCoupon);
        const existingIds=normalized.reduce(function(map,item){
          map[item.id]=true;
          return map;
        },{});
        DEFAULT_COUPONS.forEach(function(item,index){
          if(!existingIds[item.id]){
            normalized.push(normalizeCoupon(item,normalized.length+index));
          }
        });
        if(!normalized.some(function(item){return item.status==='unused';})){
          normalized.push(normalizeCoupon(DEMO_FALLBACK_COUPON,normalized.length));
        }
        localStorage.setItem(STORAGE_KEY,JSON.stringify(normalized));
        return normalized;
      }
    }catch(error){
    }
    const seeded=DEFAULT_COUPONS.map(normalizeCoupon);
    localStorage.setItem(STORAGE_KEY,JSON.stringify(seeded));
    return seeded;
  }

  function writeCoupons(list){
    localStorage.setItem(STORAGE_KEY,JSON.stringify(list.map(normalizeCoupon)));
  }

  function getCouponById(id){
    return readCoupons().find(function(item){return item.id===id;})||null;
  }

  function getCounts(){
    const list=readCoupons();
    return {
      unused:list.filter(function(item){return item.status==='unused';}).length,
      used:list.filter(function(item){return item.status==='used';}).length,
      expired:list.filter(function(item){return item.status==='expired';}).length
    };
  }

  function getEligibleCoupons(totalAmount){
    const total=Number(totalAmount||0);
    return readCoupons().filter(function(item){
      return item.status==='unused'&&item.threshold<=total;
    });
  }

  function markCouponUsed(id,meta){
    const list=readCoupons();
    const target=list.find(function(item){return item.id===id;});
    if(!target)return null;
    target.status='used';
    target.usedAt=(meta&&meta.usedAt)||new Date().toISOString().slice(0,10);
    target.usedOrderId=(meta&&meta.usedOrderId)||'';
    target.usedOrderTitle=(meta&&meta.usedOrderTitle)||'';
    writeCoupons(list);
    return normalizeCoupon(target);
  }

  window.BanxingCoupons={
    storageKey:STORAGE_KEY,
    read:readCoupons,
    write:writeCoupons,
    getById:getCouponById,
    counts:getCounts,
    eligible:getEligibleCoupons,
    markUsed:markCouponUsed,
    formatMoney:formatMoney,
    formatDate:formatDate,
    formatDateRange:formatDateRange,
    statusLabel:getStatusLabel,
    displayText:getCouponDisplayText,
    thresholdLabel:getThresholdLabel
  };
})();

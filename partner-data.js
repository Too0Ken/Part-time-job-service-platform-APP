(function(){
  const STORAGE_KEY='banxing.partnerCenter';
  const DEFAULT_SUBMITTED_AT='2026-04-16 18:20';
  const DEFAULT_APPROVED_AT='2026-04-13 11:00';
  const DEFAULT_REJECTED_AT='2026-04-22 15:30';
  const BILL_DATA_BY_MONTH=[
    {
      key:'2026-04',
      label:'2026年4月',
      amount:'¥198.00',
      status:'待结算 · 待后台确认入账',
      summary:[
        {num:'12',label:'有效订单数'},
        {num:'¥24',label:'退款回冲金额'},
        {num:'8.3%',label:'纠纷退款率'},
        {num:'8%',label:'当前分佣比例'}
      ],
      orders:[
        {
          id:'ORD-P-260401',
          title:'上门喂猫｜1 小时｜海淀区',
          user:'林同学',
          amount:'¥180',
          rate:'8%',
          income:'+¥14.40',
          zero:false,
          tags:['正常完成','待月度结算','优惠券抵扣 ¥2 不影响分佣基数']
        },
        {
          id:'ORD-P-260402',
          title:'健康陪诊｜半天｜东城区',
          user:'周阿姨',
          amount:'¥220',
          rate:'8%',
          income:'+¥17.60',
          zero:false,
          tags:['正常完成','已结算','无退款']
        },
        {
          id:'ORD-P-260403',
          title:'婚庆协助｜半天｜海淀区',
          user:'陈女士',
          amount:'¥300',
          rate:'8%',
          income:'¥0.00',
          zero:true,
          tags:['纠纷退款','退款金额 ¥300','收益已回冲']
        }
      ]
    },
    {
      key:'2026-03',
      label:'2026年3月',
      amount:'¥826.00',
      status:'待结算 · 待后台确认入账',
      summary:[
        {num:'32',label:'有效订单数'},
        {num:'¥90',label:'退款回冲金额'},
        {num:'12.5%',label:'纠纷退款率'},
        {num:'8%',label:'当前分佣比例'}
      ],
      orders:[
        {
          id:'ORD-P-2401',
          title:'上门喂猫｜1.5 小时｜海淀区',
          user:'林同学',
          amount:'¥120',
          rate:'8%',
          income:'+¥9.60',
          zero:false,
          tags:['正常完成','无退款','优惠券抵扣 ¥2 不影响分佣基数']
        },
        {
          id:'ORD-P-2402',
          title:'健康陪诊｜半天｜东城区',
          user:'周阿姨',
          amount:'¥200',
          rate:'8%',
          income:'+¥16.00',
          zero:false,
          tags:['正常完成','优惠券使用 ¥20','订单已结算']
        },
        {
          id:'ORD-P-2403',
          title:'婚庆协助｜全天｜海淀区',
          user:'陈女士',
          amount:'¥500',
          rate:'8%',
          income:'¥0.00',
          zero:true,
          tags:['纠纷退款','退款金额 ¥500','收益已回冲']
        },
        {
          id:'ORD-P-2404',
          title:'户外任务｜1 小时｜朝阳区',
          user:'刘同学',
          amount:'¥88',
          rate:'8%',
          income:'+¥7.04',
          zero:false,
          tags:['正常完成','优惠券抵扣 ¥1','待月度结算']
        }
      ]
    },
    {
      key:'2026-02',
      label:'2026年2月',
      amount:'¥462.00',
      status:'已结算 · 3月5日入钱包',
      summary:[
        {num:'18',label:'有效订单数'},
        {num:'¥0',label:'退款回冲金额'},
        {num:'0%',label:'纠纷退款率'},
        {num:'8%',label:'当前分佣比例'}
      ],
      orders:[
        {
          id:'ORD-P-2301',
          title:'户外任务｜1 小时｜朝阳区',
          user:'刘同学',
          amount:'¥88',
          rate:'8%',
          income:'+¥7.04',
          zero:false,
          tags:['正常完成','已结算','无退款']
        },
        {
          id:'ORD-P-2302',
          title:'上门喂猫｜1 小时｜海淀区',
          user:'林同学',
          amount:'¥160',
          rate:'8%',
          income:'+¥12.80',
          zero:false,
          tags:['正常完成','已结算','优惠券抵扣 ¥2']
        },
        {
          id:'ORD-P-2303',
          title:'健康陪诊｜半天｜东城区',
          user:'周阿姨',
          amount:'¥220',
          rate:'8%',
          income:'+¥17.60',
          zero:false,
          tags:['正常完成','已结算','无退款']
        }
      ]
    }
  ];
  const REFERRAL_RECORDS=[
    {
      userId:'BX26****1286',
      registeredAt:'2026-04-05 14:20',
      orderCount:'3次',
      commission:'¥41.60'
    },
    {
      userId:'BX26****5603',
      registeredAt:'2026-04-08 09:15',
      orderCount:'2次',
      commission:'¥26.40'
    },
    {
      userId:'BX26****7318',
      registeredAt:'2026-04-11 19:42',
      orderCount:'4次',
      commission:'¥58.80'
    },
    {
      userId:'BX26****4421',
      registeredAt:'2026-04-13 11:06',
      orderCount:'1次',
      commission:'¥12.00'
    }
  ];

  function clone(value){
    return JSON.parse(JSON.stringify(value));
  }

  function compactAmount(value){
    const text=String(value||'').trim();
    if(!text)return'--';
    return text.replace(/\.00$/,'');
  }

  function normalizeMediaImages(list){
    return (Array.isArray(list)?list:[])
      .map(function(item,index){
        if(typeof item==='string'){
          const name=String(item||'').trim()||('图片'+(index+1));
          return {id:'img-'+index,name:name,dataUrl:''};
        }
        const name=String(item&&item.name||item&&item.label||'').trim()||('图片'+(index+1));
        return {
          id:String(item&&item.id||'img-'+index),
          name:name,
          dataUrl:String(item&&item.dataUrl||item&&item.src||'').trim()
        };
      })
      .filter(function(item){
        return item.name||item.dataUrl;
      })
      .slice(0,6);
  }

  function normalizeApplication(application){
    const source=application&&typeof application==='object'?application:{};
    return {
      type:String(source.type||'个人').trim()||'个人',
      name:String(source.name||'').trim(),
      channel:String(source.channel||'').trim(),
      monthlyLeads:String(source.monthlyLeads||'').trim(),
      contact:String(source.contact||'').trim(),
      materials:String(source.materials||'').trim(),
      materialsImages:normalizeMediaImages(source.materialsImages||source.materialImages||[]),
      submittedAt:String(source.submittedAt||'').trim()
    };
  }

  function createNoneState(){
    return {
      status:'none',
      application:normalizeApplication({type:'个人'}),
      commission:{
        current:'',
        preview:'8%',
        settlementCycle:'每月5日生成账单，后台确认后入钱包',
        note:'审核通过后会按你的合作类型配置个人分佣比例，分佣仅按订单实收金额计算，不含打赏。'
      }
    };
  }

  function createPendingState(application){
    const current=normalizeApplication(application);
    const submittedAt=current.submittedAt||DEFAULT_SUBMITTED_AT;
    return {
      status:'pending',
      application:{
        ...current,
        submittedAt:submittedAt
      },
      review:{
        badge:'审核中',
        eta:'预计 3 个工作日内完成',
        desc:'已收到你的申请资料，审核通过后会自动开通拉新分佣、结算账单和资料管理。',
        steps:[
          {label:'提交申请',time:submittedAt,state:'done'},
          {label:'平台审核',time:'进行中',state:'current'},
          {label:'配置分佣',time:'待开始',state:'todo'},
          {label:'开通收益',time:'待开始',state:'todo'}
        ]
      },
      commission:{
        current:'待审核后配置',
        preview:'8%',
        settlementCycle:'每月5日生成账单，后台确认后入钱包',
        note:'审核通过后即可查看你的专属分佣比例。'
      }
    };
  }

  function createApprovedState(application){
    const current=normalizeApplication(application);
    const submittedAt=current.submittedAt||'2026-04-10 18:20';
    return {
      status:'approved',
      application:{
        type:current.type||'个人',
        name:current.name||'王小明',
        channel:current.channel||'校园社群 / 私域转介绍',
        monthlyLeads:current.monthlyLeads||'50人',
        contact:current.contact||'13800008888',
        materials:current.materials||'身份证明 / 渠道说明',
        materialsImages:current.materialsImages||[],
        submittedAt:submittedAt
      },
      review:{
        badge:'已通过',
        approvedAt:DEFAULT_APPROVED_AT,
        desc:'合伙人资格已生效，可邀请新用户注册并查看拉新分佣、结算账单和资料信息。'
      },
      commission:{
        current:'8%',
        preview:'8%',
        settlementCycle:'每月5日生成账单，后台确认后入钱包',
        note:'按有效完成订单实收金额分佣，退款或纠纷退款订单自动回冲对应收益，打赏不参与分佣。'
      },
      referral:{
        inviteCode:'BXHZ202604',
        inviteLink:'https://banxing.app/invite/BXHZ202604',
        tip:'邀请新用户注册并完成订单后，将按你的分佣比例计入月度结算账单。',
        stats:[
          {num:'6',label:'累计拉新用户'},
          {num:'14',label:'累计接单次数'},
          {num:'¥268.40',label:'累计带来佣金'}
        ],
        records:clone(REFERRAL_RECORDS)
      },
      settlement:{
        cycle:'每月5日生成账单，后台确认后入钱包',
        account:'平台余额',
        contact:current.contact||'13800008888',
        submittedAt:submittedAt,
        approvedAt:DEFAULT_APPROVED_AT
      },
      defaultBillMonth:'2026-04',
      bills:clone(BILL_DATA_BY_MONTH)
    };
  }

  function createRejectedState(application,review){
    const current=normalizeApplication(application);
    const submittedAt=current.submittedAt||DEFAULT_SUBMITTED_AT;
    const reviewSource=review&&typeof review==='object'?review:{};
    const rejectedAt=String(reviewSource.rejectedAt||DEFAULT_REJECTED_AT).trim()||DEFAULT_REJECTED_AT;
    const reason=String(reviewSource.reason||'推广渠道说明不完整，缺少稳定拉新证明材料。').trim()||'推广渠道说明不完整，缺少稳定拉新证明材料。';
    const nextAction=String(reviewSource.nextAction||'补充社群截图和渠道说明后重新提交').trim()||'补充社群截图和渠道说明后重新提交';
    return {
      status:'rejected',
      application:{
        ...current,
        submittedAt:submittedAt
      },
      review:{
        badge:'未通过',
        rejectedAt:rejectedAt,
        desc:'本次申请未通过，请根据驳回原因修改后重新申请。',
        reason:reason,
        nextAction:nextAction
      },
      commission:{
        current:'',
        preview:'8%',
        settlementCycle:'每月5日生成账单，后台确认后入钱包',
        note:'重新审核通过后才会开通实际分佣比例。'
      }
    };
  }

  function normalizeState(raw){
    const source=raw&&typeof raw==='object'?raw:{};
    const status=source.status;
    if(status==='approved')return createApprovedState(source.application);
    if(status==='pending')return createPendingState(source.application);
    if(status==='rejected')return createRejectedState(source.application,source.review);
    return createNoneState();
  }

  function readRaw(){
    try{
      return JSON.parse(localStorage.getItem(STORAGE_KEY)||'null');
    }catch(error){
      return null;
    }
  }

  function getState(){
    return normalizeState(readRaw());
  }

  function writeState(state){
    const next=normalizeState(state);
    localStorage.setItem(STORAGE_KEY,JSON.stringify(next));
    return next;
  }

  function saveApplication(application){
    return writeState({
      status:'pending',
      application:{
        ...normalizeApplication(application),
        submittedAt:(application&&application.submittedAt)||DEFAULT_SUBMITTED_AT
      }
    });
  }

  function syncMockState(mock){
    if(mock==='reset'){
      localStorage.removeItem(STORAGE_KEY);
      return getState();
    }
    if(mock==='pending'){
      return saveApplication({
        type:'个人',
        name:'王小明',
        channel:'校园社群 / 私域转介绍',
        monthlyLeads:'50人',
        contact:'13800008888',
        materials:'学生社群截图 / 推广方案',
        submittedAt:DEFAULT_SUBMITTED_AT
      });
    }
    if(mock==='approved'){
      const existing=getState();
      return writeState({
        status:'approved',
        application:{
          ...existing.application,
          name:existing.application.name||'王小明',
          channel:existing.application.channel||'校园社群 / 私域转介绍',
          monthlyLeads:existing.application.monthlyLeads||'50人',
          contact:existing.application.contact||'13800008888',
          materials:existing.application.materials||'身份证明 / 渠道说明',
          submittedAt:existing.application.submittedAt||'2026-04-10 18:20'
        }
      });
    }
    if(mock==='rejected'){
      const existing=getState();
      return writeState({
        status:'rejected',
        application:{
          ...existing.application,
          type:existing.application.type||'个人',
          name:existing.application.name||'王小明',
          channel:existing.application.channel||'校园社群 / 私域转介绍',
          monthlyLeads:existing.application.monthlyLeads||'50人',
          contact:existing.application.contact||'13800008888',
          materials:existing.application.materials||'学生社群截图 / 推广方案',
          submittedAt:existing.application.submittedAt||DEFAULT_SUBMITTED_AT
        },
        review:{
          rejectedAt:DEFAULT_REJECTED_AT,
          reason:'推广渠道说明不完整，缺少稳定拉新证明材料。',
          nextAction:'补充社群截图和渠道说明后重新提交'
        }
      });
    }
    return getState();
  }

  function getPendingBillCount(state){
    const current=state&&state.status==='approved'?state:getState();
    if(current.status!=='approved'||!Array.isArray(current.bills))return 0;
    return current.bills.filter(function(item){
      return !String(item&&item.status||'').includes('已结算');
    }).length;
  }

  function getProfileEntry(state){
    const current=state&&typeof state==='object'?state:getState();
    if(current.status==='approved'){
      const currentBill=getBillByMonth(current,current.defaultBillMonth);
      const amount=compactAmount(currentBill&&currentBill.amount||'');
      return {
        text:'合伙人中心',
        href:'partner-dashboard.html',
        metaText:'预估佣金 '+amount+' / 待确认 '+getPendingBillCount(current),
        tone:'approved',
        showDot:false
      };
    }
    if(current.status==='pending'){
      return {
        text:'合伙人中心',
        href:'partner-dashboard.html',
        metaText:'审核中',
        tone:'pending',
        showDot:true
      };
    }
    if(current.status==='rejected'){
      return {
        text:'合伙人中心',
        href:'partner-dashboard.html',
        metaText:'重新申请',
        tone:'rejected',
        showDot:true
      };
    }
    return {
      text:'合伙人中心',
      href:'partner-apply.html',
      metaText:'申请合伙人',
      tone:'none',
      showDot:false
    };
  }

  function getMetaText(){
    return getProfileEntry().metaText;
  }

  function getBillMonths(state){
    const current=state&&state.status==='approved'?state:getState();
    return Array.isArray(current.bills)?current.bills.map(function(item){
      return {key:item.key,label:item.label};
    }):[];
  }

  function getBillByMonth(state,monthKey){
    const current=state&&state.status==='approved'?state:getState();
    if(current.status!=='approved'||!Array.isArray(current.bills))return null;
    const fallback=current.defaultBillMonth||'';
    const target=String(monthKey||fallback).trim();
    return current.bills.find(function(item){return item.key===target;})||current.bills[0]||null;
  }

  window.BanxingPartner={
    storageKey:STORAGE_KEY,
    get:getState,
    write:writeState,
    saveApplication:saveApplication,
    syncMockState:syncMockState,
    getMetaText:getMetaText,
    getProfileEntry:getProfileEntry,
    getPendingBillCount:getPendingBillCount,
    getBillMonths:getBillMonths,
    getBillByMonth:getBillByMonth
  };
})();

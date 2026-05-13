(function(){
  const STORAGE_KEY='banxing.momentsState';
  const CURRENT_USER_ID='me';
  const DEFAULT_INTERESTS=['萌宠','户外','陪诊','校园'];
  const IMAGE_COLORS=['#dbeafe','#fee2e2','#dcfce7','#fef3c7','#ede9fe','#fce7f3','#cffafe','#e0f2fe','#f3e8ff'];
  const DEFAULT_AUTHORS=[
    {id:'zhang',name:'张小花',avatar:'张',credit:94,auth:{real:true,edu:true,skill:false},bio:'宠物服务爱好者，喜欢记录每次喂猫的小细节。',tags:['萌宠','上门喂养']},
    {id:'li',name:'李明',avatar:'李',credit:88,auth:{real:true,edu:false,skill:true},bio:'跑团领队，擅长轻户外与配速陪跑。',tags:['户外','陪跑']},
    {id:'wang',name:'王阿姨',avatar:'王',credit:95,auth:{real:true,edu:false,skill:false},bio:'陪诊经验丰富，擅长整理医嘱与流程提醒。',tags:['陪诊','细致']},
    {id:'zhou',name:'周老师',avatar:'周',credit:91,auth:{real:true,edu:false,skill:true},bio:'活动教练，常分享路线规划和安全提示。',tags:['户外','技能']},
    {id:'chen',name:'陈同学',avatar:'陈',credit:72,auth:{real:true,edu:true,skill:false},bio:'在校生，兼职记录和校园生活都会发。',tags:['校园','兼职']},
    {id:'qiao',name:'乔女士',avatar:'乔',credit:84,auth:{real:true,edu:false,skill:false},bio:'婚礼活动从业者，喜欢分享现场执行经验。',tags:['婚庆','现场']},
    {id:'sun',name:'孙先生',avatar:'孙',credit:89,auth:{real:true,edu:false,skill:false},bio:'活动组织者，关注效率和流程管理。',tags:['活动','执行']},
    {id:'han',name:'韩小姐',avatar:'韩',credit:58,auth:{real:true,edu:false,skill:false},bio:'最近在补信用分，偶尔分享生活。',tags:['生活']}
  ];
  const DEFAULT_COMPLETED_ORDERS=[
    {id:'P5',title:'周末喂猫（2天）',serviceName:'上门喂猫｜2天｜海淀区',taskTime:'2026-03-15 10:00',role:'我发的',finishedAt:'2026-03-15',amount:'¥90.00',location:'知春路',recordTag:'服务记录'},
    {id:'P7',title:'周末 8km 户外任务',serviceName:'户外任务｜1小时｜朝阳区',taskTime:'2026-04-09 07:00',role:'我发的',finishedAt:'2026-04-09',amount:'¥160.00',location:'奥森公园',recordTag:'服务记录'},
    {id:'A3',title:'北医三院陪诊，排队陪同+取药',serviceName:'健康陪诊｜3小时｜海淀区',taskTime:'2026-04-10 09:00',role:'我接的',finishedAt:'2026-04-10',amount:'¥150.00',location:'北医三院',recordTag:'服务记录'},
    {id:'A4',title:'婚礼迎宾与流程协助',serviceName:'婚庆协助｜半天｜海淀区',taskTime:'2026-04-10 08:00',role:'我接的',finishedAt:'2026-04-10',amount:'¥420.00',location:'海淀逸林酒店',recordTag:'服务记录'}
  ];
  const DEFAULT_MOMENT_NOTICES=[
    {
      id:'moment-notice-like',
      title:'张小花点赞了你的动态',
      createdAt:'2026-04-18T10:08:00+08:00',
      desc:'你关联了“周末 8km 户外任务”的动态获得了新的点赞，对方已收到你的最新内容更新。',
      tag:'新增点赞',
      actions:[{label:'查看我的主页',href:'my-home.html?tab=moments'},{label:'查看动态',href:'moments.html',primary:true}]
    },
    {
      id:'moment-notice-comment',
      title:'周老师评论了你的动态',
      createdAt:'2026-04-18T09:40:00+08:00',
      desc:'评论内容已通过审核并展示，你可以前往动态页继续回复互动。',
      tag:'评论已展示',
      actions:[{label:'查看我的主页',href:'my-home.html?tab=moments'},{label:'查看动态',href:'moments.html',primary:true}]
    },
    {
      id:'moment-notice-follow',
      title:'新关注提醒',
      createdAt:'2026-04-17T19:30:00+08:00',
      desc:'李明已关注你，后续你的公开动态会优先展示在对方的信息流中。',
      tag:'新增关注',
      actions:[{label:'查看关注列表',href:'following-list.html'},{label:'继续发动态',href:'moment-publish.html',primary:true}]
    },
    {
      id:'moment-notice-report',
      title:'举报处理结果通知',
      createdAt:'2026-04-17T17:10:00+08:00',
      desc:'你提交的举报已进入审核队列；若后续核实为恶意举报，将按规则处理举报者信用分。',
      tag:'举报处理中',
      actions:[{label:'查看我的主页',href:'my-home.html?tab=moments'},{label:'查看动态',href:'moments.html',primary:true}]
    }
  ];
  const DEFAULT_POSTS=[
    {
      id:'m-001',
      authorId:'zhang',
      text:'今天刚结束一单上门喂猫，猫咪从躲床底到主动蹭手，真的很有成就感。把门锁和补粮位置提前拍清楚，现场会顺很多。',
      images:[{label:'猫咪状态',color:'#dbeafe'},{label:'补粮记录',color:'#dcfce7'}],
      visibility:'public',
      tags:['萌宠','服务心得'],
      likes:32,
      likedByMe:false,
      likedUsers:[],
      createdAt:'2026-04-16T09:18:00+08:00',
      comments:[
        {id:'c-001',authorName:'王小明',authorId:'me',text:'这个记录方式很实用，下次我也这么做。',createdAt:'2026-04-16T09:30:00+08:00'},
        {id:'c-002',authorName:'李明',authorId:'li',text:'看起来猫咪适应得很快。',createdAt:'2026-04-16T09:40:00+08:00'}
      ],
      order:{id:'P5',title:'周末喂猫（2天）',finishedAt:'2026-03-15',role:'我发的'},
      moderation:'passed'
    },
    {
      id:'m-002',
      authorId:'zhou',
      text:'陪跑类任务我一般会提前把集合点、补给点和返程路线都画出来，服务前五分钟再复核一次天气，能少掉很多临场沟通成本。',
      images:[{label:'路线示意',color:'#fef3c7'}],
      visibility:'public',
      tags:['户外','路线规划'],
      likes:26,
      likedByMe:true,
      likedUsers:[],
      createdAt:'2026-04-16T08:52:00+08:00',
      comments:[
        {id:'c-003',authorName:'陈同学',authorId:'chen',text:'这个提醒太及时了。',createdAt:'2026-04-16T09:02:00+08:00'}
      ],
      moderation:'passed'
    },
    {
      id:'m-003',
      authorId:'li',
      text:'早上带单的时候顺手整理了一份 5km 陪跑热身清单，第一次接户外任务的同学可以按这个节奏走，基本不会乱。',
      images:[{label:'热身清单',color:'#ede9fe'},{label:'配速节奏',color:'#e0f2fe'},{label:'补给建议',color:'#fce7f3'}],
      visibility:'public',
      tags:['户外','技能展示'],
      likes:19,
      likedByMe:false,
      likedUsers:[],
      createdAt:'2026-04-15T22:36:00+08:00',
      comments:[],
      moderation:'passed'
    },
    {
      id:'m-004',
      authorId:'wang',
      text:'陪诊动态别只记流程，结束后把取药、复诊、缴费几个节点重新写一遍发给家属，对方会很安心。',
      images:[],
      visibility:'public',
      tags:['陪诊','服务心得'],
      likes:41,
      likedByMe:false,
      likedUsers:[],
      createdAt:'2026-04-15T21:14:00+08:00',
      comments:[
        {id:'c-004',authorName:'张小花',authorId:'zhang',text:'这点太重要了，特别适合新手。',createdAt:'2026-04-15T21:30:00+08:00'}
      ],
      moderation:'passed'
    },
    {
      id:'m-005',
      authorId:'chen',
      text:'下午在图书馆整理兼职排班表，发现把通勤时间也记进去以后，整周的接单节奏会稳定很多。',
      images:[{label:'排班草稿',color:'#cffafe'}],
      visibility:'public',
      tags:['校园','兼职'],
      likes:12,
      likedByMe:false,
      likedUsers:[],
      createdAt:'2026-04-15T19:50:00+08:00',
      comments:[],
      moderation:'passed'
    },
    {
      id:'m-006',
      authorId:'qiao',
      text:'婚礼现场最怕信息断层，我现在都会把对接人、时间节点和备选方案提前放进一个小卡片里，现场特别省心。',
      images:[{label:'流程卡片',color:'#fee2e2'},{label:'现场站位',color:'#f3e8ff'}],
      visibility:'public',
      tags:['婚庆','现场经验'],
      likes:29,
      likedByMe:false,
      likedUsers:[],
      createdAt:'2026-04-15T18:40:00+08:00',
      comments:[],
      moderation:'passed'
    },
    {
      id:'m-007',
      authorId:'sun',
      text:'最近发现把活动前确认事项做成固定模板之后，群里沟通量直接少了一半，尤其适合多人协作的单子。',
      images:[],
      visibility:'public',
      tags:['活动','效率'],
      likes:17,
      likedByMe:false,
      likedUsers:[],
      createdAt:'2026-04-15T17:10:00+08:00',
      comments:[],
      moderation:'passed'
    },
    {
      id:'m-008',
      authorId:'zhang',
      text:'给猫咪续单的时候我会把前一单留下来的服务记录一起翻出来，用户会明显感觉到你是连续跟进的。',
      images:[{label:'续单笔记',color:'#dbeafe'}],
      visibility:'followers',
      tags:['萌宠','复购'],
      likes:14,
      likedByMe:false,
      likedUsers:[],
      createdAt:'2026-04-15T16:05:00+08:00',
      comments:[],
      moderation:'passed'
    },
    {
      id:'m-009',
      authorId:'li',
      text:'今天把一条雨天备选路线重新走了一遍，事实证明提前想好撤退方案，急单的时候真的能救命。',
      images:[{label:'雨天路线',color:'#dcfce7'}],
      visibility:'public',
      tags:['户外','急单'],
      likes:23,
      likedByMe:true,
      likedUsers:[],
      createdAt:'2026-04-15T14:28:00+08:00',
      comments:[],
      moderation:'passed'
    },
    {
      id:'m-010',
      authorId:'wang',
      text:'有些陪诊用户会把检查单一起交给我，我会在结束后把关键项目单独标出来，方便家属回看。',
      images:[{label:'复诊提醒',color:'#fef3c7'}],
      visibility:'public',
      tags:['陪诊','细节'],
      likes:35,
      likedByMe:false,
      likedUsers:[],
      createdAt:'2026-04-15T12:18:00+08:00',
      comments:[],
      order:{id:'A3',title:'北医三院陪诊，排队陪同+取药',finishedAt:'2026-04-10',role:'我接的'},
      moderation:'passed'
    },
    {
      id:'m-011',
      authorId:'zhou',
      text:'做路线规划的时候别只看公里数，台阶和补给点数量也要一起考虑，不然很容易把难度估轻了。',
      images:[],
      visibility:'followers',
      tags:['户外','安全提示'],
      likes:21,
      likedByMe:false,
      likedUsers:[],
      createdAt:'2026-04-15T11:12:00+08:00',
      comments:[],
      moderation:'passed'
    },
    {
      id:'m-012',
      authorId:'qiao',
      text:'婚礼单结束后最好马上回写一次现场复盘，哪怕只记三条，下次遇到同类流程都会快很多。',
      images:[],
      visibility:'public',
      tags:['婚庆','复盘'],
      likes:16,
      likedByMe:false,
      likedUsers:[],
      createdAt:'2026-04-15T10:05:00+08:00',
      comments:[],
      moderation:'passed'
    },
    {
      id:'m-013',
      authorId:'chen',
      text:'分享一个省时间的小习惯：把每次接单的通勤时长记下来，排课和排班时就不用反复估了。',
      images:[],
      visibility:'public',
      tags:['校园','时间管理'],
      likes:13,
      likedByMe:false,
      likedUsers:[],
      createdAt:'2026-04-15T09:20:00+08:00',
      comments:[],
      moderation:'passed'
    },
    {
      id:'m-014',
      authorId:'sun',
      text:'活动类任务最怕群里消息太散，我会把最后版的时间表和联系人统一发一条置顶，现场节奏会稳很多。',
      images:[{label:'时间表',color:'#ede9fe'}],
      visibility:'public',
      tags:['活动','协作'],
      likes:11,
      likedByMe:false,
      likedUsers:[],
      createdAt:'2026-04-15T08:42:00+08:00',
      comments:[],
      moderation:'passed'
    },
    {
      id:'m-015',
      authorId:'han',
      text:'今天路过咖啡店顺手拍了张窗边，准备这周把状态慢慢调整回来。',
      images:[{label:'生活随拍',color:'#fce7f3'}],
      visibility:'public',
      tags:['生活'],
      likes:8,
      likedByMe:false,
      likedUsers:[],
      createdAt:'2026-04-14T21:05:00+08:00',
      comments:[],
      moderation:'passed'
    },
    {
      id:'m-016',
      authorId:'wang',
      text:'陪诊单如果有关联检查，结束后提醒一下家属后续注意事项，通常会让整次体验完整很多。',
      images:[],
      visibility:'public',
      tags:['陪诊','关怀'],
      likes:22,
      likedByMe:false,
      likedUsers:[],
      createdAt:'2026-04-14T18:52:00+08:00',
      comments:[],
      moderation:'passed'
    },
    {
      id:'m-017',
      authorId:'me',
      text:'把上周那单 8km 户外任务的路线和补给节奏复盘了一下，发现提前写好集合口令真的能少走很多弯路。',
      images:[{label:'路线复盘',color:'#dbeafe'},{label:'补给节奏',color:'#dcfce7'}],
      visibility:'public',
      tags:['户外','复盘'],
      likes:5,
      likedByMe:false,
      likedUsers:[
        {id:'zhang',name:'张小花',avatar:'张'},
        {id:'zhou',name:'周老师',avatar:'周'},
        {id:'li',name:'李明',avatar:'李'},
        {id:'wang',name:'王阿姨',avatar:'王'},
        {id:'qiao',name:'乔女士',avatar:'乔'}
      ],
      createdAt:'2026-04-14T16:20:00+08:00',
      comments:[
        {id:'c-005',authorName:'周老师',authorId:'zhou',text:'这条复盘很完整。',createdAt:'2026-04-14T16:35:00+08:00'}
      ],
      order:{id:'P7',title:'周末 8km 户外任务',finishedAt:'2026-04-09',role:'我发的'},
      moderation:'passed'
    },
    {
      id:'m-018',
      authorId:'li',
      text:'最近带了几次新手陪跑，发现“先把节奏放慢半档”这条建议比什么都有效，尤其适合第一次接户外任务的人。',
      images:[],
      visibility:'public',
      tags:['户外','新手建议'],
      likes:15,
      likedByMe:false,
      likedUsers:[],
      createdAt:'2026-04-14T14:06:00+08:00',
      comments:[],
      moderation:'passed'
    }
  ];

  function clone(value){
    return JSON.parse(JSON.stringify(value));
  }

  function escapeArray(source){
    return Array.isArray(source)?source.filter(Boolean).map(function(item){return String(item).trim();}).filter(Boolean):[];
  }

  function toNumber(value,fallback){
    const num=Number(value);
    return Number.isFinite(num)?num:fallback;
  }

  function uniqueList(list,max){
    const limit=typeof max==='number'?max:Infinity;
    return (Array.isArray(list)?list:[])
      .map(function(item){return String(item||'').trim();})
      .filter(Boolean)
      .filter(function(item,index,source){return source.indexOf(item)===index;})
      .slice(0,limit);
  }

  function normalizeKeywordList(value,max){
    if(Array.isArray(value))return uniqueList(value,max);
    if(typeof value==='string'){
      return uniqueList(value.split(/[｜|/、,，]+/),max);
    }
    return [];
  }

  function getSavedPersonalInfo(rawProfile){
    const source=rawProfile&&rawProfile.personalInfo&&typeof rawProfile.personalInfo==='object'
      ?rawProfile.personalInfo
      :{};
    return {
      bio:String(source.bio||'').trim(),
      serviceDirection:normalizeKeywordList(source.serviceDirectionText||source.serviceDirection,5),
      personalTags:normalizeKeywordList(source.personalTagsText||source.personalTags,5)
    };
  }

  function getSavedProfile(){
    let profile=null;
    try{
      profile=JSON.parse(localStorage.getItem('sharedProfileState')||'null');
    }catch(error){
      profile=null;
    }
    const nickname=profile&&profile.nickname?String(profile.nickname).trim():'王小明';
    const avatarText=profile&&profile.avatarText?String(profile.avatarText).trim():nickname.slice(0,1);
    const credit=Math.max(0,toNumber(profile&&profile.credit,92));
    return {
      raw:profile&&typeof profile==='object'?profile:{},
      nickname:nickname||'王小明',
      avatarText:avatarText||'王',
      credit:credit
    };
  }

  function saveProfileCredit(nextCredit){
    const profile=getSavedProfile();
    const next={
      ...profile.raw,
      nickname:profile.nickname,
      avatarText:profile.avatarText||profile.nickname.slice(0,1),
      credit:Math.max(0,Math.round(nextCredit))
    };
    localStorage.setItem('sharedProfileState',JSON.stringify(next));
    return next.credit;
  }

  function getAuthState(){
    try{
      return JSON.parse(localStorage.getItem('authState')||'{}')||{};
    }catch(error){
      return {};
    }
  }

  function getCurrentUser(){
    const profile=getSavedProfile();
    const auth=getAuthState();
    const personalInfo=getSavedPersonalInfo(profile.raw);
    const tags=uniqueList(personalInfo.serviceDirection.concat(personalInfo.personalTags),5);
    return {
      id:CURRENT_USER_ID,
      name:profile.nickname,
      avatar:profile.avatarText||profile.nickname.slice(0,1),
      credit:profile.credit,
      auth:{
        real:!!auth.realnameVerified,
        edu:!!auth.eduVerified,
        skill:!!auth.skillCertVerified
      },
      bio:personalInfo.bio||'伴行认证用户',
      tags:tags.length?tags:clone(DEFAULT_INTERESTS)
    };
  }

  function normalizeImage(image,index){
    const source=image&&typeof image==='object'?image:{};
    return {
      id:String(source.id||('img-'+index)),
      label:String(source.label||'图片').trim()||'图片',
      color:String(source.color||IMAGE_COLORS[index%IMAGE_COLORS.length]),
      failed:!!source.failed
    };
  }

  function normalizeVideo(video){
    if(!video||typeof video!=='object')return null;
    const label=String(video.label||'视频').trim()||'视频';
    return {
      id:String(video.id||'video-1'),
      label:label,
      size:Math.max(0,toNumber(video.size,0))
    };
  }

  function normalizeComment(comment,index){
    const source=comment&&typeof comment==='object'?comment:{};
    return {
      id:String(source.id||('comment-'+index)),
      authorName:String(source.authorName||'用户').trim()||'用户',
      authorId:String(source.authorId||'guest').trim()||'guest',
      text:String(source.text||'').trim(),
      createdAt:String(source.createdAt||new Date().toISOString()),
      replyTo:String(source.replyTo||'').trim()
    };
  }

  function getDefaultCompletedOrder(orderId){
    const target=String(orderId||'').trim().toUpperCase();
    if(!target)return null;
    return DEFAULT_COMPLETED_ORDERS.find(function(item){return item.id===target;})||null;
  }

  function normalizeOrder(order){
    if(!order||typeof order!=='object')return null;
    const id=String(order.id||'').trim().toUpperCase();
    const defaultOrder=getDefaultCompletedOrder(id);
    const serviceName=String(
      (defaultOrder&&defaultOrder.serviceName)||
      order.serviceName||
      order.title||
      ''
    ).trim();
    const taskTime=String(
      order.taskTime||
      order.time||
      order.finishedAt||
      (defaultOrder&&defaultOrder.taskTime)||
      ''
    ).trim();
    return {
      id:id,
      title:String(order.title||(defaultOrder&&defaultOrder.title)||'').trim(),
      serviceName:serviceName,
      taskTime:taskTime,
      finishedAt:String(order.finishedAt||(defaultOrder&&defaultOrder.finishedAt)||'').trim(),
      time:taskTime,
      location:String(order.location||(defaultOrder&&defaultOrder.location)||'').trim(),
      role:String(order.role||(defaultOrder&&defaultOrder.role)||'').trim(),
      amount:String(order.amount||(defaultOrder&&defaultOrder.amount)||'').trim()
    };
  }

  function normalizePost(post,index){
    const source=post&&typeof post==='object'?post:{};
    return {
      id:String(source.id||('moment-'+index)),
      authorId:String(source.authorId||'zhang').trim()||'zhang',
      text:String(source.text||'').trim(),
      images:(Array.isArray(source.images)?source.images:[]).map(normalizeImage),
      video:normalizeVideo(source.video),
      visibility:['public','followers','self'].includes(source.visibility)?source.visibility:'public',
      tags:escapeArray(source.tags),
      likes:Math.max(0,toNumber(source.likes,0)),
      likedByMe:!!source.likedByMe,
      likedUsers:Array.isArray(source.likedUsers)?source.likedUsers.map(function(item,likedIndex){
        const likedSource=item&&typeof item==='object'?item:{};
        return {
          id:String(likedSource.id||('liked-'+likedIndex)).trim()||('liked-'+likedIndex),
          name:String(likedSource.name||'伴行用户').trim()||'伴行用户',
          avatar:String(likedSource.avatar||String(likedSource.name||'伴').slice(0,1)).trim()||'伴'
        };
      }):[],
      createdAt:String(source.createdAt||new Date().toISOString()),
      comments:(Array.isArray(source.comments)?source.comments:[]).map(normalizeComment),
      order:normalizeOrder(source.order),
      moderation:source.moderation==='passed'?'passed':'blocked'
    };
  }

  function normalizeCreatorItem(item,index){
    const source=item&&typeof item==='object'?item:{};
    return {
      id:String(source.id||('creator-'+index)),
      postId:String(source.postId||'').trim(),
      title:String(source.title||'我的动态').trim()||'我的动态',
      status:['published','manual_review','removed'].includes(source.status)?source.status:'published',
      submittedAt:String(source.submittedAt||new Date().toISOString()),
      note:String(source.note||'').trim(),
      visibility:['public','followers','self'].includes(source.visibility)?source.visibility:'public'
    };
  }

  function buildDefaultState(){
    return {
      followingIds:['zhang','zhou'],
      blockedIds:[],
      reports:[],
      creatorItems:[],
      posts:clone(DEFAULT_POSTS).map(normalizePost)
    };
  }

  function normalizeState(raw){
    const source=raw&&typeof raw==='object'?raw:{};
    const defaults=buildDefaultState();
    return {
      followingIds:escapeArray(source.followingIds).filter(function(id){return id!==CURRENT_USER_ID;}),
      blockedIds:escapeArray(source.blockedIds).filter(function(id){return id!==CURRENT_USER_ID;}),
      reports:Array.isArray(source.reports)?source.reports.map(function(item,index){
        const row=item&&typeof item==='object'?item:{};
        return {
          id:String(row.id||('report-'+index)),
          postId:String(row.postId||'').trim(),
          authorId:String(row.authorId||'').trim(),
          reason:String(row.reason||'违规内容').trim(),
          description:String(row.description||'').trim(),
          images:Array.isArray(row.images)?row.images.map(normalizeImage).slice(0,5):[],
          createdAt:String(row.createdAt||new Date().toISOString())
        };
      }):defaults.reports,
      creatorItems:Array.isArray(source.creatorItems)?source.creatorItems.map(normalizeCreatorItem):defaults.creatorItems,
      posts:Array.isArray(source.posts)&&source.posts.length?source.posts.map(normalizePost):defaults.posts
    };
  }

  function readState(){
    try{
      return normalizeState(JSON.parse(localStorage.getItem(STORAGE_KEY)||'null'));
    }catch(error){
      return buildDefaultState();
    }
  }

  function writeState(state){
    const next=normalizeState(state);
    localStorage.setItem(STORAGE_KEY,JSON.stringify(next));
    return next;
  }

  function mutateState(mutator){
    const draft=readState();
    const next=mutator(clone(draft))||draft;
    return writeState(next);
  }

  function getAuthors(){
    const me=getCurrentUser();
    return DEFAULT_AUTHORS.concat([me]);
  }

  function getAuthorMap(){
    return getAuthors().reduce(function(map,item){
      map[item.id]=item;
      return map;
    },{});
  }

  function getAuthorById(authorId){
    return getAuthorMap()[authorId]||null;
  }

  function findAuthorByName(name){
    const target=String(name||'').trim();
    if(!target)return null;
    return getAuthors().find(function(item){return item.name===target;})||null;
  }

  function formatTimeLabel(input){
    const date=new Date(input);
    if(Number.isNaN(date.getTime()))return '刚刚';
    const now=new Date();
    const diffMs=now-date;
    const diffMinutes=Math.floor(diffMs/60000);
    if(diffMinutes<1)return '刚刚';
    if(diffMinutes<60)return diffMinutes+'分钟前';
    const diffHours=Math.floor(diffMinutes/60);
    if(diffHours<24&&now.getDate()===date.getDate())return diffHours+'小时前';
    const month=date.getMonth()+1;
    const day=date.getDate();
    const hours=String(date.getHours()).padStart(2,'0');
    const minutes=String(date.getMinutes()).padStart(2,'0');
    return month+'月'+day+'日 '+hours+':'+minutes;
  }

  function getVisibilityLabel(visibility){
    const labels={
      public:'公开',
      followers:'仅关注者',
      self:'仅自己'
    };
    return labels[visibility]||labels.public;
  }

  function getViewerInterests(){
    return DEFAULT_INTERESTS.slice();
  }

  function getRecommendScore(post,author){
    const interests=getViewerInterests();
    const postTags=escapeArray(post.tags).concat(escapeArray(author&&author.tags));
    const overlap=postTags.filter(function(tag){return interests.includes(tag);}).length;
    return overlap*10+Math.min(post.likes,50);
  }

  function getResolvedLikedUsers(post){
    const source=Array.isArray(post&&post.likedUsers)?post.likedUsers.slice():[];
    if(source.length)return source;
    const authorId=post&&post.authorId?post.authorId:'';
    const fallback=getAuthors()
      .filter(function(item){return item.id!==authorId;})
      .slice(0,Math.min(Math.max(0,toNumber(post&&post.likes,0)),5))
      .map(function(item){
        return {id:item.id,name:item.name,avatar:item.avatar};
      });
    return fallback;
  }

  function canSeePost(post,state){
    const isMine=post.authorId===CURRENT_USER_ID;
    if(state.blockedIds.includes(post.authorId))return false;
    if(post.visibility==='self'&&!isMine)return false;
    if(post.visibility==='followers'&&!isMine&&!state.followingIds.includes(post.authorId))return false;
    if(post.moderation!=='passed')return false;
    return true;
  }

  function enrichPost(post,state){
    const author=getAuthorById(post.authorId);
    return {
      ...post,
      author:author,
      likedUsers:getResolvedLikedUsers(post),
      timeLabel:formatTimeLabel(post.createdAt),
      commentCount:post.comments.length,
      recommendScore:getRecommendScore(post,author)
    };
  }

  function getFeed(view){
    const state=readState();
    let list=state.posts
      .filter(function(post){return canSeePost(post,state);})
      .map(function(post){return enrichPost(post,state);});
    if(view==='following'){
      list=list.filter(function(post){return state.followingIds.includes(post.authorId);});
      return list.sort(function(a,b){
        return new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime();
      });
    }
    list=list.filter(function(post){
      const isFollowed=state.followingIds.includes(post.authorId);
      const authorCredit=post.author?toNumber(post.author.credit,0):0;
      return isFollowed||authorCredit>=60||post.authorId===CURRENT_USER_ID;
    });
    return list.sort(function(a,b){
      const aFollowed=state.followingIds.includes(a.authorId);
      const bFollowed=state.followingIds.includes(b.authorId);
      if(aFollowed!==bFollowed)return aFollowed?-1:1;
      if(a.recommendScore!==b.recommendScore)return b.recommendScore-a.recommendScore;
      return new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime();
    });
  }

  function getCompletedOrders(){
    return clone(DEFAULT_COMPLETED_ORDERS);
  }

  function getPublishGate(){
    const auth=getAuthState();
    const profile=getSavedProfile();
    const blockers=[];
    if(['banned','frozen'].includes(auth.accountStatus)){
      const isFrozen=auth.accountStatus==='frozen';
      const backHref=location.pathname.split('/').pop()+location.search;
      blockers.push({
        type:auth.accountStatus,
        title:isFrozen?'账号已冻结':'账号已封禁',
        desc:(isFrozen?'账号冻结期间':'账号封禁期间')+'不可发布动态。你可以先查看账号状态或提交解封申诉。',
        href:'account-ban-appeal.html?from=moment-publish&back='+encodeURIComponent(backHref),
        action:'去申诉'
      });
    }
    if(!auth.realnameVerified){
      blockers.push({
        type:'realname',
        title:'需完成实名认证',
        desc:'实名认证用户才可以发布动态、关联服务记录并参与评论互动。',
        href:'realname-auth.html',
        action:'去实名认证'
      });
    }
    if(profile.credit<60){
      blockers.push({
        type:'credit',
        title:'信用分需达到 60 分',
        desc:'当前信用分低于动态发布门槛，需先恢复信用分后再发布内容。',
        href:'credit-score.html',
        action:'查看信用分'
      });
    }
    return {
      allowed:blockers.length===0,
      blockers:blockers,
      credit:profile.credit,
      auth:{
        real:!!auth.realnameVerified,
        edu:!!auth.eduVerified,
        skill:!!auth.skillCertVerified
      }
    };
  }

  function classifyContent(text,auditMode){
    const source=String(text||'').trim();
    if(auditMode==='ai_offline'){
      return {status:'audit_blocked',note:'内容审核处理中，请稍后重试。已为你保留本地草稿。'};
    }
    if(auditMode==='manual_review'){
      return {status:'manual_review',note:'AI标记为疑似违规，已转人工审核，预计 24 小时内处理。'};
    }
    if(auditMode==='violation'){
      return {status:'removed',note:'人工确认违规，动态已删除，并按规则扣减信用分。',penalty:8};
    }
    if(/微信|vx|VX|手机号|电话|联系我|广告|刷单|返利/.test(source)){
      return {status:'manual_review',note:'正文疑似包含广告或联系方式，已转人工审核。'};
    }
    if(/政治|涉黄|赌博|博彩|情色|敏感言论/.test(source)){
      return {status:'removed',note:'检测到明显违规内容，动态已删除。',penalty:10};
    }
    return {status:'passed',note:'AI审核通过，动态已展示。'};
  }

  function buildPostTitle(text,images){
    const title=String(text||'').trim();
    if(title)return title.slice(0,24);
    if(Array.isArray(images)&&images.length)return images[0].label||'图片动态';
    return '新的动态';
  }

  function createPost(payload){
    const gate=getPublishGate();
    if(!gate.allowed){
      return {ok:false,status:'blocked',message:gate.blockers[0]?gate.blockers[0].desc:'当前不可发布'};
    }
    const text=String(payload&&payload.text||'').trim();
    const images=(payload&&Array.isArray(payload.images)?payload.images:[]).map(normalizeImage).filter(function(item){return !item.failed;});
    const video=normalizeVideo(payload&&payload.video);
    const visibility=['public','followers','self'].includes(payload&&payload.visibility)?payload.visibility:'public';
    const order=normalizeOrder(payload&&payload.order);
    const auditMode=String(payload&&payload.auditMode||'normal');
    const moderation=classifyContent(text,auditMode);
    if(moderation.status==='audit_blocked'){
      return {ok:false,status:'audit_blocked',message:moderation.note};
    }
    const now=new Date().toISOString();
    const title=buildPostTitle(text,images);
    if(moderation.status==='removed'){
      const nextCredit=saveProfileCredit(getSavedProfile().credit-(moderation.penalty||8));
      mutateState(function(state){
        state.creatorItems.unshift({
          id:'creator-'+Date.now(),
          postId:'',
          title:title,
          status:'removed',
          submittedAt:now,
          visibility:visibility,
          note:(moderation.note||'动态已删除')+' 当前信用分 '+nextCredit+'。'
        });
        return state;
      });
      return {ok:true,status:'removed',message:moderation.note,credit:nextCredit};
    }
    const postId='moment-'+Date.now();
    if(moderation.status==='manual_review'){
      mutateState(function(state){
        state.creatorItems.unshift({
          id:'creator-'+postId,
          postId:postId,
          title:title,
          status:'manual_review',
          submittedAt:now,
          visibility:visibility,
          note:moderation.note
        });
        return state;
      });
      return {ok:true,status:'manual_review',message:moderation.note};
    }
    const post={
      id:postId,
      authorId:CURRENT_USER_ID,
      text:text,
      images:images,
      video:video,
      visibility:visibility,
      tags:escapeArray(payload&&payload.tags),
      likes:0,
      likedByMe:false,
      likedUsers:[],
      createdAt:now,
      comments:[],
      order:order,
      moderation:'passed'
    };
    mutateState(function(state){
      state.posts.unshift(post);
      state.creatorItems.unshift({
        id:'creator-'+postId,
        postId:postId,
        title:title,
        status:'published',
        submittedAt:now,
        visibility:visibility,
        note:moderation.note
      });
      return state;
    });
    return {ok:true,status:moderation.status,message:moderation.note,postId:postId};
  }

  function toggleLike(postId){
    let updated=null;
    mutateState(function(state){
      state.posts=state.posts.map(function(post){
        if(post.id!==postId)return post;
        const liked=!post.likedByMe;
        updated={
          likedByMe:liked,
          likes:Math.max(0,post.likes+(liked?1:-1))
        };
        const me=getCurrentUser();
        const likedUsers=Array.isArray(post.likedUsers)?post.likedUsers.slice():[];
        updated.likedUsers=liked
          ?likedUsers.concat([{id:CURRENT_USER_ID,name:me.name,avatar:me.avatar}]).filter(function(item,index,list){
              return list.findIndex(function(row){return row.id===item.id;})===index;
            })
          :likedUsers.filter(function(item){return item.id!==CURRENT_USER_ID;});
        updated.likes=updated.likedUsers.length&&post.authorId===CURRENT_USER_ID?updated.likedUsers.length:updated.likes;
        return {
          ...post,
          likedByMe:updated.likedByMe,
          likes:updated.likes,
          likedUsers:updated.likedUsers
        };
      });
      return state;
    });
    return updated;
  }

  function addComment(postId,text,replyTo){
    const content=String(text||'').trim();
    if(!content)return {ok:false,status:'empty',message:'请输入评论内容'};
    if(content.length>200)return {ok:false,status:'too_long',message:'评论最多 200 字'};
    const moderation=classifyContent(content,'normal');
    if(moderation.status==='removed'){
      return {ok:false,status:'removed',message:'评论包含明显违规内容，已拦截'};
    }
    if(moderation.status==='manual_review'){
      return {ok:true,status:'manual_review',message:'评论已进入人工审核，审核通过后展示'};
    }
    const me=getCurrentUser();
    const comment={
      id:'comment-'+Date.now(),
      authorName:me.name,
      authorId:CURRENT_USER_ID,
      text:content,
      createdAt:new Date().toISOString(),
      replyTo:String(replyTo||'').trim()
    };
    mutateState(function(state){
      state.posts=state.posts.map(function(post){
        if(post.id!==postId)return post;
        return {
          ...post,
          comments:[comment].concat(post.comments||[])
        };
      });
      return state;
    });
    return {ok:true,status:'passed',message:'评论已发布',comment:comment};
  }

  function toggleFollow(authorId,forceValue){
    if(!authorId||authorId===CURRENT_USER_ID)return {followed:false};
    let followed=false;
    mutateState(function(state){
      const exists=state.followingIds.includes(authorId);
      followed=typeof forceValue==='boolean'?forceValue:!exists;
      state.followingIds=followed
        ?state.followingIds.concat([authorId]).filter(function(id,index,list){return list.indexOf(id)===index;})
        :state.followingIds.filter(function(id){return id!==authorId;});
      return state;
    });
    return {followed:followed};
  }

  function toggleBlock(authorId,forceValue){
    if(!authorId||authorId===CURRENT_USER_ID)return {blocked:false};
    let blocked=false;
    mutateState(function(state){
      const exists=state.blockedIds.includes(authorId);
      blocked=typeof forceValue==='boolean'?forceValue:!exists;
      state.blockedIds=blocked
        ?state.blockedIds.concat([authorId]).filter(function(id,index,list){return list.indexOf(id)===index;})
        :state.blockedIds.filter(function(id){return id!==authorId;});
      if(blocked){
        state.followingIds=state.followingIds.filter(function(id){return id!==authorId;});
      }
      return state;
    });
    return {blocked:blocked};
  }

  function blockAuthorByName(name){
    const author=findAuthorByName(name);
    if(!author)return {blocked:false};
    return toggleBlock(author.id,true);
  }

  function reportPost(postId,reportPayload){
    const payload=typeof reportPayload==='object'&&reportPayload?reportPayload:{reason:reportPayload};
    const state=mutateState(function(draft){
      const post=draft.posts.find(function(item){return item.id===postId;});
      draft.reports.unshift({
        id:'report-'+Date.now(),
        postId:postId,
        authorId:post?post.authorId:'',
        reason:String(payload.reason||'违规内容').trim()||'违规内容',
        description:String(payload.description||'').trim(),
        images:(Array.isArray(payload.images)?payload.images:[]).map(normalizeImage).filter(function(item){return !item.failed;}).slice(0,5),
        createdAt:new Date().toISOString()
      });
      return draft;
    });
    return {ok:true,status:'queued',count:state.reports.length};
  }

  function listFollowing(){
    const state=readState();
    return state.followingIds.map(getAuthorById).filter(Boolean);
  }

  function listFollowers(){
    const state=readState();
    const followerIds=[];
    state.posts.forEach(function(post){
      if(post.authorId!==CURRENT_USER_ID)return;
      (post.likedUsers||[]).forEach(function(user){
        if(user&&user.id&&user.id!==CURRENT_USER_ID&&!followerIds.includes(user.id))followerIds.push(user.id);
      });
      (post.comments||[]).forEach(function(comment){
        if(comment&&comment.authorId&&comment.authorId!==CURRENT_USER_ID&&!followerIds.includes(comment.authorId))followerIds.push(comment.authorId);
      });
    });
    return followerIds.map(getAuthorById).filter(Boolean);
  }

  function listBlocked(){
    const state=readState();
    return state.blockedIds.map(getAuthorById).filter(Boolean);
  }

  function getBlockedNames(){
    return listBlocked().map(function(item){return item.name;});
  }

  function getLatestPostByAuthor(authorId){
    const state=readState();
    const post=state.posts
      .filter(function(item){
        return item.authorId===authorId&&item.moderation==='passed';
      })
      .sort(function(a,b){
        return new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime();
      })[0]||null;
    return post?enrichPost(post,state):null;
  }

  function getAuthorPosts(authorId){
    const state=readState();
    return state.posts
      .filter(function(item){
        return item.authorId===authorId&&canSeePost(item,state);
      })
      .map(function(item){
        return enrichPost(item,state);
      })
      .sort(function(a,b){
        return new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime();
      });
  }

  function getPostById(postId){
    const state=readState();
    const post=state.posts.find(function(item){return item.id===postId;})||null;
    return post?enrichPost(post,state):null;
  }

  function getCreatorItems(){
    return readState().creatorItems
      .slice()
      .sort(function(a,b){
        return new Date(b.submittedAt).getTime()-new Date(a.submittedAt).getTime();
      })
      .map(function(item){
        return {
          ...item,
          timeLabel:formatTimeLabel(item.submittedAt)
        };
      });
  }

  function updatePostVisibility(postId,visibility){
    if(!postId||!['public','followers','self'].includes(visibility)){
      return {ok:false,message:'可见范围无效'};
    }
    let updatedPost=null;
    mutateState(function(state){
      state.posts=state.posts.map(function(post){
        if(post.id!==postId)return post;
        updatedPost={
          ...post,
          visibility:visibility
        };
        return updatedPost;
      });
      state.creatorItems=state.creatorItems.map(function(item){
        if(item.postId!==postId)return item;
        return {
          ...item,
          visibility:visibility
        };
      });
      return state;
    });
    if(!updatedPost)return {ok:false,message:'动态不存在'};
    return {
      ok:true,
      message:'可见范围已改为'+getVisibilityLabel(visibility),
      post:getPostById(postId)
    };
  }

  function getMomentNotifications(){
    const failureItems=getCreatorItems()
      .filter(function(item){return item.status==='removed';})
      .map(function(item){
        return {
          id:'moment-fail-'+item.id,
          title:'动态审核未通过，发布失败',
          createdAt:item.submittedAt,
          time:item.timeLabel,
          desc:item.note||'本条动态因审核未通过，未能成功发布。',
          tag:'发布失败',
          actions:[
            {label:'查看我的主页',href:'my-home.html?tab=moments'},
            {label:'继续发动态',href:'moment-publish.html',primary:true}
          ]
        };
      });
    const staticItems=clone(DEFAULT_MOMENT_NOTICES).map(function(item){
      return {
        ...item,
        time:formatTimeLabel(item.createdAt)
      };
    });
    return failureItems.concat(staticItems).sort(function(a,b){
      return new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime();
    });
  }

  function reset(){
    localStorage.removeItem(STORAGE_KEY);
    return buildDefaultState();
  }

  window.BanxingMoments={
    storageKey:STORAGE_KEY,
    getState:readState,
    writeState:writeState,
    reset:reset,
    getCurrentUser:getCurrentUser,
    getFeed:getFeed,
    getCompletedOrders:getCompletedOrders,
    getPublishGate:getPublishGate,
    createPost:createPost,
    toggleLike:toggleLike,
    addComment:addComment,
    toggleFollow:toggleFollow,
    toggleBlock:toggleBlock,
    blockAuthorByName:blockAuthorByName,
    reportPost:reportPost,
    listFollowing:listFollowing,
    listFollowers:listFollowers,
    listBlocked:listBlocked,
    getBlockedNames:getBlockedNames,
    getLatestPostByAuthor:getLatestPostByAuthor,
    getAuthorPosts:getAuthorPosts,
    getPostById:getPostById,
    getCreatorItems:getCreatorItems,
    updatePostVisibility:updatePostVisibility,
    getVisibilityLabel:getVisibilityLabel,
    getMomentNotifications:getMomentNotifications,
    getAuthorById:getAuthorById,
    findAuthorByName:findAuthorByName,
    formatTimeLabel:formatTimeLabel
  };
})();

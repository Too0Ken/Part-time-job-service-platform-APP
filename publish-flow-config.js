(function(){
  const STORAGE_KEY='publishDraft';
  const categories=[
    {key:'common',icon:'⭐',name:'常用任务',desc:'高频发布任务快捷入口'},
    {key:'skill',icon:'🧠',name:'技能类',desc:'线上交付、知识辅导与内容输出'},
    {key:'physical',icon:'💪',name:'体能类',desc:'跑腿、排队、陪跑等即时体力任务'},
    {key:'professional',icon:'🩺',name:'专业服务类',desc:'需明确流程或专业配合的服务'},
    {key:'activity',icon:'🎉',name:'活动协助类',desc:'婚庆、展会、拍摄等现场协作'},
    {key:'life',icon:'🏠',name:'生活服务类',desc:'搬运、清洁、收纳等居家任务'},
    {key:'companion',icon:'🤝',name:'陪伴照护类',desc:'陪伴、接送、宠物与照护支持'}
  ];

  const validityOptions=[
    {hours:2,label:'2小时'},
    {hours:6,label:'6小时'},
    {hours:12,label:'12小时'},
    {hours:24,label:'24小时'},
    {hours:48,label:'48小时'}
  ];
  const commonProjectKeys=['errand','queue','ppt','tutoring','cat_care','moving_help'];

  const projects=[
    {
      key:'ppt',
      categoryKey:'skill',
      orderTypeKey:'health',
      icon:'📊',
      name:'做PPT',
      summary:'新做、改稿、排版美化',
      avgRangeText:'¥80-300',
      rewardMin:80,
      rewardMax:300,
      highRisk:false,
      riskText:'常规风险',
      insuranceName:'交付保障',
      insuranceFee:0.8,
      insuranceDefault:false,
      taskPlaceholder:'请写清楚要做什么，例如：30页融资路演PPT，需要根据现有文档重新梳理结构并统一视觉风格。',
      requirementPlaceholder:'例如：需要有商业汇报经验，能接受 2 轮小修改，今晚 22:00 前先给目录。',
      locationPlaceholder:'例如：线上远程协作 / 海淀区知春路',
      detailLocationPlaceholder:'例如：飞书协作、腾讯会议，或具体楼栋门牌',
      extraFields:[
        {key:'deliverMode',label:'交付形式',type:'chips',required:true,defaultValue:'新做',options:['新做','改稿优化','排版美化']},
        {key:'pageCount',label:'预计页数',type:'select',required:true,defaultValue:'10-20页',options:['10页内','10-20页','20-40页','40页以上']}
      ],
      safety:{
        notice:'请确认素材授权、交付边界和修改轮次。',
        risk:'如涉及商业资料或课程内容，请避免提交涉密或无授权文件。',
        details:[
          '建议在任务说明里写清楚页数、风格、截止时间与素材准备情况。',
          '如需源文件交付，请提前说明格式要求，例如 PPTX、Keynote 或 PDF。',
          '如有敏感信息，建议先做脱敏处理再共享给服务者。'
        ]
      }
    },
    {
      key:'resume',
      categoryKey:'skill',
      orderTypeKey:'health',
      icon:'📝',
      name:'写简历',
      summary:'简历重写、优化与求职包装',
      avgRangeText:'¥60-180',
      rewardMin:60,
      rewardMax:180,
      highRisk:false,
      riskText:'常规风险',
      insuranceName:'交付保障',
      insuranceFee:0.8,
      insuranceDefault:false,
      taskPlaceholder:'请说明需要服务者做的事情，例如：基于现有简历重写一版互联网运营岗简历，并同步优化项目经历表达。',
      requirementPlaceholder:'例如：最好有校招/社招简历优化经验，能给出岗位匹配建议。',
      locationPlaceholder:'例如：线上远程协作 / 朝阳区国贸',
      detailLocationPlaceholder:'例如：微信沟通、邮箱交付，或线下面谈地点',
      extraFields:[
        {key:'targetRole',label:'目标岗位',type:'text',required:true,defaultValue:'产品运营',placeholder:'例如：新媒体运营 / 数据分析 / Java开发'},
        {key:'materialStatus',label:'现有材料情况',type:'chips',required:true,defaultValue:'已有旧简历',options:['已有旧简历','仅有经历清单','需要从零梳理']}
      ],
      safety:{
        notice:'请确认个人信息授权范围，并尽量避免在任务中提交身份证号等敏感信息。',
        risk:'涉及求职隐私与联系方式时，请控制共享范围。',
        details:[
          '可先隐藏手机号、身份证号、住址等高敏感字段，再让服务者优化内容。',
          '建议明确是否需要中英文双版本、是否包含求职信或面试问答。',
          '发布后请勿通过公开评论区透露个人隐私。'
        ]
      }
    },
    {
      key:'tutoring',
      categoryKey:'skill',
      orderTypeKey:'health',
      icon:'📚',
      name:'家教',
      summary:'学科辅导、作业答疑、考试冲刺',
      avgRangeText:'¥100-260',
      rewardMin:100,
      rewardMax:260,
      highRisk:false,
      riskText:'常规风险',
      insuranceName:'授课保障',
      insuranceFee:1.2,
      insuranceDefault:false,
      taskPlaceholder:'请写清楚本次辅导内容，例如：高一数学函数基础，1.5小时，重点讲作业错题和周测复盘。',
      requirementPlaceholder:'例如：需要相关学科基础扎实，表达清晰，有耐心。',
      locationPlaceholder:'例如：海淀区五道口 / 线上视频',
      detailLocationPlaceholder:'例如：小区门牌、咖啡馆，或线上会议链接',
      extraFields:[
        {key:'subject',label:'辅导科目',type:'select',required:true,defaultValue:'数学',options:['数学','英语','语文','物理','化学','生物']},
        {key:'studentLevel',label:'学生年级',type:'select',required:true,defaultValue:'高中',options:['小学','初中','高中','大学']}
      ],
      safety:{
        notice:'请提前确认授课地点、线上/线下形式与是否有监护人在场。',
        risk:'若为未成年人辅导，建议明确监护人联系方式和到离场规则。',
        details:[
          '线下家教建议在公开或有监护人在场的环境进行。',
          '请在任务描述中写明课程目标、教材版本和课前准备。',
          '如需试讲或课件，请提前说明是否计费。'
        ]
      }
    },
    {
      key:'coach',
      categoryKey:'skill',
      orderTypeKey:'health',
      icon:'🏋️',
      name:'教练',
      summary:'健身、动作纠正与训练计划',
      avgRangeText:'¥120-320',
      rewardMin:120,
      rewardMax:320,
      highRisk:false,
      riskText:'常规风险',
      insuranceName:'授课保障',
      insuranceFee:1.5,
      insuranceDefault:false,
      taskPlaceholder:'请说明希望服务者完成的训练支持，例如：一对一力量训练指导，纠正深蹲和硬拉动作。',
      requirementPlaceholder:'例如：需要持证或有训练经验，能根据基础做强度调整。',
      locationPlaceholder:'例如：朝阳区健身房 / 小区运动区',
      detailLocationPlaceholder:'例如：具体门店、教室或集合位置',
      extraFields:[
        {key:'trainingGoal',label:'训练目标',type:'chips',required:true,defaultValue:'减脂',options:['减脂','增肌','体态纠正','基础陪练']},
        {key:'classMode',label:'授课形式',type:'chips',required:true,defaultValue:'一对一',options:['一对一','一对二','小团体']}
      ],
      safety:{
        notice:'请在下单前确认身体状况与既往伤病史。',
        risk:'训练中若超出自身能力范围，可能引发扭伤或运动不适。',
        details:[
          '如有腰膝伤病、术后恢复或医生禁忌，请提前说明。',
          '建议明确是否需要场地器械、热身与拉伸安排。',
          '大强度训练前请准备饮水和应急联系方式。'
        ]
      }
    },
    {
      key:'errand',
      categoryKey:'physical',
      orderTypeKey:'outdoor',
      icon:'🛵',
      name:'跑腿',
      summary:'代取代送、代办、短距离配送',
      avgRangeText:'¥20-80',
      rewardMin:20,
      rewardMax:80,
      highRisk:false,
      riskText:'常规风险',
      insuranceName:'基础责任险',
      insuranceFee:1.0,
      insuranceDefault:false,
      taskPlaceholder:'请写清楚需要服务者做什么，例如：下午去校医院代取检查报告，再送到宿舍楼下。',
      requirementPlaceholder:'例如：需要准时、能沟通进度，有校园内代办经验更好。',
      locationPlaceholder:'例如：海淀区学院路 / 学校东门',
      detailLocationPlaceholder:'例如：取件点、送达点、楼栋信息',
      extraFields:[
        {key:'errandType',label:'跑腿类型',type:'chips',required:true,defaultValue:'代取代送',options:['代取代送','代买代办','校园跑腿']},
        {key:'pickupNote',label:'物品/事项说明',type:'text',required:true,defaultValue:'文件袋1份',placeholder:'例如：药品、文件、快递、餐食等'}
      ],
      safety:{
        notice:'请确认物品内容合法合规，且重量与时效描述清楚。',
        risk:'若涉及贵重物品或多点往返，请提前说明责任边界。',
        details:[
          '建议在任务中明确物品类型、送达时限和联系人电话。',
          '如需垫付，请注明金额与报销方式。',
          '请勿发布涉违禁品、现金大额代送等风险任务。'
        ]
      }
    },
    {
      key:'running',
      categoryKey:'physical',
      orderTypeKey:'outdoor',
      icon:'🏃',
      name:'陪跑步',
      summary:'陪跑、配速、路线陪同',
      avgRangeText:'¥60-180',
      rewardMin:60,
      rewardMax:180,
      highRisk:true,
      riskText:'高风险任务',
      insuranceName:'运动人身险',
      insuranceFee:3.5,
      insuranceDefault:true,
      taskPlaceholder:'请写清楚本次跑步安排，例如：晚间 8km 陪跑，希望配速控制在 6分30秒左右。',
      requirementPlaceholder:'例如：需要熟悉路线，能陪同热身和收操，体能稳定。',
      locationPlaceholder:'例如：奥森南门 / 操场西门',
      detailLocationPlaceholder:'例如：集合点、停车点、补给点说明',
      extraFields:[
        {key:'distanceGoal',label:'目标距离',type:'select',required:true,defaultValue:'8km',options:['3km','5km','8km','10km','半马训练']},
        {key:'paceGoal',label:'目标配速',type:'chips',required:true,defaultValue:'6\'00"-7\'00"/km',options:['5\'30"-6\'00"/km','6\'00"-7\'00"/km','7\'00"+/km','不限']}
      ],
      safety:{
        notice:'请确认体能状况、天气与路线安全，必要时提前购买保险。',
        risk:'陪跑与户外运动存在摔倒、拉伤、突发不适等风险。',
        details:[
          '建议写明距离、配速、补给安排和是否需要拉伸陪同。',
          '极端天气、夜跑或陌生路线请提高风险等级说明。',
          '如涉及山地、长距离或夜间路线，请优先购买保险。'
        ]
      }
    },
    {
      key:'queue',
      categoryKey:'physical',
      orderTypeKey:'outdoor',
      icon:'🕒',
      name:'排队',
      summary:'门店排号、活动签到、窗口代排',
      avgRangeText:'¥40-120',
      rewardMin:40,
      rewardMax:120,
      highRisk:false,
      riskText:'常规风险',
      insuranceName:'基础责任险',
      insuranceFee:1.0,
      insuranceDefault:false,
      taskPlaceholder:'请说明需要排队的事项，例如：上午 8 点到医院窗口代排挂号，排到后电话联系我。',
      requirementPlaceholder:'例如：需要守时，能按要求实时汇报排队进度。',
      locationPlaceholder:'例如：医院窗口 / 热门门店',
      detailLocationPlaceholder:'例如：具体楼层、窗口号、门店入口',
      extraFields:[
        {key:'queueScene',label:'排队事项',type:'text',required:true,defaultValue:'门店开售代排',placeholder:'例如：医院挂号 / 门店开售 / 演出取票'},
        {key:'queueDuration',label:'预计排队时长',type:'select',required:true,defaultValue:'2小时内',options:['1小时内','2小时内','半天','全天']}
      ],
      safety:{
        notice:'请确认排队事项可转交，且涉及证件/号源的规则已说明。',
        risk:'部分窗口需本人到场或身份证件核验，转交前请先确认。',
        details:[
          '如涉及实名核验、号码牌或支付，请提前写清是否可代办。',
          '建议写明最晚反馈时间和未排到时的处理方式。',
          '请勿发布抢号、黄牛倒卖等违规任务。'
        ]
      }
    },
    {
      key:'cat_care',
      categoryKey:'professional',
      orderTypeKey:'cat',
      icon:'🐱',
      name:'上门喂猫',
      summary:'喂食、换水、清洁猫砂、陪玩',
      avgRangeText:'¥60-180',
      rewardMin:60,
      rewardMax:180,
      highRisk:true,
      riskText:'高风险任务',
      insuranceName:'上门服务保障',
      insuranceFee:1.8,
      insuranceDefault:true,
      taskPlaceholder:'请写清楚服务者需要做的事情，例如：两只猫上门喂食、换水、清理猫砂，并拍摄状态照片。',
      requirementPlaceholder:'例如：需要细心、有上门服务经验，能严格按喂养说明执行。',
      locationPlaceholder:'例如：海淀区中关村南大街',
      detailLocationPlaceholder:'例如：小区、楼栋、门锁方式、碰面说明',
      extraFields:[
        {key:'petCount',label:'猫咪数量',type:'select',required:true,defaultValue:'2只',options:['1只','2只','3只','4只及以上']},
        {key:'entryMode',label:'入户方式',type:'chips',required:true,defaultValue:'密码锁',options:['密码锁','钥匙交接','有人在家']}
      ],
      safety:{
        notice:'请确认入户方式、猫咪性格、喂养禁忌和应急联系人。',
        risk:'上门与入户场景存在财物、宠物应激和门锁交接风险。',
        details:[
          '建议明确门锁方式、监控情况、猫咪数量和是否需要服药。',
          '高风险宠物或陌生入户场景建议优先购买保险。',
          '服务者到达与完成后建议上传门口/宠物状态凭证。'
        ]
      }
    },
    {
      key:'medical_companion',
      categoryKey:'professional',
      orderTypeKey:'health',
      icon:'🏥',
      name:'医疗陪诊',
      summary:'挂号、候诊、陪同、取药、医嘱记录',
      avgRangeText:'¥120-300',
      rewardMin:120,
      rewardMax:300,
      highRisk:true,
      riskText:'高风险任务',
      insuranceName:'陪诊责任险',
      insuranceFee:2.5,
      insuranceDefault:true,
      taskPlaceholder:'请说明陪诊需要做的事情，例如：协助挂号、排队陪同、记录医嘱并取药。',
      requirementPlaceholder:'例如：需要熟悉医院流程，耐心细致，沟通清楚。',
      locationPlaceholder:'例如：北京协和医院东院区',
      detailLocationPlaceholder:'例如：科室、楼层、集合点或窗口信息',
      extraFields:[
        {key:'hospitalName',label:'医院名称',type:'text',required:true,defaultValue:'北京协和医院',placeholder:'例如：北医三院 / 协和医院 / 儿研所'},
        {key:'department',label:'就诊科室',type:'select',required:true,defaultValue:'神经内科',options:['内科','骨科','神经内科','眼科','肿瘤科','儿科']}
      ],
      safety:{
        notice:'请确认就诊人情况、医院信息、实名规则和是否需要代取药。',
        risk:'陪诊涉及医院实名流程、药品交接与突发健康情况，风险相对较高。',
        details:[
          '请避免在页面中写入身份证号、完整病历等敏感健康信息。',
          '如需代取药或推轮椅，请提前说明流程与注意事项。',
          '建议在风险较高场景下购买保险，并保留医嘱/过程凭证。'
        ]
      }
    },
    {
      key:'wedding_assist',
      categoryKey:'activity',
      orderTypeKey:'wedding',
      icon:'💒',
      name:'婚庆协助',
      summary:'接亲、迎宾、典礼撑场、物品协助',
      avgRangeText:'¥300-900',
      rewardMin:300,
      rewardMax:900,
      highRisk:true,
      riskText:'高风险任务',
      insuranceName:'活动履约保障',
      insuranceFee:3.0,
      insuranceDefault:true,
      taskPlaceholder:'请说明婚庆协助内容，例如：婚礼当天迎宾、流程配合、礼金桌协助与物品看管。',
      requirementPlaceholder:'例如：守时、形象端正、善于沟通，能接受彩排安排。',
      locationPlaceholder:'例如：朝阳区酒店宴会厅',
      detailLocationPlaceholder:'例如：酒店名称、宴会厅、集合点与联系人',
      extraFields:[
        {key:'weddingRole',label:'协助角色',type:'chips',required:true,defaultValue:'迎宾/流程协助',options:['迎宾/流程协助','伴郎/伴娘','礼金桌协助','物品保管']},
        {key:'dressCode',label:'着装要求',type:'text',required:true,defaultValue:'浅色礼服或深色正装',placeholder:'例如：黑西装 / 香槟色礼服 / 高跟鞋'}
      ],
      safety:{
        notice:'请确认档期、彩排要求、着装标准和现场联系人。',
        risk:'婚庆任务时间敏感、人员密集，单方取消或迟到风险较高。',
        details:[
          '建议写明到场时间、结束时间、是否含彩排与餐补。',
          '若涉及礼金、婚戒等重要物品，请明确保管责任。',
          '高价值或重要日期任务建议购买保险并保留关键沟通记录。'
        ]
      }
    },
    {
      key:'expo_assist',
      categoryKey:'activity',
      orderTypeKey:'wedding',
      icon:'🎪',
      name:'展会协助',
      summary:'布场、引导、发放物料、现场执行',
      avgRangeText:'¥150-400',
      rewardMin:150,
      rewardMax:400,
      highRisk:false,
      riskText:'常规风险',
      insuranceName:'活动履约保障',
      insuranceFee:1.2,
      insuranceDefault:false,
      taskPlaceholder:'请说明展会协助内容，例如：上午布场，下午负责观众签到和资料发放。',
      requirementPlaceholder:'例如：需要执行力强、沟通顺畅，能长时间站立。',
      locationPlaceholder:'例如：国家会议中心',
      detailLocationPlaceholder:'例如：展馆、馆号、集合点与出入口',
      extraFields:[
        {key:'expoRole',label:'现场职责',type:'select',required:true,defaultValue:'签到引导',options:['签到引导','物料发放','布场撤场','摊位协助']},
        {key:'uniformNeed',label:'统一着装',type:'chips',required:true,defaultValue:'需要',options:['需要','不需要']}
      ],
      safety:{
        notice:'请确认到岗时间、着装要求和现场负责人信息。',
        risk:'长时间站立或高强度布场会带来体力消耗和物料管理风险。',
        details:[
          '建议在任务中写明是否含餐补、加班时长和物料清点要求。',
          '如需搬运重物，请单独说明重量和场地条件。',
          '重要展品请明确保管边界和拍照权限。'
        ]
      }
    },
    {
      key:'photo_assist',
      categoryKey:'activity',
      orderTypeKey:'wedding',
      icon:'📷',
      name:'摄影助理',
      summary:'跟拍辅助、打光、设备搬运、现场协调',
      avgRangeText:'¥120-360',
      rewardMin:120,
      rewardMax:360,
      highRisk:false,
      riskText:'常规风险',
      insuranceName:'活动履约保障',
      insuranceFee:1.5,
      insuranceDefault:false,
      taskPlaceholder:'请说明摄影助理需要配合的内容，例如：活动现场搬运器材、协助打光并整理素材卡。',
      requirementPlaceholder:'例如：最好有摄影协助经验，能听从主摄影安排。',
      locationPlaceholder:'例如：朝阳区活动场地',
      detailLocationPlaceholder:'例如：具体楼层、场馆、摄影集合点',
      extraFields:[
        {key:'shootType',label:'拍摄类型',type:'select',required:true,defaultValue:'活动跟拍',options:['活动跟拍','人像拍摄','婚礼拍摄','短视频拍摄']},
        {key:'gearNeed',label:'是否需自带装备',type:'chips',required:true,defaultValue:'不需要',options:['不需要','需要']}
      ],
      safety:{
        notice:'请确认器材边界、拍摄权限和场地用电/走位规则。',
        risk:'现场搬运设备、灯架等器材时需注意碰撞和跌落风险。',
        details:[
          '如需自带补光灯、稳定器等，请提前说明型号与使用场景。',
          '请在任务描述中注明是否有楼梯、户外场景或雨天备选方案。',
          '素材版权与存储规则建议在任务前明确。'
        ]
      }
    },
    {
      key:'moving_help',
      categoryKey:'life',
      orderTypeKey:'outdoor',
      icon:'📦',
      name:'搬家帮手',
      summary:'搬运、打包、上下楼协助',
      avgRangeText:'¥100-260',
      rewardMin:100,
      rewardMax:260,
      highRisk:true,
      riskText:'高风险任务',
      insuranceName:'搬运责任险',
      insuranceFee:2.0,
      insuranceDefault:true,
      taskPlaceholder:'请写清楚搬运内容，例如：帮忙把宿舍物品打包并搬到楼下货车。',
      requirementPlaceholder:'例如：需要体力好、守时，能搬动中等重量物品。',
      locationPlaceholder:'例如：海淀区学院路',
      detailLocationPlaceholder:'例如：楼栋、楼层、电梯情况、车辆停靠点',
      extraFields:[
        {key:'itemWeight',label:'物品重量级别',type:'select',required:true,defaultValue:'中等（20kg内）',options:['轻量（10kg内）','中等（20kg内）','偏重（20-40kg）','重物较多']},
        {key:'stairsInfo',label:'楼层/电梯情况',type:'text',required:true,defaultValue:'5层有电梯',placeholder:'例如：6层无电梯 / 地下车库可直达'}
      ],
      safety:{
        notice:'请确认重量、楼层和大件物品情况，避免遗漏高风险搬运内容。',
        risk:'搬运任务存在磕碰、扭伤、物品损坏等风险。',
        details:[
          '大件家电、玻璃、贵重物品请单独说明，必要时增加酬劳或人数。',
          '若无电梯、高楼层或停车困难，请提前写明。',
          '建议高风险搬运任务购买保险，并保留装卸前后照片。'
        ]
      }
    },
    {
      key:'cleaning',
      categoryKey:'life',
      orderTypeKey:'cat',
      icon:'🧼',
      name:'家电清洁',
      summary:'空调、油烟机、洗衣机等清洁',
      avgRangeText:'¥80-220',
      rewardMin:80,
      rewardMax:220,
      highRisk:false,
      riskText:'常规风险',
      insuranceName:'上门服务保障',
      insuranceFee:1.2,
      insuranceDefault:false,
      taskPlaceholder:'请写清楚清洁内容，例如：上门清洗挂机空调一台，并顺带清理滤网和外壳。',
      requirementPlaceholder:'例如：需要有家电清洁经验，工具熟悉，动作细致。',
      locationPlaceholder:'例如：朝阳区住宅',
      detailLocationPlaceholder:'例如：楼栋、门牌、上门时间与联系人',
      extraFields:[
        {key:'cleanTarget',label:'清洁对象',type:'select',required:true,defaultValue:'空调挂机',options:['空调挂机','油烟机','洗衣机','冰箱','综合保洁']},
        {key:'toolState',label:'工具准备情况',type:'chips',required:true,defaultValue:'服务者自带',options:['服务者自带','现场提供']}
      ],
      safety:{
        notice:'请确认设备型号、是否需拆洗以及现场用水用电情况。',
        risk:'上门清洁存在设备损坏、滑倒和入户责任边界风险。',
        details:[
          '建议提前说明设备品牌、数量和是否需要深度拆洗。',
          '如需登高、拆卸或使用药剂，请在任务中明确。',
          '贵重设备或复杂型号建议优先购买保险。'
        ]
      }
    },
    {
      key:'storage',
      categoryKey:'life',
      orderTypeKey:'cat',
      icon:'🧺',
      name:'居家收纳',
      summary:'衣柜、书桌、厨房与空间整理',
      avgRangeText:'¥100-260',
      rewardMin:100,
      rewardMax:260,
      highRisk:false,
      riskText:'常规风险',
      insuranceName:'上门服务保障',
      insuranceFee:1.2,
      insuranceDefault:false,
      taskPlaceholder:'请写清楚收纳目标，例如：整理主卧衣柜和书桌，按日常使用频率归类。',
      requirementPlaceholder:'例如：需要细心耐心，最好有整理经验。',
      locationPlaceholder:'例如：朝阳区公寓',
      detailLocationPlaceholder:'例如：小区、楼栋、房间区域说明',
      extraFields:[
        {key:'storageArea',label:'收纳区域',type:'select',required:true,defaultValue:'卧室衣柜',options:['卧室衣柜','厨房收纳','书桌书柜','全屋基础整理']},
        {key:'homeArea',label:'房间面积',type:'select',required:true,defaultValue:'20㎡内',options:['20㎡内','20-50㎡','50-80㎡','80㎡以上']}
      ],
      safety:{
        notice:'请确认收纳区域、物品范围和是否涉及贵重物品。',
        risk:'整理过程中可能出现误丢、混放或贵重物品责任边界问题。',
        details:[
          '建议提前说明哪些物品不能移动或丢弃。',
          '如需断舍离，请提前约定是否需要发布者现场确认。',
          '贵重首饰、证件、现金建议由发布者自行保管。'
        ]
      }
    },
    {
      key:'dog_walking',
      categoryKey:'companion',
      orderTypeKey:'cat',
      icon:'🐕',
      name:'遛狗',
      summary:'牵引散步、补水、简单陪伴',
      avgRangeText:'¥40-100',
      rewardMin:40,
      rewardMax:100,
      highRisk:false,
      riskText:'常规风险',
      insuranceName:'宠物服务保障',
      insuranceFee:1.2,
      insuranceDefault:false,
      taskPlaceholder:'请说明遛狗安排，例如：晚饭后遛狗 40 分钟，固定路线一圈并补水。',
      requirementPlaceholder:'例如：需要有宠物陪伴经验，能控制牵引绳和情绪。',
      locationPlaceholder:'例如：海淀区小区花园',
      detailLocationPlaceholder:'例如：楼栋、遛狗路线、回家方式',
      extraFields:[
        {key:'dogCount',label:'狗狗数量',type:'select',required:true,defaultValue:'1只',options:['1只','2只','3只及以上']},
        {key:'dogTemper',label:'狗狗性格',type:'chips',required:true,defaultValue:'温顺',options:['温顺','活泼','胆小','需要特别注意']}
      ],
      safety:{
        notice:'请确认狗狗性格、牵引方式和禁忌区域。',
        risk:'户外遛狗可能出现挣脱、受惊、冲撞或天气风险。',
        details:[
          '建议明确是否允许与其他宠物接触、是否可进草地或奔跑。',
          '请提前说明狗狗是否打疫苗、是否怕生、是否会护食。',
          '夜间或大型犬任务请提高风险提示。'
        ]
      }
    },
    {
      key:'elder_companion',
      categoryKey:'companion',
      orderTypeKey:'health',
      icon:'🧓',
      name:'老人陪伴',
      summary:'陪同散步、聊天、简单照看与外出陪同',
      avgRangeText:'¥120-280',
      rewardMin:120,
      rewardMax:280,
      highRisk:true,
      riskText:'高风险任务',
      insuranceName:'陪护责任险',
      insuranceFee:2.0,
      insuranceDefault:true,
      taskPlaceholder:'请说明老人陪伴内容，例如：下午陪同散步、聊天，并协助买药回家。',
      requirementPlaceholder:'例如：需要有耐心，沟通温和，最好有照护经验。',
      locationPlaceholder:'例如：朝阳区小区 / 医院附近',
      detailLocationPlaceholder:'例如：楼栋、碰面方式、家属联系方式',
      extraFields:[
        {key:'mobilityState',label:'行动状态',type:'chips',required:true,defaultValue:'可独立行走',options:['可独立行走','需搀扶','轮椅陪同']},
        {key:'careFocus',label:'重点照看事项',type:'text',required:true,defaultValue:'注意上下台阶',placeholder:'例如：服药提醒、步行速度、情绪安抚'}
      ],
      safety:{
        notice:'请确认老人行动状态、家属联系方式和突发情况处理方式。',
        risk:'陪伴照护场景存在跌倒、走失、突发身体不适等风险。',
        details:[
          '请在任务里写明是否需搀扶、是否能上下台阶、是否有慢病史。',
          '建议高风险照护场景购买保险，并保留家属紧急联系方式。',
          '如需陪同出行，请注明交通工具、目的地与返程方式。'
        ]
      }
    },
    {
      key:'child_pickup',
      categoryKey:'companion',
      orderTypeKey:'health',
      icon:'🎒',
      name:'接送陪同',
      summary:'孩子放学接送、课后陪同与短时照看',
      avgRangeText:'¥80-200',
      rewardMin:80,
      rewardMax:200,
      highRisk:true,
      riskText:'高风险任务',
      insuranceName:'接送责任险',
      insuranceFee:2.2,
      insuranceDefault:true,
      taskPlaceholder:'请说明接送安排，例如：放学后从学校接到培训班，途中陪同并与家长交接。',
      requirementPlaceholder:'例如：需要守时，沟通清楚，有责任心，能配合家长交接。',
      locationPlaceholder:'例如：学校门口 / 培训机构',
      detailLocationPlaceholder:'例如：校门、接人暗号、交接人信息',
      extraFields:[
        {key:'childLevel',label:'接送对象',type:'select',required:true,defaultValue:'小学',options:['幼儿园','小学','初中']},
        {key:'tripMode',label:'接送方式',type:'chips',required:true,defaultValue:'步行/地铁',options:['步行/地铁','打车','家长车辆交接']}
      ],
      safety:{
        notice:'请确认交接暗号、家长信息、路线和应急联系人。',
        risk:'接送未成年人属于高风险场景，需重点关注交接和路线安全。',
        details:[
          '请明确接送对象年级、学校/机构名称、交接时间与联系人。',
          '建议说明是否允许中途购物、是否可独自离开视线范围。',
          '该类任务建议优先购买保险，并保留交接凭证。'
        ]
      }
    }
  ];

  const projectMap=projects.reduce(function(map,item){
    map[item.key]=item;
    return map;
  },{});

  const categoryMap=categories.reduce(function(map,item){
    map[item.key]=item;
    return map;
  },{});

  const legacyProjectMap={
    waimao:'cat_care',
    paopao:'running',
    peizhen:'medical_companion',
    hunqing:'wedding_assist'
  };

  function getCategory(key){
    return categoryMap[key]||null;
  }

  function getProject(key){
    return projectMap[key]||null;
  }

  function getProjectsByCategory(categoryKey){
    if(categoryKey==='common'){
      return commonProjectKeys.map(function(key){return projectMap[key];}).filter(Boolean);
    }
    return projects.filter(function(item){return item.categoryKey===categoryKey;});
  }

  function resolveProjectKey(rawKey){
    if(rawKey&&projectMap[rawKey])return rawKey;
    if(rawKey&&legacyProjectMap[rawKey])return legacyProjectMap[rawKey];
    return '';
  }

  function readDraft(){
    try{
      return JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')||{};
    }catch(error){
      return {};
    }
  }

  function writeDraft(draft){
    localStorage.setItem(STORAGE_KEY,JSON.stringify(draft||{}));
    return draft||{};
  }

  function clearDraft(){
    localStorage.removeItem(STORAGE_KEY);
  }

  function normalizeDurationText(durationText){
    const source=String(durationText||'').trim();
    if(!source)return '';
    const hourMatch=source.match(/(\d+(?:\.\d+)?)\s*小时/);
    if(hourMatch)return hourMatch[1]+' 小时';
    const minuteMatch=source.match(/(\d+)\s*分钟/);
    if(minuteMatch)return minuteMatch[1]+' 分钟';
    const dayMatch=source.match(/(\d+(?:\.\d+)?)\s*天/);
    if(dayMatch)return dayMatch[1]+' 天';
    if(/半天|半日/.test(source))return '半天';
    if(/全天/.test(source))return '全天';
    return source.replace(/\s+/g,' ');
  }

  function extractDistrictText(locationText){
    const source=String(locationText||'').trim();
    if(!source)return '';
    const matches=source.match(/[^省市区县旗\s·,，/]+(?:区|县|旗|市)/g);
    if(matches&&matches.length){
      const filtered=matches.filter(function(item){
        return !/^(北京市|上海市|天津市|重庆市)$/.test(item);
      });
      return filtered[filtered.length-1]||matches[matches.length-1];
    }
    const parts=source.split(/[·,，/]/).map(function(item){
      return item.trim();
    }).filter(Boolean);
    return parts[parts.length-1]||source;
  }

  function createTaskTitle(project,taskActions,options){
    const projectName=project&&project.name||'任务';
    const durationText=normalizeDurationText(options&&options.durationText);
    const districtText=extractDistrictText(options&&options.roughLocation);
    if(durationText||districtText){
      return [projectName,durationText,districtText].filter(Boolean).join('｜');
    }
    return projectName;
  }

  function getValidityLabel(hours){
    const matched=validityOptions.find(function(item){return Number(item.hours)===Number(hours);});
    return matched?matched.label:'12小时';
  }

  window.PublishFlowConfig={
    storageKey:STORAGE_KEY,
    categories:categories,
    projects:projects,
    validityOptions:validityOptions,
    legacyProjectMap:legacyProjectMap,
    getCategory:getCategory,
    getProject:getProject,
    getProjectsByCategory:getProjectsByCategory,
    resolveProjectKey:resolveProjectKey,
    readDraft:readDraft,
    writeDraft:writeDraft,
    clearDraft:clearDraft,
    createTaskTitle:createTaskTitle,
    getValidityLabel:getValidityLabel
  };
})();

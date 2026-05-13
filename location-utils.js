(function(){
  const DEFAULT_VIEWER={
    region:'北京市海淀区',
    lat:39.9856,
    lng:116.3187
  };

  const KNOWN_LOCATIONS=[
    {patterns:['中关村南大街','科苑小区','中关村'],region:'北京市海淀区',lat:39.9893,lng:116.3301},
    {patterns:['奥森公园南门','奥森南门','奥林匹克森林公园','奥森公园','奥森'],region:'北京市朝阳区',lat:40.0078,lng:116.3392},
    {patterns:['北医三院','北医三院门诊楼'],region:'北京市海淀区',lat:39.9732,lng:116.3624},
    {patterns:['北京协和医院','协和医院东院区','协和医院'],region:'北京市东城区',lat:39.9084,lng:116.4185},
    {patterns:['海淀逸林酒店'],region:'北京市海淀区',lat:39.9483,lng:116.3781},
    {patterns:['知春路乐乎公寓','知春路'],region:'北京市海淀区',lat:39.9821,lng:116.3824},
    {patterns:['香山公园东门','香山公园','香山'],region:'北京市海淀区',lat:39.9997,lng:116.1877},
    {patterns:['望京花园','望京'],region:'北京市朝阳区',lat:40.0008,lng:116.4708},
    {patterns:['朝阳公寓'],region:'北京市朝阳区',lat:39.9219,lng:116.4436},
    {patterns:['朝阳婚礼堂','朝阳宴会艺术中心'],region:'北京市朝阳区',lat:39.9187,lng:116.4603},
    {patterns:['双榆树青年公寓'],region:'北京市海淀区',lat:39.9689,lng:116.3379},
    {patterns:['黄山风景区换乘中心','黄山换乘中心'],region:'黄山市黄山区',lat:30.1318,lng:118.1729},
    {patterns:['黄山北大门','黄山北大门停车场'],region:'黄山市黄山区',lat:30.1682,lng:118.1826},
    {patterns:['屯溪老街','屯溪老街民宿'],region:'黄山市屯溪区',lat:29.7121,lng:118.3091},
    {patterns:['陆家嘴中心绿地','陆家嘴'],region:'上海市浦东新区',lat:31.2374,lng:121.5004},
    {patterns:['花城广场','珠江新城'],region:'广州市天河区',lat:23.1195,lng:113.3247},
    {patterns:['白云山南门','白云山'],region:'广州市白云区',lat:23.1663,lng:113.2879}
  ];

  function normalizeText(text){
    return String(text||'').trim();
  }

  function getData(){
    return window.BANXING_DATA&&typeof window.BANXING_DATA==='object'?window.BANXING_DATA:null;
  }

  function getViewerLocation(){
    const data=getData();
    if(data&&typeof data.getLocationById==='function'){
      const current=data.getLocationById(data.defaultCurrentLocationId);
      if(current){
        return {
          region:current.region||DEFAULT_VIEWER.region,
          lat:current.lat,
          lng:current.lng
        };
      }
    }
    return DEFAULT_VIEWER;
  }

  function scoreTexts(source,candidateTexts){
    let score=0;
    const normalized=normalizeText(source).toLowerCase();
    candidateTexts.forEach(function(text){
      const current=normalizeText(text).toLowerCase();
      if(!current)return;
      if(normalized===current)score+=8;
      else if(normalized.indexOf(current)>-1||current.indexOf(normalized)>-1)score+=4;
    });
    return score;
  }

  function inferByKeyword(text){
    const normalized=normalizeText(text).toLowerCase();
    return KNOWN_LOCATIONS.find(function(item){
      return item.patterns.some(function(pattern){
        const target=pattern.toLowerCase();
        return normalized.indexOf(target)>-1||target.indexOf(normalized)>-1;
      });
    })||null;
  }

  function inferRegionByCoordinate(point){
    const data=getData();
    if(!data||!Array.isArray(data.locations)||typeof data.distanceKm!=='function')return null;
    const nearest=data.locations
      .map(function(item){
        return {
          region:item.region,
          distance:data.distanceKm(point,item)
        };
      })
      .sort(function(a,b){return a.distance-b.distance;})[0];
    return nearest&&nearest.region?nearest.region:null;
  }

  function resolveLocation(text){
    const source=normalizeText(text);
    if(!source)return null;

    const directKnown=inferByKeyword(source);
    if(directKnown){
      return {
        exactText:source,
        region:directKnown.region,
        lat:directKnown.lat,
        lng:directKnown.lng
      };
    }

    const data=getData();
    if(data){
      const locationMatch=(data.locations||[])
        .map(function(item){
          return {
            score:scoreTexts(source,[item.name,item.shortName,item.region,item.city,item.district].concat(item.keywords||[])),
            item:item
          };
        })
        .sort(function(a,b){return b.score-a.score;})[0];
      if(locationMatch&&locationMatch.score>0){
        return {
          exactText:source,
          region:locationMatch.item.region||DEFAULT_VIEWER.region,
          lat:locationMatch.item.lat,
          lng:locationMatch.item.lng
        };
      }

      const taskMatch=(data.tasks||[])
        .map(function(item){
          return {
            score:scoreTexts(source,[item.locationName,item.title,item.publisher,item.search]),
            item:item
          };
        })
        .sort(function(a,b){return b.score-a.score;})[0];
      if(taskMatch&&taskMatch.score>0){
        return {
          exactText:source,
          region:inferRegionByCoordinate(taskMatch.item)||DEFAULT_VIEWER.region,
          lat:taskMatch.item.lat,
          lng:taskMatch.item.lng
        };
      }
    }

    const fallback=inferByKeyword(source)||{region:DEFAULT_VIEWER.region,lat:DEFAULT_VIEWER.lat,lng:DEFAULT_VIEWER.lng};
    return {
      exactText:source,
      region:fallback.region,
      lat:fallback.lat,
      lng:fallback.lng
    };
  }

  function haversineDistance(from,to){
    const rad=Math.PI/180;
    const dLat=(to.lat-from.lat)*rad;
    const dLng=(to.lng-from.lng)*rad;
    const lat1=from.lat*rad;
    const lat2=to.lat*rad;
    const a=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(lat1)*Math.cos(lat2)*Math.sin(dLng/2)*Math.sin(dLng/2);
    return 6371*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));
  }

  function formatDistance(distanceKm){
    if(!Number.isFinite(distanceKm)||distanceKm<=0)return '距离待确认';
    if(distanceKm<1)return '距你约'+Math.max(100,Math.round(distanceKm*1000/100)*100)+'m';
    if(distanceKm<10)return '距你约'+distanceKm.toFixed(1).replace(/\.0$/,'')+'km';
    return '距你约'+Math.round(distanceKm)+'km';
  }

  function buildMaskedText(location,includeDistance){
    const viewer=getViewerLocation();
    const distanceText=formatDistance(haversineDistance(viewer,location));
    return includeDistance===false?location.region:(location.region+' · '+distanceText);
  }

  function buildAsteriskMaskedText(location,includeDistance){
    const viewer=getViewerLocation();
    const distanceText=formatDistance(haversineDistance(viewer,location));
    return includeDistance===false
      ?(location.region+' · ******')
      :(location.region+' · ****** · '+distanceText);
  }

  function shouldShowExactLocation(context){
    return !!(
      context&&
      context.viewerRole==='service'&&
      ['ready','serving','confirm','dispute'].includes(context.status)
    );
  }

  function getOrderLocationDisplay(text,options){
    const source=normalizeText(text);
    if(!source){
      return {
        text:'',
        exactText:'',
        maskedText:'',
        regionText:'',
        distanceText:'',
        canNavigate:false,
        isMasked:false
      };
    }
    const includeDistance=!(options&&options.includeDistance===false);
    if(source.indexOf('******')>-1||source.indexOf('距你约')>-1){
      const resolvedFromMasked=resolveLocation(source);
      const fallbackDistanceText=resolvedFromMasked?formatDistance(haversineDistance(getViewerLocation(),resolvedFromMasked)):'';
      const nextText=!includeDistance
        ?source.replace(/\s*·\s*距你约[^·]+$/,'').replace(/\s*·\s*距离待确认$/,'')
        :(source.indexOf('距你约')>-1
        ?source
        :(source+(fallbackDistanceText?' · '+fallbackDistanceText:'')));
      return {
        text:nextText,
        exactText:source,
        maskedText:nextText,
        regionText:source.split(' · ')[0]||'',
        distanceText:includeDistance?(source.indexOf('距你约')>-1?(source.split(' · ').slice(-1)[0]||''):(fallbackDistanceText||'')):'',
        canNavigate:false,
        isMasked:true
      };
    }
    const exactVisible=!!(options&&options.exactVisible);
    const maskStyle=options&&options.maskStyle==='asterisk'?'asterisk':'distance';
    const resolved=resolveLocation(source);
    const maskedText=resolved
      ?(maskStyle==='asterisk'?buildAsteriskMaskedText(resolved,includeDistance):buildMaskedText(resolved,includeDistance))
      :source;
    const distanceText=resolved?formatDistance(haversineDistance(getViewerLocation(),resolved)):'';
    return {
      text:exactVisible?(includeDistance?(source+' · '+distanceText):source):maskedText,
      exactText:source,
      maskedText:maskedText,
      regionText:resolved&&resolved.region||'',
      distanceText:includeDistance?distanceText:'',
      canNavigate:exactVisible,
      isMasked:!exactVisible
    };
  }

  window.BanxingLocationUtils={
    resolveLocation:resolveLocation,
    formatDistance:formatDistance,
    shouldShowExactLocation:shouldShowExactLocation,
    getOrderLocationDisplay:getOrderLocationDisplay
  };
})();

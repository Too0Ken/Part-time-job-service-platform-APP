(function(global){
  const DEFAULT_YEAR=2026;
  const WEEKDAY_MAP={日:0,天:0,一:1,二:2,三:3,四:4,五:5,六:6};

  function pad(value){
    return String(value).padStart(2,'0');
  }

  function getReferenceDate(){
    const now=new Date();
    if(Number.isNaN(now.getTime()))return new Date(DEFAULT_YEAR,3,22,9,41,0);
    return now;
  }

  function cloneDate(date){
    return new Date(date.getFullYear(),date.getMonth(),date.getDate(),date.getHours(),date.getMinutes(),0,0);
  }

  function formatDateTime(date){
    if(!(date instanceof Date)||Number.isNaN(date.getTime()))return '';
    return date.getFullYear()+'/'+pad(date.getMonth()+1)+'/'+pad(date.getDate())+' '+pad(date.getHours())+':'+pad(date.getMinutes());
  }

  function parseTimeParts(text){
    const match=String(text||'').match(/(\d{1,2}):(\d{2})(?::\d{2})?/);
    if(!match)return null;
    return {hour:Number(match[1]),minute:Number(match[2])};
  }

  function buildDate(year,month,day,timeText){
    const time=parseTimeParts(timeText)||{hour:0,minute:0};
    const date=new Date(Number(year),Number(month)-1,Number(day),time.hour,time.minute,0,0);
    return Number.isNaN(date.getTime())?null:date;
  }

  function parseSingle(input,baseDate){
    if(input instanceof Date)return cloneDate(input);
    const source=String(input||'').trim();
    if(!source||['待确认','待补充','当前','后续','下一步','待开始','待处理','待申请','待归档','已记录','任务发布后','服务当日','服务结束'].includes(source))return null;
    const reference=baseDate instanceof Date&&!Number.isNaN(baseDate.getTime())?baseDate:getReferenceDate();
    const normalized=source.replace('T',' ').replace(/\//g,'-').replace(/年|月/g,'-').replace(/日/g,'').replace(/\s+/g,' ').trim();
    const full=normalized.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:\s+(\d{1,2}:\d{2}(?::\d{2})?))?/);
    if(full)return buildDate(full[1],full[2],full[3],full[4]||'00:00');
    const monthDay=source.match(/(\d{1,2})月(\d{1,2})日?(?:\s+(\d{1,2}:\d{2}(?::\d{2})?))?/);
    if(monthDay)return buildDate(reference.getFullYear(),monthDay[1],monthDay[2],monthDay[3]||'00:00');
    const relative=source.match(/^(今天|明天|后天|昨天)\s*(\d{1,2}:\d{2}(?::\d{2})?)?/);
    if(relative){
      const offset={昨天:-1,今天:0,明天:1,后天:2}[relative[1]]||0;
      const target=new Date(reference.getFullYear(),reference.getMonth(),reference.getDate()+offset,0,0,0,0);
      const time=parseTimeParts(relative[2]||source)||{hour:0,minute:0};
      target.setHours(time.hour,time.minute,0,0);
      return target;
    }
    const weekday=source.match(/^(上周|本周|下周)?周([日天一二三四五六])\s*(\d{1,2}:\d{2}(?::\d{2})?)?/);
    if(weekday){
      const wanted=WEEKDAY_MAP[weekday[2]];
      const current=reference.getDay();
      let diff=wanted-current;
      if(weekday[1]==='上周')diff-=7;
      else if(weekday[1]==='下周')diff+=7;
      else if(diff<0)diff+=7;
      const target=new Date(reference.getFullYear(),reference.getMonth(),reference.getDate()+diff,0,0,0,0);
      const time=parseTimeParts(weekday[3]||source)||{hour:0,minute:0};
      target.setHours(time.hour,time.minute,0,0);
      return target;
    }
    return null;
  }

  function parseRange(input){
    const source=String(input||'').trim();
    if(!source)return null;
    const spaced=source.match(/^(.+?)\s+[-–—]\s+(.+)$/);
    const compact=source.match(/^(.+\d{1,2}:\d{2}(?::\d{2})?)\s*[-–—]\s*(\d{1,2}:\d{2}(?::\d{2})?)$/);
    const parts=spaced?[spaced[1],spaced[2]]:(compact?[compact[1],compact[2]]:null);
    if(!parts){
      const single=parseSingle(source);
      return single?{start:single,end:null}:null;
    }
    const start=parseSingle(parts[0]);
    if(!start)return null;
    let end=parseSingle(parts.slice(1).join(' - '),start);
    if(!end&&parseTimeParts(parts[1])){
      const time=parseTimeParts(parts[1]);
      end=new Date(start.getFullYear(),start.getMonth(),start.getDate(),time.hour,time.minute,0,0);
    }
    if(end&&end<=start&&parseTimeParts(parts[1])){
      end.setDate(end.getDate()+1);
    }
    return {start:start,end:end||null};
  }

  function formatRange(start,end){
    const startDate=parseSingle(start);
    const endDate=parseSingle(end,startDate);
    if(!startDate)return String(start||'');
    if(!endDate)return formatDateTime(startDate);
    if(startDate.getFullYear()===endDate.getFullYear()&&startDate.getMonth()===endDate.getMonth()&&startDate.getDate()===endDate.getDate()){
      return formatDateTime(startDate)+' - '+pad(endDate.getHours())+':'+pad(endDate.getMinutes());
    }
    return formatDateTime(startDate)+' - '+formatDateTime(endDate);
  }

  function formatTaskTime(input){
    const source=String(input||'').trim();
    if(!source)return '';
    const range=parseRange(source);
    if(!range)return source;
    if(!range.end)return formatDateTime(range.start);
    return formatRange(range.start,range.end);
  }

  function formatMaybe(input){
    return formatTaskTime(input)||String(input||'');
  }

  function now(){
    return formatDateTime(new Date());
  }

  global.BanxingTimeUtils={
    parseSingle:parseSingle,
    parseRange:parseRange,
    formatDateTime:function(input){return formatDateTime(parseSingle(input));},
    formatRange:formatRange,
    formatTaskTime:formatTaskTime,
    formatMaybe:formatMaybe,
    now:now
  };
})(window);

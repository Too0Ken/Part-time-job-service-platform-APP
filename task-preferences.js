(function(){
  const STORAGE_KEY='banxing.taskPreferences';

  function normalizeEntry(entry){
    if(!entry||typeof entry.taskId!=='string'||!entry.taskId.trim())return null;
    return {
      taskId:entry.taskId.trim(),
      createdAt:String(entry.createdAt||new Date().toISOString())
    };
  }

  function readState(){
    try{
      const raw=JSON.parse(localStorage.getItem(STORAGE_KEY)||'{}')||{};
      const favorites=Array.isArray(raw.favorites)?raw.favorites.map(normalizeEntry).filter(Boolean):[];
      return {
        favorites:favorites.filter(function(item,index,list){
          return list.findIndex(function(entry){return entry.taskId===item.taskId;})===index;
        })
      };
    }catch(error){
      return {favorites:[]};
    }
  }

  function writeState(state){
    localStorage.setItem(STORAGE_KEY,JSON.stringify({
      favorites:Array.isArray(state&&state.favorites)?state.favorites.map(normalizeEntry).filter(Boolean):[]
    }));
  }

  function getFavorites(){
    return readState().favorites.slice();
  }

  function isFavorited(taskId){
    return getFavorites().some(function(item){return item.taskId===taskId;});
  }

  function toggleFavorite(taskId,forceValue){
    const normalizedId=String(taskId||'').trim();
    if(!normalizedId)return {favorited:false};
    const state=readState();
    const current=state.favorites.find(function(item){return item.taskId===normalizedId;})||null;
    const favorited=typeof forceValue==='boolean'?forceValue:!current;
    state.favorites=favorited
      ?[current||{taskId:normalizedId,createdAt:new Date().toISOString()}].concat(
        state.favorites.filter(function(item){return item.taskId!==normalizedId;})
      )
      :state.favorites.filter(function(item){return item.taskId!==normalizedId;});
    writeState(state);
    return {
      favorited:favorited,
      favorite:state.favorites.find(function(item){return item.taskId===normalizedId;})||null
    };
  }

  window.BanxingTaskPrefs={
    storageKey:STORAGE_KEY,
    getFavorites:getFavorites,
    isFavorited:isFavorited,
    toggleFavorite:toggleFavorite
  };
})();

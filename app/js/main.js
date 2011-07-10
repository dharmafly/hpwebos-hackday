(function(){
    "use strict";

  var width = window.innerWidth,
      columns = 3,
      gutter = 10,
      db = createFakeDb();
  
  function loadDb(callback){
    db.fetchDataset(callback);
  }
  
  function onImagesLoaded(container, callback){
    var img = container.find("img"),
        imgToLoad = img.length,
        loaded = 0;
        
    img.bind("load error", function(){
      loaded ++;
      if (loaded === imgToLoad){
        callback(container);
      }
    });
  }

  function initNewpaper(container){
    container.masonry({
      itemSelector:"article",
      gutterWidth: gutter,
      columnWidth: 300
    });
  }

  function init(results) {
    var borough = document.location.hash.replace(/\#/,''),
        template = $(".articles").html(),
        html = Mustache.to_html(template, {articles: results}),
        container = $("#articles-container").html(html);
    
    onImagesLoaded(container, initNewpaper);
    initNewpaper(container);
  }

  loadDb(function(data) {
    init(data.results);
  });

}());

(function(){
    "use strict";

  var width = window.innerWidth,
      columns = 3,
      gutter = 10,
      db = createFakeDb(),
      articlesTemplate = jQuery(".articles").html(),
      contentSections = jQuery("#scroller > div.windows > section"),
      compassDirections = {"nw":0, "n":1, "ne":2, "w":3, "x":4, "e":5, "sw":6, "s":7, "se":8};
  
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

  function layoutNewspaper(container){
    container.masonry({
      itemSelector:"article",
      gutterWidth: gutter,
      columnWidth: 300
    });
  }
  
  function getElementByCompass(compass){
    var sectionIndex = compassDirections[compass];
    return contentSections.eq(sectionIndex);
  }
  
  function renderWindow(compass, data){
    var articles = data.results,
        html = Mustache.to_html(articlesTemplate, {articles: articles}),
        container = getElementByCompass(compass).html(html);
    
    layoutNewspaper(container);
    onImagesLoaded(container, layoutNewspaper);
  }

  function init() {
    // Centre location
    loadDb(function(data) {
      renderWindow("x", data);
      db.getAllNeighbourData(renderWindow);
    });
  }

  init();

}());

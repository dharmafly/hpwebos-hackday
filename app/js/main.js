(function(){
    "use strict";

  var width = window.innerWidth,
      db = createFakeDb(),
      articlesTemplate = jQuery(".articles").html(),
      contentSections = jQuery("#scroller > div.windows > section .articles-container"),
      compassDirections = {"nw":0, "n":1, "ne":2, "w":3, "x":4, "e":5, "sw":6, "s":7, "se":8},
      compassKeys = _(compassDirections).chain().keys().without("x").value(),
      currentlyProcessing;
  
  function loadDb(callback){
    db.fetchDataset(callback);
  }
  
  function onImagesLoaded(container, callback){
    var img = container.find("img"),
        imgToLoad = img.length,
        loaded = 0;
    
    if (imgToLoad){
      img.bind("load error", function(){
        loaded ++;
        if (loaded === imgToLoad){
          callback(container);
        }
      });
    }
    
    callback(container);
  }

  function layoutNewspaper(container){
    container.masonry({
      itemSelector:"article",
      gutterWidth: 20,
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
    
    onImagesLoaded(container, function(){
      layoutNewspaper(container);
      renderNextNeighbour(renderWindow);
    });
  }
  
  function renderNextNeighbour(callback){
    var compass;

    currentlyProcessing = currentlyProcessing ? currentlyProcessing + 1 : 0;
    compass = compassKeys[currentlyProcessing];
    
    if (compass){
      db.getNeighbourData(compass, function(data){
        callback(compass, data);
      });
    }
    else {
      currentlyProcessing = 0;
    }
  }

  function init() {
    // Centre location
    loadDb(function(data) {
      renderWindow("x", data);
        //db.getAllNeighbourData(renderWindow);
    });
  }

  init();

}());

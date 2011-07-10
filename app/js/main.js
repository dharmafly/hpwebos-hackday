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

// Initialise webOS
function initPalm(){
    if (window.PalmSystem) {
        window.PalmSystem.stageReady();
    }
}

function init(results) {
  var borough = document.location.hash.replace(/\#/,''),
      template = $(".guardian-articles").html(),
      html = Mustache.to_html(template, {articles: results}),
      container = $("#guardian-articles-container").html(html);
  
  onImagesLoaded(container, initNewpaper);
  initNewpaper(container);
}


initPalm();

loadDb(function (data) {
  init(data.results);
});

var width = window.innerWidth,
    columns = 3,
    gutter = 10,
    
    fakeDb = {
      _store: [],

      boroughList: function () {
        return _.pluck(this._store, "name");
      },

      getByBorough: function (borough) {
        return _.detect(this._store, function (record, index) {
          return record.name === borough;
        }).results;
      }
    };

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

function init() {
  var borough = document.location.hash.replace(/\#/,''),
      results = fakeDb.getByBorough('Hackney'),
      template = $(".guardian-articles").html(),
      html = Mustache.to_html(template, {articles: results}),
      container = $("#guardian-articles-container").html(html);
  
  onImagesLoaded(container, initNewpaper);
  initNewpaper(container);
}


initPalm();

jQuery(function loadDb ($) {
  $.ajax("extractors/guardian/data/guardian-travel.json",  {
    dataType: "json",
    type: "get",
    success: function (data) {
      fakeDb._store = data;
      init();
    }
  });
});

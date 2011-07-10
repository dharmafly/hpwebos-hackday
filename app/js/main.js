var width = window.innerWidth,
    columns = 3,
    gutter = 10,
    db = createFakeDb();

function createFakeDb(){
  return {
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
}

function loadDb(callback){
  jQuery.getJSON("extractors/guardian/data/guardian-travel.json", callback);
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

function init() {
  var borough = document.location.hash.replace(/\#/,''),
      results = db.getByBorough('Hackney'),
      template = $(".guardian-articles").html(),
      html = Mustache.to_html(template, {articles: results}),
      container = $("#guardian-articles-container").html(html);
  
  onImagesLoaded(container, initNewpaper);
  initNewpaper(container);
}


initPalm();

loadDb(function (data) {
  db._store = data;
  init();
});

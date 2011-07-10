var fakeDb = {
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

function main () {
  var borough = document.location.hash.replace(/\#/,''),
      results = fakeDb.getByBorough('Westminster'),
      template = $(".guardian-articles").html(),
      html = Mustache.to_html(template, {articles: results}),
      container = $("#guardian-articles-container").html(html),
      img = container.find("img"),
      imgToLoad = img.length,
      loaded = 0;
      
  img.bind("load error", function(){
    loaded ++;
    if (loaded === imgToLoad){
      initNewpaper(container);
    }
  });
}

function initNewpaper(container){
  container.masonry({
    itemSelector:"article",
    gutterWidth: 50,
    columnWidth: 250
  });
}

// Initialise webOS
function initPalm(){
    if (window.PalmSystem) {
        window.PalmSystem.stageReady();
    }
}



jQuery(function loadDb ($) {
  $.ajax("extractors/guardian/data/guardian-travel.json",  {
    dataType: "json",
    type: "get",
    success: function (data) {
      fakeDb._store = data;
      main();
    }
  });
});

jQuery(initPalm);

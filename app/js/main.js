var fakeDb = {
  _store: [],

  boroughList: function () {
    return _.pluck(this._store, "name");
  },

  getByborough: function (borough) {
    return _.detect(this._store, function (record, index) {
      return record.name === borough;
    }).results;
  }
};

function main () {
  var borough = document.location.hash.replace(/\#/,''),
      results = fakeDb.getByborough('Westminster'),
      template = $(".guardian-articles").html(),
      html = Mustache.to_html(template, {articles: results});


  var container = $("#guardian-articles-container").html(html);

  window.setTimeout(function(){  
    container.masonry({
      itemSelector:"article",
      gutterWidth: 50,
      columnWidth: 250
    });
  }, 250);
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

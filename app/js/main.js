var fakeDb = {
  _store: [],

  borroughList: function () {
    return _.pluck(this._store, "name");
  },

  getByBorrough: function (borrough) {
    return _.detect(this._store, function (record, index) {
      return record.name === borrough;
    }).results;
  }
};

function main () {

  var borrough = document.location.hash.replace(/\#/,''),
      results = fakeDb.getByBorrough('Westminster'),
      template = $(".guardian-articles").html(),
      html = Mustache.to_html(template, {articles: results});


  var container = $("#guardian-articles-container")
    .html(html);

  window.setTimeout(function(){  
    container.masonry({
      itemSelector:"article",
      gutterWidth: 50,
      columnWidth: 250
    });
  }, 250);

}



jQuery(function loadDb ($) {
  $.ajax("/extractors/guardian/data/guardian-travel.json",  {
    dataType: "json",
    type: "get",
    success: function (data) {
      fakeDb._store = data;
      main();
    }
  });
});


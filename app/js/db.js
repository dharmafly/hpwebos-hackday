function createFakeDb(){
  return {
      neighbourBaseurl: "data/0",
      neighbours: {},
      _cache: {}, //json file name => data

      currentDataset: "loc_-0.2179_51.6838.json",

      fetchDataset: function (dataset, callback) {

        if (arguments.length === 1) {
          callback = dataset;
          dataset = null;
        }


        var db = this,
            datasetFile = dataset ? dataset : db.currentDataset,
            url = this.neighbourBaseurl + "/" + datasetFile;

        jQuery.getJSON(url, function (data) {
          //update neighbourFiles hash
          db.neighbours = data.neighbours;
          db.currentDataset = data.neighbours.x;
          db._cache[datasetFile] = data.results;
          callback(data);
        });
      },

      getNeighbourData: function (coordinate, callback ) {
        var db = this,
            dataSetFile = this.neighbours[coordinate];

        if (dataSetFile in db._cache) {
          return db._cache.dataSetFile;
        }

        fetchDataset(dataSetFile, callback);

      }
    };
}

function createFakeDb(){
  return {
      neighbourBaseurl: "data/0",
      _cache: {}, //json file name => data

      currentDataset: "loc_-0.4393_51.5731",

      fetchDataset: function (dataset, callback) {
        if (arguments.length === 1) {
          callback = dataset;
          dataset = null;
        }
        
        var db = this,
            datasetFile = dataset ? dataset : db.currentDataset,
            url = this.neighbourBaseurl + "/" + datasetFile + ".json";

        jQuery.getJSON(url, function (data) {
          //update neighbourFiles hash
          if (!db.neighbours){
            db.neighbours = data.neighbours;
          }
          db._cache[datasetFile] = data.results;
          callback(data);
        });
      },

      getNeighbourData: function (coordinate, callback) {
        var db = this,
            dataSetFile = this.neighbours[coordinate];

        if (dataSetFile in db._cache) {
          return db._cache.dataSetFile;
        }

        this.fetchDataset(dataSetFile, callback);
      },
      
      /* WARNING: will blow up webOS - don't use */
      getAllNeighbourData: function(callback){
        var db = this;
      
        _.each(this.neighbours, function(data, compass){
          db.getNeighbourData(compass, function(data){
            callback(compass, data);
          });
        });
      }
    };
}

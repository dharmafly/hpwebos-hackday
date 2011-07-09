var request = require("request"),
    fs = require("fs"),
    Step = require("step"),
    section = "travel",
    params = {
      "api-key": "hpwebos",
      format: "json",
      section: "travel",
      "show-tags":"all",
      "show-media":"picture",
      "show-fields":"all",
      "page-size": 50
    },
    apiEndpoint = "http://content.guardianapis.com/search",
    borroughListFile = 'borrough-list.json',
    resultSet = {},
    borroughList;


/*
*
* Loads the list of London's borroughs from the file system.
*
*/

function loadBorroughList (callback) {
  fs.readFile(borroughListFile, function (error, stream) {

    if (error) {
      throw error;
    }

    borroughList = JSON.parse(stream.toString());
    callback();
  });
}

/*
* Builds a URI string.
*
* uri       - The base URI string.
* uriParams - A set of key value pairs representing the query parameters.
*
* Returns a string.
*
*/


function makeUri (uri, uriParams) {
  uri += "?";
  Object.keys(uriParams).forEach(function (paramName) {
    var value = uriParams[paramName];
    uri += paramName + "=" + value + "&";
  });
  return uri;
}

/*
* Verifies whether a Guardian api query result has more pages.
*
* data - A Guardian API result set in JSON format.
*
* Returns a boolean.
*
*/

function hasMorePages (data) {
  var response = data.response;
  return parseInt(response.currentPage,10) < parseInt(response.pages,10);
}

/*
*
* Check whether the number of keys in resultSet object
* is the same than the number of entries in the borrough list.
*
* returns nothing.
*
*/


function saveIfAllDone () {
  var borroughsFetched = Object.keys(resultSet).length,
      borroughsCount = borroughList.length,
      fileContent;

  if (borroughsCount > borroughsFetched) {
    console.log(">>> fetched %s of %s, %s to go...",
      borroughsFetched, borroughsCount, borroughsCount - borroughsFetched
    );
    return false;

  } else {

    fileContent = JSON.stringify(resultSet);
    fs.writeFile('data/guardian-travel.json', fileContent, function () {
      console.log("ResultSet saved!");
    });

  }
}

/*
* Extracts relevant data from a Guairdian API query result and appends it
* to the resultSet.
*
* borroughName - The borrough for which we are extracting data.
* results - The JSON search results returned by the Guardian API.
*
* Returns nothing
*/


function storeResults (borroughName, results) {
  if (! resultSet[borroughName]) {
    resultSet[borroughName] = [];
  }


  if (/^Kingston/.test( borroughName)) {
    console.info(results);
  }



  results.forEach(function (entry) {
    var record = {};

    record.title = entry.webTitle;
    record.url = entry.webUrl;
    record.description = entry.fields.trailerText;
    record.lat = entry.fields.latitude;
    record.lng = entry.fields.longitude;
    record.imageUrl = entry.fields.thumbnail;

    if (entry.mediaAssets) {
      record.attachments = entry.mediaAssets.map(function (asset) {
        return {
          url: asset.file,
          caption: asset.fields.caption
        };
      });
    }
    record.tags = entry.tags.map(function (tag) {
      if (["Turism", "London"].indexOf(tag.webTitle) === -1) {
        return tag.webTitle;
      }
    });

    resultSet[borroughName].push(record);
  });
}

/*
*
*
*
*
*/

function fetch(borroughListEntry, goAhead, page) {
  page = page || 1;
  borroughListEntry.query = borroughListEntry.query || borroughListEntry.name;

  var query = encodeURIComponent(borroughListEntry.query) + "+London",
      uri,
      nextPage;

  params.q = query;
  params.page = page;
  uri = makeUri(apiEndpoint, params);

  console.info("fetching....");

  request({uri: uri}, function (error, response, body ) {
    var data;

    if (! error && response.statusCode == 200 ) {

      data = JSON.parse(body);

      console.log("===========================================");
      console.log("URI: %s", uri);
      console.log("Total results %s", data.response.total);

      nextPage = parseInt(data.response.currentPage,10) + 1;
      storeResults(borroughListEntry.name, data.response.results);

      if (hasMorePages(data)) {
        fetch(borroughListEntry, goAhead, nextPage);
      } else {
        saveIfAllDone();
        goAhead();
      }
    } else {

      console.info(body);
    }
  });

}


loadBorroughList(function () {
  var queue = [];

  borroughList.forEach(function (entry) {
    queue.push(function (error) {
      var goAhead = this;

      if (error) { throw error;}

      fetch(entry, goAhead);
    });
  });

  Step.apply(null, queue);
});


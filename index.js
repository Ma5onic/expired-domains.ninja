var Map    = require("collections/fast-map");
var URI    = require('crawler-ninja/lib/uri');

var CONTENT_TYPE_HEADER = "content-type";
var CONTENT_LENGTH_HEADER = "content-length";

var ERROR_CODE_TIMEOUT = "ETIMEDOUT";
var ERROR_DNS_LOOKUP = "ENOTFOUND";

var STATUS_DNS_LOOKUP_ERROR = "DNS lookup failed";


/**
 *  Find expired domains
 *
 *  In progress
 */
function Plugin(crawler) {

    this.crawler = crawler;
    this.expireds = new Map();
    var self = this;

    this.crawler.on("error", function(error, result){

        if (error.code == ERROR_DNS_LOOKUP) {
          var host = URI.host(result.uri);
          console.log(host);
          self.expireds.set(host, {});
          //console.log(result.uri);
        }

    });
}


module.exports.Plugin = Plugin;

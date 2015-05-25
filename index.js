var Map    = require("collections/fast-map");
var URI    = require('crawler-ninja/lib/uri');
var log    = require("crawler-ninja/lib/logger.js").Logger;

var CONTENT_TYPE_HEADER = "content-type";
var CONTENT_LENGTH_HEADER = "content-length";

var ERROR_CODE_TIMEOUT = "ETIMEDOUT";
var ERROR_DNS_LOOKUP = "ENOTFOUND";

var STATUS_DNS_LOOKUP_ERROR = "DNS lookup failed";


/**
 *  Find expired domains
 *
 *  In progress ... please wait
 */
function Plugin(crawler) {

    this.crawler = crawler;
    this.expireds = new Map();
    var self = this;

    //this.log = log.createLogger("expireds", process.cwd() + "/logs/totos.log", true);
    //TODO : Get the resources with http status =  50*
    //       => get the root domaine & make a new request on it in order
    //       if it is the entire site that is on 50*
    //       => if so, add into a list to sites to follow & recheck later



    this.crawler.on("error", function(error, result){

        //TODO : Review this code, need to check other info on the domain :
        //       is available ?, pending delete ? PageRank ? TrustFlow/Citation Flow, ...  ?
        if (error.code == ERROR_DNS_LOOKUP) {
          var host = URI.host(result.uri);
          log.info({expired : true, host : host});

          self.expireds.set(host, {});

        }

    });
}


module.exports.Plugin = Plugin;

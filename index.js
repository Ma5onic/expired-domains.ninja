var Map    = require("collections/fast-map");
var URI    = require('crawler-ninja/lib/uri');
var log    = require("crawler-ninja/lib/logger.js");


var ERROR_DNS_LOOKUP = "ENOTFOUND";

var STATUS_DNS_LOOKUP_ERROR = "DNS lookup failed";


/**
 *  Find expired domains
 *
 *  In progress ... please wait
 */
function Plugin(crawler) {

    this.crawler = crawler;
    var self = this;

    var expiredLog = log.createLogger("expireds", "./expireds.log");

    //TODO :
    // For the resources with http status =  50*
    // 1. Check the root domain
    // if also in 500 => add to a list in order to check later if it moves to expired

    this.crawler.on("crawl", function(result,$) {

      if (result.statusCode >= 500 && result.statusCode <= 599 ) {

        expiredLog.info({"500" : true, status : result.statusCode, url : result.url});
      }
    });

    this.crawler.on("error", function(error, result){

        //TODO : Review this code, need to check other info on the domain :
        //       is available ?, pending delete ? PageRank ? TrustFlow/Citation Flow, ...  ?
        if (error.code == ERROR_DNS_LOOKUP) {

          var host = URI.host(result.uri);
          expiredLog.info({expired : true, host : host, url : result.url});

        }

    });
}


module.exports.Plugin = Plugin;

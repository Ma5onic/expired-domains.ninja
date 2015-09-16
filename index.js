var fs              = require('fs');
var URI             = require('crawler-ninja/lib/uri');
var log             = require("crawler-ninja/lib/logger.js");
var domainChecker   = require("check-domain");


var ERROR_DNS_LOOKUP = "ENOTFOUND";
var STATUS_DNS_LOOKUP_ERROR = "DNS lookup failed";
var EXPIRED_TXT_FILE = process.cwd() + "/expireds.txt";

/**
 *  Find expired domains
 *
 *  In progress ... please wait
 */
function Plugin(crawler) {

    this.crawler = crawler;


    var expiredLog = log.createLogger("expireds", {"path" : "./expireds.log"});

    this.crawler.on("crawl", function(result,$) {

      // a page with a status of 500+ can be expired
      if (result.statusCode >= 500 && result.statusCode <= 599 ) {

        expiredLog.info({"50*" : true, status : result.statusCode, url : result.url});
        check(URI.domain(result.uri));

      }
    });

    this.crawler.on("error", function(error, result){

        if (error.code == ERROR_DNS_LOOKUP) {
          var domain = URI.domain(result.uri);
          expiredLog.info({expired : true, domain : domain, url : result.url});
          check(URI.domain(result.uri));
        }
        else {
          // Just to be sure, catch other errors
          expiredLog.info({error : true, code : error.code, url : result.url});
        }

    });


}

check = function(domain) {
  console.log("Before call domainChecker");
  domainChecker({domain : domain}, function(error, result){
      console.log(result);
      fs.appendFile(EXPIRED_TXT_FILE, result.domain + "," + result.pr + "," + result.available + "," / result.whois);
      console.log("After call domainChecker");
  });
}

module.exports.Plugin = Plugin;

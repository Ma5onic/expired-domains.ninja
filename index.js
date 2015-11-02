var fs              = require('fs');
var URI             = require('crawler-ninja-uri');
var logs            = require("crawler-ninja-logger");
var domainChecker   = require("check-domain");


var ERROR_DNS_LOOKUP = "ENOTFOUND";
var STATUS_DNS_LOOKUP_ERROR = "DNS lookup failed";
var EXPIRED_TXT_FILE = process.cwd() + "/expireds.txt";
var NOT_AVAILABLE_TXT_FILE = process.cwd() + "/not-available-errors.txt";
var crawlLog = logs.Logger;

var expiredTxtFile = EXPIRED_TXT_FILE;
var notAvailableTxtFile = NOT_AVAILABLE_TXT_FILE;
/**
 *  Find expired domains
 *
 *  In progress ... please wait
 */
function Plugin(params) {

    this.params = params;
    var logFile = "./logs/expireds.log";
    if (params && params.logFile) {
      logFile = params.logFile;
    }
    this.expiredLog = logs.createLogger("expireds", {"path" : logFile});

    if (params && params.expiredTxtFile) {
      expiredTxtFile = params.expiredTxtFile;
    }

    if (params && params.notAvailableTxtFile) {
      notAvailableTxtFile = params.notAvailableTxtFile;
    }

    this.domains = [];


}

Plugin.prototype.crawl = function (result,$, callback) {

      // a page with a status of 500+ can be expired
      if (result.statusCode >= 500 && result.statusCode <= 599 ) {
        crawlLog.info({"url" : result.uri, "step" : "expired-domains-plugin", "message" : "Crawl status 500 "});
        //TODO : How to check if the domain name is valid ? At least if the url is valid ?
        this.expiredLog.info({"50*" : true, status : result.statusCode, url : result.url});
        if (URI.isValidDomain(result.uri)) {
          this.check(URI.domain(result.uri), callback);
        }
        else {
          callback();
        }


      }
      else {
        callback();
      }

}

Plugin.prototype.error = function(error, result, callback) {

        crawlLog.info({"url" : result.uri, "step" : "expired-domains-plugin", "message" : "error" });
        if (error.code == ERROR_DNS_LOOKUP) {
          var domain = URI.domain(result.uri);
          this.expiredLog.info({expired : true, domain : domain, url : result.url});
          if (URI.isValidDomain(result.uri)) {
            this.check(URI.domain(result.uri), callback);
          }
          else {
            callback();
          }
        }
        else {
          // Just to be sure, catch other errors
          this.expiredLog.info({error : true, code : error.code, url : result.url});
          callback();
        }

}


Plugin.prototype.check = function(domain, callback) {
    crawlLog.info({"url" : domain, "step" : "expired-domains-plugin", "message" : "check"});

    // don't check twice the same domain
    if (this.domains.indexOf(domain) > -1) {
      return callback();
    }
    else {
      this.domains.push(domain);
    }

    this.params.domain = domain;

    domainChecker(this.params, function(error, result) {

        if (error) {
          return callback(error);
        }

        var line = getLine(result);

        if (result.available == "NOT-AVAILABLE") {

            fs.appendFile(notAvailableTxtFile, line);
        }
        else {
            fs.appendFile(expiredTxtFile, line);
        }

        callback();
    });
}

/**
 * Build a new line. the line format is composed of the following data :
 *
 * domain name, PR, availability, whois, external backlinks, ref domains, ref domains edu, ref domains gov,
 * TrustFlow, CitationFlow, TopicalTrustFlow 1, TopicalTrustFlow Value 1, TopicalTrustFlow 2, TopicalTrustFlow Value 2,
 * TopicalTrustFlow 2, TopicalTrustFlow Value 2
 */
function getLine(result) {
    //console.log(result);
    var line = result.domain + "," + result.isAlive + "," + result.pr  + "," + result.available;

    if (result.whois) {
      line += "," + result.whois.missingData + "," + result.whois.isValidDomain + "," + result.whois.isPendingDelete +
              "," + result.whois.createdDate + "," + result.whois.expiresDate + "," + result.whois.expiredWaitingTime +
              "," + result.whois.estimatedDomainAge;

    }

    if (result.majestic) {
      line += "," + result.majestic.ExtBackLinks + "," + result.majestic.RefDomains + "," +
      result.majestic.RefDomainsEDU + "," + result.majestic.RefDomainsGOV + "," +
      result.majestic.TrustFlow + "," + result.majestic.CitationFlow + "," +
      result.majestic.TopicalTrustFlow_Topic_0 + "," + result.majestic.TopicalTrustFlow_Value_0 + "," +
      result.majestic.TopicalTrustFlow_Topic_1 + "," + result.majestic.TopicalTrustFlow_Value_1 + "," +
      result.majestic.TopicalTrustFlow_Topic_2 + "," + result.majestic.TopicalTrustFlow_Value_2;
    }
    line += "\n";

    return line;
}

module.exports.Plugin = Plugin;

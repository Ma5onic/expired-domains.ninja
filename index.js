var fs              = require('fs');
var _               = require('underscore');
var URI             = require('crawler-ninja-uri');
var log             = require("crawler-ninja-logger").Logger;
var checkDomain     = require("check-domain");


var ERROR_DNS_LOOKUP = "ENOTFOUND";
var STATUS_DNS_LOOKUP_ERROR = "DNS lookup failed";

/**
 *  Find expired domains
 *
 *  In progress ... please wait
 */
function Plugin(params) {

    this.params = params;
    if (params && params.expiredTxtFile) {
      this.expiredTxtFile = params.expiredTxtFile;
    }

    this.domains = [];
}

Plugin.prototype.crawl = function (result,$, callback) {

      // a page with a status between 400 & 500 can be an expired domain or a domain to track
      if (result.isExternal && result.statusCode >= 400 && result.statusCode <= 599 ) {
        if (URI.isValidDomain(result.url)) {
          log.info({"url" : result.url, "step" : "expired-domains-plugin", "message" : "External URL with an HTTP status : " + result.statusCode});
          this.check(result.url, result.statusCode, callback);
        }
        else {
          callback();
        }


      }
      else {
        callback();
      }

};

Plugin.prototype.error = function(error, result, callback) {

        if (result.isExternal) {

          if (URI.isValidDomain(result.url)) {
            log.info({"url" : result.url, "step" : "expired-domains-plugin", "message" : "External URL with an HTTP error : " + error.code});
            this.check(result.url, error.code, callback);
          }
          else {
            callback();
          }
        }
        else {
          callback();
        }

};

/**
 *  Check domain
 *
 *
 * @param
 * @return
 */
Plugin.prototype.check = function(url, errorInfo, callback) {

    var domain = URI.domain(url);
    // don't check twice the same domain
    if (this.domains.indexOf(domain) > -1) {
      return callback();
    }
    else {
      this.domains.push(domain);
    }

    var params = _.clone(this.params);
    params.domain = domain;
    var self = this;
    checkDomain(params, function(error, result) {

        if (error) {
          return callback(error);
        }

        if (! result.isDNSFound) {
          var line = getLine(result, url, errorInfo);
          fs.appendFile(self.expiredTxtFile, line);
        }


        callback();
    });
};

/**
 * Build a new line. the line format is composed of the following data :
 *
 */
function getLine(result, url, errorInfo) {

    var line = result.domain + "," + result.isDNSFound + ", " + (result.ip ? result.ip : "not-found") + "," +  result.isAlive + ","  + result.isAvailable;

    if (result.whois) {
      line += "," + result.whois.missingData + "," + result.whois.isValidDomain + "," + result.whois.isPendingDelete +
              "," + result.whois.isRedemptionPeriod + "," + result.whois.createdDate + "," + result.whois.expiresDate +
              "," + result.whois.expiredWaitingTime + "," + result.whois.estimatedDomainAge;

    }

    if (result.majestic) {
      line += "," + result.majestic.ExtBackLinks + "," + result.majestic.RefDomains + "," +
      result.majestic.RefDomainsEDU + "," + result.majestic.RefDomainsGOV + "," +
      result.majestic.TrustFlow + "," + result.majestic.CitationFlow + "," +
      (result.majestic.CitationFlow / result.majestic.TrustFlow) + "," +
      result.majestic.TopicalTrustFlow_Topic_0 + "," + result.majestic.TopicalTrustFlow_Value_0 + "," +
      result.majestic.TopicalTrustFlow_Topic_1 + "," + result.majestic.TopicalTrustFlow_Value_1 + "," +
      result.majestic.TopicalTrustFlow_Topic_2 + "," + result.majestic.TopicalTrustFlow_Value_2;
    }

    line += ',' + errorInfo + ',' + url + "\n";

    return line;
}

module.exports.Plugin = Plugin;

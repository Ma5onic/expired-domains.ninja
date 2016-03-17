var assert    = require("assert");
var logger    = require("crawler-ninja/plugins/console-plugin");
var crawler   = require("crawler-ninja");
var testSite  = require("./website/start.js").site;

var expired   = require("../index.js");


describe('Expired domains plugin', function() {

        it('Should return a list of expired domains', function(done) {
            this.timeout(40000);
            var end = function(){
                done();
            };

            crawler.init({
                externalDomains : true,
                externalHosts : true,
                firstExternalLinkOnly : true,
                images : false,
                scripts : false,
                links : false, //link tags used for css, canonical, ...
                followRedirect : true,
                retries : 0,
                //secureOptions : require('constants').SSL_OP_NO_TLSv1_2,
                //rejectUnauthorized : false

            }, end);

            var log = new logger.Plugin();
            var ed = new expired.Plugin({expiredTxtFile : "./logs/expireds.txt"});
            crawler.registerPlugin(ed);
            crawler.registerPlugin(log);


            crawler.queue({url : "http://localhost:9999"});

        });
});

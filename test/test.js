var assert    = require("assert");
var logger    = require("crawler-ninja/plugins/log-plugin");
var crawler   = require("crawler-ninja");
var testSite  = require("./website/start.js").site;

var expired   = require("../index.js");


describe('Expired domains plugin', function() {

        it('Should return a list of expired domains', function(done) {

            var c = new crawler.Crawler({
                externalLinks : true,
                images : false,
                scripts : false,
                links : false, //link tags used for css, canonical, ...
                followRedirect : true,
                retries : 0

            });

            var log = new logger.Plugin(c);
            var ed = new expired.Plugin(c);


            c.on("end", function(){

                //assert(ed.expireds.length == 2);
                //assert(ed.expireds.keys()[0] == "www.thisnotcorrect.abc");
                //assert(ed.expireds.keys()[1] == "www.thisnotcorrect2.abz");

                done();

            });

            c.queue({url : "http://localhost:9999/index.html"});

        });
});

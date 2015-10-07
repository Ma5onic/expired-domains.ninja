Expired Domains Finder
---------------------

This [Crawler.Ninja](https://github.com/christophebe/crawler.ninja)  plugin aims to find expired domains by crawling web sites.

Help & Forks welcome ! or please wait ... work in progress !

How to install
--------------

    $ npm install crawler-ninja crawler-ninja-expired simple-proxies --save


Crash course
------------


```javascript
var proxyLoader = require("simple-proxies/lib/proxyfileloader");
var crawler     = require("crawler-ninja");
var ep          = require("crawler-ninja-expired");

var proxyFile = "proxies.txt";

// Load proxies
var config = proxyLoader.config()
                        .setProxyFile(proxyFile)
                        .setCheckProxies(true)
                        .setRemoveInvalidProxies(true);

proxyLoader.loadProxyFile(config, function(error, proxyList) {
    if (error) {
      console.log(error);

    }
    else {
       crawl(proxyList);
    }

});


function crawl(proxyList){
    var c = new crawler.Crawler({
        externalDomains : true,
        images : false,
        scripts : false,
        links : false, //link tags used for css, canonical, ...
        followRedirect : true,
        proxyList : proxyList
    });

    var expired = new ep.Plugin(c);

    c.on("end", function() {

        var end = new Date();
        console.log("Well done Sir !, done in : " + (end - start));
        // the attributes expireds is a map with a key that match to the expired domains
        console.log(ed.expireds.keys())



    });

    var start = new Date();
    c.queue({url : "http://www.site.com"});
}





```

Using proxies is not mandatory but it is recommanded.Remove the attributes proxyList in the crawler constructor if you don't want to use proxies.

You can find all the crawler options on this [page](https://github.com/christophebe/crawler.ninja).


Rough todolist
--------------

 * Check if the domain is available and/or status (pending, ... )
 * Get Pagerank, TrustFlow and Citation Flow
 * Get the number of linked domains, anchor text infos, ...
 * Use Riak as default persistence layer



ChangeLog
---------

0.1.0
 - Basic implementation that logs domain that match to dns error

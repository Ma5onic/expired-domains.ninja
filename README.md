Expired Domains Finder
---------------------

This [Crawler.Ninja](https://github.com/christophebe/crawler.ninja)  plugin aims to find expired domains by crawling web sites.

Help & Forks welcome ! or please wait ... work in progress !

Actually, the expired domain data are stored in the a txt file. We plan to add more flexibilities in the upcoming releases.

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
  var end = function(){
    console.log("Crawl done !");
  };

  // Set the Crawl config
  crawler.init({
      externalDomains : true,
      externalHosts : true,
      firstExternalLinkOnly : true,
      images : false,
      scripts : false,
      links : false, //link tags used for css, canonical, ...
      followRedirect : true,
      retries : 0
  }, end, proxyList);

  var ed = new expired.Plugin({
       expiredTxtFile : "./logs/expireds.txt",
       majecticKey : "[your majecticKey]",
       whois : {user : "[your whoisxmlapi name]", password : "[your whoisxmlapi password]"}
  });
  crawler.registerPlugin(ed);

  crawler.queue({url : "http://yourdomain.com"});
}


```

Using proxies is not mandatory but it is recommanded. Remove the attributes proxyList in the crawler constructor if you don't want to use proxies.

You can find all the crawler options on this [page](https://github.com/christophebe/crawler.ninja).


Rough todolist
--------------

 * Get the number of linked domains, anchor text infos, ...

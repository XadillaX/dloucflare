/**
 * XadillaX created at 2015-09-17 17:58:35 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
require("should");
var spidex = require("spidex");
var IPGETTER = require("../").IPGETTER;

describe("# ip getters", function() {
    this.timeout(0);
    var stdIp;

    before(function(done) {
        spidex.get("http://www.telize.com/ip", {
            charset: "utf8",
            timeout: 120000
        }, function(html) {
            stdIp = html;
            while(stdIp[stdIp.length - 1] === "\n") {
                stdIp = stdIp.substr(0, stdIp.length - 1);
            }

            done();
        }).on("error", function(err) {
            console.error(err);
        });
    });

    for(var key in IPGETTER) {
        if(!IPGETTER.hasOwnProperty(key)) continue;

        (function(key) {
            it(key + " should get ip", function(done) {
                IPGETTER[key](function(err, ip) {
                    (err instanceof Error).should.be.eql(false);
                    ip.should.be.eql(stdIp);
                    done();
                });
            });
        })(key); /* jshint ignore:line */
    }
});

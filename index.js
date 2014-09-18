/**
 * Created by XadillaX on 2014/9/18.
 */
require("sugar");
var DloucFlare = require("./lib/dloucflare");
var DDNS = require("./lib/ddns");

exports.create = function(email, apiKey, domain) {
    var dloucflare = new DloucFlare(email, apiKey, domain);
    return new DDNS(dloucflare);
};

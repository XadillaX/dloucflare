/**n
 * Created by XadillaX on 2014/9/18.
 */
var spidex = require("spidex");
var DNSRecordObject = require("./dnsrecordobject");

/**
 * Dlouc Flare
 * @param email
 * @param apiKey
 * @param domain
 * @constructor
 */
var DloucFlare = function(email, apiKey, domain) {
    this.email = email;
    this.apiKey = apiKey;
    this.domain = domain.toLowerCase();

    this.records = [];
};

/**
 * get dns records
 * @param callback
 */
DloucFlare.prototype.getDNSRecords = function(callback) {
    if(undefined === callback) callback = function(){};

    var self = this;
    var param = {
        a       : "rec_load_all",
        tkn     : this.apiKey,
        email   : this.email,
        z       : this.domain
    };

    var url = "https://www.cloudflare.com/api_json.html";
    spidex.post(url, function(html, status) {
        if(status !== 200) {
            return callback(new Error("Error status while fetching DNS records."));
        }

        var json;
        try {
            json = JSON.parse(html);
        } catch(e) {
            return callback(new Error("Error while parsing DNS records: " + e.message));
        }

        if(json.result === "error") {
            var msg = json.msg;
            if(undefined === msg) msg = "Unknown error.";
            return callback(new Error(msg));
        } else if(json.result === "success") {
            var count = json.response.recs.count;
            var objects = json.response.recs.objs;
            for(var i = 0; i < count; i++) {
                self.records.push(new DNSRecordObject(self, objects[i]));
            }

            callback(undefined, self.records);
        } else {
            callback(new Error("Unknown error."));
        }
    }, param, "utf8").on("error", callback);
};

module.exports = DloucFlare;

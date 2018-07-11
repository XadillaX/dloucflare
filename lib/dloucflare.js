/**
 * Created by XadillaX on 2014/9/18.
 */
var spidex = require("spidex");
var qs = require("querystring");
var DNSRecordObject = require("./dnsrecordobject");

/**
 * Dlouc Flare
 * @param email
 * @param apiKey
 * @param domain
 * @constructor
 */
var DloucFlare = function(email, apiKey, domain, zoneId) {
    this.email = email;
    this.apiKey = apiKey;
    this.domain = domain.toLowerCase();
    this.zoneId = zoneId;

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

    var url = "https://api.cloudflare.com/client/v4/zones/" + self.zoneId + "/dns_records";
    url = url + "?" + qs.stringify({
        page: 1,
        "per_page": 200,
        order: "type",
        direction: "asc"
    });
    spidex.get(url, {
        charset: "utf8",
        header: {
            "X-Auth-Key": self.apiKey,
            "X-Auth-Email": self.email
        },
        timeout: 10000
    }, function(html, status) {
        if(status !== 200) {
            return callback(new Error("Error status while fetching DNS records."));
        }

        var json;
        try {
            json = JSON.parse(html);
        } catch(e) {
            return callback(new Error("Error while parsing DNS records: " + e.message));
        }
        if(json.success === false) {
            var msg = json.errors ? JSON.stringify(json.errors) : undefined;
            if(undefined === msg) msg = "Unknown error.";
            return callback(new Error(msg));
        } else if(json.success === true) {
            var count = json["result_info"]["total_count"];
            var objects = json.result;
            for(var i = 0; i < count; i++) {
                self.records.push(new DNSRecordObject(self, objects[i]));
            }

            callback(undefined, self.records);
        } else {
            callback(new Error("Unknown error."));
        }
    }).on("error", callback);
};

module.exports = DloucFlare;

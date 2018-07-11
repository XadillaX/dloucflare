/**
 * Created by XadillaX on 2014/9/18.
 */
var config = require("../config");
var spidex = require("spidex");

/**
 * DNS record object
 * @param df
 * @param origObject
 * @constructor
 */
var DNSRecordObject = function(df, origObject) {
    this.dloucflare = df;
    this.object = origObject;

    // some information
    this.recordId = this.object.id;
    this.domain = this.object.zone_name;
    this.name = this.object.name;
    this.alias = this.name.replace("." + this.domain, ""); // todo
    if(this.name === this.domain) this.alias = "@";
};

/**
 * record type
 * @returns {*}
 */
DNSRecordObject.prototype.recordType = function() {
    return this.object.type;
};

/**
 * record id
 * @returns {*}
 */
DNSRecordObject.prototype.recordId = function() {
    return this.recordId;
};

/**
 * record ip
 * @returns {*}
 */
DNSRecordObject.prototype.recordIp = function() {
    return this.object.content;
};

/**
 * modify ip
 * @param ip
 * @param callback
 * @returns {*}
 */
DNSRecordObject.prototype.modifyIp = function(ip, callback) {
    if(undefined === callback) callback = function(){};

    if(this.recordType() !== "A") {
        return callback(new Error("Domain must be an A type."));
    }

    var param = {
        type: "A",
        name: this.name,
        content: ip,
        ttl: this.object.ttl,
        proxied: this.object.proxied
    };

    var self = this;

    var url = "https://api.cloudflare.com/client/v4/zones/" + self.dloucflare.zoneId +
     "/dns_records/" + self.recordId;

    spidex.put(url, {
        data: JSON.stringify(param),
        charset: "utf8",
        timeout: 10000,
        header: {
            "X-Auth-Key": self.dloucflare.apiKey,
            "X-Auth-Email": self.dloucflare.email,
            "content-type": "application/json"
        },
    }, function(html, status) {
        if(status !== 200) {
            return callback(new Error("Error status while editing " + self.name + "."));
        }

        var json;
        try {
            json = JSON.parse(html);
        } catch(e) {
            return callback(new Error("Error while parsing editing result: " + e.message));
        }

        if(json.success === true) {
            self.object.content = ip;
            return callback();
        } else {
            var msg = JSON.stringify(json.errors) || "Unknown error.";
            return callback(new Error(msg));
        }
    }).on("error", callback);
};

module.exports = DNSRecordObject;

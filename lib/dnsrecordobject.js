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
    this.domain = this.object.zone_name;
    this.name = this.object.display_name;
    this.alias = this.name;
    if(this.alias === this.domain) this.alias = "@";
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
    return this.object.rec_id;
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
        a       : "rec_edit",
        tkn     : this.dloucflare.apiKey,
        email   : this.dloucflare.email,
        id      : this.recordId(),

        z       : this.domain,
        type    : this.recordType(),
        name    : this.name,
        content : ip,

        service_mode    : this.object.service_mode,
        ttl     : this.object.ttl
    };

    var self = this;
    spidex.post(config.baseUrl, {
        data: param,
        charset: "utf8",
        timeout: 10000
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

        if(json.result === "success") {
            self.object.content = ip;
            return callback();
        } else {
            var msg = json.msg || "Unknown error.";
            return callback(new Error(msg));
        }
    }).on("error", callback);
};

module.exports = DNSRecordObject;

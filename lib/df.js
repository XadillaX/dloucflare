/**
 * Created with JetBrains WebStorm.
 * User: xadillax
 * Date: 9/7/13
 * Time: 9:35 PM
 * DloucFlare : The dynamic cloudflare domain updater.
 */
var spider = require("nodegrassex");
var querystring = require("querystring");
var logger = require("./logger")

/**
 * The constructor function
 * @param email
 * @param apikey
 * @param domain
 */
function dloucflare(email, apikey, domain) {
    this.email = email;
    this.apikey = apikey;
    this.domain = domain.toLowerCase();

    this.records = null;

    this.autoRunning = false;
};

/**
 * Get the DNS records of one domain.
 * @param callback
 */
dloucflare.prototype.getDNSRecords = function(callback) {
    if(this.autoRunning) {
        if(callback !== undefined) {
            callback.bind(this)(false, "The dloucflare object is in auto running mode", null);
        }
        return;
    }

    /**
     * Get the records via the API of cloudflare.
     * @refer http://www.cloudflare.com/docs/client-api.html#s3.3
     *
     * curl https://www.cloudflare.com/api_json.html \
     *   -d 'a=rec_load_all' \
     *   -d 'tkn=8afbe6dea02407989af4dd4c97bb6e25' \
     *   -d 'email=sample@example.com' \
     *   -d 'z=example.com'
     */
    var param = {
        "a"     : "rec_load_all",
        "tkn"   : this.apikey,
        "email" : this.email,
        "z"     : this.domain
    };
    var paramstr = querystring.stringify(param);

    var url = "https://www.cloudflare.com/api_json.html?" + paramstr;

    var self = this;
    spider.get(url, function(data, status, respheader) {
        /**
         * If the status is wrong.
         */
        if(status !== 200) {
            if(callback !== undefined) {
                callback.bind(self)(false, "Wrong GET status", null);
            }
            return;
        }

        try {
            var json = JSON.parse(data);
        } catch(e) {
            /**
             * If the json string is wrong.
             */
            if(callback !== undefined) {
                callback.bind(self)(false, "Received a wrong JSON string", null);
            }
            return;
        }

        /**
         * An error occurred told by JSON.
         */
        if(json["result"] === "error") {
            var msg = json["msg"];
            if(undefined === msg) msg = "Unknown error";

            if(callback !== undefined) {
                callback.bind(self)(false, msg, null);
            }
            return;
        } else if(json["result"] === "success") {
            var droclass = require("./dro");
            var dro = new droclass(self.email, self.apikey, self.domain);

            /**
             * Push each DNS record to the record array.
             */
            for(var i = 0; i < json["response"]["recs"]["count"]; i++) {
                dro._pushRecord(json["response"]["recs"]["objs"][i]["display_name"], json["response"]["recs"]["objs"][i]);
            }

            if(callback !== undefined) {
                self.records = dro;
                callback.bind(self)(true, "", dro);
            }
        } else {
            /**
             * Unknown error
             * @type {string}
             */
            var msg = "Unknown error";

            if(callback !== undefined) {
                callback.bind(self)(false, msg, null);
            }
            return;
        }
    }, {}, "utf8").on("error", function(e) {
        if(callback !== undefined) {
            callback.bind(self)(false, e.message, null);
        }
        return;
    });
};

/**
 * Modify a record's IP
 * @param name
 * @param ip
 * @param callback
 */
dloucflare.prototype.modifyIP = function(name, ip, callback) {
    /**
     * No record yet.
     */
    if(this.records === null) {
        if(undefined !== callback) {
            callback.bind(this)(false, "No record object yet");
        }
        return;
    }

    /**
     * No such record or not A record
     */
    if(name === this.domain) name = "@";
    var record = this.records.getRecord(name);
    if(record === null) {
        if(undefined !== callback) {
            callback.bind(this)(false, "No such record");
        }
        return;
    }
    if(record.getType() !== "A") {
        if(undefined !== callback) {
            callback.bind(this)(false, "Not an A record");
        }
        return;
    }
    if(name === "@") name = this.domain;

    /**
     * Modify one record
     * @refer
     */
    var param = {
        "a"     : "rec_edit",
        "tkn"   : this.apikey,
        "email" : this.email,
        "id"    : record.getID(),

        "z"     : this.domain,
        "type"  : "A",
        "name"  : name,
        "content" : ip,

        "service_mode" : record["service_mode"],
        "ttl"   : record["ttl"]
    };

    var paramstr = querystring.stringify(param);

    var url = "https://www.cloudflare.com/api_json.html?" + paramstr;

    var self = this;
    spider.get(url, function(data, status, respheader) {
        /**
         * If the status is wrong.
         */
        if(status !== 200) {
            if(callback !== undefined) {
                callback.bind(self)(false, "Wrong GET status");
            }
            return;
        }

        try {
            var json = JSON.parse(data);
        } catch(e) {
            /**
             * If the json string is wrong.
             */
            if(callback !== undefined) {
                callback.bind(self)(false, "Received a wrong JSON string");
            }
            return;
        }

        if(json["result"] === "success") {
            if(name === self.domain) name = "@";
            self.records.obj[name]["content"] = ip;

            if(callback !== undefined) {
                callback.bind(self)(true, "");
            }
            return;
        } else {
            var msg = json["msg"];
            if(msg === undefined || msg === null) {
                msg = "Unknown error";
            }

            if(callback !== undefined) {
                callback.bind(self)(false, msg);
            }
            return;
        }
    }, {}, "utf8").on("error", function(e) {
        if(callback !== undefined) {
            callback.bind(self)(false, e.message);
        }
        return;
    });
};

/**
 * The impl function
 * @param df
 * @param names
 * @param time
 * @private
 */
function _dynamic(df, names, time) {
    /**
     * Stopped.
     */
    if(df.autoRunning !== true) {
        logger.log("The dloucflare object is stopped.", df.domain);
        return;
    }

    /**
     * Get current IP.
     *
     * @refer http://ip-api.com/docs/api:json
     */
    var ipurl = "http://ip-api.com/json";
    spider.get(ipurl, function(data, status, respheader) {
        if(status !== 200) {
            logger.log("Error while getting IP: Wrong status. Skip this round.", df.domain, "WARN");
            setTimeout(_dynamic, time, df, names, time);
            return;
        }

        /**
         * Parse the JSON
         */
        try {
            var json = JSON.parse(data);
        } catch(e) {
            logger.log("Error while getting IP: Wrong JSON data. Skip this round.", df.domain, "WARN");
            setTimeout(_dynamic, time, df, names, time);
            return;
        }

        var ip = json["query"];
        //ip = "1.1.1.1";     ///< test.
        if(json["query"] === undefined) {
            logger.log("Error while getting IP: Wrong JSON data. Skip this round.", df.domain, "WARN");
            setTimeout(_dynamic, time, df, names, time);
            return;
        } else {
            /**
             * Visit all the names in the array.
             */
            for(var i = 0; i < names.length; i++) {
                var nm = names[i];

                /**
                 * If the IP of that record doesn't meet current one, we should modify it.
                 */
                var record = df.records.getRecord(nm);
                if(record.getType() !== "A" || record.getIP() !== ip) {
                    var str = "Subdomain " + nm + " should be modified to " + ip + " (current: ";
                    if(record.getType() !== "A") str += "type " + record.getType() + ").";
                    else str += record.getIP() + ").";

                    logger.log(str, df.domain);

                    df.modifyIP(nm, ip, function(status, msg) {
                        if(!status) {
                            logger.log("Error while modifying subdomain " + nm + ": " + msg + ".", df.domain, "WARN");
                            return;
                        } else {
                            logger.log("Successfully modifying subdomain " + nm, df.domain);
                            return;
                        }
                    });
                }
            }

            setTimeout(_dynamic, time, df, names, time);
        }
    }, {}, "utf8").on("error", function(e) {
        logger.log("Error while getting IP: " + e.message + ". Skip this round.", df.domain, "WARN");
        setTimeout(_dynamic, time, df, names, time);
        return;
    });
}

/**
 * Auto changing domains with their dynamic IP.
 * @param namearray
 */
dloucflare.prototype.dynamicDomains = function(nameArray, timeOut) {
    if(this.autoRunning) {
        logger.log("This dloucflare object is already running.", this.domain, "WARN");
        return;
    }

    this.getDNSRecords(function(status, msg, records) {
        if(!status) {
            logger.log("Error while starting dynamic service: " + msg + ".", this.domain, "ERROR");
            return;
        }

        this.autoRunning = true;

        /**
         * Go to the impl function.
         */
        setTimeout(_dynamic, 1, this, nameArray, timeOut);
    });
}

/**
 * Export object.
 * @type {Function}
 */
module.exports = dloucflare;

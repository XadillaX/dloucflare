/**
 * Created by XadillaX on 2014/9/18.
 */
var Scarlet = require("scarlet-task");
var IPGETTER = require("./ipgetters");

/**
 * ddns
 * @param dloucflare
 * @constructor
 */
var DDNS = function(dloucflare) {
    this.dloucflare = dloucflare;
    this.getIpFunction = undefined;

    this.scarlet = new Scarlet(10);
};

/**
 * setIpGetter
 * @param {Function} getter the ip getter function
 */
DDNS.prototype.setIpGetter = function(getter) {
    this.getIp = getter;
};

/**
 * get current server ip
 * @param callback
 */
DDNS.prototype.getIp = IPGETTER.TELIZE;

/**
 * _changeIp
 * @param {TaskObject} TO the scarlet task object
 */
DDNS.prototype._changeIp = function(TO) {
    var task = TO.task;
    var ip = task.ip;
    var dnsRecord = task.object;

    if(dnsRecord.recordIp() === ip) {
        console.log("Domain " + dnsRecord.object.name + "'s ip equals to current server ip: " + ip + ".");
        return this.scarlet.taskDone(TO);
    }

    var self = this;
    dnsRecord.modifyIp(ip, function(err) {
        if(err) {
            console.log(
                "Domain " + dnsRecord.object.name + "(" + dnsRecord.object.content +
                ") can't change to ip " + ip + ": " + err.message);
        } else {
            console.log("Domain " + dnsRecord.object.name + " changed ip to " + ip + ".");
        }

        self.scarlet.taskDone(TO);
    });
};

/**
 * dynamic domains
 * @param subdomains
 * @param interval
 * @param callback
 */
DDNS.prototype.dynamicDomains = function(subdomains, interval, callback) {
    if(callback === undefined) callback = function() {};
    var self = this;

    // get domains
    this.dloucflare.getDNSRecords(function(err, records) {
        if(err) {
            return callback(err);
        }

        var subdomainsObject = subdomains.map(function(subdomain) {
            for(var i = 0; i < records.length; i++) {
                if(records[i].alias === subdomain.toLowerCase()) {
                    if(records[i].recordType() === "A") {
                        return records[i];
                    } else {
                        return undefined;
                    }
                }
            }

            return undefined;
        }).compact(true);

        var _do = function() {
            // get ip
            var ipFunc = (undefined === self.getIpFunction) ? self.getIp : self.getIpFunction;
            ipFunc(function(err, ip) {
                if(err) {
                    return console.log("Error occurred while fetching curreng ip: " + err.message);
                }

                console.log("Current server IP: " + ip);

                for(var i = 0; i < subdomainsObject.length; i++) {
                    self.scarlet.push({
                        ip: ip,
                        object: subdomainsObject[i]
                    }, self._changeIp.bind(self));
                }
            });
        };

        process.nextTick(_do);
        var intervalId = setInterval(_do, interval);

        return callback(undefined, intervalId);
    });
};

module.exports = DDNS;

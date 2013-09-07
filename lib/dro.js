/**
 * Created with JetBrains WebStorm.
 * User: xadillax
 * Date: 9/7/13
 * Time: 9:35 PM
 * DloucFlare : The dynamic cloudflare domain updater.
 */
function dnsRecordObject(email, apikey, domain) {
    this.obj = [];
    this.email = email;
    this.apikey = apikey;
    this.domain = domain;
};

/**
 * Set the dns records. Used by dlouc flare.
 * @param obj
 * @private
 */
dnsRecordObject.prototype._setRecords = function(obj) {
    this.obj = obj;
}

/**
 * Push one record to the array. Used by dlouc flare.
 * @param obj
 * @private
 */
dnsRecordObject.prototype._pushRecord = function(name, obj) {
    if(name === this.domain) name = "@";
    this.obj[name] = obj;

    /**
     * Add some functions.
     *
     *  + getName
     *  + getWholeDomain
     *  + getType
     *  + getIP
     */
    this.obj[name].getName = function() {
        return name;
    }
    this.obj[name].getWholeDomain = function() {
        return this["display_name"];
    }
    this.obj[name].getType = function() {
        return this["type"];
    }
    this.obj[name].getIP = function() {
        if(this.getType() !== "A") {
            throw "You can't get the IP while this record is not A type.";
        } else {
            return this["content"];
        }
    }
    this.obj[name].getID = function() {
        return this["rec_id"];
    }
}

/**
 * Get a record from array.
 * @param name
 */
dnsRecordObject.prototype.getRecord = function(name) {
    if(this.obj[name] === undefined) return null;
    return this.obj[name];
}

module.exports = dnsRecordObject;

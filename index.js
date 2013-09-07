/**
 * Created with JetBrains WebStorm.
 * User: xadillax
 * Date: 9/7/13
 * Time: 9:35 PM
 * DloucFlare : The dynamic cloudflare domain updater.
 */
exports.dloucflare = require("./lib/df");

/**
 * Create a dlouc flare object.
 * @param email
 * @param apikey
 * @param domain
 * @returns {this.dloucflare}
 */
exports.create = function(email, apikey, domain) {
    return new this.dloucflare(email, apikey, domain);
}

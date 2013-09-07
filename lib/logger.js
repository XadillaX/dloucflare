/**
 * Created with JetBrains WebStorm.
 * User: xadillax
 * Date: 9/7/13
 * Time: 9:35 PM
 * DloucFlare : The dynamic cloudflare domain updater.
 */
function logger() {
    this.log = function(msg, domain, level) {
        if(level === undefined) level = "INFO";
        level = level.toUpperCase();

        var d = new Date();
        var YMDHMS = d.getFullYear() + "-" +(d.getMonth()+1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()

        console.log("[" + level + "][" + domain + "][" + YMDHMS + "] " + msg);
    }
}

module.exports = new logger();

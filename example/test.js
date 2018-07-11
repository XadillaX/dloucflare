/**
 * Created by XadillaX on 2014/9/18.
 */
var DloucFlare = require("../");

var df = DloucFlare.create("YOUR_EMAIL", "YOUR_TOKEN", "kacaka.ca", "ZONE_ID");
df.dynamicDomains([ "@", "www" ], 1000 * 30, function(err, interval) {
    if(err) {
        return console.log(err);
    }
    console.log("Interval: " + interval);
});

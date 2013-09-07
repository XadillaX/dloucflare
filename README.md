DloucFlare
==========

To run at a server which has a dynamic IP and cloudflare service. It can dynamic modify your DNS record by your realtime IP address.

Example
----------

The code is very simple:

    var dloucflare = require("dlouc-flare");
    var df = dloucflare.create("your@register.email", "API KEY", "doma.in");
    df.dynamicDomains([ "sub1", "sub2", "..." ], CHECK_ROUND_TIME);


# DLOUCFLARE (RECONNSTRUCTION)

To run at a server which has a dynamic IP and cloudflare service. It can dynamic modify your DNS record by your realtime IP address.

## WHAT'S THIS

It's a NODE.JS based project (or even a tool).

Your server is running under a dynamic IP? Want something to modify DNS record to the real-time IP address automatically? Maybe DloucFlare can help you. In fact, ~~**[Zanarberry](http://kacaka.ca/about.html)**~~ is using it.

But first of all, you should have a **CloudFlare** account. We use the first and last letter of `Dynamic` to put on `Cloud`, so we get **DloucFlare**.

## PRE-WORK

Go [http://www.cloudflare.com](http://www.cloudflare.com/) and register for an account. But I think you'd better to know the detail information or features of **CloudFlare** before you use it.

Add your own domain on **CloudFlare** and do as it said.

After you set up your own domain settings on **CloudFlare**, you can use **DloucFlare** now.

## Example

Go to your own **NODE.JS** project directory and get this package from `npm`:

    $ cd /your/path
    $ npm install dlouc-flare

And then create your `app.js`. The code is very simple:

    var dloucflare = require("dlouc-flare");
    var df = dloucflare.create("your@register.email", "API KEY", "doma.in");
    df.dynamicDomains([ "sub1", "sub2", "..." ], CHECK_ROUND_TIME);

Just start up this `app.js`. If you want it run at the backend, you can use `nohup` command:

    $ nohup node app.js > foo.log 2>&1 &
    
## CONTACT

If you want contribute to this project, you can fork it!

And if you have some question, you can post it to ISSUES or contact me:

  + Email: admin#xcoder.in
  + Website: http://xcoder.in/

This project is working for my own ~~[ZSG](http://kacaka.ca/). Because it's **China Mobile Broadband**, so maybe **China Telecom Broadband** can't access to it.~~

## OLD VERSION

The v0.0.2 version is [here](https://github.com/XadillaX/dloucflare/tree/0.0.2).

## CONTRIBUTION

You're welcome to pull request!

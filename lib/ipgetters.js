/**
 * XadillaX created at 2015-09-17 17:41:35 With ♥
 *
 * Copyright (c) 2015 Souche.com, all rights
 * reserved.
 */
var spidex = require("spidex");

/**
 * TELIZE
 * @param {Function} callback the callback function
 */
exports.TELIZE = function(callback) {
    var url = "http://www.telize.com/ip";
    spidex.get(url, {
        charset: "utf8",
        timeout: 60000
    }, function(html) {
        html = html.trim();
        var regex = /\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/;
        if(!regex.test(html)) {
            return callback(new Error("Not a normal ip address."));
        }

        callback(undefined, html);
    }).on("error", callback);
};

/**
 * ALIYUN
 * @param {Function} callback the callback function
 */
exports.ALIYUN = function(callback) {
    var url = "http://ip.aliyun.com/service/getIpInfo.php?ip=myip";
    spidex.get(url, {
        charset: "utf8",
        timeout: 60000
    }, function(html) {
        html = html.trim();
        var json;

        try {
            json = JSON.parse(html);
            callback(undefined, json.data.ip);
        } catch(e) {
            return callback(e);
        }
    }).on("error", callback);
};

/**
 * SOHU
 *
 * @param {Function} callback the callback function
 */
exports.SOHU = function(callback) {
    var url = "http://txt.go.sohu.com/ip/soip";
    spidex.get(url, {
        charset: "utf8",
        timeout: 60000
    }, function(html) {
        html = html.trim();
        var regex = /window.sohu_user_ip="(\d{1,3}\.\d{1,3}\.\d{1,3}.\d{1,3})"/;
        var regexResult = regex.exec(html);
        if(regexResult.length < 2) {
            return callback(new Error("Not a normal ip address."));
        }

        callback(undefined, regexResult[1]);
    }).on("error", callback);
};

/**
 * IP138
 * @param {Function} callback the callback function
 */
exports.IP138 = function(callback) {
    var url = "http://1111.ip138.com/ic.asp";
    spidex.get(url, {
        charset: "gbk",
        timeout: 60000
    }, function(html) {
        html = html.trim();
        var regex = /\[(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\]/;
        var regexResult = regex.exec(html);
        if(regexResult.length < 2) {
            return callback(new Error("Not a normal ip address."));
        }

        callback(undefined, regexResult[1]);
    }).on("error", callback);
};

/**
 * QQ
 * @param {Function} callback the callback function
 */
exports.QQ = function(callback) {
    var url = "http://ip.qq.com/";
    spidex.get(url, {
        charset: "gbk",
        timeout: 60000
    }, function(html) {
        html = html.trim();
        var regex = /您当前的IP为：<span class="red">(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})<\/span>/;
        var regexResult = regex.exec(html);
        if(regexResult.length < 2) {
            return callback(new Error("Not a normal ip address."));
        }

        callback(undefined, regexResult[1]);
    }).on("error", callback);

};

/**
 * IP5
 * @param {Function} callback the callback function
 */
exports.IP5 = function(callback) {
    var url = "http://www.ip5.me/";
    spidex.get(url, {
        charset: "gbk",
        timeout: 60000
    }, function(html) {
        html = html.trim();
        var regex = /<div id="ip_addr" style="color:#191970">(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})<\/div>/;
        var regexResult = regex.exec(html);
        if(regexResult.length < 2) {
            return callback(new Error("Not a normal ip address."));
        }

        callback(undefined, regexResult[1]);
    }).on("error", callback);

};

/**
 * WIN7SKY
 * @param {Function} callback the callback function
 */
exports.WIN7SKY = function(callback) {
    var url = "http://win7sky.com/ip/";
    spidex.get(url, {
        charset: "gbk",
        timeout: 60000
    }, function(html) {
        html = html.trim();
        var regex = /您的IP地址是：\[<font color=#FF0000>(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})<\/font>\]/;
        var regexResult = regex.exec(html);
        if(regexResult.length < 2) {
            return callback(new Error("Not a normal ip address."));
        }

        callback(undefined, regexResult[1]);
    }).on("error", callback);

};

/**
 * SZBENDIBAO
 * @param {Function} callback the callback function
 */
exports.SZBENDIBAO = function(callback) {
    var url = "http://sz.bendibao.com/ip/ip.asp";
    spidex.get(url, {
        charset: "gbk",
        timeout: 60000
    }, function(html) {
        html = html.trim();
        var regex = /你的电脑的公网IP地址：(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/;
        var regexResult = regex.exec(html);
        if(regexResult.length < 2) {
            return callback(new Error("Not a normal ip address."));
        }

        callback(undefined, regexResult[1]);
    }).on("error", callback);
};

/**
 * WHATISMYIP
 * @param {Function} callback the callback function
 */
exports.WHATISMYIP = function(callback) {
    var url = "http://www.whatismyip.com.tw/";
    spidex.get(url, {
        charset: "utf8",
        timeout: 60000
    }, function(html) {
        html = html.trim();
        var regex = /<h2>(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})<\/h2>/;
        var regexResult = regex.exec(html);
        if(regexResult.length < 2) {
            return callback(new Error("Not a normal ip address."));
        }

        callback(undefined, regexResult[1]);
    }).on("error", callback);
};

require.config({
    baseUrl: (cdn ? cdn : "/") + "build/js/",
    paths: {
        jquery: "plugin/jquery",
        slider: "plugin/super.slider",
        layload: "plugin/jquery.lazyload",
        kalendae: "plugin/kalendae",
        moment: "plugin/moment",
        zhcn: "plugin/zhcn",
        raphael: "plugin/raphael",
        highcharts: "plugin/highcharts",
        TweenMax: "plugin/tweenmax",
        global: "page/global",
        common: "page/common",
        home: "page/home",
        trend: "page/trend",
        dewdrop: "page/dewdrop",
        lottery: "page/lottery",
        pk10: "page/pk10",
        jspk10: "page/jspk10"
    },
    shim: {
        layload: {
            deps: ["jquery"]
        },
        slider: {
            deps: ["jquery"]
        },
        kalendae: {
            deps: ["zhcn"]
        },
        jcanvas: {
            deps: ["jquery"]
        },
        TweenMax: {
            deps: ["jquery"]
        },
        highcharts: {
            deps: ["jquery"]
        }
    }
}), require(["global"], function (e) {
    app.iframe_dump(), $(".header .nav dt").hover(function () {
        $(this).find("ul").stop(!0, !1).slideDown(300)
    }, function () {
        $(this).find("ul").stop(!0, !1).slideUp(300)
    }), app.add_class(".header .nav dl dt ul li:odd,.trend-list dl:odd", "odd"), app.add_class(".trend-list dl:last", "last"), app.shoucang(), $(".page-lottery").length > 0 && app.get_lottery($(".page-lottery").attr("id")), $(".zhibo-list").length > 0 && $(".zhibo-list li").each(function () {
        app.get_countdown($(this).attr("id"))
    }), $(".page-title .tab a").click(function () {
        $(this).addClass("active").siblings("a").removeClass("active"), $(".kill-table .td-f,.kill-table .td-g").hide(), $(".td-" + $(this).data("kill")).show(), "g" == $(this).data("kill") && $(".td-f,.td-g").show()
    })
});
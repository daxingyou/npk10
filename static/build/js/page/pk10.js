require(["global", "TweenMax"], function (r, t) {
    var a = {
        timer: {},
        reset_params: function () {
            return {
                road_right: 0,
                road_start: 0,
                fj_right: 0,
                opacity: 0,
                car: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
            }
        }, random_sort: function () {
            return Math.random() - .5
        }, sort: function (r, t) {
            return r - t
        }, render_result: function (r, t) {
            var e = Math.abs(t.next.awardTimeInterval / 1e3);
            if (a.ready(e), t.current.period) {
                var n = t.current.awardNumbers.split(","),
                    s = parseInt(n[0]) + parseInt(n[1]);
                $(".drawing-video .cai-num").html(app.nums_str(r, n)), $(".drawing-video .current").html(t.current.period), $(".drawing-video .gyh").html("<span>" + s + "</span><span>" + app.dx(s, 11) + "</span><span>" + app.ds(s) + "</span>"), $(".drawing-video .lh").html("<span>" + app.lh(n[0], n[9]) + "</span><span>" + app.lh(n[1], n[8]) + "</span><span>" + app.lh(n[2], n[7]) + "</span><span>" + app.lh(n[3], n[6]) + "</span><span>" + app.lh(n[4], n[5]) + "</span>")
            }
            $(".drawing-video .next").html(t.next.period)
        }, get_lottery: function (r, t) {
            var e = (new Date).getTime();
            $.ajax({
                url: base!=null?base:"" + "/api/live?code=" + r + "&t=" + e,
                method: "get",
                success: function (e) {   
                    var n = e.current.period ? parseInt(e.next.period) - parseInt(e.current.period) : 0;
                    t ? 1 == n || 0 == n ? (a.run_result(e.current.awardNumbers.split(",")), a.render_result(r, e)) : a.retry(r, !0) : (a.render_result(r, e), 2 == n && a.retry(r, !1))
                }   
            })  
        }, retry: function (r, t) {
            clearTimeout(a.timer.retry), a.timer.retry = setTimeout(function () {
                a.get_lottery(r, t)
            }, 1e3)
        }, ready: function (r) {
            a.params = a.reset_params(), $(".ready .count").html(app.time(r)), clearInterval(a.timer.ready), a.timer.ready = setInterval(function () {
                r--, 0 === r ? $(".light .green").show() : 1 === r ? $(".light .yellow").show() : 2 === r && ($(".light .red").show(), a.is_play("ready")), $(".ready .count").html(app.time(r))
            }, 1e3), clearTimeout(a.timer.countdown), a.timer.countdown = setTimeout(function () {
                clearInterval(a.timer.ready), $(".ready,.light p").hide(), a.start()
            }, 1e3 * r + 600)
        }, start: function () {
            a.is_play("run"), $(".wheel").show(), a.retry("pk10", !0), clearInterval(a.timer.start), a.timer.start = setInterval(function () {
                a.params.road_right -= 10, a.params.fj_right -= .25, a.params.opacity += .1, a.params.opacity >= .8 && (a.params.opacity = 0), a.params.road_right <= -1790 && (a.params.road_right = 0), a.params.fj_right <= -1794 && (a.params.fj_right = 0), $(".road-run").css("right", a.params.road_right), $(".scenary .box").css("right", a.params.fj_right), $(".car-box .wind").css("opacity", a.params.opacity)
            }, 5), clearInterval(a.timer.run_road), a.timer.run_road = setInterval(function () {
                a.params.road_start -= 2, a.params.road_start <= -300 && (a.params.road_start = 1200, clearInterval(a.timer.run_road)), $(".road-start").css("right", a.params.road_start)
            }, 5), a.run_car(), clearInterval(a.timer.run_timer), a.timer.run_timer = setInterval(function () {
                t.killAll(), a.run_car()
            }, 3e3), a.run_nums()
        }, jiasu: function (r, t) {
            parseInt($(".car" + t).css("left")) > r ? $(".car" + t).find(".jiasu").show() : $(".car" + t).find(".jiasu").hide()
        }, run_car: function () {
            $(".car-box").each(function (r) {
                var e = Math.floor(40 * Math.random() + 30) / 10,
                    n = Math.floor(580 * Math.random() + 200),
                    s = Math.floor(10 * Math.random() + 1) / 10;
                a.jiasu(n, r + 1), t.to($(this), e, {
                    left: n + "px",
                    delay: s
                })
            })
        }, run_nums: function () {
            clearInterval(a.timer.num), a.timer.num = setInterval(function () {
                var r = {
                    left: [],
                    arr: []
                };
                $(".car-box").each(function (t) {
                    var a = parseInt($(this).css("left"));
                    r.left.push(a), r[a] = t + 1
                }), r.left.sort(a.sort);
                for (var t = 0, e = r.left.length; t < e; t++) r.arr.push(r[r.left[t]]);
                a.open_nums(r.arr)
            }, 300)
        }, run_result: function (r) {
            clearInterval(a.timer.run_timer), t.killAll();
            for (var e = 0, n = r.length; e < n; e++) {
                var s = 2 + .25 * e,
                    o = Math.floor(150 + 70 * e);
                t.to(".car" + r[e], s, {
                    left: o + "px",
                    delay: 0
                })
            }
            t.to(".road-start", .5, {
                right: "720px",
                delay: 3
            }), clearTimeout(a.timer.show_result), a.timer.show_result = setTimeout(function () {
                clearInterval(a.timer.num), a.open_nums(r), clearInterval(a.timer.start), $(".wheel,.jiasu").hide(), a.sound.pause(), $(".shan").fadeIn(100, function () {
                    $(".shan").fadeOut(500, function () {
                        a.show_result(r)
                    })
                })
            }, 3500)
        }, show_result: function (r) {
            t.killAll(), clearInterval(a.timer.start), clearInterval(a.timer.run_road), clearInterval(a.timer.run_timer), clearInterval(a.timer.num), $(".runing div").attr("style", ""), a.is_play("result"), $(".result .car").each(function (t) {
                $(this).find("p img").prop("src", "/build/images/video/winner" + r[t] + ".png")
            }), $(".result").fadeIn(150), t.to(".one", .8, {
                opacity: 1,
                right: "32%",
                top: 0,
                delay: 0
            }), t.to(".two", .8, {
                opacity: 1,
                right: "66%",
                top: 0,
                delay: .5
            }), t.to(".three", .8, {
                opacity: 1,
                right: 0,
                top: 0,
                delay: 1
            }), clearTimeout(a.timer.hide_result), a.timer.hide_result = setTimeout(function () {
                a.is_play("close"), a.reduction(), $(".result").fadeOut(150)
            }, 5e3)
        }, open_nums: function (r) {
            for (var t = "", a = 0, e = r.length; a < e; a++) t += '<span class="n' + r[a] + '">' + r[a] + "</span>";
            $(".cai-num").html(t)
        }, reduction: function () {
            $(".drawing-video div").attr("style", "")
        }, is_play: function (r) {
            "close" == r ? ($("#sound").prop("src", "").prop("loop", !1), a.sound.pause()) : ("ready" == r ? $("#sound").prop("src", "/static/mp3/ready.mp3").prop("loop", !1) : "run" == r ? $("#sound").prop("src", "/static/mp3/run.mp3").prop("loop", !0) : "result" == r && $("#sound").prop("src", "/static/mp3/result.mp3").prop("loop", !1), a.voice ? a.sound.play() : a.sound.pause())
        }, voice: !0,
        sound: document.getElementById("sound")
    };
    a.get_lottery("pk10"), 
    $(".loading").remove(), 
    $(".voice-btn").click(function () {
        $(this).toggleClass("close"), 
        a.voice = !$(this).hasClass("close"), 
        $(this).hasClass("close") ? a.sound.pause() : "" != $("#sound").attr("src") && a.sound.play()
    })
});
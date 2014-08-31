/*jslint browser: true, devel: true*/
/*global $, jQuery, alert, FastClick*/
$(document).ready(function () {
    "use strict";
    var increment = function (element) {
        var currentTime = element.text().parseFloat();
        console.log(currentTime);
        element.text(currentTime + 1);
    },
        GAME_LENGTH = 30,
        MS_INCREMENT = 1000,
        SUM_TIMES = 0,
//        SUM_DEVIATIONS = 0,
        AVERAGE_TIME = 0,
        STANDARD_DEVIATION = 5 * 1000,
        SUM_DEVIATIONS = 0,
        MIN_TIME = 0,
        TEMP_MIN_TIME = 10000000000000,
        MAX_TIME = 0,
        totalTime = function (element) {
            var offset = 0;
            if (element.hasClass("running")) {
                offset = Date.now() - parseInt(element.attr("runstart"), 10);
            }
            return parseInt(element.attr("base"), 10) + offset;
        },
        dt = new Date();
//    var follow = function (bill, currentValue, callback) {
    FastClick.attach(document.body);
    $(".player").click(function () {
        if ($(this).hasClass("running")) {
            $(this).attr("base", totalTime($(this)));
        } else {
            $(this).attr("runstart", Date.now());
        }
        $(this).toggleClass("running");
    });

    Number.prototype.displayTime = function () {
        var ms = this,
            hours = Math.floor(ms / 3600000),
            minutes = Math.floor((ms - hours * 3600000) / 60000),
            seconds = Math.floor((ms - hours * 3600000 - minutes * 60000) / 1000);
        seconds = seconds < 10 ? "0" + seconds : seconds;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        hours = hours < 10 ? "0" + hours : hours;
        return hours > 0 ? hours + ":" + minutes + ":" + seconds : minutes + ":" + seconds;
    };

    $.fn.increment = function () {
        return this.each(function () {
            if ($(this).text()) {
                var currentTime = totalTime($(this));
                $(this).find(".clock").text(currentTime.displayTime());
                if (currentTime > GAME_LENGTH * 60 * 1000) {
                    GAME_LENGTH *= 1.5;
                }
                $(this).find(".timebar").width($(this).width() * currentTime / (GAME_LENGTH * 60 * 1000));
            }
        });
    };
    $.fn.subout = function () {
        return this.each(function () {
            var currentTime = totalTime($(this)),
                deviation = Math.pow(currentTime - AVERAGE_TIME, 2);
            SUM_TIMES += currentTime;
            SUM_DEVIATIONS += deviation;
            //if (currentTime < TEMP_MIN_TIME) {
            //    TEMP_MIN_TIME = currentTime;
            //} else if (currentTime > MAX_TIME) {
            //    MAX_TIME = currentTime;
            //}
            if (currentTime > MAX_TIME && $(this).hasClass("running")) {
                $(this).addClass("subout");
            } else {
                $(this).removeClass("subout");
            }
            if (currentTime < MIN_TIME && !$(this).hasClass("running")) {
                $(this).addClass("subin");
            } else {
                $(this).removeClass("subin");
            }
        });
    };
//    $.fn.subin = function () {
//        return this.each(function () {
//            var currentTime = totalTime($(this));
//            if (currentTime < MIN_TIME) {
//                $(this).addClass("subin");
//            } else {
//                $(this).removeClass("subin");
//            }
//        });
//    };


    setInterval(function () {
        AVERAGE_TIME = SUM_TIMES / $(".player").length;
        STANDARD_DEVIATION = Math.sqrt(SUM_DEVIATIONS / $(".player").length);
//        MIN_TIME = TEMP_MIN_TIME;
//        TEMP_MIN_TIME = MAX_TIME;
        MAX_TIME = AVERAGE_TIME + STANDARD_DEVIATION;
        MIN_TIME = AVERAGE_TIME - STANDARD_DEVIATION;
//        console.log(AVERAGE_TIME);
        SUM_TIMES = 0;
        SUM_DEVIATIONS = 0;
//        var TIMES = $(".player").map(function () {
//            return totalTime($(this));
//        }),
//            sum = 0;
//        TIMES.each(function (elt, idx, array) {
//            if (!isNaN(idx)) {
//                sum += idx;
//            }
//        });
//        AVERAGE_TIME = sum / $(".player").length;
//        console.log(AVERAGE_TIME);
        $(".player").increment();
        $(".player").subout();
    }, MS_INCREMENT);

});



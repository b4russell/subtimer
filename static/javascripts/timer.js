/*jslint browser: true, devel: true*/
/*global $, jQuery, alert, FastClick, Handlebars*/
/*TODO
 * Fix delete last player
 * Fix sort
 */
$(document).ready(function () {
    "use strict";
    var GAME_LENGTH = 10,
        MS_INCREMENT = 1000,
        SUM_TIMES = 0,
//        SUM_DEVIATIONS = 0,
        AVERAGE_TIME = 0,
        STANDARD_DEVIATION = 5 * 1000,
        SUM_DEVIATIONS = 0,
        MIN_TIME = 0,
        MAX_TIME = 0,
        totalTime = function (element) {
            var offset = 0;
            if (element.hasClass("running")) {
                offset = Date.now() - parseInt(element.attr("runstart"), 10);
            }
            return parseInt(element.attr("base"), 10) + offset;
        },
        refreshPlayers = function () {
            AVERAGE_TIME = SUM_TIMES / $(".player").length;
            STANDARD_DEVIATION = Math.sqrt(SUM_DEVIATIONS / $(".player").length);
            MAX_TIME = AVERAGE_TIME + STANDARD_DEVIATION;
            MIN_TIME = AVERAGE_TIME - STANDARD_DEVIATION;
            SUM_TIMES = 0;
            SUM_DEVIATIONS = 0;
            $(".player").increment();
            $(".player").subout();
        },
        reloadPlayers = function () {
            var i = 0,
                storedPlayers = [],
                numPlayers = localStorage.length;
            if (numPlayers) {
                for (i = 0; i < numPlayers; i += 1) {
                    storedPlayers[i] = localStorage.key(i);
                }
                $("#welcome").hide();
            } else { $("#welcome").show(); }
            storedPlayers.sort().loadPlayers();
            refreshPlayers();
        },
        resetTime = function (idx, elt) {
            var name = $(elt).find(".name").text().trim();
            localStorage[$(elt).attr('id')] = JSON.stringify({"name": name, "base": 0, "runstart": 0, "running": false});
            console.log($(elt).attr('id'));
        },
        resetTimes = function () {
            $(".player").each(resetTime);
            reloadPlayers();
        },
        playersTemplate = Handlebars.compile($('#player-template').html()),
        subToggle = function () {
            if ($(this).hasClass("running")) {
                $(this).attr("base", totalTime($(this)));
            } else {
                $(this).attr("runstart", Date.now());
            }
            $(this).toggleClass("running");
            $(this).store();
        },
        deletePlayer = function (e) {
            var id = $(this).parent().attr('id');
            e.stopPropagation();
            localStorage.removeItem(id);
            reloadPlayers();
            $(".edit").show();
        },
        appendPlayer = function (player, playerData) {
            $(".players").append(playersTemplate(
                {"id": player, "name": playerData.name, "base": playerData.base, "runstart": playerData.runstart, "running": playerData.running ? " running" : ""}
            ));
        },
        addPlayer = function (player) {
            console.log(player);
            player = player.trim();
            localStorage[player.replace(" ", "_")] = JSON.stringify({"name": player, "base": 0, "runstart": 0, "running": false});
            reloadPlayers();
            $(".edit").show();
            console.log($(".player"));
        },
        dt = new Date();
//    var follow = function (bill, currentValue, callback) {
    FastClick.attach(document.body);
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

    $.fn.store = function () {
        var name = $(this).find(".name").text().trim(),
            id = name.replace(" ", "_"),
            base = $(this).attr("base"),
            runstart = $(this).attr("runstart"),
            running = $(this).hasClass("running");
        localStorage[id] = JSON.stringify({"name": name, "base": base, "runstart": runstart, "running": running});
        console.log(JSON.parse(localStorage[id]));

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

    Array.prototype.loadPlayers = function () {
        $(".players").empty();
        this.forEach(function (player) {
            var playerData = JSON.parse(localStorage[player]);
            appendPlayer(player, playerData);
        });
    };

    reloadPlayers();
    $(".players").on("click", ".player", subToggle);
    $(".players").on("click", ".delete", deletePlayer);

    $("#reset").click(function () {
        //localStorage.clear();
        resetTimes();
    });

    $(".delete").click(function () {
        console.log("test");
    });


    $("#createplayer").click(function () {
        $("#newplayer").empty();
        $("#newplayer").focus();
        $("#confirmaddplayer").hide();
    });

    $("#confirmaddplayer").click(function () {
        var playerName = $(this).siblings("#newplayer").text();
        if (playerName) {
            addPlayer(playerName);
            $("#newplayer").empty();
            //$("body, html").animate({ scrollTop: $(this).offset().top }, "slow");
            $(this).hide();
        }
    });
    $("#newplayer").focus(function () {
        console.log(window.getSelection());
    });
    $("#editteam").click(function () {
        var currentText = $(this).text();
        console.log($(".edit"));
        $(".edit").toggle();
        $(this).text($(this).attr("toggletext"));
        $(this).attr("toggletext", currentText);
        $("body, html").animate({ scrollTop: $(this).offset().top }, "slow");
        //$(".timebar").toggle();
    });

    $("#newplayer").keyup(function (e) {
        //var target = $(e.target);
        //var focused = $(document.activeElement),
        //    inputting = focused.get(0).tagName.toLowerCase() === "textarea" || focused.get(0).tagName.toLowerCase() === "input";
        // / (forward slash) key = search
        if ($(this).text().trim()) {
            $("#confirmaddplayer").show();
        } else {
            $("#confirmaddplayer").hide();
        }

        if (e.which === 13) {
            e.preventDefault();
            $("#confirmaddplayer").click();
            return;
        }
    });



    setInterval(refreshPlayers, MS_INCREMENT);

});


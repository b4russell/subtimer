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
        AVERAGE_TIME = 0,
        STANDARD_DEVIATION = 5 * 1000,
        SUM_DEVIATIONS = 0,
        MIN_TIME = 0,
        MAX_TIME = 0,
        EDIT_MODE = false,
        totalTime = function (element) {
            var offset = 0;
            if (element.hasClass("running")) {
                offset = Date.now() - parseInt(element.attr("runstart"), 10);
            }
            return parseInt(element.attr("base"), 10) + offset;
        },
        refreshPlayers = function () {
            var numPlayers = $(".player").length;
            AVERAGE_TIME = SUM_TIMES / numPlayers + MS_INCREMENT;
            STANDARD_DEVIATION = Math.sqrt(SUM_DEVIATIONS / numPlayers);
            MAX_TIME = AVERAGE_TIME + STANDARD_DEVIATION;
            MIN_TIME = AVERAGE_TIME - STANDARD_DEVIATION;
            SUM_TIMES = 0;
            SUM_DEVIATIONS = 0;
            $(".player").increment();
            $(".player").subout();
            if (SUM_TIMES && !EDIT_MODE) {
                $("#reset").removeClass("disabled");
            } else {
                $("#reset").addClass("disabled");
            }
            console.log("standard deviation:" + STANDARD_DEVIATION + ", average: " + AVERAGE_TIME);
        },
        reloadPlayers = function () {
            var i = 0,
                storedPlayers = [],
                numPlayers = localStorage.length;
            if (numPlayers) {
                for (i = 0; i < numPlayers; i += 1) {
                    storedPlayers[i] = localStorage.key(i);
                }
                if ($("#welcome").is(":visible")) {
                    $("#welcome").fadeOut(function () {
                        $("#instructions").fadeIn();
                    });
                }
            } else {
                $("#instructions").hide();
                $("#welcome").fadeIn();
            }
            storedPlayers.sort(function (a, b) {
                return a.localeCompare(b, 'en', {'sensitivity': 'base'});
            }).loadPlayers();
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
            $("#instructions").fadeOut();
        },
        deletePlayer = function (e) {
            var id = $(this).parent().attr('id');
            e.stopPropagation();
            localStorage.removeItem(id);
            $(this).parent().slideUp(200, function () {
                reloadPlayers();
                $(".edit").show();
            });
        },
        appendPlayer = function (player, playerData) {
            $(".players").append(playersTemplate(
                {"id": player, "name": playerData.name, "base": playerData.base, "runstart": playerData.runstart, "running": playerData.running ? " running" : ""}
            ));
        },
        addPlayer = function (player) {
            var playerName = encodeURIComponent(player.trim());
            player = player.trim();
            if (playerName && !localStorage[playerName]) {
                localStorage[playerName] = JSON.stringify({"name": player, "base": 0, "runstart": 0, "running": false});
                reloadPlayers();
                $(".edit").show();
                $("#newplayer").val('');
                $('#confirmaddplayer').addClass("disabled");
            } else {
                console.log($('#' + playerName));
            }
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
            id = encodeURIComponent(name),
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
                while (currentTime > GAME_LENGTH * 60 * 1000) {
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
            if (currentTime > MAX_TIME && $(this).hasClass("running") && STANDARD_DEVIATION > 60000) {
                $(this).addClass("subout");
            } else {
                $(this).removeClass("subout");
            }
            if (currentTime < MIN_TIME && !$(this).hasClass("running") && STANDARD_DEVIATION > 60000) {
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
        if (!$(this).hasClass("disabled")) {
            resetTimes();
        }
    });

    $("#createplayer").click(function () {
        //$("#newplayer").val('');
        $("#newplayer").show();
        //$("#newplayer").attr("contenteditable", "true");
        $("#newplayer").focus();
        $("#confirmaddplayer").show();
        $("#confirmaddplayer").addClass("disabled");
    });

    $("#confirmaddplayer").click(function () {
        var playerName = $(this).siblings("#newplayer").val().toLowerCase();
        if (playerName) {
            addPlayer(playerName);
            $("#createplayer").show();
            $(this).hide();
            $('#newplayer').hide();
//$("#newplayer").attr("contenteditable", "true");
            //$("body, html").animate({ scrollTop: $(this).offset().top }, "slow");
        }
    });
    $("#newplayer").focusin(function () {
        $("#createplayer").hide();
        $(this).outerWidth($(this).parent().width() - ($('#confirmaddplayer').outerWidth() + 1));
        console.log(window.getSelection());
    });
    $("#newplayer").focusout(function () {
        if (!$(this).val().trim()) {
            $("#createplayer").show();
            $(this).hide();
            $('#confirmaddplayer').hide();
        }
//$("#newplayer").attr("contenteditable", "false");
        //if ($(this).val().trim()) {
        //    $("#createplayer").removeClass('disabled');
        //}
        //$("#confirmaddplayer").hide();
        //$(this).outerWidth($(this).parent().width() - ($('#confirmaddplayer').outerWidth() + $('#createplayer').outerWidth() + 1));
    });
    $("#editteam").click(function () {
        var currentText = $(this).text();
        EDIT_MODE = !$(".edit").is(":visible");
        $(".edit#newplayerrow").slideToggle(200);
        $(".edit.delete.button").toggle();
        //        left: parseInt($(this).css('left'), 10) === 0 ? -$(this).outerWidth() : 0
        //});
        $(this).text($(this).attr("toggletext"));
        $(this).attr("toggletext", currentText);
        //$("body, html").animate({ scrollTop: $(this).offset().top }, "slow");
        if (EDIT_MODE) {
            $("#reset").addClass("disabled");
        }
        //$(".timebar").toggle();
    });

    $("#newplayer").keyup(function (e) {
        //var target = $(e.target);
        //var focused = $(document.activeElement),
        //    inputting = focused.get(0).tagName.toLowerCase() === "textarea" || focused.get(0).tagName.toLowerCase() === "input";
        // / (forward slash) key = search
        if ($(this).val().trim()) {
            $("#confirmaddplayer").removeClass("disabled");
        } else {
            $("#confirmaddplayer").addClass("disabled");
        }

        if (e.which === 13) {
            addPlayer($(this).val().toLowerCase());
            e.preventDefault();
            //$("#confirmaddplayer").click();
            return;
        }
    });



    setInterval(refreshPlayers, MS_INCREMENT);

});


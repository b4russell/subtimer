/*jslint browser: true, devel: true*/
/*global $, jQuery, alert, FastClick, Handlebars*/
<<<<<<< HEAD
/*TODO
 * Fix delete last player
 * Fix sort
 */
$(document).ready(function () {
    "use strict";
    var GAME_LENGTH = 10,
=======
$(document).ready(function () {

    "use strict";

    var GAME_LENGTH = 10,
	INITIAL_GAME_LENGTH = 10,
>>>>>>> bb404787ccce3f49e928d97edaf6bfaaecb2261b
        MS_INCREMENT = 1000,
        SUM_TIMES = 0,
        AVERAGE_TIME = 0,
        STANDARD_DEVIATION = 5 * 1000,
        SUM_DEVIATIONS = 0,
        MIN_TIME = 0,
        MAX_TIME = 0,
        EDIT_MODE = false,
<<<<<<< HEAD
=======

>>>>>>> bb404787ccce3f49e928d97edaf6bfaaecb2261b
        totalTime = function (element) {
            var offset = 0;
            if (element.hasClass("running")) {
                offset = Date.now() - parseInt(element.attr("runstart"), 10);
            }
            return parseInt(element.attr("base"), 10) + offset;
        },
<<<<<<< HEAD
=======

>>>>>>> bb404787ccce3f49e928d97edaf6bfaaecb2261b
        refreshPlayers = function () {
            var numPlayers = $(".player").length;
            AVERAGE_TIME = SUM_TIMES / numPlayers + MS_INCREMENT;
            STANDARD_DEVIATION = Math.sqrt(SUM_DEVIATIONS / numPlayers);
            MAX_TIME = AVERAGE_TIME + STANDARD_DEVIATION;
            MIN_TIME = AVERAGE_TIME - STANDARD_DEVIATION;
            SUM_TIMES = 0;
            SUM_DEVIATIONS = 0;
            $(".player").increment();
<<<<<<< HEAD
            $(".player").subout();
=======
            $(".player").subsuggest();
>>>>>>> bb404787ccce3f49e928d97edaf6bfaaecb2261b
            if (SUM_TIMES && !EDIT_MODE) {
                $("#reset").removeClass("disabled");
            } else {
                $("#reset").addClass("disabled");
            }
<<<<<<< HEAD
            console.log("standard deviation:" + STANDARD_DEVIATION + ", average: " + AVERAGE_TIME);
        },
=======
        },

>>>>>>> bb404787ccce3f49e928d97edaf6bfaaecb2261b
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
<<<<<<< HEAD
=======

>>>>>>> bb404787ccce3f49e928d97edaf6bfaaecb2261b
        resetTime = function (idx, elt) {
            var name = $(elt).find(".name").text().trim();
            localStorage[$(elt).attr('id')] = JSON.stringify({"name": name, "base": 0, "runstart": 0, "running": false});
            console.log($(elt).attr('id'));
        },
<<<<<<< HEAD
        resetTimes = function () {
            $(".player").each(resetTime);
            reloadPlayers();
        },
        playersTemplate = Handlebars.compile($('#player-template').html()),
=======

        resetTimes = function () {
            $(".player").each(resetTime);
            reloadPlayers();
            GAME_LENGTH = INITIAL_GAME_LENGTH;
        },

        playersTemplate = Handlebars.templates.playerlist,

>>>>>>> bb404787ccce3f49e928d97edaf6bfaaecb2261b
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
<<<<<<< HEAD
=======

>>>>>>> bb404787ccce3f49e928d97edaf6bfaaecb2261b
        deletePlayer = function (e) {
            var id = $(this).parent().attr('id');
            e.stopPropagation();
            localStorage.removeItem(id);
            $(this).parent().slideUp(200, function () {
                reloadPlayers();
                $(".edit").show();
            });
        },
<<<<<<< HEAD
=======

>>>>>>> bb404787ccce3f49e928d97edaf6bfaaecb2261b
        appendPlayer = function (player, playerData) {
            $(".players").append(playersTemplate(
                {"id": player, "name": playerData.name, "base": playerData.base, "runstart": playerData.runstart, "running": playerData.running ? " running" : ""}
            ));
        },
<<<<<<< HEAD
=======

>>>>>>> bb404787ccce3f49e928d97edaf6bfaaecb2261b
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
<<<<<<< HEAD
                console.log($('#' + playerName));
            }
        },
        dt = new Date();
//    var follow = function (bill, currentValue, callback) {
    FastClick.attach(document.body);
=======
                //Don't add null players or players who are already on the team. Maybe add a user message 
                console.log($('Could not add ' + playerName));
            }
        };


    //Make taps work on mobile
    FastClick.attach(document.body);

>>>>>>> bb404787ccce3f49e928d97edaf6bfaaecb2261b
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
<<<<<<< HEAD
                $(this).find(".clock").text(currentTime.displayTime());
                while (currentTime > GAME_LENGTH * 60 * 1000) {
                    GAME_LENGTH *= 1.5;
                }
=======
                //increment player's time displayed on clock
                $(this).find(".clock").text(currentTime.displayTime());
		//GAME_LENGTH determines how many minutes the player width represents. If a player's time exceeds this, GAME_LENGTH needs to be increased.
                while (currentTime > GAME_LENGTH * 60 * 1000) {
                    GAME_LENGTH *= 1.5;
                }
                //grow the player's timer bar
>>>>>>> bb404787ccce3f49e928d97edaf6bfaaecb2261b
                $(this).find(".timebar").width($(this).width() * currentTime / (GAME_LENGTH * 60 * 1000));
            }
        });
    };

<<<<<<< HEAD
    $.fn.subout = function () {
=======
    $.fn.subsuggest = function () {
        //make suggestions about which players should be subbed out or in
>>>>>>> bb404787ccce3f49e928d97edaf6bfaaecb2261b
        return this.each(function () {
            var currentTime = totalTime($(this)),
                deviation = Math.pow(currentTime - AVERAGE_TIME, 2);
            SUM_TIMES += currentTime;
            SUM_DEVIATIONS += deviation;
<<<<<<< HEAD
            //if (currentTime < TEMP_MIN_TIME) {
            //    TEMP_MIN_TIME = currentTime;
            //} else if (currentTime > MAX_TIME) {
            //    MAX_TIME = currentTime;
            //}
=======
>>>>>>> bb404787ccce3f49e928d97edaf6bfaaecb2261b
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
<<<<<<< HEAD
    $(".players").on("click", ".player", subToggle);
    $(".players").on("click", ".delete", deletePlayer);

    $("#reset").click(function () {
        //localStorage.clear();
=======

    $(".players").on("click", ".player", subToggle);

    $(".players").on("click", ".delete", deletePlayer);

    $("#reset").click(function () {
>>>>>>> bb404787ccce3f49e928d97edaf6bfaaecb2261b
        if (!$(this).hasClass("disabled")) {
            resetTimes();
        }
    });

    $("#createplayer").click(function () {
<<<<<<< HEAD
        //$("#newplayer").val('');
        $("#newplayer").show();
        //$("#newplayer").attr("contenteditable", "true");
=======
        $("#newplayer").show();
>>>>>>> bb404787ccce3f49e928d97edaf6bfaaecb2261b
        $("#newplayer").focus();
        $("#confirmaddplayer").show();
        $("#confirmaddplayer").addClass("disabled");
    });

    $("#confirmaddplayer").click(function () {
        var playerName = $(this).siblings("#newplayer").val().toLowerCase();
        if (playerName) {
            addPlayer(playerName);
<<<<<<< HEAD
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
=======
            //after adding a new player, the 'Add New Player' button reappears and input field and confirm button go away
            $("#createplayer").show();
            $(this).hide();
            $('#newplayer').hide();
        }
    });

    $("#newplayer").focusin(function () {
	//hide 'Add New Player' button after it is clicked and make the input field the right width (should be resized with window)
        $("#createplayer").hide();
        $(this).outerWidth($(this).parent().width() - ($('#confirmaddplayer').outerWidth() + 1));
        //console.log(window.getSelection());
    });

    $("#newplayer").focusout(function () {
        //if input field is left empty and user clicks on another element, hide the input field and show the 'Add New Player' button (should be DRY'ed up with #confirmaddplayer.click above)
>>>>>>> bb404787ccce3f49e928d97edaf6bfaaecb2261b
        if (!$(this).val().trim()) {
            $("#createplayer").show();
            $(this).hide();
            $('#confirmaddplayer').hide();
        }
<<<<<<< HEAD
//$("#newplayer").attr("contenteditable", "false");
        //if ($(this).val().trim()) {
        //    $("#createplayer").removeClass('disabled');
        //}
        //$("#confirmaddplayer").hide();
        //$(this).outerWidth($(this).parent().width() - ($('#confirmaddplayer').outerWidth() + $('#createplayer').outerWidth() + 1));
    });
=======
    });

>>>>>>> bb404787ccce3f49e928d97edaf6bfaaecb2261b
    $("#editteam").click(function () {
        var currentText = $(this).text();
        EDIT_MODE = !$(".edit").is(":visible");
        $(".edit#newplayerrow").slideToggle(200);
        $(".edit.delete.button").toggle();
<<<<<<< HEAD
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
=======
	//Replace 'Edit' with 'Done Editing' (or whatever the alternate button label specified in toggletext is)
        $(this).text($(this).attr("toggletext"));
        $(this).attr("toggletext", currentText);
        if (EDIT_MODE) {
            $("#reset").addClass("disabled");
        }
    });

    $("#newplayer").keyup(function (e) {
        //Only enable "Add" button after new player has a name
>>>>>>> bb404787ccce3f49e928d97edaf6bfaaecb2261b
        if ($(this).val().trim()) {
            $("#confirmaddplayer").removeClass("disabled");
        } else {
            $("#confirmaddplayer").addClass("disabled");
        }
<<<<<<< HEAD

        if (e.which === 13) {
            addPlayer($(this).val().toLowerCase());
            e.preventDefault();
            //$("#confirmaddplayer").click();
=======
        
        //Add player on Enter key
        if (e.which === 13) {
            addPlayer($(this).val().toLowerCase());
            e.preventDefault();
>>>>>>> bb404787ccce3f49e928d97edaf6bfaaecb2261b
            return;
        }
    });

<<<<<<< HEAD


=======
    //Refresh player times every MS_INCREMENT milliseconds
>>>>>>> bb404787ccce3f49e928d97edaf6bfaaecb2261b
    setInterval(refreshPlayers, MS_INCREMENT);

});


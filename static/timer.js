/*jslint browser: true, devel: true*/
/*global $, jQuery, alert*/
$(document).ready(function () {
    "use strict";
//    var follow = function (bill, currentValue, callback) {
    var updateTagHtml = function (flag, elemId) {
            var elem = $("#" + elemId);
            if (flag) {
                elem.addClass("followed");
            } else {
                elem.removeClass("followed");
            }
        },
        refresh = function (row) {
            row.toggleClass("tagged");
        },
        addTag = function (billId, tagName, currentlyInactive, callBack) {
            $.post("/addtag",
                   {billId: billId, tagName: tagName, userId: 1, addTag: currentlyInactive},
                   callBack);
        },
        toggleButton = function (button, data) {
            if (data === '0') {
                button.removeClass("tracked");
                button.find(".label").text(button.attr("unselectedText"));
            } else if (data === '1') {
                button.addClass("tracked");
                button.find(".label").text(button.attr("selectedText"));
            }
        },
        slideBlock = function (contentContainer, resource, params) {
            if (contentContainer.hasClass("empty")) {
                $.get(resource,
                    params,
                    function (returnedText) {
                        contentContainer.append(returnedText);
                        contentContainer.toggleClass("empty");
                    });
            }
            contentContainer.toggle();
        };


//        billRowAddTag = function () {
//            var bill = $(this).parent().attr('billId'),
//                billRow = $("#row" + bill),
//                plus = $(this).find(".plus.label"),
//                minus = $(this).find(".minus.label"),
//                //currentValue = $(this).parent().hasClass("tag" + String(1)) ? 1 : 0,
//                tag = $(this).attr('name'),
//                inactive = $(this).hasClass("inactive"),
//                button = $(this);
//            addTag(bill, tag, inactive,
//                   function (data, status) {
//                    if (status === "success") {
//                        button.toggleClass("inactive");
//                        if (data === "0") {
//                            billRow.removeClass("tagged");
//                            plus.show();
//                            minus.hide();
//                        } else {
//                            billRow.addClass("tagged");
//                            plus.hide();
//                            minus.show();
//                        }
//                    }
//                });
//        };
    //$(".billRow").click(follow);
//    $("#trackButton").click(function () {
//      //Not good that this is different from $(".button.track").click
//        var button = $(this),
//            plus = $(this).find(".plus.label"),
//            minus = $(this).find(".minus.label");
//        addTag($(this).attr('billId'), "Track", !($(this).hasClass("tracked")),
//              function (data, status) {
//                if (status === "success") {
//                    button.toggleClass("tracked");
//                    plus.toggle();
//                    minus.toggle();
//                }
//            });
//    });

    $(".billNum a").click(function (e) { e.stopPropagation(); });
    $(".button a").click(function (e) { e.stopPropagation(); });
    $(".analysisHtml").click(function (e) { e.stopPropagation(); });

//    $(".billRow").click(function (e) {
//        $(this).children(".buttonContainer").toggle();
//        $(this).siblings().children(".buttonContainer").hide();
//    });
//        var button = $("#buttons").find(".button");
//        if ($("#buttons").attr("billId") === $(this).attr("billId")) {
//            $("#buttons").toggle();
//        } else {
//            $("#buttons").find(".button").attr("billId", $(this).attr("billId"));
//            $("#buttons").css("top", $(this).position().top);
//            $("#buttons").css("right", $(this).position().left - 3);
//            $("#buttons").css("height", $(this).height());
//            $("#buttons").attr("billId", $(this).attr("billId"));
//            $("#buttons").css("width", $(this).height() * 2.5);
//            $("#buttons").css("font-size", $(this).height() / 4.5);
//            if ($(this).hasClass("tagged")) {
//                $("#buttons").find(".button").addClass("tracked");
//                button.find(".label").text(button.attr("selectedText"));
//            } else {
//                $("#buttons").find(".button").removeClass("tracked");
//                button.find(".label").text(button.attr("unselectedText"));
//            }
//            $.get("/tags/" + $(this).attr('billId'), function (tags) {
//                $.parseJSON(tags).forEach(function (tag) {
//                    $(".button." + tag.toLowerCase()).removeClass("inactive");
//                });
//                $("#buttons").find(".button").show();
//
//            });
//            $("#buttons").show();
//        }
//    });

    $(".button.track").click(function () {
        var button = $(this);
        addTag($(this).attr("billId"), "track", !$(this).hasClass("tracked"), function (data, status) {
            if (status === "success") {
                toggleButton(button, data);
                //$(".billRow#row" + button.attr("billId")).toggleClass("tagged");
                button.parents("#title, .billRow").toggleClass("tagged");
            }
        });
    });

    $("#limitToFollowed").click(function () {
        $("#buttons").hide();
        if ($(this).hasClass("selected")) {
            $(".billRow").show();
            $(this).removeClass("selected");
            $(this).text($(this).attr("unselectedText"));
        } else {
            $(".billRow").not(".tagged").hide();
            $(this).addClass("selected");
            $(this).text($(this).attr("selectedText"));
        }
    });

    $(".vote.block").click(function (e) {
        var voteDetailBlock = $(this).find(".detail.block"),
            billId = $("#title").attr("bill_id"),
            voteDateTime = $(this).attr("vote_date_time"),
            voteDateSeq = $(this).attr("vote_date_seq");
        slideBlock(voteDetailBlock, "/membervote",
                   {billId: billId,
                      voteDateTime: voteDateTime,
                      voteDateSeq: voteDateSeq});
    });

    $(".analysis.header.text.block").click(function () {
        var anaId = $(this).parent().attr("analysisId"),
            params = {analysisId: anaId, fileType: "html"},
            contentTarget = $(this).next();
        slideBlock(contentTarget, "/analysis", params);
    });

    $(".billText.text.block").click(function () {
        var versionId = $(this).attr("versionId"),
            params = {versionId: versionId},
            contentTarget = $(this).next();
        slideBlock(contentTarget, "/billtext", params);
    });



    $(document).keydown(function (e) {
        //var target = $(e.target);
        var focused = $(document.activeElement),
            inputting = focused.get(0).tagName.toLowerCase() === "textarea" || focused.get(0).tagName.toLowerCase() === "input";
        // / (forward slash) key = search
        if (!inputting && e.keyCode === 191) {
            e.preventDefault();
            $("#billNumSearchBox").focus();
            return;
        }
    });

});

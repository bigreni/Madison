    function onLoad() {
        if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent))) {
            document.addEventListener('deviceready', checkFirstUse, false);
        } else {
            notFirstUse();
        }
    }

  var admobid = {};
  if( /(android)/i.test(navigator.userAgent) ) { // for android & amazon-fireos
    admobid = {
      banner: 'ca-app-pub-1683858134373419/7790106682', // or DFP format "/6253334/dfp_example_ad"
      interstitial: 'ca-app-pub-9249695405712287/6086584754'
    };
  } else if(/(ipod|iphone|ipad)/i.test(navigator.userAgent)) { // for ios
    admobid = {
      banner: 'ca-app-pub-1683858134373419/7790106682', // or DFP format "/6253334/dfp_example_ad"
      interstitial: 'ca-app-pub-9249695405712287/1630009581'
    };
  }

    function initApp() {
        if (!AdMob) { alert('admob plugin not ready'); return; }
        initAd();
        //display interstitial at startup
        loadInterstitial();
    }
    function initAd() {
        var defaultOptions = {
            position: AdMob.AD_POSITION.BOTTOM_CENTER,
            bgColor: 'black', // color name, or '#RRGGBB'
            isTesting: false // set to true, to receiving test ad for testing purpose
        };
        AdMob.setOptions(defaultOptions);
        registerAdEvents();
    }
    // optional, in case respond to events or handle error
    function registerAdEvents() {
        // new events, with variable to differentiate: adNetwork, adType, adEvent
        document.addEventListener('onAdFailLoad', function (data) {
            document.getElementById("screen").style.display = 'none';
        });
        document.addEventListener('onAdLoaded', function (data) {
            document.getElementById("screen").style.display = 'none';
        });
        document.addEventListener('onAdPresent', function (data) { });
        document.addEventListener('onAdLeaveApp', function (data) { 
            document.getElementById("screen").style.display = 'none';
        });
        document.addEventListener('onAdDismiss', function (data) { 
            document.getElementById("screen").style.display = 'none';
        });
    }

    function createSelectedBanner() {
          AdMob.createBanner({adId:admobid.banner});
    }

    function loadInterstitial() {
        if ((/(android|windows phone)/i.test(navigator.userAgent))) {
            AdMob.prepareInterstitial({ adId: admobid.interstitial, isTesting: false, autoShow: false });
            //document.getElementById("screen").style.display = 'none';     
        } else if ((/(ipad|iphone|ipod)/i.test(navigator.userAgent))) {
            AdMob.prepareInterstitial({ adId: admobid.interstitial, isTesting: false, autoShow: false });
            //document.getElementById("screen").style.display = 'none';     
        } else
        {
            document.getElementById("screen").style.display = 'none';     
        }
    }

   function checkFirstUse()
    {
        TransitMaster.StopTimes({arrivals: true, headingLabel: "Arrival"});
        initApp();
        checkPermissions();
        askRating();
        //document.getElementById("screen").style.display = 'none';
    }

       function notFirstUse()
    {
        TransitMaster.StopTimes({arrivals: true, headingLabel: "Arrival"});
        document.getElementById("screen").style.display = 'none';
    }

    function checkPermissions(){
        const idfaPlugin = cordova.plugins.idfa;
    
        idfaPlugin.getInfo()
            .then(info => {
                if (!info.trackingLimited) {
                    return info.idfa || info.aaid;
                } else if (info.trackingPermission === idfaPlugin.TRACKING_PERMISSION_NOT_DETERMINED) {
                    return idfaPlugin.requestPermission().then(result => {
                        if (result === idfaPlugin.TRACKING_PERMISSION_AUTHORIZED) {
                            return idfaPlugin.getInfo().then(info => {
                                return info.idfa || info.aaid;
                            });
                        }
                    });
                }
            });
    }
    
    function askRating()
    {
    cordova.plugins.AppRate.setPreferences = {
    reviewType: {
        ios: 'AppStoreReview',
        android: 'InAppBrowser'
        },
  useLanguage:  'en',
  usesUntilPrompt: 10,
  promptAgainForEachNewVersion: true,
  storeAppURL: {
                ios: '1341396343',
                android: 'market://details?id=com.madison.free'
               }
};
 
AppRate.promptForRating(false);
}


function loadFaves()
{
    showAd();
    window.location = "Favorites.html";
}

function saveFavorites()
{
    var favStop = localStorage.getItem("Favorites");
    var newFave = $('#MainMobileContent_routeList').val() + ">" + $("#MainMobileContent_directionList option:selected").val() + ">" + $("#MainMobileContent_stopList option:selected").val() + ":" + $('#MainMobileContent_routeList option:selected').text() + " > " + $("#MainMobileContent_directionList option:selected").text() + " > " + $("#MainMobileContent_stopList option:selected").text();
    alert(newFave);
    if (favStop == null)
        {
            favStop = newFave;
        }   
        else if(favStop.indexOf(newFave) == -1)
        {
            favStop = favStop + "|" + newFave;               
        }
        else
        {
            //$("#message").text('Stop is already favorited!!');
            return;
        }
        localStorage.setItem("Favorites", favStop);
        //$("#message").text('Stop added to favorites!!');
}

function showAd()
{
    document.getElementById("screen").style.display = 'block';     
    // if ((/(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent))) {
    //     AdMob.isInterstitialReady(function(isready){
    //         if(isready) 
    //             AdMob.showInterstitial();
    //     });
    // }
    document.getElementById("screen").style.display = 'none'; 
}

var	TransitMaster =	TransitMaster || {};

TransitMaster.StopTimes = function (options) {
    var settings = { arrivals: null, headingLabel: null, includeStops: true };
    $.extend(settings, options);

    var timer = null;
    var initialView = true;

    initialize();

    function initialize() {
        $("#MainMobileContent_routeList").on('change', function(){getDirections();});
        $("#MainMobileContent_directionList").on('change', function(){getStops();});
        $("#MainMobileContent_stopList").on('change', function(){getArrivalTimes();});

        // $("#MainMobileContent_routeList").bind("change", function () {
        //     var temp = $("#MainContent_routeList").val();

        //     if (temp != "") {
        //         $.cookie("route", temp, { expires: 30 });
        //         getDirections();
        //     }
        // });

        // $("#MainMobileContent_directionList").bind("change", function () {
        //     var temp = $("#MainContent_directionList").val();

        //     if (temp != "") {
        //         $.cookie("direction", temp, { expires: 30 });
        //         reset();

        //         if (settings.includeStops)
        //             getStops();
        //     }
        // });

        // if (settings.includeStops) {
        //     $("#MainMobileContent_stopList").bind("change", function () {
        //         var temp = $("#MainMobileContent_stopList").val();

        //         if (temp != "") {
        //             $.cookie("stop", temp, { expires: 30 });
        //             getArrivalTimes();
        //         }
        //     });
        // }

        getRoutes();
    }


    function checkListCookie(key, list) {
        if (initialView) {
            var temp = $.cookie(key);
            if (temp != null && $("#" + list + " option[value=" + temp + "]").length > 0) {
                $("#" + list).val(temp).change();
                return true;
            }
            else
                initialView = false;
        }

        return false;
    }

    function getRoutes() {
        alert('1');
        //$("#MainMobileContent_routeList").text("Loading	routes...");
        $("#routeWait").removeClass("hidden");

        $.ajax({
            type: "GET",
            //url: "https://metromap.cityofmadison.com/bustime/api/v3/getroutes?requestType=getroutes&locale=en&key=Qskvu4Z5JDwGEVswqdAVkiA5B&format=json&xtime=1749310074913",
            url: "https://metromap.cityofmadison.com/bustime/api/v3/getroutes?key=kaUs8RLjZcrzcZCubnejHncNY&rtpidatafeed=bustime&format=json",

            //url: "http://webwatch.cityofmadison.com/TMWebWatch/Arrivals.aspx/getRoutes",
            //contentType: "application/json;	charset=utf-8",
            dataType: "json",
            success: function (msg) {
        alert('2');

                if (msg["bustime-response"].routes == null || msg["bustime-response"].routes.length == 0) {
                    $("#MainMobileContent_routeList").text("No routes found");
                    return;
                }

                var list = $("#MainMobileContent_routeList");
                var routes = msg["bustime-response"].routes;
                $(list).get(0).options[$(list).get(0).options.length] = new Option("Select a route...", "0");
                $.each(routes, function (index, item) {
                    $(list).append($("<option />").val(item.rt).text(item.rtnm));
                    //$(list).get(0).options[$(list).get(0).options.length] = new Option(item.name, item.id);
                });
                $(list).val('0');
            },
            error: function () {
                $("#MainMobileContent_routeList").text("Failed to load routes");
            },
            complete: function (jqXHR, textStatus) {
                $("#routeWait").addClass("hidden");
            }
        });
        $("span").remove();
        $(".dropList").select2();
    }

function getDirections() {
reset();
var url = encodeURI("https://metromap.cityofmadison.com/bustime/api/v3/getdirections?requestType=getdirections&locale=en&rt=" + $("#MainMobileContent_routeList").val() + "&rtpidatafeed=bustime&key=kaUs8RLjZcrzcZCubnejHncNY&format=json");
$.get(url, function(data) {processXmlDocumentDirections(data); });
$("span").remove();
$(".dropList").select2();
}

function processXmlDocumentDirections(result)
{
var list = $("#MainMobileContent_directionList");
$(list).empty();
$(list).append($("<option disabled/>").val("0").text("- Select Direction -"));
var jsonSlot = result["bustime-response"].directions;
if(jsonSlot != null || jsonSlot.length >= 1)
{
    for(var i=0; i<jsonSlot.length;i++)
    {
        var name = jsonSlot[i].name;
        var id = jsonSlot[i].id;
        $(list).append($("<option />").val(id).text(name));
    }
}
$(list).val(0);

}


    // function getDirections() {
    //     reset();

    //     // Clear cookies if	this is	a new selection
    //     if (!initialView) {
    //         $.cookie("direction", null);
    //         $.cookie("stop", null);
    //     }

    //     if (settings.includeStops) {
    //         $("#MainMobileContent_stopList").get(0).options.length = 0;
    //     }


    //     var list = $("#MainMobileContent_directionList");
    //     $(list).empty();
    //     $("#MainMobileContent_stopList").empty();
    //     $(list).get(0).options.length = 0;
    //     //$("#MainMobileContent_directionList").text("Loading	directions...");
    //     $("#directionWait").removeClass("hidden");

    //     $.ajax({
    //         type: "POST",
    //         url: "http://webwatch.cityofmadison.com/TMWebWatch/Arrivals.aspx/getDirections",
    //         data: "{routeID: " + $("#MainMobileContent_routeList").val() + "}",
    //         contentType: "application/json;	charset=utf-8",
    //         dataType: "json",
    //         success: function (msg) {
    //             if (msg.d == null || msg.d.length == 0) {
    //                 $("#MainMobileContent_directionList").text("No directions found");
    //                 return;
    //             }

    //             $(list).get(0).options[$(list).get(0).options.length] = new Option("Select a direction...", "");
    //             $.each(msg.d, function (index, item) {
    //                 $(list).append($("<option />").val(item.id).text(item.name));
    //                 //$(list).get(0).options[$(list).get(0).options.length] = new Option(item.name, item.id);
    //             });

    //             checkListCookie("direction", "MainMobileContent_directionList");

    //             if (!settings.includeStops)
    //                 initialView = false;
    //         },
    //         error: function () {
    //             $("#MainMobileContent_directionList").text("Failed to load directions");
    //         },
    //         complete: function (jqXHR, textStatus) {
    //             $("#directionWait").addClass("hidden");
    //         }
    //     });
    //     $("span").remove();
    //     $(".dropList").select2();
    // }

    // function getStops() {
    //     // Clear cookies if	this is	a new selection
    //     if (!initialView)
    //         $.cookie("stop", null);

    //     var list = $("#MainMobileContent_stopList");

    //     $(list).get(0).options.length = 0;
    //     //$("#MainMobileContent_stopList").text("Loading stops...");
    //     $("#stopWait").removeClass("hidden");

    //     $.ajax({
    //         type: "POST",
    //         url: "http://webwatch.cityofmadison.com/TMWebWatch/Arrivals.aspx/getStops",
    //         data: "{routeID: " + $("#MainMobileContent_routeList").val() + ",	directionID: " + $("#MainMobileContent_directionList").val() + "}",
    //         contentType: "application/json;	charset=utf-8",
    //         dataType: "json",
    //         success: function (msg) {
    //             if (msg.d == null || msg.d.length == 0) {
    //                 $("#MainMobileContent_stopList").text("No stops	found");
    //                 return;
    //             }
    //             $(list).empty();
    //             $(list).get(0).options[$(list).get(0).options.length] = new Option("Select a stop...", "");

    //             $.each(msg.d, function (index, item) {
    //                 $(list).append($("<option />").val(item.id).text(item.name));
    //                 //$(list).get(0).options[$(list).get(0).options.length] = new Option(item.name, item.id);
    //             });

    //             checkListCookie("stop", "MainMobileContent_stopList");

    //             initialView = false;
    //         },
    //         error: function () {
    //             $("#MainMobileContent_stopList").text("Failed to load stops");
    //         },
    //         complete: function (jqXHR, textStatus) {
    //             $("#stopWait").addClass("hidden");
    //         }
    //     });
    //     $("span").remove();
    //     $(".dropList").select2();
    // }

    // function getArrivalTimes(refresh) {
    //     showAd();
    //     if (!refresh) {
    //         reset(true);
    //         $("#stopWait").removeClass("hidden");
    //     }

    //     $.ajax({
    //         type: "POST",
    //         url: "http://webwatch.cityofmadison.com/TMWebWatch/Arrivals.aspx/getStopTimes",
    //         data: "{routeID: " + $("#MainMobileContent_routeList").val() + ",	directionID: " + $("#MainMobileContent_directionList").val() + ",	stopID:	" + $("#MainMobileContent_stopList").val() + ", useArrivalTimes:	" + settings.arrivals + "}",
    //         contentType: "application/json;	charset=utf-8",
    //         dataType: "json",
    //         success: function (msg) {
    //             if (msg.d == null) {
    //                 msg.d = { errorMessage: "Sorry, an	internal error has occurred" };
    //             }

	// 			if (msg.d.errorMessage == null && (msg.d.routeStops == null || msg.d.routeStops[0].stops == null || msg.d.routeStops[0].stops[0].crossings == null || msg.d.routeStops[0].stops[0].crossings.length == 0))
	// 				msg.d.errorMessage = "No upcoming stop times found";

    //             if (msg.d.errorMessage != null) {
    //                 displayError(msg.d.errorMessage);
    //                 return;
    //             }

	// 			msg.d.stops = msg.d.routeStops[0].stops;

	// 			var count = msg.d.stops[0].crossings.length;
	// 			msg.d.heading = "Next " + (count > 1 ? count : "") + " Vehicle " + settings.headingLabel + (count > 1 ? "s" : "");

    //             var result = $("#stopTemplate").render(msg.d);

    //             if (refresh)
    //                 $("#resultBox").html($(result).html());
    //             else
    //                 displayResultsBox(result);

    //             if (!refresh)
    //                 timer = window.setInterval(function () {
    //                     getArrivalTimes(true);
    //                 }, 30000);
    //         },
    //         error: function () {
    //             displayError("Failed to	load stop times");
    //         },
    //         complete: function (jqXHR, textStatus) {
    //             $("#stopWait").addClass("hidden");
    //         }
    //     });
    //     $("span").remove();
    //     $(".dropList").select2();
    // }

function getStops()
{
    reset();
    var url = encodeURI("https://metromap.cityofmadison.com/bustime/api/v3/getstops?requestType=getstops&locale=en&rt=" + $("#MainMobileContent_routeList").val() + "&dir=" + $("#MainMobileContent_directionList").val() + "&rtpidatafeed=bustime&key=kaUs8RLjZcrzcZCubnejHncNY&format=json");
    $.get(url, function(data) {  processXmlDocumentStops(data); });
    $("span").remove();
    $(".dropList").select2();
}

function processXmlDocumentStops(result)
{
    var list = $("#MainMobileContent_stopList");
    $(list).empty();
    $(list).append($("<option disabled/>").val("0").text("- Select Stop -"));
    var jsonSlot = result["bustime-response"].stops;
    if(jsonSlot != null || jsonSlot.length >= 1)
    {
        for(var i=0; i<jsonSlot.length;i++)
        {
            var name = jsonSlot[i].stpnm;
            var id = jsonSlot[i].stpid;
            $(list).append($("<option />").val(id).text(name));
        }
    }
    $(list).val(0);
}

function getArrivalTimes() {
showAd();
reset();   
//var allRoutes = document.getElementById('allRoutes');
var url = encodeURI("https://metromap.cityofmadison.com/bustime/api/v3/getpredictions?requestType=getpredictions&locale=en&stpid=" + $("#MainMobileContent_stopList").val() + "&rt=" + $("#MainMobileContent_routeList").val() + "&dir=" + $("#MainMobileContent_directionList").val() + "&rtpidatafeed=bustime&key=kaUs8RLjZcrzcZCubnejHncNY&format=json");
        
// if (allRoutes != null) {
//     if (allRoutes.checked) {
//         url = encodeURI("https://metromap.cityofmadison.com/bustime/api/v3/getpredictions?requestType=getpredictions&locale=en&stpid=" + $("#MainMobileContent_stopList").val() + "&rtpidatafeed=bustime&key=uR2atLdE8JtiTVjXhrxDE2Yz9&format=json");
//     }
// }

$.get(url, function(data) {  
    processXmlDocumentPredictions(data); 
});       
$("span").remove();
$(".dropList").select2();
}

function processXmlDocumentPredictions(result)
{
    var outputContainer = $('#contentBox');
    //var outputContainer = document.getElementById("contentBox");
    var predsTag = result["bustime-response"].prd;
    var results = '<h2 style="text-align:center;"><button onclick="saveFavorites();" id="btnSave" style="border:none; background-color: lightgreen; color:black;">&#x2764; Add to favorites</button></h2>'
    results = results + '<table id="tblResults" cellpadding="0" cellspacing="0">';
    //var results = '<table id="tblResults" cellpadding="0" cellspacing="0">';
    if(predsTag != null && predsTag.length >= 1)
    {
        //document.getElementById('btnSubscribe').style.visibility = "none";
        results = results.concat('<tr class="header"><th>ROUTE</th><th>DESTINATION</th><th>ARRIVAL</th></tr><tr><td class="spacer" colspan="3"></td></tr>');
        for(var i=0; i<predsTag.length;i++)
        {
            var arrival = predsTag[i].prdctdn;
            var route = predsTag[i].rt;
            var destination = predsTag[i].des;
            results = results.concat('<tr class="predictions">');
            results = results.concat("<td>" + route + "</td>" + "<td>" + destination + "</td>" + "<td>" + arrival + "</td>");
            results = results.concat('</tr><tr><td class="spacer" colspan="3"></td></tr>');
        }
    }
    else
    {
        results = results.concat("<tr><td>No upcoming arrivals</td></tr>");
    }
    results = results + "</table>";
    $(outputContainer).append(results);
    //outputContainer.innerHTML += results;

}

    function displayError(error) {
        reset(true);
        displayResultsBox($("#errorTemplate").render({ error: error }));
    }

    function displayResultsBox(html) {
        // Unfortunately IE9 leaves	artifacts
        var radius = $("#contentBox").css("border-radius");

        $(html).hide().appendTo("#contentBox").toggle(500, function () {
            $("#contentBox").css("border-radius", radius);
            $(this).animate({ opacity: "1" }, 200);
        });
    }

    function reset(instantRemove) {
        if (timer != null) {
            window.clearInterval(timer);
            timer = null;
        }

        if ($("#resultBox").length > 0) {
            if (instantRemove)
                $("#resultBox").remove();
            else
                removeResultBox();
        }
    }

    function removeResultBox() {
        // Unfortunately IE9 leaves	artifacts
        var shadow = $("#contentBox").css("box-shadow");
        var shadowHide = shadow;

        $("#resultBox").animate({ opacity: "0" }, 200, function () {
            $("#contentBox").css("box-shadow", shadowHide);
            $(this).toggle(500, function () {
                $("#contentBox").css("box-shadow", shadow);
                $(this).remove();
            })
        });
    }

    return {
        displayError: displayError
    };
}
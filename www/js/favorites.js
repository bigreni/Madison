function loadFavorites()
{
    $('#simplemenu').sidr();
    var favStop = localStorage.getItem("Favorites");
    var arrFaves = favStop.split("|");
    var arrStops = null;
    var arrIds;
    var text = "";
    for (i = 0; i < arrFaves.length; i++) 
    {
        arrStops = arrFaves[i].split(":");
        arrIds = arrStops[0].split(">");
        text = '<li><button onclick=removeFavorite(' + i + '); style="background-color:red; border:none;float:right;">&#x2718;</button><a href="javascript:loadArrivals(\'' + arrIds[0] + '\',\'' + arrIds[1] +'\',\'' + arrIds[2]  +'\')"; class="langOption"><h4 class="selectLanguage">' + arrStops[1] + '</h4></a></li>';
	    $("#lstFaves").append(text);
    }
}

function removeFavorite(index)
{
    var favStop = localStorage.getItem("Favorites");
    var arrFaves = favStop.split("|");
    if(arrFaves.length > 1)
    {
        arrFaves.splice(index, 1);
        var faves = arrFaves.join("|");
        localStorage.setItem("Favorites", faves);
    }
    else
    {
        localStorage.removeItem("Favorites");
    }
    location.reload();
}

function loadArrivals(route,direction,stop)
{
    var url = encodeURI("https://metromap.cityofmadison.com/bustime/api/v3/getpredictions?requestType=getpredictions&locale=en&stpid=" + stop + "&rt=" + route + "&dir=" + direction + "&rtpidatafeed=bustime&key=kaUs8RLjZcrzcZCubnejHncNY&format=json");
    $.get(url, function(data) {  
        processXmlDocumentPredictions(data); 
    });       
}

function processXmlDocumentPredictions(result)
{
    reset(true);
    var outputContainer = $('#contentBox');
    //var outputContainer = document.getElementById("contentBox");
    var predsTag = result["bustime-response"].prd;
    var results = '<div id="resultBox"><table id="tblResults" cellpadding="0" cellspacing="0">';
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
    results = results + "</table></div>";
    $(outputContainer).append(results);
    //outputContainer.innerHTML += results;

}

// function loadArrivals(route,direction,stop)
// {
//     $.ajax({
//         type: "POST",
//         url: "http://webwatch.cityofmadison.com/TMWebWatch/Arrivals.aspx/getStopTimes",
//         data: "{routeID: " + route + ",	directionID: " + direction + ",	stopID:	" + stop + ", useArrivalTimes:true}",
//         contentType: "application/json;	charset=utf-8",
//         dataType: "json",
//         success: function (msg) {
//             if (msg.d == null) {
//                 msg.d = { errorMessage: "Sorry, an	internal error has occurred" };
//             }

// 			if (msg.d.errorMessage == null && (msg.d.routeStops == null || msg.d.routeStops[0].stops == null || msg.d.routeStops[0].stops[0].crossings == null || msg.d.routeStops[0].stops[0].crossings.length == 0))
// 			msg.d.errorMessage = "No upcoming stop times found";

//             if (msg.d.errorMessage != null) {
//                 displayError(msg.d.errorMessage);
//                 return;
//             }

// 			msg.d.stops = msg.d.routeStops[0].stops;

//             var count = msg.d.stops[0].crossings.length;
//             msg.d.heading = "Next " + (count > 1 ? count : "") + " Vehicle " + "Arrival" + (count > 1 ? "s" : "");

//             var result = $("#stopTemplate").render(msg.d);

//             //if (refresh)
//             //    $("#resultBox").html($(result).html());
//             //else
//             reset(true);
//             displayResultsBox(result);

//             //if (!refresh)
//             //    timer = window.setInterval(function () {
//             //        loadArrivals(true);
//             //    }, 30000);
//         },
//         error: function () {
//             displayError("Failed to	load stop times");
//         },
//         complete: function (jqXHR, textStatus) {
//             $("#stopWait").addClass("hidden");
//         }
//     });
// }

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
    //if (timer != null) {
    //    window.clearInterval(timer);
    //    timer = null;
    //}

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

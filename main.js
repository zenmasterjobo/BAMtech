// Author: Jordan Bergero

var requestURL = 'http://gdx.mlb.com/components/game/mlb/year_2016/month_05/day_22/master_scoreboard.json';
var globalJSON;
$(document).ready(function() {
    $.getJSON(requestURL, function (data) {
        populateHeader(data);
        listGames(data);
        globalJSON = data;
    }).fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + jqxhr.status;
        drawError(err);
        });

    $("body").keydown(function (e) {
        var direction;
        if (e.keyCode == "39") {
            direction = "next";
            moveSlides(direction, globalJSON);
        }
        else if (e.keyCode == "37") {
            direction = "prev";
            moveSlides(direction, globalJSON);
        }
    });
});

function populateHeader(gameObject){
    var day = gameObject.data.games.day;
    var month = gameObject.data.games.month;
    var year = gameObject.data.games.year;
    var pageHeader = $("<h1> Games for: " + month +"/"+day+"/"+year+"</h1>");
    $(".mainHeader").append(pageHeader);

    if(gameObject.data.games.game == undefined){
        var pageHeader = $("<h2>There are no baseball games today.</h2>");
        $(".mainHeader").append(pageHeader);

    }
}

function listGames(gameObject) {
    var games = gameObject.data.games.game;
    var year  = gameObject.data.games.year;
    var size = games.length;

    // In the case of a world Series Game
    if (size === undefined) {
        var garray =[];
        garray.push(games);
        var selectedGameItem = getSelectedAttributes(0, garray);
        var gameElement = $("<div/>", {"class": "selected", "id": 0});
        $(".carousel").append(gameElement);
        try {
            $("#headline").append(selectedGameItem.headline);
            $(".carousel-div").append(selectedGameItem.description);
        } catch (e) {

        }
        setBackgroundAndOrder(0, games, year);
      }
      else {
        var halfSize = Math.floor(size / 2);
        for (var i = 0; i < size; i++) {

            if (i === Math.floor(halfSize / 2)) {
                var selectedGameItem = getSelectedAttributes(i, games);
                var gameElement = $("<div/>", {"class": "selected", "id": i});

            } else {
                var gameElement = $("<div/>", {"class": "slide", "id": i});
            }

            $(".carousel").append(gameElement);
            try {
                $("#headline").append(selectedGameItem.headline);
                $(".carousel-div").append(selectedGameItem.description);
            } catch (e) {

            }
            setBackgroundAndOrder(i, games, year);

        }
    }
}

function getSelectedAttributes(i, games){
    try {
        var gameTitle = games[i].game_media.media[0].title + ': ' + games[i].game_media.media[1].headline;
        var gameHomeTeam = games[i].home_team_name;
        var gameAwayTeam = games[i].away_team_name;

        var selectedObjectData = {
            headline: $("<h2 id='gHeadline'>" + gameTitle + "</h2>"),
            description: $("<p id='gDescription'> Home Team: " + gameHomeTeam + "<br> Away Team: " + gameAwayTeam + "</p>")
        }
    }catch(e) {
        var gameDescription = games[i].description;
        var gameTitle = games[i].home_name_abbrev + " @ " + games[i].away_name_abbrev + " Postponed due to: " + games[i].status.reason;

        var selectedObjectData = {
            headline: $("<h2 id='gHeadline'>" + gameTitle + "</h2>"),
            description: $("<p id='gDescription'>" + gameDescription + "</p>")
        }
     }


    return selectedObjectData;

}

function setBackgroundAndOrder(i,games, year){
    if(year != 2017) {
        try {
            $("#" + i).css({
                'background-image': 'url(' + games[i].video_thumbnails.thumbnail[0].content + ')',
                'order': i
            });

        } catch (e) {
            $("#" + i).css({
                'background-image': 'url(http://placehold.it/400x600)',
                'order': i
            });
            //$("#" + i).css('order', i);
        }
    }
    else{
        $("#" + i).css({
            'background-image': 'url(http://placehold.it/400x600)',
            'order': i
        });
    }
}


// Abstracts which key you pressed and decides what params to call handleMove with
function moveSlides(dir, gameObject) {
    if (gameObject.data.games.game.length != undefined) {
        var games = gameObject.data.games.game;
        var size = games.length - 1;

        if (dir === 'prev') {
            handleMove(1, games, size);

        } else {
            handleMove(0, games, size);
        }
    }
}

// This handles the actual movement functionality
function handleMove(dir, games, size){
    var slides = $('.slide');
    var select = $('.selected');
    var selectedGameItem;
    var selectedOrder = $('.selected').css('order');
    var selectedID;

    $(select).each(function () {
        selectedID = this.id;
    });

    // If the direction is greater than 0, then we need to move to previous, which is done by increasing the order
    // otherwise we are moving to the next game title, done by decreasing the order;
    $('.selected').css('order',dir > 0 ? parseInt(selectedOrder) + 1 : parseInt(selectedOrder)-1);
    $('.selected').removeClass('selected');

    $(slides).each(function () {
        var order = $(this).css('order');

        if (dir > 0 ? order < size : order > 0) {
            // Same rules as above, if direction is greater than 0 we are doing previous conditions
            // otherwise we are doing next conditions
            $(this).css('order', dir > 0 ? parseInt(order) + 1 : parseInt(order)-1);
            if ($(this).css('order') == selectedOrder) {
                $(this).removeClass('slide');
                $(this).addClass('selected');
                selectedGameItem = getSelectedAttributes(this.id, games);
            }
        }
        else {
            // Let me know if you've heard this one already ^
            dir > 0 ? $(this).css('order', 0) : $(this).css('order', size);
        }
    });



    $('#' + selectedID).addClass('slide');
    $("#gHeadline").remove();
    $("#gDescription").remove();
    $(".headline").append(selectedGameItem.headline)
    $(".carousel-div").append(selectedGameItem.description);



}

function drawError(code){
    var pageHeader = $("<h1> OOPS, There was an error processing your request: "+code+" </h1>");
    $(".mainHeader").append(pageHeader);

}

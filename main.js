// Author: Jordan Bergero

var requestURL = 'http://gdx.mlb.com/components/game/mlb/year_2016/month_05/day20/master_scoreboard.json';
var globalJSON;
var carouselAnimating = false;
$(document).ready(function() {
    $.getJSON(requestURL, function (data) {
        populateHeader(data);
        listGames(data);
        globalJSON = data;
    }).fail(function( jqxhr, textStatus, error ) {
        var err = textStatus + ", " + jqxhr.status;
        drawError(err);
        });


    $( "body" ).keydown(function(e) {
        var direction;
        if(e.keyCode == "39"){
            direction = "next";
            //alert(direction);
        }
        else if (e.keyCode=="37") {
            direction ="prev";
        }

        if (carouselAnimating === false) {
            carouselAnimating = true;
            moveSlides(direction, globalJSON);
        }

    });

});



function populateHeader(gameObject){
    //TODO: Print the Date
    var pageHeader = $("<h1> Today's Games</h1>");
    $(".mainHeader").append(pageHeader);

}

function listGames(gameObject) {
    var games = gameObject.data.games.game;
    var size = games.length;
    var halfSize = Math.floor(size/2);
    for (var i = 0; i < size; i++) {

        if(i === Math.floor((size/2)/2)){
            var selectedGameItem = getSelectedAttributes(i,games);
            var gameElement = $("<div/>", {"class":"selected","id":i});

        }else{
            var gameElement = $("<div/>", {"class":"slide","id":i});
        }

        $(".carousel").append(gameElement);
        try {
            $("#headline").append(selectedGameItem.headline);
            $(".carousel-div").append(selectedGameItem.description);
        }catch(e){

        }
        setBackgroundAndOrder(i, games);

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

function setBackgroundAndOrder(i,games){
    try {
        //TODO find out if there is a way to set both attributes in one line
        $("#" + i).css('background-image', 'url(' + games[i].video_thumbnails.thumbnail[0].content + ')');
        $("#" + i).css('order', i);

    }catch(e){
        // TODO: Come up with better image solution if image is missing.
        $("#" + i).css('background-image', 'url(http://placehold.it/400x600)');
        $("#" + i).css('order', i);
    }
}





// Carousel moves all slides left or right by one slide
function moveSlides(dir, gameObject) {
    var games = gameObject.data.games.game;
    var size = games.length - 1;
    var selectedGameItem;
    //console.log("size" + size);
    //TODO find the selected order number, and removed the css from the selected element

    var slides = $('.slide');
    var select = $('.selected');

    if (dir === 'prev') {

        var selectedOrder = $('.selected').css('order');
        var selectedID;
        $(select).each(function () {
            selectedID = this.id;
        });
        $('.selected').css('order', parseInt(selectedOrder) + 1);
        $('.selected').removeClass('selected');


        $(slides).each(function () {
            var order = $(this).css('order');
            console.log(order);
            if (order < size) {
                $(this).css('order', parseInt(order) + 1);

                if ($(this).css('order') == selectedOrder) {
                    $(this).removeClass('slide');
                    $(this).addClass('selected');
                    selectedGameItem = getSelectedAttributes(this.id, games);
                }
            }
            else {
                $(this).css('order', 0);
            }
        });

        $('#' + selectedID).addClass('slide');
        //console.log(selectedGameItem.headline);

        $("#gHeadline").remove();
        $("#gDescription").remove();
        $(".headline").append(selectedGameItem.headline)
        $(".carousel-div").append(selectedGameItem.description);

        carouselAnimating = false;

    }else{
        var selectedOrder = $('.selected').css('order');
        var selectedID;
        $(select).each(function() {
            selectedID = this.id;
        });
        $('.selected').css('order',parseInt(selectedOrder)-1);
        $('.selected').removeClass('selected');



        $(slides).each(function(){
            var order = $(this).css('order');
            console.log(order);
            if (order > 0) {
                $(this).css('order', parseInt(order) - 1);

                if ($(this).css('order') == selectedOrder) {
                    $(this).removeClass('slide');
                    $(this).addClass('selected');
                    selectedGameItem = getSelectedAttributes(this.id, games);
                }
            }
            else {
                $(this).css('order', size);
            }
        });

        $('#'+selectedID).addClass('slide');
        //console.log(selectedGameItem.headline);

        $("#gHeadline").remove();
        $("#gDescription").remove();
        $(".headline").append(selectedGameItem.headline)
        $(".carousel-div").append(selectedGameItem.description);

        carouselAnimating = false;

    }
}

function drawError(code){
    var pageHeader = $("<h1> OOPS, There was an error processing your request: "+code+" </h1>");
    $(".mainHeader").append(pageHeader);

}

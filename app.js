//  Created By
// Id: 10376001
// Name: Siddarth Nair 

var movieAppURL = 'https://college-movies.herokuapp.com/';

var selectedMovieTitle = '';
var selectedMovieTime = '';
var selectedMovieCast = '';
var selectedMovieDirector = '';
var selectedMovieGenre = '';
var selectedDayOfWeek = '';

$(function () {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
            .register('sw.js')
            .then(function () { console.log('Service Worker Registered'); });
    }

    if ('caches' in window) {
        caches.match(movieAppURL).then(function (response) {
            console.log('caches in window movieAppURL');
            if (response) {
                console.log(response);
                response.json().then(function updateFromCache(json) {
                    console.log(json);
                    var results = json;
                    UpdateMovieList(results, "mon");
                });
            }
            else {
                LoadMoviesList(null);
            }
        });
    }
    else {
        LoadMoviesList(null);
    }

    $('#chooseDay').on('change', function () {
        var selectedDay = $(this).val();
        selectedDayOfWeek = $("#chooseDay option:selected").text();
        LoadMoviesList(selectedDay);
    });


})

function RedirectToSeatSelection() {
    $("#inputInvalid").hide();
    var numberofSeats = 0;
    var status = false;
    $("select").each(function () {
        numberofSeats = parseInt($(this).val());
        if (numberofSeats > 0) {
            status = true;
            return false;
        }
    });
    if (status) {
        location.href = "seatselection.html";
    }
    else {
        $("#inputInvalid").show();
    }
}

function RedirectToNumberOfSeatsSelection(instance) {
    selectedMovieTime = instance.innerHTML;
    selectedMovieTitle = instance.parentNode.parentNode.previousSibling.firstChild.firstChild.firstChild.nextSibling.childNodes[0].innerHTML;
    selectedMovieCast = instance.parentNode.parentNode.previousSibling.firstChild.firstChild.firstChild.nextSibling.children[1].firstElementChild.innerHTML;
    selectedMovieDirector = instance.parentNode.parentNode.previousSibling.firstChild.firstChild.firstChild.nextSibling.children[2].firstElementChild.innerHTML;
    selectedMovieGenre = instance.parentNode.parentNode.previousSibling.firstChild.firstChild.firstChild.nextSibling.children[3].firstElementChild.innerHTML;
    localStorage.setItem("selectedMovieTime", selectedMovieTime);
    localStorage.setItem("selectedMovieTitle", selectedMovieTitle);
    localStorage.setItem("selectedMovieCast", selectedMovieCast);
    localStorage.setItem("selectedMovieDirector", selectedMovieDirector);
    localStorage.setItem("selectedMovieGenre", selectedMovieGenre);
    localStorage.setItem("selectedDay", selectedDayOfWeek);
    location.href = "numberofseats.html";
}

function RedirectToMainPage() {
    location.href = "index.html";
}

function LoadMoviesList(day) {

    var dynamicresult = '';
    var dynamicmovietimesresult = '';
    var runningtimes = [];
    var selectedDay = '';
    if (day == null) {
        selectedDay = $('#chooseDay').val();
    }
    else {
        selectedDay = day;
    }
    selectedDayOfWeek = $("#chooseDay option:selected").text();
    $('.loader').show();
    $.ajax({
        dataType: "json",
        url: movieAppURL,
        success: function (result) {

            UpdateMovieList(result, selectedDay);
        },
        error: function (jqXHR) {
            console.log('API error.');
            $('.loader').hide();
        }
    });
}

function UpdateMovieList(result, selectedDay) {
    var dynamicresult = '';
    var dynamicmovietimesresult = '';
    var runningtimes = [];

    if (result != null) {
        //result= result.slice(1,5);
        var resultLength = result.length;
        var dynamicString = '<div class="row padding-top10"><div class="col-md-12"><div class="row"><div class="col-md-4"><img src="images/movie.jpg" class="img-thumbnail" alt="movie"></div><div class="col-md-8"><h2 id="movietitle">#movietitle#</h2><p class="movie-tag-text">Starring &nbsp;<span id="moviecast" class="cast">#moviecast#</span></p><p class="movie-tag-text">Directed by &nbsp;<span id="moviedirector" class="director">#moviedirector#</span></p><p><span id="moviegenre" class="genre">#moviegenre#</span></p></div></div></div></div><div class="row" id="movietimes">#movietimeslist#</div><hr/>';
        var dynamicMovieTimes = '<div class="col-md-3"><button type="button" class="btn timeBtn btn-lg btn-block btn-huge movie-btn" onclick="RedirectToNumberOfSeatsSelection(this)">#movietime#</button></div>';
        selectedDayOfWeek = $("#chooseDay option:selected").text();
        for (var i = 0; i < resultLength; i++) {
            dynamicmovietimesresult = '';
            runningtimes = result[i].runningTimes[selectedDay];
            console.log(runningtimes);
            var runningtimeslength = runningtimes.length;
            console.log(runningtimeslength);
            for (var j = 0; j < runningtimeslength; j++) {
                dynamicmovietimesresult += dynamicMovieTimes.replace("#movietime#", runningtimes[j]);
            }
            dynamicresult += dynamicString.replace("#movietitle#", result[i].title)
                .replace("#moviedirector#", result[i].director)
                .replace("#moviecast#", result[i].cast)
                .replace("#moviegenre#", result[i].genre)
                .replace("#movietimeslist#", dynamicmovietimesresult);
            console.log(dynamicMovieTimes);

        }
        $('#moviesList').html(dynamicresult);

    }
    $('.loader').hide();
}

function updateSeatInformation() {

    $("#btnConfirmBooking").hide();

    var selSeats = [];

    selSeats = getSelectedSeats('seat');

    var modifiedSeats = selSeats.join(' ');

    $('#seatsDisplay').html(modifiedSeats);
    $("#btnGoToHome").show();
    $("#thanks").show();
}

function getSelectedSeats(seatClassName) {
    var totalseats = document.getElementsByClassName(seatClassName);
    var seatsSelected = [];
    for (var i = 0; i < totalseats.length; i++) {
        if (totalseats[i].checked) {
            seatsSelected.push(totalseats[i].value);
        }
    }
    return seatsSelected.length > 0 ? seatsSelected : null;
}

function selectedMovieDetails() {
    var storedMovieTime = localStorage.getItem("selectedMovieTime");
    var storedMovieTitle = localStorage.getItem("selectedMovieTitle");
    var storedMovieCast = localStorage.getItem("selectedMovieCast");
    var storedMovieGenre = localStorage.getItem("selectedMovieGenre");
    var storedMovieDirector = localStorage.getItem("selectedMovieDirector");
    var storedDay = localStorage.getItem("selectedDay");
    $('#selMovieTitle').html(storedMovieTitle);
    $('#selMovieTime').html(storedDay + ' @ ' + storedMovieTime);
    $('#selMovieGenre').html(storedMovieGenre);
    $('#selMovieCast').html(storedMovieCast);
    $('#selMovieDirector').html(storedMovieDirector);
}

function MakeNavResponsive() {
    var x = document.getElementById("mynavibar");
    if (x.className === "navibar") {
        x.className += " responsive";
    } else {
        x.className = "navibar";
    }
}
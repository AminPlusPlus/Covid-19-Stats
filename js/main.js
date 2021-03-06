/*jshint esversion: 9 */
/*jslint browser: true */
/*global window */
window.onload = (function() {
    "use strict";
    let reportLocation;
    var map = L.map('mapid', {
        zoomControl: false,
        worldCopyJump: true
    }).setView([0, 0], 2);
    const attribution = '&copy; <a href="https://www.openstreetmaps.org/copyright">OpenStreetMap</a> contributors';
    L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution, //Implementation of attribution is required by OpenStreetMap
            maxZoom: 18,
            minZoom: 2,
            tap: false,
            zoomControl: false,
        }).addTo(map);
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);


    (function() {
        map.removeLayer(L.geoJson);
        fetchData("yellow", "yellow", "confirms");
    })();

    function fetchData(color, fillColor, api) {
        $(".loader").show();
        fetch("https://covid-19-273501.appspot.com/api/v1/" + api, {
                method: 'GET',
            }).then(response => {
                if (response.ok)
                    return response.json();
                else
                    return Promise.reject({ status: response.status, statusText: response.statusText });
            })
            //After receiving the data,
            .then(data => {
                data.forEach((location) => {
                    let circle = L.circle([location.lat, location.lon], {
                        color: color,
                        fillColor: fillColor,
                        fillOpacity: 0.5,
                        radius: location.latestTotalCases
                    }).addTo(map);

                    const popups = L.DomUtil.create('div', 'infoWindow');
                    popups.innerHTML = `<b>Latest Total Cases</b>: ${location.latestTotalCases} <br /> 
                     <b>Previous Day Difference</b>: ${location.diffFromPrevDay} <br />
                     <b>Country</b>: ${location.country}
                     <button id="reportBtn" type="button" class="forButton">Report</button>`;
                    circle.bindPopup(popups);
                    $('#reportBtn', popups).on('click', function(event) {
                        reportLocation = location;
                        $("#myModal").css({ "display": "block" });
                    });
                });
                $(".loader").hide();
            })
            //Else, catch error and alert
            .catch(error => alert("error"));
    }

    $('.custome-modal-header-close').on('click', function(event) {
        $("#myModal").css({ "display": "none" });
    });

    $(window).click(function(e) {
        if (e.target == $("#myModal")[0]) {
            $("#myModal").css({ "display": "none" });
        }
    });

    document.getElementById("reportBtn").addEventListener("click", function(event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const message = document.getElementById("message").value;
        const data = {
            "email": email,
            "message": message,
            "locationData": reportLocation
        };
        $.ajax({
            type: 'POST',
            url: 'https://covid-19-273501.appspot.com/api/v1/reports',
            dataType: "json",
            contentType: "application/json; charset=utf-8",
            beforeSend: function() {
                $(".loader").show();
            },
            data: JSON.stringify(data),
        }).done(onClickSuccess).fail(onClickFail);
    });

    function onClickSuccess(response) {
        document.getElementById("email").value = "";
        document.getElementById("message").value = "";
        reportLocation = {};
        $(".loader").hide();
        $("#myModal").css({ "display": "none" });
        alert('REPORT SUCCESS');
    }

    function onClickFail() {
        $(".loader").hide();
        $("#myModal").css({ "display": "none" });
        alert("ERROR OCCUR");
    }


    let covid19table;
    covid19table = $('#covid19table').DataTable({
        ajax: {
            url: 'https://covid-19-273501.appspot.com/api/v1/confirms',
            dataSrc: ''
        },
        "columns": [
            { "data": "country" },
            { "data": "latestTotalCases" },
            { "data": "diffFromPrevDay" }
        ]
    });

    document.getElementById("confirms").addEventListener("click", function() {
        fetchData("yellow", "yellow", "confirms");
        console.log("confirms api called")
        $(".nav-link").removeClass("active");
        $("#confirms").addClass("active");

        covid19table.destroy();
        covid19table = $('#covid19table').DataTable({
            ajax: {
                url: 'https://covid-19-273501.appspot.com/api/v1/confirms',
                dataSrc: ''
            },
            "columns": [
                { "data": "country" },
                { "data": "latestTotalCases" },
                { "data": "diffFromPrevDay" }
            ]
        });
    });

    document.getElementById("deaths").addEventListener("click", function() {
        fetchData("red", "red", "deaths");
        console.log("deaths api called");
        $(".nav-link").removeClass("active");
        $("#deaths").addClass("active");
        covid19table.destroy();
        covid19table = $('#covid19table').DataTable({
            ajax: {
                url: 'https://covid-19-273501.appspot.com/api/v1/deaths',
                dataSrc: ''
            },
            "columns": [
                { "data": "country" },
                { "data": "latestTotalCases" },
                { "data": "diffFromPrevDay" }
            ]
        });
    });

    document.getElementById("recovers").addEventListener("click", function() {
        fetchData("green", "green", "recovers");
        console.log("recovers api called")
        $(".nav-link").removeClass("active");
        $("#recovers").addClass("active");
        covid19table.destroy();
        covid19table = $('#covid19table').DataTable({
            ajax: {
                url: 'https://covid-19-273501.appspot.com/api/v1/recovers',
                dataSrc: ''
            },
            "columns": [
                { "data": "country" },
                { "data": "latestTotalCases" },
                { "data": "diffFromPrevDay" }
            ]
        });
    });

})();
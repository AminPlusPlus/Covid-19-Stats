/*jshint esversion: 9 */
/*jslint browser: true */
/*global window */
window.onload = (function() {
    "use strict";

    var map = L.map('mapid', {
        zoomControl: false,
        worldCopyJump: true
    }).setView([0,0], 2);
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
        fetchData();
    })();

    function fetchData() {
        $(".loader").show();
        fetch("https://covid-19-273501.appspot.com/api/v1/confirms", {
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
                        color: 'red',
                        fillColor: '#f03',
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
})();
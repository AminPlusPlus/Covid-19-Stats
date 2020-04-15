/*jshint esversion: 9 */
/*jslint browser: true */
/*global window */
window.onload = (function() {
    "use strict";
    var map = L.map('mapid', {
        zoomControl: false,
        worldCopyJump: true
    }).setView([0,0], 4);
    const attribution = '&copy; <a href="https://www.openstreetmaps.org/copyright">OpenStreetMap</a> contributors';
    L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution,
            maxZoom: 18,
            minZoom: 4,
            tap: false,
            zoomControl: false,
        }).addTo(map);
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    $.ajax({
        url: "https://covid-19-273501.appspot.com/api/v1/confirms",
        type: "GET",
        dataType: 'json',
        contentType: 'application/json',
        beforeSend: function() {
            $(".loader").show();
        },
    }).done(onSuccess).fail(onFail);

    function onSuccess(response) {
        let circle;
        response.forEach((location) => {
            circle = L.circle([location.lat, location.lon], {
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
    }

    function onFail() {
        $(".loader").hide();
        alert("ERROR OCCURED");
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
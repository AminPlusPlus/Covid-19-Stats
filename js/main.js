/*jshint esversion: 6 */
/*jslint browser: true */
/*global window */
window.onload = (function () {
    "use strict";
    let open = false;
    var map = L.map('mapid', {
        zoomControl: false
    }).setView([-41.2858, 174.78682], 4);
    L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            minZoom: 4,
            zoomControl: false,
        }).addTo(map);
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);
    $('button').on('click', function (event) {
        event.preventDefault();
        if (!open) {
            open = true;
            $('.slideout_inner').addClass('active');
        } else {
            open = false;
            $('.slideout_inner').removeClass("active");
        }
    });
    $.ajax({
        url: "https://covid-19-273501.appspot.com/api/v1/confirms",
        type: "GET",
        dataType: 'json',
        contentType: 'application/json',
        beforeSend: function () {
            $(".loader").show();
        },
    }).done(onSuccess).fail(onFail);

    function onSuccess(response) {
        console.log(response);
        let circle;

        response.forEach((location) => {

            circle = L.circle([location.lat, location.lon], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: location.latestTotalCases
            }).addTo(map);
            const popups = L.popup()
                .setContent(`<b>Latest Total Cases</b>: ${location.latestTotalCases} <br /> 
                             <b>Previous Day Difference</b>: ${location.diffFromPrevDay} <br />
                             <b>Country</b>: ${location.country}
                             <button type="button" class="forButton">Report</button>
                            `);
            circle.bindPopup(popups).openPopup();
        });
        $(".loader").hide();
    }

    function onFail() {
        $(".loader").hide();
        alert("ERROR OCCUR");
    }

})();
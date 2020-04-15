/*jshint esversion: 6 */
/*jslint browser: true */
/*global window */
window.onload = (function () {
    "use strict";
    let open = false;
    var map = L.map('mapid', {
        zoomControl: false
    }).setView([0, 0], 4);
    L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            minZoom: 4,
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
                             <button type="button" onclick="alert(faaaaaaak)" class="forButton">Report</button>
                            `);
            circle.bindPopup(popups);
        });
        $(".loader").hide();
    }

    function onFail() {
        $(".loader").hide();
        alert("ERROR OCCUR");
    }

})();
/*jshint esversion: 9 */
/*jslint browser: true */
/*global window */
window.onload = (function() {
    "use strict";
    let openSearch = false;
    var map = L.map('mapid', {
        zoomControl: false,
        worldCopyJump: true
    }).setView([-41.2858, 174.78682], 4);

    L.tileLayer(
        'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 18,
            minZoom: 4,
            tap: false,
            zoomControl: false,
        }).addTo(map);
    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    $('.btnSearch').on('click', function(event) {
        event.preventDefault();
        if (!openSearch) {
            openSearch = true;
            $('.slideout_inner').addClass('active');
        } else {
            openSearch = false;
            $('.slideout_inner').removeClass("active");
        }
    });

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
        alert("ERROR OCCUR");
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
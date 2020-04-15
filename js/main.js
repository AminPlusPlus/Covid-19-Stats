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
            const popups = L.popup()
                .setContent(`<b>Latest Total Cases</b>: ${location.latestTotalCases} <br /> 
                             <b>Previous Day Difference</b>: ${location.diffFromPrevDay} <br />
                             <b>Country</b>: ${location.country}
                             <button type="button" class="forButton">Report</button>
                            `);
            circle.bindPopup(popups);
        });
        $(".loader").hide();
    }

    function onFail() {
        $(".loader").hide();
        alert("ERROR OCCUR");
    }


    $('#myBtn').on('click', function(event) {
        $("#myModal").css({ "display": "block" });
    });

    $('.custome-modal-header-close').on('click', function(event) {
        $("#myModal").css({ "display": "none" });
    });
    console.log($("#myModal"));

    $(window).click(function(e) {
        if (e.target == $("#myModal")[0]) {
            $("#myModal").css({ "display": "none" });
        }
    });

    // function processingData(data) {
    //     const chinaState = data.filter(s => s.country === "China");
    //     chinaState[0].state = [];
    //     chinaState[0].latestTotalCases = 0;
    //     chinaState[0].diffFromPrevDay = 0;
    //     const china = Object.assign({}, chinaState[0]);
    //     chinaState.shift();
    //     chinaState.forEach(item => {
    //         china.state.push(item);
    //         china.latestTotalCases += item.latestTotalCases;
    //         china.diffFromPrevDay += item.diffFromPrevDay;
    //     });
    //     const findCountry = data.filter(item => {
    //         if (item.state.length === 0) {
    //             const findState = data.filter(s => s.state.length !== 0 && s.country === item.country);
    //             item.state = findState;
    //             return item;
    //         }
    //     });
    //     findCountry.push(china);
    //     return findCountry;
    // }

    // const nest = (items, id = null, link = 'country') => items
    //     .filter(item => item[link] === id)
    //     .map(item => ({...item, diffFromPrevDay: diffFromPrevDay + item.diffFromPrevDay, latestTotalCases: latestTotalCases + item.latestTotalCases, state: nest(items, item.id) }));
})();
const mymap = L.map('mapid').setView([0,0], 3);


const attribution = '&copy; <a href="https://www.openstreetmaps.org/copyright">OpenStreetMap</a> contributors';
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const tiles = L.tileLayer(tileUrl,{attribution});
tiles.addTo(mymap);

const api_url = "https://covid-19-273501.appspot.com/api/v1/confirms";

//const spots = L.marker([0,0]).addTo(mymap);

(function(){
    fetchData();
})();


function fetchData() {
    fetch(api_url, {
        method: 'GET',
    }).then(response => {
        if (response.ok)
            return response.json();
        else
            return Promise.reject({status: response.status, statusText: response.statusText});
    })
        //After receiving the data,
        .then(data => {
            data.forEach(function (geo) {
                const spots = L.circle([geo.lat, geo.lon], {color: 'red', radius: geo.latestTotalCases})
                spots.addTo(mymap);
            })

        })
}







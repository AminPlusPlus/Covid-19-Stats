window.addEventListener('load', (event) => {
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

    document.getElementById("confirms").addEventListener("click", function () {
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

    document.getElementById("deaths").addEventListener("click", function () {
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

    document.getElementById("recovers").addEventListener("click", function () {
        console.log("recovers api called")
        $(".nav-link").removeClass("active");
        $("#recovers").addClass("active");
        covid19table.destroy();
        covid19table =  $('#covid19table').DataTable({
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
});




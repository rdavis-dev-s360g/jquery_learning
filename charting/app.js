
// Vars
var oneSecondMS = 1000;
var oneMinuteMS = 60 * oneSecondMS;
var oneHourMS = 60 * oneMinuteMS;
var $refreshIntervalMS = .15 * oneHourMS;

// Body onload
$(function() {

    // Build the line chart
    loadLineChartData();

});

function loadLineChartData() {

    var url = "http://.amazonaws.com/datacollector/getData";

    $.ajax({
        type: "GET",
        url: url,
        dataType: "json",   // Straight up JSON so we get an object as the data object in the success function
        success: function (data) {

            // Populate two arrays, one for lables and one for values
            var labels = [];
            var values = [];
            $.each(data, function (key, val) {
                labels.push(key);
                values.push(val);
            });

            // Actually build the chart
            buildChartUI(labels, values);

            setDelayTime();
        },
        error: function (xhr) {
            //alert("error");
            alert(xhr.responseText);
        }
    });
}

// Build up the UI for the chart
function buildChartUI(labels, values) {

    var data = {
        labels: labels,
        datasets: [
            {
                label: "My First dataset",
                fillColor: "rgba(220,220,220,0.2)",
                strokeColor: "rgba(220,220,220,1)",
                pointColor: "rgba(220,220,220,1)",
                pointStrokeColor: "#fff",
                pointHighlightFill: "#fff",
                pointHighlightStroke: "rgba(220,220,220,1)",
                data: values
            }
        ]
    };

    var options = {
        bezierCurve: true
    };


    // Get context with jQuery - using jQuery's .get() method.
    var ctx = $("#myChart").get(0).getContext("2d");

    // This will get the first returned node in the jQuery collection.
    var lineChart = new Chart(ctx).Line(data, options);
}

function setDelayTime() {
    setTimeout("loadLineChartData();", $refreshIntervalMS);
}

// Vars
var oneSecondMS = 1000;
var oneMinuteMS = 60 * oneSecondMS;
var oneHourMS = 60 * oneMinuteMS;
var $refreshIntervalMS = 1 * oneMinuteMS;

$(function() {
    var box = $("#box");
    var para = $("p");

    // Make initial call
    displayStockData();

    $("#profit").click(function() {
        displayStockData();
    });

    $("#profit2").click(function() {
        displayStockData();
    });

    $("#gauge1").click(function() {
        displayStockData();
    });

    $("#gauge2").click(function() {
        displayStockData();
    });

    // Configure gauges
    setupGauge($("#gauge1"));
    setupGauge($("#gauge2"));
});

function displayStockData() {

    // Get stock prices for symbols separated by commas
    var url = "http://www.google.com/finance/info?q=NSE:nugt,uwti";

    $.ajax({
        type: "GET",
        url: url,
        dataType: "jsonp",
        success: function (data) {

            // Iterate over the one item for example of how to iterate the json results
            var items = [];
            $.each( data, function( key, val ) {
                items.push(val);
            });

            // Symbol 1
            var indexer = 0;
            var ticker = items[indexer].t;
            var lastPrice = items[indexer].l;
            var changePercent = items[indexer].cp;
            console.log("Last price for " + ticker + " is " + lastPrice);
            $("#quote").text(ticker + " " + lastPrice);
            $("#time").text(new Date().toLocaleTimeString());
            $("#percentChange").text(changePercent + "%");
            $("#gauge1").jqxGauge('value', changePercent);

            var LIMIT = 10;
            var cpn = Number(changePercent);
            // If % up or down is greater than LIMIT
            if (Math.abs(cpn) > LIMIT) {
                $("#status").text("PAY ATTENTION");
                $("#status").css("color", "red");
            } else {
                $("#status").text("normal");
                $("#status").css("color", "green");
            }

            // Calculate profit
            var buyin = $("#buyin").val();
            var shares = $("#shares").val();
            var profit = (lastPrice * shares) - (buyin * shares);
            $("#profit").text("$" + profit);

            // Symbol 2
            indexer = 1;
            ticker = items[indexer].t;
            lastPrice = items[indexer].l;
            changePercent = items[indexer].cp;
            console.log("Last price for " + ticker + " is " + lastPrice);
            $("#quote2").text(ticker + " " + lastPrice);
            $("#time2").text(new Date().toLocaleTimeString());
            $("#percentChange2").text(changePercent + "%");
            $("#gauge2").jqxGauge('value', changePercent);

            var LIMIT = 10;
            var cpn = Number(changePercent);
            if (Math.abs(cpn) > LIMIT) {
                $("#status2").text("PAY ATTENTION");
                $("#status2").css("color", "red");
            } else {
                $("#status2").text("normal");
                $("#status2").css("color", "green");
            }

            // Calculate profit
            var buyin = $("#buyin2").val();
            var shares = $("#shares2").val();
            var profit = (lastPrice * shares) - (buyin * shares);
            $("#profit2").text("$" + profit);

            document.title = "Updated data " + new Date().toLocaleTimeString();
        },
        error: function (xhr) {
            alert("error");
            alert(xhr.responseText);
        }
    });


    setDelayTime();
}

/**
 * Setup gauge in UI for use
 *
 * @param $gauge the gauge to set up
 *
 * http://www.jqwidgets.com/jquery-widgets-demo/
 */
function setupGauge($gauge) {
    $gauge = $gauge || $('#gauge');
    $gauge.jqxGauge({
        ranges: [{
            startValue: -30,
            endValue: -15,
            style: {fill: 'red', stroke: 'orange'},
            startDistance: 0,
            endDistance: 0
        },
            {
                startValue: -15,
                endValue: -10,
                style: {fill: 'orangered', stroke: 'red'},
                startDistance: 0,
                endDistance: 0
            },
            {
                startValue: -10,
                endValue: -5,
                style: {fill: 'yellow', stroke: 'yellow'},
                startDistance: 0,
                endDistance: 0
            },
            {
                startValue: -5,
                endValue: 0,
                style: {fill: 'green', stroke: 'green'},
                startDistance: 0,
                endDistance: 0
            },
            {
                startValue: 0,
                endValue: 5,
                style: {fill: 'green', stroke: 'green'},
                startDistance: 0,
                endDistance: 0
            },
            {
                startValue: 5,
                endValue: 10,
                style: {fill: 'yellow', stroke: 'yellow'},
                startDistance: 0,
                endDistance: 0
            },
            {
                startValue: 10,
                endValue: 15,
                style: {fill: 'orangered', stroke: 'red'},
                startDistance: 0,
                endDistance: 0
            },
            {
                startValue: 15,
                endValue: 30,
                style: {fill: 'red', stroke: 'orange'},
                startDistance: 0,
                endDistance: 0
            }

        ],
        cap: {size: '5%', style: {fill: '#2e79bb', stroke: '#2e79bb'}},
        border: {style: {fill: '#8e9495', stroke: '#7b8384', 'stroke-width': 1}},
        ticksMinor: {interval: 5, size: '5%'},
        ticksMajor: {interval: 20, size: '10%'},
        labels: {position: 'outside', interval: 5},
        pointer: {style: {fill: '#2e79bb'}, width: 5},
        width: '200px',
        height: '200px',
        min: -30,
        max: 30,
        animationDuration: 1500
    });
    $gauge.jqxGauge('value', 0);
}

function setDelayTime() {
    setTimeout("displayStockData();", $refreshIntervalMS);
}



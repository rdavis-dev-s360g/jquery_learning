
// Vars
var oneSecondMS = 1000;
var oneMinuteMS = 60 * oneSecondMS;
var oneHourMS = 60 * oneMinuteMS;
var $refreshIntervalMS = .15 * oneHourMS;

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
});

function displayStockData() {

    // Get stock prices for symbols separated by commas
    var url = "http://www.google.com/finance/info?q=NSE:nugt,ugaz";

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

            var LIMIT = 4.9;
            var cpn = Number(changePercent);
            if (cpn < -LIMIT || cpn > LIMIT) {
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

            var LIMIT = 4.9;
            var cpn = Number(changePercent);
            if (cpn < -LIMIT || cpn > LIMIT) {
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
        },
        error: function (xhr) {
            alert("error");
            alert(xhr.responseText);
        }
    });


    setDelayTime();
}

function setDelayTime() {
    setTimeout("displayStockData();", $refreshIntervalMS);
}



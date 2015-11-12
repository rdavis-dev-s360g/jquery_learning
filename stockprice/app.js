
// Vars
var oneSecondMS = 1000;
var oneMinuteMS = 60 * oneSecondMS;
var oneHourMS = 60 * oneMinuteMS;
var $refreshIntervalMS = 1 * oneMinuteMS;
var PRICE_ALERT_PERCENT_LIMIT = 10;
var PRICE_ALERT_PERCENT_MESSAGING_LIMIT = 13;

// Store state of notifications so we control when they go out
var notificationCache = {};
var notificationCacheExpiration = {};
var NOTIFICATION_INTERVAL_MINS = 15;
var NOTIFICATION_INTERVAL_MS = NOTIFICATION_INTERVAL_MINS * 60 * 1000;

var symbol1 = "nugt";
var symbol2 = "uwti";
var symbol3 = "gbtc";
var symbol4 = "vix";

$(function() {
    var box = $("#box");
    var para = $("p");

    // Pre-seed notification cache
    notificationCache[symbol1] = false;
    notificationCache[symbol2] = false;
    notificationCache[symbol3] = false;
    notificationCache[symbol4] = false;

    // Make initial call
    displayStockData();

    $("#gauge1").click(function() {
        displayStockData();
    });

    // Configure gauges
    setupGauge($("#gauge1"));
    setupGauge($("#gauge2"));
    setupGauge($("#gauge3"));
    setupGauge($("#gauge4"));

    setupLinearGauge($("#lgauge1"), 20, 60, 35);
    setupLinearGauge($("#lgauge2"), 0, 40, 13.5 );
    setupLinearGauge($("#lgauge3"), 15, 75, 42);
    setupLinearGauge($("#lgauge4"), 5, 40, 16 );
});

/**
 * Update UI with stock data
 */
function displayStockData() {

    // Don't query price after hours
    if (afterHours()) {
        setDelayTime();
        return;
    }

    // Expire notification cache if needed
    updateNotificationExpirationStatus(symbol1);
    updateNotificationExpirationStatus(symbol2);
    updateNotificationExpirationStatus(symbol3);
    updateNotificationExpirationStatus(symbol4);

    // Get stock prices for symbols separated by commas
    var url = "http://www.google.com/finance/info?q=NSE:" + symbol1 + "," + symbol2 + "," + symbol3 + "," + symbol4;

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
            var open = items[indexer].pcls_fix;
            console.log("Last price for " + ticker + " is " + lastPrice);
            $("#quote").text(ticker + " " + lastPrice);
            $("#time").text(new Date().toLocaleTimeString());
            $("#percentChange").text(changePercent + "%");
            $("#gauge1").jqxGauge('value', changePercent);
            $("#lgauge1").jqxLinearGauge('value', lastPrice);

            var cpn = Number(changePercent);
            // If % up or down is greater than PRICE_ALERT_PERCENT_LIMIT
            if (Math.abs(cpn) > PRICE_ALERT_PERCENT_LIMIT) {
                $("#status").text("PAY ATTENTION");
                $("#status").css("color", "red");
            } else {
                $("#status").text("normal");
                $("#status").css("color", "green");
            }

            // Send alert message?
            if (Math.abs(cpn) > PRICE_ALERT_PERCENT_MESSAGING_LIMIT) {
                sendAlertMessage(symbol1, "Price alert for " + symbol1, "Price alert for " + symbol1 + " percent change is " + changePercent + "%");
            }

            // Symbol 2
            indexer = 1;
            ticker = items[indexer].t;
            lastPrice = items[indexer].l;
            changePercent = items[indexer].cp;
            open = items[indexer].pcls_fix;
            console.log("Last price for " + ticker + " is " + lastPrice);
            $("#quote2").text(ticker + " " + lastPrice);
            $("#time2").text(new Date().toLocaleTimeString());
            $("#percentChange2").text(changePercent + "%");
            $("#gauge2").jqxGauge('value', changePercent);
            $("#lgauge2").jqxLinearGauge('value', lastPrice);

            cpn = Number(changePercent);
            if (Math.abs(cpn) > PRICE_ALERT_PERCENT_LIMIT) {
                $("#status2").text("PAY ATTENTION");
                $("#status2").css("color", "red");
            } else {
                $("#status2").text("normal");
                $("#status2").css("color", "green");
            }

            // Send alert message?
            if (Math.abs(cpn) > PRICE_ALERT_PERCENT_MESSAGING_LIMIT) {
                sendAlertMessage(symbol2, "Price alert for " + symbol2, "Price alert for " + symbol2 + " percent change is " + changePercent + "%");
            }

            // Symbol 3
            indexer = 2;
            ticker = items[indexer].t;
            lastPrice = items[indexer].l;
            changePercent = items[indexer].cp;
            open = items[indexer].pcls_fix;
            console.log("Last price for " + ticker + " is " + lastPrice);
            $("#quote3").text(ticker + " " + lastPrice);
            $("#time3").text(new Date().toLocaleTimeString());
            $("#percentChange3").text(changePercent + "%");
            $("#gauge3").jqxGauge('value', changePercent);
            $("#lgauge3").jqxLinearGauge('value', lastPrice);

            cpn = Number(changePercent);
            if (Math.abs(cpn) > PRICE_ALERT_PERCENT_LIMIT) {
                $("#status3").text("PAY ATTENTION");
                $("#status3").css("color", "red");
            } else {
                $("#status3").text("normal");
                $("#status3").css("color", "green");
            }

            // Send alert message?
            if (Math.abs(cpn) > PRICE_ALERT_PERCENT_MESSAGING_LIMIT) {
                sendAlertMessage(symbol3, "Price alert for " + symbol3, "Price alert for " + symbol3 + " percent change is " + changePercent + "%");
            }

            // Symbol 4
            indexer = 3;
            ticker = items[indexer].t;
            lastPrice = items[indexer].l;
            changePercent = items[indexer].cp;
            open = items[indexer].pcls_fix;
            console.log("Last price for " + ticker + " is " + lastPrice);
            $("#quote4").text(ticker + " " + lastPrice);
            $("#time4").text(new Date().toLocaleTimeString());
            $("#percentChange4").text(changePercent + "%");
            $("#gauge4").jqxGauge('value', changePercent);
            $("#lgauge4").jqxLinearGauge('value', lastPrice);

            cpn = Number(changePercent);
            if (Math.abs(cpn) > PRICE_ALERT_PERCENT_LIMIT) {
                $("#status4").text("PAY ATTENTION");
                $("#status4").css("color", "red");
            } else {
                $("#status4").text("normal");
                $("#status4").css("color", "green");
            }

            // Send alert message?
            if (Math.abs(cpn) > PRICE_ALERT_PERCENT_MESSAGING_LIMIT) {
                sendAlertMessage(symbol4, "Price alert for " + symbol4, "Price alert for " + symbol4 + " percent change is " + changePercent + "%");
            }

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
                style: {fill: 'orange', stroke: 'red'},
                startDistance: 0,
                endDistance: 0
            },
            {
                startValue: -10,
                endValue: -5,
                style: {fill: 'yellow', stroke: 'green'},
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
                style: {fill: 'yellow', stroke: 'green'},
                startDistance: 0,
                endDistance: 0
            },
            {
                startValue: 10,
                endValue: 15,
                style: {fill: 'orange', stroke: 'red'},
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
        cap: {size: '5%', style: {fill: 'blue', stroke: 'orange'}},
        border: {style: {fill: '#8e9495', stroke: '#7b8384', 'stroke-width': 1}},
        ticksMinor: {interval: 1, size: '5%'},
        ticksMajor: {interval: 20, size: '10%'},
        labels: {position: 'outside', interval: 5},
        pointer: {style: {fill: 'darkgray'}, width: 5},
        width: '200px',
        height: '200px',
        min: -30,
        max: 30,
        animationDuration: 1500
    });
    $gauge.jqxGauge('value', 0);
}

/**
 * Setup linear gauge in UI
 *
 * @param $lgauge the gauge div
 */
function setupLinearGauge($lgauge, min, max, baseValue) {

    $lgauge = $lgauge || $('#lgauge');

    $lgauge.jqxLinearGauge({
        orientation:'horizontal',
        value: baseValue,
        width: 300,
        height: 80,
        max: max,
        min: min,
        pointer: {
            size: '5%'
        },
        colorScheme: 'scheme02',
        ticksMajor: {
            size: '10%',
            interval: 10
        },
        ticksMinor: {
            size: '5%',
            interval: 2.5,
            style: {
                'stroke-width': 1,
                stroke: '#aaaaaa'
            }
        },
        ranges: [{
            startValue: min,
            endValue: baseValue,
            style: {
                fill: 'orangered',
                stroke: 'orangered'
            }
        }, {
            startValue: baseValue,
            endValue: max,
            style: {
                fill: 'limegreen',
                stroke: 'limegreen'
            }
        }]
    });
}

/**
 * Send an alert message, but don't send them too often
 *
 * @param symbol the stock symbol
 * @param subject the subject
 * @param message the message
 */
function sendAlertMessage(symbol, subject, message) {

    // Check the cache. If the value is true, that means we've sent a notification already
    if (notificationCache[symbol] == true) {
        return false;
    }

    sendMessage(subject, message);

    console.log('Alert message sent for: ' + symbol);
    console.log("Updating notification cache entry for " + symbol);
    notificationCache[symbol] = true;                     // Set notified to true
    notificationCacheExpiration[symbol] = Date.now();     // Save time notified

}

/**
 * Load the chart data from the data service
 *
 * @param subject the subject
 * @param message the message
 */
function sendMessage(subject, message) {

    // URL to the mapped GET method on the Spring MVC controller servlet
    var url = "http://ec2-52-24-129-230.us-west-2.compute.amazonaws.com/datacollector/sendMessage";

    // Construct a JS Object that has properties named the same as the parameters the mapped GET method on the server
    // is looking for. These get encoded properly by ajax by setting the data property below.
    var data = {};
    data.subject = subject;
    data.message = message;

    $.ajax({
        type: "GET",
        url: url,
        data: data,
        success: function (data) {
            // Do something here
        },
        error: function (xhr) {
            //alert("error");
            // alert(xhr.responseText);
        }
    });
}

function setDelayTime() {
    setTimeout("displayStockData();", $refreshIntervalMS);
}

/**
 * Check the notification status and expire
 *
 * @param symbol
 */
function updateNotificationExpirationStatus(symbol) {

    // Expire notification cache if needed so we know to notify again
    if (isNotificationCacheEntryExpiryTime(symbol)) {
        console.log("Clearing notification cache for " + symbol);
        notificationCache[symbol] = false;
    }
}

/**
 * Determine if its time to expire the cache for the ticker passed
 *
 * @param symbol the ticker symbol
 * @returns true/false
 */
function isNotificationCacheEntryExpiryTime(symbol) {

    // Short-circuit if the symbol hasn't been added to the JS Map (Object)
    if (!notificationCacheExpiration[symbol]) {
        return false;
    }

    // Return whether now is past the last notification timestamp in ms + the wait interval
    var now = Date.now();
    var pastPlusInterval = (notificationCacheExpiration[symbol] + NOTIFICATION_INTERVAL_MS);
    var gap = now - pastPlusInterval;
    var expireCache = gap >= 0;
    return expireCache;
}

/**
 * After hours?
 * @returns {boolean}
 */
function afterHours() {

    // Don't send alerts after hours or over weekends
    // Don't send if < 14:30 UTC or >= 20 or Sat/Sun (if less than 830 and if hour is > 2pm
    var currentHour = new Date().getUTCHours();
    var currentMinute = new Date().getUTCMinutes();
    var currentDay = new Date().getUTCDay();

    // Using UTC hour comparison here
    if (currentDay > 5 || (currentHour < 14 && currentMinute < 30) || currentHour >= 20) {
        console.log("It IS AFTER HOURS --- time is " + new Date());
        return true;
    }
    console.log("It IS NOT AFTER HOURS --- time is " + new Date());
    return false;
}
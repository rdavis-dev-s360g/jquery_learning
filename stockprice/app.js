
// Vars
var oneSecondMS = 1000;
var oneMinuteMS = 60 * oneSecondMS;
var oneHourMS = 60 * oneMinuteMS;
var $refreshIntervalMS = 1 * oneMinuteMS;
var PRICE_ALERT_PERCENT_LIMIT = 10;
var PRICE_ALERT_PERCENT_MESSAGING_LIMIT = 15;

// Store state of notifications so we control when they go out
var notificationCache = {};
var notificationCacheExpiration = {};
var NOTIFICATION_INTERVAL_MINS = 15;
var NOTIFICATION_INTERVAL_MS = NOTIFICATION_INTERVAL_MINS * 60 * 1000;

// Symbols to get prices of
var symbol1 = "nugt";
var symbol2 = "uwti";
var symbol3 = "dust";
var symbol4 = "dwti";
var symbol5 = "gbtc";
var symbol6 = "vix";

// load up the app
$(function() {
    var box = $("#box");
    var para = $("p");

    // Pre-seed notification cache
    notificationCache[symbol1] = false;
    notificationCache[symbol2] = false;
    notificationCache[symbol3] = false;
    notificationCache[symbol4] = false;
    notificationCache[symbol5] = false;
    notificationCache[symbol6] = false;

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
    setupGauge($("#gauge5"));
    setupGauge($("#gauge6"));

    setupLinearGauge($("#lgauge1"), 20, 60, 35);
    setupLinearGauge($("#lgauge2"), 0, 40, 13.5 );
    setupLinearGauge($("#lgauge3"), 0, 20, 8.5);
    setupLinearGauge($("#lgauge4"), 150, 300, 234 );
    setupLinearGauge($("#lgauge5"), 15, 75, 42);
    setupLinearGauge($("#lgauge6"), 5, 40, 16 );
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
    updateNotificationExpirationStatus(symbol5);
    updateNotificationExpirationStatus(symbol6);

    // Get stock prices for symbols separated by commas
    var url = "http://www.google.com/finance/info?q=NSE:" + symbol1 + "," + symbol2 + "," + symbol3 + "," + symbol4 + "," + symbol5 + "," + symbol6;

    $.ajax({
        type: "GET",
        url: url,
        dataType: "jsonp",
        success: function (data) {

            // Iterate over the json results and build an Array of data objects
            var items = [];
            $.each( data, function( key, val ) {
                items.push(val);
            });

            // Symbol 1
            var indexer = 0;

            // Build pods
            updatePod(indexer, items[indexer]);
            indexer++;
            updatePod(indexer, items[indexer]);
            indexer++;
            updatePod(indexer, items[indexer]);
            indexer++;
            updatePod(indexer, items[indexer]);
            indexer++;
            updatePod(indexer, items[indexer]);
            indexer++;
            updatePod(indexer, items[indexer]);

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
 * Build html quote and gauge (pod) addressed by passed indexer
 *
 * @param indexer index of pod
 * @param item stock data item
 */
function updatePod(indexer, item) {

    var ticker = item.t;
    var lastPrice = item.l;
    var changePercent = item.cp;
    var open = item.pcls_fix;
    console.log("Last price for " + ticker + " is " + lastPrice);
    $("#quote" + (indexer + 1)).text(ticker + " " + lastPrice);
    $("#time" + (indexer + 1)).text(new Date().toLocaleTimeString());
    $("#percentChange" + (indexer + 1)).text(changePercent + "%");
    $("#gauge" + (indexer + 1)).jqxGauge('value', changePercent);
    $("#lgauge" + (indexer + 1)).jqxLinearGauge('value', lastPrice);

    var cpn = Number(changePercent);
    // If % up or down is greater than PRICE_ALERT_PERCENT_LIMIT
    if (Math.abs(cpn) > PRICE_ALERT_PERCENT_LIMIT) {
        $("#status" + (indexer + 1)).text("PAY ATTENTION");
        $("#status" + (indexer + 1)).css("color", "red");
    } else {
        $("#status" + (indexer + 1)).text("normal");
        $("#status" + (indexer + 1)).css("color", "green");
    }

    // Send alert message?
    if (Math.abs(cpn) > PRICE_ALERT_PERCENT_MESSAGING_LIMIT) {
        sendAlertMessage(ticker, "Price alert for " + ticker, "Price alert for " + ticker + " percent change is " + changePercent + "%");
    }
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
        animationDuration: 2500
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
        width: 250,
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
    if (symbol == "VIX" || notificationCache[symbol] == true) {
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
    if (currentDay > 5 || (currentHour < 14 && currentMinute < 30) || currentHour >= 21) {
        console.log("It IS AFTER HOURS --- time is " + new Date());
        return true;
    }
    console.log("It IS NOT AFTER HOURS --- time is " + new Date());
    return false;
}
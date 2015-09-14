// Body onload
$(document).ready(function () {

    // Vars
    var $theform = $("#theform");
    var $thebutton = $("#uploadForm");
    var $theFileSelector = $("#file");
    var $fileName = $("#name");
    var $theClearButton = $("#clearUL");
    var $theShowThrobberButton = $("#showT");

    // Get filename when a file is selected for upload
    $theFileSelector.change(function () {
        // alert('Selected file: ' + this.value);

        // Get just the file name
        var path = this.value;

        var pos = path.lastIndexOf("\\");
        path = path.substring(++pos);
        $fileName.val(path);

        // Reset thumbnail element
        resetThumbnails();
    });

    // Register button click handler
    $thebutton.click(function () {
        uploadForm();
    });

    // Register button click handler
    $theClearButton.click(function () {
        resetThumbnails();
    });

    // Register button click handler
    $theShowThrobberButton.click(function () {
        showThrobber();
    });

    // Register form submit handler
    $theform.submit(function (event) {

        // Reset thumbnail element
        resetThumbnails();

        // Show throbber
        showThrobber();

        // FormData encodes the form (this) including any mult-part mime type file data and additional text input
        // fields into one variable that can be POST-ed to the server while retaining the proper format of the
        // file data. This is crucial since without it, there isn't a way to post the data properly to the
        // upload handler on the server
        var data = new FormData(this);

        // Use jquery built-in ajax POST support
        $.ajax({
            url: "http://localhost:8080/PDFManager/uploadFile",
            type: "POST",
            data: data,
            processData: false,
            contentType: false
        })
            .done(function (response) {
                var decodedResponse = jQuery.parseJSON(response);
                // alert("response: " + decodedResponse);

                // Get reference to lightSlider object
                var i = 0;
                $.each(decodedResponse, function(key) {
                   // alert(decodedResponse[key]);

                    var imgUrl = decodedResponse[key];

                    var li = $('<li/>')
                        .addClass('item-c')
                        .appendTo($("#lightSlider"));

                    var img = $('<img/>');
                        img.attr('src', imgUrl);
                        img.appendTo(li);
                });

                // Refresh ul
                $('#lightSlider').lightSlider({
                    autoWidth:true,
                    loop:true
                });

                // alert("done!");
            })
            .fail(function () {
                alert("error");
            })
            .always(function () {
                // alert("complete");
                // Hide throbber
                hideThrobber();
            });

        event.preventDefault();
    });
})

// Upload button click handler
function uploadForm() {

    // alert( "Handler for .click() called." );
    var $theform = $("#theform");

    // This calls the registered function handler above, it doesn't actually submit the form in the old HTML way
    $theform.submit();
}

/**
 * Reset html component that holds the thumbnails
 */
function resetThumbnails() {

    // Hide throbber
    hideThrobber();

    // Validate that there is one to remove
    if ($("#lightSlider").length > 0) {

        // Clear ul
        $('#lightSlider').remove();
        $('.lSSlideOuter').remove();
    }

    // Add it back
    var ul = $("<ul id='lightSlider'/>")
        .appendTo($("#container"));

    // Refresh ul
    $('#lightSlider').lightSlider({
        autoWidth: true,
        loop: true
    });

    // Setup drag
    setupDragPlugin();

    $("#status").text("resetThumbnail element");

    // Add drop target div

    // Validate that there is one to remove
    if ($("#dvDest").length > 0) {

        // Clear ul
        $('#dvDest').remove();
    }

    var $div = $('<div />').appendTo('body');
    $div.attr('id', 'dvDest');
    $div.text("Drop here");
    $div.addClass('container');

    // Setup drop
    setupDropPlugin();
}

/**
 * Show the progress indicator
 */
function showThrobber() {
    $("#throbber").removeClass("hide");
    $("#throbber").addClass("show");
}

/**
 * Hide the progress indicator
 */
function hideThrobber() {

    // Hide throbber
    $("#throbber").removeClass("show");
    $("#throbber").addClass("hide");
}

function setupDragPlugin() {

    // Setup jquery-ui draggable plugin on source DIV
    $("#lightslider li img").draggable({
        revert: "invalid",
        refreshPositions: true,
        drag: function (event, ui) {
            ui.helper.addClass("draggable");
        },
        stop: function (event, ui) {
            ui.helper.removeClass("draggable");
            var image = this.src.split("/")[this.src.split("/").length - 1];
            if ($.ui.ddmanager.drop(ui.helper.data("draggable"), event)) {
                alert(image + " dropped.");
            }
            else {
                alert(image + " not dropped.");
            }
        }
    });
}

function setupDropPlugin() {

    // Setup jquery-ui droppable plugin on destination DIV
    $("#dvDest").droppable({
        drop: function (event, ui) {
            if ($("#dvDest img").length == 0) {
                $("#dvDest").html("");
            }
            ui.draggable.addClass("dropped");
            $("#dvDest").append(ui.draggable);
        }
    });
}
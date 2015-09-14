// Body onload
$(document).ready(function() {

    // Vars
    var $theform = $("#theform");
    var $thebutton = $("#uploadForm");

    // Register button click handler
    $thebutton.click(function() {
        uploadForm();
    });

    // Register form submit handler
    $theform.submit(function(event) {

        var data = new FormData(this);
        // alert("Handler for .submit() called.");

        $.ajax( {
            url: "http://localhost:8080/PDFManager/uploadFile",
            type: "POST",
            data: data,
            processData: false,
            contentType: false
        })
        .done(function(msg) {
            alert("response: " + msg);
        })
        .fail(function() {
            alert("error");
        })
        .always(function() {
            alert("complete");
        });

        event.preventDefault();
    } );
})

// Upload button click handler
function uploadForm() {

    //alert( "Handler for .click() called." );
    var $theform = $("#theform");
    $theform.submit();
}
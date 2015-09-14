$(document).ready(function() {
    $("#fileuploader").uploadFile({
        url:"http://localhost:8080/PDFManager/uploadFile",
        fileName:"name"
    });
});


//https://github.com/kjur/jsrsasign/wiki#programming-tutorial

// load up the app
$(function() {
    $("#encode").click(function() {
        createJWT();
    });
});

function createJWT() {
    // Header
    var oHeader = {alg: 'HS256', typ: 'JWT'};

    // Payload
    var oPayload = {};
    var tNow = KJUR.jws.IntDate.get('now');
    var tEnd = KJUR.jws.IntDate.get('now + 1day');
    oPayload.iss = "http://www.source360group.com";
    oPayload.sub = "mailto:rdavis@source360group.com";
    oPayload.nbf = tNow;
    oPayload.iat = tNow;
    oPayload.exp = tEnd;
    oPayload.jti = "id123456";
    oPayload.aud = "http://foo.com/employee";

    // Sign JWT, password=secret2
    var sHeader = JSON.stringify(oHeader);
    var sPayload = JSON.stringify(oPayload);
    var sJWT = KJUR.jws.JWS.sign("HS256", sHeader, sPayload, "secret2");
    $("#encodedValue").text(sJWT);
}


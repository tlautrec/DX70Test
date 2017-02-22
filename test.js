console.log('How about no?');

var unirest = require("unirest");
const authorization = "Basic YWRtaW46";

beginSession();

function beginSession() {
    unirest.post('http://10.11.2.25/xmlapi/session/begin')
    .headers({
        authorization
    })
    .end(function(res) {
        if (res.error) throw new Error(res.error);
        var _cookie = JSON.stringify(res.headers["set-cookie"]).split(";")[0].substring(2);
        console.log("the cookie is: " + _cookie);
        engageSession(_cookie);
    });
}

function engageSession(cookie) {
   postAlert("Important", "You suck!", 10, cookie);
   endSession(cookie)
}

function endSession(cookie) {
    unirest.post('http://10.11.2.25/xmlapi/session/end')
    .headers({
        authorization,
        cookie
    })
    .end(function(res) {
        if (res.error) throw new Error(res.error);
        if (JSON.stringify(res.headers["set-cookie"]).includes("Max-Age=0")) console.log("Session successfully closed!");
        else console.log("Please close session with id: " + cookie + " manually!");
    });
}

function postAlert(title, msg, duration, cookie) {
    unirest.post('http://10.11.2.25/putxml')
    .headers({
        authorization,
        cookie,
        "content-type": "text/xml"
    })
    //we can make this prettier
    .send("<Command>\r\n<UserInterface>\r\n<Message>\r\n<Alert>\r\n<Display command=\"True\">\r\n<Duration>" + duration + "</Duration>\r\n<Title>" + title + "</Title>\r\n<Text>" + msg + "</Text>\r\n</Display>\r\n</Alert>\r\n</Message>\r\n</UserInterface>\r\n</Command>")
    .end(function (res) {
        if (res.error) throw new Error(res.error);
    });
}

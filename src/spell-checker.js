var najax = require('najax');
var param = require('jquery-param');

var replaceTxt = function(orgTxt, offset, newStr, oldStr) {
    var len = oldStr.length;
    var firstChunk = orgTxt.substr(0, offset);
    var secondChunk = orgTxt.substr(offset + len);

    return firstChunk.concat(newStr, secondChunk);
}

var generateRespond = function(orgTxt, data) {
    var dataJson = JSON.parse(data);
    var tokenCount = dataJson.flaggedTokens.length;

    for (var i = tokenCount - 1; i >= 0; i--) {
        var token = dataJson.flaggedTokens[i];
        if (token.suggestions.length > 0) {
            var oldStr = token.token;
            var newStr = token.suggestions[0].suggestion;
            orgTxt = replaceTxt(orgTxt, token.offset, newStr, oldStr);
        }
    }

    return orgTxt;
}

exports.check = function(text, callBack) {
    var params = {
        // Request parameters
        "text": text,
        "mode": "proof"
    };

    najax({
        url: "https://api.cognitive.microsoft.com/bing/v5.0/spellcheck/?" + param(params),
        beforeSend: function(xhrObj){
            // Request headers
            xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key","deb94a0b5677447686e9616ff2503a08");
        },
        type: "GET",
        // Request body
        data: "{body}",
    })
    .done(function(data) {
        console.log("success:"+data);
        callBack(generateRespond(text, data))
    })
    .fail(function(e) {
        console.log("error:"+ JSON.stringify(e));
        callBack("A problem occured while connecting to Bing service. Please try again later.")
    });
}

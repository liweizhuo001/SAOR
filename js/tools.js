/**
*  extends javascript function 
*/
String.prototype.format = function (args) {
    var result = this;
    if (arguments.length > 0) {
        if (arguments.length == 1 && typeof (args) == "object") {
            for (var key in args) {
                if (args[key] != undefined) {
                    var reg = new RegExp("({" + key + "})", "g");
                    result = result.replace(reg, args[key]);
                }
            }
        }
        else {
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] != undefined) {
                    var reg = new RegExp("({[" + i + "]})", "g");
                    result = result.replace(reg, arguments[i]);
                }
            }
        }
    }
    return result;
};

/**
* Get the query string of current URL
*/
var request = {
    QueryString: function (val) {
        var uri = window.location.search;
        var re = new RegExp("" + val + "=([^&?]*)", "ig");
        return ((uri.match(re)) ? (uri.match(re)[0].substr(val.length + 1)) : null);
    }
};

function showWaiting() {
    $("#loading-mask").show();
    $("#loading").show();
}
function hideWaiting() {
    //$("#loading-mask").hide("slow");
    $("#loading-mask").fadeOut("normal");
    $("#loading").fadeOut("normal");
}

/**
 * Design the width with precent
 */
function fixWidth(percent) {
    return document.body.clientWidth * percent;    
}

/**
 * Pop message window
 * title:标题 msgString:提示信息 msgType:信息类型 [error,info,question,warning]
 */
function msgShow(title, msgString, msgType) {
	$.messager.alert(title, msgString, msgType);
}

﻿/**
 * WebWin API JavaScript Library v1.0
 * http://docs.webwin.hostoi.com/
 * webwinapi@mail.ru
 * Compressed by the best JS compressor http://jscrambler.com/
 * Copyright (c) 2012 Ivan Chernovalov
 */
(function(window, undefined){
var logError_errors = {
    REINIT : "WebWin has already been initialized."
};
var initialized = false;
var $WW_width = document.documentElement.clientWidth; //Ширина экрана
var $WW_height = document.documentElement.clientHeight; //Высота экрана
var $WW_BgUrl; //Url Изображения рабочего стола
var $moveObj = false; //Объект который надо передвинуть
var $resizeObj = false; //Объект который надо растянуть
var $resizeDir; //Направление растягивания
var $posX = 0; //Начальная позиция курсора по оси OX
var $posY = 0; //Начальная позиция курсора по оси OY
var $WW_windows = []; //Окна WebWin
var $WW_appTray = []; //Значки трея WebWin
var browsers = ["Opera", "Netscape", "Explorer"];
var $WW_browser = "unknown";
var winStd = {title:"Окно", body:"Содержимое", minIcoUrl:false, icoUrl:false, posY:0, posX:0, width:200, height:150, resizable:true, scrolling:"none"};
// Перехват событий
document.ondragstart = function () {
    return false;
};
document.onselectstart = function () {
    return false;
};
document.ondragend = function () {
    return false;
};
//

// Дополнительные функции
    function addClass(o, c){
        var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
            if (re.test(o.className)) return;
    	    o.className = (o.className + " " + c).replace(/\s+/g, " ").replace(/(^ | $)/g, "");
    }
    function removeClass(o, c){
        var re = new RegExp("(^|\\s)" + c + "(\\s|$)", "g");
        o.className = o.className.replace(re, "$1").replace(/\s+/g, " ").replace(/(^ | $)/g, "");
    }
    Object.prototype._extend = function(o){
        var obj = this;
        for(var i in o){
            obj[i] = o[i];
        }
    };

//
for (var i in browsers) {
    if ($WW_browser == "unknown") {
        $WW_browser = ((navigator.appName.indexOf(browsers[i]) != -1) ? browsers[i] : "unknown");
    }
}
function logError(errcode) { //Функция логгер ошибок
    for(var i in logError_errors){
        if(errcode == i){
            console.log(logError_errors[i]);
            break;
        }
    }
}
function fixEvent(evt) {
    return ((window.event) ? (window.event) : (evt));
}
function getTarget(evt) {
    return ((window.event) ? (window.event.srcElement) : (evt.target));
}
function $updateTray(ico) {
    var $o_tray = document.getElementById("WWtray");
    var $desktop = document.getElementById("WebWinDesk");
    if ($o_tray) {
        $desktop.removeChild($o_tray, true);
    }
    var $tray = document.createElement("div");
    $tray.id = "WWtray";
    $tray.style.width = $WW_width + "px";
    var $start = document.createElement("div");
    $start.id = "WWstart";
    $start.title = "Пуск";
    var $applist = document.createElement("div");
    $applist.id = "WWapplist";
    $applist.style.width = $WW_width - 310 + "px";
    var $apptray = document.createElement("div");
    $apptray.id = "WWapptray";
    var $WWclock = document.createElement("div");
    $WWclock.id = "WWclock";
    $tray.appendChild($WWclock);
    var $clockval = document.createElement("div");
    $clockval.id = "WWclock_val";
    $clockval.setAttribute("unselectable", "on");
    $WWclock.appendChild($clockval);
    var $clockdate = document.createElement("div");
    $clockdate.setAttribute("unselectable", "on");
    $clockdate.id = "WWclock_date";
    $WWclock.appendChild($clockdate);
    $timer = setInterval($clockUpd, 1000);
    $desktop.appendChild($tray);
    $tray.appendChild($start);
    $tray.appendChild($applist);
    $tray.appendChild($apptray);
    var n = 5;
    var max_ = parseInt(($WW_width - 340) / 60);
    var _num;
    var wid = 60;
    do {
        _num = (n < max_ ? max_ : parseInt(($WW_width - 340) / wid));
        wid--;
    } while ((n >= parseInt(($WW_width - 340) / wid)) && wid > 40);
    if (ico) {
        var index = $WW_appTray.push(obj);
    }
}
function getIndex(obj) {
    return obj.id.charAt(obj.id.length - 1); //Функция возвращает индекс полученного элемента
}
function $resizeD(evt) {
    var button = fixEvent(evt).button;
    if ((($WW_browser == "Opera" || $WW_browser == "Netscape") && button == 0) || ($WW_browser == "Explorer" && button == 1)) {
        $resizeObj = getTarget(evt);
        $posX = fixEvent(evt).clientX;
        $posY = fixEvent(evt).clientY;
        document.getElementById("WWwinBody" + getIndex($resizeObj)).style.visibility = "hidden";
        WW.getWindowById(getIndex($resizeObj)).$nowResized$ = true;
    }
}
function $resizeU(evt) {
    if ($resizeObj) {
        var winObj = document.getElementById("WWwin" + getIndex($resizeObj));
        var button = fixEvent(evt).button;
        if ((($WW_browser == "Opera" || $WW_browser == "Netscape") && button == 0) || ($WW_browser == "Explorer" && button == 1)) {
            document.getElementById("WWwinBody" + getIndex($resizeObj)).style.visibility = "visible";
            WW.getWindowById(getIndex($resizeObj)).setWidth(parseInt(winObj.style.width));
            WW.getWindowById(getIndex($resizeObj)).setHeight(parseInt(winObj.style.height));
            WW.getWindowById(getIndex($resizeObj)).$nowResized$ = false;
            $resizeObj = false;
        }
    }
}
//TODO: What if the window = null?
function $moveD(evt) {
    var button = fixEvent(evt).button;
    if ((($WW_browser == "Opera" || $WW_browser == "Netscape") && button == 0) || ($WW_browser == "Explorer" && button == 1)) {
        $moveObj = getTarget(evt);
        if (!WW.getWindowById(getIndex($moveObj)).$nowMoved$) {
            $posX = fixEvent(evt).clientX;
            $posY = fixEvent(evt).clientY;
            document.getElementById("WWwinBody" + getIndex($moveObj)).style.visibility = "hidden";
            WW.getWindowById(getIndex($moveObj)).$nowMoved$ = true;
        }
    }
}
function $moveU(evt) {
    var winObj = document.getElementById("WWwin" + getIndex($moveObj));
    document.getElementById("WWwinBody" + getIndex($moveObj)).style.visibility = "visible";
    WW.getWindowById(getIndex($moveObj)).$posX$ = parseInt(winObj.style.left);
    WW.getWindowById(getIndex($moveObj)).$posY$ = parseInt(winObj.style.top);
    WW.getWindowById(getIndex($moveObj)).$nowMoved$ = false;
    $moveObj = false;
}
function $setResizeBars(obj) { //Создать полосы растягивания
    var WBResize = document.createElement("div");
    WBResize.className = "bresize";
    WBResize.id = "Winbresize" + getIndex(obj);
    var WRResize = document.createElement("div");
    WRResize.className = "rresize";
    WRResize.id = "Winrresize" + getIndex(obj);
    var WLResize = document.createElement("div");
    WLResize.className = "lresize";
    WLResize.id = "Winlresize" + getIndex(obj);
    var WRBResize = document.createElement("div");
    WRBResize.className = "rbresize";
    WRBResize.id = "Winrbresize" + getIndex(obj);
    var WLBResize = document.createElement("div");
    WLBResize.className = "lbresize";
    WLBResize.id = "Winlbresize" + getIndex(obj);
    var WTResize = document.createElement("div");
    WTResize.className = "tresize";
    WTResize.id = "Wintresize" + getIndex(obj);
    var WRTResize = document.createElement("div");
    WRTResize.className = "rtresize";
    WRTResize.id = "Wintbresize" + getIndex(obj);
    var WLTResize = document.createElement("div");
    WLTResize.className = "ltresize";
    WLTResize.id = "Winltresize" + getIndex(obj);
    WRBResize.onmousedown = function (evt) {
        $resizeDir = "rb";
        $resizeD(evt);
    };
    WLBResize.onmousedown = function (evt) {
        $resizeDir = "lb";
        $resizeD(evt);
    };
    WRResize.onmousedown = function (evt) {
        $resizeDir = "r";
        $resizeD(evt);
    };
    WLResize.onmousedown = function (evt) {
        $resizeDir = "l";
        $resizeD(evt);
    };
    WBResize.onmousedown = function (evt) {
        $resizeDir = "b";
        $resizeD(evt);
    };
    WTResize.onmousedown = function (evt) {
        $resizeDir = "t";
        $resizeD(evt);
    };
    WLTResize.onmousedown = function (evt) {
        $resizeDir = "lt";
        $resizeD(evt);
    };
    WRTResize.onmousedown = function (evt) {
        $resizeDir = "rt";
        $resizeD(evt);
    };
    obj.appendChild(WRBResize);
    obj.appendChild(WLBResize);
    obj.appendChild(WBResize);
    obj.appendChild(WRResize);
    obj.appendChild(WLResize);
    obj.appendChild(WTResize);
    obj.appendChild(WRTResize);
    obj.appendChild(WLTResize);
}
//TODO: reduce - свернуть окно до размера кнопки (когда нет explorer.exe)
function $setWinButts(index) { //Создать кнопки окна
    var WButContainer = document.createElement("div");
    WButContainer.className = "WButContainer";
    WButContainer.id = "WButContainer" + index;
    var WButMinimize = document.createElement("div");
    WButMinimize.className = "WButMinimize WButNormal";
    WButMinimize.id = "WButMinimize" + index;
    WButMinimize.onmousedown = function (evt) {
        var button = fixEvent(evt).button;
        if ((($WW_browser == "Opera" || $WW_browser == "Netscape") && button == 0) || ($WW_browser == "Explorer" && button == 1)) {
            var theBut =  document.getElementById("WButMinimize" + getIndex(getTarget(evt)));
            removeClass(theBut, "WButMOver");
            addClass(theBut,"WButMDown");
        }
    };
    WButMinimize.onmouseup = function (evt) {
        var button = fixEvent(evt).button;
        if ((($WW_browser == "Opera" || $WW_browser == "Netscape") && button == 0) || ($WW_browser == "Explorer" && button == 1)) {
            var theBut =  document.getElementById("WButMinimize" + getIndex(getTarget(evt)));
            removeClass(theBut, "WButMDown");
            addClass(theBut,"WButNormal");
            WW.getWindowById(getIndex(getTarget(evt))).minimize();
        }
    };
    WButMinimize.onmouseover = function (evt) {
        var button = fixEvent(evt).button;
        if ((($WW_browser == "Opera" || $WW_browser == "Netscape") && button == 0) || ($WW_browser == "Explorer" && button == 1)) {
            var theBut =  document.getElementById("WButMinimize" + getIndex(getTarget(evt)));
            removeClass(theBut, "WButNormal");
            addClass(theBut,"WButHover");
        }
    };
    WButMinimize.onmouseout = function (evt) {
        var button = fixEvent(evt).button;
        if ((($WW_browser == "Opera" || $WW_browser == "Netscape") && button == 0) || ($WW_browser == "Explorer" && button == 1)) {
            var theBut =  document.getElementById("WButMinimize" + getIndex(getTarget(evt)));
            removeClass(theBut, "WButHover");
            removeClass(theBut,"WButMDown");
            addClass(theBut,"WButNormal");
        }
    };
    var WButRestMax = document.createElement("div");
    WButRestMax.className = "WButMaximize WButNormal";
    WButRestMax.id = "WButRestMax" + index;
    WButRestMax.onmousedown = function (evt) {
        var button = fixEvent(evt).button;
        if ((($WW_browser == "Opera" || $WW_browser == "Netscape") && button == 0) || ($WW_browser == "Explorer" && button == 1)) {
            var theBut =  document.getElementById("WButRestMax" + getIndex(getTarget(evt)));
            removeClass(theBut, "WButMOver");
            addClass(theBut,"WButMDown");
        }
    };
    WButRestMax.onmouseup = function (evt) {
        var button = fixEvent(evt).button;
        if ((($WW_browser == "Opera" || $WW_browser == "Netscape") && button == 0) || ($WW_browser == "Explorer" && button == 1)) {
            var theBut =  document.getElementById("WButRestMax" + getIndex(getTarget(evt)));
            removeClass(theBut, "WButMDown");
            addClass(theBut,"WButNormal");
            if(WW.getWindowById(getIndex(getTarget(evt))).isMaximized()){
                WW.getWindowById(getIndex(getTarget(evt))).restore();
            }
            else {
                WW.getWindowById(getIndex(getTarget(evt))).maximize();
            }
        }
    };
    WButRestMax.onmouseover = function (evt) {
        var button = fixEvent(evt).button;
        if ((($WW_browser == "Opera" || $WW_browser == "Netscape") && button == 0) || ($WW_browser == "Explorer" && button == 1)) {
            var theBut =  document.getElementById("WButRestMax" + getIndex(getTarget(evt)));
            removeClass(theBut, "WButNormal");
            addClass(theBut,"WButHover");
        }
    };
    WButRestMax.onmouseout = function (evt) {
        var button = fixEvent(evt).button;
        if ((($WW_browser == "Opera" || $WW_browser == "Netscape") && button == 0) || ($WW_browser == "Explorer" && button == 1)) {
            var theBut =  document.getElementById("WButRestMax" + getIndex(getTarget(evt)));
            removeClass(theBut, "WButHover");
            removeClass(theBut,"WButMDown");
            addClass(theBut,"WButNormal");
        }
    };
    var WButClose = document.createElement("div");
    WButClose.className = "WButClose WButClNormal";
    WButClose.id = "WButClose" + index;
    WButClose.onmousedown = function (evt) {
        var button = fixEvent(evt).button;
        if ((($WW_browser == "Opera" || $WW_browser == "Netscape") && button == 0) || ($WW_browser == "Explorer" && button == 1)) {
            var theBut =  document.getElementById("WButClose" + getIndex(getTarget(evt)));
            removeClass(theBut, "WButClMOver");
            addClass(theBut,"WButClMDown");
        }
    };
    WButClose.onmouseup = function (evt) {
        var button = fixEvent(evt).button;
        if ((($WW_browser == "Opera" || $WW_browser == "Netscape") && button == 0) || ($WW_browser == "Explorer" && button == 1)) {
            var theBut =  document.getElementById("WButClose" + getIndex(getTarget(evt)));
            removeClass(theBut, "WButClMDown");
            addClass(theBut,"WButClNormal");
            WW.getWindowById(getIndex(getTarget(evt))).close();
        }
    };
    WButClose.onmouseover = function (evt) {
        var button = fixEvent(evt).button;
        if ((($WW_browser == "Opera" || $WW_browser == "Netscape") && button == 0) || ($WW_browser == "Explorer" && button == 1)) {
            var theBut =  document.getElementById("WButClose" + getIndex(getTarget(evt)));
            removeClass(theBut, "WButClNormal");
            addClass(theBut,"WButClHover");
        }
    };
    WButClose.onmouseout = function (evt) {
        var button = fixEvent(evt).button;
        if ((($WW_browser == "Opera" || $WW_browser == "Netscape") && button == 0) || ($WW_browser == "Explorer" && button == 1)) {
            var theBut =  document.getElementById("WButClose" + getIndex(getTarget(evt)));
            removeClass(theBut, "WButClHover");
            removeClass(theBut,"WButClMDown");
            addClass(theBut,"WButClNormal");
        }
    };

    WButContainer.appendChild(WButMinimize);
    WButContainer.appendChild(WButRestMax);
    WButContainer.appendChild(WButClose);
    var top = document.getElementById("WWwinTop" + index);
    top.appendChild(WButContainer);

}
function $doMoveObj(evt) { //Передвинуть объект
    if ($moveObj) {
        var clientX = fixEvent(evt).clientX;
        var clientY = fixEvent(evt).clientY;
        var obj = document.getElementById("WWwin" + getIndex($moveObj));
        obj.style.left = parseInt(obj.style.left) + clientX - $posX + "px";
        obj.style.top = parseInt(obj.style.top) + clientY - $posY + "px";
        $posX = clientX;
        $posY = clientY;
    }
}
function $doResize(evt) { //Растянуть объект
    if ($resizeObj) {
        var clientX = fixEvent(evt).clientX;
        var clientY = fixEvent(evt).clientY;
        var obj = document.getElementById("WWwin" + getIndex($resizeObj));
        if ($resizeDir.indexOf("r") != -1) {
            WW.getWindowById(getIndex($resizeObj)).setWidth(parseInt(obj.style.width) + clientX - $posX);
        }
        if ($resizeDir.indexOf("b") != -1) {
            WW.getWindowById(getIndex($resizeObj)).setHeight(parseInt(obj.style.height) + clientY - $posY);
        }
        if ($resizeDir.indexOf("l") != -1) {
            WW.getWindowById(getIndex($resizeObj)).setPosX(clientX);
            WW.getWindowById(getIndex($resizeObj)).setWidth(parseInt(obj.style.width) - ((clientX) - $posX));
        }
        if ($resizeDir.indexOf("t") != -1) {
            WW.getWindowById(getIndex($resizeObj)).setPosY(clientY);
            WW.getWindowById(getIndex($resizeObj)).setHeight(parseInt(obj.style.height) - ((clientY) - $posY));
        }
        $posX = clientX;
        $posY = clientY;

    }
}
function $clockUpd() { //Обновить часы
    var months = new Array("Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря");
    var days = new Array("Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота");
    var now = new Date();
    var hours = now.getHours();
    var minutes = now.getMinutes();
    var seconds = now.getSeconds();
    var timeStr = "" + hours;
    timeStr += ((minutes < 10) ? ":0" : ":") + minutes;
    timeStr += ((seconds < 10) ? ":0" : ":") + seconds;
    document.getElementById("WWclock_val").innerHTML = timeStr;
    var date = now.getDate();
    var month = now.getMonth() + 1;
    var year = now.getFullYear();
    var day = now.getDay();
    var dateStr = ((date < 10) ? "0" : "") + date;
    dateStr += ((month < 10) ? ".0" : ".") + month;
    dateStr += "." + year;
    document.getElementById("WWclock_date").innerHTML = dateStr;
    document.getElementById("WWclock").setAttribute("title", (date + " " + months[month - 1] + " " + year + " г. \n" + days[day]));
}
function $createWebWinDesk() { //Создать рабочий стол
    $OLDWebWinDesk = document.getElementById("WebWinDesk");
    if ($OLDWebWinDesk) {
        document.body.removeChild($OLDWebWinDesk);
    }
    var $WebWinDesk = document.createElement("div");
    $WebWinDesk.id = "WebWinDesk";
    $WebWinDesk.style.background = "fixed #FFFFFF url(" + $WW_BgUrl + ") center no-repeat";
    var $desktop = document.createElement("div");
    $desktop.setAttribute("unselectable", "on");
    $desktop.id = "desktop";
    $desktop.style.width = $WW_width + "px";
    $desktop.style.height = ($WW_height - 36) + "px";
    document.onmousemove = function (evt) {
        $moveObj ? $doMoveObj(evt) : $doResize(evt)
    };
    document.onmouseup = function (evt) {
        $moveObj ? $moveU(evt) : $resizeU(evt)
    };
    $WebWinDesk.appendChild($desktop);
    document.body.appendChild($WebWinDesk);
    $updateTray();
    document.oncontextmenu = function () {
        return false;
    };
    $clockUpd();
}
function $appendWin(index) { //Прикрепить окно к рабочему столу
    var WebWinDesk = document.getElementById("WebWinDesk");
    var $win = document.createElement("div");
    $win.setAttribute("unselectable", "on");
    $win.id = "WWwin" + index;
    $win.className = "WWwin";
    var Wtop = document.createElement("div");
    Wtop.className = "WWwinTop";
    Wtop.id = "WWwinTop" + index;
    Wtop.onmousedown = function (evt) {
        $moveD(evt);
    };
    var Wtitle = document.createElement("div");
    Wtitle.className = "WWwinTitle";
    Wtitle.setAttribute("unselectable", "on");
    Wtitle.id = "WWwinTitle" + index;
    Wtitle.setAttribute("unselectable", "on");
    var WIco = document.createElement("div");
    WIco.className = "WWwinIco";
    WIco.setAttribute("unselectable", "on");
    WIco.id = "WWwinIco" + index;
    Wtop.appendChild(WIco);
    Wtop.appendChild(Wtitle);
    $win.appendChild(Wtop);
    var Wbody = document.createElement("div");
    Wbody.className = "WWwinBody";
    Wbody.id = "WWwinBody" + index;
    $win.appendChild(Wbody);
    WebWinDesk.appendChild($win);
    $setWinButts(index);
}
var WebWinWindow = function (parameters) { //Класс окна
    var window = this;
    var stdPropList = [    // Параметры окна по умолчанию
        "title",
        "body",
        "minIcoUrl",
        "posX",
        "posY",
        "width",
        "height",
        "resizable",
        "scrolling"
    ];
    var propList = [     // Применяемые параметры окна
        "title",
        "body",
        "minIcoUrl",
        "icoUrl",
        "posX",
        "posY",
        "width",
        "height",
        "resizable",
        "scrolling",
        "maximized",
        "minimized"
    ];
    for(var i in stdPropList){
        window["$"+stdPropList[i]+"$"] = winStd[stdPropList[i]];
    }
    if(parameters){
        for(var i in propList){
            if (parameters.hasOwnProperty(propList[i])) {
                window["$"+propList[i]+"$"] = parameters[propList[i]];
            }
        }
    }
    this.$nowMoved$ = false;
    this.$nowResized$ = false;
    this.$appended$ = false;
};
WebWinWindow.prototype = {
    //Get - методы WebWinWindow
    getWindowId:function () {
        return this.$windowId$;
    },
    getWidth:function () {
        return this.$width$;
    },
    getHeight:function () {
        return this.$height$;
    },
    getPosX:function () {
        return this.$posX$;
    },
    getPosY:function () {
        return this.$posY$;
    },
    getTitle:function () {
        return this.$title$;
    },
    getBody:function () {
        return this.$body$;
    },
    getScrolling:function () {
        return this.$scrolling$;
    },
    getMinIcoUrl:function () {
        return this.$minIcoUrl$;
    },
    getIcoUrl:function () {
        return this.$icoUrl$;
    },
    //Set - методы WebWinWindow
    setWidth:function (width) {
        if (this.$appended$) {
            this.$WWwinObj.style.width = width + "px";
            this.$WWwinBodyObj.style.width = width + "px";
        }
        this.$width$ = width;
        return this;
    },
    setHeight:function (height) {
        if (this.$appended$) {
            this.$WWwinObj.style.height = height + "px";
            this.$WWwinBodyObj.style.height = height - 25 + "px";
        }
        this.$height$ = height;
        return this;
    },
    setPosX:function (posX) {
        if (this.$appended$) {
            this.$WWwinObj.style.left = posX + "px";
        }
        this.$posX$ = posX;
        return this;
    },
    setPosY:function (posY) {
        if (this.$appended$) {
            this.$WWwinObj.style.top = posY + "px";
        }
        this.$posY$ = posY;
        return this;
    },
    setBody:function (body) {
        if (this.$appended$ && !this.$nowMoved$) {
            this.$WWwinBodyObj.innerHTML = body;
        }
        this.$body$ = body;
        return this;
    },
    setTitle:function (title) {
        if (this.$appended$) {
            this.$WWwinTitleObj.innerHTML = title;
        }
        this.$title$ = title;
        return this;
    },
    setResizable:function (resizable) {
        if (this.$appended$) {
            if (resizable == true) {
                $setResizeBars(this.$WWwinObj);
            }
            if (this.$resizable$ == true && resizable == false) {
                this.$WWwinObj.removeChild(document.getElementById("Winbresize" + getIndex(this.$WWwinObj)), true);
                this.$WWwinObj.removeChild(document.getElementById("Winrresize" + getIndex(this.$WWwinObj)), true);
                this.$WWwinObj.removeChild(document.getElementById("Winlresize" + getIndex(this.$WWwinObj)), true);
                this.$WWwinObj.removeChild(document.getElementById("Winrbresize" + getIndex(this.$WWwinObj)), true);
                this.$WWwinObj.removeChild(document.getElementById("Winlbresize" + getIndex(this.$WWwinObj)), true);
            }
        }
        this.$resizable$ = resizable;
        return this;
    },
    setScrolling:function (scrolling) {
        if (this.$appended$) {
            this.$WWwinBodyObj.style.overflowX = ((scrolling == "all" || scrolling == "horizontal") ? "scroll" : "hidden");
            this.$WWwinBodyObj.style.overflowY = ((scrolling == "all" || scrolling == "vertical") ? "scroll" : "hidden");
        }
        this.$scrolling$ = scrolling;
        return this;
    },
    setMinIcoUrl:function (minIcoUrl) {
        if (this.$appended$) {
            var WIco = document.getElementById("WWwinIco" + this.$windowId$);
            if (minIcoUrl) {
                this.$WWwinTitleObj.style.left = "26px";
                WIco.style.background = "url(\"" + minIcoUrl + "\") center no-repeat";
                WIco.style.width = "20px";
                WIco.style.left = "3px";
            }
            else {
                this.$WWwinTitleObj.style.left = "0px";
                WIco.style.background = "url(\"\") center no-repeat";
                WIco.style.width = "0px";
                WIco.style.left = "0px";
            }
        }
        this.$minIcoUrl$ = minIcoUrl;
        return this;
    },
    setIcoUrl:function (icoUrl) {
        this.$icoUrl$ = icoUrl;
        return this;
    },
    //Другие методы	WebWinWindow
    minimize:function(){
        alert("window#"+this.$windowId$+".minimized()");
    },
    maximize:function(){
        alert("window#"+this.$windowId$+".maximized()");
    },
    restore:function(){
        alert("window#"+this.$windowId$+".restored()");
    },
    close:function () {
        var obj = document.getElementById("WWwin" + this.getWindowId());
        obj.parentNode.removeChild(obj);
    },
    isAppended:function () {
        return this.$appended$;
    },
    isResizable:function () {
        return this.$resizable$;
    },
    isNowMoved:function () {
        return this.$nowMoved$;
    },
    isNowResized:function () {
        return this.$nowResized$;
    },
    isMinimized:function () {
        return this.$minimized$;
    },
    isMaximized:function () {
        return this.$maximized$;
    }
};
var WW = {  //WebWin
    $version : "WebWin v.0.0.3",
    init : function(background) {
        if(!initialized){
            $WW_BgUrl = background;
            $createWebWinDesk();
            //TODO: Если IE то document.body.setAttribute("scroll","no");
            if($WW_browser == "Explorer") document.body.setAttribute("scroll","no");
                window.onresize = function () {
                $WW_width = document.documentElement.clientWidth;
                $WW_height = document.documentElement.clientHeight;
                $updateTray();
            }
        }
        else{
            logError("REINIT");
        }
    }
};
WW._extend({
    //Get - методы WebWin
    getWinNum:function () {
        return $WW_windows.length;
    },
    getWindowById:function(id){
        return  $WW_windows[id];
    },
    getBgUrl:function () {
        return $WW_BgUrl;
    },
    getScreenHeight:function () {
        return $WW_height
    },
    getScreenWidth:function () {
        return $WW_width
    },
    getVersion:function () {
        return this.$version;
    },
    getBrowserName:function () {
        return $WW_browser;
    },
    //Set - методы WebWin
    setBgUrl:function (backgroundUrl) {
        $WW_BgUrl = backgroundUrl;
        document.getElementById("WebWinDesk").style.background = " fixed #FFFFFF url(" + backgroundUrl + ") center no-repeat";
    },
    //Другие методы WebWin
    appendWindow:function (winObj) {
        if (winObj.isAppended() == false) {
            var $num = ($WW_windows.push(winObj) - 1); //Номер окна
            $appendWin($num);
            winObj.$WWwinObj = document.getElementById("WWwin" + $num);
            winObj.$WWwinTitleObj = document.getElementById("WWwinTitle" + $num);
            winObj.$WWwinBodyObj = document.getElementById("WWwinBody" + $num);
            winObj.$windowId$ = $num;
            winObj.$appended$ = true;
            winObj.setTitle(winObj.$title$);
            winObj.setPosX(winObj.$posX$);
            winObj.setPosY(winObj.$posY$);
            winObj.setWidth(winObj.$width$);
            winObj.setHeight(winObj.$height$);
            winObj.setScrolling(winObj.$scrolling$);
            winObj.setResizable(winObj.$resizable$);
            winObj.setBody(winObj.$body$);
            winObj.setMinIcoUrl(winObj.$minIcoUrl$);
            winObj.setIcoUrl(winObj.$icoUrl$);
        }
    }
});
window.WebWin = WW;
window.WebWinWindow = WebWinWindow;
})(window);
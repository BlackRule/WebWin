/*
 * WebWin API JavaScript Library v1.0
 * http://www.webwin.hut4.ru/
 * webwinapi@mail.ru
 * Compressed by the best JS compressor http://jscrambler.com/
 * Copyright (c) 2012 Ivan Chernovalov
 */
var $WW_width = document.documentElement.clientWidth; //Ширина экрана
var $WW_height = document.documentElement.clientHeight; //Высота экрана
var $WW_BgUrl; //Url Изображения рабочего стола
var $moveObjID = -1; //ID объекта который надо передвинуть
var $resizeObjID = -1; //ID объекта который надо растянуть
var $resizeDir; //Направление растягивания
var $posX = 0; //Начальная позиция курсора по оси OX
var $posY = 0; //Начальная позиция курсора по оси OY
var $WW_windows = []; //Окна WebWin
var $WW_appTray = []; //Значки трея WebWin
var $winBodyBuffer; //Dom тела окна
var browsers = ["Opera", "Netscape", "Explorer"];
var $WW_browser = "unknown";
var winStd = {title:"Окно", body:"Содержимое", minIcoUrl:false, icoUrl:false, posY:0, posX:0, width:200, height:150, stretchable:true, scrolling:"none"};
//  Перехват событий
document.ondragstart = function () {
    return false;
};
document.ondragend = function () {
    return false;
};
document.onselectstart = function () {
    return false;
};
//
for (var i in browsers) {
    if ($WW_browser == "unknown") {
        $WW_browser = ((navigator.appName.indexOf(browsers[i]) != -1) ? browsers[i] : "unknown");
    }
}
function $WW_error(errcode) {
} //Функция логгер ошибок
function fixevent(evt) {
    return ((window.event) ? (window.event) : (evt));
}
function gettarget(evt) {
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
    var button = fixevent(evt).button;
    if ((($WW_browser == "Opera" || $WW_browser == "Netscape") && button == 0) || ($WW_browser == "Explorer" && button == 1)) {
        $resizeObjID = getIndex(gettarget(evt));
        $posX = fixevent(evt).clientX;
        $posY = fixevent(evt).clientY;
        document.getElementById("WWwinBody" +  $resizeObjID).style.visibility = "hidden";
        $WW_windows[$resizeObjID].$nowresized$ = true;
    }
}
function $resizeU(evt) {
    if ($resizeObjID != -1) {
        $resizeObjID = getIndex(gettarget(evt));
        var button = fixevent(evt).button;
        if ((($WW_browser == "Opera" || $WW_browser == "Netscape") && button == 0) || ($WW_browser == "Explorer" && button == 1)) {
            var winobj = document.getElementById("WWwin" + $resizeObjID);
            document.getElementById("WWwinBody" +  $resizeObjID).style.visibility = "visible";
            $WW_windows[$resizeObjID].setWidth(parseInt(winobj.style.width));
            $WW_windows[$resizeObjID].setHeight(parseInt(winobj.style.height));
            $WW_windows[$resizeObjID].$nowresized$ = false;
            $resizeObjID = -1;
        }
    }
}
//TODO: What if the window = null?
function $moveD(evt) {
    var button = fixevent(evt).button;
    if ((($WW_browser == "Opera" || $WW_browser == "Netscape") && button == 0) || ($WW_browser == "Explorer" && button == 1)) {
        $moveObjID = getIndex(gettarget(evt));
        if(!$WW_windows[$moveObjID]){
            alert("Ошибка!");
            return
        }
        if (!$WW_windows[$moveObjID].isNowMoved()) {
            $posX = fixevent(evt).clientX;
            $posY = fixevent(evt).clientY;
            document.getElementById("WWwinBody" +  $moveObjID).style.visibility = "hidden";
            //$WW_windows[$moveObjID].$nowmoved$ = true;
        }
    }
}
function $moveU(evt) {
    var winobj = document.getElementById("WWwin" + $moveObjID);
    document.getElementById("WWwinBody" +  $moveObjID).style.visibility = "visible";
    $WW_windows[$moveObjID].setPosX(parseInt(winobj.style.left));
    $WW_windows[$moveObjID].$posY$ = parseInt(winobj.style.top);
    $WW_windows[$moveObjID].$nowmoved$ = false;
    $moveObjID = -1;
}
function $setresizebars(obj) { //Создать полосы растягивания
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
function $setwinbutts(obj) { //Создать кнопки окна
}
function $doMoveObj(evt) { //Передвинуть обьект
    if ($moveObjID != -1) {
        var obj = document.getElementById("WWwin" + $moveObjID);
        obj.style.left = parseInt(obj.style.left) + fixevent(evt).clientX - $posX + "px";
        obj.style.top = parseInt(obj.style.top) + fixevent(evt).clientY - $posY + "px";
        $posX = fixevent(evt).clientX;
        $posY = fixevent(evt).clientY;
    }
}
function $doResize(evt) { //Растянуть обьект
    if ($resizeObjID != -1) {
        var obj = document.getElementById("WWwin" + $resizeObjID);
        if ($resizeDir.indexOf("r") != -1) {
            $WW_windows[$resizeObjID].setWidth(parseInt(obj.style.width) + fixevent(evt).clientX - $posX);
        }
        if ($resizeDir.indexOf("b") != -1) {
            $WW_windows[$resizeObjID].setHeight(parseInt(obj.style.height) + fixevent(evt).clientY - $posY);
        }
        if ($resizeDir.indexOf("l") != -1) {
            $WW_windows[$resizeObjID].setPosX(fixevent(evt).clientX);
            $WW_windows[$resizeObjID].setWidth(parseInt(obj.style.width) - ((fixevent(evt).clientX) - $posX));
        }
        if ($resizeDir.indexOf("t") != -1) {
            $WW_windows[$resizeObjID].setPosY(fixevent(evt).clientY);
            $WW_windows[$resizeObjID].setHeight(parseInt(obj.style.height) - ((fixevent(evt).clientY) - $posY));
        }
        $posX = fixevent(evt).clientX;
        $posY = fixevent(evt).clientY;

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
        $moveObjID != -1 ? $doMoveObj(evt) : $doResize(evt)
    };
    document.onmouseup = function (evt) {
        $moveObjID != -1 ? $moveU(evt) : $resizeU(evt)
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
}
var WebWinWindow = function (parameters) { //Класс окна
    var window = {
        // Скрытые свойства
    };
    var klass = this; //ссылка на class
    var stdPropList = [    // Параметры окна по умолчанию
        "title",
        "body",
        "minIcoUrl",
        "posX",
        "posY",
        "width",
        "height",
        "stretchable",
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
        "stretchable",
        "scrolling",
        "fullscreened",
        "minimized"
    ];
    for(var i in stdPropList){
        window["$"+stdPropList[i]+"$"] = winStd[stdPropList[i]];
    }
    for(var i in propList){
        if (parameters.hasOwnProperty(propList[i])) {
            window["$"+propList[i]+"$"] = parameters[propList[i]];
        }
    }
    window.$nowmoved$ = false;
    window.$nowresized$ = false;
    window.$appended$ = false;
    //Get - методы WebWinWindow
    klass.getIndex = function () {
        return window.$index$;
    };
    klass.getWidth = function () {
        return window.$width$;
    };
    klass.getHeight = function () {
        return window.$height$;
    };
    klass.getPosX = function () {
        return window.$posX$;
    };
    klass.getPosY = function () {
        return window.$posY$;
    };
    klass.getTitle = function () {
        return window.$title$;
    };
    klass.getBody = function () {
        return window.$body$;
    };
    klass.getScrolling = function () {
        return window.$scrolling$;
    };
    klass.getMinIcoUrl = function () {
        return window.$minIcoUrl$;
    };
    klass.getIcoUrl = function () {
        return window.$icoUrl$;
    };
    //Set - методы WebWinWindow
    klass.setWidth = function (Wwidth) {
        if (window.$appended$) {
            window.$WWwinObj.style.width = Wwidth + "px";
            window.$WWwinBodyObj.style.width = Wwidth + "px";
        }
        window.$width$ = Wwidth;
    };
    klass.setHeight = function (Wheight) {
        if (window.$appended$) {
            window.$WWwinObj.style.height = Wheight + "px";
            window.$WWwinBodyObj.style.height = Wheight - 25 + "px";
        }
        window.$height$ = Wheight;
    };
    klass.setPosX = function (WposX) {
        if (window.$appended$) {
            window.$WWwinObj.style.left = WposX + "px";
        }
        window.$posX$ = WposX;
    };
    klass.setPosY = function (WposY) {
        if (window.$appended$) {
            window.$WWwinObj.style.top = WposY + "px";
        }
        window.$posY$ = WposY;
    };
    klass.setBody = function (Wbody) {
        if (window.$appended$ && !window.$nowmoved$) {
            window.$WWwinBodyObj.innerHTML = Wbody;
        }
        window.$body$ = Wbody;
    };
    klass.setTitle = function (Wtitle) {
        if (window.$appended$) {
            window.$WWwinTitleObj.innerHTML = Wtitle;
        }
        window.$title$ = Wtitle;
    };
    klass.setStretchable = function (stretchable) {
        if (window.$appended$) {
            if (stretchable == true) {
                $setresizebars(window.$WWwinObj);
            }
            if (window.$stretchable$ == true && stretchable == false) {
                window.$WWwinObj.removeChild(document.getElementById("Winbresize" + window.$index$), true);
                window.$WWwinObj.removeChild(document.getElementById("Winrresize" + window.$index$), true);
                window.$WWwinObj.removeChild(document.getElementById("Winlresize" + window.$index$), true);
                window.$WWwinObj.removeChild(document.getElementById("Winrbresize" + window.$index$), true);
                window.$WWwinObj.removeChild(document.getElementById("Winlbresize" + window.$index$), true);
            }
        }
        window.$stretchable$ = stretchable;
    };
    klass.setScrolling = function (scrolling) {
        if (window.$appended$) {
            window.$WWwinBodyObj.style.overflowX = ((scrolling == "all" || scrolling == "horizontal") ? "scroll"  :  "hidden");
            window.$WWwinBodyObj.style.overflowY = ((scrolling == "all" || scrolling == "vertical") ? "scroll"  :  "hidden");
        }
        window.$scrolling$ = scrolling;
    };
    klass.setMinIcoUrl = function (minIcoUrl) {
        if (window.$appended$) {
            var WIco = document.getElementById("WWwinIco" + window.$index$);
            if (minIcoUrl) {
                window.$WWwinTitleObj.style.left = "26px";
                WIco.style.background = "url(\"" + minIcoUrl + "\") center no-repeat";
                WIco.style.width = "20px";
                WIco.style.left = "3px";
            }
            else {
                window.$WWwinTitleObj.style.left = "0px";
                WIco.style.background = "url(\"\") center no-repeat";
                WIco.style.width = "0px";
                WIco.style.left = "0px";
            }
        }
        window.$minIcoUrl$ = minIcoUrl;
    };
    klass.setIcoUrl = function (icoUrl) {
        window.$icoUrl$ = icoUrl;
    };
    //Другие методы	WebWinWindow
    klass.isAppended = function () {
        return window.$appended$;
    };
    klass._append = function ($num){
        window.$WWwinObj = document.getElementById("WWwin" + $num);
        window.$WWwinTitleObj = document.getElementById("WWwinTitle" + $num);
        window.$WWwinBodyObj = document.getElementById("WWwinBody" + $num);
        window.$index$ = $num;
        window.$appended$ = true;
    };
    klass._get = function(param){
        return (param in window) ? param : undefined;
    };
    klass.isStretchable = function () {
        return window.$stretchable$;
    };
    klass.isNowMoved = function () {
        return window.$nowmoved$;
    };
    klass.isNowResized = function () {
        return window.$nowresized$;
    };
    klass.isMinimized = function () {
        return window.$minimized$;
    };
    klass.isFullscreened = function () {
        return window.$fullscreened$;
    };
    klass.close = function () {
        var obj = document.getElementById("WWwin" + window.getIndex());
        obj.parentNode.removeChild(obj);
    }
};
var WebWin = function (background) { //Класс WebWin
    this.$version = "WebWin v.0.0.3";
    this.windows = $WW_windows;
    $WW_BgUrl = background;
    $createWebWinDesk();
    window.onresize = function () {
        $WW_width = document.documentElement.clientWidth;
        $WW_height = document.documentElement.clientHeight;
        $updateTray();
    }
};
WebWin.prototype = {
    //Get - методы WebWin
    getWinNum:function () {
        return $WW_windows.length;
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
            var $num = (this.windows.push(winObj) - 1); //Номер окна
            $appendWin($num);
            winObj._append($num);
            //TODO: fe2
            winObj.setTitle(winObj.getTitle());
            winObj.setPosX(winObj.getPosX());
            winObj.setPosY(winObj.getPosY());
            winObj.setWidth(winObj.getWidth());
            winObj.setHeight(winObj.getHeight());
            winObj.setScrolling(winObj.getScrolling());
            winObj.setStretchable(winObj.isStretchable());
            winObj.setBody(winObj.getBody());
            winObj.setMinIcoUrl(winObj.getMinIcoUrl());
            winObj.setIcoUrl(winObj.getIcoUrl());
        }
    }
};
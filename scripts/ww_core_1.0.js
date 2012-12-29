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
var $moveObj = false; //Объект который надо передвинуть
var $resizeObj = false; //Объект который надо растянуть
var $resizedir; //Направление растягивания
var $posX = 0; //Начальная позиция курсора по оси OX
var $posY = 0; //Начальная позиция курсора по оси OY
var $WW_windows = new Array(); //Окна WebWin
var $WW_apptray = new Array(); //Значки трея WebWin
var $winBodyBuffer; //Dom тела окна
var browsers = ["Opera", "Netscape", "Explorer"];
var $WW_browser = "unknown";
var winStd = {title:"Окно", minicourl:false, icourl:false, posY:0, posX:0, width:200, height:150, resizable:true, scrolling:"none"};
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
        var index = $WW_apptray.push(obj);
    }
}
function getIndex(obj) {
    return obj.id.charAt(obj.id.length - 1); //Функция возвращяет индекс полученного элемента
}
function $resizeD(evt) {
    var button = fixevent(evt).button;
    if ((($WW_browser == "Opera" || $WW_browser == "Netscape") && button == 0) || ($WW_browser == "Explorer" && button == 1)) {
        $resizeObj = gettarget(evt);
        $posX = fixevent(evt).clientX;
        $posY = fixevent(evt).clientY;
        var winobj = document.getElementById("WWwin" + getIndex($resizeObj));
        var wbobj = document.getElementById("WWwinBody" + getIndex($resizeObj));
        $winBodyBuffer = wbobj.cloneNode(true);
        winobj.removeChild(wbobj);
        $WW_windows[getIndex($resizeObj)].$nowresized$ = true;
    }
}
function $resizeU(evt) {
    if ($resizeObj) {
        var button = fixevent(evt).button;
        if ((($WW_browser == "Opera" || $WW_browser == "Netscape") && button == 0) || ($WW_browser == "Explorer" && button == 1)) {
            var winobj = document.getElementById("WWwin" + getIndex($resizeObj));
            winobj.appendChild($winBodyBuffer);
            $WW_windows[getIndex($resizeObj)].$WWwinBodyObj = document.getElementById("WWwinBody" + getIndex($resizeObj));
            $WW_windows[getIndex($resizeObj)].setWidth(parseInt(winobj.style.width));
            $WW_windows[getIndex($resizeObj)].setHeight(parseInt(winobj.style.height));
            $WW_windows[getIndex($resizeObj)].$nowresized$ = false;
            $resizeObj = false;
        }
    }
}
function $moveD(evt) {
    document.ondragstart = function () {
        return false;
    };
    document.body.onselectstart = function () {
        return false;
    };
    var button = fixevent(evt).button;
    if ((($WW_browser == "Opera" || $WW_browser == "Netscape") && button == 0) || ($WW_browser == "Explorer" && button == 1)) {
        $moveObj = gettarget(evt);
        if (!$WW_windows[getIndex($moveObj)].$nowmoved$) {
            $posX = fixevent(evt).clientX;
            $posY = fixevent(evt).clientY;
            var winobj = document.getElementById("WWwin" + getIndex($moveObj));
            var wbobj = document.getElementById("WWwinBody" + getIndex($moveObj));
            $winBodyBuffer = wbobj.cloneNode(true);
            winobj.removeChild(wbobj);
            $WW_windows[getIndex($moveObj)].$nowmoved$ = true;
        }
    }
}
function $moveU(evt) {
    var winobj = document.getElementById("WWwin" + getIndex($moveObj));
    winobj.appendChild($winBodyBuffer);
    $WW_windows[getIndex($moveObj)].$WWwinBodyObj = document.getElementById("WWwinBody" + getIndex($moveObj));
    $WW_windows[getIndex($moveObj)].$posX$ = parseInt(winobj.style.left);
    $WW_windows[getIndex($moveObj)].$posY$ = parseInt(winobj.style.top);
    $WW_windows[getIndex($moveObj)].$nowmoved$ = false;
    $moveObj = false;
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
        $resizedir = "rb";
        $resizeD(evt);
    };
    WLBResize.onmousedown = function (evt) {
        $resizedir = "lb";
        $resizeD(evt);
    };
    WRResize.onmousedown = function (evt) {
        $resizedir = "r";
        $resizeD(evt);
    };
    WLResize.onmousedown = function (evt) {
        $resizedir = "l";
        $resizeD(evt);
    };
    WBResize.onmousedown = function (evt) {
        $resizedir = "b";
        $resizeD(evt);
    };
    WTResize.onmousedown = function (evt) {
        $resizedir = "t";
        $resizeD(evt);
    };
    WLTResize.onmousedown = function (evt) {
        $resizedir = "lt";
        $resizeD(evt);
    };
    WRTResize.onmousedown = function (evt) {
        $resizedir = "rt";
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
    if ($moveObj) {
        var obj = document.getElementById("WWwin" + getIndex($moveObj));
        obj.style.left = parseInt(obj.style.left) + fixevent(evt).clientX - $posX + "px";
        obj.style.top = parseInt(obj.style.top) + fixevent(evt).clientY - $posY + "px";
        $posX = fixevent(evt).clientX;
        $posY = fixevent(evt).clientY;
    }
}
function $doResize(evt) { //Растянуть обьект
    if ($resizeObj) {
        document.ondragstart = function () {
            return false;
        };
        document.ondragend = function () {
            return false;
        };
        document.body.onselectstart = function () {
            return false;
        };
        var obj = document.getElementById("WWwin" + getIndex($resizeObj));
        if ($resizedir.indexOf("r") != -1) {
            $WW_windows[getIndex($resizeObj)].setWidth(parseInt(obj.style.width) + fixevent(evt).clientX - $posX);
        }
        if ($resizedir.indexOf("b") != -1) {
            $WW_windows[getIndex($resizeObj)].setHeight(parseInt(obj.style.height) + fixevent(evt).clientY - $posY);
        }
        if ($resizedir.indexOf("l") != -1) {
            $WW_windows[getIndex($resizeObj)].setPosX(fixevent(evt).clientX);
            $WW_windows[getIndex($resizeObj)].setWidth(parseInt(obj.style.width) - ((fixevent(evt).clientX) - $posX));
        }
        if ($resizedir.indexOf("t") != -1) {
            $WW_windows[getIndex($resizeObj)].setPosY(fixevent(evt).clientY);
            $WW_windows[getIndex($resizeObj)].setHeight(parseInt(obj.style.height) - ((fixevent(evt).clientY) - $posY));
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
}
var WebWinWindow = function (parameters) { //Класс окна
    this.$title$ = winStd.title;
    this.$minicourl$ = winStd.minicourl;
    this.$icourl$ = winStd.minicourl;
    this.$posX$ = winStd.posX;
    this.$posY$ = winStd.posY;
    this.$width$ = winStd.width;
    this.$height$ = winStd.height;
    this.$resizable$ = winStd.resizable;
    this.$scrolling$ = winStd.scrolling;
    this.$fullscreened$ = winStd.fullscreened;
    this.$minimized$ = winStd.minimized;
    if (parameters.hasOwnProperty("title")) {
        this.$title$ = parameters.title;
    }
    if (parameters.hasOwnProperty("minIcoUrl")) {
        this.$minicourl$ = parameters.minIcoUrl;
    }
    if (parameters.hasOwnProperty("icoUrl")) {
        this.$icourl$ = parameters.icoUrl;
    }
    if (parameters.hasOwnProperty("posX")) {
        this.$posX$ = parameters.posX;
    }
    if (parameters.hasOwnProperty("posY")) {
        this.$posY$ = parameters.posY;
    }
    if (parameters.hasOwnProperty("width")) {
        this.$width$ = parameters.width;
    }
    if (parameters.hasOwnProperty("height")) {
        this.$height$ = parameters.height;
    }
    if (parameters.hasOwnProperty("resizable")) {
        this.$resizable$ = parameters.resizable;
    }
    if (parameters.hasOwnProperty("scrolling")) {
        this.$scrolling$ = parameters.scrolling;
    }
    if (parameters.hasOwnProperty("fullscreened")) {
        this.$fullscreened$ = parameters.fullscreened;
    }
    if (parameters.hasOwnProperty("minimized")) {
        this.$minimized$ = parameters.minimized;
    }
    this.$nowmoved$ = false;
    this.$nowresized$ = false;
    this.$appended$ = false;
};
WebWinWindow.prototype = {
    //Get - методы WebWinWindow
    getIndex:function () {
        return this.$index$;
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
        return this.$minicourl$;
    },
    getIcoUrl:function () {
        return this.$icourl$;
    },
    //Set - методы WebWinWindow
    setWidth:function (Wwidth) {
        if (this.$appended$) {
            this.$WWwinObj.style.width = Wwidth + "px";
            this.$WWwinBodyObj.style.width = Wwidth + "px";
        }
        this.$width$ = Wwidth;
    },
    setHeight:function (Wheight) {
        if (this.$appended$) {
            this.$WWwinObj.style.height = Wheight + "px";
            this.$WWwinBodyObj.style.height = Wheight - 25 + "px";
        }
        this.$height$ = Wheight;
    },
    setPosX:function (WposX) {
        if (this.$appended$) {
            this.$WWwinObj.style.left = WposX + "px";
        }
        this.$posX$ = WposX;
    },
    setPosY:function (WposY) {
        if (this.$appended$) {
            this.$WWwinObj.style.top = WposY + "px";
        }
        this.$posY$ = WposY;
    },
    setBody:function (Wbody) {
        if (this.$appended$ && !this.$nowmoved$) {
            this.$WWwinBodyObj.innerHTML = Wbody;
        }
        this.$body$ = Wbody;
    },
    setTitle:function (Wtitle) {
        if (this.$appended$) {
            this.$WWwinTitleObj.innerHTML = Wtitle;
        }
        this.$title$ = Wtitle;
    },
    setResizable:function (resizable) {
        if (this.$appended$) {
            if (resizable == true) {
                $setresizebars(this.$WWwinObj);
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
    },
    setScrolling:function (scrolling) {
        if (this.$appended$) {
            this.$WWwinBodyObj.style.overflowX = ((scrolling == "all" || scrolling == "horizontal") ? "scroll" : "hidden");
            this.$WWwinBodyObj.style.overflowY = ((scrolling == "all" || scrolling == "vertical") ? "scroll" : "hidden");
        }
        this.$scrolling$ = scrolling;
    },
    setMinIcoUrl:function (minicourl) {
        if (this.$appended$) {
            var WIco = document.getElementById("WWwinIco" + this.$index$);
            if (minicourl) {
                this.$WWwinTitleObj.style.left = "26px";
                WIco.style.background = "url(\"" + minicourl + "\") center no-repeat";
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
        this.$minicourl$ = minicourl;
    },
    setIcoUrl:function (icourl) {
        this.$icourl$ = icourl;
    },
    //Другие методы	WebWinWindow
    isAppended:function () {
        return this.$appended$;
    },
    isResizable:function () {
        return this.$resizable$;
    },
    isNowMoved:function () {
        return this.$nowmoved$;
    },
    isNowResized:function () {
        return this.$nowresized$;
    },
    isMinimized:function () {
        return this.$minimized$;
    },
    isFullscreened:function () {
        return this.$fullscreened$;
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
    getBgUrl:function (backgroundUrl) {
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
        if (winObj.$appended$ == false) {
            var $num = (this.windows.push(winObj) - 1); //Номер окна
            $appendWin($num);
            winObj.$WWwinObj = document.getElementById("WWwin" + $num);
            winObj.$WWwinTitleObj = document.getElementById("WWwinTitle" + $num);
            winObj.$WWwinBodyObj = document.getElementById("WWwinBody" + $num);
            winObj.$index$ = $num;
            winObj.$appended$ = true;
            winObj.setTitle(winObj.$title$);
            winObj.setPosX(winObj.$posX$);
            winObj.setPosY(winObj.$posY$);
            winObj.setWidth(winObj.$width$);
            winObj.setHeight(winObj.$height$);
            winObj.setScrolling(winObj.$scrolling$);
            winObj.setResizable(winObj.$resizable$);
            winObj.setBody(winObj.$body$);
            winObj.setMinIcoUrl(winObj.$minicourl$);
            winObj.setIcoUrl(winObj.$icourl$);
        }
    }
};
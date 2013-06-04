var WebWinCore = {
    WINDOWS_LIST: {},


};
var $WW_width = document.documentElement.clientWidth; //Ширина экрана
var $WW_height = document.documentElement.clientHeight; //Высота экрана
var $WW_BgUrl; //Url Изображения рабочего стола
var $moveObj = false; //Объект который надо передвинуть
var $resizeObj = false; //Объект который надо растянуть
var $resizedir; //Направление растягивания
var $posX = 0; //Начальная позиция курсора по оси OX
var $posY = 0; //Начальная позиция курсора по оси OY
var $WW_windows = []; //Окна WebWin
var $WW_apptray = []; //Значки трея WebWin
var $winBodyBuffer; //Dom тела окна
var browsers = ["Opera", "Netscape", "Explorer"];
var $WW_browser = "unknown";
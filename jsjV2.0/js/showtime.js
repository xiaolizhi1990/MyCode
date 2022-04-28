
<!--获取系统时间-->
function  showtime() {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var strhour = date.getHours();
    var strminutes = date.getMinutes();
    var strseconds = date.getSeconds();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    if (strhour >= 0 && strhour <= 9) {
        strhour = "0" + strhour;
    }
    if (strminutes >= 0 && strminutes <= 9) {
        strminutes = "0" + strminutes;
    }
    if (strseconds >= 0 && strseconds <= 9) {
        strseconds = "0" + strseconds;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + strhour + seperator2 + strminutes
        + seperator2 + strseconds;
    var time = document.getElementById("time");
    time.innerHTML = currentdate;
    window.setTimeout("showtime();", 1000);

}
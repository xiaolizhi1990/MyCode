/**
 * 获取Cookie
 */
function getCookie(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
        return decodeURI(arr[2]);
    } else {
        return null;
    }
}

function setCookie(name, value, day) {
    if (!day) {
        day=30;
    }
    var exp = new Date();
    exp.setTime(exp.getTime() + day * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + decodeURIComponent(value) + ";expires=" + exp.toGMTString();
}

/**
 * 时间格式方法
 */
function formatDate(timeStamp) {
    return new Date(parseInt(timeStamp) * 1000).toLocaleString().replace(/:\d{1,2}$/, ' ');
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    }
    return null;
}

// function _Number(num) {
//     if (!num) {
//         return '';
//     }
//     var num = new Number(num)
//     return num.toLocaleString()
// }

function index() {
        if (!getCookie('username')) {
            window.location.href = 'login.html';
          /* layui.use(['layer'], function () {
                layer.alert('您尚未登录！', '提示', function () {

                });
            });*/
        }
    }

function login() {

    layui.use(['form','layer','jquery'], function () {

        var form = layui.form;

        var $ = layui.jquery;

        form.on('submit(login)',function (data) {
            /**layer.alert(JSON.stringify(data.field), {
					  title: '最终的提交信息'
					})
             return true;
             **/
            $.ajax({
                type: 'POST',
                url: 'http://lh.zjadi.com/api/login.do',
                data: {
                    'username': data.field.username,
                    'password': data.field.password
                },
                dataType: 'json',
                success: function (msg) {
                    if (msg.code == 0) {
                        setCookie('username', data.field.username,1);
                        window.location.href = 'index.html';
                    } else {
                        layer.msg("用户名或密码错误！");
                    }

                }
            });

            return false;

        })
    });
}
<!DOCTYPE html>
<html>
<head>
    <title>${title}</title>
    <link rel="stylesheet" type="text/css" href="${commonStaticPath}/js/common/common.navbar.css">
    <script type="text/javascript" src="${commonStaticPath}/js/jquery-1.8.3.min.js?${VERSION}"></script>
    <script type="text/javascript">
        var msg = '${errorMsg}';
        var title = '${title}';
        var ssoLogoutUrl = '${ssoServerUrl}/logout?callback=?';
        var cloudLoginUrl = '${cloudServerUrl}/desktop/login/';

        var allAppsModalHtml = '<div id="lzxAllAppsModal"></div>'

        jQuery(document).ready(function(){
            if(msg == null || msg.length < 1) msg = "桌面缓存生成失败";

            alertTips({
                      'title': title,
                      'msg':msg,
                      'btnEvent':'callback',
                      'btnMsg':'返回登录页'
                  });
        });

        function callback(){
            jQuery.getJSON(ssoLogoutUrl, function(data){
                var res = JSON.parse(data);
                if(res['result'] != 'success'){
                    alertTips({
                      'title': title,
                      'msg':'中心退出登录失败',
                      'btnEvent':'toLogin',
                      'btnMsg':'返回登录页'
                    });
                } else {
                    toLogin();
                }
            });
        }

        function toLogin(){
            var loginUrl = getCookie('loginUrl');
            if(loginUrl == null || loginUrl.length < 1) loginUrl = cloudLoginUrl;
            // 获取不到登录地址，则跳转到云平台登录页
            window.location.href = decodeURIComponent(loginUrl);
        }

        function getCookie(key){
            var cks = document.cookie.split("; ");
            for ( var i = 0; i < cks.length; i++) {
                var kv = cks[i].split("=");
                if (kv[0] == key) return kv[1];
            }
            return "";
        }

        function alertTips (msg) {
            if (jQuery('#lzxAllAppsModal').length === 0) {
              jQuery('body').addClass('navbar-fronzon-body').append(allAppsModalHtml);
            }
            jQuery('#lzxAllAppsModal').show();
            var eventType = '';
            if(msg.eventType){
                 eventType = 'eventType="'+msg.eventType+'"';
            }
            
            if(!msg['btnEvent']){
                msg['btnEvent'] = 'javascript:;';
            }
            
            var tips  = '<div class="common-message-box">' +
                          '<div class="common-message-box__title">'+msg['title']+'</div>' +
                          '<div class="common-message-box__content">' +
                            '<div class="common-message-box__message">' +
                              '<p>'+msg['msg']+'</p>' +
                            '</div>' +
                          '</div>' +
                          '<div class="common-message-box__btns">' +
                            '<a onclick="' + msg['btnEvent'] + '();" class="common-btn" '+eventType+'>'+msg['btnMsg']+'</a>'
                          '</div>'
                        '</div>'
            jQuery('body').append(tips);
          }
    </script>
</head>
<body></body>
</html>
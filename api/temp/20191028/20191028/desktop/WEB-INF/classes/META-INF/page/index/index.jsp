<!DOCTYPE html>
<html>
<head>
	<title>${title}</title>
	<link rel="icon" type="image/png" href="${commonStaticPath}/img/logo/favicon.ico">
	<meta charset="utf-8">
	<meta name="renderer" content="webkit">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<meta http-equiv="X-UA-Compatible" content="IE=Edge,chrome=1">
	<meta name="viewport" content="width=1080px">
	<input type="hidden" id="GLOBAL_CURRENT_USER_ID" value="${currUserId }">
    <input type="hidden" id="GLOBAL_CURRENT_SCHOOL_ID" value="${currSchoolId }">
    <input type="hidden" id="GLOBAL_CURRENT_PLATFORM_ID" value="${platformId! }">
	<script>
	//window.COMMON_NAVBAR_THEME = 'WHITE' // 桌面导航条颜色默认白色
	window.CONTEXT_PATH = '${contextPath}';
	window.APP_MANAGE_PATH = '${appManageUrl}';
	</script>
	<link rel="stylesheet" type="text/css" href="${contextPath}/backend/main/v8/css/lzx.base.css?${VERSION}">
	<link rel="stylesheet" type="text/css" href="${contextPath}/backend/main/v8/css/et_main.css?${VERSION}">
	<link rel="stylesheet" type="text/css" href="${contextPath}/backend/main/v8/css/dragula.css?${VERSION}">
	<link rel="stylesheet" type="text/css" href="${commonStaticPath}/js/common/common.navbar.css?${VERSION}">
	<link rel="stylesheet" type="text/css" href="${commonStaticPath}/js/layer/theme/default/layer.css?${VERSION}">
	<script type="text/javascript" src="${commonStaticPath}/js/jquery-1.8.3.min.js?${VERSION}"></script>
	<script type="text/javascript" src="${contextPath}/backend/common/js/IFlyCollector.js?${VERSION}"></script>
	<script type="text/javascript" src="${commonStaticPath}/js/analysis.jjyun.js"></script>
	<script type="text/javascript">
		function imgErrorLoad(_this){
			_this.src = "${contextPath}/backend/main/v8/img/default_app.png";
			_this.onerror = null;
		}
		//
	    jQuery(document).ready(function(){
	    	//设置一级导航栏域名
	        jQuery.ajax({
	          method: 'GET',
	          url: '${operUrl}',
	          dataType: 'jsonp',
	          success: function (data) {
	          },
	          error: function (data) {
	          }
	        });
	    });
		
	</script>
	
    <script type="text/javascript">
        <#if showError??&&(showError==true)>
        var msg = '${errorMsg}';
   	    var title = '${title}';
		jQuery(document).ready(function(){
           if(msg == null || msg.length < 1) msg = "桌面缓存生成失败";

           erroAlertTips({
                     'title': title,
                     'msg':msg,
                     'btnEvent':'callback',
                     'btnMsg':'返回登录页'
                 });
        });
        var ssoLogoutUrl = '${ssoServerUrl}/logout?callback=?';
        var cloudLoginUrl = '${cloudServerUrl}/desktop/login/';
        var clearCookieUrl = '${contextPath}/backend/logoutClear/clearCookie.do';

        var allAppsModalHtml = '<div id="lzxAllAppsModal"></div>';

        

        function callback(){
            jQuery.getJSON(ssoLogoutUrl, function(data){
                var res = JSON.parse(data);
                if(res['result'] != 'success'){
                	erroAlertTips({
                      'title': title,
                      'msg':'中心退出登录失败',
                      'btnEvent':'toLogin',
                      'btnMsg':'返回登录页'
                    });
                } else {
                	var loginUrl = getCookie('ecsLoginUrl');
                	jQuery.getJSON(clearCookieUrl,function(){
                		toLogin(loginUrl);
                	})
                }
            });
        }

        function toLogin(loginUrl){
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

        function erroAlertTips (msg) {
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
                            '<a onclick="' + msg['btnEvent'] + '();" class="common-btn" '+eventType+'>'+msg['btnMsg']+'</a>'+
                          '</div>'+
                        '</div>';
            jQuery('body').append(tips);
          }
      </#if>
    </script>
    
</head>
<body class="${iconBgroundSetting}">
	<div id="content_main"></div>
	<!-- 外层容器 et-no-opacity:半透明 & et-opacity:透明-->
	<div class="et-main-container et-no-opacity">
		<!-- 右侧浮框设置功能模块 -->
		<div class="et-set-sidebar-main">
			<div class="et-set-sidebar-main-shadow"></div>
			<div class="et-set-sidebar-nav" id="js-sidebar-toolbar">
				<!-- <span class="et-set-layout1"></span>
				<span class="et-set-layout2"></span>
				<i></i> -->
				<span class="et-set-skin"></span>
			</div>
			<div class="et-set-sidebar-body">
				<div class="et-set-item-main et-set-skin-main">
					<span class="et-set-item-title">桌面背景</span>
					<div class="et-set-skin-images">
						<span class="et-set-skin-iconwrap et-left"><span class="et-set-skin-left et-set-skin-icon"></span></span>
						<div class="et-set-skin-body-wrap">
							<div class="et-set-skin-body clearfix" id="js-skin-images-body">
								<div class="et-skin-img-wrap et-loading">
								</div>
								<div class="et-skin-img-wrap et-loading">
								</div>
								<div class="et-skin-img-wrap et-loading">
								</div>
								<div class="et-skin-img-wrap et-loading">
								</div>
							</div>
						</div>
						<span class="et-set-skin-iconwrap et-right"><span class="et-set-skin-right et-set-skin-icon"></span></span>
					</div>
				</div>
				<div class="et-set-item-main et-set-bg-main">
					<span class="et-set-item-title">图标背景设置</span>
					<div class="et-set-bg-body">
						<label>
							<input type="radio" name="bg-check" value="opaque">不透明
						</label>
						<label>
							<input type="radio" name="bg-check" value="translucent">半透明
						</label>
					</div>
				</div>
				<div class="et-set-item-main et-set-class-main">
					<span class="et-set-item-title">分类管理</span>
					<div class="et-set-class-body clearfix">
						<span class="et-span-item" id="js-folder-default">默认应用</span>
						<span class="et-add-class-wrap et-span-item"><i class="et-add-class" id="js-add-folder"></i ></span>
						<span class="et-add-input-wrap et-span-item"><input type="text" id="js-add-input" class="et-add-input"></span>
					</div>
				</div>
				<div class="et-set-item-main et-set-title-main">
					<span class="et-set-item-title">标题设置</span>
					<div class="et-set-title-body">
						<div class="et-set-title-size clearfix">
							<span class="et-set-title-header fl">标题大小:</span>
							<span class="et-set-size-selector fl">
								<span id="js-font-size">
									<span>14</span>
									<i class="et-size-selector-icon"></i>
								</span>
								<ul id="js-font-size-list">
									<li>12</li>
									<li>14</li>
									<li>16</li>
									<li>18</li>
									<li>20</li>
									<li>24</li>
								</ul>
							</span>
						</div>
						<div class="et-set-title-color clearfix">
							<span class="et-set-title-header fl">标题颜色:</span>
							<span class="et-title-color-default fl" id="js-default-title-color">默认</span>
							<!-- 颜色模块 -->
							<ul class="et-title-color-list fl">
								<li val="#000000" style="background: #000000"></li>
								<li val="#eb3223" style="background: #eb3223"></li>
								<li val="#377d21" style="background: #377d21"></li>
								<li val="#0023f5" style="background: #0023f5"></li>
								<li val="#ee6f2d" style="background: #ee6f2d"></li>
							</ul>
						</div>
					</div>
				</div>
			</div>
		</div>
		<!-- 中间部分 -->
		<div class="et-main-center">
			<!-- 主导航部分 -->
			<div class="et-mainnav-main-wrap">
				<div class="et-mainnav-main">
					<div class="et-nav-show">
						<ul>
							<#list folders as folder>
								<li data-key="${folder.id}">
									<a href="#${folder.id}">${folder.name}</a>
								</li>
							</#list>
							<li  data-key="v8-system" id="et-nav-system">
								<a href="#v8-system">系统应用</a>
							</li>
						</ul>
					</div>
					<!-- 更多 -->
					<div class="et-nav-more">
						<div class="et-nav-more-dots">
							<span class="et-nav-more-dot"></span>
							<span class="et-nav-more-dot"></span>
							<span class="et-nav-more-dot"></span>
						</div>
						<div class="et-nav-more-items">
							<div class="et-nav-more-item">
								<a href="#aa">备课管理</a>
							</div>
							<div class="et-nav-more-item">
								<a href="#bb">学生评价</a>
							</div>
						</div>
					</div>
				</div>
			</div>



			<!-- 用户自定义文件夹应用和默认应用模块 -->
			<#list userFolderAppList as folderAndApp>
				<div class="et-item-group">
					<div class="et-group-title" data-key="${folderAndApp.id}">
						<i class="et-group-anchor" id="${folderAndApp.id}"></i>
						<#if titleSetMap??&&(titleSetMap?size>0)>
							<span class="et-custom-title" style="color:${titleSetMap.color}; font-size:${titleSetMap.fontSize };">${folderAndApp.name}</span>
							<#else>
								<span class="et-custom-title">${folderAndApp.name}</span>
						</#if>
					</div>
					<div class="et-group-content clearfix">
						<#list folderAndApp.appList as app>
							<div class="et-item-moudel" app-origin="${app.appOrigin}" appname="${app.shortName}" store-appid="${app.id}" folderid="${folderAndApp.id}" appid="${app.id}" data-url="${app.callbackAddr}" <#if app.appendParams??>append-param="${app.appendParams }"</#if> expired="${app.expired }">
							<a class="et-item-moudel-link" href="javascript:;">
								<img src="${app.icon}" onerror="imgErrorLoad(this)">
								<span class="item-moudel-name">
										${app.shortName}
										<#if app.appLevel??>
											<#if app.appLevel == 40>
												<i class="et-moudel-level et-moudel-level-country">国</i>
											<#elseif app.appLevel == 41>
												<i class="et-moudel-level et-moudel-level-province">省</i>
											<#elseif app.appLevel == 42>
												<i class="et-moudel-level et-moudel-level-town">市</i>
											<#elseif app.appLevel == 43>
												<i class="et-moudel-level et-moudel-level-district">区</i>
											<#elseif app.appLevel == 44>
												<i class="et-moudel-level et-moudel-level-school">校</i>
											<#elseif app.appLevel == 46>
												<i class="et-moudel-level et-moudel-level-internet">互</i>
											<#elseif app.appLevel == 45>
												<i class="et-moudel-level et-moudel-level-group">集</i>
											</#if>
									</#if>
									</span>
							</a>
					</div>
			</#list>
			<div class="et-moudel-add" folderid="${folderAndApp.id}" isDefault="${folderAndApp.isDefault}" title="添加应用" data-url="${folderAndApp.addAppUrl}">
				<img src="${contextPath}/backend/main/v8/img/moudel_add.png">
			</div>
		</div>
	</div>
	</#list>


			<!-- 应用模块 -->
			<div class="et-item-group">
				<div class="et-group-title">
					<i class="et-group-anchor" id="v8-system"></i>
				    <#if titleSetMap??&&(titleSetMap?size>0)>
                        <span class="et-custom-title" style="color:${titleSetMap.color}; font-size:${titleSetMap.fontSize };">系统应用</span>  
                    <#else>
                        <span class="et-custom-title">系统应用</span>  
                    </#if>
				</div>
				<div class="et-group-content clearfix">
				    <#list sysHideAppList as app>
						<div class="et-item-moudel et-item-moudel-hide" app-origin="${app.appOrigin}" appname="${app.shortName}" store-appid="${app.id}" data-url="${app.callbackAddr}" <#if app.appendParams??>append-param="${app.appendParams }"</#if> expired="${app.expired }">
							<a class="et-item-moudel-link" href="javascript:;">
								<img src="${app.icon}" onerror="imgErrorLoad(this)">
								<span class="item-moudel-name">
									${app.shortName}
									<#if app.appLevel??>
										<#if app.appLevel == 40>
											<i class="et-moudel-level et-moudel-level-country">国</i>
										<#elseif app.appLevel == 41>
											<i class="et-moudel-level et-moudel-level-province">省</i>
										<#elseif app.appLevel == 42>
											<i class="et-moudel-level et-moudel-level-town">市</i>
										<#elseif app.appLevel == 43>
											<i class="et-moudel-level et-moudel-level-district">区</i>
										<#elseif app.appLevel == 44>
											<i class="et-moudel-level et-moudel-level-school">校</i>
										<#elseif app.appLevel == 46>
											<i class="et-moudel-level et-moudel-level-internet">互</i>
										<#elseif app.appLevel == 45>
											<i class="et-moudel-level et-moudel-level-group">集</i>
										</#if>
									</#if>
								</span>
							</a>
						</div>
                    </#list>
                    <#list sysShowAppList as app>
						<div class="et-item-moudel" app-origin="${app.appOrigin}" store-appid="${app.id}" appname="${app.shortName}" data-url="${app.callbackAddr}" <#if app.appendParams??>append-param="${app.appendParams }"</#if> expired="${app.expired }">
							<a class="et-item-moudel-link" href="javascript:;">
								<img src="${app.icon}" onerror="imgErrorLoad(this)">
								<span class="item-moudel-name">
									${app.shortName}
									<#if app.appLevel??>
										<#if app.appLevel == 40>
											<i class="et-moudel-level et-moudel-level-country">国</i>
										<#elseif app.appLevel == 41>
											<i class="et-moudel-level et-moudel-level-province">省</i>
										<#elseif app.appLevel == 42>
											<i class="et-moudel-level et-moudel-level-town">市</i>
										<#elseif app.appLevel == 43>
											<i class="et-moudel-level et-moudel-level-district">区</i>
										<#elseif app.appLevel == 44>
											<i class="et-moudel-level et-moudel-level-school">校</i>
										<#elseif app.appLevel == 46>
											<i class="et-moudel-level et-moudel-level-internet">互</i>
										<#elseif app.appLevel == 45>
											<i class="et-moudel-level et-moudel-level-group">集</i>
										</#if>
									</#if>
								</span>
							</a>
						</div>
					</#list>
					<div class="et-moudel-add" id="js-add-system-app">
						<img src="${contextPath}/backend/main/v8/img/moudel_add.png">
					</div>
				</div>
			</div>


		</div>
		<div class="et-totop-icon" id="js-go-top"><i></i></div>
		<div class="et-background-layer" id="js-background-layer">
			<img id="js-background_img" src="${themeUrl}" style="visibility: visible; display: inline;">
		</div>
	</div>
	<#if showError??&&(showError==false)>
	<script type="text/javascript" src="${commonStaticPath}/js/layer/layer.js?${VERSION}"></script>
    <script src="${commonStaticPath}/js/common/common.navbar.js?${VERSION}"></script>
    <script src='${contextPath}/backend/main/v8/js/dragula.min.js?${VERSION}'></script>
    <script  type="text/javascript" src="${contextPath}/backend/main/v8/js/main.js?${VERSION}"></script>
    </#if>
</body>
</html>
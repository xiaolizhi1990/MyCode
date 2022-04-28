function initAnalysis(config){
	
	if(window.IFlyCollector){
		IFlyCollector.init(config);
		IFlyCollector.bindUser($("#GLOBAL_CURRENT_USER_ID").val(), null);
		/**
		 * 埋点方法
		 * IFlyCollector .onEvent(id,udmap,mid,oid,ext)
		 * id为自定义的事件id，不可为空
		 * udmap为自定义事件详细信息,json类型
		 * mid为模块id、非必填
		 * oid为行为对象id，例如下载电子书时，电子书的id可以填入到这个字段、非必填
		 * ext为扩展信息，json格式、非必填
		 */
		var ext = {
				"schoolId":$("#GLOBAL_CURRENT_SCHOOL_ID").val(),
				"userId":$("#GLOBAL_CURRENT_USER_ID").val()
		};
		IFlyCollector.onEvent('desktopvisit',null,'desktopvisit',$("#GLOBAL_CURRENT_USER_ID").val(),ext);
	}
}

$.ajax({
	url : CONTEXT_PATH + "/backend/get/iflyCollectorConfig.do",
	type : 'post',
	async: false,//使用同步的方式,true为异步方式
	data : {},//这里使用json对象
	success : function(config){
		(function (w, d, s) {
		    var l = 'IFlyCollector',
		        f = d.getElementsByTagName(s)[0],
		        j = d.createElement(s),
		        w = window;
		    w[l] = {};
		    var c = w[l];
		    c._o = function (a) {
		        return function () {
		            (c._e = c._e || []).push([a, arguments])
		        }
		    };
		    var e = ['init', 'onEvent', 'onError', 'bindUser', 'updateCustomConfig'];
		    for (var i in e) 
		    {
		        c[e[i]] = c._o.call(null, e[i])
		    }
		    j.async = true;
		    j.src = 'http://ebgjs.changyan.com/jssdk/entry.js';
		    f.parentNode.insertBefore(j, f);
		})(window, document, 'script');	
		initAnalysis(config);
		window.IFLY_COLLECTOR_CONFIG = config;
	},
	dataType :'json'
});

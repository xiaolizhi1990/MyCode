$(function () {
	// ! 注意：appid并非商店应用Id
	var $body = $('body');
	var $window = $(window);
    jQuery(document).ready(function(){
        $.post(CONTEXT_PATH + '/backend/indexPage/checkEducationalPlatformAbutment.do',function(ret){

        	var data = ret['data'];
        	//桌面埋点
            jyyun_analysis({
				eventId: "10011001",
                platformNo: data['platformNo'],
                appId: "iflytek",
                moduleId: "1001",
                userId: $("#GLOBAL_CURRENT_USER_ID").val(),
                isDebug: data['debug']
            });

            if(ret['success'] == true){
                if(data['hasRealNameAuthed'] == true){ // 已实名认证
                } else {
                    var certUrl = data['certUrl']; // 不授权使用系统信息跳转认证页面地址
                    var useSystemInfoUrl = CONTEXT_PATH + '/backend/edu/res/doRealNameAuth.do?appId=-false&authSysUserInfo=true'; //授权使用系统信息跳转认证页面地址
                    var imgSrc = CONTEXT_PATH+"/backend/main/v8/img/default_app.png";
                    toRealNameAuthPage(certUrl,useSystemInfoUrl,imgSrc);
                }
            }
		});
	});
	$body.ajaxError(function(event,xhr,options){
		if(xhr.status === 403){
			$.post(CONTEXT_PATH + "/backend/login/getLoginStatus",function(data){
				if(data['type'] === -1){
					location.href = data['loginUrl'];
				}
			},'json');
		}
	});
	
	//  搜索框展示历史搜索
	$('.et-search-input').on('focus', function () {
		$('.et-search-history').slideDown("fast")
	});
	$('.et-search-input').on('blur', function () {
		$('.et-search-history').slideUp("fast")
	});
	// 点击历史将内容选中
	$('.et-search-history li').on('click', function () {
		$('.et-search-input').val($(this).attr('data-name'))
	});

	// 主导航
	$('.et-nav-show li').on('click', function () {
		$(this).siblings('li').removeClass('nav-selected')
		$(this).addClass('nav-selected')
	});

	var isShowSetSkin = false;
	// 设置显示设置
	$('#js-sidebar-toolbar').on('click', function (e) {
		e.stopPropagation();
		isShowSetSkin = !isShowSetSkin;
		if (isShowSetSkin) {
			$('.et-set-sidebar-body').slideDown("fast");
			// 获取设置
			getDesktopSetting();
		}
		else {
			$('.et-set-sidebar-body').slideUp("fast");
		}
	});
	$body.on('click', function () {
		if (isSelectFontSize) {
			$('#js-font-size-list').hide();
			isSelectFontSize = false
		}
		if (isShowSetSkin) {
			$('.et-set-sidebar-body').slideUp("fast");
			isShowSetSkin = false
		}
	});

	var isSelectFontSize = false
	$('.et-set-sidebar-body').on('click', function (e) {
		e.stopPropagation(); // 阻止事件冒泡，用于上面的点击其它地方关闭设置框。
		// 如果字体选择器是展开的，则收起它
		if (isSelectFontSize) {
			$('#js-font-size-list').slideUp('fast');
			isSelectFontSize = false
		}
	});
	$('.item-class-moudel').hover(function () {
		$(this).siblings('span').removeClass('et-class-active')
		$(this).addClass('et-class-active')
	},function () {
		$(this).removeClass('et-class-active')
	});
	$('.item-class-moudel').on('click', function () {
		$(this).siblings('span').removeClass('et-class-selected')
		$(this).addClass('et-class-selected')
	});
	$('.et-set-size-selector').on('click', 'li', function () {
		// TODO：选中
		$(this).parent('ul').slideUp("fast")
	});
	$('#js-go-top').on('click', function () {
		$window.scrollTop(0);
	});

	// 创建mask
	$('#js-add-system-app').on('click', function () {
		var elMask = $('#js-et-mask');
		$body.addClass('frozon-body');
		if (elMask.length > 0) {
			elMask.show();
		}
		else {
			appendMask();
		}
	});
	// 监听滚动条，控制导航栏是否吸附
	var navbarPosition = $('.et-mainnav-main').offset().top;
	$window.on('scroll', function () {
		var height = navBarHeight();
		if ($window.scrollTop() + height > navbarPosition) {
			$('.et-mainnav-main').addClass('et-mainnav-fixed');
			$('.et-mainnav-main').css({ top: height + 'px'});
		}
		else {
			$('.et-mainnav-main').removeClass('et-mainnav-fixed');
			$('.et-mainnav-main').css({
				top: 'auto'
			});
		}
	});

	// 判断是否有顶部导航条，如果没有，则固定距离顶部0
	function navBarHeight () {
		return $('#lzxNavBar').height() || 0;
	}

	function appendMask () {
		var html = '<div class="et-mask" id="js-et-mask">' +
		             '<div class="et-modal">' +
								   '<div class="et-modal-header">添加系统应用</div>' +
									 '<div class="et-modal-content" id="js-add-apps">' +
									 	 '<div class="et-modal-subtitle">显示的应用</div>' +
										 '<div class="et-modal-appshow-wrap" id="js-add-show-apps">' +
										 	 '<div class="et-modal-app et-loading"></div>' +
										 	 '<div class="et-modal-app et-loading"></div>' +
										 	 '<div class="et-modal-app et-loading"></div>' +
										 	 '<div class="et-modal-app et-loading"></div>' +
										 	 '<div class="et-modal-app et-loading"></div>' +
										 	 '<div class="et-modal-app et-loading"></div>' +
										 '</div>' +
									 	 '<div class="et-modal-subtitle">隐藏的应用</div>' +
											'<div class="et-modal-appshow-wrap" id="js-add-hide-apps">' +
												'<div class="et-modal-app et-loading"></div>' +
												'<div class="et-modal-app et-loading"></div>' +
												'<div class="et-modal-app et-loading"></div>' +
												'<div class="et-modal-app et-loading"></div>' +
												'<div class="et-modal-app et-loading"></div>' +
											'</div>' +
									 '</div>' +
									 '<div class="et-modal-footer">' +
										 '<span class="et-modal-btn" id="js-cancel-apps">取消</span>' +
									   '<span class="et-modal-btn et-btn-primary" id="js-save-apps">保存</span>' +
									 '</div>' +
								 '</div>' +
							 '</div>';
		$body.append(html);
		getSystemApps();
	}
	var systemAppsData = []
	var hideAppIds = []; // 由于隐藏APP接口需要传递所有的被隐藏的APPid,所以此处用数组存储
	var showAppIds = []; // 显示的APPid
	function getSystemApps () {
		$.get(CONTEXT_PATH+'/backend/desktop/list/sys-app.do?all=true&t=' + new Date().getTime(), function (data) {
			if (typeof data === 'string') {
				systemAppsData = JSON.parse(data)
			}else if(typeof data === 'object'){
				systemAppsData = data;
			}
			appendSystemApps()
		})
	}
	function appendSystemApps () {
		var apps = systemAppsData;
		var showedAppsHtml = '';
		var hidedAppsHtml = '';
		for (var i = 0; i < apps.length; i++) {
			var app = apps[i];
			if (app.hide) {
				hidedAppsHtml += generateAppHtml(app);
				hideAppIds.push(app.id);
			}
			else {
				showedAppsHtml += generateAppHtml(app);
				showAppIds.push(app.id)
			}
		}
		$('#js-add-show-apps').html(showedAppsHtml);
		$('#js-add-hide-apps').html(hidedAppsHtml);
	}

	function generateAppHtml (app) {
		var html ='<div class="et-modal-app" data-id="' + app.id + '">' +
								'<img width="50" height="50" src="' + app.imgHttpUrl + '" onerror="imgErrorLoad(this)">' +
								(app.hide ? '<span class="et-modal-app-icon et-modal-app-add" data-id="' + app.id + '"></span>'
									: '<span class="et-modal-app-icon et-modal-app-close" data-id="' + app.id + '"></span>') +
								'<div class="et-modal-app-name">' + app.name + '</div>' + 
							'</div>';
		return html
	}
	// 监听从显示的应用中移除应用
	$body.on('click', '.et-modal-app-icon', function () {
		var $this = $(this);
		var id = $this.attr('data-id');
		if ($this.hasClass('et-modal-app-close')) {
			hideAppIds.push(id);
			showAppIds.splice(showAppIds.indexOf(id), 1);
			var el = $this.removeClass('et-modal-app-close').addClass('et-modal-app-add').parent().remove();
			$('#js-add-hide-apps').append(el);
		}
		else {
			showAppIds.push(id);
			hideAppIds.splice(hideAppIds.indexOf(id), 1);
			var el1 = $this.removeClass('et-modal-app-add').addClass('et-modal-app-close').parent().remove();
			$('#js-add-show-apps').append(el1);
		}
	});

	function toggleAppShow () {
		var d = [''];
		var hd = [''];
		if (showAppIds.length !== 0) {
			d = showAppIds;
		}
		if(hideAppIds.length !== 0){
			hd = hideAppIds;
		}
		$.post(CONTEXT_PATH+'/backend/desktop/save/sys-app-configs.do', {
			sysAppSortIds: d,
			hiddenSysAppIds: hd
		}, function (res) {
			updateStaticHtml()
		})
	}
	// 强制更新静态文件
	function updateStaticHtml () {
		$.get(CONTEXT_PATH+'/backend/indexPage/v8/updateIndexCache.do?t=' + new Date().getTime())
	}

	// 监听保存按钮
	$body.on('click', '#js-save-apps', function () {
		toggleAppShow();
		hideAllApps();
		hideMask();
	});
	// 取消
  $body.on('click', '#js-cancel-apps', function () {
		hideAppIds = []
		showAppIds = []
		hideMask();
	})
  // 隐藏所有的app
	function hideAllApps () {
		systemAppsData.map(function (app) {
			app.hide = hideAppIds.indexOf(app.id) !== -1
		})
		hideAppIds.map(function (appid) {
			$('.et-item-moudel[store-appid=' + appid + ']').addClass('et-item-moudel-hide');
		})
		showAppIds.map(function (appid) {
			$('.et-item-moudel[store-appid=' + appid + ']').removeClass('et-item-moudel-hide');
		})
	}
  // 隐藏mask
	function hideMask () {
		$('.et-mask').hide();
		$body.removeClass('frozon-body');
	}
	var appFloderList = []; // 分类列表
	if (window.sessionStorage) {
		appFloderList = JSON.parse(window.sessionStorage.getItem('appFloderList')) || [];
	}
	// 获取文件列表
	function getAppFolderList () {
		$.get(CONTEXT_PATH+'/backend/list/folder.do?t=' + new Date().getTime(), function (res) {
			if (typeof res === 'string') {
				res = JSON.parse(res)
			}
			/*res.unshift({
				name: '默认应用',
				id: 'default'
			})*/
			if (window.sessionStorage) {
				window.sessionStorage.setItem('appFloderList', JSON.stringify(res));
			}
			appFloderList = res;
			initContextMenu(res)
		})
	}
	getAppFolderList();
	// 初始化右键菜单栏
	function initContextMenu (menus) {
		$('.et-main-center').on('contextmenu', '.et-item-moudel', function (e) {
			hideContextMeun();
			var folderid = $(this).attr('folderid');
			var appid = $(this).attr('appid');
			if (folderid) {
				e.preventDefault();
				var newMenus = menus.filter(function (i) {
					return i.id !== folderid;
				})
				showContextMeun(newMenus, folderid, appid, e.pageX, e.pageY);
			}
		})
		$body.on('click', function () {
			hideContextMeun();
		})
		$body.on('click', '.et-context-item', function (e) {
			e.stopPropagation();
			var $this = $(this);
			var sourceid = $this.attr('sourceid');
			var menuid = $this.attr('menuid');
			var appid = $this.attr('appid');
			var isDelete = $this.attr('del');
			if (!menuid) {
				return;
			}
			if (isDelete) { // 删除应用
				deleteAppToFolder(menuid, appid);
			}
			else {
				moveAppToFolder(menuid, appid);
			}
			var $el = $('.et-item-moudel[appid=' + appid + ']').remove();
			if (!isDelete) {
				$el.attr('folderid', menuid);
				$('.et-moudel-add[folderid=' + menuid + ']').before($el);
			}
			hideContextMeun();
		})
		function hideContextMeun () {
			$('.et-contextmeun').remove();
		}

		function showContextMeun (menus, sourceId, appid, x, y) {
			var html = '';
			menus.map(function (menu) {
				html += '<div class="et-context-item" appid=' + appid + ' sourceid=' + sourceId + ' menuid="' + menu.id + '">' + menu.name + '</div>';
			});

			var contextHtml = '<div class="et-contextmeun" style="top:' + y + 'px;left:' + x + 'px;">' +
													'<div class="et-context-item">' +
												    '<span>移动到分类</span>' +
														'<div class="et-subcontextmenu">' + html +
														'</div>' +
													'</div>' +
												  '<div class="et-context-item" del=true menuid="' + sourceId + '" appid=' + appid + '>删除</div>' +
												'</div>';
			$body.append(contextHtml);
		}
	}
	// 移动APP到文件夹
	function moveAppToFolder (folderId, appId) {
		// 注意：appid并非商店应用Id
		$.post(CONTEXT_PATH+'/backend/move/app-to-folder.do', {
			folderId: folderId,
			desktopAppId: appId
		}, function () {
			updateStaticHtml();
		})
	}
	function deleteAppToFolder (folderId, appId) {
		// 注意：appid并非商店应用Id
		$.post(CONTEXT_PATH+'/backend/desktop/remove/desktop-app.do', {
			folderId: folderId,
			desktopAppId: appId
		}, function () {
			updateStaticHtml();
		})
	}
	// 获取设置栏目
	var isInit = false
	function getDesktopSetting() {
		if (themeList.length === 0) {
			getThemeImages();
		}
		if (!isInit) {
			getThemeOpacity();
			setFolderTypes();
			getFontSetting();
			isInit = true;
		}
		//$.get('/v8/getIconBgroundSetting.do', function (data) {
		// 	console.log(data)
		// });
	}
	var themeList = [];
	var themeImageListStart = 0;
	var currentBgId; // 默认选中背景图
	$('.et-set-skin-left').hide();
	// 获取主题图片
	function getThemeImages() {
		$.get(CONTEXT_PATH+'/backend/theme/listingTheme.do?t=' + new Date().getTime(), function (res) {
			themeList = res;
			createThemeListHtml(res);
			createThemeBg();
		})
	}
	// todo: 不要全部插入DOM，只把要显示的图片插入DOM。
	function createThemeListHtml (list) {
		var html = '';
		list.map(function (li) {
			html += '<div class="et-skin-img-wrap">' +
								'<img class="et-skin-img" imgid="' + li.id + '" data-src="'+ li.src +'" src="' +li.thumb+ '">' +
							'</div>';
		});
		var $imagesBody = $('#js-skin-images-body');
		$imagesBody.html(html);
		if (currentBgId) {
			$('.et-skin-img[imgid="' + currentBgId + '"]').addClass('selected');
		}
		$('.et-set-skin-right').on('click', function () {
			if (themeImageListStart < themeList.length - 4) {
				themeImageListStart++;
				$imagesBody.css({
					'transform': 'translateX(-' + 94 * themeImageListStart + 'px)'
				})
				$('.et-set-skin-left').show();
				if (themeImageListStart === themeList.length - 4) {
					$('.et-set-skin-right').hide();
				}
			}
			else {
				$('.et-set-skin-right').hide();	
			}
		});
		$('.et-set-skin-left').on('click', function () {
			if (themeImageListStart > 0) {
				themeImageListStart--;
				$imagesBody.css({
					'transform': 'translateX(-' + 94 * themeImageListStart + 'px)'
				})
				$('.et-set-skin-right').show();
				if (themeImageListStart === 0) {
					$('.et-set-skin-left').hide();
				}
			}
			else {
				$('.et-set-skin-left').hide();
			}
		});
	}
	// 创建背景图片
	function createThemeBg () {
		$('.et-skin-img').on('click', function () {
			var $this = $(this);
			var src = $this.attr('data-src');
			var id = $this.attr('imgid');
			$('.et-skin-img').removeClass('selected');
			$this.addClass('selected');
			$('#js-background_img').attr('src', src);
			$.post(CONTEXT_PATH+'/backend/theme/updateCurrUserMainBground.do', {
				themeId: id
			}, function () {
				updateStaticHtml();
			})
		})
	}
	// 获取当前自己的主题
	function getMyTheme () {
		$.get(CONTEXT_PATH+'/backend/theme/getCurrUserMainBground.do?t=' + new Date().getTime(), function (res) {
			if (res && res.data) {
				var src = res.data.themeUrl;
				currentBgId = res.data.id;
				$('#js-background_img').attr('src', src);
				var width = $('#js-background-layer').width();
				if ($window.width() > width) {
					width = $window.width()
				}
				$('#js-background_img').css({
					width: width
				})
			}
		})
	}
	getMyTheme();

	$window.on('resize', function () {
		var width = $('#js-background-layer').width();
		if ($window.width() > width) {
			width = $window.width()
		}
		$('#js-background_img').css({
			width: width
		})
	})

	// 获取默认透明设置
	function getThemeOpacity() {
		$.get(CONTEXT_PATH+'/backend/indexPage/v8/getIconBgroundSetting.do?t='+new Date().getTime(), function (res) {
			var val = res.data;
			$(":radio[name='bg-check'][value='" + val + "']").prop("checked", "checked");
		})
		$(":radio[name='bg-check']").on('click', function () {
			var val = $(this).val();
			setThemeOpacity(val);
			if (val === 'translucent') {
				$body.addClass('translucent');
				$body.removeClass('opaque');
			}
			else {
				$body.addClass('opaque');
				$body.removeClass('translucent');
			}
		})
	}

	function setThemeOpacity(value) {
		$.post(CONTEXT_PATH+'/backend/indexPage/v8/saveIconBgroundSetting.do', {
			value: value
		}, function () {
			updateStaticHtml()
		})
	}

	// 监听删除分类
	function setFolderTypes() {
		var html = '';
		appFloderList.map(function (folder, index) {
			//存在兼容性问题
			//console.info(folder);
			if (!folder['default']) {
				html += '<span class="item-class-moudel et-span-item"><span>' + folder.name + '</span><i class="et-edit-class" idx="' + index + '" fid="' + folder.id + '"></i><i class="et-delete-class" idx="' + index + '" fid="' + folder.id + '"></i></span>';
			}
		})
		$('#js-folder-default').after(html);
		deleteFolderType();
		editFolderType();
		addFolderType();
	}
	// 监听删除分类
	function deleteFolderType () {
		$('.et-set-class-main').on('click', '.et-delete-class', function () {
			var fid = $(this).attr('fid');
			var idx = +$(this).attr('idx');
			$(this).parent().remove();
			appFloderList.splice(idx, 1);
			$('.item-class-moudel').each(function (i, item) {
				var item = $(item);
				item.find('.et-edit-class').attr('idx', i + 1)
				item.find('.et-delete-class').attr('idx', i + 1)
			})
			if (window.sessionStorage) {
				window.sessionStorage.setItem('appFloderList', JSON.stringify(appFloderList));
			}
			$('.et-add-class-wrap').show(); // todo: 将显示和隐藏统一处理
			// 将此分类里面的所有应用移动到默认分类里面。
			$('.et-moudel-add[isDefault="1"]').before($('.et-item-moudel[folderid="' + fid + '"]'));
			// 删除此分类
			$('.et-group-title[data-key="' + fid + '"]').parent().remove();
			// 删除上面的导航
			var navBar = $('.et-nav-show li[data-key="' + fid + '"]');
			navBar.remove();
			var hasCls = navBar.hasClass('nav-selected');
			if (hasCls) {
				$('.et-nav-system').addClass('nav-selected');
				window.location.hash = '';
			}
			$.post(CONTEXT_PATH+'/backend/remove/folder.do', {
				folderId: fid
			}, function () {
				updateStaticHtml();
			})
		})
	}
	// 监听修改分类
	function editFolderType () {
		var el = ''
		$('.et-set-class-main').on('click', '.et-edit-class', function () {
			var fid = $(this).attr('fid');
			var idx = $(this).attr('idx');
			var html = '<span class="et-add-input-wrap et-edit-input et-span-item"><input type="text" id="js-edit-input" class="et-add-input"></span>';
			el = $(this).parent();
			el.replaceWith(html);
			$('#js-edit-input').focus();
			$('#js-edit-input').on('keyup', function (e) {
				if (e && e.keyCode === 13) {
					var $this = $(this);
					var val = $this.val();
					if (!val) return;
					if (val.length > 6) {
						layer.msg('分类名称最多6个字');
						return
					}
					$.post(CONTEXT_PATH+'/backend/save/folder.do', {
						id: fid,
						name: val
					}, function () {
						updateStaticHtml();
						el.children('span').text(val);
						$('.et-group-title[data-key=' + fid + '] span').text(val); // 修改APP分组上的名字
						$('.et-nav-show li[data-key="' + fid + '"] a').text(val); // 修改导航上的名字
						// 修改移动到分类上面的名字
						appFloderList.map(function (folder) {
							if (folder.id === fid) {
								folder.name = val;
							}
						});
						$this.blur();
					})
				}
			})
		});
		$('.et-set-class-main').on('blur', '#js-edit-input', function () {
			try {
				$(this).parent().replaceWith(el)
			}
			catch (e) {
				// todo: 上面的blur会导致这里的报错？奇怪
			}
		});
	}

	// 监听增加分类
	function addFolderType () {
		$('#js-add-folder').on('click', function () {
			$('.et-add-input-wrap').show();
			$('#js-add-input').focus();
			$(this).parent().hide();
		});
		if (appFloderList.length < 6) {
			$('.et-add-class-wrap').show();
		}
		$('.et-set-class-main').on('keyup', '#js-add-input', function (e) {
			if (e && e.keyCode === 13) {
				var val = $(this).val();
				if (!val) return;
				if (val.length > 6) {
					layer.msg('分类名称最多6个字');
					return
				}
				$.post(CONTEXT_PATH+'/backend/save/folder.do', {
					name: val
				}, function (folderid) {
					updateStaticHtml();
					folderid = $.trim(folderid);
					appFloderList.push({
						id: folderid,
						name: val
					})
					if (window.sessionStorage) {
						window.sessionStorage.setItem('appFloderList', JSON.stringify(appFloderList));
					}
					addFolder(folderid, val);
				})
			}
		});
		$('.et-set-class-main').on('blur', '#js-add-input', function (e) {
			$('.et-add-input-wrap').hide();
			$('#js-add-input').val('');
			if (appFloderList.length < 6)  {
				$('#js-add-folder').parent().show();
			}
		})

		function addFolder (id, name) {
			//var location = window.location.protocol + '//' + window.location.host;
			var dataUrl =APP_MANAGE_PATH + '?screen=full&portalFolderId=' + id;
			var html = '<div class="et-item-group">' +
	                 '<div class="et-group-title" data-key="' + id + '">' +
											'<i class="et-group-anchor" id="' + id + '"></i>' +
											'<span class="et-custom-title" style="color:' + currentFontVal.color + '; font-size:' + currentFontVal.size + ';">' + name + '</span>' +
	                  '</div>' +
	                  '<div class="et-group-content clearfix">' +
	                    '<div class="et-moudel-add" folderid="' + id + '" title="添加应用" data-url="' + dataUrl + '">' +
	                        '<img src="' + CONTEXT_PATH + '/backend/main/v8/img/moudel_add.png">' +
	                    '</div>' +
	                  '</div>' +
                	'</div>';
			var type = '<span class="item-class-moudel et-span-item"><span>' + name +
				'</span><i class="et-edit-class" idx="' + (appFloderList.length - 1) + '" fid="' + id + '"></i><i class="et-delete-class" idx="' + (appFloderList.length - 1) + '" fid="' + id + '"></i></span>'
			$('.et-main-center').append(html);
			// 初始化拖拽
			var content = $('#' + id).parent().siblings()[0];
			initSortable(content);
			$('.et-add-class-wrap').before(type);
			$('#js-add-input').val('');
			var inpu = $('#js-add-input').remove(); // 为了解决IE下，隐藏输入框后还有关闭闪烁的问题。
			$('.et-add-input-wrap').hide();
			$('.et-add-input-wrap').append(inpu);
			var nav = '<li data-key="' + id + '">' +
									'<a href="#' + id + '">' + name + '</a>' +
								'</li>'
			$('.et-nav-show ul').append(nav);
			if (appFloderList.length < 6) {
				$('#js-add-folder').parent().show();
			}
		}
	}
	var currentFontVal = {}
	// 获取字体设置
	function getFontSetting () {
		$.get(CONTEXT_PATH+'/backend/get/titleSetting.do?t='+new Date().getTime(), function (res) {
			res = res || {
				size: '16px',
				color: '#333333'
			};
			currentFontVal = res;
			$('#js-font-size span').text(res.size);
			var selectColor = $('.et-title-color-list li[val="' + res.color + '"]');
			if (selectColor.length > 0) {
				selectColor.addClass('et-color-select');
			}
			else {
				$('#js-default-title-color').addClass('et-color-select');
			}
		})
		// 设置标题size
		$('#js-font-size').on('click', function (e) {
			e.stopPropagation();
			$(this).siblings('ul').slideDown("fast");
			isSelectFontSize = true
		});
		$('#js-font-size-list').on('click', 'li', function () {
			var val = $(this).text() + 'px';
			currentFontVal.size = val;
			$('#js-font-size span').text(val);
			setFontSetting();
			// $('.et-custom-title').css({'fontSize': val});
			$('.et-custom-title').css({'fontSize': val});
		});
		$('.et-title-color-list li').on('click', function () {
			var val = $(this).attr('val');
			currentFontVal.color = val;
			setFontSetting();
			$(this).addClass('et-color-select').siblings().removeClass('et-color-select');
			$('#js-default-title-color').removeClass('et-color-select');
			$('.et-custom-title').css({ 'color': val });
		})
		$('#js-default-title-color').on('click', function () {
			var defaultColor = '#333333';
			currentFontVal.color = defaultColor;
			setFontSetting();
			$('.et-title-color-list li').removeClass('et-color-select');
			$(this).addClass('et-color-select');
			$('.et-custom-title').css({ 'color': defaultColor });
		})
	}
	// 设置类型字体，颜色
	function setFontSetting () {
		$.post(CONTEXT_PATH+'/backend/save/titleSetting.do', currentFontVal, function () {
			updateStaticHtml();
		})
	}
	// 判断URL中是否有hash，如果有，根据HASH设置导航栏
	var hash = window.location.hash
	if (hash && hash.length > 1) {
		var id = hash.substring(1, hash.length);
		$('.et-nav-show li[data-key="' + id + '"]').addClass('nav-selected');
	}
	// 点击应用做跳转处理
	$('.et-main-center').on('click', '.et-item-moudel', function (e) {
		//console.log(999, e.target.attributes, e.target.attributes[0], e.target.attributes[0].nodeValue)
		var flag=true;
		var $this = $(this);
		var url = $this.attr('data-url');
		var appname = $this.attr('appname');
		var storeAppid = $this.attr('store-appid');
		var appendParam = $this.attr('append-param');
		var appImg = $this.attr('app-img-url');
		var appImg = e.target.attributes[0].nodeValue + ''
		var originUrl = url;
		// 如果是国家资源应用，先判断用户是否进行实名认证过
		var appOrigin = $this.attr('app-origin');
        if (appOrigin == 3) {
            $.ajax({
                url: CONTEXT_PATH + '/backend/edu/res/doAccessEduResApp.do',
                type: 'post',
                async: false,//同步
                data: {'appId':storeAppid},
                success: function(ret){
                    if(ret['success'] == true){
                        var data = ret['data'];
                        if(data['hasRealNameAuthed'] == true){ // 已实名认证
                            url += "&sysCode="+data['sysCode']+"&ticket="+data['ticket'];
                            window.open((url));
                        } else {
							var certUrl = data['certUrl']; // 不授权使用系统信息跳转认证页面地址
							var useSystemInfoUrl = CONTEXT_PATH + '/backend/edu/res/doRealNameAuth.do?appId='+storeAppid+'&authSysUserInfo=true'; //授权使用系统信息跳转认证页面地址
                            toRealNameAuthPage(certUrl,useSystemInfoUrl,appImg);
                        }
                    } else {
                        layer.alert(ret['msg']);
                    }
                    flag = false;
                }
            });
        }
        if (!flag) {
            return;
        }

	  // 1) 获取url，如果没有url，表示应用正在紧张开发中。
	  if (!url) {
	    layer.alert('应用正在紧张开发中');
			return;
		}

		//1 应用过期
		var appStatus = false;
		$.ajax({
			url : CONTEXT_PATH+'/backend/appInfo/status',
			type : 'post',
			async: false,//使用同步的方式,true为异步方式
			data : {'appId':storeAppid},//这里使用json对象
			success : function(data){
				if(data['code']){
					layer.alert(data['code'] !== '-5101' ? data['msg'] : '应用未授权,请联系管理员');
					return;
				}
				if(1 === data['expired']){
					layer.alert('此应用已过期,请联系管理员');
					return;
				}
				appStatus = true;
			},
			dataType :'json'
		});
		if(!appStatus){
			return;
		}

		//2 敏感数据授权
		var appEnterable = false;
		$.ajax({
		url: CONTEXT_PATH + '/backend/indexPage/appEnterable.do',
		dataType: 'jsonp',
		async: false,//同步
		data: {'appId':storeAppid},
		success: function(ret){
		  if(ret['success'] == true){
			var data = ret['data'];
			if(data['enable'] == false){
				//因敏感数据授权缺失，应用不可访问
			  if(data['isAdmin'] == true){
				layer.alert('应用数据权限发生变化，为了保护学校的数据安全，该应用暂时停止访问，请到应用管理-已添加应用-数据权限管理中进行应用数据权限审核。');
			  } else {
				layer.alert('应用数据权限发生变化，为了保护学校的数据安全，该应用暂时停止访问，需要学校管理员审核后才能正常使用，如需使用请联系学校管理员。');
			  }
			} else {
				appEnterable = true;//接口正常且应用敏感数据授权正常
			}
		  } else {
			layer.alert(ret['msg']);
		  }
		}
	  });
	  if(!appEnterable) return;

		appClickCollectorLog($this);
		
		/*var expired = $this.attr('expired');*/
		// 2) 获取过期状态，如果过期状态存在，表示已经过期。
		/*if ('1' === expired) {
			layer.alert('此应用已过期,请联系管理员');
			return;
		}*/
		// 3) 如果URL不是/开头，则表示第三方应用，判断是否有http:如果没有，则拼接上。
		var isThirdApp = url.indexOf('/') !== 0;
		if (isThirdApp) {
			if (!(/^http(s)?/ig.test(url))) {
				url = 'http://' + url;
			}
			window.open(url);
			return;
		}
		// 是否是append-param
		if (appendParam) {
			url = '/app/getInto.do?url=' + encodeURIComponent(url);
			url += '&appendParams=' + appendParam;
			window.open(url);
			return;
		}
		// 4）内部应用跳转需要拼接参数，需要判断应用地址中是否存在参数appendText2Param=false，如果存在则去掉，否则拼接如下内容：
		//   '&_app_encoding_tag_=1&text=' + text + '
		if (url.indexOf('&appendText2Param=false') > 0) {
			url = url.replace('&appendText2Param=false', '');
		}
		else {
			if (url.indexOf('?') === -1) {
				url = url + appEncodeURL('?_app_encoding_tag_=1&text=' + appname + '&__time__=' + new Date().getTime());
			}
			else {
				url = url + appEncodeURL('&_app_encoding_tag_=1&text=' + appname + '&__time__=' + new Date().getTime());
			}
		}
		window.open((url));
		postLoginActMenu(originUrl, appname, storeAppid);
		// 5) 跳转之前需要调用接口来记录用户操作记录，接口共2个，分别对应有应用id和无应用id

	})

    function toRealNameAuthPage (noUseSystemInfoRealNameAuthUrl, useSystemInfoRealNameAuthUrl,img) {
        var privacyTips1 = '<div class="privacy-bg-1">' +
            '<div class="privacy-box-1">' +
            '<span class="privacy-close"></span>' +
            '<div class="privacy-content-1">' +
            '<div class="privacy-content-header">身份认证</div>' +
            '<div class="privacy-content-img"><img src="' + img + '"/></div>' +
            '<div>您还没有进行实名认证，将会跳转到实名认证页面，请您选择是否授权使用本平台的个人信息，进行自动实名认证！</div>' +
            '<div class="privacy-content-footer"><h3>授权认证后应用将获得以下权限</h3><ul><li>姓名</li><li>身份证号</li><li>手机号码</li></ul></div>' +
            '</div>' +
            '<div class="privacy-btn-1">' +
            '<a class="privacy-btn-one" href="' + useSystemInfoRealNameAuthUrl + '" target="_blank">授权认证</a><a class="privacy-btn-two" href="' + noUseSystemInfoRealNameAuthUrl + '" target="_blank">手动认证</a>' +
            '</div>' +
            '</div>' +
            '</div>';
        document.documentElement.style.overflowY = 'hidden';
        $('body').append(privacyTips1);

        $('.privacy-btn-one').on('click', function () {
            document.documentElement.style.overflowY = 'scroll';
            $('.privacy-bg-1').css('display', 'none')
        })
        $('.privacy-btn-two').on('click', function () {
            document.documentElement.style.overflowY = 'scroll';
           // document.documentElement.style.overflowY = 'hidden';
            $('.privacy-bg-1').css('display', 'none')
        })
        $('.privacy-close').on('click', function () {
            document.documentElement.style.overflowY = 'scroll';
            $('.privacy-bg-1').css('display', 'none')
        })
    }

    /*function toRealNameAuthPage (noUseSystemInfoRealNameAuthUrl, useSystemInfoRealNameAuthUrl,img) {
        var privacyTips1 = '<div class="privacy-bg-1">' +
            '<div class="privacy-box-1">' +
            '<div class="privacy-content-1">' +
            '<div class="privacy-content-header">您还没有进行实名认证,将会跳转到实名认证页面,请您选择是否授权使用本平台的个人信息,进行自动实名认证！</div>' +
            '<div class="privacy-content-img"><img src="' + img + '"/></div>' +
            '<div class="privacy-content-footer"><h3>授权认证后应用将获得以下权限</h3><ul><li>姓名</li><li>身份证号</li><li>手机号码</li></ul></div>' +
            '</div>' +
            '<div class="privacy-btn-1">' +
            '<a class="privacy-btn-one" href="' + useSystemInfoRealNameAuthUrl + '" target="_blank">授权认证</a><a class="privacy-btn-two" href="' + noUseSystemInfoRealNameAuthUrl + '" target="_blank">手动认证</a>' +
            '</div>' +
            '</div>' +
            '</div>'
        document.documentElement.style.overflowY = 'hidden';
        $('body').append(privacyTips1);

        $('.privacy-btn-one').on('click', function () {
            document.documentElement.style.overflowY = 'scroll';
            $('.privacy-bg-1').css('display', 'none')
        })
        $('.privacy-btn-two').on('click', function () {
            document.documentElement.style.overflowY = 'scroll';
            document.documentElement.style.overflowY = 'hidden';
            $('.privacy-bg-1').css('display', 'none')
        })
    }*/

	/**
	 * app点击埋点
	 * @returns
	 */
	function appClickCollectorLog($this){
		var appname = $this.attr('appname');
		var storeAppid = $this.attr('store-appid');
		var id = "appclicks";
		var mid = "SaaSdesktop";
		var oid = storeAppid;
		var ext = {
			"appName":	appname,
			"appId":storeAppid,
			"schoolId":$("#GLOBAL_CURRENT_SCHOOL_ID").val(),
			"userId":$("#GLOBAL_CURRENT_USER_ID").val()
		};
		
		
		/**
		 * 埋点方法
		 * IFlyCollector .onEvent(id,udmap,mid,oid,ext)
		 * id为自定义的事件id，不可为空
		 * udmap为自定义事件详细信息,json类型
		 * mid为模块id、非必填
		 * oid为行为对象id，例如下载电子书时，电子书的id可以填入到这个字段、非必填
		 * ext为扩展信息，json格式、非必填
		 */
		if(window.IFlyCollector){
			//之前的埋点
			IFlyCollector.onEvent(id,null,mid,oid,ext);
		}
		if (window.jyyun_analysis) {
			jyyun_analysis({
				eventId: "10011002",
				platformNo: $("#GLOBAL_CURRENT_PLATFORM_ID").val(),
				appId: storeAppid,
				moduleId: "1001",
				userId: $("#GLOBAL_CURRENT_USER_ID").val(),
				isDebug: window.IFLY_COLLECTOR_CONFIG && window.IFLY_COLLECTOR_CONFIG.debug
			});
		}

	}

	function postLoginActMenu (url, appname, storeAppid) {
		$.post(CONTEXT_PATH+'/backend/indexPage/v8/addLoginActMenu.do', {
			url: url,
			description: appname,
			appId: storeAppid
		})
	}
	
	// 跳转商店监听
	$('.et-main-center').on('click', '.et-moudel-add',  function () {
		var $this = $(this);
		var url =  $this.attr('data-url');
		if (url) {
			window.open(url);
		}
	});

	// 拖拽
	function initSortable (el) {
		var drake = dragula([el], {
			moves: function (el, source) {
				var isItem = $(el).hasClass('et-item-moudel');
				return isItem;
			},
			accepts: function (el, target, source, siblings) {
				return !!siblings; // 不能放到最后，因为后面的加号
			}
		});
		drake.on('drop', function (el,source) {
			var $el = $(el);
			var folderid = $el.attr('folderid'); // 系统应用没有folderid属性。
			var alEl = $el.parent().find('.et-item-moudel:not(.et-item-moudel-hide)');
			var appids = []
			if (!folderid) { // 没有folderid表示系统应用。
				$.each(alEl, function (e, item) {
					var appid = $(item).attr('store-appid');
					appids.push(appid);
				})
				$.post(CONTEXT_PATH+'/backend/desktop/save/sys-app-configs.do', {
					sysAppSortIds: appids
				}, function () {
					updateStaticHtml();
				})
			}
			else {
				$.each(alEl, function (e, item) {
					var appid = $(item).attr('appid');
					appids.push(appid);
				})

				$.post(CONTEXT_PATH+'/backend/desktop/save/app-sort.do', {
					folderId: folderid,
					desktopAppIds: appids
				}, function () {
					updateStaticHtml();
				})
			}
		})
	}

	var $systemEls = $('.et-group-content');
	Array.prototype.map.call($systemEls, function (el) {
		initSortable(el);
	})


	//实现对前端字符串进行GET编码的函数
	function appEncodeURL(s) {
		var reg = /^[\u0391-\uFFE5%]+$/;
		var urlLength = s.length;
		var newS = "";
		for (var i = 0; i < urlLength; i++) {
			if (reg.test(s.charAt(i))) {
				newS += escape(s.charAt(i));
			} else {
				newS += s.charAt(i);
			}
		}
		if (newS.indexOf('_app_encoding_tag_=') == -1) {
			if (newS.indexOf('?') >= 0) {
				newS = newS + '&_app_encoding_tag_=1';
			} else {
				newS = newS + '?_app_encoding_tag_=1';
			}
		}
		return encodeURI(newS);
	}
	
	// 登录检测
	var currentUserIdObj = document.getElementById('GLOBAL_CURRENT_USER_ID');
	function checkCurrentIsValid() {
		if(currentUserIdObj) {
			var location = window.location.protocol + '//' + window.location.host;
			$.post('/aq/usermanage/getCurrUserId.do', function (userIdInCookie) {
				var curPageUserId = currentUserIdObj.value;
				userIdInCookie = $.trim(userIdInCookie);
				if(!curPageUserId || curPageUserId == '100001') {
					//匿名用户不检测
					return;
				}
				if(curPageUserId != userIdInCookie) {
					if (userIdInCookie && userIdInCookie != '100001') {						
						var index = layer.alert('您已切换到其他用户，当前页面已经失效！', {
							closeBtn: 0,
							btn: ['跳转到主界面']
						}, function () {
							layer.close(index);
							window.location.href = location;
						});
					}
					else {
						var index1 = layer.alert('您已经退出系统，当前页面已经失效！', {
							closeBtn: 0,
							btn: ['我要登录']
						}, function () {
							layer.close(index1);
							window.location.href = location;
						});
					}
				}
			})
		}
	}

	// 通过导航条配置信息，获取应用信息
	function getNavBarConfig () {
		checkAppMsgNum();
		var t = setInterval(checkAppMsgNum, 40 * 1000); // 默认轮训
		$.get(CONTEXT_PATH+'/backend/api/portal/navbar.do?t=' + new Date().getTime(), function (data) {
			// 如果开启了服务端推送，则通过服务端推送获取。
			if (data['msgpush.service.url']) {
				//服务器主动推
				receiveServerMessagePush(data['msgpush.service.url'], data.user.id);
				clearInterval(t);
			}
		})
	}
	// getNavBarConfig();

	function receiveServerMessagePush(msgpushUrl, userId) {
		if (typeof io === 'undefined') {
			//没有加载socket.io这个js
			$.getScript("/cloud-static/thirdparty/socket.io/socket.io.js", function () {
				listenServerPushMessage(msgpushUrl, userId);
			});
		} else {
			listenServerPushMessage(msgpushUrl, userId);
		}
	}

	function listenServerPushMessage(msgpushUrl, userId) {
		var socket = io(msgpushUrl);
		socket.emit('login', {
			module: "nav_unread",
			userId: userId
		});
		socket.on('nav_unread_refresh', function (data) {
			//刷新桌面消息
			if (typeof console !== 'undefined') console.log('刷新APP应用未读更新');
			checkAppMsgNum();
		});
	}
	// 应用消息数量检查
	function checkAppMsgNum () {
		$.get('/aq/main/initDeskMsgs.do?t=' + new Date().getTime(), function (data) {
			if (typeof data === 'string') {
				try {
					data = eval('(' + $.trim(data) + ')');
				} catch (err) {
					return false;
				}
			}

			if (data && data instanceof Array) {
				data.map(function (msg) {
					var count = Number(msg.count)
					if (count > 99) {
						count = '<span style="transform: scale(0.8);display: block;">99+</span>'
					}
					if (count) {
						$('.et-item-moudel[store-appid="' + msg.id + '"]').append('<i class="app-msg-num">' + count + '</i>')
					}
				})
			}
		})
	}
	//40秒钟检测一次
	/*checkCurrentIsValid();
	setInterval(function(){
		checkCurrentIsValid();
	}, 40000);*/
});
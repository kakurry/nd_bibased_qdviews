/*!
 * IFA开发平台核心JavaScript库 
 * Dependencies jQuery.js
 * version 1.0
 * Copyright 2011, Terry Lee
 * Date: 2011/1/17
 */
(function(){
	//判断是否引入jQuery
    if (typeof jQuery === 'undefined') {
        alert('Dependencies jQuery.js');
        return;
    }
    if (typeof window.ifa === 'undefined') {
		window.ifa = {
			//上下文路径
			contextPath: window.contextPath ? window.contextPath : '',
			
			// 调试状态
			debug: false,
			
			// 主题
			theme: this.theme || 'ifa',
			
			// 国际化
			local: this.local || 'zh_CN',
			
			// 国际化的内容存放
			localText: this.localText || {},
			
			text: function(key){
				return this.localText[key] || '';
			},
			
			// 已经加载的依赖库，防止多个组件依赖同一个库文件时的反复加载
			imported: {},
			
			// 引入JS文件
			importJS: function(jsFileName){
				var script = document.createElement('script');
				script.src = (_.contextPath ? (_.contextPath + '/') : '') + jsFileName;//服务器端的url contextPath||'' 为systemParam.jsp中定义的
				document.getElementsByTagName('head')[0].appendChild(script);
			},
			
			//引入CSS文件
			importCSS: function(cssFileName){
				var css = document.createElement('link');
				css.href = (_.contextPath ? (_.contextPath + '/') : '') + cssFileName//服务器端的url contextPath 为systemParam.jsp中定义的
				css.rel = 'stylesheet';
				document.getElementsByTagName('head')[0].appendChild(css);
			},
			
			//页面加载的事件回调
			onLoad: function(fn){
				jQuery(fn);
			},
			
			// 表示加载核心组件
			core: {}
		
		};
	}
})();
/*!
 * IFA开发平台基本库
 * Dependencies jQuery.js , ifa.core.js
 * version 1.0
 * Copyright 2011, Terry Lee
 * Date: 2011/1/17
 */
(function ($){
	  window._checkLeave=function (){
  		var e = window.event?window.event:_checkLeave.caller.arguments[0];
  		if($(body).data("_changed")=="1"){
  	   		e.returnValue=ifa.localText.unsaveddata;
  	  	}
  	  }
		//IE 6 不缓存背景图片BUG
	  	if(navigator.userAgent.toLowerCase().indexOf("msie 6")!=-1){
	  		try{
				document.execCommand("BackgroundImageCache", false, true);
	  		}catch(e){}
		}
		//所有ajax请求设置不缓存
		$.ajaxSetup({
		  cache: false
		});
		  	
	  	//页面加载 _changed=0
		$(body).data("_changed","0");
			
		//$(document).ajaxStart($.blockUI).ajaxStop($.unblockUI);
			
			
		//如果有需要保存的数据，不能ajax请求
		/*$(document.body).ajaxSend(function(evt, request, settings){
			if($(document.body).data("_changed")=="1"){
				$.unblockUI();
	  	   		alert(toft.localText.unsaveddata);
	  	   		//request.abort();
	  	   		return false;// jquery will abort the request if return false;
	  	  	}
		}); */
		//ajax报错提示
		/*$(document.body).ajaxError(function(event,xhr, settings){
	  		alert(toft.localText.ajaxerror);
		});*/ 

		//IE BUG  javascript:void(0)会触发window.onbeforeunload事件
		/*if(document.all){
			$("a[href='javascript:void(0)']").live("click",function (e){
				e.preventDefault();
			});
		}*/
})(jQuery);
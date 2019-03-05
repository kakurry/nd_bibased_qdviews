/*!
 * IFA开发平台工具库
 * Dependencies jQuery.js , ifa.core.js
 * version 1.0
 * Copyright 2011, Terry Lee
 * Date: 2011/1/17
 */
(function($){
    var _ = ifa;
	
	 /**
     * 删除前后空格
     * @param {string} str
     */
    _.trim = function(str){
        return $.trim(str);
    };
    /**
     * 事件的绑定
     * @param {Element|String} src页面的元素或id
     * @param {string} event 事件名
     * @param {function} listener 回调函数,this为事件源，会传入一个事件对象为参数，如果不传就是出发该元素的事件
     */
    _.event = function(src, event, listener){
        var eventSrc = _.getElement(src);
        
        if (eventSrc) {
        	if(listener){
        		$(eventSrc).bind(event.replace('on', ''), listener);
        	}else{
        		$(eventSrc).trigger(event.replace('on', ''));
        	}
        }
    };
    /**
     * 解除对事件的绑定
     * @param {Element|String} src页面的元素或id
     * @param {string} event 事件名
     * @param {function} listener 回调函数,this为事件源，
     */
    _.unbind = function(src, event, listener){
        $(_.getElement(src)).unbind(event.replace('on', ''), listener);
    };
    /**
     * 通过id查找对象
     * @param {string} id
     */
    _.id = function(id){
        return document.getElementById(id);
    };
    /**
     * 通过name查找对象
     * @param {string} name
     */
    _.name = function(name){
        return document.getElementsByName(name);
    };
    /**
     * 通过标签查找对象
     * @param {string} tag
     */
    _.tag = function(tag){
        return document.getElementsByTagName(tag);
    }
    /**
     * 建立新的页面元素
     * @param {string} tag 标签
     * @param {Element} parent 可选，创建的元素加入该元素末尾
     */
    _.create = function(tag, parent){
        var element = document.createElement(tag);
        if (parent) 
            parent.appendChild(element);
        return element;
    };
    
    /**
     * 简单的在下方模拟控制台，输出调试信息，替代alert，不要再页面加载时使用，应在页面加载完毕后使用
     * @param {string} str
     */
    _.console = function(str){
        if (!_.debug) 
            return;
        var console = _.id('ifa.console');
        if (!console) 
            console = _.create('div', _.tag('body')[0]);
        console.style['position'] = 'absolute';
        console.id = 'ifa.console';
        console.style['bottom'] = '0px';
        console.style['left'] = '20px';
        console.style['color'] = 'red';
        console.innerHTML += str + '<br>';
    };
    /**
     * 简单的序列化将object转换为string
     */
    _.serialize = function(obj){
        var str = ['{'];
        if (typeof obj === 'object') {
            for (e in obj) {
                if (obj.hasOwnProperty(e)) {
                    str.push('"');
                    str.push(e);
                    str.push('":"');
                    str.push(obj[e] || '');
                    str.push('"');
                    str.push(',');
                }
            }
            if (str.length > 1) 
                str.pop();
        }
        str.push('}');
        return str.join('');
    }
    
    _.isTrue = function(value){
        return (value == true || value == "1" || value == 1 ||
        value == "true" ||
        value == "yes" ||
        value == "y" ||
        value == "TRUE" ||
        value == "YES" ||
        value == "Y");
    };
    /**
     * 如果传入的是string则当做id查找元素否则返回自己，
     * 给其他的函数使用
     * @param {Object} element
     */
    _.getElement = function(element){
        return typeof element === 'string' ? _.id(element) : element;
    };
    /**
     * 禁/启用一个页面元素，通常是form中的输入元素
     * input和textarea会设置其readonly，其他的会设置其disabled
     * 如果是select的话使其disabled会造成无法向服务器端传值
     * @param {Object|string} element或者其id
     */
    _.setAccessable = function(element, isFreeze){
        element = _.getElement(element);
        if (element.type == "text" || element.type == "textarea") {
            element.readOnly = isFreeze;
        }
        else {
            element.disabled = isFreeze;
        }
        $(element).toggleClass('ReadOnlyTxt');
        //element.className = isFreeze ? "ReadOnlyTxt" : "";
    };
    /**
     * 冻结一个页面元素，使其不可用
     * @param {Object|string} element 页面组件或者组id
     */
    _.freeze = function(element){
        _.setAccessable(_.getElement(element), true);
    };
    /**
     * 解冻一个页面元素，使其可用
     * @param {Object|string} element 页面组件或者组id
     */
    _.unfreeze = function(element){
        _.setAccessable(_.getElement(element), false);
    };
    /**
     * 判断一个对象是否存在，应该是不为undefined且不为null
     * @param {Object} obj
     */
    _.exist = function(obj){
        return typeof obj !== 'undefined' && obj !== null
    };
    window.ifaLockFlag = false;//表示当前页面是都被锁定
    _.mousedownBlock = function(e){
        alert(_.text('sysProcessing'));//i18n,必须是alert，否则有可能不停止其他事件响应
        return false;
    };
    _.keydownBlock = function(){
        return false;
    };
    _.lockPage = function(){
        //_.event(document.body, "onmousedown", _.mousedownBlock);
        //_.event(document.body, "onkeydown", _.keydownBlock);
        $.blockUI({message:(arguments.length==1?arguments[0]:ifa.localText["processing"])});
        window.ifaLockFlag = true;
    };
    
    _.unlockPage = function(){
        //_.unbind(document.body, "onmousedown", _.mousedownBlock);
        //_.unbind(document.body, "onkeydown", _.keydownBlock);
        $.unblockUI();
        window.ifaLockFlag = false;
    };
    _.ajax = function(options){
        $.ajax({
            url: options.url,
            data: options.data,
            dataType: "json",
            type: 'POST',
            success: function(result){
                if (result.hasError) {
                    _.unlockPage();
                    alert(result.errorMsg);//提示错误消息，自动关闭
                    return;
                }
                options.success(result.result);
            },
            error: function(request, textStatus){
                _.unlockPage();
                alert(request.responseText);
            }
        });
        //ajaxStart会blockUI 。所以lockPage方法在ajax方法后调用
        _.lockPage(options.loading?options.loading:ifa.localText["processing"]);
    };
    _.serializeForm = function(formid){
        var o = {};
        $("#" + formid + " :input").each(function(){
            var n = $(this).attr("name");
            var v = ifa.getFormValue(n, formid);
            o[n] = v;
        });
        return o;
    };
    _.setChanged = function(flag){
        if (flag == "1") {
            $(document.body).data("_changed", "1");
            $("#needsave").show();
        }
        else {
            $(document.body).data("_changed", "0");
            $("#needsave").hide();
        }
    };
    _.getChanged = function(){
        return $(document.body).data("_changed") || "0";
    };
    _.clone = function(jsonObj){
        var buf;
        if (jsonObj instanceof Array) {
            buf = [];
            var i = jsonObj.length;
            while (i--) {
                buf[i] = ifa.clone(jsonObj[i]);
            }
            return buf;
        }
        else 
            if (jsonObj instanceof Object) {
                buf = {};
                for (var k in jsonObj) {
                    buf[k] = ifa.clone(jsonObj[k]);
                }
                return buf;
            }
            else {
                return jsonObj;
            }
    };
    /**
     * 格式化数字
     * @param {String} number 数字或者字符串
     * @param {Boolean} comma 是否显示小数点左边的逗号 默认是false
     * @param {int} fixed 小数点后面的精度，默认是2
     */
    _.formatNumber = function(number, comma, fixed){
        comma = comma || false;
        fixed = fixed || 2;
        if (null == number || number == "") {
            return "";
        }
        else {
            if (isNaN(number)) {
                return "";
            }
            else {
                number = parseFloat(number).toFixed(fixed).toString();
                var dotIndex = number.lastIndexOf(".");
                var arr = number.split("");
                var resultarr = [];
                for (var i = 0; i <= arr.length; i++) {
                    resultarr.push(arr[i]);
                    if (dotIndex > (i + 1) && (dotIndex - i) % 3 == 1) 
                    	if(comma){
                    		resultarr.push(",");
                    	}
                }
                return resultarr.join("");
            }
        }
    };
    _.initMoneyInput=function(inputId,comma,fixed){
    	document.getElementById(inputId).setAttribute("rel", "MoneyInput");
    	ifa.event(inputId,"blur",function (e){
  			this.value= ifa.formatNumber(this.value,true,2);
  			var previousValue= document.getElementById(inputId).getAttribute("previousValue")||"0";
  			if(previousValue!=this.value){
  				$(this).change();
  				ifa.setChanged("1");
  			}
  		});
		ifa.event(inputId,"focus",function (e){
			document.getElementById(inputId).setAttribute("previousValue",document.getElementById(inputId).value);
			document.getElementById(inputId).value= document.getElementById(inputId).value.replace(/\,/gi,"");
  		});
  		$("#"+inputId).parents("form").bind("submit",function (){
	  		document.getElementById(inputId).value= document.getElementById(inputId).value.replace(/\,/gi,"");
	  	}).bind("beforesave",function (){
			document.getElementById(inputId).value= document.getElementById(inputId).value.replace(/\,/gi,"");
		});
		$("#"+inputId).attr("numberformat",comma+","+fixed);//在inputId上做一个记号
    };
    /**
     * 获取自定义控件
     * @param {String} paramId 控件ID
     */
    _.getComp = function(paramId){
        return window._c ? window._c[paramId] : null;
    };
    
    /**
     * 表单赋值
     * @param {String} name  表单name
     * @param {String/Array} v  值如果是复选框，此值可以为字符串数组,其他为字符串
     * @param {String} [非必须] 指定form的id
     */
    _.setFormValue = function(name, v, formId){
        if (formId) {
            var $input = $("#" + formId + " :input[name=" + name + "][type!='radio'][type!='checkbox']");
            $input.val(v);
            if($input.attr("numberformat")){
            	var f = $input.attr("numberformat").split(",");
            	$input.val(ifa.formatNumber(v,f[0],f[1]));
            }
            $("#" + formId + " :checkbox[name=" + name + "]").attr("checked", false).filter("[value=" + v + "]").attr("checked", true);
            if (v && v.push) {// array checkbox
                $.each(v, function(i, o){
                    $("#" + formId + " :checkbox[name=" + name + "][value=" + o + "]").attr("checked", true);
                });
            }
            $("#" + formId + " :radio[name=" + name + "][value=" + v + "]").attr("checked", true);
        }
        else {
            var $input= $(":input[name=" + name + "][type!='radio'][type!='checkbox']").val(v);
            if($input.attr("numberformat")){
            	
            	var f = $input.attr("numberformat").split(",");
            	$input.val(ifa.formatNumber($input.val(),f[0],f[1]));
            }
            $(":checkbox[name=" + name + "]").attr("checked", false).filter("[value=" + v + "]").attr("checked", true);
            if (v && v.push) {// array checkbox
                $.each(v, function(i, o){
                    $(":checkbox[name=" + name + "][value=" + o + "]").attr("checked", true);
                });
            }
            $(":radio[name=" + name + "][value=" + v + "]").attr("checked", true);
        }
        
    };
    /**
     * 获取表单属性
     * @param {String}  name 表单name
     * @param {String} formId  [非必须]指定form ID
     */
    _.getFormValue = function(name, formId){
        if (formId) {
            var v = $("#" + formId + " :input:not(:checkbox):not(:radio)[name=" + name + "]").val();
            if (v) {
                return v;
            }
            else {
                v = $("#" + formId + " :radio[name=" + name + "][checked]").val();
                if (v) {
                    return v;
                }
                else {
                    var result = [];
                    $("#" + formId + " :checkbox[name=" + name + "][checked]").each(function(){
                        result.push(this.value);
                    });
                    return result.join(",");
                }
            }
        }
        else {
            var v = $(":input:not(:checkbox):not(:radio)[name=" + name + "]").val();
            if (v) {
                return v;
            }
            else {
                v = $(":radio[name=" + name + "][checked]").val();
                if (v) {
                    return v;
                }
                else {
                    var result = [];
                    $(":checkbox[name=" + name + "][checked]").each(function(){
                        result.push(this.value);
                    });
                    return result.join(",");
                }
            }
        }
    };
    /**
     * 表单重置
     */
    _.resetForm = function(formid){
        $("#" + formid + " :input[type!='radio'][type!='checkbox']:not(.sysBtn)").val("");
    };
    
    /**
     *	表单加载数据
     *	@ formid 表单ID
     *	@ data  表单数据 
     */
    _.loadFormData= function (formid,data){
    	for (var f in data){
			ifa.setFormValue(f,data[f],formid);
		}
    };
    
    if(typeof(JSON.stringify)=='function'){
    	_.stringify= JSON.stringify;
    }
    
    _.commonExit=function (url){
    	if (url == null || typeof(url) == "undefined"){
    		 url = ifa.contextPath+"/desk.do";
		}
		if (window.name == "main"){
		    window.location.href = ifa.contextPath + url;
		}else{ //弹出式
		    window.close();
		}
    }
})(jQuery);

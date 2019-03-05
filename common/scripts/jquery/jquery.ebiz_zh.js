(function($) {
	var context = getContextPath();
	$(document).ajaxError(function(e, xhr) {
		if(xhr.status == 403)
			top.location.href = context + "/login";
	});
	var oldAttachDatepicker = $.datepicker._attachDatepicker;
	$.datepicker._attachDatepicker = function(target, settings) {
		oldAttachDatepicker.call($.datepicker, target, settings);
		var inst = $.datepicker._getInst(target);
		if($.datepicker._get(inst, 'readOnly'))
			target.readOnly = true;
	};
	var defaultTitle = "系统提示";
	$.msg = {
		alert: function(title, content, fn ,options) {
			if(!content) {
				content = title;
				title = defaultTitle;
			}
			if($.isFunction(content)) {
				options = fn;
				fn = content;
				content = title;
				title = defaultTitle;
			}
			if(!$.isFunction(fn)) {
				options = fn;
				fn = null;
			}
			var msg;
			if(content instanceof jQuery) {
				msg = content;
			} else {
				msg = $('<div/>').bgiframe().html(content.toString());
			}
			var defaults = {
					title: title,
					modal: true,
					resizable: false,
					closeOnEscape: true,
					buttons: {
						'确定': function() {
							$(this).dialog("close"); 
						}
					},
					close: function() {
						if(fn) fn();
					}
				};
			$.extend(defaults, options);
			msg.dialog(defaults);
		},
		confirm: function(title,content,fn,options) {
			if(!content) {
				content = title;
				title = defaultTitle;
			}
			if($.isFunction(content)) {
				fn = content;
				content = title;
				title = defaultTitle;
			}
			var msg;
			if(content instanceof jQuery) {
				msg = content;
			} else {
				msg = $('<div/>').bgiframe().html(content.toString());
			}
			var result;
			var a = {
					title: title,
					resizable: false,
					modal: true,
					closeOnEscape: true,
					buttons: {'取消': function() {
						result = false;
						$(this).dialog("close");
					},
					'确定': function() {
						result = true;						
						$(this).dialog("close"); 
					}},
					close: function() {
						if(fn) fn(result);
					}
				};
			$.extend(a, options);
			msg.dialog(a);
		}
	};
	$.datepicker.regional['zh-CN'] = {
		closeText: '关闭',
		prevText: '&#x3c;上月',
		nextText: '下月&#x3e;',
		currentText: '今天',
		monthNames: ['一月','二月','三月','四月','五月','六月',
		'七月','八月','九月','十月','十一月','十二月'],
		monthNamesShort: ['一月','二月','三月','四月','五月','六月',
		          		'七月','八月','九月','十月','十一月','十二月'],
		dayNames: ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'],
		dayNamesShort: ['周日','周一','周二','周三','周四','周五','周六'],
		dayNamesMin: ['日','一','二','三','四','五','六'],
		weekHeader: '周',
		dateFormat: 'yy-mm-dd',
		firstDay: 1,
		isRTL: false,
		showMonthAfterYear: true,
		buttonImageOnly: true,
		showMonthAfterYear: true, // 月在年之后显示
		changeMonth:true,// 允许选择月份   
		changeYear:true,// 允许选择年份   
		dateFormat:'yy-mm-dd', // 设置日期格式   
		showOn: 'both', // 在输入框旁边显示按钮触发，默认为：focus。还可以设置为both   
		buttonImage: contextPath + '/common/images/calendar.gif',
		buttonImageOnly: true, // 不把图标显示在按钮上，即去掉按钮   
		showOtherMonths: true,
		readOnly : true ,
		yearRange: 'c-70:c+10',
		yearSuffix: '年'
	};
	$.datepicker.setDefaults($.datepicker.regional['zh-CN']);
	

    $.format = (function () {
        function parseMonth(value) {
            switch (value) {
            case "Jan":
                return "01";
            case "Feb":
                return "02";
            case "Mar":
                return "03";
            case "Apr":
                return "04";
            case "May":
                return "05";
            case "Jun":
                return "06";
            case "Jul":
                return "07";
            case "Aug":
                return "08";
            case "Sep":
                return "09";
            case "Oct":
                return "10";
            case "Nov":
                return "11";
            case "Dec":
                return "12";
            default:
                return value;
            }
        };
        
        function parseTime(value) {
            var retValue = value;
            if (retValue.indexOf(".") !== -1) {
                retValue = retValue.substring(0, retValue.indexOf("."));
            }
            
            var values3 = retValue.split(":");
            
            if (values3.length === 3) {
                hour = values3[0];
                minute = values3[1];
                second = values3[2];
                if(second.length > 2)
                	second = second.substring(0, 2);
                return {
                        time: retValue,
                        hour: hour,
                        minute: minute,
                        second: second
                    };
            } else {
                return {
                    time: "",
                    hour: "",
                    minute: "",
                    second: ""
                };
            }
        };

        function date(value, format) {
            //value = new java.util.Date()
            //2009-12-18 10:54:50.546
            try {
                var year = null;
                var month = null;
                var dayOfMonth = null;
                var time = null; //json, time, hour, minute, second
                if (typeof value.getFullYear === "function") {
                    year = value.getFullYear();
                    month = value.getMonth() + 1;
                    dayOfMonth = value.getDate();
                    time = parseTime(value.toTimeString());
                } else {
                    var values = value.split(" ");
                    
                    switch (values.length) {
                    case 6://Wed Jan 13 10:43:41 CET 2010
                        year = values[5];
                        month = parseMonth(values[1]);
                        dayOfMonth = values[2];
                        time = parseTime(values[3]);
                        break;
                    case 2://2009-12-18 10:54:50.546
                        var values2 = values[0].split("-");
                        year = values2[0];
                        month = values2[1];
                        dayOfMonth = values2[2];
                        time = parseTime(values[1]);
                        break;
                    default:
                        return value;
                    }
                }
                
                var pattern = "";
                var retValue = "";
                
                for (i = 0; i < format.length; i++) {
                    var currentPattern = format.charAt(i);
                    pattern += currentPattern;
                    switch (pattern) {
                    case "dd":
                        retValue += ((dayOfMonth<10?"0":"") + dayOfMonth);
                        pattern = "";
                        break;
                    case "MM":
                        retValue += ((month<10?"0":"") + month);
                        pattern = "";
                        break;
                    case "yyyy":
                        retValue += year;
                        pattern = "";
                        break;
                    case "HH":
                        retValue += time.hour;
                        pattern = "";
                        break;
                    case "hh":
                        retValue += (time.hour === 0 ? 12 : time.hour < 13 ? time.hour : time.hour - 12);
                        pattern = "";
                        break;
                    case "mm":
                        retValue += time.minute;
                        pattern = "";
                        break;
                    case "ss":
                        retValue += time.second;
                        pattern = "";
                        break;
                    case "a":
                        retValue += time.hour > 12 ? "PM" : "AM";
                        pattern = "";
                        break;
                    case " ":
                        retValue += currentPattern;
                        pattern = "";
                        break;
                    case "/":
                        retValue += currentPattern;
                        pattern = "";
                        break;
                    case ":":
                        retValue += currentPattern;
                        pattern = "";
                        break;
                    default:
                        if (pattern.length === 2 && pattern.indexOf("y") !== 0) {
                            retValue += pattern.substring(0, 1);
                            pattern = pattern.substring(1, 2);
                        } else if ((pattern.length === 3 && pattern.indexOf("yyy") === -1)) {
                            pattern = "";
                        }
                    }
                }
                return retValue;
            } catch (e) {
                console.log(e);
                return value;
            }
        }
        
        return {
        	date: date,
            formatDate: function(value) {
            	return date(value, 'yyyy-MM-dd');
            },
	        formatTime: function(value) {
            	return date(value, 'yyyy-MM-dd HH:mm:ss');
            }
        };
    }());
    
    $.extend($.validator.defaults, {
    	focusClass: 'focusClass',
		onfocusin: function(element) {
    		var errorClass = this.settings.errorClass;
    		this.settings.errorClass = this.settings.focusClass + " " + this.settings.errorClass;
			if ( !this.checkable(element) && (element.name in this.submitted || !this.optional(element)) ) {
				this.element(element);
			}
			this.settings.errorClass = errorClass;
			$(element).parents(".form").addClass("focus");
		},
		onfocusout: function(element) {
			if ( !this.checkable(element) && (element.name in this.submitted || !this.optional(element)) ) {
				this.element(element);
			}
			$(element).parents(".form").removeClass("focus");
		},
		errorClass: 'errorClass',
		success: function(label) {
			var input = $("[name=" + label.attr("for") + "]");
			if($.trim(input.val()) == "")
				label.addClass("hideClass");
			else
				label.addClass("validClass");
		},
		highlight: false
    });
    $.validator.prototype.optional = function() {
    	return false;
    };
    $.validator.prototype.errors = function() {
		return $( this.settings.errorElement, this.errorContext );
	};
	$.extend($.validator.methods, {
		regex: function(value, element, param) {
			return param.test(value);
		}
	});
	$.extend($.validator.messages, {
		regex: '格式错误'
	});

	$.del = function( url, data, callback, type ) {
		if ( $.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = {};
		}
		data['_method'] = 'DELETE';
		return $.ajax({
			type: "POST",
			url: url,
			data: data,
			traditional: true,
			success: callback,
			dataType: type
		});
	};
	$.put = function( url, data, callback, type ) {
		if ( $.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = {};
		}
		data['_method'] = 'PUT';
		return $.ajax({
			type: "POST",
			url: url,
			data: data,
			traditional: true,
			success: callback,
			dataType: type
		});
	};
	$.post = function( url, data, callback, type ) {
		// shift arguments if data argument was omited
		if ( $.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = {};
		}

		return $.ajax({
			type: "POST",
			url: url,
			data: data,
			traditional: true,
			success: callback,
			dataType: type
		});
	};
	$.get = function( url, data, callback, type ) {
		// shift arguments if data argument was omited
		if ( $.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = {};
		}

		return $.ajax({
			type: "GET",
			url: url,
			data: data,
			traditional: true,
			success: callback,
			dataType: type
		});
	};
})(jQuery);

function getContextPath() {
    var pathName = document.location.pathname;
    var index = pathName.substr(1).indexOf("/");
    var result = pathName.substr(0,index+1);
    if(result != "/ipmall"){
    	return "";
    }else{
    	return result;
    }
}
;(function($) {
	/*var ajax=$.ajax;
	 $.ajax=function(s){
		 var oldError = s.error;
		 s.error=function(xhr,status,err){
		   var xhrStatus = xhr.status;
		   if(xhrStatus>=300 && xhrStatus < 304){
        		//location.href="";//TODO跳转至登录页面
        		alert('error');
		   }
		   if(oldError){
			   oldError(xhr,status,err);
		   }
		 };
       if(s.success){
	        var oldSuccess=s.success;
	        s.success=function(response,success,xhr){
	        	oldSuccess(response,success,xhr);
	        };
       }
       ajax(s);
   };
   */
	$.validator.methods.remote = function(value, element, param) {
		if ( this.optional(element) )
			return "dependency-mismatch";
		
		var previous = this.previousValue(element);
		if (!this.settings.messages[element.name] )
			this.settings.messages[element.name] = {};
		previous.originalMessage = this.settings.messages[element.name].remote;
		this.settings.messages[element.name].remote = previous.message;
		
		param = typeof param == "string" && {url:param} || param; 
		
		if ( previous.old !== value ) {
			previous.old = value;
			var validator = this;
			this.startRequest(element);
			var data = {};
			data[element.name] = value;
			$.ajax($.extend(true, {
				url: param,
				mode: "abort",
				port: "validate" + element.name,
				dataType: "json",
				data: data,
				type: 'post',
				success: function(response) {
					validator.settings.messages[element.name].remote = previous.originalMessage;
					var valid = response === true;
					if ( valid ) {
						var submitted = validator.formSubmitted;
						validator.prepareElement(element);
						validator.formSubmitted = submitted;
						validator.successList.push(element);
						validator.showErrors();
					} else {
						var errors = {};
						var message = (previous.message = response || validator.defaultMessage( element, "remote" ));
						errors[element.name] = $.isFunction(message) ? message(value) : message;
						validator.showErrors(errors);
					}
					previous.valid = valid;
					validator.stopRequest(element, valid);
				}
			}, param));
			return "pending";
		} else if( this.pending[element.name] ) {
			return "pending";
		}
		return previous.valid;
	};
	/**
	$(document).ajaxError(function(e, xhr) {
		switch (xhr.status) {
		case '403':
			top.location.href = contextPath + "/error/403";
			break;
		case '404':
			top.location.href = contextPath + "/error/404";
			break;
		case '500':
			top.location.href = contextPath + "/error/500";
			break;
		default:
			top.location.href = contextPath + "/error/500";
			break;
		}
	});
	**/
	
	$.CKEDITOR = function(content) {
		if(CKEDITOR.instances['content']) {
			CKEDITOR.remove(CKEDITOR.instances['content']);
		}
		contentCkEditor = CKEDITOR.replace( 'content' );
		};
	
	
	$.close = function(data, id) {
		data = data || {};
		var ids = $('body').data('ids');
		id = id || ids[ids.length - 1];
		ids.pop();
		$('body').data('ids', ids);
		var window = $('body').data('window');
		var box = window[id];
		var config = box.data('config');
		box.dialog('option', {
			close: function() {
				if(config.success) {
					config.success(data);
				}
				box.remove();
			}
		});
		box.dialog('close');
	};
	$.open = function(config,fn) {
		var defaultConfig = {
			title: '',
			modal: true,
			width: 600
		};
		config.url = contextPath + config.url;
		config = $.extend({}, defaultConfig, config);
		config.id = config.id || ('_dialog' + new Date().getTime());
		var box = $('<div />').hide().appendTo($('body'));
		box.data('config', config);
		var ids = $('body').data('ids') || [];
		ids[ids.length] = config.id;
		$('body').data('ids', ids);
		var window = $('body').data('window') || {};
		window[config.id] = box;
		$('body').data('window', window);
		box.load(config.url, function() {
			if(config.prepare)
				config.prepare(box);
			box.dialog({
				title: config.title,
				modal: config.modal,
				width: config.width,
				height: config.height,
				close: function() {
					var ids = $('body').data('ids');
					ids.pop();
					$('body').data('ids', ids);
					if(fn) fn();
					box.remove();
				}
			});
		});
	};
	var oldAttachDatepicker = $.datepicker._attachDatepicker;
	$.datepicker._attachDatepicker = function(target, settings) {
		oldAttachDatepicker.call($.datepicker, target, settings);
		var inst = $.datepicker._getInst(target);
		if($.datepicker._get(inst, 'readOnly'))
			target.readOnly = true;
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
				msg = $('<div />').bgiframe().html(content.toString());
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
						$(this).remove();
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
					buttons: {'确定': function() {
						result = true;						
						$(this).dialog("close"); 
					},'取消': function() {
						result = false;
						$(this).dialog("close");
					}
					},
					close: function() {
						if(fn) fn(result);
					}
				};
			$.extend(a, options);
			msg.dialog(a);
		}
	};
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
    

	$.del = function( url, data, callback, type ) {
		if ( $.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = {};
		}
		data['_method'] = 'DELETE';
		return $.ajax({
			type: 'POST',
			url: url + '.json',
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
			type: 'POST',
			url: url + '.json',
			data: data,
			traditional: true,
			success: callback,
			dataType: type
		});
	};
	$.post = function( url, data, callback, type ,errorCallback) {
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
			error:errorCallback,
			dataType: type
		});
	};
	$.get = function( url, data, callback, type  ,errorCallback) {
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
			error:errorCallback,
			dataType: type
		});
	};
	$.fn.fillForm = function(data, types) {
		types = types || {};
		for(name in data) {
			var value = data[name];
			if(types[name] == 'date')
				value = value && $.format.formatDate(new Date(value)) || '';
			this.find('select[name=' + name + '] option[value=' + value + ']').attr('selected', true);
			this.find(':text[name=' + name + ']').val(value);
			this.find('input[type=hidden][name=' + name + ']').val(value);
			this.find('textarea[name=' + name + ']').html(value);
			this.find(':checkbox[name=' + name + '][value=' + value + ']').attr('checked', true);
		}
	};

    

	 $.fn.ajaxWaiting = function(opts,fn,content,efn) {
			var p = $(this).parent();
			p.data("orgin",this);
			if(!content){content='<input  type="button" class="inputbutton_gray"/>';}
			p.html(content);
			fn = $.isFunction(fn) ? fn : eval(fn);
			opts.success=function(response){
				fn(response);
				p.html(p.data("orgin"));
			};
			if(efn){
				efn = $.isFunction(efn) ? efn : eval(efn);
				opts.error = function(e){
					efn(e);
					p.html(p.data("orgin"));
				};
			};
			$.ajax(opts);
	};
	$.fn.wait = function(time, type) {
        time = time || 1000;
        type = type || "fx";
        return this.queue(type, function() {
            var self = this;
            setTimeout(function() {
                $(self).dequeue();
            }, time);
        });
   };
})(jQuery);

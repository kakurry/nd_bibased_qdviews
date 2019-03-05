(function($) {
	$.restUrl = function(url, params) {
		var tokens = url.match(/{(.*?)}/g);
		$.each(tokens || [], function(i, token) {
			var key = token.substr(1, token.length - 2);
			var value = params[key] || '';
			url = url.replace(token, value);
		});
		return url;
	};
	var defaultConfig = {
		paging: true,
		root: 'data',
		pageSize:10,
		showPageSize:false,
		start:1,
		defaultParams: {}
	};
	$.fn.grid = function(options) {
		if(this.data('delegate') && !options)
			return this.data('delegate');
		var delegate = {
			query: query,
			refresh: refresh,
			setUrl: setUrl,
			setParam:setParam,
			render:render
		};
		this.data('delegate', delegate);
		var renderTo = this;
		var config = {};
		$.extend(config, defaultConfig, options);
		var current = 1;
		var pageSize =  config.pageSize;
		var params = {};
		var records;
		params.start = config.start;
		params.end = config.start+pageSize-1;
		$.extend(params, config.defaultParams);
		render(options.method);
		return delegate;
		function query(ps) {
			$.extend(params, ps);
			refresh(options.method);
		}
		function getData() {
			return records;
		}
		function setParam(key, value) {
			params[key] = value;
		}
		function setUrl(url) {
			config.url = url;
		}
		function refresh(method) {
			//查询操作返回第一页
			if(params.click){
			current = 1;
			}
			params.start = (current - 1) * pageSize + 1;
			params.end = params.start + pageSize - 1;
			render(method);
		}
		function render(method) {
			if(!config.paging)
				params.end = 99999;
			if(method){
				 $.get(contextPath + $.restUrl(config.url, params) + ".json", function(data)
						 {
						var grid = $('<table />').attr({width: '100%', border: '0', cellspacing: '1', cellpadding: '0'}).addClass('uum_table');
						records = data[config.root];
						var head = getHead(config.fields);
						grid.append(head);
						var body = getBody(config.fields, data);
						grid.append(body);
						renderTo.empty();
						renderTo.append(grid);
						var total = data.total;
//						//若当前页不为第一页，且有一条数据时，删除最后一条数据跳回上一页
//						if(body.html()==''&&total!=0){
//							var pageCount = Math.ceil(total / pageSize);
//							current = current > pageCount ? pageCount : current;
//							current = current < 1 ? 1 : current;
//							params.start = (current - 1) * pageSize + 1;
//							params.end = params.start + pageSize - 1;
//							return false;
//						}
						var pagingBar;
						if(config.paging) {
							pagingBar = generatePagingBar(total,method);
							pagingBar.appendTo(renderTo);
						}
						if(config.buttons) {
							var buttonWrap = $('<div />').addClass('uumrow_button');
							var buttonBox=$('<ul />').addClass('uum_button').appendTo(buttonWrap);
							$.each(config.buttons, function(i, button) {
								var linkBox = $('<li />');
								var link = $('<a href="#" />').appendTo(linkBox);
								if(button.action)
									link.click(function() {
										button.action.call(delegate, data);
										return false;
									});
								else
									link.attr('href', button.href);
								link.append($('<span />').html(button.text));
								linkBox.appendTo(buttonBox);
							});
							buttonWrap.prependTo(renderTo);
						}
						if(config.callback){config.callback(data);}
					}, 'json');
			}else{
				$.post(contextPath+config.url + ".json", params, function(data) 
					{
				var grid = $('<table />').attr({width: '100%', border: '0', cellspacing: '1', cellpadding: '0'}).addClass('uum_table');
				records = data[config.root];
				var head = getHead(config.fields);
				grid.append(head);
				var body = getBody(config.fields, data);
				grid.append(body);
				renderTo.empty();
				renderTo.append(grid);
				var total = data.total;
				var pagingBar;
				if(config.paging) {
					pagingBar = generatePagingBar(total,method);
				}
				pagingBar.appendTo(renderTo);
				if(config.buttons) {
					var buttonWrap = $('<div />').addClass('uumrow_button');
					var buttonBox=$('<ul />').addClass('uum_button').appendTo(buttonWrap);
					$.each(config.buttons, function(i, button) {
						var linkBox = $('<li />');
						var link = $('<a href="#" />').appendTo(linkBox);
						if(button.action)
							link.click(function() {
								button.action.call(delegate, data);
								return false;
							});
						else
							link.attr('href', button.href);
						link.append($('<span />').html(button.text));
						linkBox.appendTo(buttonBox);
					});
					buttonWrap.prependTo(renderTo);
				}
				if(config.callback){config.callback(data);}
			}, 'json');
			}
		}
		function gotoPage(method,pageCount) {
			var value = $(".cur_page").val();
				current = parseInt(value) || 1;
				current = current > pageCount ? pageCount : current;
				current = current < 1 ? 1 : current;
				params.start = (current - 1) * pageSize + 1;
				params.end = params.start + pageSize - 1;
			if(method){
				render(method);
			}else{
				render();
			}				
				return false;
			}
		function generatePagingBar(total,method) {
			var pageCount = Math.ceil(total / pageSize);
			var pagingBar = $('<div />').addClass('uum_page');
			var info = '当前第' + current + '页/共' + pageCount + '页 总共记录数' + total + '条';
			pagingBar.append(info);
			if(pageCount > 1) {
				var start = current - 2 < 1 ? 1 : current - 2;
				var end = current + 2 > pageCount ? pageCount : current + 2;
				if(current > 1) {
					createPageLink(1, '首页', pagingBar,method);
					createPageLink(current - 1, '上页', pagingBar,method);
				}
				/*
				for(var i = start;i <= end;i++) {
					if(i != current) {
						createPageLink(i, i, pagingBar,method);
					} else {
						var pageLink = $('<a />').html(i).appendTo(pagingBar).attr('index', i).addClass('focus');
					}
				}
				*/
				if(current < end) {
					createPageLink(current + 1, '下页', pagingBar,method);
					createPageLink(pageCount, '尾页', pagingBar,method);
				}
				var pageInput = $('<input class="cur_page" size="4"/>').val(current).keyup(function(e) {
					if(e.keyCode == 13)
						gotoPage(method,pageCount);
				});
				var pageOk = $('<a href="javascript:void(0)"/>').html('确定').click(function(){
					if (config.showPageSize) {
						pageSize = parseInt($(".page_size").val())||config.pageSize;
						pageSize = pageSize < 1 ? config.pageSize : pageSize;
					}
					gotoPage(method,pageCount);
				});
				pagingBar.append('第').append(pageInput).append('页');
				if(config.showPageSize){
					pagingBar.append(' 每页显示').append($('<input class="page_size" size="4"/>').val(pageSize)).append('条');
				}
				pagingBar.append(pageOk);
			}
			return pagingBar;
		}
		function createPageLink(index, html, pagingBar,method) {
			var pageLink = $('<a />').html(html).appendTo(pagingBar).attr('index', index);
			pageLink.attr('href', '#').click(function() {
				current = parseInt($(this).attr('index'));
				params.start = (current - 1) * pageSize + 1;
				params.end = params.start + pageSize - 1;
				render(method);
				return false;
			});
		}
		function getHead(fields) {
			var thead = $('<thead />');
			var rowHead = $('<tr />').appendTo(thead);
			$.each(fields, function(i, field) {
				var th = $('<th />').appendTo(rowHead);
				if(field.type == 'hidden')
					th.hide();
				if(field.type == 'checkbox') {
					th.append($('<span />').addClass('checkbox').append($('<input />').attr('type', 'checkbox').change(function() {
						thead.parent().find(':checkbox[name=' + field.id + ']').attr('checked', this.checked);
					})));
				} else {
					th.append($('<span />').html(field.name));
				}
				field.title=th;
			});
			return thead;
		}
		function getBody(fields, data) {
			var tbody = $('<tbody />');
			if(config.sortable)
				tbody.sortable();
			$.each(data[config.root], function(i, d) {
				var seq=params.start+i;
				var row = $('<tr />').appendTo(tbody);
				$.each(config.fields, function(i, field) {
					var value = d[field.id];
					var html = value;
					if(field.operation) {
						field.render = function() {
							var box = $('<div />');
							$.each(field.operation, function(i, oper) {
								if((oper.display&&!$.isFunction(oper.display)&&oper.display!='N')||(oper.display&&$.isFunction(oper.display)&&oper.display.call(delegate,d))){
								var link = $('<a href="#" />').attr('class','button_a').append($('<span />').html(oper.text)).click(function() {
									if(oper.confirm) {
										$.msg.confirm(oper.confirm, function(result) {
											if(result) {
												oper.action.call(delegate, d);
											}
										});
									} else {
										oper.action.call(delegate, d);
									}
									return false;
								});
								
								box.append(link);
								}
								
							});
							return box.children();
						};
					}
					if(field.options) {
						var options = field.options;
						field.render = function(data, id, value) {
							return options[value];
						};
					}
					if($.isFunction(field.render)) {
						html = field.render(d, field.id, value);
					}
					if(html==null)
						html="";
					var td = $('<td />').appendTo(row);
					if(field.type == 'number')
						{td.css('text-align', 'right');}
					else{
						td.css('text-align', 'center');	
					}
					if(field.type == 'date') {
						td.css('text-align', 'center');
						html = $.format.formatDate(new Date(html));
						// TODO 增加默认宽度
					}
					if(field.type == 'currency') {
						td.css('text-align', 'right');
						number = html+'';
						numArr = number.split(".");
						number = numArr[0];
						tail = numArr[1];
						if(numArr.length==1){tail='00';}
						if (number.length<= 3)
							html =  (number == '' ? '0' : number+'.'+tail);
						else{
							 var mod = number.length%3;
							 var output = (mod == 0 ? '' : (number.substring(0,mod)));
							 for (i=0 ; i< Math.floor(number.length/3) ; i++)
							 {
							   if ((mod ==0) && (i ==0))
							   output+= number.substring(mod+3*i,mod+3*i+3);
							   else
							   output+= ',' + number.substring(mod+3*i,mod+3*i+3);
							 }
							 html = (output+'.'+tail);
						}
					}
					if(field.type == 'time') {
						td.css('text-align', 'center');
						html = $.format.formatTime(new Date(html));
						field.width = field.width || 115;
					}
					if(field.type == 'checkbox') {
						field.width = field.width || 10;
						td.append($('<input />').attr({type: 'checkbox', name: field.id, value: value}).change(function() {
							var grid = tbody.parent();
							if(!this.checked) {
								grid.find('th :checkbox').attr('checked', false);
							} else {
								var allChecked = true;
								grid.find('td :checkbox').each(function(index, elem) {
									if(!elem.checked)
										allChecked = false;
								});
								if(allChecked)
									grid.find('th :checkbox').attr('checked', true);
							}
						}));
					}else if(field.type == 'radio') {
						//支持radio
						field.width = field.width || 10;
						if(document.uniqueID) {
							var _radio = document.createElement("<input type='radio' name='"+field.id+"' value='"+value+"'>");   
							td.append(_radio);
						}
						else{
						td.append($('<input />').attr({type: 'radio', name: field.id, value: value}));
						}
					} else if(field.type == 'hidden') {
						td.append($('<input />').attr({type: 'hidden', name: field.id, value: value}));
						td.hide();
					} else if(field.type == 'seq') {
						td.append(seq);
					} else {
						if(field.maxlength) {
							var shortHtml = $.abbreviate(html, field.maxlength);
							td.html(shortHtml).attr('title', html);
						} else {
							td.html(html);
						}
					}
					if(field.width)
						td.css('width', field.width + 'px');
					if(field.style) {
						td.css(field.style);
					}
					field.body=td;
				});
			});
			$('#ui-datepicker-div').hide();
			return tbody;
		}
	};
	$.abbreviate = function(str, length) {
		if($.getLength(str) > length) {
			// ... 只占两个字母的位置左右
			return $.substr(str, 0, length - 2) + '...';
		} else {
			return str;
		}
	};
	$.substr = function(str, start, length) {
		var escapeStr = escape(str);
		var n = 0,current = 0,lastCurrent;
		while(n <= length) {
			lastCurrent = current;
			if(escapeStr.charAt(current) == '%') {
				if(escapeStr.charAt(current + 1) == 'u') {
					current += 6;
					n += 2;
				} else {
					current += 3;
					n++;
				}
			} else {
				current++;
				n++;
			}
		}
		return unescape(escapeStr.substring(0, lastCurrent));
	};
	$.getLength = function(str) {
		if(!str)
			return 0;
		var m = escape(str).match(/%u/g);
		return str.length + (m ? m.length : 0);
	};
	$.fn.template = function(data) {
		return this.clone().removeAttr('id').render(data);
	};
})(jQuery);
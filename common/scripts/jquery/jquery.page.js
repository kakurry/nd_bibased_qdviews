(function(){
	if(typeof $.page != "undefined"){
		return;
		//alert(typeof $.page);
	}
})();
;(function($){
	//设置参数
	var defaultParam = {
		pageSize: 10,
		current: 1,
		showPageSize:false,
	};

	$.fn.page = function(seting,method){
		seting = $.extend(defaultParam, seting || {});
		var total = seting.total;
		//var method = seting.method;
		var current = seting.current;   //当前页
		var pageSize = seting.pageSize; //页面大小
		var showPageSize = seting.showPageSize;
		
		generatePagingBar(total, method).appendTo(this);
		
		function generatePagingBar(total,method){
			var pageCount = Math.ceil(total / pageSize);
			var pagingBar = $('<div />').addClass('gift_page');
			var info = '当前第' + current + '页/共' + pageCount + '页 总共记录数' + total + '条';
			pagingBar.append(info);
			
			if(pageCount > 1) {
				var start = current - 2 < 1 ? 1 : current - 2;
				var end = current + 2 > pageCount ? pageCount : current + 2;
				if(current > 1) {
					createPageLink(1, '首页', pagingBar,method);
					createPageLink(current - 1, '上页', pagingBar,method);
				}
				if(current < end) {
					createPageLink(current + 1, '下页', pagingBar,method);
					createPageLink(pageCount, '尾页', pagingBar,method);
				}
				var pageInput = $('<input class="cur_page" size="4"/>').val(current).keyup(function(e) {
					if(e.keyCode == 13)
						gotoPage(method,pageCount);
				});
				var pageOk = $('<a href="javascript:void(0)"/>').html('确定').click(function(){
					if (showPageSize) {
						pageSize = parseInt($(".page_size").val())|| pageSize;
						pageSize = pageSize < 1 ? pageSize : pageSize;
					}
					gotoPage(method,pageCount);
				});
				pagingBar.append('第').append(pageInput).append('页');
				if(showPageSize){
					pagingBar.append(' 每页显示').append($('<input class="page_size" size="4"/>').val(pageSize)).append('条');
				}
				pagingBar.append(pageOk);
			}
			return pagingBar;
		}
		
		function gotoPage(method,pageCount) {
			var value = $(".cur_page").val();
				current = parseInt(value) || 1;
				current = current > pageCount ? pageCount : current;
				current = current < 1 ? 1 : current;
			if(method){
				method.call(this,current);
			}				
			return false;
		}
		
		function createPageLink(index, html, pagingBar,method) {
			var pageLink = $('<a />').html(html).appendTo(pagingBar).attr('index', index);
			pageLink.attr('href', '#').click(function() {
				current = parseInt($(this).attr('index'));
				if(method){
					method.call(this,current);
				}
				return false;
			});
		}
	}


})(jQuery);
/*
 * Async Treeview 0.1 - Lazy-loading extension for Treeview
 * 
 * http://bassistance.de/jquery-plugins/jquery-plugin-treeview/
 *
 * Copyright (c) 2007 Jörn Zaefferer
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 *
 * Revision: $Id$
 *
 */

;(function($) {
function load(settings, root, child, container) {
	var data = $.extend({}, settings.data, {root: root});
	$.ajax({//改为同步
		url: settings.url,
		data: data,
		success: function(response) {
			function createNode(parent) {
				var chooseFlag = false;
				if(settings.hasChoosed){
					chooseFlag = $.inArray(this.data,settings.hasChoosed)>0?true:false;
				}
				var checkbox = $('<input type="checkbox"/>').attr('name', this.id).attr('parent', this.parentId || '').attr("checked",chooseFlag).change(function() {
					$(':checkbox[name=' + $(this).attr('parent') + ']').attr('checked', true);
					if(!$(this).attr('checked')) {
						$(this).parent().find(':checkbox').attr('checked', false);
					}
					if(settings.isuum){
						if($(this).attr('checked')) {
							$(this).parent().find(':checkbox').attr('checked', true);
						}
					}
				});
				var data = this.data || {};
				var text = $("<span />").html(this.text).data('data', data);
				if(settings.click) {
					text.click(function() {
						settings.click.call(text, data);
					});
				}
				var current = $("<li/>").data('data', data).attr("id", this.id).append(settings.checkbox ? checkbox : '').append(text).appendTo(parent);
				if(settings.classes) {//这里添加树的系统默认图标，也可以自定义图标
					current.children("span").addClass(settings.classes);
				}
				if (this.expanded) {
					current.addClass("open");
				}
				if (this.hasChildren || this.children && this.children.length) {
					var branch = $("<ul/>").appendTo(current);
					if (this.hasChildren) {
						current.addClass("hasChildren");
						createNode.call({
							text:"placeholder",
							id:"placeholder",
							children:[]
						}, branch);
					}
					if (this.children && this.children.length) {
						$.each(this.children, createNode, [branch]);
					}
				}
			}
			$.each(response.tree, createNode, [child]);
	        $(container).treeview({add: child});
	        if(settings.success) {
	        	settings.success();
	        }
    	},
    	dataType: 'json',
    	async: false
	});
}

var proxied = $.fn.treeview;
$.fn.treeview = function(settings) {
	if (!settings.url) {
		return proxied.apply(this, arguments);
	}
	var container = this;
	load(settings, "source", this, container);
	var userToggle = settings.toggle;
	return proxied.call(this, $.extend({}, settings, {
		collapsed: true,
		toggle: function() {
			var $this = $(this);
			if ($this.hasClass("hasChildren")) {
				var childList = $this.removeClass("hasChildren").find("ul");
				childList.empty();
				load(settings, this.id, childList, container);
			}
			if (userToggle) {
				userToggle.apply(this, arguments);
			}
		}
	}));
};

})(jQuery);
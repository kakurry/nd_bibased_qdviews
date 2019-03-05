(function() {
	$("[menu]").each(function() {
		var m = $(this);
		var status = $.cookie(encode(m.html()));
		if(status == "show") {
			showMenu(this);
			$(this).toggle(function() {
				hideMenu(this);
			}, function() {
				showMenu(this);
			});
		} else {
			$(this).toggle(function() {
				showMenu(this);
			}, function() {
				hideMenu(this);
			});
		}
	});
	function showMenu(menu) {
		var m = $(menu);
		$.cookie(encode(m.html()), "show", {path: "/"});
		m.attr("class", "status01");
		var submenu = m.parent().find("+ ul");
		submenu.show();
	}
	function hideMenu(menu) {
		var m = $(menu);
		$.cookie(encode(m.html()), null, {path: "/"});
		m.attr("class", "status02");
		var submenu = m.parent().find("+ ul");
		submenu.hide();
	}
	function encode(s) {
		return escape(s).replace(/%/g, "");
	}
})();

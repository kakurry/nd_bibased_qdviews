(function($) {
	var customizeOptions={};
	$.extend(customizeOptions, $.blockUI.defaults);
	customizeOptions.message="<div><img src='"+contextPath+"/common/images/extanim32.gif' /></div><h3>数据处理中,请稍等...</h3>";
	customizeOptions.css={
			margin:		0,
			width:		'30%',
			top:		'40%',
			left:		'35%',
			textAlign:	'center',
			cursor:		'wait',
			border: 'none',
	        padding: '15px',
	        backgroundColor: '#000',
	        '-webkit-border-radius': '10px',
	        '-moz-border-radius': '10px',
	        opacity: 0.7,
	        color: '#fff'
	};
	customizeOptions.baseZ = 9999;//最顶部
	$.blockUI.defaults = customizeOptions;
})(jQuery);
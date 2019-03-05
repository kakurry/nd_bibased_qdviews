(function($) {
	  $.extend($.validator.defaults, {
	    	focusClass: 'focusClass',
			onfocusin: function(element) {
	    		var errorClass = this.settings.errorClass;
	    		this.settings.errorClass = this.settings.focusClass + " " + this.settings.errorClass;
				if ( !this.checkable(element)) {
					this.element(element);
				}
				this.settings.errorClass = errorClass;
			},
			onfocusout: function(element) {
				if ( !this.checkable(element) && (element.name in this.submitted || !this.optional(element)) ) {
					this.element(element);
				}
			},
			errorClass: 'errorClass',
			success: function(label) {
					label.removeClass("errorClass");
			},
			highlight: function(input) {
				$(input).addClass("ui-state-highlight");
			},
			unhighlight: function(input) {
				$(input).removeClass("ui-state-highlight");
			}
	    });
	    $.validator.prototype.errors = function() {
			return $( this.settings.errorElement, this.errorContext );
		};
		$.extend($.validator.methods, {
			regex: function(value, element, param) {
				return param.test(value);
			},
			password:function(value,element,param) {
				var reg = /^[\x21-\x7E]*$/g;//ascii字符中的数字大小写字母和特殊字符(不包含中文和空格)
				//return this.optional(element)||reg.test(value);
				return reg.test(value);
			},
			precision: function(value,element,param) {//保留param位小数
				var result = /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(value);
				if(result) {
					var tmp = ('' + value).split('\.');
					if(tmp.length==2) {
						result = ('' + tmp[1]).length <= param ;
					}
				}
				return result;
			}
		});
		$.extend($.validator.messages, {
			regex: '格式错误',
			password: '不能包含中文或空格',
			precision: '最多{0}位小数'
		});
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
})(jQuery);
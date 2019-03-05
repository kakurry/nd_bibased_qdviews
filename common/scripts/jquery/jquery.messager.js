(function(){  

	var ua=navigator.userAgent.toLowerCase();  

	var is=(ua.match(/\b(chrome|opera|safari|msie|firefox)\b/) || ['','mozilla'])[1];  

	var r='(?:'+is+'|version)[\\/: ]([\\d.]+)';  

	var v=(ua.match(new RegExp(r)) ||[])[1];  

	jQuery.browser.is=is;  

	jQuery.browser.ver=v;  

	jQuery.browser[is]=true;  

})(); 

(function (jQuery){

/*

 * jQuery Plugin - Messager

 * Author: corrie	Mail: corrie@sina.com	Homepage: www.corrie.net.cn

 * Copyright (c) 2008 corrie.net.cn

 * @license http://www.gnu.org/licenses/gpl.html [GNU General Public License]

 *

 * $Date: 2008-12-26 

 * $Vesion: 1.4

 @ how to use and example: Please Open demo.html

 */

	this.version = '@1.3';

	this.layer = {'width' : 200, 'height': 150};

	this.title = '信息提示';

	this.time = 4000;

	this.anims = {'type' : 'slide', 'speed' : 600};
	this.timer1 = null;
	this.inits = function(){
		//if($("#message").is("div")){ return; }
		$("#message_close").click(function(){		
			setTimeout('this.close()', 1);
		});
		$("#message").hover(function(){
			clearTimeout(timer1);
			timer1 = null;
		},function(){
			timer1 = setTimeout('this.close()', time);
			//alert(timer1);
		});
	};

	this.show = function(time){
        //if($("#message").is("div")){ return; }
		this.inits();
		if(time>=0)this.time = time;
		switch(this.anims.type){
			case 'slide':$("#message").slideDown(this.anims.speed);break;

			case 'fade':$("#message").fadeIn(this.anims.speed);break;

			case 'show':$("#message").show(this.anims.speed);break;

			default:$("#message").slideDown(this.anims.speed);break;

		}

		if($.browser.is=='chrome'){

			setTimeout(function(){

				$("#message").remove();

				this.inits(title, text);

				$("#message").css("display","block");

			},this.anims.speed-(this.anims.speed/5));

		}	
	
		

		//$("#message").slideDown('slow');

		this.rmmessage(this.time);

	};

	this.lays = function(width, height){

		if($("#message").is("div")){ return; }

		if(width!=0 && width)this.layer.width = width;

		if(height!=0 && height)this.layer.height = height;

	};

	this.anim = function(type,speed){

		if($("#message").is("div")){ return; }

		if(type!=0 && type)this.anims.type = type;

		if(speed!=0 && speed){

			switch(speed){

				case 'slow' : ;break;

				case 'fast' : this.anims.speed = 200; break;

				case 'normal' : this.anims.speed = 400; break;

				default:					

					this.anims.speed = speed;

			}			

		}

	};

	this.rmmessage = function(time){

		if(time>0){

			timer1 = setTimeout('this.close()', time);

			//setTimeout('$("#message").remove()', time+1000);

		}

	};
	this.close = function(){
		switch(this.anims.type){
			case 'slide':$("#message").slideUp(this.anims.speed);break;
			case 'fade':$("#message").fadeOut(this.anims.speed);break;
			case 'show':$("#message").hide(this.anims.speed);break;
			default:$("#message").slideUp(this.anims.speed);break;
		};
		setTimeout('$("#message").remove();', this.anims.speed);
		this.original();	
	};

	this.original = function(){	

		this.layer = {'width' : 200, 'height': 150};

		this.title = '信息提示';

		this.time = 4000;

		this.anims = {'type' : 'slide', 'speed' : 600};

	};
    jQuery.messager = this;

    return jQuery;

})(jQuery);
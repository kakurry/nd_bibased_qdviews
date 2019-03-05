/*
* 公用js
* 创建者:李斌
*/
//////////////////////////////////////////////////////////////////////////////
//功能说明：3种trim实现
//////////////////////////////////////////////////////////////////////////////
String.prototype.trim = function() { 
	return this.replace(/(^\s*)|(\s*$)/g, ""); 
}  
String.prototype.ltrim = function() { 
	return this.replace(/(^\s*)/g, ""); 
}  
String.prototype.rtrim = function() { 
	return this.replace(/(\s*$)/g, ""); 
} 
//////////////////////////////////////////////////////////////////////////////
//功能说明：获取给定字符串的长度,包括回车换行符
//////////////////////////////////////////////////////////////////////////////
String.prototype.getLengthrn = function() {  
	var length = this.length;
	if(this.indexOf("\n") != -1){
		var nrl = this.match(new RegExp("\n","g")).length;
		length +=  nrl;
	}
	return length;   
}
//////////////////////////////////////////////////////////////////////////////
//功能说明：截取字符串，长度去掉回车换行
//////////////////////////////////////////////////////////////////////////////
String.prototype.substrrn = function(length) { 
	var nrl = 0;
	if(this.indexOf("\n") != -1){
		nrl = this.match(new RegExp("\n","g")).length;
	}
	return this.substr(0, length-nrl);
}
//////////////////////////////////////////////////////////////////////////////
//功能说明： 判断给定的字是否为中文
//参数定义： word unicode字符
//////////////////////////////////////////////////////////////////////////////
function isChinese(word) {
	var lst = /[u00-uFF]/;
	return !lst.test(word);
}
//////////////////////////////////////////////////////////////////////////////
//功能说明： 判断给定的节点对象是否为空
//参数定义： word unicode字符
//////////////////////////////////////////////////////////////////////////////
function isNull(field){
	var Text=""+field.value;
	if(Text.length)
	{
		for(var i=0;i<Text.length;i++)
		if(Text.charAt(i)!=" ")
		break;
		if(i>=Text.length){
		    return true;
		} else { 
		    return false;
		}
	}else
		return true;
}
//////////////////////////////////////////////////////////////////////////////
//功能说明： 判断给定的值是否为int型
//参数定义： word unicode字符
//////////////////////////////////////////////////////////////////////////////
var intnumber = /^\d+$/;
function isInt(intValue){
	if(intnumber.test(intValue)){
		return true;
	}else{
		return false;
	}
}
//////////////////////////////////////////////////////////////////////////////
//功能说明： 判断给定的值是否为Email,格式正确返回true,否则返回false
//参数定义：给定的字符串
//////////////////////////////////////////////////////////////////////////////
function validateEmail(val){
	var regExp = new RegExp("^.+\\@(\\[?)[a-zA-Z0-9\\-\\.]+\\.([a-zA-Z]{2,3}|[0-9]{1,3})(\\]?)$");
	if(regExp.test(val)){
		return true;
	}
	return false;
}
//////////////////////////////////////////////////
//功能说明：密码验证
//参数定义：给定字符串
function checkPassword(password){
	//只能输入6-20个以字母开头、数字的字串
	var regExp = new RegExp("[a-zA-Z0-9]{6,18}");
	if(regExp.test(password)){
		return true;
	}
	return false;
	
}
//////////////////////////////////////////////////////////////////////////////
//功能说明： 定义JS中用于高效拼接字符串的StringBuiler
//////////////////////////////////////////////////////////////////////////////
function StringBuilder(){
	this.__string__ = new Array();
}
//////////////////////////////////////////////////////////////////////////////
//功能说明： 定义StringBuiler的append方法
//////////////////////////////////////////////////////////////////////////////
StringBuilder.prototype.append = function(str){
	this.__string__.push(str);
};
//////////////////////////////////////////////////////////////////////////////
//功能说明： 定义StringBuiler的toString方法
//////////////////////////////////////////////////////////////////////////////
StringBuilder.prototype.toString = function(){
	return this.__string__.join("");
};
//////////////////////////////////////////////////////////////////////////////
//功能说明： 验证字符串长度，如果验证通过返回true，未通过返回false
//参数定义：str:需要验证的字符串，length:验证不超过的长度
//////////////////////////////////////////////////////////////////////////////
function lengthValidate(str,length){
	str.length<=length ? flag=true : flag=false;
	return flag;
}
//////////////////////////////////////////////////////////////////////////////
//功能说明：字段截取，返回截取的从0个到n个的字符串，中文为2个字节长度，其他为1个字节
//参数定义：n：需要截取最大长度
//////////////////////////////////////////////////////////////////////////////
String.prototype.sub = function(n)
{    
	var r = /[^\x00-\xff]/g;    
	if(this.replace(r, "mm").length <= n) return this;     
	var m = Math.floor(n/2);    
	for(var i=m; i<this.length; i++) {    
	if(this.substr(0, i).replace(r, "mm").length>=n) {    
	   return this.substr(0, i) ; }    
	} 
	return this;   
 };
//////////////////////////////////////////////////////////////////////////////
//功能说明：如果字符串大于num个字符截取字符串前num个字符，后面省略显示
//参数定义：str:需要省略的字符串
//////////////////////////////////////////////////////////////////////////////
function shortDesc(str,num){
	if(str==null || str=='')
		return str;
	if(str.match(/[^\x00-\xff]/ig)){
		var cArr = str.match(/[^\x00-\xff]/ig);
		if((str.length+cArr.length)<=num){
			return str;
		}else{
			return str.sub(num)+"...";
		}
	}else{
		if(str.length<=num){
			return str;
		}else{
			return str.sub(num)+"...";
		}
	}
}
//////////////////////////////////////////////////////////////////////////////
//功能说明：后台拿到前台的DATETIME需要转换，提供日期date转换方法
//参数定义：datetime:需要转换的datetime/ new Date(datetime).format("yyyy-MM-dd");
//////////////////////////////////////////////////////////////////////////////
Date.prototype.format = function(format)
{
    var o =
    {
        "M+" : this.getMonth()+1, //month
        "d+" : this.getDate(),    //day
        "h+" : this.getHours(),   //hour
        "m+" : this.getMinutes(), //minute
        "s+" : this.getSeconds(), // cond
        "q+" : Math.floor((this.getMonth()+3)/3),  //quarter
        "S" : this.getMilliseconds() //millisecond
    }
    if(/(y+)/.test(format))
    format=format.replace(RegExp.$1,(this.getFullYear()+"").substr(4 - RegExp.$1.length));
    for(var k in o)
    if(new RegExp("("+ k +")").test(format))
    format = format.replace(RegExp.$1,RegExp.$1.length==1 ? o[k] : ("00"+ o[k]).substr((""+ o[k]).length));
    return format;
}
//////////////////////////////////////////////////////////////////////
///功能说明：html转义，增加从数据库中取数据，数据里有\n等回车转义符不能识别
/////////////////////////////////////////////////////////////////////
function htmlEncode(s) {
	if(s != null){
	    s = s.replace(new RegExp("&","g"), "&amp;");
	    s = s.replace(new RegExp("<","g"), "&lt;");
	    s = s.replace(new RegExp(">","g"), "&gt;");
	    s = s.replace(new RegExp("\"","g"), "&quot;");
	    s = s.replace(new RegExp("\'","g"), "&#34;");
	    s = s.replace(new RegExp(" ","g"), "&nbsp;");
	    s = s.replace(new RegExp("\n","g"), "<br/>");
	}
    return s;
}

//////////////////////////////////////////////////////////////////////
///功能说明：校验日期
//1900-01-01 through 2099-12-31
//Matches invalid dates such as February 31st
/////////////////////////////////////////////////////////////////////
function validateYMDDate(d){
	return /(19|20)[0-9]{2}[-](0[1-9]|1[012])[-](0[1-9]|[12][0-9]|3[01])/.test(d);
}
//////////////////////////////////////////////////////////////////////
///功能说明：等比例缩放图片
//img 图片Id
//width,height 限定的最大高度和宽度
/////////////////////////////////////////////////////////////////////
function setPopimage(img,width,height){
	var image = document.getElementById(img);
	if (image.width > image.height){
	   if(image.width>width){
	    image.width=width;
	    image.height=width/image.width*image.height;
	   }
	}else{
	   if(image.height>height){
	    image.height=height;
	    image.width=height/image.height*image.width;
	   }
	}
}
//////////////////////////////////////////////////////////////////////
///功能说明：判断当前浏览器类型
/////////////////////////////////////////////////////////////////////
    function getClientOs(){
		var Sys = {};
		var ua = navigator.userAgent.toLowerCase();
		var s;
		var nowClient="";
		(s = ua.match(/msie ([\d.]+)/)) ? Sys.ie = s[1] :
		(s = ua.match(/firefox\/([\d.]+)/)) ? Sys.firefox = s[1] :
		(s = ua.match(/chrome\/([\d.]+)/)) ? Sys.chrome = s[1] :
		(s = ua.match(/opera.([\d.]+)/)) ? Sys.opera = s[1] :
		(s = ua.match(/version\/([\d.]+).*safari/)) ? Sys.safari = s[1] : 0;
		if (Sys.ie) nowClient='IE' + Sys.ie;
		if (Sys.firefox) nowClient='Firefox';
		if (Sys.chrome) nowClient='Chrome';
		if (Sys.opera) nowClient='Opera';
		if (Sys.safari) nowClient='Safari';
		return nowClient;
	}

//////////////////////////////////////////////////////////////////////
///功能说明：格式化数据货币，以千分符分割，例如1,000,000,000
///参数定义：number 需要格式化的金额字符串
/////////////////////////////////////////////////////////////////////	
function outputDollars(number){
	var numArr = number.split(".");
	number = numArr[0];
	if (number.length<= 3)
		return (number == '' ? '0' : number+'.'+numArr[1]);
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
		 return (output+'.'+numArr[1]);
	}
}

//////////////////////////////////////////////////////////////////////
///功能说明：年龄校验
///参数定义：age 待校验年龄,minAge 最小年龄,maxAge 最大年龄
/////////////////////////////////////////////////////////////////////	
function ageValid(age,minAge,maxAge){
	return age>=minAge&&age<=maxAge ? true : false;
}

//////////////////////////////////////////////////////////////////////
///功能说明：计算年龄
///参数定义：birthDate 出身日期,格式yyyy-mm-dd
/////////////////////////////////////////////////////////////////////	
function calcAge(birthDate){
	return Number(new Date().getFullYear()) - Number(birthDate.split('-')[0]);
}

//////////////////////////////////////////////////////////////////////
///功能说明：验证身份证
///参数定义：value 身份证号码
/////////////////////////////////////////////////////////////////////
function validateCard(value) {
 	value=value.trim();
 	var Y,JYM;  
    var S,M;  
    var idcard_array = new Array();  
    idcard_array = value.split("");
 	var area={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"};
	if(value!=""&&value.length!=15&&value.length!=18){
		return false;
	}
 	if(value!=""&&area[parseInt(value.substr(0,2))]==null){
 		return false;
 	}		 	
 	switch(value.length){
 	//15位身份证号校验
 	case 15: 
 		if ( (parseInt(value.substr(6,2))+1900) % 4 == 0 || ((parseInt(value.substr(6,2))+1900) % 100 == 0 && (parseInt(value.substr(6,2))+1900) % 4 == 0 )){ 
 			ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}$/; 
 		} else { 
 			ereg=/^[1-9][0-9]{5}[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}$/; 
 		}
 		if(!ereg.test(value)){
 			return false;	
 		}
 		else{
 			return true;
 		}
 	break;
 	//18位身份证号校验
 	case 18: 
 		if ( parseInt(value.substr(6,4)) % 4 == 0 || (parseInt(value.substr(6,4)) % 100 == 0 && parseInt(value.substr(6,4))%4 == 0 )){ 
 			//闰年出生日期的合法性正则表达式 
 			ereg=/^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9xX]{1}$/;
 		} else { 
 			//平年出生日期的合法性正则表达式 
 			ereg=/^[1-9][0-9]{5}19[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9xX]{1}$/;
 		}
 		if(ereg.test(value)){//测试出生日期的合法性  
 		     //计算校验位  
 		     S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7  
 		     + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9  
 		     + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10  
 		     + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5  
 		     + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8  
 		     + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4  
 		     + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2  
 		     + parseInt(idcard_array[7]) * 1   
 		     + parseInt(idcard_array[8]) * 6  
 		     + parseInt(idcard_array[9]) * 3 ;  
 		     Y = S % 11;  
 		     M = "F";  
 		     JYM = "10X98765432";  
 		     M = JYM.substr(Y,1);/*判断校验位*/
 		    if(M == idcard_array[17].toUpperCase()){  
 		       return true; /*检测ID的校验位false;*/  
 		    }  
 		    else {  
 		       return false;  
 		    }
 		}
 		else {
 		     return false;  
 		}  
 	break;
 	default:  
 	     return false;
 	}
}
//////////////////////////////////////////////////////////////////////
///功能说明：比较两个日期相差天数
///参数定义：startDate endDate 以 yyyy-MM-dd格式
/////////////////////////////////////////////////////////////////////
function dateDiff(startDate,endDate){
	times = startDate.split("-");
	date1 = new Date(times[0],times[1]-1,times[2]);
	times = endDate.split("-");
	date2 = new Date(times[0],times[1]-1,times[2]);
	var diffValue = date2.getTime() - date1.getTime();
	return parseInt(diffValue/86400000);    
}

//获取客户端屏幕宽度
function getclientWidth(){
	var winWidth="";
	if (window.innerWidth) winWidth = window.innerWidth -10; 
	else if ((document.body) && (document.body.clientWidth)) {
		winWidth = document.documentElement.clientWidth -10; 
		if(winWidth <=0){
			winWidth = document.body.clientWidth -10;
		}
	}
	return winWidth;
}
//获取客户端屏幕高度
function getclientHeight(){
	var winHeight="";
	if (window.innerHeight){ winHeight = window.innerHeight - 110; }
	else if ((document.body) && (document.body.clientHeight)) 
	{
		winHeight = document.documentElement.clientHeight - 110;
		if(winHeight <=0){
			winHeight = document.body.clientHeight - 110;
		}
	}
	return winHeight;
}

/**初始化下拉框, 参数：json数据，value用到的属性名，text用到的显示值，select的id*/
function initSelectOptions(jsonArr, valPro, textPro, domid) {
    var opt = '';
    for(var i=0; i<jsonArr.length; i++) {
        opt += '<option value="' + jsonArr[i][valPro] + '">' + jsonArr[i][textPro] + '</option>';
    }
    $("#" + domid).append(opt);
}

/**页面切换*/
function switchPage(domid) {
    var url = $('#' + domid).val();
    window.location.href = url;
}

/**日期格式化 年月日*/
function dateFormatterSimple(value) {
    if(value!=null){
        value = new Date(parseInt(value)).format("yyyy-MM-dd ");
    }
    return value;
}

/**日期格式化*/
function dateFormatter(value) {
    if(value!=null){
        value = new Date(parseInt(value)).format("yyyy-MM-dd hh:mm:ss");
    }
    return value;
}


//////////////////////////////////////////////////////////////////////
///功能说明：序列化form表单并将值加入object中
///参数定义：formid表单id，obj要扩展的obj对象
///chengcs 2014年9月24日15:27:13
/////////////////////////////////////////////////////////////////////
function serializeFormToObject(formid, obj) {
	var fields = $('#' + formid).serializeArray();
	jQuery.each(fields, function(i, field){
		obj[field.name] = !field.value || typeof(field.value)=='undefined' ? '' : field.value ;
	});
	return obj;
}
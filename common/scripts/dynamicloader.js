(function(){
	var modules = {
		tree:{
			js:'widget/jquery.tree.js',
			css:['widget/tree/jquery.tree.css']
		}
	};
	
	var locales = {
		'en':'i18n_en.js',
		'zh_CN':'i18n_zh.js'
	};
		
	var queues = {};
	
	function loadJs(url, callback){
		var done = false;
		var script = document.createElement('script');
		script.type = 'text/javascript';
		script.language = 'javascript';
		script.src = url;
		script.onload = script.onreadystatechange = function(){
			if (!done && (!script.readyState || script.readyState == 'loaded' || script.readyState == 'complete')){
				done = true;
				script.onload = script.onreadystatechange = null;
				if (callback){
					callback.call(script);
				}
			}
		}
		document.getElementsByTagName("head")[0].appendChild(script);
	}
	
	function runJs(url, callback){
		loadJs(url, function(){
			document.getElementsByTagName("head")[0].removeChild(this);
			if (callback){
				callback();
			}
		});
	}
	
	function loadCss(url, callback){
		var link = document.createElement('link');
		link.rel = 'stylesheet';
		link.type = 'text/css';
		link.media = 'screen';
		link.href = url;
		document.getElementsByTagName('head')[0].appendChild(link);
		if (callback){
			callback.call(link);
		}
	}
	
	function loadSingle(name, callback){
		queues[name] = 'loading';
		var module = modules[name];
		var jsStatus = 'loading';
		var cssStatus = (dynamicLoader.css && module['css']) ? 'loading' : 'loaded';
		
		if (dynamicLoader.css && module['css']){
			var csses = module['css'];
			if (csses){
				for(var i=0; i<csses.length; i++){
					if (/^http/i.test(csses[i])){
						var url = csses[i];
					} else {
						var url = dynamicLoader.base + 'styles/'+ csses[i];
					}
					loadCss(url, function(){
						cssStatus = 'loaded';
						if (jsStatus == 'loaded' && cssStatus == 'loaded'){
							finish();
						}
					});
				}
			}
		}
		
		if (/^http/i.test(module['js'])){
			var url = module['js'];
		} else {
			var url = dynamicLoader.base + 'common/scripts/' + module['js'];
		}
		loadJs(url, function(){
			jsStatus = 'loaded';
			if (jsStatus == 'loaded' && cssStatus == 'loaded'){
				finish();
			}
		});
		
		function finish(){
			queues[name] = 'loaded';
			dynamicLoader.onProgress(name);
			if (callback){
				callback();
			}
		}
	}
	
	function loadModule(name, callback){
		var mm = [];
		var doLoad = false;
		
		if (typeof name == 'string'){
			add(name);
		} else {
			for(var i=0; i<name.length; i++){
				add(name[i]);
			}
		}
		
		function add(name){
			if (!modules[name]) return;
			var d = modules[name]['dependencies'];
			if (d){
				for(var i=0; i<d.length; i++){
					add(d[i]);
				}
			}
			mm.push(name);
		}
		
		function finish(){
			if (callback){
				callback();
			}
			dynamicLoader.onLoad(name);
		}
		
		var time = 0;
		function loadMm(){
			if (mm.length){
				var m = mm[0];	// the first module
				if (!queues[m]){
					doLoad = true;
					loadSingle(m, function(){
						mm.shift();
						loadMm();
					});
				} else if (queues[m] == 'loaded'){
					mm.shift();
					loadMm();
				} else {
					if (time < dynamicLoader.timeout){
						time += 10;
						setTimeout(arguments.callee, 10);
					}
				}
			} else {
				if (dynamicLoader.locale && doLoad == true && locales[dynamicLoader.locale]){
					var url = dynamicLoader.base + 'locale/' + locales[dynamicLoader.locale];
					runJs(url, function(){
						finish();
					});
				} else {
					finish();
				}
			}
		}
		loadMm();
	}
	
	dynamicLoader = {
		modules:modules,
		locales:locales,
		base:'.',
		css:true,
		locale:null,
		timeout:2000,
	
		load: function(name, callback){
			if (/\.css$/i.test(name)){
				if (/^http/i.test(name)){
					loadCss(name, callback);
				} else {
					loadCss(dynamicLoader.base + name, callback);
				}
			} else if (/\.js$/i.test(name)){
				if (/^http/i.test(name)){
					loadJs(name, callback);
				} else {
					loadJs(dynamicLoader.base + name, callback);
				}
			} else {
				loadModule(name, callback);
			}
			if(dynamicLoader.auto){
				autoLoader();
			}
		},
		onProgress: function(name){},
		onLoad: function(name){}
	};

	var scripts = document.getElementsByTagName('script');
	for(var i=0; i<scripts.length; i++){
		var src = scripts[i].src;
		if (!src) continue;
		var m = src.match(/dynamicLoader\.js(\W|$)/i);
		if (m){
			dynamicLoader.base = src.substring(0, m.index);
		}
	}

	window.using = dynamicLoader.load;
	
	jQuery.extend({      
	autoLoader: {      
		options: {
			auto:true,
			content:null,
			plugins:['text']
		},
		loader: function(options){
			var opts = $.extend({},$.autoLoader.options,options);
			if(opts.auto){
				for(var i=0; i<opts.plugins.length; i++){
					(function(){
						var name = opts.plugins[i];
						var r = $('.csiui-' + name, opts.context);
						if (r.length){				
							dynamicLoader.load(name, function(){
								r[name]();
							})
						}
					})();
				}
			}
		}
	  }
   });
	
	if (window.jQuery){
		jQuery(function(){
			$.autoLoader.loader();
		});
	}
	
})();


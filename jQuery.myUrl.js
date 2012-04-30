(function($) {
	if (!$.myURL) {
		$.extend({
			myURL: function(v) {
				if (!$.myURL.defaults.base) $.myURL.config();
				if (v) {
					var args,
						retVal = $.myURL.defaults.base;
					if (v == "index") {
						retVal = retVal + "/index.php";
						args = Array.prototype.slice.call(arguments, 1);
					}
					else if (v == "pathname"){
						return window.location.pathname;
					}
					else if (v == "afterpath"){
						return window.location.href.substr(window.location.href.indexOf(window.location.pathname)+(window.location.pathname.length));
					}
					else if (v == "fullpathname"){
						return $.myURL("pathname") + $.myURL("afterpath");
					}
					else {
						args = Array.prototype.slice.call(arguments);
					};
					
					if (args.length > 0) {
						var bb = new Array(),
							pm = undefined;
						for (x in args) {
							if (typeof args[x] === "string") {
								if (!args[x] == "") {
									//	clean the ends if needed, we'll add slashes later
									if (args[x].charAt(0) == "/") args[x] = args[x].substring(1)
									if (args[x].charAt(args[x].length - 1) == "/") args[x] = args[x].substring(0, args[x].length - 1);
									if (!args[x] == "") bb[x] = args[x];
								};
							}
							else if (typeof args[x] === "object") {
								pm = "?" + $.param(args[x]);
							};
						};
						if (bb.length > 0) retVal = retVal + "/" + bb.join("/");
						if (pm) retVal += pm;
					};
					retVal = ($.myURL.defaults.trail) ? (retVal.charAt(retVal.length - 1)) ? retVal + "/" : retVal : retVal;
					var lstChk = retVal.split("/");
					if (lstChk[(lstChk[lstChk.length - 1] == "") ? lstChk.length - 2 : lstChk.length - 1].match(/.[.,!,@,#,$,%,^,&,*,?,_,~]/)) {
						if (retVal.charAt(retVal.length - 1) == "/") {
							retVal = retVal.substring(0, retVal.length - 1);
						};
					};
					return retVal;
				}
				else {
					var base = $.myURL.defaults.base;
					base = ($.myURL.defaults.trail) ? (base.charAt(base.length - 1)) ? base + "/" : base : base;
					return base;
				}
			}
		});
		$.myURL.config = function(v) {
			var url = location.href;
			if (!v) {
				v = {};
				var aa = url.substring(url.indexOf(window.location.hostname)).split("/");
				if (aa.length >= 2) {
					if (aa[1] != "" && !aa[1].match(/.[.,!,@,#,$,%,^,&,*,?,_,~]/)) {
						$.myURL.defaults.mainDir = aa[1];
						if (aa.length >= 3) {
							aa.splice(0, 2);
							var bb = new Array();
							
							bb = function getDir() {
								var cc = new Array();
								for (x in aa) {
									if (aa[x] != "" && !aa[x].match(/.[.,!,@,#,$,%,^,&,*,?,_,~]/)) {
										cc[x] = aa[x];
									}
									else {
										return cc;
									};
								};
								return cc;
							};
							
							if (bb.length > 0) $.myURL.defaults.subDir = bb.join("/");
						};
					};
				};
			}
			else {
				$.myURL.defaults.isLocal = (v["isLocal"]) ? true : (url.indexOf("//local") >= 0) ? true : false;
				if (v["forceMain"]) $.myURL.defaults.forceMain = v["forceMain"];
				if (v["local"]) {
					if (v["local"]["main"]) $.myURL.defaults.dirs.local.main = v["local"]["main"];
					if (v["local"]["sub"]) $.myURL.defaults.dirs.local.sub = v["local"]["sub"];
				}
				if (v["onSite"]) {
					if (v["onSite"]["main"]) $.myURL.defaults.dirs.onSite.main = v["onSite"]["main"];
					if (v["onSite"]["sub"]) $.myURL.defaults.dirs.onSite.sub = v["onSite"]["sub"];
				}
				if (v["trail"]) $.myURL.defaults.trail = v["trail"];
			};
			
			if ($.myURL.defaults.isLocal) {
				if ($.myURL.defaults.dirs.local.main) {
					//	Check to make sure directory exist in url, as it should even if this is the first page, otherwise, what are testing?
					var chkDir = url.substring(url.indexOf($.myURL.defaults.dirs.local.main)).substring(0, url.substring(url.indexOf($.myURL.defaults.dirs.local.main)).indexOf("/"));
					if ($.myURL.defaults.dirs.local.main == chkDir) $.myURL.defaults.mainDir = $.myURL.defaults.dirs.local.main;
					if ($.myURL.defaults.dirs.local.sub) $.myURL.defaults.subDir = $.myURL.defaults.dirs.local.sub;
				};
			}
			else {
				if ($.myURL.defaults.dirs.onSite.main) {
					if ($.myURL.defaults.forceMain) {
						if ($.myURL.defaults.dirs.onSite.main) $.myURL.defaults.mainDir = $.myURL.defaults.dirs.onSite.main;
						if ($.myURL.defaults.dirs.onSite.sub) $.myURL.defaults.subDir = $.myURL.defaults.dirs.onSite.sub;
					}
					else {
						//	Check to make sure directory exist in url, as it should even if this is the first page,
						//	this is not be mistaken with adding directories to the url string to be returned on dynamic calls
						var chkDir = url.substring(url.indexOf($.myURL.defaults.dirs.onSite.main)).substring(0, url.substring(url.indexOf($.myURL.defaults.dirs.onSite.main)).indexOf("/"));
						if ($.myURL.defaults.dirs.onSite.main == chkDir) $.myURL.defaults.mainDir = $.myURL.defaults.dirs.onSite.main;
						if ($.myURL.defaults.dirs.onSite.sub) $.myURL.defaults.subDir = $.myURL.defaults.dirs.onSite.sub;
					};
				};
			};
			
			$.myURL.defaults.base = window.location.protocol + "//" + window.location.hostname;
			if ($.myURL.defaults.mainDir) $.myURL.defaults.base = $.myURL.defaults.base + "/" + $.myURL.defaults.mainDir;
			if ($.myURL.defaults.subDir) $.myURL.defaults.base = $.myURL.defaults.base + "/" + $.myURL.defaults.subDir;
		};
		$.myURL.defaults = {
			base: undefined,
			dirs: {
				local: {
					main: undefined,
					sub: undefined
				},
				onSite: {
					main: undefined,
					sub: undefined
				}
			},
			forceMain:	true,
			isLocal:	false,
			mainDir: 	undefined,
			subDir:		undefined,
			trail: 		true
		};
	};
})(jQuery);
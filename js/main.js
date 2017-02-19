window.onload = function () {
	var scrolling = null;
	var scrollVal = 0;
	var len = 0;
	curPg = 1;
	curFocus = 1;
	index1 = 0;
	components1 = [];
	totalPages1 = 0;
	menuFocus = -1;
	pgNum = 1;
	ytKey = "AI39si6YGyZzT8wSznnBmS9QqpBPu6IL1tBRlIqbnTsIHyAzF3840pjUqlZwV-n0FI4O1lQi3kyjxWodVmDmPjTPNv9qifl5Sw";
	globals = {
		keyCodeDic : {},
		nextPage : null,
		prePage : null,
		focusedDom : {},
		animOn : false,
		menuAPI_Id : ["recent", "popular"],
		searchDefault : "Faça sua busca aqui...",
		searchValue : "Faça sua busca aqui...",
		totalResutsErr : 0
	};
	(function () {
		document.getElementById("menuSection").innerHTML = "<div id='search'></div><div id='menutop' ><div id='menu'  class='menubar'></div><div id ='searchMenu' class ='searchbar'></div><div id ='leftmask'></div><div id ='rightmask'></div></div>";
		document.getElementById("search").innerHTML = "<input type='text' id ='searchbox'  class ='normalSearch' name='button'  value='Faça sua busca aqui...'/><div id ='clearButton' class ='normalButton clearnormalButton'></div>";
		document.getElementById("desc").innerHTML = "<div id ='descTitle'></div><div id='outerScroller'><div id ='scroller'></div></div><div id ='upArrow'></div><div id ='downArrow'></div><div id='pageContainerDesc'><div class='leftPg'></div><div class='slash'></div><div class='rightPg'></div></div>";
		document.getElementById("container").innerHTML = "<div id='pageContainer'><div id='pageLeftArrow'></div><div id='inner'></div><div id='pageRightArrow'></div></div>";
	})();
	var menuContainer = document.getElementById("menu");
	var searchMenuContainer = document.getElementById("searchMenu");
	var searchContainer = document.getElementById("searchbox");
	var upArrowContainer = document.getElementById("upArrow");
	var downArrowContainer = document.getElementById("downArrow");
	var clearButtonContainer = document.getElementById("clearButton");
	var pageIndex = document.getElementById("inner");
	loading = document.getElementById("loading");
	$('#searchbox').each(function () {
		var elem = $(this);
		elem.data('oldVal', elem.val());
		elem.bind("propertychange keyup input paste", function (event) {
			elem.data('oldVal', elem.val());
			if (elem.val() != "") {
				globals.searchValue = elem.val();
			}
			if ((globals.searchValue != globals.searchDefault) && (globals.searchValue != "")) {
				searchMenuCreate();
			}
			if (globals.searchValue == "" || globals.searchValue == globals.searchDefault) {
				searchContainer.focus();
			}
		});
	});
	var MenusList = ["Uploads recentes", "Uploads populares"];
	globals.keyCodeDic[38] = "arrowup";
	globals.keyCodeDic[40] = "arrowdown";
	globals.keyCodeDic[37] = "arrowleft";
	globals.keyCodeDic[39] = "arrowright";
	globals.keyCodeDic[13] = "ok";
	globals.keyCodeDic[8] = "return";
	globals.keyCodeDic[403] = "red";
	globals.keyCodeDic[404] = "green";
	globals.keyCodeDic[405] = "yellow";
	globals.keyCodeDic[406] = "blue";
	function scroll_up() {
		var divHeight = parseInt($("#scroller").css("line-height"));
		var lines = Math.floor(parseInt($("#outerScroller").height()) / divHeight);
		scrollVal -= (lines) * divHeight + 8;
		try {
			$("#scroller").animate({
				marginTop : -scrollVal
			}, 500, function () {
				$("#downArrow").attr("class", "arrowNormal");
				if (len == $("#scroller").height()) {
					$("#upArrow").attr("class", "arrowDisabled");
					downArrowContainer.enter_focus();
				}
				$(".leftPg").html(pgNum);
			});
		} catch (e) {}
		len += parseInt($("#outerScroller").height());
		pgNum--;
	}
	function scroll_down() {
		var divHeight = parseInt($("#scroller").css("line-height"));
		var lines = Math.floor(parseInt($("#outerScroller").height()) / divHeight);
		scrollVal += (lines) * divHeight + 8;
		try {
			$("#scroller").animate({
				marginTop : -scrollVal
			}, 500, function () {
				$("#upArrow").attr("class", "arrowNormal");
				if (len - parseInt($("#outerScroller").height()) <= parseInt($("#scroller").css("line-height"))) {
					$("#downArrow").attr("class", "arrowDisabled");
					upArrowContainer.enter_focus();
				}
				$(".leftPg").html(pgNum);
			});
		} catch (e) {}
		len -= parseInt($("#outerScroller").height());
		pgNum++;
	}
	function stop_scroll() {
		scrollVal = 0;
		pgNum = 1;
		$("#scroller").css("margin-top", "0px");
	}
	document.onkeydown = function (e) {
		MainKeyboardEvent(e, "keydown");
	};
	_target = function (e) {
		!e && (e = window.event);
		var target = (e.target || e.srcElement) || {};
		target.keyCode = e.which;
		return target;
	};
	MainKeyboardEvent = function (e, eventType) {
		target = _target(e),
		keyCode = target.keyCode,
		key = globals.keyCodeDic[keyCode];
		if (globals.animOn) {
			return false;
		}
		if (globals.focusedDom.KeyboardEvent && globals.focusedDom.KeyboardEvent(e, eventType)) {
			return true;
		}
		switch (eventType) {
		case "keydown":
			switch (key) {
			case "arrowdown":
				break;
			case "arrowup":
				break;
			case "ok":
				break;
			case "red":
				break;
			case "blue":
				try {
					del_cookie("santosCookieName");
					$("#popup_bg").css("display", "block");
					if (globals.focusedDom.id == "menu") {
						globals.focusedDom.leave_focus(menuContainer.focusedDom);
						menuContainer.focusedDom.className = "menuSelected";
					} else if (globals.focusedDom.id == "searchMenu") {
						globals.focusedDom.leave_focus(searchMenuContainer.focusedDom);
						if (searchMenuContainer.focusedDom === document.getElementById("searchResult"))
							searchMenuContainer.focusedDom.className = "menuSelected";
					} else {
						globals.focusedDom.leave_focus();
					}
					popUp.create();
					popUp.check();
				} catch (e) {}
				break;
			}
			break;
		}
	};
	var getPagination = function (list) {
		globals.nextPage = list.filter(function (list) {
				return list.rel == "next";
			});
		globals.prePage = list.filter(function (list) {
				return list.rel == "previous";
			});
	};
	formatTime = function (secs) {
		var hr = Math.floor(secs / 3600);
		var min = Math.floor((secs - (hr * 3600)) / 60);
		var sec = Math.floor(secs - (hr * 3600) - (min * 60));
		if (hr < 10) {
			hr = "0" + hr;
		}
		if (min < 10) {
			min = "0" + min;
		}
		if (sec < 10) {
			sec = "0" + sec;
		}
		var time = (hr == "00") ? min + ':' + sec : hr + ':' + min + ':' + sec;
		return time;
	};
	pageIndex.reset = function () {
		curFocus = 1;
		pageIndex.free();
	};
	pageIndex.free = function () {
		index1 = 0;
		curPg = 1;
		$("#inner").html("");
		components1 = [];
	}
	pageIndex.leave_focus = function () {
		$("#number_curser_" + components1[index1]).css("display", "none");
		if (components1[index1] == curFocus) {
			$("#number_curser_01_" + components1[index1]).css("display", "block");
		}
		if ($("#" + curFocus).length) {
			index1 = curFocus % 10 - 1;
			if (index1 == -1)
				index1 = 9;
		}
	}
	pageIndex.enter_focus = function () {
		globals.focusedDom = this;
		if (components1[index1] == curFocus) {
			$("#number_curser_01_" + components1[index1]).css("display", "none");
		}
		$("#number_curser_" + components1[index1]).css("display", "block");
	}
	pageIndex.hide = function () {
		$("#container").css("visibility", "hidden");
		$("#pageRightArrow").css("visibility", "hidden");
		$("#pageLeftArrow").css("visibility", "hidden");
	}
	pageIndex.KeyboardEvent = function (e, eventType) {
		var remainder = totalPages1 % 10 - 1;
		if (remainder == -1)
			remainder = 9;
		switch (key) {
		case "arrowright":
			if (curPg + index1 == totalPages1)
				return false;
			if (components1[index1 + 1]) {
				if ($("#" + components1[index1]).attr("select") == "true")
					$("#number_curser_01_" + components1[index1]).css("display", "block");
				if ($("#" + components1[index1 + 1]).attr("select") == "true")
					$("#number_curser_01_" + components1[index1 + 1]).css("display", "none");
				$("#number_curser_" + components1[index1]).css("display", "none");
				$("#number_curser_" + components1[index1 + 1]).css("display", "block");
				index1++;
			} else {
				curPg += 10;
				index1 = 0;
				$("#inner").html("");
				components1 = [];
				createBottomList(totalPages1, null);
				for (var loopVar = 0; loopVar < 10; loopVar++) {
					$("#number_curser_01_" + components1[loopVar]).css("display", "none");
				}
				$("#number_curser_" + components1[index1]).css("display", "block");
				if ($("#number_curser_" + curFocus).css("display") == 'none') {
					$("#number_curser_01_" + curFocus).css("display", "block");
				}
			}
			return true;
			break;
		case "arrowleft":
			if (curPg == 1 && index1 == 0)
				return false;
			if (components1[index1 - 1]) {
				if ($("#" + components1[index1]).attr("select") == "true")
					$("#number_curser_01_" + components1[index1]).css("display", "block");
				if ($("#" + components1[index1 - 1]).attr("select") == "true")
					$("#number_curser_01_" + components1[index1 - 1]).css("display", "none");
				$("#number_curser_" + components1[index1]).css("display", "none");
				$("#number_curser_" + components1[index1 - 1]).css("display", "block");
				index1--;
			} else {
				curPg -= 10;
				index1 = 9;
				$("#inner").html("");
				components1 = [];
				createBottomList(totalPages1, null);
				for (var loopVar = 0; loopVar < 10; loopVar++) {
					$("#number_curser_01_" + components1[loopVar]).css("display", "none");
				}
				$("#number_curser_" + components1[index1]).css("display", "block");
				if ($("#number_curser_" + curFocus).css("display") == 'none') {
					$("#number_curser_01_" + curFocus).css("display", "block");
				}
			}
			return true;
			break;
		case "arrowup":
			if (gridContainer.isVisible()) {
				$("#number_curser_" + components1[index1]).css("display", "none");
				$("#number_curser_01_" + curFocus).css("display", "block");
				if ($("#" + curFocus).length) {
					if (curFocus % 10 != 0) {
						index1 = (curFocus % 10) - 1;
					} else {
						index1 = 9;
					}
				}
				gridContainer.enter_focus();
			}
			try {}
			catch (e) {}
			return true;
			break;
		case "ok":
			var startIndex = (curPg + index1 - 1) * 5 + 1;
			var api = "";
			if ($("#searchMenu").css("visibility") == "visible") {
				api = urlList.search + globals.searchValue + "&start-index=" + startIndex;
			} else if (menuContainer.focusDom.focusIndex == 0) {
				api = urlList.recently.toString() + "&start-index=" + startIndex;
			} else if (menuContainer.focusDom.focusIndex == 1) {
				api = urlList.popular.toString() + "&start-index=" + startIndex;
			} else {
				api = urlList.menuData.toString() + globals.menuAPI_Id[menuContainer.focusDom.focusIndex].toString() + "?start-index=" + startIndex + "&v=2&alt=json&max-results=5";
			}
			var pageNo = parseInt(startIndex / 5) + 1;
			gridContainer.reset();
			gridContainer.setCurrentpage(pageNo);
			loadXMLDoc(api);
			if (gridContainer.isVisible()) {
				for (var loopVar = 0; loopVar < 10; loopVar++) {
					$("#" + components1[loopVar]).attr("select", false);
					$("#number_curser_01_" + components1[loopVar]).css("display", "none");
					$("#number_curser_" + components1[loopVar]).css("display", "none");
				}
				$("#number_curser_01_" + components1[index1]).css("display", "block");
				$("#" + components1[index1]).attr("select", true);
				curFocus = components1[index1];
				gridContainer.enter_focus();
			} else {
				if (searchMenuContainer.style.visibility == "visible") {
					searchMenuContainer.enter_focus(searchMenuContainer.focusedDom);
				} else {
					menuContainer.enter_focus(menuContainer.focusedDom);
				}
			}
			return true;
			break;
		case "arrowdown":
			$("#number_curser_" + components1[index1]).css("display", "none");
			$("#number_curser_01_" + curFocus).css("display", "block");
			if ($("#" + curFocus).length) {
				if (curFocus % 10 != 0) {
					index1 = (curFocus % 10) - 1;
				} else {
					index1 = 9;
				}
			}
			normalPlayerContainer.enter_focus();
			return true;
			break;
		}
	};
	var popUp = (function () {
		var obj = {};
		var prevfocusedDom = {};
		var initial = 0;
		var current = 1;
		obj.isVisible = true;
		var santosCookieName = getCookie("santosCookieName");
		obj.create = function () {
			current = 1;
			document.getElementById("popup_bg").className = "popup_bg";
			var outer = '<div id="popUp"><h1 id="header" >Bem vindo ao Canal da Santos TV!</h1><p  class="descDialogSub" >Abaixo algumas dicas para utilização da aplicação:</p><p class="descDialog"> - Pressione setas no seu controle remoto para navegar através da aplicação. </p><p class="descDialog"> - Pressione  em "OK" na parte superior imagem para reproduzir o vídeo</p><p class="descDialog"> - Pressione  em "OK" a imagem de busca de recurso de pesquisa.</p><div id= "check"><img src="./images/check_box_selected.png" id="img3" style=height:40px /><img src="./images/check_box.png" id="img1"/><img src="./images/tick_mark.png" id="img2" /></div><p id ="dont">Eu não quero verificar essas dicas na próxima vez que você executar o aplicativo.</p><p id ="" class="msg">Acompanhe a Santos TV no YouTube em "www. youtube.com/santosfc".</p><input type="button" id="confirm" value="CONFIRMAR"/></div><div class="outer"><marquee  class="text" behavior="slide"  id="divText" scrollamount="12"  direction="up"></marquee></div>';
			document.getElementById("pop").innerHTML = "";
			document.getElementById("pop").innerHTML = outer;
			document.getElementById('divText').stop();
		}
		obj.KeyboardEvent = function (e, eventType) {
			target = _target(e),
			keyCode = target.keyCode,
			key = globals.keyCodeDic[keyCode];
			switch (eventType) {
			case "keydown":
				switch (key) {
				case "arrowup":
					location.href = "#img1";
					var ele = document.getElementById("img1");
					ele.tabIndex = -1;
					ele.focus();
					$("#img3").removeClass("hide").addClass("show");
					current = 1;
					$("#confirm").removeClass("change").addClass("normal");
					return true;
					break;
				case "arrowdown":
					document.getElementById('confirm').focus();
					$("#img3").removeClass("show").addClass("hide");
					$("#confirm").removeClass("normal").addClass("change");
					current = 2;
					return true;
					break;
				case "return":
					e.preventDefault();
					this.hide();
					return true;
					break;
				case "ok":
					if ($('#img3').css('display') == "block") {
						if ($('#img2').css('display') == "none") {
							$("#img2").removeClass("hide").addClass("show");
						} else {
							$("#img2").removeClass("show").addClass("hide");
						}
					} else {}
					if (current == 1) {}
					else {
						this.hide();
					}
				}
				return true;
			}
			return true;
		};
		obj.enter_focus = function () {
			prevfocusedDom = globals.focusedDom;
			globals.focusedDom = this;
		};
		obj.leave_focus = function () {};
		obj.hide = function () {
			$("#popup_bg").hide();
			$("#popUp").removeClass("show");
			if ($('#img2').css('display') == "block") {
				setCookie("santosCookieName", 1, 365);
			} else {}
			document.getElementById("pop").innerHTML = "";
			if ($.isEmptyObject(prevfocusedDom)) {
				if (gridContainer.isVisible()) {
					gridContainer.enter_focus();
				} else {
					menuContainer.enter_focus(menuContainer.focusedDom);
				}
			} else {
				if (prevfocusedDom.id == "menu") {
					prevfocusedDom.enter_focus(menuContainer.focusedDom);
				} else if (prevfocusedDom.id == "searchMenu") {
					prevfocusedDom.enter_focus(searchMenuContainer.focusedDom);
				} else {
					prevfocusedDom.enter_focus();
				}
			}
		};
		obj.check = function () {
			santosCookieName = getCookie("santosCookieName");
			if (santosCookieName) {
				if (gridContainer.isVisible()) {
					gridContainer.enter_focus();
				} else {
					menuContainer.enter_focus(menuContainer.focusedDom);
				}
			} else {
				this.show();
			}
		};
		obj.show = function () {
			$("#img2").addClass("hide");
			$("#popUp").addClass("show");
			$("#confirm").addClass("normal");
			location.href = "#img1";
			var ele = document.getElementById("img1");
			ele.tabIndex = -1;
			ele.focus();
			$("#img3").addClass("show");
			this.enter_focus();
		};
		return obj;
	})();
	normalPlayerContainer = (function () {
		var parent = document.getElementById('topImg');
		var bg = document.createElement("div");
		var img = document.createElement("img");
		var playIcon = document.createElement("div");
		var cursor = document.createElement("div");
		var video_id = "";
		var obj = {};
		parent.className = "topImg";
		bg.id = "topImg_bg";
		bg.className = "topImg_bg";
		img.id = "topImg_img";
		img.className = "topImg_img";
		playIcon.id = "topImg_playIcon";
		playIcon.className = "topImg_playIcon";
		cursor.id = "topImg_cursor";
		cursor.className = "topImg_cursor";
		parent.appendChild(bg);
		parent.appendChild(img);
		parent.appendChild(playIcon);
		parent.appendChild(cursor);
		obj.changeImg = function (param) {
			img.src = param.img;
			video_id = param.video_id;
		};
		obj.enter_focus = function () {
			globals.focusedDom = this;
			cursor.style.visibility = "visible";
		};
		obj.leave_focus = function () {
			cursor.style.visibility = "hidden";
		};
		obj.KeyboardEvent = function (e, eventType) {
			target = _target(e),
			keyCode = target.keyCode,
			key = globals.keyCodeDic[keyCode];
			switch (eventType) {
			case "keydown":
				switch (key) {
				case "arrowright":
					if (upArrowContainer.className == "arrowNormal") {
						this.leave_focus();
						upArrowContainer.enter_focus();
					} else if (downArrowContainer.className == "arrowNormal") {
						this.leave_focus();
						downArrowContainer.enter_focus();
					}
					return true;
					break;
				case "arrowdown":
					this.leave_focus();
					searchContainer.enter_focus();
					return true;
					break;
				case "ok":
					if (playerReady) {
						this.leave_focus();
						playerControls.show(video_id, this);
					}
					return true;
					break;
				case "arrowup":
					this.leave_focus();
					if ($("#container").css("visibility") == 'visible') {
						globals.focusedDom = document.getElementById("inner");
						if ($("#number_curser_01_" + curFocus).css("display") == 'block') {
							$("#number_curser_" + curFocus).css("display", "block");
							$("#number_curser_01_" + curFocus).css("display", "none");
						} else {
							$("#number_curser_" + components1[index1]).css("display", "block");
							$("#number_curser_01_" + components1[index1]).css("display", "none");
						}
					} else if (gridContainer.isVisible()) {
						gridContainer.enter_focus();
					} else if (searchMenuContainer.style.visibility == "visible") {
						searchMenuContainer.enter_focus(searchMenuContainer.focusedDom);
					} else {
						menuContainer.enter_focus(menuContainer.focusedDom);
					}
					break;
				}
			}
			return false;
		};
		return obj;
	})();
	function grid(param) {
		param = param || {};
		var wrapper = document.createElement('div'),
		bg = document.createElement('div'),
		img = document.createElement('img'),
		title = document.createElement('div'),
		author = document.createElement('div'),
		views = document.createElement('div'),
		duration = document.createElement('div'),
		durationBg = document.createElement('div'),
		cursor = document.createElement('div');
		img.src = param.img;
		img.className = "gridImg";
		img.id = 'gridImg' + parseInt(param.id);
		img.alt = "No image found";
		bg.appendChild(img);
		duration.innerHTML = param.duration;
		duration.className = 'gridDuration';
		duration.id = 'gridDuration' + parseInt(param.id);
		durationBg.className = 'gridDurationBg';
		durationBg.id = 'gridDurationBg' + parseInt(param.id);
		bg.appendChild(durationBg);
		bg.appendChild(duration);
		title.innerHTML = param.title;
		title.className = 'gridTitle';
		title.id = 'gridTitle' + parseInt(param.id);
		bg.appendChild(title);
		author.innerHTML = param.author;
		author.className = 'gridAuthor';
		author.id = 'gridAuthor' + parseInt(param.id);
		bg.appendChild(author);
		if (param.views.toString() == '1')
			views.innerHTML = param.views.toString() + " view";
		else
			views.innerHTML = param.views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " views";
		views.className = 'gridViews';
		views.id = 'gridViews' + parseInt(param.id);
		bg.appendChild(views);
		bg.className = 'gridBg';
		bg.id = 'gridBg_' + parseInt(param.id);
		cursor.className = 'gridCursor';
		cursor.id = 'gridCursor' + parseInt(param.id);
		wrapper.className = 'grid';
		wrapper.id = 'grid_' + parseInt(param.id);
		wrapper.appendChild(bg);
		wrapper.appendChild(cursor);
		wrapper.enter_focus = function () {
			try {
				document.getElementById("descTitle").scrollLeft = 0;
				setDescription({
					"title" : param.title,
					"desc" : param.desc,
					"img" : param.bigimg,
					"video_id" : param.video_id
				});
				cursor.className += " gridCursorOn";
				title.style.whiteSpace = "pre";
				title.style.textOverflow = "ellipsis";
				if (title.clientWidth + 215 < title.scrollWidth)
					title.className += " marquee";
				title.style.whiteSpace = "";
				title.style.textOverflow = "";
			} catch (e) {}

		};
		wrapper.leave_focus = function () {
			cursor.className = " gridCursor";
			title.className = " gridTitle";
		};
		return wrapper;
	};
	var gridContainer = (function () {
		var obj = {},
		data = {},
		components = [],
		total = 0,
		index = 0,
		parent,
		totalPages = 0,
		currentPage = 1,
		totalItem,
		currentItem = 0,
		prevItem = 0,
		wrapper = document.getElementById('bottomGrid'),
		gridSection = document.createElement('div');
		wrapper.className = "bottomGrid";
		gridSection.className = "gridSection";
		gridSection.id = "gridSection";
		wrapper.appendChild(gridSection);
		parent = document.getElementById('gridSection');
		parent.className = "gridSection";
		var arrows = createArrow();
		obj.create = function (param) {
			data = param || {};
			parent.innerHTML = "";
			components = [];
			totalItem = data.feed.openSearch$totalResults.$t || 0;
			if (totalItem > 5 && data.feed.entry.length < 5 && currentPage == 1) {
				totalItem = data.feed.entry.length;
			};
			if (totalPages == 0) {
				totalPages = parseInt(totalItem / 5) + ((totalItem % 5) == 0 ? 0 : 1);
				globals.totalResutsErr = totalItem;
			}
			total = data.feed.entry.length || 0;
			for (var item in data.feed.entry) {
				parent.appendChild(grid({
						'id' : item,
						'title' : data.feed.entry[item].media$group.media$title.$t,
						'author' : data.feed.entry[item].author[0].name.$t,
						'views' : data.feed.entry[item].yt$statistics.viewCount,
						'img' : data.feed.entry[item].media$group.media$thumbnail[1].url,
						'bigimg' : data.feed.entry[item].media$group.media$thumbnail[3].url,
						'duration' : formatTime(data.feed.entry[item].media$group.yt$duration.seconds),
						'desc' : data.feed.entry[item].media$group.media$description.$t,
						'video_id' : data.feed.entry[item].media$group.yt$videoid.$t
					}));
			};
			while (total--) {
				id = "grid_" + total;
				components[total] = document.getElementById(id);
			};
			createBottomList(totalPages, parent);
			obj.displayPageNo();
		};
		obj.displayPageNo = function () {
			arrows.showArrow();
			arrows.DisableBothArrow();
			if (totalPages === 1) {
				return true;
			}
			if (currentPage === 1) {
				arrows.enableRightArrow();
			} else if (currentPage > 1 && currentPage < totalPages) {
				arrows.enableBothArrow();
			} else if (currentPage == totalPages) {
				arrows.enableLeftArrow();
			}
		};
		obj.isVisible = function () {
			var val;
			val = (components.length == 0) ? false : true;
			return val;
		};
		obj.reset = function () {
			currentPage = 1;
			currentItem = 0;
			prevItem = 0;
			totalPages = 0;
		};
		obj.free = function () {
			totalPages = 0;
			currentPage = 1;
			totalItem = 0;
			currentItem = 0;
			prevItem = 0;
			components = [];
			parent.innerHTML = "";
			arrows.hideArrow();
		};
		obj.setCurrentpage = function (value) {
			var val = value || 1;
			currentPage = val;
		};
		obj.KeyboardEvent = function (e, eventType) {
			try {
				target = _target(e),
				keyCode = target.keyCode,
				key = globals.keyCodeDic[keyCode];
				switch (eventType) {
				case "keydown":
					id = components[index].id;
					switch (key) {
					case "arrowdown":
						this.leave_focus();
						if ($("#container").css("visibility") != 'visible') {
							normalPlayerContainer.enter_focus();
						} else {
							globals.focusedDom = document.getElementById("inner");
							if ($("#number_curser_01_" + curFocus).css("display") == 'block') {
								$("#number_curser_" + curFocus).css("display", "block");
								$("#number_curser_01_" + curFocus).css("display", "none");
							} else {
								$("#number_curser_" + components1[index1]).css("display", "block");
								$("#number_curser_01_" + components1[index1]).css("display", "none");
							}
						}
						return false;
						break;
					case "arrowup":
						this.leave_focus();
						if (searchMenuContainer.style.visibility == "visible") {
							searchMenuContainer.enter_focus(searchMenuContainer.focusedDom);
						} else {
							menuContainer.enter_focus(menuContainer.focusedDom);
						}
						return true;
						break;
					case "ok":
						if (playerReady) {
							this.leave_focus();
							playerControls.show(data.feed.entry[currentItem].media$group.yt$videoid.$t, this);
						}
						break;
					case "arrowright":
						if (components[currentItem + 1]) {
							prevItem = currentItem;
							components[prevItem].leave_focus();
							components[++currentItem].enter_focus();
						} else {
							if (globals.nextPage.length > 0 && totalPages > 1 && currentPage != totalPages) {
								currentPage++;
								prevItem = currentItem = 0;
								index1 = curFocus % 10 - 1;
								curPg = Math.floor(curFocus / 10) * 10 + 1;
								loadXMLDoc(globals.nextPage[0].href);
								if (index1 < 9) {
									index1++;
									for (var loopVar = 0; loopVar < 10; loopVar++) {
										$("#" + components1[loopVar]).attr("select", false);
										$("#number_curser_01_" + components1[loopVar]).css("display", "none");
									}
									$("#number_curser_01_" + components1[index1]).css("display", "block");
									$("#" + components1[index1]).attr("select", true);
									curFocus = curPg + index1;
								}
								if (this.isVisible()) {
									components[prevItem].leave_focus();
									components[currentItem].enter_focus();
								}
							}
						}
						return true;
						break;
					case "arrowleft":
						if (components[currentItem - 1]) {
							prevItem = currentItem;
							components[prevItem].leave_focus();
							components[--currentItem].enter_focus();
						} else {
							if (globals.prePage.length > 0) {
								currentPage--;
								index1 = curFocus % 10 - 1;
								if (index1 == -1)
									index1 = 9;
								if (index1 == 0) {
									curPg -= 10;
									index1 = 10;
									$("#inner").html("");
									components1 = [];
								}
								curPg = Math.floor(curFocus / 10) * 10 + 1;
								if (curFocus % 10 == 1 || curFocus % 10 == 0) {
									curPg = Math.floor(curFocus / 10) * 10 - 9;
								}
								loadXMLDoc(globals.prePage[0].href);
								if (index1 > 0) {
									index1--;
									for (var loopVar = 0; loopVar < 10; loopVar++) {
										$("#" + components1[loopVar]).attr("select", false);
										$("#number_curser_01_" + components1[loopVar]).css("display", "none");
									}
									$("#number_curser_01_" + components1[index1]).css("display", "block");
									$("#" + components1[index1]).attr("select", true);
									curFocus = curPg + index1;
								}
								prevItem = currentItem = components.length - 1;
								if (this.isVisible()) {
									components[prevItem].leave_focus();
									components[currentItem].enter_focus();
								}
							} else {
								return false;
							}
						}
						return true;
						break;
					}
					break;
				}
			} catch (e) {}

		};
		obj.enter_focus = function () {
			globals.focusedDom = this;
			components[currentItem].enter_focus();
		};
		obj.leave_focus = function () {
			components[currentItem].leave_focus();
		};
		obj.parent = parent;
		return obj;
	})();
	function createArrow() {
		var parent = document.getElementById('bottomGrid'),
		leftArrow = document.createElement('div'),
		rightArrow = document.createElement('div'),
		obj = {};
		leftArrow.className = 'leftArrow';
		leftArrow.id = 'leftArrow';
		parent.appendChild(leftArrow);
		rightArrow.className = 'rightArrow';
		rightArrow.id = 'rightArrow';
		parent.appendChild(rightArrow);
		obj.enableRightArrow = function () {
			rightArrow.style.backgroundPosition = "0px 0px";
		};
		obj.enableLeftArrow = function () {
			leftArrow.style.backgroundPosition = "0px 0px";
		};
		obj.enableBothArrow = function () {
			leftArrow.style.backgroundPosition = "0px 0px";
			rightArrow.style.backgroundPosition = "0px 0px";
		};
		obj.DisableBothArrow = function () {
			leftArrow.style.backgroundPosition = "0px -53px";
			rightArrow.style.backgroundPosition = "0px -53px";
		};
		obj.hideArrow = function () {
			leftArrow.style.visibility = "hidden";
			rightArrow.style.visibility = "hidden";
		};
		obj.showArrow = function () {
			leftArrow.style.visibility = "visible";
			rightArrow.style.visibility = "visible";
		};
		return obj;
	};
	var getdata = function (param) {
		urlList = {
			"popular" : "https://gdata.youtube.com/feeds/api/users/0uRT_armQXqds_rjTjqJ0g/uploads?alt=json&v=2&orderby=viewCount&max-results=5",
			"recently" : "https://gdata.youtube.com/feeds/api/users/0uRT_armQXqds_rjTjqJ0g/uploads?alt=json&v=2&orderby=published&max-results=5",
			"menu" : "https://gdata.youtube.com/feeds/api/users/0uRT_armQXqds_rjTjqJ0g/playlists?v=2&alt=json",
			"menuData" : "https://gdata.youtube.com/feeds/api/playlists/",
			"search" : "https://gdata.youtube.com/feeds/api/users/0uRT_armQXqds_rjTjqJ0g/uploads?alt=json&v=2&orderby=viewCount&max-results=5&q="
		};
		switch (param) {
		case 0:
			loadMenuXMLDoc(urlList.menu);
			break;
		default:
			break;
		}
	};
	var loadXMLDoc = function (url, from) {
		var URL = url;
		var xmlhttp;
		if (window.XMLHttpRequest) {
			xmlhttp = new XMLHttpRequest();
		} else {
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
		xmlhttp.onreadystatechange = function () {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
				try {
					data = JSON.parse(xmlhttp.responseText);
					if (data && data.feed && data.feed.entry && data.feed.entry.length > 0) {
						gridContainer.create(data);
						getPagination(data.feed.link);
						if (searchMenuContainer.style.visibility == "visible") {
							document.getElementById("searchResult").innerHTML = "Resultados(" + (globals.totalResutsErr || 0) + ")";
						}
					} else {
						gridContainer.free();
						pageIndex.reset();
						if (searchMenuContainer.style.visibility == "visible") {
							document.getElementById("searchResult").innerHTML = "Resultados";
							document.getElementById('gridSection').innerHTML = "<div id ='errorMsg'> NENHUM RESULTADO FOI ENCONTRADO PARA A BUSCA<span id = 'errorSearchText'> &nbsp;&nbsp;" + globals.searchValue + "</span><div>";
						} else {
							document.getElementById('gridSection').innerHTML = "<div id ='errorMsg'> Náo foram encontrados resultados<div>";
						}
						pageIndex.hide();
						if (searchMenuContainer.style.visibility == "visible" && !popUp.isVisible) {
							searchMenuContainer.enter_focus(searchMenuContainer.focusedDom);
						} else if (!popUp.isVisible) {
							menuContainer.enter_focus(menuContainer.focusedDom);
						}
						return false;
					}
				} catch (e) {
					gridContainer.free();
					pageIndex.reset();
					if (searchMenuContainer.style.visibility == "visible") {
						document.getElementById("searchResult").innerHTML = "Resultados";
						document.getElementById('gridSection').innerHTML = "<div id ='errorMsg'> NENHUM RESULTADO FOI ENCONTRADO PARA A BUSCA<span id = 'errorSearchText'> &nbsp;&nbsp;" + globals.searchValue + "</span><div>";
					} else {
						document.getElementById('gridSection').innerHTML = "<div id ='errorMsg'> Náo foram encontrados resultados<div>";
					}
					pageIndex.hide();
					if (searchMenuContainer.style.visibility == "visible" && !popUp.isVisible) {
						searchMenuContainer.enter_focus(searchMenuContainer.focusedDom);
					} else if (!popUp.isVisible) {
						menuContainer.enter_focus(menuContainer.focusedDom);
					}
				}
			} else if (xmlhttp.readyState == 4 && xmlhttp.status != 200) {
				gridContainer.free();
				pageIndex.reset();
				if (searchMenuContainer.style.visibility == "visible") {
					document.getElementById("searchResult").innerHTML = "Resultados";
				}
				document.getElementById('gridSection').innerHTML = "<div id ='errorMsg'> Servidor ou rede indisponível..<div>";
				pageIndex.hide();
				if (searchMenuContainer.style.visibility == "visible" && !popUp.isVisible) {
					searchMenuContainer.enter_focus(searchMenuContainer.focusedDom);
				} else if (!popUp.isVisible) {
					menuContainer.enter_focus(menuContainer.focusedDom);
				}
			}
		};
		xmlhttp.open("GET", URL, false);
		xmlhttp.setRequestHeader('X-GData-Key', 'key="' + ytKey + '"');
		try {
			xmlhttp.send();
		} catch (e) {
			gridContainer.free();
			pageIndex.reset();
			if (searchMenuContainer.style.visibility == "visible") {
				document.getElementById("searchResult").innerHTML = "Resultados";
			}
			document.getElementById('gridSection').innerHTML = "<div id ='errorMsg'> Servidor ou rede indisponível..<div>";
			pageIndex.hide();
			if (searchMenuContainer.style.visibility == "visible" && !popUp.isVisible) {
				searchMenuContainer.enter_focus(searchMenuContainer.focusedDom);
			} else if (!popUp.isVisible) {
				menuContainer.enter_focus(menuContainer.focusedDom);
			}
		}
	};
	var loadMenuXMLDoc = function (url) {
		try {
			var xmlhttp;
			if (window.XMLHttpRequest) {
				xmlhttp = new XMLHttpRequest();
			} else {
				xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
			}
			xmlhttp.onreadystatechange = function () {
				if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
					try {
						var list = JSON.parse(xmlhttp.responseText);
						var santosCookieName = getCookie("santosCookieName");
						if (santosCookieName) {
							popUp.isVisible = false;
						} else {
							popUp.create();
						}
						menuCreate(list);
						$("#help").css("visibility", "visible");
					} catch (e) {
						errorPopUp();
					}
				} else if (xmlhttp.readyState == 4 && xmlhttp.status != 200) {
					errorPopUp();
				}
			};
			xmlhttp.open("GET", url, false);
			xmlhttp.setRequestHeader('X-GData-Key', 'key="' + ytKey + '"');
			xmlhttp.send();
		} catch (e) {
			errorPopUp();
		}
	};
	var errorPopUp = function () {
		if ($("#errorPopUp").length)
			return;
		var err = '<div id="errorPopUp">Servidor ou rede indisponível..</div>';
		$("body").append(err);
		document.getElementById("popup_bg").className = "popup_bg";
		$("#popup_bg").css("display", "block");
	}
	var setDescription = function (param) {
		stop_scroll();
		var divScroll = document.getElementById("scroller");
		param.desc = param.desc.replace(/[\r\n]+/g, "<br />");
		divScroll.innerHTML = param.desc || "";
		divScroll.scrollTop = 0;
		document.getElementById("descTitle").innerHTML = "<b>" + param.title + "</b>";
		if ($("#descTitle").text().length > 45) {}
		if ($("#scroller").height() > $("#outerScroller").height()) {
			upArrowContainer.className = "arrowDisabled";
			downArrowContainer.className = "arrowNormal";
			$("#pageContainerDesc").css("visibility", "visible");
		} else {
			upArrowContainer.className = "";
			downArrowContainer.className = "";
			$("#pageContainerDesc").css("visibility", "hidden");
		}
		normalPlayerContainer.changeImg({
			'img' : param.img,
			'video_id' : param.video_id
		});
		len = parseInt($("#scroller").height());
		var outLen = parseInt($("#outerScroller").height());
		var scrollLineLen = parseInt($("#scroller").css("line-height"));
		len = len - outLen;
		while (len - outLen > scrollLineLen) {
			len -= parseInt($("#outerScroller").height());
			pgNum++;
		}
		pgNum++;
		len = parseInt($("#scroller").height());
		$(".rightPg").html(pgNum);
		pgNum = 1;
		$(".leftPg").html(pgNum);
	}
	var createBottomList = function (totalPages, param) {
		if (param != null && menuFocus != -1 && menuFocus != menuContainer.focusDom.focusIndex) {
			pageIndex.reset();
		}
		if (menuFocus == menuContainer.focusDom.focusIndex) {
			$("#inner").html("");
			components1 = [];
		}
		menuFocus = menuContainer.focusDom.focusIndex;
		if (totalPages == 0 || totalPages == 1) {
			$("#container").css("visibility", "hidden");
			$("#pageLeftArrow").css("visibility", "hidden");
			$("#pageRightArrow").css("visibility", "hidden");
			return true;
		}
		$("#container").css("visibility", "visible");
		$("#pageLeftArrow").css("visibility", "visible");
		$("#pageRightArrow").css("visibility", "visible");
		totalPages1 = totalPages;
		var inner = '';
		var max;
		if (curPg + 10 < totalPages) {
			max = curPg + 10;
		} else {
			max = curPg + totalPages % 10;
			if (totalPages % 10 == 0) {
				max = curPg + 10;
			}
		}
		if (totalPages <= 10) {
			$("#pageLeftArrow").css("background-position", "0px -63px");
			$("#pageRightArrow").css("background-position", "-17px -63px");
		} else {
			if (curPg == 1) {
				$("#pageLeftArrow").css("background-position", "0px -63px");
			} else {
				$("#pageLeftArrow").css("background-position", "0px -9px");
			}
			if (max - 1 == totalPages) {
				$("#pageRightArrow").css("background-position", "-17px -63px");
			} else {
				$("#pageRightArrow").css("background-position", "-17px -8px");
			}
		}
		for (var ind = 0, loopVar = curPg; loopVar < max - 1; loopVar++) {
			inner = '<div id="' + loopVar + '" select="false" class="numbers"><div id="digit_' + loopVar + '" class="digit">' + loopVar + '</div><div id="imgContainer_' + loopVar + '"><div class="number_curser" id="number_curser_' + loopVar + '"></div><div class="number_curser_01" id="number_curser_01_' + loopVar + '"></div></div></div><div class="hyphen">-</div>';
			$("#inner").append(inner);
			var digitWidth = parseFloat($("#digit_" + loopVar).css("width"));
			digitWidth += 11;
			$("#digit_" + loopVar).css("width", digitWidth);
			digitWidth = parseFloat($("#" + loopVar).css("width"));
			$("#number_curser_" + loopVar).css("width", digitWidth);
			$("#imgContainer_" + loopVar).css("width", digitWidth);
			digitWidth = (parseFloat($("#imgContainer_" + loopVar).css("width")) - parseFloat($("#number_curser_01_" + loopVar).css("width"))) / 2 + 0.1;
			$("#number_curser_01_" + loopVar).css("margin-left", digitWidth);
			components1[ind] = loopVar;
			ind++;
		}
		inner = '<div  id="' + loopVar + '" select="false" class="numbers"><div id="digit_' + loopVar + '" class="digit">' + loopVar + '</div><div id="imgContainer_' + loopVar + '"><div class="number_curser" id="number_curser_' + loopVar + '"></div><div class="number_curser_01" id="number_curser_01_' + loopVar + '"></div></div>';
		$("#inner").append(inner);
		digitWidth = parseFloat($("#digit_" + loopVar).css("width"));
		digitWidth += 11;
		$("#digit_" + loopVar).css("width", digitWidth);
		digitWidth = parseFloat($("#" + loopVar).css("width"));
		$("#number_curser_" + loopVar).css("width", digitWidth);
		$("#imgContainer_" + loopVar).css("width", digitWidth);
		digitWidth = (parseFloat($("#imgContainer_" + loopVar).css("width")) - parseFloat($("#number_curser_01_" + loopVar).css("width"))) / 2 + 0.1;
		$("#number_curser_01_" + loopVar).css("margin-left", digitWidth);
		components1[ind] = loopVar;
		ind = curPg;
		$("#" + curFocus).attr("select", true);
		$("#number_curser_01_" + ind).css("display", "block");
		findWidth(max);
	}
	findWidth = function (max) {
		var containerWidth = parseFloat($("#container").width());
		var innerWidth = parseFloat($("#inner").width()) + parseFloat($("#pageLeftArrow").width()) + parseFloat($("#pageRightArrow").width());
		innerWidth += parseFloat($("#inner").css("margin-left")) + parseFloat($("#pageRightArrow").css("margin-left"));
		var containerLeft = (containerWidth - innerWidth) / 2;
		$("#pageLeftArrow").css("margin-left", containerLeft);
	}
	searchMenuCreate = function () {
		searchMenuContainer.focusedDom = {};
		searchMenuContainer.focusDom = {
			prevFocusedDom : 0,
			focusIndex : 3,
		};
		var code = "<div id= 'searchResult'>Resultados</div><div id= 'closeSearch'>Fechar Busca</div>";
		searchMenuContainer.innerHTML = code;
		menuContainer.style.visibility = "hidden";
		searchMenuContainer.style.left = '870px';
		searchMenuContainer.style.visibility = 'visible';
		searchMenuContainer.focusedDom = document.getElementById("searchResult");
		searchMenuContainer.focusedDom.className = "menuSelected";
		var api = urlList.search + encodeURIComponent(globals.searchValue);
		clearButtonContainer.style.visibility = 'hidden';
		clearButtonContainer.leave_focus();
		searchContainer.leave_focus();
		gridContainer.reset();
		pageIndex.reset();
		loadXMLDoc(api);
		if (gridContainer.isVisible()) {
			gridContainer.enter_focus();
		} else {
			searchMenuContainer.enter_focus(searchMenuContainer.focusedDom);
		}
	};
	var menuCreate = function (list) {
		try {
			var menuCodeList = {};
			var code = "";
			menuContainer.focusDom = {
				prevFocusedDom : 0,
				focusIndex : 0,
				selectedIndex : 0
			};
			menuContainer.focusedDom = {};
			for (var l in list.feed.entry) {
				globals.menuAPI_Id.push(list.feed.entry[l].yt$playlistId.$t.toString());
				MenusList.push(list.feed.entry[l].title.$t.toString());
			}
			for (var i = 0; i < MenusList.length; i++) {
				menuCodeList[i] = '<div id= menu_' + i + '>' + MenusList[i].toString() + '</div>';
				code += menuCodeList[i];
			}
			menuContainer.innerHTML = code;
			searchMenuContainer.style.visibility = 'hidden';
			menuContainer.focusedDom = document.getElementById("menu_0");
			menuContainer.focusedDom.className = "menuSelected";
			menuContainer.enter_focus = function (param) {
				param.className = "selected";
				globals.focusedDom = this;
				menuContainer.focusedDom = param;
				if (menuContainer.focusDom.selectedIndex != menuContainer.focusDom.focusIndex) {
					var api = "";
					if (menuContainer.focusDom.focusIndex == 0) {
						api = urlList.recently.toString();
					} else if (menuContainer.focusDom.focusIndex == 1) {
						api = urlList.popular.toString();
					} else {
						api = urlList.menuData.toString() + globals.menuAPI_Id[menuContainer.focusDom.focusIndex].toString() + "?v=2&alt=json&max-results=5";
					}
					gridContainer.reset();
					menuContainer.focusDom.selectedIndex = menuContainer.focusDom.focusIndex;
					loadXMLDoc(api);
				}
				menuContainer.focusDom.selectedIndex = menuContainer.focusDom.focusIndex;
			};
			menuContainer.leave_focus = function (param) {
				param.className = "";
			}
			var api = urlList.recently.toString();
			gridContainer.reset();
			loadXMLDoc(api);
			try {
				if (popUp.isVisible) {
					popUp.check();
				} else {
					if (gridContainer.isVisible()) {
						gridContainer.enter_focus();
					} else {
						menuContainer.enter_focus(menuContainer.focusedDom);
					}
				}
			} catch (e) {}
			menuContainer.KeyboardEvent = function (e, eventType) {
				target = _target(e),
				keyCode = target.keyCode,
				key = globals.keyCodeDic[keyCode];
				switch (eventType) {
				case "keydown":
					id = menuContainer.focusedDom.id || "";
					switch (key) {
					case "arrowright":
						try {
							menuContainer.focusedDom = document.getElementById(id);
							if (menuContainer.focusedDom === document.getElementById("menu_" + (MenusList.length - 1))) {
								return true;
							}
							menuContainer.leave_focus(menuContainer.focusedDom);
							menuContainer.focusDom.prevFocusedDom = menuContainer.focusedDom;
							if (document.getElementById("menu_" + (++menuContainer.focusDom.focusIndex))) {
								menuContainer.focusedDom = document.getElementById("menu_" + menuContainer.focusDom.focusIndex);
							} else {
								menuContainer.focusedDom = document.getElementById("menu_0");
								menuContainer.focusDom.focusIndex = 0;
							}
							var width = parseInt(($(menuContainer.focusDom.prevFocusedDom).width()) / 2) + (parseInt($(menuContainer.focusDom.prevFocusedDom).css("margin-right"))) + parseInt(($(menuContainer.focusedDom).width()) / 2)
								globals.animOn = true;
							$("#menu").stop().animate({
								left : "-=" + width + "px"
							}, "slow", function () {
								globals.animOn = false;
								menuContainer.focusedDom.className = "selected";
								menuContainer.enter_focus(menuContainer.focusedDom)
							});
						} catch (e) {}
						return true;
						break;
					case "arrowleft":
						menuContainer.focusedDom = document.getElementById(id);
						if (menuContainer.focusedDom === document.getElementById("menu_" + (0))) {
							return true;
						}
						menuContainer.leave_focus(menuContainer.focusedDom);
						menuContainer.focusDom.prevFocusedDom = menuContainer.focusedDom;
						if (document.getElementById("menu_" + (--menuContainer.focusDom.focusIndex))) {
							menuContainer.focusedDom = document.getElementById("menu_" + menuContainer.focusDom.focusIndex);
						} else {
							var lastOne = MenusList.length - 1;
							menuContainer.focusedDom = document.getElementById("menu_" + lastOne);
							menuContainer.focusDom.focusIndex = lastOne;
						}
						var width = parseInt(($(menuContainer.focusDom.prevFocusedDom).width()) / 2) + (parseInt($(menuContainer.focusDom.prevFocusedDom).css("margin-right"))) + parseInt(($(menuContainer.focusedDom).width()) / 2)
							globals.animOn = true;
						$("#menu").stop().animate({
							left : "+=" + width + "px"
						}, "slow", function () {
							globals.animOn = false;
							menuContainer.focusedDom.className = "selected";
							menuContainer.enter_focus(menuContainer.focusedDom)
						});
						return true;
						break;
					case "arrowup":
						menuContainer.leave_focus(menuContainer.focusedDom);
						menuContainer.focusedDom.className = "menuSelected";
						searchContainer.enter_focus();
						return true;
						break;
					case "arrowdown":
						menuContainer.leave_focus(menuContainer.focusedDom);
						menuContainer.focusedDom.className = "menuSelected";
						if (gridContainer.isVisible()) {
							gridContainer.enter_focus();
							return true;
						} else {
							normalPlayerContainer.enter_focus();
						}
						break;
					}
					return false;
					break;
				}
			};
			searchContainer.enter_focus = function (param) {
				searchContainer.disabled = false;
				globals.focusedDom = searchContainer;
				this.className = "searchCursor";
				$("#searchbox").val("");
				clearButtonContainer.style.visibility = 'visible';
				if ((!param) && ($("#searchbox").width() < 972)) {
					globals.animOn = true;
					$("#searchbox").stop().animate({
						"width" : "+=660px",
						"height" : '+=8px'
					}, "normal", function () {
						globals.animOn = false;
						searchContainer.focus();
					});
				} else {
					searchContainer.focus();
				}
			};
			searchContainer.leave_focus = function (param) {
				searchContainer.blur();
				searchContainer.disabled = true;
				clearButtonContainer.focus();
				this.className = "searching";
				if ((!param) && ($("#searchbox").width() > 312)) {
					globals.animOn = true;
					$("#searchbox").stop().animate({
						"width" : "-=660px",
						"height" : '-=8px'
					}, "normal", function () {
						globals.animOn = false;
						this.className = "normalSearch";
						document.getElementById("searchbox").value = globals.searchValue.substring(0, 27)
							if (globals.searchValue.length == 27) {}

					});
				} else {
					this.className = "searching";
				}
			};
			searchContainer.KeyboardEvent = function (e, eventType) {
				target = _target(e),
				keyCode = target.keyCode,
				key = globals.keyCodeDic[keyCode];
				switch (eventType) {
				case "keydown":
					switch (key) {
					case "arrowup":
						clearButtonContainer.style.visibility = 'hidden';
						this.leave_focus();
						normalPlayerContainer.enter_focus();
						break;
					case "arrowdown":
						clearButtonContainer.style.visibility = 'hidden';
						this.leave_focus();
						if (searchMenuContainer.style.visibility == "visible") {
							searchMenuContainer.enter_focus(searchMenuContainer.focusedDom);
						} else {
							menuContainer.enter_focus(menuContainer.focusedDom);
						}
						break;
					case "arrowright":
						break;
					case "return":
						return true;
						break;
					}
					return false;
				}
			}
			clearButtonContainer.enter_focus = function () {
				globals.focusedDom = this;
				clearButtonContainer.className = "clearcursorButton";
			}
			clearButtonContainer.leave_focus = function () {
				clearButtonContainer.className = "clearnormalButton";
			}
			clearButtonContainer.KeyboardEvent = function (e, eventType) {
				target = _target(e),
				keyCode = target.keyCode,
				key = globals.keyCodeDic[keyCode];
				switch (eventType) {
				case "keydown":
					switch (key) {
					case "arrowleft":
						this.style.visibility = 'visible';
						this.leave_focus();
						searchContainer.enter_focus("noAnim");
						break;
					case "arrowright":
						this.style.visibility = 'visible';
						this.leave_focus();
						searchContainer.enter_focus("noAnim");
						break;
					case "arrowup":
						clearButtonContainer.style.visibility = 'hidden';
						this.leave_focus();
						searchContainer.leave_focus();
						normalPlayerContainer.enter_focus();
						break;
					case "arrowdown":
						clearButtonContainer.style.visibility = 'hidden';
						this.leave_focus();
						searchContainer.leave_focus();
						if (searchMenuContainer.style.visibility == "visible") {
							searchMenuContainer.enter_focus(searchMenuContainer.focusedDom);
						} else {
							menuContainer.enter_focus(menuContainer.focusedDom);
						}
						break;
					case "ok":
						searchContainer.value = "";
						break;
					}
					return true;
				}
				return true;
			}
			upArrowContainer.enter_focus = function () {
				globals.focusedDom = this;
				this.className = "arrowCursor";
			}
			upArrowContainer.leave_focus = function () {
				$("#upArrow").attr("class", "arrowNormal");
			}
			upArrowContainer.KeyboardEvent = function (e, eventType) {
				target = _target(e),
				keyCode = target.keyCode,
				key = globals.keyCodeDic[keyCode];
				switch (eventType) {
				case "keydown":
					switch (key) {
					case "arrowright":
						if (downArrowContainer.className == "arrowNormal") {
							this.leave_focus();
							downArrowContainer.enter_focus();
						}
						return true;
						break;
					case "arrowleft":
						this.leave_focus();
						normalPlayerContainer.enter_focus();
						return true;
						break;
					case "arrowdown":
						this.leave_focus();
						searchContainer.enter_focus();
						return true;
						break;
					case "ok":
						scroll_up();
						return true;
						break;
					}
				}
				return false;
			};
			downArrowContainer.enter_focus = function () {
				globals.focusedDom = this;
				this.className = "arrowCursor";
			};
			downArrowContainer.leave_focus = function () {
				$("#downArrow").attr("class", "arrowNormal");
			}
			downArrowContainer.KeyboardEvent = function (e, eventType) {
				target = _target(e),
				keyCode = target.keyCode,
				key = globals.keyCodeDic[keyCode];
				switch (eventType) {
				case "keydown":
					switch (key) {
					case "arrowleft":
						this.leave_focus();
						if (upArrowContainer.className == "arrowNormal") {
							upArrowContainer.enter_focus();
						} else {
							normalPlayerContainer.enter_focus();
						}
						return true;
						break;
					case "arrowdown":
						this.leave_focus();
						searchContainer.enter_focus();
						return true;
						break;
					case "ok":
						scroll_down();
						return true;
						break;
					}
				}
				return false;
			};
			searchMenuContainer.enter_focus = function (param) {
				param.className = "selected";
				globals.focusedDom = this;
				searchMenuContainer.focusedDom = param;
			};
			searchMenuContainer.leave_focus = function (param) {
				param.className = "";
			}
			searchMenuContainer.KeyboardEvent = function (e, eventType) {
				target = _target(e),
				keyCode = target.keyCode,
				key = globals.keyCodeDic[keyCode];
				switch (eventType) {
				case "keydown":
					id = searchMenuContainer.focusedDom.id || "";
					switch (key) {
					case "arrowright":
						try {
							searchMenuContainer.focusedDom = document.getElementById(id);
							if (searchMenuContainer.focusedDom === document.getElementById("closeSearch")) {
								return true;
							}
							searchMenuContainer.leave_focus(searchMenuContainer.focusedDom);
							searchMenuContainer.focusedDom.className = "menuSelected";
							if (document.getElementById("searchResult")) {
								searchMenuContainer.focusedDom = document.getElementById("closeSearch");
							}
							globals.animOn = true;
							globals.animOn = false;
							searchMenuContainer.focusedDom.className = "selected";
							searchMenuContainer.enter_focus(searchMenuContainer.focusedDom)
						} catch (e) {}
						return true;
						break;
					case "arrowleft":
						searchMenuContainer.focusedDom = document.getElementById(id);
						if (searchMenuContainer.focusedDom === document.getElementById("searchResult")) {
							return true;
						}
						searchMenuContainer.leave_focus(searchMenuContainer.focusedDom);
						searchMenuContainer.focusDom.prevFocusedDom = searchMenuContainer.focusedDom;
						if (document.getElementById("closeSearch")) {
							searchMenuContainer.focusedDom = document.getElementById("searchResult");
						}
						var width = parseInt(($(searchMenuContainer.focusDom.prevFocusedDom).width()) / 2) + (parseInt($(searchMenuContainer.focusDom.prevFocusedDom).css("margin-right"))) + parseInt(($(searchMenuContainer.focusedDom).width()) / 2)
							globals.animOn = true;
						globals.animOn = false;
						searchMenuContainer.focusedDom.className = "selected";
						searchMenuContainer.enter_focus(searchMenuContainer.focusedDom)
						return true;
						break;
					case "arrowup":
						searchMenuContainer.leave_focus(searchMenuContainer.focusedDom);
						if (searchMenuContainer.focusedDom === document.getElementById("searchResult"))
							searchMenuContainer.focusedDom.className = "menuSelected";
						searchMenuContainer.focusedDom = document.getElementById("searchResult");
						searchContainer.enter_focus();
						return true;
						break;
					case "arrowdown":
						searchMenuContainer.leave_focus(searchMenuContainer.focusedDom);
						if (searchMenuContainer.focusedDom === document.getElementById("searchResult"))
							searchMenuContainer.focusedDom.className = "menuSelected";
						searchMenuContainer.focusedDom = document.getElementById("searchResult");
						if (gridContainer.isVisible()) {
							gridContainer.enter_focus();
						} else {
							normalPlayerContainer.enter_focus();
						}
						return true;
						break;
					case "ok":
						if (searchMenuContainer.focusedDom === document.getElementById("closeSearch")) {
							menuContainer.focusedDom = document.getElementById("menu_" + (menuContainer.focusDom.focusIndex));
							menuContainer.focusedDom.className = "menuSelected";
							var api = "";
							if (menuContainer.focusDom.focusIndex == 0) {
								api = urlList.recently.toString();
							} else if (menuContainer.focusDom.focusIndex == 1) {
								api = urlList.popular.toString();
							} else {
								api = urlList.menuData.toString() + globals.menuAPI_Id[menuContainer.focusDom.focusIndex].toString() + "?v=2&alt=json&max-results=5";
							}
							searchMenuContainer.leave_focus(searchMenuContainer.focusedDom);
							menuContainer.style.visibility = "visible";
							searchMenuContainer.style.visibility = 'hidden';
							searchContainer.value = globals.searchDefault;
							globals.searchValue = "Faça sua busca aqui...";
							gridContainer.reset();
							pageIndex.reset();
							loadXMLDoc(api);
							if (gridContainer.isVisible()) {
								gridContainer.enter_focus();
							} else {
								menuContainer.enter_focus(menuContainer.focusedDom);
							}
						}
						return true;
						break;
					}
					return false;
					break;
				}
			}
		} catch (e) {}

	}
	getdata(0);
	function getCookie(cookieName) {
		var c_value = document.cookie;
		var c_start = c_value.indexOf(" " + cookieName + "=");
		if (c_start == -1) {
			c_start = c_value.indexOf(cookieName + "=");
		}
		if (c_start == -1) {
			c_value = null;
		} else {
			c_start = c_value.indexOf("=", c_start) + 1;
			var c_end = c_value.indexOf(";", c_start);
			if (c_end == -1) {
				c_end = c_value.length;
			}
			c_value = unescape(c_value.substring(c_start, c_end));
		}
		return c_value;
	}
	function setCookie(cookieName, value, exdays) {
		try {
			var exdate = new Date();
			exdate.setDate(exdate.getDate() + exdays);
			var c_value = escape(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
			document.cookie = cookieName + "=" + c_value;
		} catch (e) {}

	}
	function del_cookie(name) {
		var c_value = document.cookie;
		document.cookie = c_value + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
	}
	function hide() {
		$("#popup_bg").hide();
		document.getElementById('popUp').style.visibility = "hidden";
		var remember = document.getElementById('remember');
		if (remember.checked) {
			setCookie("cookieName", 1, 365);
		}
		document.getElementById('appear').focus();
	}
}

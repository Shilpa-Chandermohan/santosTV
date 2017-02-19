var pop = "";
playerReady = false;
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
msToString = function (ms) {
	var sec = Math.floor(ms / 1000);
	var min = Math.floor(sec / 60);
	var hrs = Math.floor(min / 60);
	sec -= min * 60;
	min -= hrs * 60;
	return ("0" + hrs).substr(-2, 2) + ":" + ("0" + min).substr(-2, 2) + ":" + ("0" + sec).substr(-2, 2);
};
var player;
function onYouTubeIframeAPIReady() {
	player = new YT.Player('player', {
			height : '1080',
			width : '1920',
			videoId : '',
			playerVars : {
				controls : 0,
				autohide : 0,
				modestbranding : 1,
				showinfo : 1,
				rel : 0,
				iv_load_policy : 3
			},
			events : {
				'onReady' : onPlayerReady,
				'onStateChange' : onPlayerStateChange,
				'onPlaybackQualityChange' : onPlaybackQualityChange,
				'onError' : onError
			}
		});
	video = document.getElementById("player");
	video.className = "player";
	try {
		createMask();
		playerControls.create();
	} catch (e) {}

}
function onPlayerReady(event) {
	playerReady = true;
}
function onPlaybackQualityChange(event) {}
function onPlayerStateChange(event) {
	switch (event.data) {
	case YT.PlayerState.PLAYING:
		playerControls.togglePlay("play");
		playerControls.timeChange();
		playerControls.updateDuration();
		break;
	case YT.PlayerState.PAUSED:
		playerControls.deleteTimeChange();
		playerControls.togglePlay("pause");
		break;
	case YT.PlayerState.BUFFERING:
		playerControls.togglePlay("play");
		playerControls.deleteTimeChange();
		break;
	case YT.PlayerState.ENDED:
		playerControls.deleteTimeChange();
		playerControls.hide();
		playerControls.reset();
		break;
	default:
		playerControls.deleteTimeChange();
		playerControls.reset();
		break;
	}
}
function onError(event) {
	switch (event.data) {
	case 2:
		break;
	case 100:
		break;
	case 101:
		break;
	default:
	}
}
getPlayerState = function () {
	var state = "";
	switch (player.getPlayerState()) {
	case YT.PlayerState.PLAYING:
		state = "playing";
		break;
	case YT.PlayerState.PAUSED:
		state = "paused";
		break;
	case YT.PlayerState.BUFFERING:
		state = "downloading";
		break;
	case YT.PlayerState.ENDED:
		state = "finished";
		break;
	default:
		state = "";
		break;
	}
	return state;
}
function createMask() {
	var playMask = document.createElement('div'),
	buttonMask = document.createElement('div'),
	text = document.createElement('div'),
	player = document.getElementById("playerWrapper");
	playMask.className = "playMask";
	buttonMask.className = "buttonMask";
	text.innerHTML = "";
	text.style.color = "rgb(239, 199, 9)";
	text.className = "playText";
	text.id = "dur";
	player.appendChild(text);
}
Controls = function () {
	var bg = document.createElement('div'),
	seek = document.createElement("input"),
	elapsed = document.createElement('div'),
	duration = document.createElement('div'),
	rewind = document.createElement('div'),
	play = document.createElement('div'),
	forward = document.createElement('div'),
	quality = document.createElement('div'),
	currentItem = 1,
	prevItem = null,
	parent;
	this.components = [];
	this.state = null;
	this.Play_state = "play";
	this.hideTime = 0;
	this.isHidden = false;
	this.create = function () {
		this.components = [];
		parent = document.getElementById("playerWrapper");
		bg.className = "controls_bg";
		bg.id = "controls_bg";
		seek.type = "range";
		seek.value = 0;
		seek.min = 0;
		seek.max = 100;
		seek.step = 1;
		seek.className = "controls_seek";
		elapsed.className = "controls_elapsed";
		duration.className = "controls_duration";
		elapsed.innerHTML = "00:00";
		duration.innerHTML = "00:00";
		play.className = "controls_play";
		rewind.className = "controls_rewind";
		forward.className = "controls_forward";
		bg.appendChild(seek);
		bg.appendChild(elapsed);
		bg.appendChild(duration);
		bg.appendChild(play);
		bg.appendChild(rewind);
		bg.appendChild(forward);
		parent.appendChild(bg);
		play.enter_focus = function () {
			if (getPlayerState() === "paused") {
				play.style.backgroundPosition = "0 -400px";
			} else {
				play.style.backgroundPosition = "0 -200px";
			}
		};
		play.leave_focus = function () {
			if (getPlayerState() === "paused") {
				play.style.backgroundPosition = "0 -500px";
			} else {
				play.style.backgroundPosition = "0 -300px";
			}
		};
		rewind.enter_focus = function () {
			rewind.style.backgroundPosition = "0 -600px";
		};
		rewind.leave_focus = function () {
			rewind.style.backgroundPosition = "0 -700px";
		};
		forward.enter_focus = function () {
			forward.style.backgroundPosition = "0 0";
		};
		forward.leave_focus = function () {
			forward.style.backgroundPosition = "0 -100px";
		};
		this.components = [rewind, play, forward];
	};
	this.timeChange = function () {
		this.timer = setInterval(this.updatePlayer, 250);
	};
	this.deleteTimeChange = function () {
		clearInterval(this.timer);
	};
	this.setSeek = function (skip) {
		skip = skip || 0;
		seek.value = skip;
		value = (seek.value - seek.min) / (seek.max - seek.min);
		seek.style.backgroundImage = ['-webkit-gradient(', 'linear, ', 'left top, ', 'right top, ', 'color-stop(' + value + ', #efc709), ', 'color-stop(' + value + ', grey)', ')'].join('');
	};
	this.resetSeek = function () {
		seek.value = 0;
		seek.style.backgroundImage = [];
	};
	this.resetCursor = function () {
		prevItem = currentItem = 1;
	};
	this.updateDuration = function () {
		duration.innerHTML = formatTime(player.getDuration());
	};
	this.updateElapsed = function (time) {
		var current = time || player.getCurrentTime();
		elapsed.innerHTML = formatTime(current);
	};
	this.reset = function () {
		duration.innerHTML = "00:00";
		elapsed.innerHTML = "00:00";
		this.resetSeek();
		this.resetCursor();
	};
	this.togglePlay = function (val) {
		var state = val || "play";
		if (getPlayerState() === "paused") {
			if (currentItem === 1) {
				play.style.backgroundPosition = "0 -400px";
			} else {
				play.style.backgroundPosition = "0 -500px";
			}
		} else {
			if (currentItem === 1) {
				play.style.backgroundPosition = "0 -200px";
			} else {
				play.style.backgroundPosition = "0 -300px";
			}
		}
	};
	this.play_pause = function () {
		if (getPlayerState() == "playing") {
			player.pauseVideo();
		} else if (getPlayerState() == "paused") {
			player.playVideo();
		}
	};
	this.stopVideo = function () {
		player.stopVideo();
	};
	this.seekForward = function () {
		var jump = (player.getCurrentTime() + 10) * (100 / player.getDuration());
		playerControls.setSeek(jump);
		this.updateElapsed(player.getCurrentTime() + 10);
		player.seekTo(player.getCurrentTime() + 10, true);
		if (getPlayerState() == "paused") {
			player.playVideo();
		}
	};
	this.seekBackward = function () {
		var jump = (player.getCurrentTime() - 10) * (100 / player.getDuration());
		playerControls.setSeek(jump);
		((player.getCurrentTime() - 10) > 0) ? this.updateElapsed(player.getCurrentTime() - 10) : this.updateElapsed(0000);
		player.seekTo(player.getCurrentTime() - 10, true);
		if (getPlayerState() == "paused") {
			player.playVideo();
		}
	};
	this.autoShow = function () {
		try {
			this.isHidden = false;
			this.hideTime = 0;
			bg.style.visibility = "visible";
		} catch (e) {}

	};
	this.autoHide = function () {
		try {
			this.isHidden = true;
			bg.style.visibility = "hidden";
		} catch (e) {}

	};
	this.updatePlayer = function () {
		try {
			var jump = player.getCurrentTime() * (100 / player.getDuration());
			playerControls.setSeek(jump);
			playerControls.updateElapsed();
			playerControls.hideTime++;
			if (playerControls.hideTime >= 20) {
				playerControls.autoHide();
				playerControls.hideTime = 0;
			}
		} catch (e) {
			clearInterval(playerControls.timer);
		}
	};
	this.state = null;
	this.orgin = null;
	this.KeyboardEvent = function (e, eventType) {
		target = _target(e),
		keyCode = target.keyCode,
		key = globals.keyCodeDic[keyCode];
		if (this.isHidden) {
			this.autoShow();
			e.preventDefault();
			return true;
		}
		if (getPlayerState() == "downloading" && key != "return") {
			e.preventDefault();
			return true;
		}
		switch (eventType) {
		case "keydown":
			switch (key) {
			case "arrowdown":
				return false;
				break;
			case "arrowup":
				return true;
				break;
			case "ok":
				this.setAction(currentItem);
				return false;
				break;
			case "arrowright":
				if (this.components[currentItem + 1]) {
					prevItem = currentItem;
					this.components[prevItem].leave_focus();
					this.components[++currentItem].enter_focus();
				} else {
					this.components[currentItem].leave_focus();
					this.components[0].enter_focus();
					prevItem = currentItem = 0;
				}
				return true;
				break;
			case "arrowleft":
				if (this.components[currentItem - 1]) {
					prevItem = currentItem;
					this.components[prevItem].leave_focus();
					this.components[--currentItem].enter_focus();
				} else {
					this.components[currentItem].leave_focus();
					this.components[this.components.length - 1].enter_focus();
					prevItem = currentItem = this.components.length - 1;
				}
				return true;
				break;
			case "return":
				try {
					e.preventDefault();
					this.hide(e);
				} catch (e) {}
				return true;
				break;
			case "red":
				player.setPlaybackQuality("hd720");
				player.setPlaybackQuality("hd720");
				return true;
				break;
			case "green":
				player.setPlaybackQuality("medium");
				player.setPlaybackQuality("medium");
				return true;
				break;
			case "yellow":
				player.setPlaybackQuality("hd1080");
				player.setPlaybackQuality("hd1080");
				return true;
				break;
			case "blue":
				return true;
				break;
			}
			break;
		}
	};
	this.enter_focus = function () {
		globals.focusedDom = this;
		this.components[currentItem].enter_focus();
	};
	this.leave_focus = function () {
		this.components[currentItem].leave_focus();
	};
	this.setAction = function (index) {
		var val = index;
		switch (val) {
		case 0:
			this.seekBackward();
			break;
		case 1:
			this.play_pause();
			break;
		case 2:
			this.seekForward();
			break;
		default:
			break;
		}
	};
	this.qualityOption = function (param) {
		var bg = document.createElement('div'),
		text = document.createElement('div');
		bg.className = "qualityItem_bg";
		bg.id = "qualityItem_bg";
		text.className = "qualityItem_text";
		text.id = "qualityItem_text";
		text.innerHTML = param;
		bg.appendChild(text);
		return bg;
	};
	this.createSetting = function () {
		var QualityList = player.getAvailableQualityLevels(),
		parent = document.getElementById("controls_bg"),
		bg = document.createElement('div'),
		heading = document.createElement('div'),
		qualityMenu = document.createElement('div');
		heading.className = "quality_heading";
		qualityMenu.className = "quality_menu";
		heading.innerHTML = "Quality";
		if (document.getElementById("settingMenu")) {
			parent.removeChild(parent.childNodes[parent.childNodes.length - 1]);
		}
		bg.appendChild(heading);
		bg.className = "settingMenu";
		bg.id = "settingMenu";
		document.getElementById("dur").innerHTML = QualityList;
		parent.appendChild(bg);
		for (var val in QualityList) {
			qualityMenu.appendChild(this.qualityOption(QualityList[val]));
		}
		bg.appendChild(qualityMenu);
	};
	this.show = function (id, from) {
		try {
			this.orgin = from;
			this.parent = document.getElementById("playerWrapper");
			this.parent.style.display = "inline";
			video.style.display = "inline";
			this.enter_focus();
			player.loadVideoById({
				'videoId' : id,
				'suggestedQuality' : 'default'
			});
		} catch (e) {}

	};
	this.hide = function (e) {
		document.body.style.overflow = "visible";
		this.stopVideo();
		video.style.display = "none";
		this.parent.style.display = "none";
		this.leave_focus();
		this.orgin.enter_focus();
		playerControls.deleteTimeChange();
		this.reset();
	};
};
function Button(param) {
	var bg = document.createElement('div');
	bg.id = "btn_" + param.id;
	bg.className = param.classname;
	return bg;
};
playerControls = new Controls();

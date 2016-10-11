/*
	Issue: Pybossa always mark tutorial as seen on serverside after first load 
	no matter user click skip tutorial or user complete the tutorial or not.

	Solution : store tutorial state like "skipped", "complete" in another cookie.

	Other system like 
	- the tutorial template, 
	- login modal 
	can use that cookie to decide to open the tutorial again or not.
*/
(function(){
	//create our own namespace
	var tutorial = window.pybossaTutorial = {};

	//
	tutorial.setStage = setStage;
	tutorial.getStage = getStage;
	tutorial.isSkippedOrComplete = isSkippedOrComplete;
	tutorial.setSkipped = setSkipped;
	tutorial.setComplete = setComplete;

	function setStage(stage) {
		createCookie('decode-darfurtutorial-stage', stage, 120);
	}

	function getStage() {
		return readCookie('decode-darfurtutorial-stage');	
	}

	function isSkippedOrComplete() {
		var state = getStage() ;
		if (state == 'skipped' || state == 'complete') {
			return true;
		}
		return false;
	}

	function setSkipped() {
		setStage('skipped');
	}

	function setComplete() {
		setStage('complete');
	}

	//cookie method
	function createCookie(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	}

	function readCookie(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}

	function eraseCookie(name) {
		createCookie(name,"",-1);
	}

})();
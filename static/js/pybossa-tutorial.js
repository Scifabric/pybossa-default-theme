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
	tutorial.open	= open

	var currentProject = window.settings.currentProject;

	function setStage(stage) {
		createCookie(currentProject + '-tutorial-stage', stage, 120);
	}

	function getStage() {
		return readCookie(currentProject + '-tutorial-stage');	
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

	function open() {
		var currentProject = window.settings.currentProject;
		window.location.href = "/project/" + currentProject + "/tutorial";
	}

})();

(function(){
	// when should we open tutorial 
	// ----------------------------

	//we are in tutorial
	if(window.isInTutorial){
		return;
	}

	var currentProject = window.settings.currentProject;
	//we are in page tutorial
	if (window.location.href.indexOf("/project/" + currentProject + "/tutorial") !== -1) {
		return;
	}

	//we are in login/register modal
	if (window.location.href.indexOf("modal=all") !== -1 
		|| window.location.href.indexOf("modal=login") !== -1 
		|| window.location.href.indexOf("modal=register") !== -1 
		) {
		return;
	}

	//use already click skip or complete tutorial
	if (window.pybossaTutorial.isSkippedOrComplete()) {
		return;
	}
	window.location.href = "/project/" + currentProject + "/tutorial";
	//
})();
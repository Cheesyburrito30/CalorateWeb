$(function(){
	let WorkoutLog = (function($, undefined) {
		let API_BASE = "https://cheesyworkoutlog-api.herokuapp.com/api/"
		let userDefinitions=[]
		let setAuthHeader = function(sessionToken) {
			window.localStorage.setItem("sessionToken", sessionToken)
				//set the authorization header
				//this can be done in individual calls
				//here we showcase ajaxSetup as a global tool
				$.ajaxSetup({
					"headers": {
						"Authorization":sessionToken
					}
				})
		}
		//public
		return {
			API_BASE: API_BASE,
			setAuthHeader: setAuthHeader
		}

	})(jQuery)
	//make sure .disabled isn't clickable
	$('.nav-tabs a[data-toggle="tab"]').click(function(e){
		var token = window.localStorage.getItem("sessionToken")
		if ($(this).hasClass("disabled") && !token) {
			e.preventDefault()
			return false
		}
	})
	//bind tab change events
	$('a[data-toggle="tab"]').on('shown.bs.tab', function(e){
		let target = $(e.target).attr("href")	//activated tab
		if (target === "#log"){
			WorkoutLog.log.setDefinitions()
		}
		if (target === "#update-log") {
			WorkoutLog.log.setDefinitions()
		}
		if (target === "#history") {
			WorkoutLog.log.setHistory()
		}
	})
	//bind enter key
	$(document).keypress(function(e) {
		if (e.which === 13) {	//enter key
			if ($("#signup-modal").is(":visible")) {
				$("#signup").trigger("click")
			}
			if ($("#login-modal").is(":visible")) {
				$("#login").trigger("click")
			}
		}
	})
	let token = window.localStorage.getItem("sessionToken")
	if (token) {
		WorkoutLog.setAuthHeader(token)
	}
	//expose this to other workoutlog modules
	window.WorkoutLog = WorkoutLog

})
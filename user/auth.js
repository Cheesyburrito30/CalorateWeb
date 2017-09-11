$(function(){
	$.extend( WorkoutLog, {
//signup method
	signup: function(){
			//User/PW Vars
			let username=$('#su_username').val()
			let password=$('#su_password').val()
			//user object
			let user={user:{username: username,password: password}}
		//signup post
		let signup = $.ajax({	
				type: "POST",
				url: WorkoutLog.API_BASE + "user",
				data: JSON.stringify( user ),
				contentType: "application/json"
			})
		//signupdon/fail
		signup.done(function(data){
			if (data.sessionToken){
				WorkoutLog.setAuthHeader(data.sessionToken)
				WorkoutLog.definition.fetchAll()
				WorkoutLog.log.fetchAll()
			}

			$('#signup-modal').modal("hide")
			$('.disabled').removeClass("disabled")
			$('#loginout').text("Logout")
			$("a[href='#define']").tab('show')
			console.log("worked")
		}).fail(function(){
			$("#su_error").text("There was an issue with sign up").show()
		})

	},
//login method
	login: function(){
		let username= $("#li_username").val()
		let password= $("#li_password").val()
		let user = {user:{ username:username, password:password}}
		let login = $.ajax({
			type: 'POST',
			url: WorkoutLog.API_BASE + "login",
			data: JSON.stringify( user ),
			contentType: "application/json"
		})
	//done/fail
		login.done(function(data) {
			if (data.sessionToken) {
				WorkoutLog.setAuthHeader(data.sessionToken)
				WorkoutLog.definition.fetchAll()
				WorkoutLog.log.fetchAll()
			}
			$("#login-modal").modal("hide")
			$(".disabled").removeClass("disabled")
			$("#loginout").text("Logout")
			$("#li_username").val("")
			$("#li_password").val("")
			$("a[href='#define']").tab('show')

		}).fail(function(){
			$("#li_error").text("There was an issue with sign up").show()
		})
	},
	//loginout method 
		loginout: function(data){
			console.log("clicked")
			if (window.localStorage.getItem("sessionToken")){
					window.localStorage.removeItem("sessionToken")
						$("#loginout").text("Login")
					window.location.reload()
			}
		}

		})

	//Bind Events
		$("#login").on("click", WorkoutLog.login)
		$("#signup").on("click", WorkoutLog.signup)
		$("#loginout").on("click", WorkoutLog.loginout)

		if (window.localStorage.getItem("sessionToken")) {
			$("#loginout").text("logout")
		}
})
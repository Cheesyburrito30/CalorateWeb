$(function(){
	$.extend( WorkoutLog, {
//signup method
	signup: function(){
			//User/PW Vars
			let age = $("#su_age").val
			let height = $("#su_height").val
			let startWeight = $("#su_startWeight").val()
			let goalWeight = $("#su_goalWeight").val()
			let userGender = $("#su_userGender").val()
			let username=$("#su_username").val()
			let password=$("#su_password").val()
			let confirmPW =$("#su_confirmPW").val()
			let email = $("#su_email").val()
			//user object
			let user={user:{username: username, password: password, 
				email: email, age:age, height:height,
				startweight:startWeight, goalweight:goalWeight, 
				gender:userGender}}
		//signup post
		let signup = (function(){
			if(confirmPW === password){

				$.ajax({	
					type: "POST",
					url: WorkoutLog.API_BASE + "user",
					data: JSON.stringify( user ),
					contentType: "application/json"
				})
				.done(function(data){
				if (data.sessionToken){
					WorkoutLog.setAuthHeader(data.sessionToken)
					WorkoutLog.definition.fetchAll()
					WorkoutLog.log.fetchAll()
				}
				$('#signup-modal').modal("hide")
				$('.disabled').removeClass("disabled")
				$(".hidden").removeClass("hidden")
				$('#loginout').text("Logout")
				$("a[href='#define']").tab('show')
				console.log("worked")
				})
				.fail(function(){
					$("#su_error").text("There was an issue with sign up").show()
				})
			}else{
				$("#su_error").text("Passwords don't match").show()
				$("#su_password").val("")
				$("#su_confirmPW").val("")
			}
		})()
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
			$(".hidden").removeClass("hidden")
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
			$("#home").removeClass("active")
			$("a[href='#define']").tab("show")
			$(".hidden").removeClass("hidden")
		}
})
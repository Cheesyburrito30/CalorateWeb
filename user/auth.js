$(function(){
	$.extend( WorkoutLog, {
//signup method
user:{
	profile: [],
	signup: function(){
			//User/PW Vars
			let age = $("#su_age").val()
			let height = $("#su_height").val()
			let startWeight = $("#su_startWeight").val()
			let goalWeight = $("#su_goalWeight").val()
			let userGender = $("#su_userGender").val()
			let username=$("#su_username").val()
			let password=$("#su_password").val()
			let confirmPW =$("#su_confirmPW").val()
			let email = $("#su_email").val()
			let BMI = (function(){
				let bmiWeight = startWeight * 0.45
				let bmiHeight = (height * 0.025) * (height * 0.025)
				return Math.floor(bmiWeight/bmiHeight)
			})()
			let REE = (function(){
				let weight = startWeight*0.45
				let HEIGHT = height*2.54
				return Math.floor(10*weight + 6.25*HEIGHT + 5*age + 5 )
			})()
			//user object
			let user={
				user:{
					username: username, 
					password: password, 
					email: email, 
					age:age, 
					height:height,
					startweight:startWeight,
					BMI: BMI, 
					REE: REE,
					goalweight:goalWeight, 
					gender:userGender
				}
			}
			console.log(user)
			
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
					window.localStorage.setItem('Profile', JSON.stringify(data.user))
					WorkoutLog.log.fetchAll()
				}
				$('#signup-modal').modal("hide")
				$('.disabled').removeClass("disabled")
				$(".hidden").removeClass("hidden")
				$('#loginout').text("Logout")
				$("a[href='#profile']").tab('show')
				WorkoutLog.user.profile.push(data.user)
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
				window.localStorage.setItem('Profile', JSON.stringify(data.user))
				WorkoutLog.setAuthHeader(data.sessionToken)
				WorkoutLog.log.fetchAll()
			}
			$("#login-modal").modal("hide")
			$(".disabled").removeClass("disabled")
			$(".hidden").removeClass("hidden")
			$("#li_username").val("")
			$("#li_password").val("")
			$("a[href='#profile']").tab('show')

		}).fail(function(){
			$("#li_error").text("There was an issue with sign up").show()
		})
	},
	//loginout method 
		logout: function(data){
			console.log("clicked")
			if (window.localStorage.getItem("sessionToken")){
					window.localStorage.clear()
					window.location.reload()
			}
		},
		setProfile: function(){
			console.log('setting profile!')
			let user = JSON.parse(window.localStorage.getItem("Profile"))
			let goalPro = Math.floor(user.startweight*0.825)
			let goalFats = Math.floor(user.REE*0.25) //FAT CALORIES
			let goalCarb = Math.floor(user.REE-((goalPro*4)+(goalFats)))
			$("#profileUN").html(user.username)
			$("#profileAge").html(user.age)
			$("#profileHeight").html(user.height)
			$("#profileSW").html(user.startweight)
			$("#profileCW").html(user.startweight)
			$("#profileGW").html(user.goalweight)
			$("#profileBMI").html(user.BMI)
			$("#goalCal").html(user.REE)
			$("#goalPro").html(goalPro)
			$("#goalCarb").html(Math.floor(goalCarb/4))//DIVIDE BY 4 TO GET GRAMS
			$("#goalFats").html(Math.floor(goalFats/9)) //DIVIDE BY NINE TO GET GRAMS 
		}
}
		})

	//Bind Events
		$("#login").on("click", WorkoutLog.user.login)
		$("#signup").on("click", WorkoutLog.user.signup)
		$("#logout").on("click", WorkoutLog.user.logout)

		if (window.localStorage.getItem("sessionToken")) {
			$("#home").removeClass("active")
			$("a[href='#profile']").tab("show")
			$(".hidden").removeClass("hidden")
			$(".disabled").removeClass(".disabled")
		}
})
$(function(){
	$.extend(WorkoutLog,{
		log:{
			meals:[],
			setHistory: function(){
				let history = WorkoutLog.log.meals
				let len = history.length
				let lis=""
				for (let i = 0; i < len; i++) {
					let dateMade = history[i].createdAt.slice(0, 10)
					lis +=
		'<div class="panel panel-default">' +
    	'<div class="panel-heading" role="tab" id="' + history[i].name + '">' +
    	'<h4 class="panel-title"><a role="button" data-toggle="collapse" data-parent="#accordion" href="#' + history[i].id + '" aria-expanded="true" aria-controls="' + history[i].id + '">'+
		dateMade + " " + history[i].name + '</a></h4></div>' +
    	'<div id="' + history[i].id + '" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="' + history[i].name + '">' +
        '<div class="panel-body">' +
        '<ul>' +
        "<li> Total Calories: " + history[i].calories +"</li>" +
		"<li> Total Protein: " + history[i].protein +"</li>" +
		"<li> Total Fat: " + history[i].fat +"</li>" +
		"<li> Total Carbs: " + history[i].carbs +"</li>" +
		"</ul>" + 
        '</div></div></div>'
						}
				$("#accordion").children().remove()
				$("#accordion").append(lis)
			},
			create: function(event) {
				event.preventDefault()
				let servings = $("#mealServings").val()
				let name= $("#mealName").val()
				let type = $("#mealType").val()
				let cals = $("#mealCals").val() * servings
				let protein = $("#mealProtein").val() * servings
				let fat = $("#mealFat").val() * servings
				let carbs = $("#mealCarbs").val() * servings
				

				let meal = {
					name: name,
					type: type,
					calories: cals,
					protein: protein,
					fat: fat,
					carbs: carbs,
					servings: servings
				}
				console.log(meal)
				let postData = {log: meal}
				let logger= $.ajax({
					type:"POST",
					url: WorkoutLog.API_BASE + "log",
					data: JSON.stringify(postData),
					contentType: "application/json"
				})
				logger.done(function(data){
					WorkoutLog.log.meals.push(data)
					console.log('done done done')
					$("#mealName").val("")
					$("#mealCals").val("")
					$("#mealProtein").val("")
					$("#mealFat").val("")
					$("#mealCarbs").val("")
					$("#mealServings").val("")
					$('a[href="#history"]').tab("show")
				})
			},

			getWorkout: function() {
				let thisLog = {id: $(this).attr('id')}
				console.log(thisLog)
				let logID = thisLog.id
				let updateData = {log: thisLog}
				let getLog = $.ajax({
					type: "GET",
					url: WorkoutLog.API_BASE + 'log/' + logID,
					data: JSON.stringify(updateData),
					contentType: "application/json"
				})
				getLog.done(function(data){
					$("a[href='#update-log']").tab('show')
					$("#update-result").val(data.result)
					$("#update-description").val(data.description)
					$("#update-id").val(data.id)
				})
			},
			updateWorkout: function(){
				$("#update").text('Update')
				let updateLog = {
					id: $("#update-id").val(),
					desc: $("#update-description").val(),
					result: $("#update-result").val(),
					def: $("#update-definition option:selected").text()
				}
				for(let i = 0; i < WorkoutLog.log.workouts.length; i++){
					if(WorkoutLog.log.workouts[i].id == updateLog.id){
						WorkoutLog.log.workouts.splice(i, 1)
					}
				}
				WorkoutLog.log.workouts.push(updateLog)
				let updateLogData = {log: updateLog}
				let updater = $.ajax({
					type: "PUT",
					url: WorkoutLog.API_BASE + "log",
					data: JSON.stringify(updateLogData),
					contentType: "application/json"
				})
				updater.done(function(data){
					console.log(data)
					$("#update-description").val("")
					$("#update-result").val("")
					$("a[href='#history']").tab("show")
				})
			},
			delete: function() {   
				let thisLog = {
					//"this" is the button on the li
					//.attr("id") targets the value of the id attribute of button
					id: $(this).attr("id")
				}
				let deleteData = { log: thisLog }
				let deleteLog = $.ajax({
					type: "DELETE",
					url: WorkoutLog.API_BASE + "log",
					data: JSON.stringify(deleteData),
					contentType: "application/json"
				})
				//removes list item
				//references button them grabs closest li
				$(this).closest("li").remove()  // looks at itself to see if it is an 
												// "li" and if it doesn't then it looks up the branch
				//deletes item out of workouts array
				for (let i=0; i < WorkoutLog.log.meals.length; i++){
					if (WorkoutLog.log.meals[i].id == thisLog.id){
						WorkoutLog.log.meals.splice(i, 1)
					}
				}
				deleteLog.fail(function(){
					console.log("nope, you didn't delete it")
				})
			},
			fetchAll: function() {
				let fetchDefs = $.ajax({
					type: "GET",
					url: WorkoutLog.API_BASE + "log",
					headers: {
						"authorization": window.localStorage.getItem("sessionToken")
					}
				})
				.done(function(data){
					WorkoutLog.log.meals = data
				})
				.fail(function(err){
					console.log(err)
				})
			}
		}
	})
	$("#newMealSave").on("click", WorkoutLog.log.create)
	$("#history-list").delegate('.remove', 'click', WorkoutLog.log.delete)
	$("#log-update").on('click', WorkoutLog.log.updateWorkout)
	$("#history-list").delegate('.update', 'click', WorkoutLog.log.getWorkout)


	//fetch history if we already are authenticated and refreshed
	if(window.localStorage.getItem("sessionToken")){
		WorkoutLog.log.fetchAll()
	}






})
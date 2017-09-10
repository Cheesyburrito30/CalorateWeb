"use strict";$(function(){var o=function(o,t){return{API_BASE:"https://cheesyworkoutlog-api.herokuapp.com/api/",setAuthHeader:function(t){window.localStorage.setItem("sessionToken",t),o.ajaxSetup({headers:{Authorization:t}})}}}(jQuery);$('.nav-tabs a[data-toggle="tab"]').click(function(o){var t=window.localStorage.getItem("sessionToken");if($(this).hasClass("disabled")&&!t)return o.preventDefault(),!1}),$('a[data-toggle="tab"]').on("shown.bs.tab",function(t){var e=$(t.target).attr("href");"#log"===e&&o.log.setDefinitions(),"#update-log"===e&&o.log.setDefinitions(),"#history"===e&&o.log.setHistory()}),$(document).keypress(function(o){13===o.which&&($("#signup-modal").is(":visible")&&$("#signup").trigger("click"),$("#login-modal").is(":visible")&&$("#login").trigger("click"))});var t=window.localStorage.getItem("sessionToken");t&&o.setAuthHeader(t),window.WorkoutLog=o}),$(function(){$.extend(WorkoutLog,{definition:{userDefinitions:[],create:function(){var o={definition:{desc:$("#def-description").val(),type:$("#def-logtype").val()}};$.ajax({type:"POST",url:WorkoutLog.API_BASE+"definition",data:JSON.stringify(o),contentType:"application/json"}).done(function(o){WorkoutLog.definition.userDefinitions.push(o.definition),$("#def-description").val(""),$("#def-logtype").val(""),$("a[href='#log']").tab("show")})},fetchAll:function(){$.ajax({type:"GET",url:WorkoutLog.API_BASE+"definition",headers:{authorization:window.localStorage.getItem("sessionToken")}}).done(function(o){WorkoutLog.definition.userDefinitions=o}).fail(function(o){console.log(o)})}}}),$("#def-save").on("click",WorkoutLog.definition.create),window.localStorage.getItem("sessionToken")&&WorkoutLog.definition.fetchAll()}),$(function(){$.extend(WorkoutLog,{log:{workouts:[],setDefinitions:function(){for(var o=WorkoutLog.definition.userDefinitions,t=o.length,e=void 0,i=0;i<t;i++)e+="<option value='"+o[i].id+"'>"+o[i].description+"</option>";$("#log-definition").children().remove(),$("#log-definition").append(e),$("#update-definition").children().remove(),$("#update-definition").append(e)},setHistory:function(){for(var o=WorkoutLog.log.workouts,t=o.length,e="",i=0;i<t;i++)e+="<li class='list-group-item'>"+o[i].def+" - "+o[i].result+' <div class= "pull-right"><button id ="'+o[i].id+'" class = "update"><strong>U</strong></button><button id ="'+o[i].id+'" class = "remove"><strong>X</strong></button></div></li>';$("#history-list").children().remove(),$("#history-list").append(e)},create:function(){var o={log:{desc:$("#log-description").val(),result:$("#log-result").val(),def:$("#log-definition option:selected").text()}};$.ajax({type:"POST",url:WorkoutLog.API_BASE+"log",data:JSON.stringify(o),contentType:"application/json"}).done(function(o){WorkoutLog.log.workouts.push(o),$("#log-result").val(""),$("#log-description").val(""),$("#def-logtype").val(""),$("a[href='#history']").tab("show")})},getWorkout:function(){var o={id:$(this).attr("id")};console.log(o);var t=o.id,e={log:o};$.ajax({type:"GET",url:WorkoutLog.API_BASE+"log/"+t,data:JSON.stringify(e),contentType:"application/json"}).done(function(o){$("a[href='#update-log']").tab("show"),$("#update-result").val(o.result),$("#update-description").val(o.description),$("#update-id").val(o.id)})},updateWorkout:function(){$("#update").text("Update");for(var o={id:$("#update-id").val(),desc:$("#update-description").val(),result:$("#update-result").val(),def:$("#update-definition option:selected").text()},t=0;t<WorkoutLog.log.workouts.length;t++)WorkoutLog.log.workouts[t].id==o.id&&WorkoutLog.log.workouts.splice(t,1);WorkoutLog.log.workouts.push(o);var e={log:o};$.ajax({type:"PUT",url:WorkoutLog.API_BASE+"log",data:JSON.stringify(e),contentType:"application/json"}).done(function(o){console.log(o),$("#update-description").val(""),$("#update-result").val(""),$("a[href='#history']").tab("show")})},delete:function(){var o={id:$(this).attr("id")},t={log:o},e=$.ajax({type:"DELETE",url:WorkoutLog.API_BASE+"log",data:JSON.stringify(t),contentType:"application/json"});$(this).closest("li").remove();for(var i=0;i<WorkoutLog.log.workouts.length;i++)WorkoutLog.log.workouts[i].id==o.id&&WorkoutLog.log.workouts.splice(i,1);e.fail(function(){console.log("nope, you didn't delete it")})},fetchAll:function(){$.ajax({type:"GET",url:WorkoutLog.API_BASE+"log",headers:{authorization:window.localStorage.getItem("sessionToken")}}).done(function(o){WorkoutLog.log.workouts=o}).fail(function(o){console.log(o)})}}}),$("#log-save").on("click",WorkoutLog.log.create),$("#history-list").delegate(".remove","click",WorkoutLog.log.delete),$("#log-update").on("click",WorkoutLog.log.updateWorkout),$("#history-list").delegate(".update","click",WorkoutLog.log.getWorkout),window.localStorage.getItem("sessionToken")&&WorkoutLog.log.fetchAll()}),$(function(){$.extend(WorkoutLog,{signup:function(){var o={user:{username:$("#su_username").val(),password:$("#su_password").val()}},t=$.ajax({type:"POST",url:WorkoutLog.API_BASE+"user",data:JSON.stringify(o),contentType:"application/json"});t.done(function(o){o.sessionToken&&(WorkoutLog.setAuthHeader(o.sessionToken),WorkoutLog.definition.fetchAll(),WorkoutLog.log.fetchAll()),$("#signup-modal").modal("hide"),$(".disabled").removeClass("disabled"),$("#loginout").text("Logout"),$("a[href='#define']").tab("show"),console.log("worked")}).fail(function(){$("#su_error").text("There was an issue with sign up").show()})},login:function(){var o={user:{username:$("#li_username").val(),password:$("#li_password").val()}},t=$.ajax({type:"POST",url:WorkoutLog.API_BASE+"login",data:JSON.stringify(o),contentType:"application/json"});t.done(function(o){o.sessionToken&&(WorkoutLog.setAuthHeader(o.sessionToken),WorkoutLog.definition.fetchAll(),WorkoutLog.log.fetchAll()),$("#login-modal").modal("hide"),$(".disabled").removeClass("disabled"),$("#loginout").text("Logout"),$("#li_username").val(""),$("#li_password").val(""),$("a[href='#define']").tab("show")}).fail(function(){$("#li_error").text("There was an issue with sign up").show()})},logininout:function(o){window.localStorage.getItem("sessionToken")&&(window.localStorage.removeItem("sessionToken"),$("#loginout").text("Login"))}}),$("#login").on("click",WorkoutLog.login),$("#signup").on("click",WorkoutLog.signup),$("#loginout").on("click",WorkoutLog.loginout),window.localStorage.getItem("sessionToken")&&$("#loginout").text("logout")});
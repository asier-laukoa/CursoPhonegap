// Wait for device API libraries to load
//
document.addEventListener("deviceready", onDeviceReady, false);


// LOCAL DB

	var app = {};
	app.db = null;
	      
	app.openDb = function() {
		// For debugin in simulator fallback to native SQL Lite
		console.log("Use built in SQL Lite");
		app.db = window.openDatabase("Todo", "1.0", "Cordova Demo", 200000);
	}
	      
	app.createTable = function() {
		var db = app.db;
		db.transaction(function(tx) {
			tx.executeSql("CREATE TABLE IF NOT EXISTS todo(ID INTEGER PRIMARY KEY ASC, todo TEXT, added_on DATETIME)", []);
		});
	}
	      
	app.addTodo = function(todoText) {
		var db = app.db;
		db.transaction(function(tx) {
			var addedOn = new Date();
			tx.executeSql("INSERT INTO todo(todo, added_on) VALUES (?,?)",
						  [todoText, addedOn],
						  app.onSuccess,
						  app.onError);
		});
	}
	      
	app.onError = function(tx, e) {
		console.log("Error: " + e.message);
	} 
	      
	app.onSuccess = function(tx, r) {
		app.refresh();
	}
	      
	app.deleteTodo = function(id) {
		var db = app.db;
		db.transaction(function(tx) {
			tx.executeSql("DELETE FROM todo WHERE ID=?", [id],
						  app.onSuccess,
						  app.onError);
		});
	}

	app.refresh = function() {
		var renderTodo = function (row) {
			return "<li>" + "<div class='todo-check'></div>" + row.todo + "<a class='button delete' href='javascript:void(0);'  onclick='app.deleteTodo(" + row.ID + ");'><p class='todo-delete'></p></a>" + "<div class='clear'></div>" + "</li>";
		}
	    
		var render = function (tx, rs) {
			var rowOutput = "";
			var todoItems = $("#todoItems");
			for (var i = 0; i < rs.rows.length; i++) {
				rowOutput += renderTodo(rs.rows.item(i));
			}
	      
			todoItems.html(rowOutput);
		}
	    
		var db = app.db;
		db.transaction(function(tx) {
			tx.executeSql("SELECT * FROM todo", [], 
						  render, 
						  app.onError);
		});
	}

var messageCount = 0;
var watchID = 0;
var compassLoop = "";
var acelerometerLoop = "";
var geoLocationLoop = "";
var pictureSource= "";
var destinationType = "";
function onDeviceReady() {

		// NAVEGACIÓN

		document.addEventListener("backbutton", onBackKeyDown, false);
		
		$("#next").bind("click", function() {
			window.location = "index2.html";
		});

		$("#back").bind("click", function() {
			window.location = "index.html";
		});		

		$("#next2").bind("click", function() {
			window.location = "index3.html";
		});

		$("#back2").bind("click", function() {
			window.location = "index2.html";
		});		

		$("#next3").bind("click", function() {
			window.location = "index4.html";
		});

		$("#back3").bind("click", function() {
			window.location = "index3.html";
		});		

		$("#next4").bind("click", function() {
			window.location = "index5.html";
		});

		$("#back4").bind("click", function() {
			window.location = "index4.html";
		});

		$("#next5").bind("click", function() {
			window.location = "index6.html";
		});

		$("#back5").bind("click", function() {
			window.location = "index5.html";
		});		

		// PANTALLA 1 -- DEVICE - EVENTS - MEDIA - NOTIFICATION

		$("#deviceName").bind("click", function() {
			var infoField = $("#infoField");
			infoField.html(device.model);
		});
		$("#deviceCordovaVersion").bind("click", function() {
			var infoField = $("#infoField");
			infoField.html(device.cordova);
		});
		$("#devicePlatform").bind("click", function() {
			var infoField = $("#infoField");
			infoField.html(device.platform);
		});
		$("#deviceUUID").bind("click", function() {
			var infoField = $("#infoField");
			infoField.html(device.uuid);
		});
		$("#deviceVersion").bind("click", function() {
			var infoField = $("#infoField");
			infoField.html(device.version);
		});

		document.addEventListener("pause",
									function() {
										printEvent("Pause");
									}, 
									false);
        
		document.addEventListener("resume",
									function() {
										printEvent("Resume");
									}, 
									false);
         
		document.addEventListener("menubutton",
									function() {
										printEvent("Menu button touched");
									},
									false);
         
		window.addEventListener("batterystatus",
								function(info) {
									var batteryLevel = info.level,
									isPlugged = info.isPlugged;

									var notificationMessage = "Battery level (" + batteryLevel + "%). " + 
															"You are " + (isPlugged ? "" : "not") + "  plugged in.";
                                
									printEvent(notificationMessage);
								},
								false);

		//var src = "http://audio.ibeat.org/content/p1rj1s/p1rj1s_-_rockGuitar.mp3";
		var src = getWorkingFolder().replace('http://', 'file://') + "local_rockGuitar.mp3";

		var mediaContent = new Media(src, 
									function(status) {
										if(status === Media.MEDIA_STOPPED) {
											this.release();
										}
									},
									function(error) {
										var errorMessage = "code: " + error.code + "\n" +
															"message: " + error.message + "\n";
										printEvent(errorMessage);
										this.isPlaying = false;
									},
									function(status) {
										if(status === Media.MEDIA_STOPPED) {
											this.release();
										}
									});            
        
		var playAudioButton = $("#buttonPlayAudio"),
			stopAudioButton = $("#buttonStopAudio"),
			pauseAudioButton = $("#buttonPauseAudio");
                                
		playAudioButton.bind("click",
										function() {
											mediaContent.play();
											printEvent('Playing...');
										}); 
        
		stopAudioButton.bind("click", 
										function() {
											mediaContent.stop();
											printEvent('');
										});
        
		pauseAudioButton.bind("click", 
										function() {
											mediaContent.pause();
											printEvent('Paused');
										});

		var alertCount=0;

		$("#alertButton").bind("click", function() {
			navigator.notification.alert('Alert #' + alertCount,
										function() {
											alertCount++;
										},
										'Count Alerts', 
										'Done'     
			);
		});
		$("#confirmButton").bind("click", function() {
			navigator.notification.confirm('Reset the alert count?', 
											function(button) {
												if (button === 1) {
													alertCount = 0;
												}
											}, 
											'Reset alert', 
											new Array("Reset","Cancel")
			); 
		});
		$("#beepButton").bind("click", function() {
			// On the iPhone, this code will only have an effect if
			// you place a file named beep.wav in the root of the project.
			// The beep sound can be at most 30 seconds long.
			// The iPhone disregards the beep count, so will only beep once.
			// Android phones play the default Notification ringtone.
			navigator.notification.beep(2); 
		});
		$("#vibrateButton").bind("click", function() {
			// Note that iPhone ignores the duration parameter and vibrates for
			// a pre-determined amount of time. Some iOS devices would only vibrate when volume is turned off
			navigator.notification.vibrate(3000);
		});


		// PANTALLA 2 -- FILE

		var openLocal = $("#openLocal"),
		openExternalInAppBrowser = $("#openExternalInAppBrowser"),
		openPDF = $("#openPDF"),
		openExternalPDF = $("#openExternalPDF"),
		openExternalInSystemBrowser = $("#openExternalInSystemBrowser"),
		openLocalFileOpener = $("#openLocalFileOpener");

        
		openLocal.bind("click", function() {
									window.open("img/ice.png", "_blank");
								});

		openExternalInAppBrowser.bind("click", function() {
									window.open("http://phonegap.com/", "_blank");
								});

		openPDF.bind("click", function() {
									if (window.navigator.simulator === true) {
										alert("Not Supported in Simulator.");
									}
									else {
										if (device.platform == 'Android') {
											window.plugins.fileOpener.open("file:///sdcard/cursoPhonegapDocs/whitepaper-mobile-developer-guidance.pdf");
										}
										else
											window.open("whitepaper-mobile-developer-guidance.pdf", "_blank");
									}
								});

		openExternalPDF.bind("click", function() {
									if (window.navigator.simulator === true) {
										alert("Not Supported in Simulator.");
									}
									else {
										if (device.platform == 'Android') {
											window.open("http://www.telerik.com/whitepapers/appbuilder/approaching-mobile-understanding-the-three-ways-to-build-mobile-apps", "_system");
										}
										else
											window.open("http://www.telerik.com/whitepapers/appbuilder/approaching-mobile-understanding-the-three-ways-to-build-mobile-apps", "_blank");
									}
								});

		openExternalInSystemBrowser.bind("click", function() {
									window.open("http://wiki.apache.org/cordova/InAppBrowser", "_system");
								});

		openLocalFileOpener.bind("click", function() {
									window.plugins.fileOpener.open("file:///sdcard/cursoPhonegapDocs/whitepaper-mobile-developer-guidance.pdf");
								});


		// PANTALLA 3 -- STORAGE

		$("#insertVariable").bind("click", function() {
			var variableNameInput = $("#variableNameInput"),
			valueInput = $("#valueInput");

			localStorage.setItem(variableNameInput.val(), valueInput.val());
			variableNameInput.val("");
			valueInput.val("");
		});
		$("#searchVariable").bind("click", function() {
			var getRemoveVariableNameInput = $("#getRemoveVariableNameInput"),
			result = $("#result");
			if (localStorage.getItem(getRemoveVariableNameInput.val()) != undefined) {
				result.val(localStorage.getItem(getRemoveVariableNameInput.val()));
			}
			else {
				result.val("No such record!");
			}
		});
		$("#clearLocalStorage").bind("click", function() {
			localStorage.clear();
		});
		$("#removeVariable").bind("click", function() {
			var searchRemoveNameInput = $("#getRemoveVariableNameInput"),
			result = $("#result");
			if (localStorage.getItem(searchRemoveNameInput.val()) != undefined) {
				localStorage.removeItem(searchRemoveNameInput.val());
				result.val("Deleted");
			}
			else {
				result.val("No such record!");
			}
		});	


		app.openDb();
		app.createTable();
		app.refresh();


		// PANTALLA 4 -- SENSORS
		
		$("#startCompass").bind("click", function() {
			compassLoop = setInterval(function() {
			   	navigator.compass.getCurrentHeading(function(heading){
			   				printSensorInfo('Heading: ' + heading.magneticHeading);
			   			},
			   			function(compassError){
		   					printSensorInfo('Compass Error: ' + compassError.code);
			   			});
			}, 500);
	   });

		$("#stopCompass").bind("click", function() {
			clearInterval(compassLoop);
		});

		$("#startAcelerometer").bind("click", function() {
			acelerometerLoop = setInterval(function() {
			   	navigator.accelerometer.getCurrentAcceleration(function(acceleration){
			   				printSensorInfo('Acceleration X: ' + acceleration.x + '<br />' +
										'Acceleration Y: ' + acceleration.y + '<br />' +
										'Acceleration Z: ' + acceleration.z + '<br />' +
										'Timestamp: '      + acceleration.timestamp + '<br />');
			   			},
			   			function(error){
		   					printSensorInfo('code: '    + error.code    + '\n' +
									'message: ' + error.message + '\n');
			   			});
			}, 500);
	   });

		$("#stopAcelerometer").bind("click", function() {
			clearInterval(acelerometerLoop);
		});

		$("#startGeolocation").bind("click", function() {
		   	navigator.geolocation.getCurrentPosition(function(position){
		   				printSensorInfo('Latitude: '+ position.coords.latitude   + '<br />' +
                        'Longitude: '          + position.coords.longitude             + '<br />' +
                        'Altitude: '           + position.coords.altitude              + '<br />' +
                        'Accuracy: '           + position.coords.accuracy              + '<br />' +
                        'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
                        'Heading: '            + position.coords.heading               + '<br />' +
                        'Speed: '              + position.coords.speed                 + '<br />' +
                        'Timestamp: '          + position.timestamp                    + '<br />');
		   			},
		   			function(error){
	   					printSensorInfo('code: '    + error.code    + '\n' +
								'message: ' + error.message + '\n');
		   			});
	   });

		/*$("#stopGeolocation").bind("click", function() {
			clearInterval(geolocationLoop);
		});	*/


		// PANTALLA 5 - CAPTURE		

        $("#captureVideo").bind("click", function() {
			navigator.device.capture.captureVideo(function(mediaFiles) {
				var i,
				media = document.getElementById("media");
				media.innerHTML = "";
				for (i=0;i < mediaFiles.length;i+=1) {
				    media.innerHTML+='<p>Capture taken! Its path is: ' + mediaFiles[i].fullPath + '</p>'
				}
			}, function(error) { 
				var media = document.getElementById("media");
            	media.innerHTML = "An error occured! Code:" + error.code;
			}, {limit:1});
		});

		$("#captureAudio").bind("click", function() {
			navigator.device.capture.captureAudio(function(mediaFiles) {
				var i,
				media = document.getElementById("media");
				media.innerHTML = "";
				for (i=0;i < mediaFiles.length;i+=1) {
				    media.innerHTML+='<p>Capture taken! Its path is: ' + mediaFiles[i].fullPath + '</p>'
				}
			}, function(error) { 
				captureApp._captureError.apply(that, arguments);
			}, {limit:1});
		});

		$("#captureImage").bind("click", function() { 
			navigator.device.capture.captureImage(function(mediaFiles) {
				var i,
				media = document.getElementById("media");
				media.innerHTML = "";
				for (i=0;i < mediaFiles.length;i+=1) {
				    media.innerHTML+='<p>Capture taken! Its path is: ' + mediaFiles[i].fullPath + '</p>'
				}
			}, function(error) { 
				captureApp._captureError.apply(that, arguments);
			}, {limit:1});
		});			


		// PANTALLA 5 - CAMERA

		pictureSource=navigator.camera.PictureSourceType;
		destinationType=navigator.camera.DestinationType;

	    $("#capturePhotoButton").bind("click", function(){
			// Take picture using device camera and retrieve image as base64-encoded string.
			navigator.camera.getPicture(function(imageData){
				var smallImage = document.getElementById('smallImage');
				smallImage.style.display = 'block';

				// Show the captured photo.
				smallImage.src = "data:image/jpeg;base64," + imageData;
			},function(error){
				alert(error);
			},{
				quality: 50,
				destinationType: destinationType.DATA_URL
			});
        });

	    $("#getPhotoFromLibraryButton").bind("click", function(){
	        // On Android devices, pictureSource.PHOTOLIBRARY and
	        // pictureSource.SAVEDPHOTOALBUM display the same photo album.

            // Retrieve image file location from specified source.
			navigator.camera.getPicture(function(imageData){
				var smallImage = document.getElementById('smallImage');
				smallImage.style.display = 'block';

				// Show the captured photo.
				smallImage.src = "data:image/jpeg;base64," + imageData;
			},function(error){
				alert(error);
			},{
			quality: 50,
			destinationType: destinationType.DATA_URL,
			sourceType: pictureSource.PHOTOLIBRARY
			});
        });

	    $("#getPhotoFromAlbumButton").bind("click", function(){
	        // On Android devices, pictureSource.PHOTOLIBRARY and
	        // pictureSource.SAVEDPHOTOALBUM display the same photo album.

            // Retrieve image file location from specified source.
			navigator.camera.getPicture(function(imageData){
				var smallImage = document.getElementById('smallImage');
				smallImage.style.display = 'block';

				// Show the captured photo.
				smallImage.src = "data:image/jpeg;base64," + imageData;
			},function(error){
				alert(error);
			},{
			quality: 50,
			destinationType: destinationType.DATA_URL,
			sourceType: pictureSource.SAVEDPHOTOALBUM
			});
        });		

}

function printEvent(text) {
	var newDiv = document.createElement('div'),
	resultBox = $("#result");
	messageCount++;
	newDiv.className = 'msg_'+messageCount;
	var currentTime = new Date().toLocaleTimeString().split(" ")[0];
	newDiv.innerHTML = '[' + currentTime + '] ' + text;

	resultBox.append(newDiv);
	

	setTimeout(function() {
		$(".msg_"+messageCount).fadeOut( "slow" );
		messageCount--;
	}, 4000);
}

function clearCurrentNotification(){
	$("#result").html("");
}

function printSensorInfo(text){
	var newDiv = document.createElement('div'),
	resultBox = $("#result");
	resultBox.html(text);
}

function onBackKeyDown() {
	navigator.app.exitApp();
}

function getWorkingFolder() {
	var path = window.location.href.replace('index.html', '');
	return path;
}

// PANTALLA 4 

function addTodo() {
	var todo = $("#todo");
	app.addTodo(todo.val());
	todo.val("");
}
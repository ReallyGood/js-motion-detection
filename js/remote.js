(function(){
	$(window).on('motion', function(ev, data){
		var spot = $('#'+data.spot.id);
		spot.addClass('active').trigger('motionDetected');
		setTimeout(function(){
			spot.removeClass('active');
		}, 230);
	});

	$('#pageRefresh').on('motionDetected', function(){
		chrome.extension.sendMessage({type: 'refreshActiveTab'}, function(response) {
			console.log(response);
		});
	});

	$('#pageBack').on('motionDetected', function(){
		chrome.extension.sendMessage({type: 'backActiveTab'}, function(response) {
			console.log(response);
		});
	});
})();
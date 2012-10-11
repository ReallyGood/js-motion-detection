(function(){
	$(window).on('motion', function(ev, data){
		var spot = $('#'+data.spot.id);
		spot.addClass('active').trigger('motionDetected');
		setTimeout(function(){
			spot.removeClass('active');
		}, 230);
	});

	$('#pageRefresh').on('motionDetected', function(){
		console.log('refresh');
	});

	$('#pageBack').on('motionDetected', function(){
        console.log('back');
	});
})();
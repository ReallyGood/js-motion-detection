(function(){
	$(window).on('motion', function(ev, data){
        console.log('detected motion at', new Date(), 'with data:', data);
        var spot = $(data.spot.el);
		spot.addClass('active');
		setTimeout(function(){
			spot.removeClass('active');
		}, 230);
	});

    $('.link').on('motion', function(ev, data){
        console.log('motion detected on a link to', data.spot.el.href);
    });

	$('#one').on('motion', function(){
		console.log('touched one');
	});

	$('#another').on('motion', function(){
        console.log('another');
	});
})();
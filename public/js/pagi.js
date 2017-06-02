$(function () {

	var p = $('#pagination').attr('data-page');
	var page = parseInt(p);
	var link = $('#pagination').attr('data-link');
	if (page == 0 || null) {
		$('#fili').addClass('disabled');
		$('#pr').addClass('disabled');
		$('#prv').hide();
		$('#current').html('0');
		$('#current').attr('href', link+'0');
		$('#nxt').html('1');
		$('#nxt').attr('href', link+'1');
		$('#next').attr('href', link+'1');
	} else {
		$('#prev').attr('href', link+(page-1));
		$('#prv').html(page-1);
		$('#prv').attr('href', link+(page-1));
		$('#current').html(page);
		$('#current').attr('href', link+page);
		$('#nxt').html(page+1);
		$('#nxt').attr('href', link+(page+1));
		$('#next').attr('href', link+(page+1));
	};
	var title = $('#AC').attr('data-title');
	$('#'+title).addClass('active');

	$('.thumbnail').hover(function() {
		$('#zoomIco').fadeIn(500);
	}).mouseleave(function() {
		$('#zoomIco').fadeOut(500);
	});

	$('#quantidy').on('change', function() {
		var quantidy = parseInt($('#quantidy').val());
		var price = parseInt($('#price').text());
		var price2 = quantidy*price;
		$('#price2go').html('⇒ '+price2+' L');
	});

	var offset = 220;
	var duration = 500;
	$(window).scroll(function() {
		if ($(this).scrollTop() > offset) {
			$('.back-to-top').fadeIn(duration);
		} else {
			$('.back-to-top').fadeOut(duration);
		}
	});
				
	$('.back-to-top').click(function(event) {
		event.preventDefault();
		$('html, body').animate({scrollTop: 0}, duration);
		return false;
	})
});
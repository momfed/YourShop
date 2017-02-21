$(function () {

	var p = $('#pagination').attr('data-page');
	var page = parseInt(p);
	var link = '/market/page/'
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

	$('search').on('submit', function(){

		$.ajax({
			type: 'POST',
			url: '/search/market?',
			data: 'cracker',
			success: function(data){
				location.reload;
			}
		});
	});

});
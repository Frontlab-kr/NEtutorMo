
$(document).ready(function () {
	$('.btn_foot_info').on('click', function(){
		$(this).toggleClass('on');
		$('.foot_info').slideToggle();
     });

});

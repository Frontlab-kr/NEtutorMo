$(document).ready(function(e) {
	if($('img[usemap]').length > 0){
		$('img[usemap]').rwdImageMaps();
	}
});

function fullPop(popName){
	preventScoll();
	$('.pop_' + popName).show();
	$('html, body').css('overflow','hidden');

	$('.pop_full').height($(window).innerHeight()+'px');
	if (popName == 'search') {
		var popHeight = $(window).innerHeight() - 192;
		$('.pop_full .pop_body .result_box').height(popHeight+'px');
	} else if (popName == 'sms') {
		var popHeight = $(window).innerHeight() - 60;
		$('.pop_sms .pop_body .sms_wrap').height(popHeight+'px');;
	}
}

function openPop(popName){
	$('.dim').fadeIn();
	//$('.pop_' + popName).show();
	$('.pop_' + popName).addClass('active');
	if($('.pop_' + popName).height() > $(window).height()){
		$('.pop_' + popName).addClass('full');
	}
}

function menuHeight() {
	if ($(window).width() < $(window).height()) {
		var screenHeight = $(window).innerHeight() - 320;
		$('.menu_wrap .menu_area .depth01_area').height(screenHeight+'px');
		$('.util_menu').css('bottom','0');
	} else {
		$('.util_menu').css('bottom','30px');
	}
} // 메뉴영역 높이 지정

$(window).on("orientationchange", function( event ) {
	if($('.menu_wrap').hasClass('on')) {
		$('.menu_close').trigger('click');
	}
	if($('.pop_full').is(':visible')) {
		$('.pop_full .pop_close').trigger('click');
	}
});

var lastScrollPos = 0;
preventScoll = function () {
	lastScrollPos = $(this).scrollTop();
}
enableScroll = function () {
	window.scrollTo(0, lastScrollPos);
}

$(document).ready(function () {
	

	if($(".foot_bar").length  > 0) {
		$('footer .foot_box').css('padding-bottom','85px');
	}

	if($(".bar_fix").length  > 0) {
		$('footer .foot_box').css('padding-bottom','95px');
	}
	if($(".fix_bar").length  > 0) {
		$('footer .foot_box').css('padding-bottom',$('.fix_bar').height() + 10);	
	}

	if($('.sub_top .depth2_slide').length > 0){
		$('.f_header').addClass('noline');
	}

	$('.search_box .ip_search').keydown(function(){
		$('.result_box .fav_tag').slideUp();
		$('.result_box .result_list').slideDown();
	});
	$('.pop_full .pop_close').on('click', function(){
		$('html, body').css('overflow','');
		$('.pop_full').hide();
		enableScroll();
	});
	$('.pop_search .btn_search_close').on('click', function(){
		$('html, body').css('overflow','');
		$('.pop_search').hide();
		enableScroll();

		if ($('.menu_wrap.on').length > 0) {
			$('.menu_wrap').removeClass('on');
			console.log('a');
		}
	});

	$('.pop_search .btn_search_close, .pop_search .pop_close').on('click', function(){
		if ($('.menu_wrap.on').length > 0) {
			$('.menu_wrap').removeClass('on');
		}
	});

	$('.btn_foot_info').on('click', function(){
		$(this).toggleClass('on');
		$('.foot_info').slideToggle();
     });
	 $('.notice_fix .btn_notice_close').on('click', function(){
		$('.notice_fix').fadeOut();
     });
	 $('.step_box .step_top > a:not(.not)').on('click', function(){
		 var isLineBanner = $('.wrap, .guide_wrap').find('#lineBanner').css('display');

		 var checkElement = $(this).parent().next('.step_body');
		 if((checkElement.is('.step_body')) && (checkElement.is(':visible'))) {				
			$('.step_box .step_top').removeClass('on');
			checkElement.slideUp();	
		 }
		 if((checkElement.is('.step_body')) && (!checkElement.is(':visible'))) {
			//$('.step_body:visible').hide();
			// $('html, body').animate({'scrollTop' : $(this).parent('.step_top').offset().top - 90});
			// 띠배너 유무
			if(isLineBanner == 'block'){
				$('html, body').animate({'scrollTop' : $(this).parent('.step_top').offset().top - 130});
			} else if(isLineBanner == 'none'){
				$('html, body').animate({'scrollTop' : $(this).parent('.step_top').offset().top - 90});
			}
			checkElement.slideDown();
		//	$('.step_box .step_top').removeClass('on');
			$(this).parent().addClass('on');	
		}
	});
	$('.fold_list > li > a').on('click', function(){
		 var checkElement = $(this).next('.ans_box');
		 if((checkElement.is('.ans_box')) && (checkElement.is(':visible'))) {				
			$('.fold_list > li').removeClass('on');
			checkElement.slideUp();	
		 }
		 if((checkElement.is('.ans_box')) && (!checkElement.is(':visible'))) {
			$('.ans_box:visible').slideUp();
			checkElement.slideDown();
			$('.fold_list > li').removeClass('on');
			$(this).parent().addClass('on');	
		}
	});




	$('header a.btn_menu').on('click', function(){
		preventScoll();
		menuHeight();
		$('.menu_wrap').addClass('on');
		$('html, body').css('overflow','hidden');
		$('.gnb_depth01 > li.on > a').trigger('click');
		
	});
	$('.menu_wrap .menu_close').on('click', function(){
		$('html, body').css('overflow','');
		$('.menu_wrap').removeClass('on');
		enableScroll();
	});


	$('header h2.sub_title a').on('click', function(){
		$('header').stop().toggleClass('sub_on');
		$(this).stop().toggleClass('on');
		$('.head_list').stop().slideToggle();
		$('.dim2').stop().toggle();
	});
	$('.dim2').on('click', function(){
		$('header h2.sub_title a').trigger('click');
	});



	 $('.menu_area .depth01_area .gnb_depth01 > li > a').each(function(e){
		$(this).on('click', function(){
			$('.menu_area .depth01_area .gnb_depth01 > li').removeClass('on');
			$(this).parent().addClass('on');
			var pos = $('.gnb_depth01 > li.on').position().top;
			$('.menu_wrap .menu_area .depth01_area .highlight').css('top', pos);
			var $section = $('div.depth02_area').find('.depth02_box');
			$section.each(function(){
				$(this).hide();
				$section.eq(e).show();
			});
		});
	});


	$('.depth02_area .depth02_list > li > a.toggle').on('click', function(){
		 var checkElement = $(this).next('.depth03_area');
		 if((checkElement.is('.depth03_area')) && (checkElement.is(':visible'))) {				
			$('.depth02_area .depth02_list > li').removeClass('on');
			checkElement.slideUp();	
		 }
		 if((checkElement.is('.depth03_area')) && (!checkElement.is(':visible'))) {
			$('.depth03_area:visible').slideUp();
			checkElement.slideDown();
			$('.depth02_area .depth02_list > li').removeClass('on');
			$(this).parent().addClass('on');	
		}
	});



	
	$('.dim, .pop_close').click(function(){
		//$('.pop').fadeOut();
		$('.pop_win').removeClass('active full');
		$('.dim').fadeOut();
	});
	$('.tab_tt li a').each(function(e){
		$(this).on('click', function(){
			$('.tab_tt li').removeClass('on');
			$(this).parent().addClass('on');
			var $section = $('div.tab_con_wrap').find('.tab_con');
			$section.each(function(){
				$(this).hide();
				$section.eq(e).show();
			});
		});
	});

	$('.item .btn_buy').on('click', function(){
		$(this).next('.dim').fadeIn();
		$(this).next().next('.pop_bookbuy').addClass('active');
     });


	 $('.pop_addr_info .tab_box > li > a').each(function(e){
		$(this).on('click', function(){
			$('.pop_addr_info .tab_box > li').removeClass('on');
			$(this).parent().addClass('on');
			var $section = $('div.pop_addr_info .tab_wrap').find('.tab_con');
			$section.each(function(){
				$(this).hide();
				$section.eq(e).show();
			});
		});
	});

	
	//minSize();
	

});



$(window).scroll(function(){
	var thisTop = $(this).scrollTop();
	if(50 < thisTop) {
		$('.m_header').addClass('on');
	}else{
		$('.m_header').removeClass('on');
	}


	if($('.f_header').length > 0 && 1 < thisTop) {
		$('.f_header').addClass('on');
	}else{
		$('.f_header').removeClass('on');
	}

	if($(".fix_bar").length  > 0) {
		$('footer .foot_box').css('padding-bottom',$('.fix_bar').height() + 10);
		
	}
	minSize();
});


function minSize() {
	if ($('.wrap').height() < $(window).height()){
		$('footer').css('margin-top',$(window).height() - $('.wrap').height() + 'px');
	}
}
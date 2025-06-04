/*
통합검색
*/

var keywordSearch = {



	// 자동완성 
	_search: function (arg, sender) {

		// gnb와 floating gnb 에서 같이 사용됨
		var containerName = sender.attr("data-container");
		var root = $("div[data-container=" + containerName + "]");

		root.find("div[data-id=auto_search_img_container]").hide();
		
		$.get("/inc/js/site/keywordSearch.j.asp", { action: "keyword", sc : $("input[data-id=g_sc]").val() , k: arg }, function (v) {
			if (v.success) {
				var result = $.parseJSON(v.data);
				
				root.find("div[data-id=auto_search_container]").show();
				var list = $("ul[data-id=auto_search_list]");
				list.empty();
				var template = '<li><a href="/pages/book/view.asp?c={b_code}" data-image="{b_thumb_s}" data-image-alt="{b_thumb_s_desc}" class="sm">{b_name}</a></li>';

				if (result.length < 1) {
					list.append("<li>검색결과가 없습니다.</li>");
				} else {
					$.each(result, function (i) {
						
						var item = $(template.replace("{b_code}", this.b_code).replace("{b_name}", this.b_name).replace("{b_thumb_s}", this.b_thumb_s).replace("{b_thumb_s_desc}", this.b_thumb_s_desc));
						
						item.mouseenter(function () {	
							
							var a = $($(this).find("a"));

							var thumb = a.attr("data-image");
							if (thumb == "")
								thumb = $("#default_book_thumb").val();

							$("img[data-id=auto_search_img]").attr("src", thumb).attr("alt", a.attr("data-image-alt"));
							$($("img[data-id=auto_search_img]").parent()).attr("href", a.attr("href"));
							$("a[data-id=auto_search_link]").attr("href", a.attr("href")).html(a.html());
						})
						
						list.append(item);
						if (i == 0) {

							var thumb = this.b_thumb_s;
							if (thumb == "")
								thumb = $("#default_book_thumb").val();

							$("img[data-id=auto_search_img]").attr("src", thumb).attr("alt", this.b_thumb_s_desc);
							$($("img[data-id=auto_search_img]").parent()).attr("href", "/pages/book/view.asp?c=" + this.b_code);
							$("a[data-id=auto_search_link]").attr("href", "/pages/book/view.asp?c=" + this.b_code).html(this.b_name);
							$("div[data-id=auto_search_img_container]").show();
						}
						
					});
				}
			} 
		});
	}
}

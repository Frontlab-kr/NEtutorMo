<!--#include virtual = "/_lib/global/common.asp"-->

<%
	const KEYWORD_SEARCH_DEFAULT_WORDS_CACHE_MINITE = 5

	response.Clear()
	response.ContentType = "application/json"
	
	dim action : action = req("action")

	set result = ObjectEx("")
	call result.setItem("success" , true)
	
	if action = "default" then 
	
		call result.setItem("data" , getDefaultWords())

	elseif action = "keyword" then 
		k = req("k")
		sc = req("sc")
		call result.setItem("data" , searchBook(sc,k))
	end if 
	
	result.writejson
%>


<%
	' 자동원성 검색
	Public Function searchBook(ByVal sc , ByVal k)
		
		set db = DbEx(dsn_neBooks)
		sql = "usp_penta_book_keywordSearch_list_f_trim '@c_depth1' , '@keyword'"
		sql = replaceSql(sql , "@c_depth1" , sc )
		sql = replaceSql(sql , "@keyword" , Replace(k,"[","[[]") )
		set rs = db.sqlQueryToJson(sql)
		searchBook = toJSON(rs)		
	
		set db = nothing	
	End Function
	
%>


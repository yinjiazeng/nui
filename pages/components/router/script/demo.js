Nui.define(['{com}/router'], function(router){
    
	router({
		target:'#home',
		entry:true,
		path:'/home/', 
		container:'#main',
		template:'<div>这是首页</div>'
	})

	router({
		target:'#news',
		path:'/news/',
		container:'#main',
		template:'<div>这是资讯页</div>'
	})

	router.start()
})
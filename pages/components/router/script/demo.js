Nui.define(function(){
	var renders = this.renders;
	var require = this.require;
	var placeholder = require('{com}/placeholder');
	var router = require('{com}/router');
	router({
		target:'#home',
		entry:true,
		path:'/home/',
		wrapper:'#aa',
		container:'#main'
	})
	var placeholder_opts = require('./options', true);
	router({
		target:'#news, .news',
		entry:true,
		path:'/news/:id/:title',
		container:'#main',
		level:2,
		template:{
			list:'<ul>'+
					'<%each list%>'+
					'<li><a href="<%$value.url%>/<%$value.title%>" class="news"><%$value.title%></a></li>'+
					'<%/each%>'+
				'</ul>',
			detail:'<div>'+
						'<h3><%params.title%></h3>'+
						'<p>这是<%params.title%>详情，id是<%params.id%>。<input type="text" data-placeholder-options="'+ placeholder_opts.id +'"></p>'+
					'</div>'
		},
		data:{
			list:[{
				url:'/news/1',
				title:'资讯1'
			},{
				url:'/news/2',
				title:'资讯2'
			}, {
				url:'/news/3',
				title:'资讯3'
			}]
		},
		onChange:function(){
			var tpl = this.template, params = this.data.params;
			if(params.id && params.title){
				
				tpl.main = tpl.detail;
			}
			else{
				tpl.main = tpl.list;
			}
		},
		onInit:function(){
			
		}
	})

	router.start()
})
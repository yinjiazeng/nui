Nui.define('pages/components/router/script/options',function(){return{text:'1111',color:'#f60'}}),Nui.define('./script/demo',['src/components/router'],function(t){var require=(this.renders,this.require);require('src/components/placeholder');t({target:'#home',entry:!0,path:'/home/',wrapper:'#aa',container:'#main'}),t({target:'#news, .news',entry:!0,path:'/news/:id/:title',container:'#main',level:2,template:{list:'<ul><%each list%><li><a href="<%$value.url%>/<%$value.title%>" class="news"><%$value.title%></a></li><%/each%></ul>',detail:'<div><h3><%params.title%></h3><p>这是<%params.title%>详情，id是<%params.id%>。<input type="text" data-placeholder-options="'+require('pages/components/router/script/options',!0).id+'"></p></div>'},data:{list:[{url:'/news/1',title:'资讯1'},{url:'/news/2',title:'资讯2'},{url:'/news/3',title:'资讯3'}]},onChange:function(){var t=this.template,e=this.data.params;e.id&&e.title?t.main=t.detail:t.main=t.list},onInit:function(){}}),t.start()});
//# sourceMappingURL=demo-min.js.map?v=a13d619
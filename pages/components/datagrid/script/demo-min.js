;(function(__define){
    function __requireDefaultModule(module){
        if(module && module.defaults !== undefined){
            return module.defaults
        }
        return module
    }




__define('./script/demo',function(require,imports,renders,extend,exports){
	var module=this;
	var paging = require('./paging');
	var checkradio = require('./checkradio');
	var template = require('template');
	var datagrid = require('{com}/datagrid');
	
	var a=__requireDefaultModule(imports('./a.css'));
	
	console.log(a)
	
	var a = datagrid({
	    container:'#data',
	    paging:{
	        url:'http://127.0.0.1:8001/data/',
	        pCount:20
	    },
	    width:'110%',
	    columns:[{
	        title:'名称',
	        width:100,
	        field:'buname'
	    }, {
	        title:'名称',
	        width:100,
	        field:'buname1'
	    }, {
	        title:'名称',
	        width:200,
	        field:'buname',
	        children:[{
	            title:'名称',
	            width:100,
	            field:'buname'
	        }, {
	            title:'名称',
	            width:100,
	            field:'buname'
	        }]
	    }, {
	        title:'名称',
	        width:100,
	        field:'buname',
	        children:[{
	            title:'名称',
	            width:100,
	            field:'buname'
	        }]
	    }, {
	        title:'名称',
	        width:100,
	        field:'buname'
	    }],
	    rowRender:function(self, list, v, k){
	        return template.render(renders(''+''
	            +'<%each list%>'+''
	                +'<tr class="table-row">'+''
	                    +'<%each cols col%>'+''
	                    +'<td class="table-cell" width="<%col.width%>">'+''
	                    
	                    +'</td>'+''
	                    +'<%/each%>'+''
	                +'</tr>'+''
	            +'<%/each%>'+''
	        +''), {
	            cols:v,
	            list:list
	        })
	    }
	})
	
	$('h1').click(function(){
	    a.option('isBorder', true)
	})
});

})(Nui['_module_2_define']);
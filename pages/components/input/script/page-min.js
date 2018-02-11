;(function(__define){
    function __requireDefaultModule(module){
        if(module && module.defaults !== undefined){
            return module.defaults
        }
        return module
    }

__define('./script/page',function(require,imports,renders,extend,exports){
	var module=this;
	var input=__requireDefaultModule(require('{com}/input'));
	
	$('#demo').input({
	    hover:true,
	    clear:'清除',
	    reveal:{
	        show:true,
	        hover:false,
	        content:{
	            text:'隐藏',
	            password:'显示'
	        }
	    },
	    button:[{
	        id:'click',
	        content:'点我',
	        hover:false,
	        callback:function(){
	            alert('ok')
	        }
	    }]
	})
	
	$('#demo2').input({
	    clear:'X',
	    text:'请输入...',
	    animate:true,
	    limit:{
	        cn:true
	    }
	})
});

})(Nui['_module_2_define']);
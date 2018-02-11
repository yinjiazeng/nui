;(function(__define){
    function __requireDefaultModule(module){
        if(module && module.defaults !== undefined){
            return module.defaults
        }
        return module
    }

__define('./script/page',function(require,imports,renders,extend,exports){
	var module=this;
	imports('../style/page.less');
	require('{com}/select');
	
	
	$('select').select()
});

})(Nui['_module_2_define']);
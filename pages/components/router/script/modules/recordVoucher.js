Nui.define(['component', '../tpls/recordVoucher', 'template', '{light}/javascript', '{cpns}/placeholder'], function(component, tmpl, tpl, js){
    var module = this;
    return function(target, wrapper, request){

        wrapper.html(tpl.render(tmpl, request))
       
        wrapper.on('click', 'b', function(){
            alert()
        })

         wrapper.find('a').click(function(){
             alert()
            js('destroy', wrapper, 'b')
            //component.static.trigger(null, 'destroy');
            setTimeout(function(){
                js('init', wrapper)
                js('set', wrapper, {
                    isLine:true
                }) 
            }, 2000)
            //js('trigger', container, 'destroy')
        })
    }
})
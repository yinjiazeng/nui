Nui.define(['placeholder'], function(p){
    return ({
        init:function(){
            var a = new p({
                target:'#p2'
            })

            $('a').click(function(){
                //a.set('text', 'fgfhf')
                a.destroy(1)

                a.set('text', 'fgfhf')
            })

            /*$('#p2').placeholder({
                color:'#f60',
                text:'哈哈哈'
            })

            $('#p2').placeholder('options', {
                text:'dfgfg34'
            })*/

            /*$.placeholder({
                target:'#p2',
                text:'sdfsdfsdf',
                color:'#f00'
            }).set('text', 'ert')*/
        }
    })
})

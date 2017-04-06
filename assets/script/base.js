Nui.define(['{light}/xml'], function(xml){
    this.imports('../style/base');
    var hash = location.hash.replace('#', '');
    var main = $('.g-main');
    var items = main.find('h2');
    var length = items.length;
    var menus = $('.m-menu ul');

    return ({
        init:function(){
            this.setYear();
            this.event();
            this.position();
        },
        setYear:function(){
            $('#nowyear').text('-'+new Date().getFullYear());
        },
        position:function(){
            if(hash){
                var elem = $('[id="'+ hash +'"]');
                elem.length && main.scrollTop(elem.position().top)
            }
        },
        event:function(){
            main.scroll(function(){
                var stop = main.scrollTop();
                items.each(function(i){
                    var item = $(this);
                    var id = this.id;
                    var itop = item.position().top - 20;
                    var ntop = 0;
                    var next = items.eq(i+1);
                    if(next.length){
                        ntop = next.position().top - 20
                    }
                    else{
                        ntop = $('.mainbox').outerHeight()
                    }
                    menus.find('a.s-crt').removeClass('s-crt');
                    if(stop >= itop && stop < ntop){
                        menus.find('a[href="#'+ id +'"]').addClass('s-crt');
                        //为了阻止设置location.hash时，浏览器会自行定位到该id的起始位置
                        item.removeAttr('id');
                        location.hash = id;
                        item.attr('id', id);
                        return false;
                    }
                })
            })
        }
    })
})

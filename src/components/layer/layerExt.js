/**
 * @author Aniu[2016-11-10 22:39]
 * @update Aniu[2016-11-10 22:39]
 * @version 1.0.1
 * @description layer扩展
 */

Nui.define(['./layer', 'util'], function(layer, util){
    var module = this;

    layer.alert = function(content, title, width, height){
        var opts;
        if(typeof content === 'object'){
            opts = content;
            content = opts.content;
            delete opts.content;
        }
        return layer($.extend({
            content:'<div style="padding:10px; line-height:20px;">'+(content||'')+'</div>',
            title:title,
            width:width,
            height:height,
            cancel:{
                text:'关闭'
            }
        }, opts||{}))
    }

    layer.confirm = function(content, callback, title, width, height){
        var opts;
        if(typeof content === 'object'){
            opts = content;
            content = opts.content;
            delete opts.content;
        }
        return layer($.extend(true, {
            content:'<div style="padding:10px; line-height:20px;">'+(content||'')+'</div>',
            title:title,
            width:width,
            height:height,
            align:'right',
            confirm:{
                callback:callback||function(){
                    return true
                }
            }
        }, opts||{}, {
            confirm:{
                enable:true
            }
        }))
    }

    layer.iframe = function(src, title, width, height){
        return layer({
            iframe:{
                enable:true,
                src:src
            },
            title:title,
            width:width,
            height:height,
            cancel:{
                text:'关闭'
            }
        })
    }

    layer.tips = function(content, dir, position, width, height){
        var opts;
        if(typeof content === 'object'){
            opts = content;
            content = opts.content;
            delete opts.content;
        }
        return layer($.extend(true, {
            content:content,
            id:'tips',
            width:width||'auto',
            height:height||'auto',
            position:position,
            bubble:{
                enable:true,
                dir:dir||'top'
            }
        }, opts||{}, {
            isTips:true,
            isMask:false,
            isClose:false,
            close:{
                enable:false
            }
        }))
    }

    layer.loading = function(content, width, height){
        var opts;
        if(typeof content === 'object'){
            opts = content;
            content = opts.content;
            delete opts.content;
        }
        if(Nui.type(content, 'Number')){
            height = width;
            width = content;
            content = '';
        }
        return layer($.extend({
            content:'<div>'+(content||'正在加载数据...')+'</div>',
            width:width||'auto',
            height:height||'auto',
        }, opts || {}, {
            id:'loading',
            isTips:true,
            close:{
                enable:false
            }
        }))
    }

    layer.message = function(type, content){
        var opts, color = '#f00';
        if(typeof type === 'object'){
            opts = type;
            content = opts.content;
            delete opts.content;
            type = 'success';
        }

        if(type !== 'success' && type !== 'error'){
            content = type;
            type = 'success';
        }

        if(type === 'success' && !content){
            content = '操作成功'
        }
        else if(type === 'error' && !content){
            content = '操作失败'
        }

        if(type === 'success'){
            color = '#39B54A';
        }

        return layer($.extend({
            content:'<div style="padding:10px; color:'+ color +';">'+content+'</div>',
            id:'message',
            width:'auto',
            height:'auto',
            isTips:true,
            timer:1500,
            close:{
                enable:true
            }
        }, opts || {}, {
            isMask:false
        }))
    }

    layer.form = function(options){
        var onInit = options.onInit;
        delete options.onInit;
        var valid = options.valid;
        var btns = $.extend([], options.button || [{
            id:'cancel',
            text:'关闭'
        }, { 
            id:'confirm',
            name:'normal',
            text:'保存'
        }])

        Nui.each(btns, function(val, i){
            if(val.id === 'confirm' && !val.callback){
                btns[i].callback = function(e, self){
                    self.main.find('form').submit()
                }
                return false
            }
        })

        delete options.button;
        var formLayer = layer($.extend(true, {button:btns}, {
            scrollbar:false,
            id:'form',
            onInit:function(self){
                var main = self.main;
                var elems = main.find('[name!=""][data-rule]');
                var form = main.find('form');
                var rules = {};
                var messages = {};
                var setting = form.data('setting');
                elems.each(function(){
                    var elem = $(this);
                    var name = elem.attr('name');
                    var data = elem.data();
                    var rule = eval('('+ data.rule +')');
                    rules[name] = rule;
                    if(typeof data.message !== 'undefined'){
                        var message = eval('('+ data.message +')');
                        $.each(message, function(key, msg){
                            if(typeof self.options.messageFilter === 'function'){
                                message[key] = self.options.messageFilter.call(self.options, name, msg)||''
                            }
                        })
                        messages[name] = message;
                    } 
                });
                var opts = {
                    rules:rules,
                    messages:messages,
                    errorClass:'s-err',
					onkeyup:false,
					focusInvalid:false,
                    onfocusout:false,
					focusCleanup:true,
                    ignore:'',
                    success:function(error, element) {
						error.remove();
						$(element).addClass('s-succ');
					},
					errorPlacement:function(error, element) {
						element.removeClass('s-succ');
						if(error.text()){
							element.closest(self.options.itemWrap||'.ui-item').find(self.options.errorWrap||'.ui-err').html(error);
						}
					},
                    submitHandler:function(){
                        var param = {};
                        if(typeof self.options.getData === 'function'){
                        	param = self.options.getData.call(self.options, self, form)
                        }
                        else{
                            param = util.getData(form).result;
                        }

                        if(typeof self.options.onBeforeSubmit === 'function'){
                        	param = self.options.onBeforeSubmit.call(self.options, self, param);
                            if(param === false){
                                return false
                            }
                        }

                        var loading = layer.loading({
                            content:self.options.loading||'正在保存数据...',
                            under:self
                        });
                        
                        $.ajax($.extend({
                            url:form.attr('action'),
                            dataType:'json',
                            type:form.attr('method')||'POST',
                            data:param,
                            success:function(res, xhr){
                                loading.hide();
                                if(typeof self.options.onSuccess === 'function'){
                                    self.options.onSuccess.call(self.options, self, res, xhr)
                                }
                            },
                            error:function(xhr){
                                loading.hide();
                                if(typeof self.options.onError === 'function'){
                                    self.options.onError.call(self.options, self, xhr)
                                }
                            }
                        }, self.options.ajax||{}), null)
                    }
                }
                self.validator = form.validate($.extend(true, opts, setting||{}, valid||{}));
                typeof onInit === 'function' && onInit.call(self.options, self)
            }
        }, options||{}))
        return formLayer
    }

    return layer
})
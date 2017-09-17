Nui.define('src/components/layer/layerExt',['src/components/layer/layer','util'],function(layer,util){var module=this;return layer.alert=function(e,t,n,o){var i;return'object'==typeof e&&(i=e,e=i.content,delete i.content),layer($.extend({content:'<div style="padding:10px; line-height:20px;">'+(e||'')+'</div>',title:t,width:n,height:o,cancel:{text:'关闭'}},i||{}))},layer.confirm=function(e,t,n,o,i){var s;return'object'==typeof e&&(s=e,e=s.content,delete s.content),layer($.extend(!0,{content:'<div style="padding:10px; line-height:20px;">'+(e||'')+'</div>',title:n,width:o,height:i,align:'right',confirm:{callback:t||function(){return!0}}},s||{},{confirm:{enable:!0}}))},layer.iframe=function(e,t,n,o){return layer({iframe:{enable:!0,src:e},title:t,width:n,height:o,cancel:{text:'关闭'}})},layer.tips=function(e,t,n,o,i){var s;return'object'==typeof e&&(s=e,e=s.content,delete s.content),layer($.extend(!0,{content:e,id:'tips',width:o||'auto',height:i||'auto',position:n,bubble:{enable:!0,dir:t||'top'}},s||{},{isTips:!0,isMask:!1,isClose:!1,close:{enable:!1}}))},layer.loading=function(e,t,n){var o;return'object'==typeof e&&(o=e,e=o.content,delete o.content),Nui.type(e,'Number')&&(n=t,t=e,e=''),layer($.extend({content:'<div>'+(e||'正在加载数据...')+'</div>',width:t||'auto',height:n||'auto'},o||{},{id:'loading',isTips:!0,close:{enable:!1}}))},layer.message=function(e,t){var n,o='#f00';return'object'==typeof e&&(n=e,t=n.content,delete n.content,e='success'),'success'!==e&&'error'!==e&&(t=e,e='success'),'success'!==e||t?'error'!==e||t||(t='操作失败'):t='操作成功','success'===e&&(o='#39B54A'),layer($.extend({content:'<div style="padding:10px; color:'+o+';">'+t+'</div>',id:'message',width:'auto',height:'auto',isTips:!0,timer:1500,close:{enable:!0}},n||{},{isMask:!1}))},layer.form=function(options){var onInit=options.onInit;delete options.onInit;var valid=options.valid,btns=$.extend([],options.button||[{id:'cancel',text:'关闭'},{id:'confirm',name:'normal',text:'保存'}]);Nui.each(btns,function(e,t){if('confirm'===e.id&&!e.callback)return btns[t].callback=function(e,t){e.main.find('form').submit()},!1}),delete options.button;var formLayer=layer($.extend(!0,{button:btns},{scrollbar:!1,id:'form',onInit:function(self){var main=self.main,elems=main.find('[name!=""][data-rule]'),form=main.find('form'),rules={},messages={},setting=form.data('setting');elems.each(function(){var elem=$(this),name=elem.attr('name'),data=elem.data(),rule=eval('('+data.rule+')');if(rules[name]=rule,void 0!==data.message){var message=eval('('+data.message+')');$.each(message,function(e,t){'function'==typeof self._options.messageFilter&&(message[e]=self._options.messageFilter.call(self._options,name,t)||'')}),messages[name]=message}});var opts={rules:rules,messages:messages,errorClass:'s-err',onkeyup:!1,focusInvalid:!1,onfocusout:!1,focusCleanup:!0,ignore:'',success:function(e,t){e.remove(),$(t).addClass('s-succ')},errorPlacement:function(e,t){t.removeClass('s-succ'),e.text()&&t.closest(self._options.itemWrap||'.ui-item').find(self._options.errorWrap||'.ui-err').html(e)},submitHandler:function(){var e={};if(e='function'==typeof self._options.getData?self._options.getData.call(self._options,self,form):util.getData(form).result,'function'==typeof self._options.onBeforeSubmit&&!1===(e=self._options.onBeforeSubmit.call(self._options,self,e)))return!1;var t=layer.loading({content:self._options.loading||'正在保存数据...',under:self});$.ajax($.extend({url:form.attr('action'),dataType:'json',type:form.attr('method')||'POST',data:e,success:function(e,n){t.hide(),'function'==typeof self._options.onSuccess&&self._options.onSuccess.call(self._options,self,e,n)},error:function(e){t.hide(),'function'==typeof self._options.onError&&self._options.onError.call(self._options,self,e)}},self._options.ajax||{}),null)}};self.validator=form.validate($.extend(!0,opts,setting||{},valid||{})),'function'==typeof onInit&&onInit.call(self._options,self)}},options||{}));return formLayer},layer}),Nui.define('./script/page',['src/components/layer/layerExt','events'],function(e,t){var renders=this.renders;return t({element:document,events:{'click .j-demo':function(){e({content:'<p style="padding:10px; text-align:center;">hello world</p>',width:280,height:150,cancel:{text:'关闭',callback:function(e){console.log(e)}}})},'click .j-position':function(){e({content:renders('<div style="padding:15px 20px; line-height:20px;"><p>消息标题1</p><p>消息标题2</p><p>消息标题3</p></div>'),title:'系统消息',width:280,isMask:!1,cancel:{enable:!1},position:{bottom:'self*-1',right:0},onInit:function(e){this.position.bottom=0,e.element.animate({top:e.data.top-e.data.outerHeight})}})}}})});
//# sourceMappingURL=page-min.js.map?v=2e1ab50
/**
 * @func 保持输入框中一段文本不可编辑
 */

Nui.define(['component', 'util'], function(component, util){
    return this.extend(component, {
        _options:{
            text:'',
            value:''
        },
        _exec:function(){
            var self = this, opts = self._options;
            if(self._getTarget() && opts.text){
                self.target.val(opts.value || opts.text);
                if(opts.value){
                    self.target.attr('maxlength', opts.value.toString().length)
                }
                self._text = opts.text.toString();
                self._event()
            }
        },
        _event:function(){
            var self = this, opts = self._options, length = self._text.length;
            self._on('keydown', self.target, function(e, elem){
                var val = Nui.trim(elem.val());
                var index = util.getFocusIndex(elem.get(0));
                var kc = e.keyCode;
                if(kc >= 37 && kc <= 40){
                    return
                }
                if(!util.isTextSelect() && (index < length || (index === length && kc === 8))){
                    e.preventDefault()
                }
            })
            self._on('keyup', self.target, function(e, elem){
                var val = Nui.trim(elem.val());
                if(val.indexOf(self._text) !== 0){
                    self.target.val(self._text)
                }
            })
            self._on('blur', self.target, function(e, elem){
                var val = Nui.trim(elem.val());
                if(opts.value && val == self._text){
                    self.target.val(opts.value)
                }
            })
        }
    })
})
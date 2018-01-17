Nui.define(['../../core/component', './pinyin'], function(component, pinyin){
    this.imports('../../style/components/search/index');
    return this.extend(component, {
        _static:{

        },
        _options:{
            container:null,
        },
        _events:{

        },
        _exec:function(){
            var self = this, opts = self._options, target = self._getTarget();
            if(target){
                var text = self._defaultText = target.attr('placeholder');
                if(!self._defaultText && opts.text){
                    target.attr('placeholder', text = opts.text)
                }
                self._val = target.val();
                if(self._defaultValue === undefined){
                    self._defaultValue = self._val;
                }
                self._text = Nui.trim(text||'');
                self._setData();
                self._create()
            }
        }
    })
})
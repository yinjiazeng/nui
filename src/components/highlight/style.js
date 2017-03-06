/**
 * @author Aniu[2017-03-02 08:44]
 * @update Aniu[2017-03-02 08:44]
 * @version 1.0.1
 * @description css语法高亮组件
 */

Nui.define(function(){
    return this.extands('highlight', {
        _type:'css',
        _css:function(code){
            var that = this;
            var str = '';
            var match = code.match(/(\/\*(.|\s)*?\*\/)|(\{[^\{\}\/]*\})/g);
            var array = that._self._getarr(match, code);
            $.each(array, function(k, v){
                if($.trim(v)){
                    //多行注释
                    if(/^\s*\/\*/.test(v)){
                        v = v.replace(/(.+)/g, that._self._getcode('comment', '$1'))
                    }
                    else{
                        //匹配属性
                        if(/\}\s*$/.test(v)){
                            v = v.replace(/(\s*)([^:;\{\}\/\*]+)(:)([^:;\{\}\/\*]+)/g, '$1'+that._self._getcode('attr', '$2')+'$3'+that._self._getcode('string', '$4'))
                                .replace(/([\:\;\{\}])/g, that._self._getcode('symbol', '$1'));
                        }
                        //选择器
                        else{
                            v = v.replace(/([^\:\{\}\@\#\s\.]+)/g, that._self._getcode('selector', '$1'))
                                .replace(/([\:\{\}\@\#\.])/g, that._self._getcode('symbol', '$1'));
                        }
                    }
                }
                str += v;
            })
            return str
        }
    })
})

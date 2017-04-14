/**
 * @author Aniu[2017-03-02 08:44]
 * @update Aniu[2017-03-02 08:44]
 * @version 1.0.1
 * @description css语法高亮组件
 */

Nui.define(function(){
    return this.extend('highlight', {
        _type:'css',
        _css:function(code){
            var that = this;
            var self = that.constructor;
            var str = '';
            var match = code.match(/(\/\*(.|\s)*?\*\/)|(\{[^\{\}\/]*\})/g);
            var array = self._getarr(match, code);
            Nui.each(array, function(v){
                if(Nui.trim(v)){
                    //多行注释
                    if(/^\s*\/\*/.test(v)){
                        v = v.replace(/(.+)/g, self._getcode('comment', '$1'))
                    }
                    else{
                        //匹配属性
                        if(/\}\s*$/.test(v)){
                            v = v.replace(/(\s*)([^:;\{\}\/\*]+)(:)([^:;\{\}\/\*]+)/g, '$1'+self._getcode('attr', '$2')+'$3'+self._getcode('string', '$4'))
                                .replace(/([\:\;\{\}])/g, self._getcode('symbol', '$1'));
                        }
                        //选择器
                        else{
                            v = v.replace(/([^\:\{\}\@\#\s\.]+)/g, self._getcode('selector', '$1'))
                                .replace(/([\:\{\}\@\#\.])/g, self._getcode('symbol', '$1'));
                        }
                    }
                }
                str += v;
            })
            return str
        }
    })
})

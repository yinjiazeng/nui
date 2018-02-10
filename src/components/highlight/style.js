/**
 * @author Aniu[2017-03-02 08:44]
 * @update Aniu[2017-03-02 08:44]
 * @version 1.0.1
 * @description css语法高亮组件
 */

Nui.define(function(){
    return this.extend('./highlight', {
        _title:'css',
        _getCode:function(_code){
            var self = this;
            var code = _code || self.code;
            var _class = self.constructor;
            var str = '';
            var match = code.match(/(\/\*(.|\s)*?\*\/)|(\{[^\{\}\/]*\})/g);
            var array = _class._getarr(match, code);
            Nui.each(array, function(v){
                if(Nui.trim(v)){
                    //多行注释
                    if(/^\s*\/\*/.test(v)){
                        v = v.replace(/(.+)/g, _class._getcode('comment', '$1'))
                    }
                    else{
                        //匹配属性
                        if(/\}\s*$/.test(v)){
                            v = v.replace(/(\s*)([^:;\{\}\/\*]+)(:)([^:;\{\}\/\*]+)/g, '$1'+_class._getcode('attr', '$2')+'$3'+_class._getcode('string', '$4'))
                                .replace(/([\:\;\{\}])/g, _class._getcode('symbol', '$1'));
                        }
                        //选择器
                        else{
                            v = v.replace(/([^\:\{\}\@\#\s\.]+)/g, _class._getcode('selector', '$1'))
                                .replace(/([\:\{\}\@\#\.])/g, _class._getcode('symbol', '$1'));
                        }
                    }
                }
                str += v;
            })
            return str
        }
    })
})

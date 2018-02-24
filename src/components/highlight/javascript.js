/**
 * @author Aniu[2017-03-02 08:44]
 * @update Aniu[2017-03-02 08:44]
 * @version 1.0.1
 * @description javascript语法高亮组件
 */

Nui.define(function(){
    return this.extend('./highlight', {
        _title:'js',
        _getCode:function(_code){
            var self = this;
            var code = _code || self.code;
            var _class = self.constructor;
            var str = '';
            var kws = 'abstract|arguments|boolean|break|byte|case|catch|char|class|const|continue|debugger|default|delete|do|double|else|elseif|each|enum|eval|export|'+
                      'extends|false|final|finally|float|for|function|goto|if|implements|import|from|in|instanceof|int|include|interface|let|long|native|new|null|'+
                      'package|private|protected|public|return|short|static|super|switch|synchronized|this|throw|throws|transient|true|try|typeof|var';
            var symbol = '&lt;|&gt;|;|!|%|\\\|\\\[|\\\]|\\\(|\\\)|\\\{|\\\}|\\\=|\\\/|-|\\\+|,|\\\.|\\\:|\\\?|~|\\\*|&';
            var match = code.match(/(\/\/.*)|(\/\*(.|\s)*?\*\/)|('[^']*')|("[^"]*")/g);
            var array = _class._getarr(match, code);
            Nui.each(array, function(v){
                if(Nui.trim(v)){
                    //单行注释
                    if(/^\s*\/\//.test(v)){
                        v = _class._getcode('comment', v);
                    }
                    //多行注释
                    else if(/^\s*\/\*/.test(v)){
                        v = v.replace(/(.+)/g, _class._getcode('comment', '$1'))
                    }
                    else{
                        //字符串
                        if(/'|"/.test(v)){
                            v = v.replace(/(.+)/g, _class._getcode('string', '$1'))
                        }
                        //关键字、符号、单词
                        else{
                            v = v.replace(new RegExp('('+ symbol +')', 'g'), _class._getcode('symbol', '$1'))
                                .replace(new RegExp('([\\w$]?)('+ kws +')(\\s+|\\\<code)', 'g'), function(str, m1, m2, m3){
                                    if(m1){
                                        return str
                                    }
                                    return m1 + _class._getcode('keyword', m2) + m3
                                })
                                .replace(/(\/code>\s*)(\d+)/g, '$1'+_class._getcode('number', '$2'))
                                .replace(/(\/code>\s*)?([^<>\s]+)(\s*<code)/g, '$1'+_class._getcode('word', '$2')+'$3')

                        }
                        v = _class._comment(v);
                    }
                }
                str += v;
            })
            return str
        }
    })
})

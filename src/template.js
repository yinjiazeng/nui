/**
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 模版引擎
 */

Nui.define('template', ['util'], function(util){

    /**
    * @name template
    * @param tplid {String} 模板id
    * @param data {Object, Array} 渲染数据
    * @return {String} 渲染后的html字符串
    */
    var template = function(tplid, data){
        if(tplid && options.cache === true && caches[tplid]){
            return render(caches[tplid], data)
        }
        var ele = document.getElementById(tplid);
        if(ele && ele.nodeName==='SCRIPT' && ele.type === 'text/html'){
            return render(caches[tplid] = ele.innerHTML, data)
        }
        return ''
    }

    var caches = {};

    var options = {
        openTag:'{{',
        closeTag:'}}',
        cache:true
    }

    var methods = {
        trim:Nui.trim,
        formatDate:util.formatDate,
        setParam:util.setParam
    }

    /**
    * @name render
    * @param tpl {String} 模板字符串
    * @param data {Object, Array} 渲染数据，data为数组会转为对象，属性为 $list
    * @return {String} 渲染后的html字符串
    */
    var render = function(tpl, data){
        var that = this;
        if(typeof tpl === 'string'){
            var start = options.openTag, end = options.closeTag;
            var regs = start.replace(/([^\s])/g, '\\$1');
            var rege = end.replace(/([^\s])/g, '\\$1');
            tpl = tpl.replace(new RegExp(regs+'\\s*include\\s+[\'\"]([^\'\"]*)[\'\"]\\s*'+rege, 'g'), function(str, tplid){
                if(tplid){
                    var tmp = that[tplid];
                    if(typeof tmp === 'function'){
                        tmp = tmp();
                    }
                    if(typeof tmp === 'string'){
                        return render.call(that, tmp)
                    }
                    else{
                        return template(tplid)
                    }
                }
                return ''
            })
            if(typeof data === 'object'){
                if(Nui.type(data, 'Array')){
                    data = {
                        $list:data
                    }
                }
                var code = '';
                tpl = tpl.replace(/[\r\n]+/g, '');
                Nui.each(tpl.split(start), function(val, key){
                    val = val.split(end);
                    if(key >= 1){
                        code += compile(Nui.trim(val[0]), true)
                    }
                    else{
                        val[1] = val[0];
                    }
                    code += compile(val[1].replace(/'/g, "\\'").replace(/"/g, '\\"'))
                });
                Nui.each(data, function(v, k){
                    code = code.replace(new RegExp('([^\\w\\.\'\"]+)'+k.replace(/\$/g, '\\$'), 'g'), '$1that.data.'+k)
                })
                var Tmpl = new Function('var that=this, code="";' + code + ';that.echo=function(){return code}');
                Tmpl.prototype = methods;
                Tmpl.prototype.each = Nui.each;
                Tmpl.prototype.data = data;
                tpl = new Tmpl().echo();
                Tmpl = null;
            }
            return tpl
        }
        return ''
    }

    /**
    * @name compile
    * @param tpl {String} 模板片段
    * @param logic {Boolean} 是否为逻辑代码
    * @return {String} 可被js识别的代码片段
    */
    var compile = function(tpl, logic){
        var code, res;
        if(logic){
            if((res = match(tpl, 'if')) !== false){
                code = 'if('+res+'){'
            }
            else if((res = match(tpl, 'elseif')) !== false){
                code = '\n}\nelse if('+res+'){'
            }
            else if(tpl.indexOf('else') !== -1){
                code = '\n}\nelse{'
            }
            else if(tpl.indexOf('/if') !== -1){
                code = '\n}'
            }
            else if((res = match(tpl, 'each', /\s+/)) !== false){
                code = 'that.each('+ res[0] +', function('+(res[1]||'$value')+','+(res[2]||'$index')+'){'
            }
            else if(tpl.indexOf('/each') !== -1){
                code = '\n});'
            }
            else if((res = match(tpl, '|', /\s*,\s*/)) !== false){
                code = 'code+=that.'+res[0]+'('+ res.slice(1).toString() +');'
            }
            else{
                code = 'code+='+tpl+';'
            }
        }
        else{
            code = 'code+=\''+tpl+'\';'
        }
        return code + '\n'
    }

    /**
    * @name match
    * @param str {String} 模板片段
    * @param filter {String} 过滤的字符串
    * @param reg {String, RegExp Object} 分割符号
    * @return {Array} 当模板片段中包含“|”时，返回函数和参数组成的数组，第一个值为函数，后面的全部为参数
    * @return {String} 过滤掉filter的模板片段
    * @return {Boolean} 模板片段不包含filter，返回false
    */
    var match = function(str, filter, reg){
        if(str.indexOf(filter) === 0 || (filter === '|' && str.indexOf(filter) > 0)){
            var rep = '';
            if(filter === '|'){
                rep = ','
            }
            str = str.replace(filter, rep).replace(/^\s+/, '');
            if(reg){
                return str.split(reg)
            }
            return str
        }
        return false
    }

    template.method = function(method, callback){
        if(!methods[method]){
            methods[method] = callback
        }
    }

    template.config = function(){
        var args = arguments;
        if(Nui.type(args[0], 'Object')){
            Nui.each(args[0], function(v, k){
                options[k] = v
            })
        }
        else if(args.length > 1 && typeof args[0] === 'string'){
            options[args[0]] = args[1]
        }
    }

    template.render = render;

    return template
})

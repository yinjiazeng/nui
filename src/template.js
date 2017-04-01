/**
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 模版引擎
 */

Nui.define('template', ['util'], function(util){
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
        beginTag:'<%',
        endTag:'%>',
        cache:true
    }

    var methods = {
        each:Nui.each,
        trim:Nui.trim,
        format:util.formatDate,
        seturl:util.setParam,
        include:function(){
            var args = arguments;
        }
    }

    var render = function(tpl, data){
        if(typeof data === 'object'){
            if(Nui.type(data, 'Array')){
                data = {
                    $list:data
                }
            }
            var start = options.beginTag, end = options.endTag, code = '';
            tpl = tpl.replace(/[\r\n]+/g, '');
            Nui.each(tpl.split(start), function(val, key){
                val = val.split(end);
                if(key >= 1){
                    code += compile(val[0], true)
                }
                else{
                    val[1] = val[0];
                }
                code += compile(val[1].replace(/'/g, "\\'").replace(/"/g, '\\"'))
            });
            Nui.each(data, function(v, k){
                code = code.replace(new RegExp('([^\\w\\.\'\"]+)'+k.replace(/\$/g, '\\$'), 'g'), '$1that._data.'+k)
            })
            var Tmpl = new Function('var that=this, code="";' + code + ';that._echo=function(){return code}');
            Tmpl.prototype = methods;
            Tmpl.prototype._data = data;
            tpl = new Tmpl()._echo();
            Tmpl = null;
        }
        return tpl
    }

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

    var match = function(str, filter, reg){
        if(str.indexOf(filter) === 0 || (filter === '|' && str.indexOf(filter) > 0)){
            var rep = '';
            if(filter === '|'){
                rep = ','
            }
            str = Nui.trim(str.replace(filter, rep));
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

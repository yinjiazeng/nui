/**
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 模版引擎
 */

Nui.define('template', ['util'], function(util){

    var template = function(tplid, data, opts){
        if(tplid){
            if(caches[tplid]){
                return render(caches[tplid], data, opts, tplid)
            }
            var ele = document.getElementById(tplid);
            if(ele && ele.nodeName==='SCRIPT' && ele.type === 'text/html'){
                return render(caches[tplid] = ele.innerHTML, data, opts, tplid)
            }
        }
        return ''
    }

    var caches = {};

    var options = {
        openTag:'{{',
        closeTag:'}}'
    }

    var methods = {
        trim:Nui.trim,
        formatDate:util.formatDate,
        setParam:util.setParam
    }

    var render = function(tpl, data, opts, tplid){
        var that = this;
        if(typeof tpl === 'string'){
            opts = opts || {};
            if(typeof opts === 'string'){
                tplid = opts;
            }
            var openTag = opts.openTag || options.openTag, closeTag = opts.closeTag || options.closeTag;
            var regs = openTag.replace(/([^\s])/g, '\\$1');
            var rege = closeTag.replace(/([^\s])/g, '\\$1');
            tpl = tpl.replace(new RegExp(regs+'\\s*include\\s+[\'\"]([^\'\"]*)[\'\"]\\s*'+rege, 'g'), function(str, tid){
                if(tid){
                    var tmp = that[tid];
                    if(typeof tmp === 'function'){
                        tmp = tmp();
                    }
                    if(typeof tmp === 'string'){
                        return render.call(that, tmp, null, opts)
                    }
                    else{
                        return template(tid, null, opts)
                    }
                }
                return ''
            })
            if(data && typeof data === 'object'){
                if(Nui.type(data, 'Array')){
                    data = {
                        $list:data
                    }
                }
                var code = '';
                tpl = tpl.replace(/[\r\n]+/g, '');
                Nui.each(tpl.split(openTag), function(val, key){
                    val = val.split(closeTag);
                    if(key >= 1){
                        code += compile(Nui.trim(val[0]), true)
                    }
                    else{
                        val[1] = val[0];
                    }
                    code += compile(val[1].replace(/'/g, "\\'").replace(/"/g, '\\"'))
                });
                Nui.each(data, function(v, k){
                    code = code.replace(new RegExp('([^\\w\\.\'\"]+)'+k.replace(/\$/g, '\\$'), 'g'), '$1data.'+k)
                })
                var Func = new Function('data', 'var that=this, line=1; this.code=""; try{' + code + ';}catch(e){that.error(e, line)};');
                Func.prototype.methods = methods;
                Func.prototype.error = error(code, data, tplid);
                Func.prototype.out = function(){
                    return this.code
                }
                tpl = new Func(data).out();
                Func = null;
            }
            return tpl
        }
        return ''
    }

    var error = function(code, data, tplid){
        return function(e, line){
            var msg = '\n';
            var codes = [];
            code = code.split('\n');
            Nui.each(code, function(v, k){
                codes.push((k+1)+ '      ' +v.replace('line += 1;', ''))
            })
            msg += 'code\n';
            msg += codes.join('\n')+'\n\n';
            if(typeof JSON !== undefined){
                msg += 'data\n';
                msg += JSON.stringify(data)+'\n\n';
            }
            if(tplid){
                msg += 'templateid\n';
                msg += tplid+'\n\n';
            }
            msg += 'line\n';
            msg += line+'\n\n';
            msg += 'message\n';
            msg += e.message;
            console.error(msg);
        }
    }

    var compile = function(tpl, logic){
        var code, res;
        if(!tpl){
            return ''
        }
        if(logic){
            if((res = match(tpl, 'if')) !== false){
                code = 'if('+res+'){'
            }
            else if((res = match(tpl, 'elseif')) !== false){
                code = '\n}\nelse if('+res+'){'
            }
            else if(tpl.indexOf('else ') !== -1){
                code = '\n}\nelse{'
            }
            else if(tpl.indexOf('/if') !== -1){
                code = '}'
            }
            else if((res = match(tpl, 'each ', /\s+/)) !== false){
                code = 'Nui.each('+ res[0] +', function('+(res[1]||'$value')+','+(res[2]||'$index')+'){'
            }
            else if(tpl.indexOf('/each') !== -1){
                code = '});'
            }
            else if((res = match(tpl, ' | ', /\s*,\s*/)) !== false){
                code = 'that.code+=that.methods.'+res[0]+'('+ res.slice(1).toString() +');'
            }
            else if(tpl.indexOf('var ') === 0){
                code = tpl+';'
            }
            else{
                code = 'that.code+='+tpl+';'
            }
        }
        else{
            code = 'that.code+=\''+tpl+'\';'
        }
        return code + '\n' + 'line += 1;'
    }

    var match = function(str, filter, reg){
        if(str.indexOf(filter) === 0 || (filter === ' | ' && str.indexOf(filter) > 0)){
            var rep = '';
            if(filter === ' | '){
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

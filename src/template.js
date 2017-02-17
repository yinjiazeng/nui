/**
 * @filename template.js
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 模版引擎
 */

Nui.define('template', ['util'], function(util){
    var template = function(tplid, source){
        var ele = document.getElementById(tplid);
        if(ele && ele.nodeName==='SCRIPT'){
            source = source||{};
            return render(ele.innerHTML, source)
        }
        return ''
    }

    var methods = {
        'each':Nui.each,
        'trim':Nui.trim,
        'format':util.formatDate,
        'seturl':util.setParam
    }

    template.method = function(method, callback){
        if(!methods[method]){
            methods[method] = callback
        }
    }

    template.config = {
        startTag:'{{',
        endTag:'}}'
    }

    var render = function(tpl, source){
        var start = template.config.startTag, end = template.config.endTag, code = '';
        Nui.each(Nui.trim(tpl).split(start), function(val, key){
            val = Nui.trim(val).split(end);
            if(key >= 1){
                code += compile(Nui.trim(val[0]), true)
            }
            else{
                val[1] = val[0];
            }
            code += compile(val[1].replace(/'/g, "\\'").replace(/"/g, '\\"').replace(/[\n\r]+/g, ''))
        });
        code = 'var that=this, code=""; with(data){'+code;
        code += '};that.echo=function(){return code;}';
        var Result = new Function('data', code);
        Result.prototype = methods;
        return new Result(source).echo()
    }

    var compile = function(code, logic){
        var modle, echo;
        if(logic){
            if((modle = match(code, 'if')) !== false){
                echo = 'if('+modle+'){'
            }
            else if((modle = match(code, 'elseif')) !== false){
                echo = '}else if('+modle+'){'
            }
            else if((modle = match(code, 'else')) !== false){
                echo = '}else{'
            }
            else if(match(code, '/if') !== false){
                echo = '}'
            }
            else if((modle = match(code, 'each')) !== false){
                modle = modle.split(/\s+/);
                echo = 'that.each('+ modle[0] +', function('+modle[1];
                if(modle[2]){
                    echo += ', '+modle[2]
                }
                echo += '){'
            }
            else if(match(code, '/each') !== false){
                echo = '});'
            }
            else if((modle = match(code, '|')) !== false){
                modle = modle.split(/\s+/);
                echo = 'code+=that.'+modle[0]+'('+ modle.slice(1).toString() +');'
            }
            else{
                echo = 'code+='+code+';'
            }
        }
        else{
            echo = 'code+=\''+code+'\';'
        }
        return echo
    }

    var match = function(string, filter){
        if(string.indexOf(filter) === 0 || (filter === '|' && string.indexOf(filter) > 0)){
            return Nui.trim(string.replace(filter, ''))
        }
        return false
    }

    template.render = render;

    return template
})

;(function(__define){
    function __requireDefaultModule(module){
        if(module && module.defaults !== undefined){
            return module.defaults
        }
        return module
    }
/**
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 实用工具集
 */

__define('lib/core/util',function(require){
    return ({
        /**
         * @func 常用正则表达式
         */
        regex:{
            //手机
            mobile:/^0?1[3-9][0-9]{9}$/,
            //电话
            tel:/^[0-9-()（）]{7,18}$/,
            //邮箱
            email:/^\w+((-w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
            //身份证
            idcard:/^\d{17}[\d|x]|\d{15}$/,
            //中文
            cn:/^[\u4e00-\u9fa5]+$/,
            //税号
            taxnum:/^[a-zA-Z0-9]{15,20}$/
        },
    
        /**
         * @func 四舍五入保留小数，原生toFixed会有精度问题
         * @return <String>
         * @param digit <String, Number> 待转换数字
         * @param decimal <Number> 保留位数
         * @param number <Number> 小数部分末尾最多显示0的数量
         */
        toFixed:function(digit, decimal, number){
            if(isNaN(digit) || digit === ''){
                return digit
            }
    
            //默认末尾只保留2个0
            if(number === undefined){
                number = 2
            }
    
            decimal = decimal || 0;
    
            //将数字转换为字符串，用于分割
            var value = digit.toString();
    
            //补零
            var mend = function(num){
                var zero = '';
                while(num > 0){
                    zero += '0';
                    num--
                }
                return zero
            }
    
            //正负数
            var pre = '';
            if(value < 0){
                value = value.replace('-', '');
                pre = '-';
            }
    
            //获取小数点所在位置
            var i = value.indexOf('.');
            //存在小数点
            if(i !== -1 && decimal >= 0){
                var integer = parseInt(value.substr(0, i));
                //小数部分转为0.xxxxx
                var _decimal = '0' + value.substr(i);
                var num = '1' + mend(decimal);
                _decimal = (Math.round(_decimal*num)/num).toFixed(decimal);
                //小数四舍五入后，若大于等于1，整数部分需要加1
                if(_decimal >= 1){
                    integer = (integer + 1).toString()
                }
                value = pre + integer + _decimal.substr(1)
            }
            //整数就直接补零
            else if(decimal > 0){
                value = pre + value + '.' + mend(decimal)
            }
    
            if(number !== null && number >= 0 && number < decimal){
                value = value.replace(/0+$/, '');
                var i = value.indexOf('.'), len = 0;
                if(i !== -1){
                    len = value.substr(i+1).length;
                }
                while(len < number){
                    value = value + '0';
                    len++;
                }
                value = value.replace(/\.$/, '');
            }
            
            return value
        },
    
        /**
         * @func 获取url参数值
         * @return <String, Object>
         * @param name <String, Undefined> 参数名，不传则以对象形式返回全部参数
         * @param urls <String, Undefined> url地址，默认为当前访问地址
         */
        getParam:function(name, urls){
            var url = decodeURI(urls||location.href), value = {};
            startIndex = url.indexOf('?');
            if(startIndex++ > 0){
                var param = url.substr(startIndex).split('&'), temp;
                Nui.each(param, function(val){
                    temp = val.split('=');
                    value[temp[0]] = temp[1];
                });
            }
            if(typeof name === 'string' && name){
                value = (temp = value[name]) !== undefined ? temp : '';
            }
            return value;
        },
    
        /**
         * @func 设置url参数值
         * @return <String> 设置后的url
         * @param name <String, Object> 参数名或者{key:value, ...}参数集合
         * @param value <String> 参数值或者url
         * @param urls <String, Undefined> url，没有则获取浏览器url
         */
        setParam:function(name, value, urls){
            var self = this, url;
            if(Nui.type(name, 'Object')){
                url = value||location.href;
                Nui.each(name, function(val, key){
                    if(val || val === 0){
                        url = self.setParam(key, val, url);
                    }
                });
            }
            else{
                url = urls||location.href;
                if(url.indexOf('?') === -1){
                    url += '?';
                }
                if(url.indexOf(name+'=') !== -1){
                    var reg = new RegExp('('+name+'=)[^&]*');
                    url = url.replace(reg, '$1'+value);
                }
                else{
                    var and = '';
                    if(url.indexOf('=') !== -1){
                        and = '&';
                    }
                    url += and+name+'='+value;
                }
            }
            return url;
        },
    
        /**
         * @func 检测浏览器是否支持CSS3属性
         * @return <Boolean>
         * @param style <String> 样式属性
         */
        supportCss3:function(style){
            var prefix = ['webkit', 'Moz', 'ms', 'o'],
                i, humpString = [],
                htmlStyle = document.documentElement.style,
                _toHumb = function (string) {
                    return string.replace(/-(\w)/g, function ($0, $1) {
                        return $1.toUpperCase();
                    });
                };
            for (i in prefix)
                humpString.push(_toHumb(prefix[i] + '-' + style));
            humpString.push(_toHumb(style));
            for (i in humpString)
                if (humpString[i] in htmlStyle) return true;
            return false;
        },
    
        /**
         * @func 检测浏览器是否支持Html5属性
         * @return <Boolean>
         * @param attr <String> 属性
         * @param element <String> DOM元素标签
         */
        supportHtml5:function(attr, element){
            return attr in document.createElement(element);
        },
    
        /**
         * @func 模拟location.href跳转
         * @return <Undefined>
         * @param url <String> 跳转的url
         * @param target <String> 跳转类型，默认为_self
         */
        location:function(url, target){
            if(url){
                jQuery('<a href="'+ url +'"'+ (target ? 'target="'+ (target||'_self') +'"' : '' ) +'><span></span></a>')
                    .appendTo('body').children().click().end().remove();
            }
        },
    
        /**
         * @func 格式化日期
         * @return <String>
         * @param timestamp <String, Number> 时间戳，为空返回横杠“-”
         * @param format <String, Undefined> 输出格式，为空则返回时间戳
         */
        formatDate:function(timestamp, format){
            if(timestamp = parseInt(timestamp)){
                if(!format){
                    return timestamp;
                }
                var date = new Date(timestamp);
                var map = {
                    'M':date.getMonth()+1,
                    'd':date.getDate(),
                    'h':date.getHours(),
                    'm':date.getMinutes(),
                    's':date.getSeconds()
                }
                format = format.replace(/([yMdhms])+/g, function(all, single){
                    var value = map[single];
                    if(value !== undefined){
                        if(all.length > 1){
                           value = '0' + value;
                           value = value.substr(value.length-2);
                       }
                       return value;
                    }
                    else if(single === 'y'){
                        return (date.getFullYear() + '').substr(4-all.length);
                    }
                    return all;
                });
                return format;
            }
            return '-';
        },
    
        /**
         * @func 获取表单数据集合
         * @return <Object>
         * @param element <jQuery Object> 表单元素集合或者form元素
         * @param item <String> 将name相同表单元素值分隔，当设置为jquery选择器时，配合field参数使用，用于获取item中表单元素的数据集合
         * @param field <String> 字段名，配合item参数使用，返回对象中会包含该字段
         * @example
         * <form id="form">
         *  <input type="hidden" name="name0" value="0">
         * <div>
         *  <input type="hidden" name="name1" value="1">
         *  <input type="hidden" name="name2" value="2">
         * </div>
         * <div>
         *  <input type="hidden" name="name1" value="3">
         *  <input type="hidden" name="name2" value="4">
         * </div>
         * <form>
         * getData($('#form'), 'div', 'list').result => 
         * {
         *  name0:'0',
         *  list:[{
         *      name1:'1',
         *      name2:'2'
         *  }, {
         *      name1:'3',
         *      name2:'4'
         *  }]
         * }
         */
        getData:function(element, item, field){
            var that = this;
            var data = {
                'result':{},
                'voids':0, //字段中空值数量
                'total':0 //总计多少个字段
            }
            if(element.length){
                var arr = element.serializeArray();
                if(!arr.length){
                    arr = element.find('[name]').serializeArray();
                }
                var div = ',';
                if(item && typeof item === 'string' && !field){
                    div = item
                }
                Nui.each(arr, function(v, i){
                    var val = Nui.trim(v.value)
                    data.total++;
                    if(!val){
                        data.voids++
                    }
                    var name = v.name;
                    if(!Nui.isArray(data.result[name])){
                        data.result[name] = [];
                    }
                    data.result[name].push(val)
                })
                Nui.each(data.result, function(v, k){
                    data.result[k] = v.join(div)
                })
                if(item && field){
                    var once = false;
                    data.result[field] = [];
                    element.find(item).each(function(){
                        var result = that.getData($(this).find('[name]')).result;
                        if(item !== true && !once){
                            Nui.each(result, function(v, k){
                                delete data.result[k];
                            });
                            once = true
                        }
                        data.result[field].push(result)
                    })
                }
            }
            return data;
        },
        /**
         * @func 获取输入框内光标位置
         * @return <Number>
         * @param element <DOM Object> 表单元素dom对象
         */
        getFocusIndex:function(element){
            var val = Nui.trim(element.value);
            var index = val.length;
            if(element.setSelectionRange){
                index = element.selectionStart;
            }
            else{
                //ie
                try{
                    var temp = document.selection.createRange();
                    var textRange = element.createTextRange();
                    textRange.setEndPoint('endtoend', temp);
                    index = textRange.text.length;
                }
                catch(e){}
            }
            return index;
        },
        /**
         * @func 检测页面是否有文本被选择
         * @return <Boolean>
         */
        isTextSelect:function(){
            var text = '';
            //ie10以及以下浏览器
            if(document.selection){
                text =  document.selection.createRange().text;
            }
            //火狐和ie11浏览器getSelection无法获取表单元素选中文本
            else if(navigator.userAgent.toLowerCase().indexOf('gecko') !== -1){
                var textArea = document.activeElement;
                text = textArea.value.substring(textArea.selectionStart, textArea.selectionEnd);
            }
            //chrome safari opera
            else if(window.getSelection){
                text = window.getSelection().toString();
            }
            //低版本chrome
            else if(document.getSelection){
                text = document.getSelection().toString();
            }
            return !!text;
        },
        /**
         * @func 检测是否需要安装PDF阅读器
         * @return <Boolean>
         */
        isInstallPDF:function(){
            var i, len;
    
            var flag = true;
    
            if(Nui.browser.webkit || (Nui.browser.mozilla && Nui.browser.version > 19)){
                flag = false;
            }
    
            if(navigator.plugins && (len = navigator.plugins.length)){
                for(i = 0; i < len; i++){
                    if(/Adobe Reader|Adobe PDF|Acrobat|Chrome PDF Viewer/.test(navigator.plugins[i].name)){
                        flag = false;
                        break;
                    }
                }
            }
            try{
                if(window.ActiveXObject || window.ActiveXObject.prototype){
                    for(i = 1; i < 10; i++){
                        try{
                            if(eval("new ActiveXObject('PDF.PdfCtrl." + i + "');")){
                                flag = false;
                                break;
                            }
                        }
                        catch(e){
                            flag = true;
                        }
                    }
    
                    var arr = ['PDF.PdfCtrl', 'AcroPDF.PDF.1', 'FoxitReader.Document', 'Adobe Acrobat', 'Adobe PDF Plug-in'];
                    len = arr.length;
                    for(i = 0; i < len; i++){
                        try{
                            if(new ActiveXObject(arr[i])){
                                flag = false;
                                break;
                            }
    
                        }
                        catch(e){
                            flag = true;
                        }
                    }
                }
            }
            catch(e){}
    
            return flag;
        },
        /**
         * @func 检测是否需要安装flash，没有安装则返回安装路径
         * @return <Boolean, String>
         */
        isInstallFlash:function(){
            if(typeof window.ActiveXObject != 'undefined'){
                try{
                    if(!!new ActiveXObject('ShockwaveFlash.ShockwaveFlash')){
                        return false
                    }
                }
                catch(e){}
            }
            else{
                if(!!navigator.plugins['Shockwave Flash']){
                    return false
                }
            }
            if(Nui.browser.msie){
                return 'http://rj.baidu.com/soft/detail/17153.html'
            }
            else{
                return 'http://rj.baidu.com/soft/detail/15432.html'
            }
        },
        /**
         * @func 将数字转换为逗号千分位分隔
         * @param number <String> 数字
         * @return <String>
         */
        formatNumber:function(number){
            var integer = parseInt(number);
            if(!isNaN(integer) && integer && (number = number.toString())){
                var dot = number.indexOf('.');
                var decimal = '';
                if(dot > 0){
                    decimal = number.substr(dot);
                }
                return integer.toLocaleString().replace(/\.\d+$/, '') + decimal
            }
            return number
        },
        /**
         * @func 将数字转换为中文大写
         * @param number <String> 数字
         * @return <String>
         */
        numberToCN:function(number){
            //汉字的数字
            var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
            //基本单位
            var cnIntRadice = new Array('', '拾', '佰', '仟');
            //对应整数部分扩展单位
            var cnIntUnits = new Array('', '万', '亿', '兆');
            //对应小数部分单位
            var cnDecUnits = new Array('角', '分', '毫', '厘');
            //整数金额时后面跟的字符
            var cnInteger = '整';
            //整型完以后的单位
            var cnIntLast = '元';
            //最大处理的数字
            var maxNum = 999999999999999.9999;
            //金额整数部分
            var integerNum;
            //金额小数部分
            var decimalNum;
            //输出的中文金额字符串
            var chineseStr = '';
            //分离金额后用的数组，预定义
            var parts;
            if (number == '') { return ''; }
            var isMinus = number < 0;
            number = Math.abs(parseFloat(number));
            if (number >= maxNum) {
                //超出最大处理数字
                return '';
            }
            if (number == 0) {
                chineseStr = cnNums[0] + cnIntLast + cnInteger;
                return chineseStr;
            }
            //转换为字符串
            number = number.toString();
            if (number.indexOf('.') == -1) {
                integerNum = number;
                decimalNum = '';
            } else {
                parts = number.split('.');
                integerNum = parts[0];
                decimalNum = parts[1].substr(0, 4);
            }
            //获取整型部分转换
            if (parseInt(integerNum, 10) > 0) {
                var zeroCount = 0;
                var IntLen = integerNum.length;
                for (var i = 0; i < IntLen; i++) {
                var n = integerNum.substr(i, 1);
                var p = IntLen - i - 1;
                var q = p / 4;
                var m = p % 4;
                if (n == '0') {
                    zeroCount++;
                } else {
                    if (zeroCount > 0) {
                    chineseStr += cnNums[0];
                    }
                    //归零
                    zeroCount = 0;
                    chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
                }
                if (m == 0 && zeroCount < 4) {
                    chineseStr += cnIntUnits[q];
                }
                }
                chineseStr += cnIntLast;
            }
            //小数部分
            if (decimalNum != '') {
                var decLen = decimalNum.length;
                for (var i = 0; i < decLen; i++) {
                var n = decimalNum.substr(i, 1);
                if (n != '0') {
                    chineseStr += cnNums[Number(n)] + cnDecUnits[i];
                }
                }
            }
            if (chineseStr == '') {
                chineseStr += cnNums[0] + cnIntLast + cnInteger;
            } else if (decimalNum == '') {
                chineseStr += cnInteger;
            }
            if(isMinus){
                chineseStr = '负' + chineseStr
            }
            return chineseStr;
        }
    })
})

/**
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-01-12 04:33]
 * @version 1.0.2
 * @description 模版引擎
 */

__define('lib/core/template',['lib/core/util'], function(util){

    var template = function(tplid, data, opts){
        if(this.tplid = tplid){
            if(caches[tplid]){
                return render.call(this, caches[tplid], data, opts)
            }
            var ele = document.getElementById(tplid);
            if(ele && ele.nodeName==='SCRIPT' && ele.type === 'text/html'){
                return render.call(this, caches[tplid] = ele.innerHTML, data, opts)
            }
        }
        return ''
    }

    var caches = {};

    var options = {
        openTag:'<%',
        closeTag:'%>'
    }

    var methods = {
        trim:Nui.trim,
        formatDate:util.formatDate,
        formatNumber:util.formatNumber,
        setParam:util.setParam,
        toFixed:util.toFixed,
        numberToCN:util.numberToCN
    }

    var isstr = !!''.trim;

    var snippet = ';$that.out = function(){return $that.code';

    //低版本IE用push拼接字符串效率更高
    snippet = (isstr ? '""'+snippet : '[]'+snippet+'.join("")')+'}';

    var join = function(iscode){
        if(isstr){
            if(iscode){
                return function(code){
                    return '$that.code += '+code+';'
                }
            }
            return function(code, snippet){
                return code += snippet
            }
        }
        if(iscode){
            return function(code){
                return '$that.code.push('+code+');'
            }
        }
        return function(code, snippet){
            code.push(snippet);
            return code
        }
    }

    var joinCode = join(true);

    var joinSnippet = join();

    var replaceInclude = function(tpl, openTag, closeTag, opts){
        var that = this;
        var regs = openTag.replace(/([^\s])/g, '\\$1');
        var rege = closeTag.replace(/([^\s])/g, '\\$1');
        return tpl.replace(new RegExp(regs+'\\s*include\\s+[\'\"]([^\'\"]*)[\'\"]\\s*'+rege, 'g'), function(str, tid){
            if(tid){
                var tmp;
                Nui.each(tid.split('.'), function(attr){
                    tmp = (tmp||that)[attr];
                    if(tmp === undefined){
                        return false
                    }
                })
                if(typeof tmp === 'function'){
                    tmp = tmp()
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
    }

    //部分浏览器中表单对象name属性如果和模版中需要使用的变量重名，而这个变量又不存在，返回值就会变成该dom....
    var isNode = typeof HTMLElement === 'object' ? 
    function(obj){
        return obj instanceof HTMLElement;
    } : 
    function(obj){
        return obj.nodeType === 1 && typeof obj.nodeName === 'string';
    };
    var isDom = function(obj){
        if(obj && typeof obj === 'object'){
            //元素集合
            var ele = obj[0];
            if(ele){
                return isNode(ele)
            }
            //元素
            return isNode(obj)
        }
    }

    var render = function(tpl, data, opts){
        var that = this;
        if(typeof tpl === 'string' && tpl){
            opts = opts || {};
            var openTag = opts.openTag || options.openTag, closeTag = opts.closeTag || options.closeTag;
            tpl = replaceInclude.call(that, tpl, openTag, closeTag);
            if(data && typeof data === 'object'){
                if(Nui.isArray(data)){
                    data = {
                        $list:data
                    }
                }
                var code = isstr ? '' : [];
                tpl = tpl.replace(/\s+/g, ' ');
                Nui.each(tpl.split(openTag), function(val, key){
                    val = val.split(closeTag);
                    if(key >= 1){
                        code = joinSnippet(code, compile(Nui.trim(val[0]), true))
                    }
                    else{
                        val[1] = val[0];
                    }
                    code = joinSnippet(code, compile(val[1].replace(/'/g, "\\'").replace(/"/g, '\\"')))
                });

                var variables = isstr ? '' : [];

                for(var k in data){
                    variables = joinSnippet(variables, k+'=$data.'+k+',')
                }

                if(!isstr){
                    code = code.join('');
                    variables = variables.join('');
                }

                code = 'var '+ variables +'$that=this,$method=$that.methods; $that.line=4; $that.code='+ snippet +';\ntry{\n' + code + ';}\ncatch(e){\n$that.error(e, $that.line)\n};';
                
                try{
                    var Rander = new Function('$data', code);
                    Rander.prototype.methods = methods;
                    Rander.prototype.error = error(code, data, that.tplid);
                    Rander.prototype.dom = isDom;
                    tpl = new Rander(data).out();
                    Rander = null
                }
                catch(e){
                    error(code, data, that.tplid)(e)
                }
                
            }
            return tpl
        }
        return ''
    }

    var error = function(code, data, tplid){
        return function(e, line){
            var msg = '\n';
            var codes = [];
            code = 'function anonymous($data){\n'+code+'\n}';
            code = code.split('\n');
            Nui.each(code, function(v, k){
                codes.push((k+1)+ '      ' +v.replace('$that.line++;', ''))
            })
            msg += 'code\n';
            msg += codes.join('\n')+'\n\n';
            if(typeof JSON !== undefined){
                msg += 'data\n';
                msg += JSON.stringify(data)+'\n\n'
            }
            if(tplid){
                msg += 'templateid\n';
                msg += tplid+'\n\n'
            }
            if(line){
                msg += 'line\n';
                msg += line+'\n\n'
            }
            msg += 'message\n';
            msg += e.message;
            console.error(msg)
        }
    }

    var compile = function(tpl, logic){
        if(!tpl){
            return ''
        }
        var code,res;
        if(logic){
            if((res = match(tpl, 'if')) !== undefined){
                code = 'if('+exists(res)+'){'
            }
            else if((res = match(tpl, 'elseif')) !== undefined){
                code = '\n}\nelse if('+exists(res)+'){'
            }
            else if(tpl === 'else'){
                code = '\n}\nelse{'
            }
            else if(tpl === '/if'){
                code = '}'
            }
            else if((res = match(tpl, 'each ', /\s+/)) !== undefined){
                code = 'Nui.each('+ res[0] +', function('+(res[1]||'$value')+','+(res[2]||'$index')+'){'
            }
            else if(tpl === '/each'){
                code = '});'
            }
            else if((res = match(tpl, ' | ', /\s*,\s*/)) !== undefined){
                var str = res[0];
                var i = str.lastIndexOf('(');
                var _call = '(' +exists(res.slice(1).toString()) +')';
                //赋值操作必须要用括号包裹起来
                if(i !== -1){
                    var start = str.substr(0, i);
                    var end = Nui.trimLeft(str.substr(i+1));
                    code = joinCode(start+'($that.methods.' + end + _call)
                }
                else{
                    code = joinCode('$that.methods.'+ str + _call)
                }
            }
            else if(/^(var|let|const|return|delete)\s+/.test(tpl)){
                code = exists(tpl)+';'
            }
            else{
                code = joinCode(exists(tpl, true))
            }
        }
        else{
            code = joinCode('\''+tpl+'\'')
        }
        return code + '\n' + '$that.line++;'
    }

    //判断变量是否存在
    //a.b??  a[b]??  a['b']??  a[b['c']]??
    var exists = function(code, isVal){
        return code.replace(/([\.\$\w]+\s*(\[[\'\"\[\]\w\.\$\s]+\])?)\?\?/g, function(a, b){
            var rep = '(typeof '+ b + '!=="undefined"&&'+ b +'!==null&&'+ b +'!==undefined&&!$that.dom('+ b +')';
            if(isVal){
                rep += '?' + b + ':' + '""';
            }
            return rep + ')'
        })
    }

    var match = function(str, syntax, regexp){
        var replace;
        if(str.indexOf(syntax) === 0){
            replace = ''
        }
        else if(syntax === ' | ' && str.indexOf(syntax) > 0){
            replace = ','
        }
        if(replace !== undefined){
            str = Nui.trimLeft(str.replace(syntax, replace));
            return regexp ? str.split(regexp) : str
        }
    }

    template.method = function(name, callback){
        if(!methods[name]){
            methods[name] = callback
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

__define('pages/components/search/script/data',function(){
    return {
        "historyList": [
            {
                "name": "王福元",
                "type": "1"
            },
            {
                "name": "陈华",
                "type": "1"
            },
            {
                "name": "单立强",
                "type": "1"
            },
            {
                "name": "办公室",
                "type": "0"
            }
        ],
        "deptList": [
            {
                "list": [
                    {
                        "id": "C2EC95B58B8A4070B0D24C1E40773898",
                        "name": "Android开发组",
                        "type": "0"
                    },
                    {
                        "id": "457C92AF84D3401FA4B299E77BD5B74A",
                        "name": "安全小组",
                        "type": "0"
                    }
                ],
                "str": "A"
            },
            {
                "list": [
                    {
                        "id": "12F61C228F654A478DD08414FD3EDE03",
                        "name": "办公室",
                        "type": "0"
                    }
                ],
                "str": "B"
            },
            {
                "list": [
                    {
                        "id": "DB5072AD1FC648BEADFF241919FC2AEF",
                        "name": "财税客户端开发组",
                        "type": "0"
                    },
                    {
                        "id": "A53CBE584ECD4EF89F19586A0448B60F",
                        "name": "财务部",
                        "type": "0"
                    },
                    {
                        "id": "E5E5AFEA2AD247DBA450BA3093777400",
                        "name": "财务税务事业部",
                        "type": "0"
                    },
                    {
                        "id": "02440E0F047C4290AEDB39300F7668AB",
                        "name": "常驻国税",
                        "type": "0"
                    },
                    {
                        "id": "17E6F838EC444FB78304036520F78B3B",
                        "name": "产品部",
                        "type": "0"
                    },
                    {
                        "id": "C8D33C9380DF44CC8803CC07752A3F58",
                        "name": "产品研发二部",
                        "type": "0"
                    },
                    {
                        "id": "BA5673EDDA5A4CA79E76E79104C224B1",
                        "name": "产品研发一部",
                        "type": "0"
                    },
                    {
                        "id": "D892BA332C4E4DC8B161307EC3A9CBCA",
                        "name": "产品组",
                        "type": "0"
                    },
                    {
                        "id": "F343E308F81A46FC862B0E32BB9F3A4A",
                        "name": "CRM开发组",
                        "type": "0"
                    }
                ],
                "str": "C"
            },
            {
                "list": [
                    {
                        "id": "3AD03506BAE046A58CE6C706FC507479",
                        "name": "大库",
                        "type": "0"
                    },
                    {
                        "id": "E4C90E304DB34A6EA50C2E5117F5185A",
                        "name": "大数据组",
                        "type": "0"
                    },
                    {
                        "id": "E3D0E4D521694128AEC2569BF0D19301",
                        "name": "电子发票开发组",
                        "type": "0"
                    }
                ],
                "str": "D"
            },
            {
                "list": [
                    {
                        "id": "E79F1558742643EE9DB47D2653F1291B",
                        "name": "工程财务部",
                        "type": "0"
                    }
                ],
                "str": "G"
            },
            {
                "list": [
                    {
                        "id": "DDAB7046B04743B2B5AD72573AF78B02",
                        "name": "iOS开发组",
                        "type": "0"
                    }
                ],
                "str": "I"
            },
            {
                "list": [
                    {
                        "id": "9159D970D5B44C18A4093C75A52DE77B",
                        "name": "架构组",
                        "type": "0"
                    },
                    {
                        "id": "1D2717221E574D7F87149CDA0E1B71E1",
                        "name": "金融物联网及公安业务部",
                        "type": "0"
                    },
                    {
                        "id": "4DE0192102E746DE80FF090C609059F5",
                        "name": "计算机工程公司",
                        "type": "0"
                    }
                ],
                "str": "J"
            },
            {
                "list": [
                    {
                        "id": "E4A71DF91E4940B1ABF871EABAF10896",
                        "name": "培训中心",
                        "type": "0"
                    }
                ],
                "str": "P"
            },
            {
                "list": [
                    {
                        "id": "F327C86CAD9C4C40813A6446A7DF4997",
                        "name": "前端开发组",
                        "type": "0"
                    }
                ],
                "str": "Q"
            },
            {
                "list": [
                    {
                        "id": "76D28A22651D46E191029F0994FDA5BE",
                        "name": "商用产品业务部",
                        "type": "0"
                    },
                    {
                        "id": "17AE75E162084F3BAA9FFEE6763AF0AF",
                        "name": "审计法律部",
                        "type": "0"
                    },
                    {
                        "id": "18CDECE8C2564FC7A2B68B4715E40644",
                        "name": "市场运营",
                        "type": "0"
                    }
                ],
                "str": "S"
            },
            {
                "list": [
                    {
                        "id": "FE3EF89F749848EFBF7EA677B9A6AF9C",
                        "name": "研发中心",
                        "type": "0"
                    },
                    {
                        "id": "44436801289B403A9A5CA41F9DA547A2",
                        "name": "用户中心/OA开发组",
                        "type": "0"
                    },
                    {
                        "id": "E5279908620141089CDB082CA159878B",
                        "name": "云记账开发组",
                        "type": "0"
                    },
                    {
                        "id": "FC7758AC4E61467C9B54236DABDDCD05",
                        "name": "运营部",
                        "type": "0"
                    }
                ],
                "str": "Y"
            },
            {
                "list": [
                    {
                        "id": "A545D081B1724E699E4EA4230D62974F",
                        "name": "质量管理部",
                        "type": "0"
                    },
                    {
                        "id": "B4A02B1F0A3A43D3BBF57150955B9B0A",
                        "name": "综合管理部",
                        "type": "0"
                    },
                    {
                        "id": "C99998BEBD0A48B784B80D229448511C",
                        "name": "总经办",
                        "type": "0"
                    }
                ],
                "str": "Z"
            }
        ],
        "empList": [
            {
                "list": [
                    {
                        "id": "149D37B8D7D94866AF52D4CE1BA96275",
                        "name": "白玉玲",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1478594889829.jpg",
                        "post": "JAVA开发",
                        "type": "1"
                    },
                    {
                        "id": "3AAC136B0DBE4666978E443AF796515C",
                        "name": "鲍东",
                        "photo": "http://inv.axnfw.com/group1/M00/7D/EC/wKgHP1k5TIqAcWwHAAHAtZAKXd4773.jpg",
                        "post": "测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "A6862AB2495C42DA8B3970455724EC8F",
                        "name": "边洋杰",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    }
                ],
                "str": "B"
            },
            {
                "list": [
                    {
                        "id": "BF5C6124ACEE4925BEB7E282E8866B97",
                        "name": "蔡乐意",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1471587029608.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "FCCB0D6721604CD292E9F8E4525CDAD1",
                        "name": "蔡璐云",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "产品经理",
                        "type": "1"
                    },
                    {
                        "id": "CD48175AF65A4079B80E8FB88DBAC269",
                        "name": "曹爱平",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "177BB9F3097E4EE4AE77D9CEC9092D9D",
                        "name": "曹达",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "初级测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "B539134D28DE4651B7D489E004C9FE7D",
                        "name": "曹相棕",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "F20DE6E4D2684533A67D1DA307FA3BFB",
                        "name": "陈昂鹏",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "F25F5CD451274E919E32DE7B578C2570",
                        "name": "陈飞虎",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "165450A2FE204CB3943D06BB5597E934",
                        "name": "陈凤生",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1467963306205.jpg",
                        "post": "未设置",
                        "type": "1"
                    },
                    {
                        "id": "4386EFBC016C478496C0A004530103EE",
                        "name": "陈广",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "C++开发",
                        "type": "1"
                    },
                    {
                        "id": "3BB88FCC060642BBB0F21CDEAC4AB668",
                        "name": "程威",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "大数据开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "21F6D66412A94F1994B6879FE4F6E18B",
                        "name": "陈浩",
                        "photo": "http://inv.axnfw.com/group1/M00/A6/2D/wKgHP1l-88aAat5kAADsSD7D0TY918.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "2BDA195F2CF440D5BB1C72AEE3BC8643",
                        "name": "陈华",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1470014043207.jpg",
                        "post": "研发",
                        "type": "1"
                    },
                    {
                        "id": "873DDF1D17824AA2811F9C8733BF8734",
                        "name": "陈焕华",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "C++开发",
                        "type": "1"
                    },
                    {
                        "id": "224A669C33DB46F09B4297722921C7F5",
                        "name": "陈佳",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1479650856509.jpg",
                        "post": "电子发票开发组组长",
                        "type": "1"
                    },
                    {
                        "id": "6E61365780004F78AD9B48A881395A5A",
                        "name": "陈家靖",
                        "photo": "http://inv.axnfw.com/group1/M00/65/F7/wKgHP1kBkpaATmmQAAA_qnloQgM913.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "4909F6CB38C348C8B1F6ACC02ADFB573",
                        "name": "陈嘉俊",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1472346838473.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "3F164E765F6A439289F8197E018A1C31",
                        "name": "尘健",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1482629267381.jpg",
                        "post": "总经理",
                        "type": "1"
                    },
                    {
                        "id": "207DD43450A14704936E5669F69C208C",
                        "name": "陈美",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "EA13B93FE3D34A32A60F49F46B4D46CF",
                        "name": "陈俏",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "BDC8CBCD52F34C8DB1D39FDC0344B13A",
                        "name": "陈瑞君",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "技术支持",
                        "type": "1"
                    },
                    {
                        "id": "C3B1D089607047969F30067AA5CC431B",
                        "name": "陈书华",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "C92A7A17C46E4FB9886EA6032B8D5BEF",
                        "name": "陈闻",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "CE2252E726234632BF660EF9EDB54B94",
                        "name": "陈秀秀",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "CAA3C8838DC94589B4CC8BBAB522F102",
                        "name": "陈艳",
                        "photo": "http://inv.axnfw.com/group1/M00/91/9C/wKgHPloyGL2AfwVTAAAuS1PEzN4706.jpg",
                        "post": "测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "8E3D251BB8554320B1CD486C44C05A23",
                        "name": "陈雍",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "系统运维工程师",
                        "type": "1"
                    },
                    {
                        "id": "775B6E70F85746E4BEFA1DE696A8C1B7",
                        "name": "陈永威",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1470036321635.jpg",
                        "post": "产品经理",
                        "type": "1"
                    },
                    {
                        "id": "94807CC77B494F3DA012E040AE03F406",
                        "name": "陈雨静",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "出纳",
                        "type": "1"
                    },
                    {
                        "id": "88F7C5D7E39D495F936839EE41297A42",
                        "name": "崔克停",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "系统运维工程师",
                        "type": "1"
                    },
                    {
                        "id": "B88D26B3FE9245139CFA2E0A9BEAD6BD",
                        "name": "崔跃",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "java开发",
                        "type": "1"
                    }
                ],
                "str": "C"
            },
            {
                "list": [
                    {
                        "id": "F53B3E1895B44FC9B5AB8576DB4BB1AA",
                        "name": "戴严",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "C89C0FCE4DFA4FDAB0B3B64738D56ABF",
                        "name": "邓奔",
                        "photo": "http://inv.axnfw.com/group1/M00/56/8C/wKgHP1oOhXmAUBz1AAB7tF8dDvg266.jpg",
                        "post": "产品",
                        "type": "1"
                    },
                    {
                        "id": "8E53B7A8464447FD9C625E844CA8806E",
                        "name": "丁凯",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "A73315EE212140B8A854798FE3FA56F8",
                        "name": "丁婷婷",
                        "photo": "http://inv.axnfw.com/group1/M00/B6/41/wKgHP1mb_gOAQuZbAAE01x99Ftw983.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "2923C13530F247958370911D6FD72017",
                        "name": "丁维",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "区域经理",
                        "type": "1"
                    },
                    {
                        "id": "E52B9DF83525403B91B94E218B04A387",
                        "name": "丁晓越",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "商务",
                        "type": "1"
                    },
                    {
                        "id": "9794E41C8019431E9D0F299DC981643D",
                        "name": "董冬",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "05530E29A82E45BAAF3A4832400BF117",
                        "name": "董芳",
                        "photo": "http://inv.axnfw.com/group1/M00/0F/A8/wKgHPlnfLq2AP1kqAADQGE12rYo445.jpg",
                        "post": "区域经理",
                        "type": "1"
                    },
                    {
                        "id": "3E171CBC52DB47E08957822E72F4878E",
                        "name": "董浩然",
                        "photo": "http://inv.axnfw.com/group1/M00/15/BB/wKgHPlnliRyARPRNAAFm4ME6UtI078.jpg",
                        "post": "前端开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "B835A858772C476BA0A198A46673C513",
                        "name": "董礼",
                        "photo": "http://inv.axnfw.com/group1/M00/12/51/wKgHPlniGYqAPUY5AABDVfHlRZQ488.jpg",
                        "post": "维修工程师",
                        "type": "1"
                    },
                    {
                        "id": "D7B0B441E9A549E294259FDDD88966C7",
                        "name": "董利华",
                        "photo": "http://inv.axnfw.com/group1/M00/02/69/wKj-n1pnHDeATd_9AABJVHGfdpY341.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "D3A9CB1A18FF4EE1B50AD1ADE9E5DAF9",
                        "name": "董瑞",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "E314B0498DE64D2EA5E3BFEA07512125",
                        "name": "董盈",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "127981AC7C0A415E8E818CF61FC7BA08",
                        "name": "杜海阳",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "8A85382CA7B74132854CC7FE5126B969",
                        "name": "杜文文",
                        "photo": "http://inv.axnfw.com/group1/M00/3A/4D/wKgHP1oC0SeAF5ZqAACBM6iSh1Y597.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "60443EF6F03F4FAFB2F2A2CFCB94193F",
                        "name": "杜永强",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1481072489814.jpg",
                        "post": "DBA",
                        "type": "1"
                    }
                ],
                "str": "D"
            },
            {
                "list": [
                    {
                        "id": "72A3C161B6544CE0B2EF16060F330971",
                        "name": "方光红",
                        "photo": "http://inv.axnfw.com/group1/M00/0F/9C/wKgHP1nfJ0aAPlA3AAA_Mr8ONA8861.jpg",
                        "post": "账务员",
                        "type": "1"
                    },
                    {
                        "id": "E32BE18C00D84F68994C487ADA63EDB5",
                        "name": "方家运",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "460FE62098B9433A8F86CE6BE70C8428",
                        "name": "方娟红",
                        "photo": "http://inv.axnfw.com/group1/M00/0F/A1/wKgHP1nfKjKAbswQAAAnFv26YJo385.jpg",
                        "post": "商务",
                        "type": "1"
                    },
                    {
                        "id": "AE0EEEF731F841B4903F6930E66E9159",
                        "name": "方鹏",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "81A0C682EAF8439389F4D05A8A74C034",
                        "name": "方琼",
                        "photo": "http://inv.axnfw.com/group1/M00/0F/AD/wKgHPlnfMPWAC2BGAAEcFkR2QDU999.jpg",
                        "post": "商务",
                        "type": "1"
                    },
                    {
                        "id": "E42EEB5424CC4F61B164ED6A5F7B7216",
                        "name": "方世雄",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "9B9E5F63B4204A91A8E6B02FBC30E407",
                        "name": "方雯",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1482124769187.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "E457447789A141EFA6BABD4B6EEF1DF9",
                        "name": "方晓琳",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "电商平台销售",
                        "type": "1"
                    },
                    {
                        "id": "A787E611E7844397A88B3197AB9B73A2",
                        "name": "方晓霞",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "CA56025955984E72A87D8965F5877493",
                        "name": "方新苗",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "架构师",
                        "type": "1"
                    },
                    {
                        "id": "CB1796E4899441708D3AF4C8B38267F1",
                        "name": "凡海涛",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1479733422376.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "050853A360444D74944E16F981C23208",
                        "name": "樊鹏飞",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "C8634B2FFF16400889BF625C48EE43BF",
                        "name": "冯书棋",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "08C6DAC61F39446385D0F1F8034C3BB1",
                        "name": "冯涛",
                        "photo": "http://inv.axnfw.com/group1/M00/C7/3E/wKgHPlpO0vyAW4riAAEzzxuqQGA308.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "549835179F2B4590AF4FD9A37F7F1166",
                        "name": "冯夏",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "C++开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "9EE16348CEC4474DA0DBCFAE3C76A947",
                        "name": "傅志诚",
                        "photo": "http://inv.axnfw.com/group1/M00/73/AB/wKgHPlkiPyOAa7ANAABs9DtoMm4152.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    }
                ],
                "str": "F"
            },
            {
                "list": [
                    {
                        "id": "1E50ED71A8C14262B5907AD3E429BDD3",
                        "name": "刚彦峰",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "AC2F1EA1DD53492EA66CCFE97331D431",
                        "name": "高建明",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "售前顾问",
                        "type": "1"
                    },
                    {
                        "id": "3630AA0470AF413F97F59B73D4E1CB9A",
                        "name": "高冉",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1479688855303.jpg",
                        "post": "C++高级工程师",
                        "type": "1"
                    },
                    {
                        "id": "20F48580E664471C93410D383B41EDD9",
                        "name": "葛红艳",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "客服",
                        "type": "1"
                    },
                    {
                        "id": "2AC34D46E31F4A8EA379674F50FF8202",
                        "name": "耿璐璐",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "9132DFD8223B4D4786BC7E436BA04C5B",
                        "name": "耿宁宁",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "380A1C2928774795B77752DD264AD7B5",
                        "name": "葛新",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "6863C8DD5F12447ABEC5ADB7601676B2",
                        "name": "宫航",
                        "photo": "http://inv.axnfw.com/group1/M00/6A/26/wKgHPloZSAWAZY-PAAAMLwjji7k909.jpg",
                        "type": "1"
                    },
                    {
                        "id": "8CE101483FAE4AAFAD22F9D2B2CA4245",
                        "name": "龚家春",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "FBAF54C3A27D4C7EBE53A29CAD8EB6ED",
                        "name": "苟杰",
                        "photo": "http://inv.axnfw.com/group1/M00/B5/3F/wKgHP1pEu9SACPagAAownYhkrJA371.jpg",
                        "post": "产品经理",
                        "type": "1"
                    },
                    {
                        "id": "4EDC9D3DDC7F4CFB8CEB251EAAA0D0B4",
                        "name": "管建钦",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "部门经理",
                        "type": "1"
                    },
                    {
                        "id": "9884226A30AB466B90D9F45EC6AED30D",
                        "name": "郭辉",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "售后运维",
                        "type": "1"
                    },
                    {
                        "id": "C32438A567F945D9A33D190F5C114319",
                        "name": "郭家树",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "60516EAC24C848B6B34B5FB18AAE7365",
                        "name": "过吕晶",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "FAFD1FF0FD15484BB4B744FE250E97D0",
                        "name": "郭荣",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1479657750111.jpg",
                        "post": "交互设计",
                        "type": "1"
                    },
                    {
                        "id": "BFE28CE3A9914D89839CE61BE6247063",
                        "name": "郭帅",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1492177404671.jpg",
                        "post": "图像处理",
                        "type": "1"
                    },
                    {
                        "id": "9D86A231F0C7435FAFFD8FD58A7BB76A",
                        "name": "郭霆",
                        "photo": "http://inv.axnfw.com/group1/M00/C1/2D/wKgHP1pMLcCAfOpiAAASy_AcyPc090.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "027BFB7013B54BBB806EA5CC0AC04C26",
                        "name": "郭翔宇",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1476529029165.jpg",
                        "type": "1"
                    }
                ],
                "str": "G"
            },
            {
                "list": [
                    {
                        "id": "6342C63F42E04C33828C7C02C2A5C099",
                        "name": "韩磊",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "57E24FAE12BA465A8645FC2423C47F5E",
                        "name": "韩治会",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "01DE00920DC440A593FEF1B8DCD73A11",
                        "name": "何淦根",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1481790406079.jpg",
                        "post": "UED",
                        "type": "1"
                    },
                    {
                        "id": "3539EE06A3FC43AC88A9EE8B9D3F881C",
                        "name": "何景利",
                        "photo": "http://inv.axnfw.com/group1/M00/C1/4A/wKgHP1pMNSuACBhSAAJI0l9mXYI047.jpg",
                        "post": "测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "63260BD894CE41AE861A2F428027D930",
                        "name": "何淑芬",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "809D2B35979D4414A0AE8D8982A858FF",
                        "name": "何鑫",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "1CFF26B34C5D444C9EA38AF9DF12B99F",
                        "name": "何月生",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "渠道总监",
                        "type": "1"
                    },
                    {
                        "id": "C001FABD3A7E4137AC372802B2BF2FA0",
                        "name": "洪彬",
                        "photo": "http://inv.axnfw.com/group1/M00/8F/60/wKgHPlow_u6Af3yoAACOkQz7G7w728.jpg",
                        "post": "Android开发",
                        "type": "1"
                    },
                    {
                        "id": "152D51D2E29F4DA6901F3F13460EDC06",
                        "name": "洪建军",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "技术支持工程师",
                        "type": "1"
                    },
                    {
                        "id": "2B974F27E0254D4D85048A7DAD0F2416",
                        "name": "侯百成",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "B15174E14E6F46549A7355AD741DD50B",
                        "name": "侯若兰",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "04A7C015989140D4A40EA6BD75550C24",
                        "name": "侯亚龙",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "C++开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "65C45EC3CE6A4B23A2BE53E249DBD7C2",
                        "name": "黄芳英",
                        "photo": "http://inv.axnfw.com/group1/M00/99/3D/wKgHPlll2kOAFNOMAADc59CqOhA145.jpg",
                        "post": "产品专员",
                        "type": "1"
                    },
                    {
                        "id": "E4F41385BDB4433E8C1D70FF20931CBD",
                        "name": "黄飞宇",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "产品经理",
                        "type": "1"
                    },
                    {
                        "id": "CEBB66E73C404142957A87838F276B99",
                        "name": "黄华华",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1484399471241.jpg",
                        "post": "产品经理",
                        "type": "1"
                    },
                    {
                        "id": "BF7CE8C950FB4A67AACD41CD854428F9",
                        "name": "黄敬楷",
                        "photo": "http://inv.axnfw.com/group1/M00/A5/03/wKgHP1o7eFCAc92bAAB7YGEpyqk628.jpg",
                        "post": "Android 开发",
                        "type": "1"
                    },
                    {
                        "id": "5BB6A19E25864235976CDC0200F7E6FB",
                        "name": "黄锦虎",
                        "photo": "http://inv.axnfw.com/group1/M00/10/01/wKgHPlngB6qAa00YAAFMAT0bGEM324.jpg",
                        "post": "业务专员",
                        "type": "1"
                    },
                    {
                        "id": "A7485C3419AA4378A87F6E85C7C2B6B3",
                        "name": "黄萍",
                        "photo": "http://inv.axnfw.com/group1/M00/AC/68/wKgHPlpAlXSAMaf5AABsNGmGNqI503.jpg",
                        "post": "产品研发一部经理助理",
                        "type": "1"
                    },
                    {
                        "id": "8F1A51DBA0C84AE9AD77EBC643BAEFA1",
                        "name": "黄瑞山",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "产品经理",
                        "type": "1"
                    },
                    {
                        "id": "DAD153D1F78C40E3BA1F1A1659F0844C",
                        "name": "黄思思",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1471584972553.jpg",
                        "post": "交互",
                        "type": "1"
                    },
                    {
                        "id": "3EAAB411896846B69DE3ECCD7CD9B9DF",
                        "name": "黄文彬",
                        "photo": "http://inv.axnfw.com/group1/M00/11/01/wKgHP1ngdzCAWUa_AAA0yj1u0yA096.jpg",
                        "post": "技术支持",
                        "type": "1"
                    },
                    {
                        "id": "E7EE9D9C56DD41DB971DDC9EC93FA3DA",
                        "name": "黄依依",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "9CAC5429830B43F0932296D435C607D0",
                        "name": "黄玉姣",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "F616859E86C34E15A5CF4A04F1BE8930",
                        "name": "胡浩梁",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "7E2B75BD143E4F948A8485943014DC57",
                        "name": "胡晶茜",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "52921200CA06432DB9AA672649FEAFE6",
                        "name": "胡旻",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "运维工程师",
                        "type": "1"
                    },
                    {
                        "id": "EB59C9DC12F44664884721681A1D67D1",
                        "name": "胡钱樱",
                        "photo": "http://inv.axnfw.com/group1/M00/10/05/wKgHP1ngDzeABeVwAAF9-2ZljPk558.jpg",
                        "post": "销售经理",
                        "type": "1"
                    },
                    {
                        "id": "24F3D270902B4F7E8FCD6785008D3B13",
                        "name": "胡瑞芳",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "项目经理",
                        "type": "1"
                    },
                    {
                        "id": "CC0C659378C14973A84EA24006B44CDF",
                        "name": "胡善海",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1480494643364.jpg",
                        "type": "1"
                    },
                    {
                        "id": "3A540C9C38074B4AB44367E1CE8A387C",
                        "name": "胡胜男",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "122FF75FEFFE4695AEC72C4656D3B399",
                        "name": "胡伟中",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "Java架构",
                        "type": "1"
                    },
                    {
                        "id": "D5E8EFC892854582BC0A7C9CBE1740B4",
                        "name": "胡贤慧",
                        "photo": "http://inv.axnfw.com/group1/M00/E7/12/wKgHPlmxJNWAQM2vAAEJDlcXDNc344.jpg",
                        "post": "测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "E89D6E0D7DB64242ACE5C3802799E453",
                        "name": "胡贤武",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "区域经理",
                        "type": "1"
                    },
                    {
                        "id": "4DD05202745C49388EB8DB0A49690799",
                        "name": "胡小龙",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1484265693433.jpg",
                        "post": "网络运维",
                        "type": "1"
                    }
                ],
                "str": "H"
            },
            {
                "list": [
                    {
                        "id": "53DC5678425D47398A13BF266A589E0B",
                        "name": "江超",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "03C79B0ADAAE47C197EEEB39AE256FA0",
                        "name": "江东升",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "C++开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "2FC58E3A131C4E24AAA3270139DF2E6F",
                        "name": "江李凡",
                        "photo": "http://inv.axnfw.com/group1/M00/C5/5E/wKgHPlmdje6ACl-rAAGzqCk84Lo584.jpg",
                        "post": "财税审核专员",
                        "type": "1"
                    },
                    {
                        "id": "A9896578C05A4C9DBB4108D8B1A45B3A",
                        "name": "蒋猛",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "Android开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "3FFE05CDA6DA45DFAE13F2228CC9E34A",
                        "name": "姜培飞",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "金融业务运营",
                        "type": "1"
                    },
                    {
                        "id": "16CAD146632B4442A620DD723D060EC0",
                        "name": "蒋文勤",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "运营",
                        "type": "1"
                    },
                    {
                        "id": "E03F68D50E2C4805AD18E6CE0507FF44",
                        "name": "蒋文勤",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "产品运营（云记账）",
                        "type": "1"
                    },
                    {
                        "id": "F4D354EA1A4E4F00AC949C87B2C7F2E1",
                        "name": "江文雨",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "37DFE4B347B84B90845F778C4C2772F9",
                        "name": "江欣",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "金融产品运营",
                        "type": "1"
                    },
                    {
                        "id": "E955949FF7854BEEA6BDDDC9C5D39416",
                        "name": "姜瑜",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "D34462F4809D430E8FCB9E91DCAE584A",
                        "name": "焦亮",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "400D669431964760B39014730A3E34A3",
                        "name": "贾延辉",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "C++开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "42F96892F5F04B45B16F79474587DF74",
                        "name": "金国操",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "产品运维工程师",
                        "type": "1"
                    },
                    {
                        "id": "8311BB7D56F142449F3587A639696223",
                        "name": "靳珂",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "E8BD7A8656144D769134B42E1B8B6EF7",
                        "name": "金理胜",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1482205255098.jpg",
                        "post": "C++开发工程师",
                        "type": "1"
                    }
                ],
                "str": "J"
            },
            {
                "list": [
                    {
                        "id": "BC16B3C274BE4E79B8581B02A312929F",
                        "name": "赖德轩",
                        "photo": "http://inv.axnfw.com/group1/M00/0F/E4/wKgHPlnfgjyAIp_LAABuBctuL0c134.jpg",
                        "post": "区域经理",
                        "type": "1"
                    },
                    {
                        "id": "72B3B81BA3594C3486579E48D94A06A7",
                        "name": "赖立婷",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "62D6166E5BA34DFBAA8B7F6808FEDC74",
                        "name": "李斌",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "BA4E9FDD5DB64C2DB1F8490BFDB0B915",
                        "name": "李博妮",
                        "photo": "http://inv.axnfw.com/group1/M00/03/87/wKgHPlnPAzaAPKbgAABLYfoxzaw821.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "831F20CD77974139A99D3A3987E66620",
                        "name": "李晨晨",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "FB2918ABF7384E508C342D8EBE643620",
                        "name": "李发开",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "省公司主任助理",
                        "type": "1"
                    },
                    {
                        "id": "6BDE9F867A5A49EC975AC6E569B877C7",
                        "name": "李粉",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1481863951900.jpg",
                        "post": "测试",
                        "type": "1"
                    },
                    {
                        "id": "76C4F3045DDB440AA6F8907DD5E09E05",
                        "name": "李耿",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "DAF3C6F5E64E401B907F9C5F2EDEA420",
                        "name": "李光华",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "C3D33023F5B24E649D6C78BB896F95F6",
                        "name": "郦国锋",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "技术支持",
                        "type": "1"
                    },
                    {
                        "id": "8E163725F5704DF1A397510E35FF6D11",
                        "name": "李花",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "DC8B4122A070407CA542C4EBA3A29503",
                        "name": "李建夫",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "前端开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "2A23A07E6E4E47E780D24E6AB3921EFF",
                        "name": "李俊杰",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "Java开发",
                        "type": "1"
                    },
                    {
                        "id": "866252004B334C059BAB61795EEFF264",
                        "name": "李坤泽",
                        "photo": "http://inv.axnfw.com/group1/M00/66/AD/wKgHP1oWvfWAGrbRAACrMTFOZw8818.jpg",
                        "post": "测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "3D00885656234F208A35875671E502D6",
                        "name": "凌梦佳",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "前端开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "38E221CB742A4FFBA98D5B9EE396A811",
                        "name": "林海波",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "29FFE96B8A694A228B31A260CCC47C5B",
                        "name": "林杰",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "9D6B4EDF62054D68B6364C217055865B",
                        "name": "林若望",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1480471098499.jpg",
                        "post": "JAVA开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "8D6CDFBCF49E4934872AE9D72CF057C5",
                        "name": "林上畅",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "CFF8424DC2734242A3DDD9E73D74BBA7",
                        "name": "李荣慧",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "32C15538D46D48799FDE5226F7FA9417",
                        "name": "李若亮",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "49DFB5E9EDA04D848E012FADF438DC55",
                        "name": "刘炳花",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "9CAE81235D8C4E1288E90F097B00002F",
                        "name": "刘纯纲",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1478600519622.jpg",
                        "post": "未设置",
                        "type": "1"
                    },
                    {
                        "id": "DF42A679B42B4890B6488B2ACC1406C8",
                        "name": "刘丹丹",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "软件测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "777ADDB1EC414E9BBA98CA43BDD200B7",
                        "name": "刘电魁",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "区域经理",
                        "type": "1"
                    },
                    {
                        "id": "230F74EA93C04800B57231BE97D32E9C",
                        "name": "刘定超",
                        "photo": "http://inv.axnfw.com/group1/M00/F7/1D/wKgHP1nCQA2AVfkaAABAWEVcsHw390.jpg",
                        "post": "研发",
                        "type": "1"
                    },
                    {
                        "id": "CE3F5F1ECAAC4F18A01E3628F99BB75B",
                        "name": "刘凡",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "java 开发",
                        "type": "1"
                    },
                    {
                        "id": "50004F70806041E193B1149AD703BB5F",
                        "name": "刘海明",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "算法工程师",
                        "type": "1"
                    },
                    {
                        "id": "0C42AC74E71A4E48A851E4E167C592BA",
                        "name": "刘海涛",
                        "photo": "http://inv.axnfw.com/group1/M00/81/89/wKgHPlopAnyACMkTAACHKjh6lOo426.jpg",
                        "post": "售前顾问",
                        "type": "1"
                    },
                    {
                        "id": "2C01C780A504487FA3FBF9AF801C049D",
                        "name": "刘静",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1473148011576.jpg",
                        "post": "运营",
                        "type": "1"
                    },
                    {
                        "id": "CD28958A842F490B971C4FE5C7201E68",
                        "name": "刘金容",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "87E0F97A757845F5B49E676E1D9FBC0A",
                        "name": "刘娟",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1472440975544.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "6E5FA706B29C46C0BB55DE8B13A858FE",
                        "name": "刘玲玲",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1474955833054.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "2DEE99B649F446E9AACB76A49193D3C7",
                        "name": "刘梦梅",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "未设置",
                        "type": "1"
                    },
                    {
                        "id": "D98CADC7C8624675A232E786A1CB79D3",
                        "name": "刘明霞",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "BE28D8DD8C2A448E8E8E10DB61DE48B0",
                        "name": "刘胜南",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1479694259657.jpg",
                        "post": "IOS开发",
                        "type": "1"
                    },
                    {
                        "id": "2D6598D34AED4793A4F001153FA2356C",
                        "name": "刘松沅",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1472202498968.jpg",
                        "post": "运营经理",
                        "type": "1"
                    },
                    {
                        "id": "D13C4823A7004A9385F7C52CA3484697",
                        "name": "刘婷婷",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1482124034004.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "E181DC2C30A244858EBB26C4A0BEDBDF",
                        "name": "刘武",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "B4BD49EB03E846EA8E2D9DF82BA7B97C",
                        "name": "刘虓",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1470198365479.jpg",
                        "post": "大区运营",
                        "type": "1"
                    },
                    {
                        "id": "452DF2ADF35E4F38AA423555AD4C947A",
                        "name": "刘小娜",
                        "photo": "http://inv.axnfw.com/group1/M00/95/27/wKgHP1leLk2AXQzoAABdrMxfusg549.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "88D48C32F1D0403681D535A5BC22D1F9",
                        "name": "刘亚君",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "财税专家",
                        "type": "1"
                    },
                    {
                        "id": "8AE7A4177E0E4865A548CB6F6CE646EC",
                        "name": "刘阳",
                        "photo": "http://inv.axnfw.com/group1/M00/BC/0D/wKgHPlmcyAeAQCkVAAC0jPz7cNE188.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "55CAB36C7B2E43FE8306FC128E80A7EC",
                        "name": "刘哲",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "5325E0F4C09A4ABFA6977D3360D572BD",
                        "name": "刘贞水",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "商用客户总监",
                        "type": "1"
                    },
                    {
                        "id": "E70D97161E7440499F572B62223FF317",
                        "name": "刘志远",
                        "photo": "http://inv.axnfw.com/group1/M00/E6/7D/wKgHPlmwtWuACH5gADUifD_27N8935.jpg",
                        "post": "区域经理",
                        "type": "1"
                    },
                    {
                        "id": "A19B30BCDDE645758D4C05AA4FBD8531",
                        "name": "李伟",
                        "photo": "http://inv.axnfw.com/group1/M00/0F/AE/wKgHP1nfMeuAZRySAAElV45MQV4298.jpg",
                        "post": "技术支持",
                        "type": "1"
                    },
                    {
                        "id": "6BBEA0B21B314983AA9D48AC88D3BD14",
                        "name": "黎翔",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "2ACA7D4430474B548FE5C7548AF6FB5E",
                        "name": "李晓鹤",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "5A50488DD0074210A14C308079F586B2",
                        "name": "李阳",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "B6DD053749084F4792F24B1FAAF2AA2C",
                        "name": "鲁胜利",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "前端开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "64B3FCAC6B5145E88B44BF1FD7B4CC5D",
                        "name": "卢晓婷",
                        "photo": "http://inv.axnfw.com/group1/M00/6F/EB/wKgHP1kZzoyARIPVAAE7krkK5FM001.jpg",
                        "post": "测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "052B821FF4674EE9B2D6885F716757BC",
                        "name": "卢朱娜",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "python开发",
                        "type": "1"
                    },
                    {
                        "id": "06B6525BC7A7421192225267CAF93A01",
                        "name": "吕斌",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "9A33445C58324A91A5AE0EE0FED690B0",
                        "name": "吕伟健",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "软件开发（JAVA）",
                        "type": "1"
                    },
                    {
                        "id": "95CB34536EB644A8B70640A78F8EBEEC",
                        "name": "吕秀娟",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "Java开发",
                        "type": "1"
                    },
                    {
                        "id": "5B37131797504A899364C15237B03490",
                        "name": "吕永宝",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1479687573755.jpg",
                        "post": "前端",
                        "type": "1"
                    }
                ],
                "str": "L"
            },
            {
                "list": [
                    {
                        "id": "65ABDEEAE1664DF88A8B4BF8449C3C21",
                        "name": "马剑豪",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "产品经理",
                        "type": "1"
                    },
                    {
                        "id": "F5F6E6EFD9D240A2A584FE25E9D85556",
                        "name": "马敬凯",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1482995486097.jpg",
                        "post": "Web前端",
                        "type": "1"
                    },
                    {
                        "id": "10D7F22B0C134A14B32C2865A270F850",
                        "name": "毛晶晶",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "B6F3BE43C03D4C7BB7E1A4BA48805737",
                        "name": "马睿",
                        "photo": "http://inv.axnfw.com/group1/M00/D7/CE/wKgHP1phX86APuIKAAFeirHqAPI673.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "2670912BE01245E6965292A92BB6466A",
                        "name": "梅峰",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "net工程师",
                        "type": "1"
                    },
                    {
                        "id": "0F11841653AF47A0B982D28F30A11E7A",
                        "name": "莫月锋",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1475607261882.jpg",
                        "post": "Web前端开发工程师",
                        "type": "1"
                    }
                ],
                "str": "M"
            },
            {
                "list": [
                    {
                        "id": "3A5DB9186BF34CD68627A92968065108",
                        "name": "聂金亮",
                        "photo": "http://inv.axnfw.com/group1/M00/1D/7A/wKgHPlnslzOAaFA5AAEkzjvO5Hk977.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "CAF4C90BC59E4F31AFEF56ACA15722EC",
                        "name": "聂媛",
                        "photo": "http://inv.axnfw.com/group1/M00/0F/A1/wKgHPlnfKbyAWk0-AAAbahfXm0g774.jpg",
                        "post": "商务",
                        "type": "1"
                    },
                    {
                        "id": "2972DD07124748C69A149A9011B9AA5F",
                        "name": "倪晶晶",
                        "photo": "http://inv.axnfw.com/group1/M00/15/18/wKgHPlnlQoiAKnc4AAA2hzekO0Y941.jpg",
                        "post": "商务",
                        "type": "1"
                    },
                    {
                        "id": "7AF9C65BDFFB4C3381F039710FA6E2CC",
                        "name": "倪恺文",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "产品经理",
                        "type": "1"
                    },
                    {
                        "id": "B433A2065DDB4710AB9E1178C67A466C",
                        "name": "牛群星",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1482385858483.jpg",
                        "post": "研发",
                        "type": "1"
                    }
                ],
                "str": "N"
            },
            {
                "list": [
                    {
                        "id": "54F3ACB6D1694CD4AC59503EF781E9D0",
                        "name": "潘澄",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "DC1FCC8FCF1B4802BB07DDC84FE9EC92",
                        "name": "潘栋栋",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "CEA9DDBC436F4C28B1D859F2EEE4EA2B",
                        "name": "庞进",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "2876DC7DA6824C9690094D586BDC93A2",
                        "name": "潘维斌",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "产品经理",
                        "type": "1"
                    },
                    {
                        "id": "70262DDADA5D4620AEA63993383C1F4D",
                        "name": "裴文秀",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "仓库管理员",
                        "type": "1"
                    },
                    {
                        "id": "36F3620C648C4BE78FEBEC63D69B3352",
                        "name": "彭飒",
                        "photo": "http://inv.axnfw.com/group1/M00/7E/4E/wKgHP1onVn-AX30dAABKGVtdhS0206.jpg",
                        "post": "C++开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "2F9582E4DD9E4644809603F526184957",
                        "name": "彭勇",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    }
                ],
                "str": "P"
            },
            {
                "list": [
                    {
                        "id": "A7F1E7E7CB404602931A368E099FE8F6",
                        "name": "仇晓峰",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "482C7C69240A415AB31A586F2A5DF2A9",
                        "name": "钱幼学",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "司机",
                        "type": "1"
                    },
                    {
                        "id": "62D1CF241C554331A829E79C46F2E8A0",
                        "name": "青龙生",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1492476169188.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "4871B6EF24A649A0A18EA4D5A4B038A1",
                        "name": "秦海超",
                        "photo": "http://inv.axnfw.com/group1/M00/A1/5E/wKgHPll2jvSAZc_YAAEAQLv4LMc071.jpg",
                        "post": "C++",
                        "type": "1"
                    },
                    {
                        "id": "D7CC69C6A02B49949271BE5960A7B029",
                        "name": "秦娟娟",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "228275C758964465BF1394C0D2815A43",
                        "name": "秦雯倩",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1482368489277.jpg",
                        "post": "产品助理",
                        "type": "1"
                    },
                    {
                        "id": "25A6274168474BA8A0CDD25A6ECA5120",
                        "name": "齐斯陶",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1474181339756.jpg",
                        "post": "所得税技术支持",
                        "type": "1"
                    },
                    {
                        "id": "EC58D9D3F08A4853910AD8F80102C78F",
                        "name": "邱莉",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "2FAEAE08997A474C9934481B234D1423",
                        "name": "邱亮",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1481082679577.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    }
                ],
                "str": "Q"
            },
            {
                "list": [
                    {
                        "id": "B5FC0228C5DB46F780A0D68769A93D7D",
                        "name": "任福洲",
                        "photo": "http://inv.axnfw.com/group1/M00/E3/B5/wKgHPlmtLiGAWWkjAABpo7ioduc360.jpg",
                        "post": "测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "4CCE16218BA2407A847731B6C6A42B3A",
                        "name": "任燕",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "服务监督",
                        "type": "1"
                    }
                ],
                "str": "R"
            },
            {
                "list": [
                    {
                        "id": "2F2C15EA85DF46A99E2ECDB25BDF908E",
                        "name": "单二伟",
                        "photo": "http://inv.axnfw.com/group1/M00/80/73/wKgHP1k_OQGAOGS3AABP_1i-F4s508.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "6ADD49E9463A469AA93FBDAB97C19ADE",
                        "name": "单立强",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1467396928572.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "1C335FEB1C454A5AB07AA6532A9190AB",
                        "name": "宋凯",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "D021C4CAC7794BED8CFF428C06C5F761",
                        "name": "宋晓东",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1481179983069.jpg",
                        "post": "iOS开发",
                        "type": "1"
                    },
                    {
                        "id": "324D05A59DD14D768D73F522362C029B",
                        "name": "孙欢",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "AE608D1276AF49B1906F3C8BB66B6360",
                        "name": "孙军",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "E560AF9BDC124C24A5B662232AAA362E",
                        "name": "孙霄",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "2100ACADB61A47DB8FCF976344B289DE",
                        "name": "孙运利",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1481038902055.jpg",
                        "post": "大数据开发工程师",
                        "type": "1"
                    }
                ],
                "str": "S"
            },
            {
                "list": [
                    {
                        "id": "E69CF11936FF41A3A04482AD6288A233",
                        "name": "邰秀鸿",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "C6A8CC8858644287A3AAAFAD61DFB09A",
                        "name": "唐丽",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "D2A30C9CAA9F43BBB4C3FE469E24A0D8",
                        "name": "唐雁芳",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "项目经理",
                        "type": "1"
                    },
                    {
                        "id": "206D846BFF2C410E813D595C57BA355E",
                        "name": "陶家伟",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "收款员",
                        "type": "1"
                    },
                    {
                        "id": "45F525AAA18443008729F480B8B041BA",
                        "name": "陶炜权",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "前端开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "5168DCA3F438444CB154BB4862E14511",
                        "name": "陶轶",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "8A147AD614584D0FBC7B0A3F16668DB7",
                        "name": "滕罗忠",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "0BDB3ECA01E148E484ACF088DD1AF041",
                        "name": "佟洁",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "09B68734ECEE49EDA9D8058FF357173A",
                        "name": "仝霄",
                        "photo": "http://inv.axnfw.com/group1/M00/C0/5F/wKgHP1pLgb2ATX1RAABOEWwUstM399.jpg",
                        "post": "python开发工程师",
                        "type": "1"
                    }
                ],
                "str": "T"
            },
            {
                "list": [
                    {
                        "id": "354B4FE8F03E458FBC07D6D5674352FD",
                        "name": "王阿曼",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "CC5A451DCC7A4BAC8AAE1714D61151B0",
                        "name": "王蓓",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "4B102BBC1ADF46C98FC6CD66555ACCBA",
                        "name": "王驰珺",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1482385656635.jpg",
                        "post": "Web前端开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "4D956B9FB5A74CB5B7904617E9A5447D",
                        "name": "王冲",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "757FF803308047CCB3AAEFE40CE1F8C4",
                        "name": "王封棠",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "4C32EF50ABB2409BA9BD01FBF7C3B662",
                        "name": "王福元",
                        "photo": "http://inv.axnfw.com/group1/M00/62/E4/wKgHPlj8qrOADQ9zAAGKxmurg_M641.jpg",
                        "post": "前端开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "965E21A482054147A8BCAD7BBA3A4918",
                        "name": "汪恒娇",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "销售助理",
                        "type": "1"
                    },
                    {
                        "id": "0D25D458BB8F455D847C7CE1FEF96C55",
                        "name": "王加",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "产品经理",
                        "type": "1"
                    },
                    {
                        "id": "35DF6A809EF14AC5913D762E80BE6D8D",
                        "name": "王江青",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "476A431627294949BB6CB8D76F354985",
                        "name": "王乐",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "产品运维工程师",
                        "type": "1"
                    },
                    {
                        "id": "C0D25E0DB9DF44C1A643254E97D0B8C1",
                        "name": "王磊",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "运营平面设计",
                        "type": "1"
                    },
                    {
                        "id": "B4DE77ACE0C049DFA4C91833D8CAC3CD",
                        "name": "王利栋",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "爬虫工程师",
                        "type": "1"
                    },
                    {
                        "id": "53250AF9122A4B4182254E3E949BC247",
                        "name": "汪露",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1480494846105.jpg",
                        "post": "开发",
                        "type": "1"
                    },
                    {
                        "id": "00014A5D6A35426F946A706AF7C4711E",
                        "name": "王梦迪",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "2EB1F8E78D114973B3B8480932114733",
                        "name": "王墙荣",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "前端开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "87760858B0484D1E9FA89BF98EAAEB24",
                        "name": "王润",
                        "photo": "http://inv.axnfw.com/group1/M00/B1/1B/wKgHP1mUZaaARKG_AACW-LV5rVw903.jpg",
                        "post": "测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "C8AF9A0D9E5A4D89AC666E575E50FE56",
                        "name": "王小明",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1481770651336.jpg",
                        "post": "iOS开发",
                        "type": "1"
                    },
                    {
                        "id": "001F518340C04CA281FA9D3D25D276CA",
                        "name": "王鑫",
                        "photo": "http://inv.axnfw.com/group1/M00/00/A7/wKgHP1nLcuiAJZiuAAA3XuCdHPA121.jpg",
                        "post": "C++开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "CF7F688D2C6A4722B77E39A1F7176484",
                        "name": "王艳",
                        "photo": "http://inv.axnfw.com/group1/M00/7E/24/wKgHPlonS3SAQIkSAAHKdlpR_4M322.jpg",
                        "post": "安卓开发",
                        "type": "1"
                    },
                    {
                        "id": "F29E443C42B9464E9E4B560E35D6EF42",
                        "name": "汪洋",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "销售助理",
                        "type": "1"
                    },
                    {
                        "id": "77CE25746C7C41B79689695CC0495071",
                        "name": "吴家华",
                        "photo": "http://inv.axnfw.com/group1/M00/D7/C1/wKgHPlpe6keAaE7xAANzgMwTGzc945.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "45A1C8BB863D48DD82E120D38F1448B1",
                        "name": "吴佳君",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "8C1B4EC699B54A889EBD32C65C589B48",
                        "name": "吴佳露",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1481864269961.jpg",
                        "type": "1"
                    },
                    {
                        "id": "372DC6A4913D49629BA752AEBD309D0A",
                        "name": "吴鹏",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1473949253796.jpg",
                        "post": "经理",
                        "type": "1"
                    },
                    {
                        "id": "6CF35CB61CE14D36BC60F7E4B3C14586",
                        "name": "吴鹏（Java开发）",
                        "photo": "http://inv.axnfw.com/group1/M00/6E/A2/wKgHPlkVr3qAFrOrAAAvMvovxMQ301.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "86C2F0DB5BF543919C3054B98EE8AD82",
                        "name": "吴清扬",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "人事助理",
                        "type": "1"
                    },
                    {
                        "id": "89103F2A492245AB8CBA5F49DA76D4DE",
                        "name": "吴文辉",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "757038AC1A114EBF8276ED0E03896801",
                        "name": "吴亚丹",
                        "photo": "http://inv.axnfw.com/group1/M00/83/06/wKgHPloqGBOACn8WAABH0ceTA3M618.jpg",
                        "post": "产品经理",
                        "type": "1"
                    },
                    {
                        "id": "1D34FB80D7E1418788BB6FC9F4012D5A",
                        "name": "吴运娣",
                        "photo": "http://inv.axnfw.com/group1/M00/6C/87/wKgHPlobpp6AFiE5AADn6n0QqJE392.jpg",
                        "post": "移动端测试",
                        "type": "1"
                    }
                ],
                "str": "W"
            },
            {
                "list": [
                    {
                        "id": "6BA3302A7632493CB06FF04218D60CAF",
                        "name": "夏侯桂娟",
                        "photo": "http://inv.axnfw.com/group1/M00/11/2D/wKgHPlnghp6AGL8ZAACiFSWGIU4448.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "4B2E45EC93F54607A59FE0D2F7C06A99",
                        "name": "夏疆",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1480468921930.jpg",
                        "type": "1"
                    },
                    {
                        "id": "059F1597342B447CA5BB7A1FEDAECD95",
                        "name": "向贵芳",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1489049067088.jpg",
                        "post": "金服运营",
                        "type": "1"
                    },
                    {
                        "id": "805DE509334A4D5087C55C8FE6E1B5EA",
                        "name": "项华东",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "D18215CBCCFE47C8A45CA43330B29736",
                        "name": "向家新",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "仓库管理",
                        "type": "1"
                    },
                    {
                        "id": "8CE9F1754ADB4E3BB1FDCA7967561FC8",
                        "name": "项伟",
                        "photo": "http://inv.axnfw.com/group1/M00/C0/69/wKgHPlpLiTOAcyuQAAC5dj3mXKs515.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "D6759BB6AB234139ADB0FE2975622B71",
                        "name": "相炜",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "3DE5DEB351164826956B0E2923AEBBE5",
                        "name": "向一",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "区域经理",
                        "type": "1"
                    },
                    {
                        "id": "84D0F32548E9484BB813938F8660D1D5",
                        "name": "肖宝杰",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1479691524106.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "3E986084072A4DDBBC2D6F834B2DA0D1",
                        "name": "肖妃",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "交互",
                        "type": "1"
                    },
                    {
                        "id": "92F127E945164DC68E39EE613A41CD8F",
                        "name": "肖莉楠",
                        "photo": "http://inv.axnfw.com/group1/M00/02/59/wKj-nVpkrZuAKi78AAIZRNjXByI780.jpg",
                        "post": "行政",
                        "type": "1"
                    },
                    {
                        "id": "DAEF002E3AA34B50A23B817C6F047801",
                        "name": "肖振涛",
                        "photo": "http://inv.axnfw.com/group1/M00/C5/6B/wKgHP1pNwc-AQPTnAADZmJoo72w250.jpg",
                        "post": "交互设计师",
                        "type": "1"
                    },
                    {
                        "id": "049F7D01739C477CA59D47AEAD847259",
                        "name": "夏修俊",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "图像开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "D35EF4F87FC04DA887B239D6C0177E96",
                        "name": "徐超",
                        "photo": "http://inv.axnfw.com/group1/M00/66/B7/wKgHP1oWxZWABYXdAAIgjAD3Ck0529.jpg",
                        "post": "区域经理",
                        "type": "1"
                    },
                    {
                        "id": "D34D91DB3A3E4F1C92F55EFF89A07318",
                        "name": "徐欢",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "234CE0F63BEC4FB783070FB74DB84593",
                        "name": "徐佳磊",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "BCE87136FB504541B306586ADEE1D721",
                        "name": "徐建",
                        "photo": "http://inv.axnfw.com/group1/M00/81/1D/wKgHPloo5CqAEWSuABU6y5AfeKE198.jpg",
                        "post": "总经理",
                        "type": "1"
                    },
                    {
                        "id": "02893315BF944ACF9963E6AA32AFC6CC",
                        "name": "徐建芳",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "C6E2CD9B36E64DE69C5EDE0E3CB61238",
                        "name": "徐建美",
                        "photo": "http://inv.axnfw.com/group1/M00/66/AD/wKgHP1oWvaGAYA-kAAGEYIbnGTg271.jpg",
                        "post": "行政前台",
                        "type": "1"
                    },
                    {
                        "id": "E576917CCA374D1E94EE189600FDD3B0",
                        "name": "徐俊达",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "8DC1EE782E9443B7B97FEEBBA060DD41",
                        "name": "徐军东",
                        "photo": "http://inv.axnfw.com/group1/M00/C8/A6/wKgHPlpPIOCAFzjpAAFB3Hs7bAQ958.jpg",
                        "post": "测试test",
                        "type": "1"
                    },
                    {
                        "id": "98D79E33487C415181436F34B2CB8832",
                        "name": "徐钟腾",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "python开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "3E5FD8F415A54F09BD5F59123CF32B96",
                        "name": "徐倬虓",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    }
                ],
                "str": "X"
            },
            {
                "list": [
                    {
                        "id": "2D228BC5FD3C497B8A0839D77A2361E7",
                        "name": "颜凤兰",
                        "photo": "http://inv.axnfw.com/group1/M00/C7/39/wKgHP1pO0YeAcJKhAACPsc_83x4054.jpg",
                        "post": "java开发",
                        "type": "1"
                    },
                    {
                        "id": "89224B16F062454BB06CEDF57D8AF663",
                        "name": "杨纯纯",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "产品经理",
                        "type": "1"
                    },
                    {
                        "id": "1D10AAED6355460BB49A6CA2FA3AB432",
                        "name": "杨帆",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "前端工程师",
                        "type": "1"
                    },
                    {
                        "id": "18835C8B7B9441CA9CAC57BD6EE194A7",
                        "name": "杨华",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "54C0CC688C044C1CBCB0312AED135ED3",
                        "name": "杨加林",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "Java软件工程师",
                        "type": "1"
                    },
                    {
                        "id": "ACEAD73D723E40949E75B44FCA73B8E6",
                        "name": "杨康",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "1FAF7AE159ED447898540A757C5BB24E",
                        "name": "杨岚",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "2300B1F0892A429EA9677AF161808E87",
                        "name": "杨柳",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "DB8D93B80E2E45B69A3C7FEA3DDE5D5F",
                        "name": "叶其仁",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "4B3053A9F6BC43D5BB2A6DFD8780F73C",
                        "name": "叶永乐",
                        "photo": "http://inv.axnfw.com/group1/M00/0F/AD/wKgHPlnfMTWAXlFVAAFeAuJiaqU608.jpg",
                        "post": "技术支持",
                        "type": "1"
                    },
                    {
                        "id": "F2AC2164E0584796A54C34E8271BAFCC",
                        "name": "易亮",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1480645658974.jpg",
                        "post": "i i",
                        "type": "1"
                    },
                    {
                        "id": "B7E1B8C881AD421BA2B80416F9D488BC",
                        "name": "应江伟",
                        "photo": "http://inv.axnfw.com/group1/M00/87/DD/wKgHPlouCLCAPyywAABBfmX64vM732.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "17A5E5F725334C3782CEA3B416ECDDDC",
                        "name": "应俊",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "65C16B942C694E02B3F8642A123B66FD",
                        "name": "应颍锋",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "B491B124912C4A0197B2F0415F73450C",
                        "name": "尹加增",
                        "photo": "http://inv.axnfw.com/group1/M00/C0/78/wKgHP1pLkVSAJV65AAEvaJD1RJo582.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "AFF6024C6D82492C98A2FE30E71AFE00",
                        "name": "游映",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "B360350A1A4A446F9161803D4670C2ED",
                        "name": "袁航",
                        "photo": "http://inv.axnfw.com/group1/M00/EA/34/wKgHPlm13k2ASRwjAAAa_G3B7Ak127.jpg",
                        "post": "JAVA开发",
                        "type": "1"
                    },
                    {
                        "id": "4AF0C27F616B4C52B26CB45CED37C138",
                        "name": "俞晓燕",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "行政专员",
                        "type": "1"
                    },
                    {
                        "id": "A5C3265B4CA549F1879E9715775D3768",
                        "name": "俞泽鑫",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    }
                ],
                "str": "Y"
            },
            {
                "list": [
                    {
                        "id": "0E777BFC703247FA84A5B6BB8907AA21",
                        "name": "曾华",
                        "photo": "http://inv.axnfw.com/group1/M00/E7/43/wKgHP1mx1omAfYViAAA2UfGJkz8927.jpg",
                        "post": "运维开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "775187704ABD4C4F91C9C1D499EE7BC5",
                        "name": "曾小峰",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "技术支持",
                        "type": "1"
                    },
                    {
                        "id": "0B608F4D5F254A58A530A8E631A61F0A",
                        "name": "张彬",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "B558D81E71A34939A4F85639C7935604",
                        "name": "张冰凌",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1480563621335.jpg",
                        "post": "大数据组组长",
                        "type": "1"
                    },
                    {
                        "id": "E9EBB96724084D1A9BCF1E0ACC085746",
                        "name": "张超",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "25BFFE667E72439CB24FFCE5A222CC27",
                        "name": "张晨星",
                        "photo": "http://inv.axnfw.com/group1/M00/AF/32/wKgHP1mRZnmAWpceAAGq7hb8pVk549.jpg",
                        "post": "售前顾问",
                        "type": "1"
                    },
                    {
                        "id": "2239CA8CD0C44661A8F6D4EEFD546420",
                        "name": "张驰",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "金融运营",
                        "type": "1"
                    },
                    {
                        "id": "5FFBE0123E2B4859A53CBA4E361AAA3E",
                        "name": "章灯灯",
                        "photo": "http://inv.axnfw.com/group1/M00/0F/55/wKgHP1nfFfCAZDxvAAGOjcWNCcU542.jpg",
                        "post": "研发",
                        "type": "1"
                    },
                    {
                        "id": "9869D38E8B70497EA93168516C86C0F8",
                        "name": "张海浪",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "UED",
                        "type": "1"
                    },
                    {
                        "id": "6147AF04302E44CBAA71DDA2EFF8C00A",
                        "name": "张航东",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "部门负责人",
                        "type": "1"
                    },
                    {
                        "id": "A63E31309E7C4595AB3C1948CAB27170",
                        "name": "张华桂",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "DE8A6030FA2C4BE9BEA2EADF90D142EA",
                        "name": "张慧",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "CDB5E1CA79EB4773BB85BD2475225CF7",
                        "name": "张慧慧",
                        "photo": "http://inv.axnfw.com/group1/M00/AC/F1/wKgHP1mMU7KASpr0AAEbpaI6LtY504.jpg",
                        "post": "iOS",
                        "type": "1"
                    },
                    {
                        "id": "199782438B494015A166B920F2ABACF3",
                        "name": "张慧敏",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1473383090497.jpg",
                        "post": "UED",
                        "type": "1"
                    },
                    {
                        "id": "6A06473D0D6D48DEAF95DC3BC6E98A10",
                        "name": "张健",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1474534992008.jpg",
                        "post": "Pd",
                        "type": "1"
                    },
                    {
                        "id": "45C81991F93B4FA39A04A8CA5E70B54F",
                        "name": "张静静",
                        "photo": "http://inv.axnfw.com/group1/M00/63/7E/wKgHP1oVTgOARfj2AABjy4zcGKM900.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "8697313C2C0F47C5BE6CDFE5629BA7C3",
                        "name": "张璟珂",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "产品经理",
                        "type": "1"
                    },
                    {
                        "id": "AE875D0331C54884BAFD9FC38EA104D3",
                        "name": "张克峰",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1472653568562.jpg",
                        "post": "未设置",
                        "type": "1"
                    },
                    {
                        "id": "A52A396C4151404BB6D5486E1CB3242A",
                        "name": "张林",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1492146466757.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "36C71125297249AD8CD976AA67CAA94A",
                        "name": "张林飞",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1477620163715.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "6C153613C8F04308946F953FAAC26E86",
                        "name": "张茂盛",
                        "photo": "http://inv.axnfw.com/group1/M00/E5/30/wKgHP1mvU2yAeuD4AABHGVuExhs582.jpg",
                        "post": "前端开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "C646EDD019CF48CB9C7AFF5FCF3EC7E6",
                        "name": "张鹏",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "测试试",
                        "type": "1"
                    },
                    {
                        "id": "B26826B60FFE4056B1C398907A3E522A",
                        "name": "张申勇",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "Java开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "91FBD395BFC34329BAAB028CC995E50B",
                        "name": "张士香",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1482037860377.jpg",
                        "post": "运营",
                        "type": "1"
                    },
                    {
                        "id": "7E6C207BE61B48309BBA27EB9C61C023",
                        "name": "张燕燕",
                        "photo": "http://inv.axnfw.com/group1/M00/C3/1E/wKgHPlmdVmOAbLUkAADo9B3YaPg880.jpg",
                        "post": "测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "58FEF8DC208C4F9DB61B528E5CBF5CE2",
                        "name": "张耀挺",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "type": "1"
                    },
                    {
                        "id": "78A5440BD0B947BBAB18FA4C4097D097",
                        "name": "章吟",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "销售助理",
                        "type": "1"
                    },
                    {
                        "id": "75C362FC9EF0478DAA7655FA13B00540",
                        "name": "张影",
                        "photo": "http://inv.axnfw.com/group1/M00/8C/5E/wKgHPllN3PuACENJAAD1zAUzlI0875.jpg",
                        "type": "1"
                    },
                    {
                        "id": "8E937239AFB647D4B7CC06F24DB2C0BD",
                        "name": "张煜",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1480154619247.jpg",
                        "post": "经理",
                        "type": "1"
                    },
                    {
                        "id": "A3B9FD83211E4CF5897FDDEA967735A3",
                        "name": "张宇杰",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "C29E71345A00456EA15A2CA895129DC9",
                        "name": "张卓卿",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "数据分析",
                        "type": "1"
                    },
                    {
                        "id": "68311BF750A746C5A52D169163124896",
                        "name": "赵斌",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "Java架构",
                        "type": "1"
                    },
                    {
                        "id": "BB7C9E1C98C740598A40CE05B58FE6F7",
                        "name": "赵锋",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "维修工程师",
                        "type": "1"
                    },
                    {
                        "id": "1CCCF1B64E32459499CDA3F8F4F3D60C",
                        "name": "赵圣",
                        "photo": "http://inv.axnfw.com/group1/M00/B1/F1/wKgHP1pDZBaAclvTAABl4wUbYWg076.jpg",
                        "post": "产品运营",
                        "type": "1"
                    },
                    {
                        "id": "8CAE22222DED455EAB4058E8CB3F49A9",
                        "name": "赵思佳",
                        "photo": "http://inv.axnfw.com/group1/M00/63/C5/wKgHPlj-mTuAQFmsAAAMyt9dxcE584.jpg",
                        "post": "招聘助理",
                        "type": "1"
                    },
                    {
                        "id": "C9BC9AABCB2342DBA3B51AD3047CA20D",
                        "name": "赵雪",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "测试工程师",
                        "type": "1"
                    },
                    {
                        "id": "CE8327344F6147AB909679706865A557",
                        "name": "赵胤",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1489047138975.jpg",
                        "post": "运营经理",
                        "type": "1"
                    },
                    {
                        "id": "74FC1886F9A246299E1E5FE53E9566EC",
                        "name": "赵志波",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "副总经理",
                        "type": "1"
                    },
                    {
                        "id": "B00CC9B719D7474CBD58D18ABD8DDA15",
                        "name": "郑昌垒",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "技术支持",
                        "type": "1"
                    },
                    {
                        "id": "345399A3E2CC452393FDE94310B5E171",
                        "name": "郑冠庭",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "D447DE4F05034D4ABE3E76601F37E0CF",
                        "name": "郑寒颖",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "前端开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "B99596B49CED4C79BC6BABFC90201503",
                        "name": "郑进强",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "产品运维工程师",
                        "type": "1"
                    },
                    {
                        "id": "11EE19F0B2F043BE80DAEEFE722073F0",
                        "name": "郑萍",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1474620833932.jpg",
                        "type": "1"
                    },
                    {
                        "id": "915BDB3F630E4901A3D948F6866850E8",
                        "name": "郑洲文",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "产品运维工程师",
                        "type": "1"
                    },
                    {
                        "id": "1652D63EEED44FDD94B5EB2DDA4934C0",
                        "name": "周浩丹",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "会计",
                        "type": "1"
                    },
                    {
                        "id": "90DBAE2A41484366B0482BD0CB11FA35",
                        "name": "周嘉莉",
                        "photo": "http://inv.axnfw.com/group1/M00/66/B3/wKgHP1oWwHWAW4VAAAD_hOiX6OM146.jpg",
                        "type": "1"
                    },
                    {
                        "id": "D68236F79A85415499815B15F2811B3A",
                        "name": "周雷",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "客户经理",
                        "type": "1"
                    },
                    {
                        "id": "E879C3B67E1B40CEB3B601172716C407",
                        "name": "周磊",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "B78CBD77F216409E9C5DC05662E00BD4",
                        "name": "周娜",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "数据分析师",
                        "type": "1"
                    },
                    {
                        "id": "A0E7B5C82B4F4248BD44EC45013CF3DE",
                        "name": "周琦",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1489416190749.jpg",
                        "post": "质量管理员",
                        "type": "1"
                    },
                    {
                        "id": "5E301E6F99514E8AA79252AFBFDE07D6",
                        "name": "周婷",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "商务",
                        "type": "1"
                    },
                    {
                        "id": "6172835C26E64C27864F54F44B8E724B",
                        "name": "周雯",
                        "photo": "http://inv.axnfw.com/group1/M00/F9/A9/wKgHPlnEx8SAeu3jAAC0eohP4II198.jpg",
                        "post": "UI设计师",
                        "type": "1"
                    },
                    {
                        "id": "2A7E745982314492A1FD8D6A4B4438E7",
                        "name": "周霞",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1490762016955.jpg",
                        "post": "交互设计师",
                        "type": "1"
                    },
                    {
                        "id": "8D19C8978E4A4BF28A3F220F2725EA8B",
                        "name": "周小娟",
                        "photo": "http://inv.axnfw.com/group1/M00/C0/83/wKgHPlpLlnKAZiSCAAC_B-Gsx7w775.jpg",
                        "post": "web前端开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "3C75ABEFA5784CF4B4B17C80265B0252",
                        "name": "周小敏",
                        "photo": "http://inv.axnfw.com/group1/M00/10/71/wKgHP1ngMySAFas-AAA4yX2dNg4345.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "2DD6119FFAF54343963292F9A30DAF13",
                        "name": "周新",
                        "photo": "http://inv.axnfw.com/group1/M00/4A/98/wKgHP1oKrZ6AGNr-AAD9dHQD-LM092.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "21625901BB0B465AB934062CA9DFC68F",
                        "name": "周雍",
                        "photo": "http://inv.axnfw.com/group1/M00/02/1B/wKj-n1pXP_-AUZ7HAAA_eMi4l3E680.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "B625D5AD4A824945834ED25C40916E4A",
                        "name": "周圆圆",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "69D82D7BE05B4EE5B539461771EF43E7",
                        "name": "朱精武",
                        "photo": "http://inv.axnfw.com/group1/M00/10/06/wKgHP1ngEEqAH_rxAACWUlUNy-w814.jpg",
                        "post": "区域经理",
                        "type": "1"
                    },
                    {
                        "id": "7C01459B93A84C5F94558E8313FB4790",
                        "name": "朱丽晓",
                        "photo": "http://inv.axnfw.com/group1/M00/C0/4E/wKgHPlpLdnSAZt2gAAAMPoEPcwo993.jpg",
                        "post": "测试人员",
                        "type": "1"
                    },
                    {
                        "id": "C79F4D4798F145FAAD60764CAD1FA425",
                        "name": "朱志鹏",
                        "photo": "http://u.jss.com.cn/Contents/usercenter/allow/static/images/man.jpg",
                        "post": "Web前端开发工程师",
                        "type": "1"
                    },
                    {
                        "id": "8770C5EEF1E74F17A47A28BA2ACE9ACC",
                        "name": "邹遥",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1479879548951.jpg",
                        "post": "",
                        "type": "1"
                    },
                    {
                        "id": "8F7DA297EED34F098478BD15AD16E2AB",
                        "name": "祖鹏鹏",
                        "photo": "http://u.jss.com.cn/images/usercenter/personal/1480401551875.jpg",
                        "post": "android开发",
                        "type": "1"
                    }
                ],
                "str": "Z"
            }
        ]
    }
})
__define('lib/core/events',function(){
    return function(opts){
        var self = this, that = opts || self,
            constr = that.constructor,
            isComponent = constr && constr.__component_name,
            elem = self.element || that.element || Nui.doc, 
            events = isComponent ? that._events : that.events;
        if(!elem || !events){
            return that
        }

        if(typeof events === 'function'){
            events = events.call(that)
        }

        if(!(elem instanceof jQuery)){
            elem = jQuery(elem)
        }

        var evt, ele, ret;
        var callback = function(e, elem, cbs){
            if(typeof cbs === 'function'){
                cbs.call(that, e, elem);
            }
            else{
                var _cb, _that;
                Nui.each(cbs, function(cb, i){
                    if(typeof (_cb = that[cb]) === 'function'){
                        _that = that;
                    }
                    else if(typeof (_cb = self[cb]) === 'function'){
                        _that = self;
                    }
                    if(_that){
                        return ret = _cb.call(_that, e, elem, ret);
                    }
                })
            }
        }

        Nui.each(events, function(cbs, evts){
            if(cbs && (typeof cbs === 'string' || typeof cbs === 'function')){
                if(typeof cbs === 'string'){
                    cbs = Nui.trim(cbs).split(/\s+/);
                }
                evts = Nui.trim(evts).split(/\s+/);
                // keyup:kupdown:focus a => elem.on('keyup kupdown focus', 'a', callback)
                evt = evts.shift().replace(/:/g, ' ');
                ele = evts.join(' ');
                //组件内部处理
                if(isComponent){
                    that._on(evt, elem, ele, function(e, elem){
                        callback(e, elem, cbs)
                    })
                }
                else{
                    elem.on(evt, ele, function(e){
                        callback(e, jQuery(this), cbs)
                    })
                }
            }
        })
        return that
    }
})
/**
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 组件基类
 */

__define('lib/core/component',['lib/core/template', 'lib/core/events'], function(tpl, events){
    var module = this;
    var require = this.require;
    var extend = this.extend;
    var callMethod = function(method, args, obj){
        //实参大于形参，最后一个实参表示id
        if(args.length > method.length){
            var id = args[args.length-1];
            if(id && Nui.type(id, ['String', 'Number']) && obj._options.id !== id && obj.__id !== id){
                return
            }
        }
        method.apply(obj, args)
    }
    //去除IE67按钮点击黑边
    if(Nui.bsie7){
        Nui.doc.on('focus', 'button, input[type="button"]', function(){
            this.blur()
        })
    }
    /**
     * 单和双下划线开头表示私有方法或者属性，只能在内部使用，
     * 单下划线继承后可重写或修改，双下划线为系统预置无法修改
     * 系统预置属性方法：__id, __instances, __eventList, __parent, __component_name, __setMethod
     */
    var statics = {
        //实例对象唯一标记
        __id:0,
        //实例对象容器
        __instances:{},
        /*
        * 将实例方法接口设置为静态方法，这样可以操作多个实例，
        * 默认有 init, option, reset, destroy
        * init表示初始化组件，会查询容器内包含属性为 data-组件名-options的dom元素，并调用组件
        */
        __setMethod:function(apis, components){
            var self = this;
            Nui.each(apis, function(val, methodName){
                if(self[methodName] === undefined){
                    self[methodName] = function(){
                        var self = this, args = arguments, container = args[0], name = self.__component_name;
                        if(name && name !== 'component'){
                            if(container && container instanceof jQuery){
                                if(methodName === 'init'){
                                    var mod = components[name];
                                    if(mod){
                                        container.find('[data-'+name+'-options]').each(function(){
                                            //不能重复调用
                                            if(this.nui && this.nui[name]){
                                                return
                                            }
                                            var elem = jQuery(this);
                                            var options = elem.data(name+'Options');
                                            var _mod;
                                            if(options && typeof options === 'string'){
                                                if(/^{[\s\S]*}$/.test(options)){
                                                    options = eval('('+ options +')');
                                                }
                                                else if(_mod = require(options, true)){
                                                    if(typeof _mod.exports === 'function'){
                                                        options = _mod.exports(elem)
                                                    }
                                                    else{
                                                        options = _mod.exports;
                                                    }
                                                }
                                            }
                                            if(typeof options !== 'object'){
                                                options = {};
                                            }
                                            mod(extend(options, {
                                                target:elem
                                            }))
                                        })
                                    }
                                }
                                else{
                                    container.find('[nui_component_'+ name +']').each(function(){
                                        var obj, method;
                                        if(this.nui && (obj = this.nui[name]) && typeof (method = obj[methodName]) === 'function'){
                                            callMethod(method, Array.prototype.slice.call(args, 1), obj)
                                        }
                                    })
                                }
                            }
                            else{
                                Nui.each(self.__instances, function(obj){
                                    var method = obj[methodName];
                                    if(typeof method === 'function'){
                                        callMethod(method, args, obj)
                                    }
                                })
                            }
                        }
                        else{
                            Nui.each(components, function(v, k){
                                if(k !== 'component' && typeof v[methodName] === 'function'){
                                    v[methodName].apply(v, args)
                                }
                            })
                        }
                    }
                }
            })
            return self
        },
        //对所有实例设置默认选项
        _options:{},
        //创建组件模块时会调用一次，可用于在document上绑定事件操作实例
        _init:jQuery.noop,
        _getSize:function(selector, dir, attr){
            var size = 0;
            attr = attr || 'border';
            dir = dir || 'tb';
            if(attr === 'all'){
                return (this._getSize(selector, dir) + 
                        this._getSize(selector, dir, 'padding') +
                        this._getSize(selector, dir, 'margin'))
            }
            var group = {
                l:['Left'],
                r:['Right'],
                lr:['Left', 'Right'],
                t:['Top'],
                b:['Bottom'],
                tb:['Top', 'Bottom']
            }
            var arr = [{
                border:{
                    l:['LeftWidth'],
                    r:['RightWidth'],
                    lr:['LeftWidth', 'RightWidth'],
                    t:['TopWidth'],
                    b:['BottomWidth'],
                    tb:['TopWidth', 'BottomWidth']
                }
            }, {
                padding:group
            }, {
                margin:group
            }];
            Nui.each(arr, function(val){
                if(val[attr]){
                    Nui.each(val[attr][dir], function(v){
                        var value = parseFloat(selector.css(attr+v));
                        size += isNaN(value) ? 0 : value
                    });
                }
            });
            return size
        },
        _$fn:function(name, module){
            jQuery.fn[name] = function(){
                var args = arguments;
                return this.each(function(){
                    var object, options = args[0];
                    var execMethod = function(){
                        if(typeof options === 'string'){
                            if(options === 'options'){
                                object.option(args[1], args[2])
                            }
                            else if(options.indexOf('_') !== 0){
                                var attr = object[options];
                                
                                if(typeof attr === 'function'){
                                    attr.apply(object, Array.prototype.slice.call(args, 1))
                                }
                            }
                        }
                    }
                    if(this.nui && (object = this.nui[name])){
                        execMethod()
                    }
                    else if(!object){
                        if(Nui.type(options, 'Object')){
                            options.target = this
                        }
                        else{
                            options = {
                                target:this
                            }
                        }
                        object = module(options);
                        execMethod()
                    }
                })
            }
        },
        _$ready:function(name, module){
            if(typeof this.init === 'function'){
                this.init(Nui.doc)
            }
        },
        config:function(){
            var args = arguments;
            var len = args.length;
            var attr = args[0];
            if(Nui.type(attr, 'Object')){
                return this._options = jQuery.extend(true, this._options, attr)
            }
            else if(Nui.type(attr, 'String')){
                if(args.length === 1){
                    return this._options[attr]
                }
                return this._options[attr] = args[1]
            }
        },
        hasInstance:function(id){
            var exist = false;
            var instances = this.__instances;
            if(id !== undefined){
                Nui.each(instances, function(v){
                    if(v.__id === id || v._options.id === id){
                        exist = v;
                        return false
                    }
                })
            }
            else{
                for(i in instances){
                    return true
                }
            }
            return exist
        }
    }

    return ({
        _static:statics,
        _options:{
            target:null,
            //组件id，element会增加class 组件名-组件id
            id:'',
            //组件皮肤，element会增加class nui-组件名-皮肤名
            skin:'',
            //element增加一个或多个类
            className:'',
            onInit:null,
            onReset:null,
            onDestroy:null
        },
        _template:{
            style:'<%each style%><%$index%>:<%$value%>;<%/each%>'
        },
        _init:function(){
            this._exec()
        },
        _exec:jQuery.noop,
        _jquery:function(elem){
            if(typeof elem === 'function'){
                elem = elem.call(this._options, this)
            }
            if(!elem){
                return
            }
            if(elem instanceof jQuery){
                return elem
            }
            return jQuery(elem)
        },
        _getTarget:function(){
            var self = this;
            if(!self.target){
                var target = self._options.target;
                target = self._jquery(target);
                if(!target){
                    return
                }
                self.target = self._bindComponentName(target);
            }
            return self.target
        },
        _bindComponentName:function(element){
            var self = this, _class = self.constructor;
            var attr = 'nui_component_'+_class.__component_name;
            element.attr(attr, '').each(function(){
                if(!this.nui){
                    this.nui = {};
                }
                this.nui[_class.__component_name] = self
            })
            return element
        },
        _tplData:function(data){
            var opts = this._options, 
                _class = this.constructor,
                name = 'nui-' + _class.__component_name, 
                skin = Nui.trim(opts.skin),
                getName = function(_class, arrs){
                    if(_class.__parent){
                        var _pclass = _class.__parent.constructor;
                        var _name = _pclass.__component_name;
                        if(_name !== 'component'){
                            if(skin){
                                arrs.unshift('nui-'+_name+'-'+skin);
                            }
                            arrs.unshift('nui-'+_name);
                            return getName(_pclass, arrs)
                        }
                    }
                    return arrs
                }, className = getName(_class, []);

            className.push(name);
            if(skin){
                className.push(name+'-'+skin)
            }
            if(opts.id){
                className.push(_class.__component_name + '-' + opts.id)
            }
            if(!data){
                data = {}
            }
            if(opts.className){
                className.push(opts.className)
            }
            data.className = className.join(' ');
            return data
        },
        _event:function(){
            var self = this, opts = self._options;
            if(self.element && opts.events){
                opts.element = self.element;
                events.call(self, opts)
            }
            return events.call(self)
        },
        _on:function(type, dalegate, selector, callback, trigger){
            var self = this;
            if(typeof selector === 'function'){
                trigger = callback;
                callback = selector;
                selector = dalegate;
                dalegate = null;
                selector = self._jquery(selector)
            }

            var _callback = function(e){
                return callback.call(this, e, jQuery(this))
            }

            if(dalegate){
                if(typeof selector !== 'string'){
                    selector = selector.selector;
                    if(!selector){
                        selector = self._options.target
                    }
                }
                dalegate.on(type, selector, _callback);
                if(trigger){
                    dalegate.find(selector).trigger(type)
                }
            }
            else{
                selector.on(type, _callback);
                if(trigger){
                    selector.trigger(type)
                }
            }

            self.__eventList.push({
                dalegate:dalegate,
                selector:selector,
                type:type,
                callback:_callback
            });

            return self
        },
        _off:function(){
            var self = this, _eventList = self.__eventList;
            Nui.each(_eventList, function(val, key){
                if(val.dalegate){
                    val.dalegate.off(val.type, val.selector, val.callback)
                }
                else{
                    val.selector.off(val.type, val.callback)
                }
                _eventList[key] = null;
                delete _eventList[key]
            });
            self.__eventList = [];
            return self
        },
        _delete:function(){
            var self = this, _class = self.constructor;
            if(self.target){
                var attr = 'nui_component_'+_class.__component_name;
                self.target.removeAttr(attr).each(function(){
                    if(this.nui){
                        this.nui[_class.__component_name] = null;
                        delete this.nui[_class.__component_name];
                    }
                })
            }
            _class.__instances[self.__id] = null;
            delete _class.__instances[self.__id]
        },
        _reset:function(){
            this._off();
            if(this.element){
                this.element.remove();
                this.element = null;
            }
            return this
        },
        _tpl2html:function(id, data){
            var opts = {
                openTag:'<%',
                closeTag:'%>'
            }
            if(arguments.length === 1){
                return tpl.render(this._template, id, opts)
            }
            return tpl.render.call(this._template, this._template[id], data, opts)
        },
        _callback:function(method, args){
            var self = this, opts = self._options;
            var callback = opts['on'+method];
            if(typeof callback === 'function'){
                if(args){
                    Array.prototype.unshift.call(args, self);
                    return callback.apply(opts, args);
                }
                return callback.call(opts, self)
            }
        },
        option:function(opts, isOriginal){
            var args = arguments;
            var isdef = false;
            var options;
            if(args[0] === true){
                isdef = true
            }
            else if(jQuery.isPlainObject(args[0])){
                options = args[0]
                isdef = args[1]
            }
            else if(args.length > 1 && typeof args[0] === 'string'){
                options = {};
                options[args[0]] = args[1]
                isdef = args[2]
            }
            if(options||isdef){
                this._options = jQuery.extend(true, {}, this[isdef === true ? '_defaultOptions' : '_options'], options)
                this._reset();
                this._exec();
            }
            return this
        },
        reset:function(){
            this.option(true);
            this._callback('Reset');
            return this;
        },
        destroy:function(){
            this._delete();
            this._reset();
            this._callback('Destroy');
        }
    })
})

/**
 * @author Aniu[2016-11-10 22:39]
 * @update Aniu[2017-12-22 10:17]
 * @version 1.0.1
 * @description 输入框占位符
 */

__define('lib/components/placeholder',['lib/core/component', 'lib/core/util'], function(component, util){
    var supportPlaceholder = util.supportHtml5('placeholder', 'input');
    return this.extend(component, {
        _options:{
            /**
             * @func 输入框占位提示文本，若元素上含有placeholder属性将会覆盖该值
             * @type <String>
             */
            text:'',
            /**
             * @func 是否启用动画形式展示
             * @type <Boolean>
             */
            animate:false,
            /**
             * @func 输入框值是否可以和占位符相同
             * @type <Boolean>
             */
            equal:true,
            /**
             * @func 销毁或者重置组件是否还原默认值
             * @type <Boolean>
             */
            restore:true,
            /**
             * @func 占位符文本颜色
             * @type <String>
             */
            color:'#ccc',
            /**
             * @func 调用value方法后执行回调
             * @type <Function>
             */
            onChange:null
        },
        _template:{
            wrap:'<strong class="<% className %>" style="<%include \'style\'%>" />',
            elem:'<b style="<%include \'style\'%>"><%text%></b>'
        },
        _events:{
            'click b':'_focus',
            'focus :input':'_indent',
            'blur :input':'_blur _input',
            'keyup :input':'_input'
        },
        _data:{},
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
        },
        _setData:function(){
            var self = this, _class = self.constructor;
            var isText = self.target.is('textarea');
            var height = self.target.height();
            self._data = {
                top:_class._getSize(self.target, 't', 'padding')+_class._getSize(self.target, 't')+'px',
                height:isText ? 'auto' : height+'px',
                position:'absolute',
                'line-height':isText ? 'normal' : height+'px'
            }
        },
        _create:function(){
            var self = this, opts = self._options, _class = self.constructor;
            if(self._condition()){
                var data = self._tplData();
                data.style = {
                    'position':'relative',
                    'display':'inline-block',
                    'width':self.target.outerWidth()+'px',
                    'overflow':'hidden',
                    'cursor':'text'
                }
                self.element = self.target.wrap(self._tpl2html('wrap', data)).parent();
                self._createElems();
                self._event()
            }
            else if(self._text && opts.color){
                self._setStyle()
            }
        },
        _focus:function(){
            this.target.focus()
        },
        _blur:function(){
            delete this.constructor._active;
        },
        _indent:function(){
            var _class = this.constructor;
            if(this._options.animate && this.$text){
                _class._active = this.target;
                this.$text.stop(true, false).animate({left:this._pLeft+10, opacity:'0.5'});
            }
        },
        _input:function(){
            var val = this.target.val(), _class = this.constructor;
            if((!this._options.equal && val === this._text) || !val){
                this.target.val('');
                if(this.$text){
                    this.$text.show();
                    if(this._options.animate){
                        if(_class._active){
                            this.$text.css({left:this._pLeft+10, opacity:'0.5'})
                        }
                        else{
                            this.$text.stop(true, false).animate({left:this._pLeft, opacity:'1'})
                        }
                    }
                }
            }
            else if(this.$text){
                this.$text.hide()
            }
        },
        _condition:function(){
            return this._options.animate || !supportPlaceholder
        },
        _createElems:function(){
            var opts = this._options;
            if(this._text){
                if(opts.animate || !supportPlaceholder){
                    this.target.removeAttr('placeholder');
                    this._createText();
                }
                else if(opts.color){
                    this._setStyle()
                }
            }
        },
        _createText:function(){
            var self = this, opts = self._options, _class = self.constructor;
            self._pLeft = _class._getSize(this.target, 'l', 'padding') + _class._getSize(this.target, 'l');
            self.$text = $(self._tpl2html('elem', {
                text:self._text,
                style:Nui.extend({
                    left:_class._getSize(self.target, 'l', 'padding')+_class._getSize(self.target, 'l')+'px',
                    color:opts.color,
                    display:self._val ? 'none' : 'inline'
                }, self._data)
            })).appendTo(self.element)
        },
        _setStyle:function(){
            var self = this, opts = self._options;
            self.className = '_nui_'+ self.constructor.__component_name +'_'+self.__id;
            self.target.addClass(self.className);
            if(!self.constructor.style){
                self._createStyle()
            }
            self._createRules()
        },
        _createStyle:function(){
            var self = this;
            var style = document.createElement('style');
            document.head.appendChild(style);
            self.constructor.style = style.sheet
        },
        _createRules:function(){
            var self = this;
            var sheet = self.constructor.style;
            var id = self.__id;
            try{
                sheet.deleteRule(id)
            }
            catch(e){}
            Nui.each(['::-webkit-input-placeholder', ':-ms-input-placeholder', '::-moz-placeholder'], function(v){
                var selector = '.'+self.className+v;
                var rules = 'opacity:1; color:'+(self._options.color||'');
                try{
                    if('addRule' in sheet){
                        sheet.addRule(selector, rules, id)
                    }
                    else if('insertRule' in sheet){
                        sheet.insertRule(selector + '{' + rules + '}', id)
                    }
                }
                catch(e){}
            })
        },
        _reset:function(){
            var self = this;
            self._off();
            if(self.$text){
                self.$text.remove()
            }
            if(self.target){
                self.target.removeClass(self.className);
                if(self.element){
                    self.target.unwrap();
                    self.element = null
                }
                if(self._options.restore === true){
                    self.target.val(self._defaultValue)
                }
                if(self._defaultText){
                    self.target.attr('placeholder', self._defaultText)
                }
                else{
                    self.target.removeAttr('placeholder')
                }
            }
        },
        value:function(val){
            var _class = this.constructor, target = this.target;
            if(arguments.length){
                target.val(val)
            }
            this._input();
            this._callback('Change');
        }
    })
})

/**
 * @author Aniu[2017-12-21 15:12]
 * @update Aniu[2017-12-22 10:17]
 * @version 1.0.1
 * @description input增强
 */

__define('lib/components/input',function(require, imports){
    imports('../assets/components/input/index');
    var placeholder = require('lib/components/placeholder');

    return this.extend(placeholder, {
        _options:{
            /**
             * @func 按钮文本是否是图标编码
             * @type <Boolean,String>
             */
            iconfont:false,
            /**
             * @func 是否默认隐藏，鼠标悬停时才显示
             * @type <Boolean>
             */
            hover:false,
            /**
             * @func 按钮始终显示
             * @type <Boolean>
             */
            show:false,
            /**
             * @func 是否显示查看密码按钮
             * @type <Boolean,String,Object>
             */
            reveal:null,
            /**
             * @func 是否显示清除按钮
             * @type <Boolean,String,Object>
             */
            clear:null,
            /**
             * @func 按钮集合
             * @type <Array>
             */
            button:null
        },
        _template:{
            'button':
                '<span style="<%include \'style\'%>">'+
                '<%each button%>'+
                    '<%var style = $value.style%>'+
                    '<i style="<%include \'style\'%>" class="con-input-button con-input-<%$value.id%> con-input-type-<%type%>'+
                    '<%if $value.iconfont%> '+
                    '<%$value.iconfont === true ? "iconfont" : $value.iconfont%>'+
                    '<%/if%>'+
                    '"'+
                    '<%if $value.title%> title="'+
                        '<%if $value.title === true%>'+
                            '<%include \'content\'%>'+
                        '<%elseif typeof $value.title === "object"%>'+
                            '<%$value.title[type]||""%>'+
                        '<%else%>'+
                            '<%$value.title%>'+
                        '<%/if%>"'+
                    '<%/if%>'+
                    '>'+
                    '<%include \'content\'%>'+
                    '</i>'+
                '<%/each%>'+
                '</span>',
            'content':
                '<%if $value.content && typeof $value.content === "object"%>'+
                '<%$value.content[type]||""%>'+
                '<%else%>'+
                '<%$value.content||""%>'+
                '<%/if%>'
        },
        _events:{
            'click .con-input-clear':'_clear',
            'click .con-input-reveal':'_reveal',
            'mouseenter':'_mouseover',
            'mouseleave':'_mouseout'
        },
        _input:function(){
            var self = this;
            placeholder.exports._input.call(self);
            if(self._hideElem){
                var opts = this._options, val = self.target.val();
                var isHide = (!opts.equal && val === self._text) || !val;
                var type = !isHide ? 'show' : 'hide';
                self._hideElem[type]()
            }
        },
        _mouseover:function(){
            var target = this.target;
            if(!target.prop('readonly') && !target.prop('disabled') && target.val()){
                this._hoverElem.show()
            }
        },
        _mouseout:function(){
            this._hoverElem.hide()
        },
        _condition:function(){
            var opts = this._options;
            if(
                placeholder.exports._condition.call(this) || 
                opts.clear || 
                opts.reveal ||
                opts.button
            ){
                return true
            }
        },
        _createButton:function(hides, hovers){
            var self = this, opts = self._options, button = [], defaults = {}, buttons = {}, caches = {};
            var readonly = self.target.prop('readonly') || self.target.prop('disabled');

            Nui.each(['reveal', 'clear'], function(id){
                var btn = opts[id];
                if(btn){
                    if(typeof btn === 'boolean'){
                        btn = {}
                    }
                    else if(typeof btn === 'string'){
                        btn = {
                            content:btn
                        }
                    }
                    defaults[id] = Nui.extend(true, {}, btn, {id:id})
                }
            })

            if(Nui.type(opts.button, 'Array')){
                Nui.each(opts.button, function(val){
                    if(val){
                        if(typeof val === 'string'){
                            val = {
                                id:val
                            }
                        }
                        var id = val.id, btn = val, def;
                        if(!caches[id]){
                            caches[id] = true;
                            if(def = defaults[id]){
                                btn = $.extend(true, {}, def, val);
                                delete defaults[id]
                            }
                            button.push(btn)
                        }
                    }
                })
            }

            Nui.each(defaults, function(val, id){
                button.push(val)
            })

            Nui.each(button, function(btn){
                if(btn.iconfont === undefined){
                    btn.iconfont = opts.iconfont
                }
                if(btn.hover === undefined){
                    btn.hover = opts.hover
                }
                if(btn.show === undefined){
                    btn.show = opts.show
                }
                if(!btn.style){
                    btn.style = {}
                }
                delete btn.style.display;
                btn.style.display = btn.show === true || (self._val && !readonly) ? 'inline' : 'none';
                if(btn.show !== true){
                    hides.push('.con-input-'+btn.id)
                    if(btn.hover === true){
                        hovers.push('.con-input-'+btn.id)
                    }
                }
                self._bindEvent(btn)
            })

            return self._button = button
        },
        _bindEvent:function(btn){
            var self = this, opts = self._options;
            if(typeof btn.callback === 'function'){
                var method = '_callback_'+btn.id;
                self[method] = function(e, elem){
                    btn.callback.call(opts, self, e, elem)
                }
                var methods = self._events['click .con-input-'+btn.id];
                if(methods){
                    method = Nui.trim(methods.split(method)[0]) + ' ' + method
                }
                self._events['click .con-input-'+btn.id] = method;
            }
        },
        _createElems:function(){
            var self = this, opts = self._options, _class = self.constructor, hides = [], hovers = [];
            placeholder.exports._createElems.call(self);
            self.$button = $(self._tpl2html('button', {
                button:self._createButton(hides, hovers),
                iconfont:opts.iconfont,
                type:self.target.attr('type') === 'password' ? 'password' : 'text',
                style:Nui.extend({
                    right:_class._getSize(self.target, 'r')+'px'
                }, self._data)
            })).appendTo(self.element);
            self._hideElem = self.element.find(hides.toString());
            self._hoverElem = self.element.find(hovers.toString());
        },
        _option:function(type){
            var data = {};
            Nui.each(this._button, function(v){
                if(v.id === type){
                    data = v;
                    return false
                }
            })
            return data
        },
        _clear:function(e, elem){
            this.value('');
            this.target.focus();
            if(this._option('clear').show !== true){
                elem.hide();
            }
        },
        _reveal:function(e, elem){
            var self = this, type = 'text', data = this._option('reveal');
            if(this.target.attr('type') === 'text'){
                type = 'password'
            }
            //IE8-不允许修改type，因此重新创建新元素
            if(Nui.browser.msie && Nui.browser.version <= 8){
                var html = self.target.prop('outerHTML');
                var regexp = /(type=['"]?)(text|password)(['"]?)/i;
                //IE6下input没有type="text"属性
                if(!regexp.test(html)){
                    html = html.replace(/^(<input)/i, '$1 type="'+ type +'"')
                }   
                else{
                    html = html.replace(regexp, '$1'+type+'$3')
                }
                var newInput = $(html).insertAfter(self.target);
                newInput.val(self.target.val());
                self.target.remove();
                self.target = newInput;
            }
            else{
                this.target.attr('type', type);
            }
            elem.removeClass('con-input-type-text con-input-type-password').addClass('con-input-type-' + type);
            if(data.content && typeof data.content === 'object'){
                elem.html(data.content[type]||'')
            }
            if(data.title && typeof data.title === 'object'){
                elem.attr('title', data.title[type]||'')
            }
        },
        _reset:function(){
            if(this.$button){
                this.$button.remove()
            }
            placeholder.exports._reset.call(this)
        }
    })
}); 
/**
 * @author Aniu[2016-11-10 22:39]
 * @update Aniu[2016-11-10 22:39]
 * @version 1.0.1
 * @description layer弹出层
 */

__define('lib/components/layer/layer',function(require, imports){
    imports('../../assets/components/layer/index');
    
    var component = require('lib/core/component');
    var util = require('lib/core/util');
    var template = require('lib/core/template');

    var statics = {
        _maskzIndex:10000,
        _zIndex:10000,
        _init:function(){
            var _class = this;
            var timer = null;
            Nui.win.on('resize', function(){
                clearTimeout(timer);
                timer = setTimeout(function(){
                    Nui.each(_class.__instances, function(val){
                        var opts = val._options;
                        if(opts.position || opts.isCenter === true){
                            val.resize()
                        }
                    })
                })
            })
        },
        _$fn:null,
        _$ready:null,
        init:null
    }

    var options = {
        //内容
        content:'',
        //内容模版
        template:'',
        //模版数据
        data:{},
        //高度
        width:320,
        //宽度
        height:'auto',
        //弹出层层级
        zIndex:null,
        //最大宽度
        maxWidth:0,
        //最大高度
        maxHeight:0,
        //定时器，N毫秒后自动关闭
        timer:0,
        //弹窗四周距离窗口边缘距离
        edge:0,
        //弹窗容器
        container:'body',
        //弹窗标题
        title:'温馨提示',
        //是否可以拖动
        isMove:false,
        //是否有遮罩
        isMask:true,
        //是否只能在窗口内拖动
        isInnerMove:false,
        //点击遮罩是否关闭弹窗
        isClickMask:false,
        //是否使用遮罩拖动
        isMoveMask:false,
        //是否能用hide方法关闭遮罩
        isHide:true,
        //弹窗是否浏览器改变大小时显示在窗口中央
        isCenter:true,
        //是否全屏显示
        isFull:false,
        //是否在点击弹窗时将其置顶
        isTop:false,
        //是否以提示框展示，没有标题，按钮
        isTips:false,
        //是否拖动滚动条固定位置
        isFixed:true,
        //当内容超过弹出层容器，是否显示滚动条
        scrollbar:true,
        //是否点击弹窗或者点击遮罩层是否阻止事件冒泡
        isStopProp:false,
        //按钮对齐方式
        align:'center',
        //是否以气泡形式展示，弹出层边缘会多出箭头
        bubble:{
            enable:false,
            dir:'top'
        },
        //弹出层内容展示iframe，不建议跨域使用
        iframe:{
            enable:false,
            cache:false,
            src:''
        },
        //关闭按钮
        close:{
            enable:true,
            text:'×'
        },
        //确定按钮
        confirm:{
            enable:false,
            name:'normal',
            text:'确定',
            callback:function(){
                return true
            }
        },
        //取消按钮
        cancel:{
            enable:true,
            text:'取消'
        },
        /*弹出层定位 top/left/right/bottom
        position:{
            top:10,
            left:10
        }
        */
        position:null,
        /*将弹出层置于遮罩层底部
        under:[layer1, layer2]
        */
        under:null,
        /*配置按钮，若id为confirm/cancel/close将会覆盖内置按钮参数
        button:[{
            id:'confirm',
            text:'确定',
            name:'normal',
            callback:function(){

            }
        }]
        */
        button:null,
        //onInit：弹出层显示时回调
        //onDestroy：弹出层注销时回调
        //当拖动弹出层移动后回调
        onMove:null,
        //窗口改变大小位置时回调
        onResize:null,
        //容器滚动时回调
        onScroll:null,
        //弹窗隐藏前回调，若返回false则不能隐藏
        onHideBefore:null,
        //弹窗销毁前回调，若返回false则不能销毁
        onDestroyBefore:null,
        //定时关闭弹窗回调
        onTimer:null
    }

    return this.extend(component, {
        _static:statics,
        _options:options,
        _template:{
            layout:
                '<div class="<% className %>" style="<% include \'style\' %>">'+
                    '<div class="layer-box">'+
                        '<%if close%>'+
                            '<% var btn = close %>'+
                            '<% include "button" %>'+
                        '<%/if%>'+
                        '<%if bubble%>'+
                        '<span class="layer-bubble layer-bubble-<%bubble.dir||"top"%>"'+
                        '<%if bubble.style%>'+
                        ' style="<%each bubble.style v n%><%n%>:<%v%>;<%/each%>"'+
                        '<%/if%>'+
                        '><b></b><i></i></span>'+
                        '<%/if%>'+
                        '<%if title%>'+
                        '<div class="layer-head">'+
                            '<span class="layer-title"><%title%></span>'+
                        '</div>'+
                        '<%/if%>'+
                        '<div class="layer-body">'+
                            '<div class="layer-main">'+
                            '<%content%>'+
                            '</div>'+
                        '</div>'+
                        '<%if button && button.length%>'+
                        '<div class="layer-foot" style="text-align:<%align%>">'+
                        '<div class="layer-inner">'+
                        '<%each button btn%>'+
                            '<%include "button"%>'+
                        '<%/each%>'+
                        '</div>'+
                        '</div>'+
                        '<%/if%>'+
                    '</div>'+
                '</div>',
            button:
                '<button class="ui-button'+
                    '<%if btn.name%>'+
                    '<%each [].concat(btn.name) name%> ui-button-<%name%><%/each%>'+
                    '<%/if%> layer-button-<%btn.id%>"'+
                    '<%if btn.style%>'+
                    ' style="<%each btn.style v n%><%n%>:<%v%>;<%/each%>"'+
                    '<%/if%>><%btn.text || "按钮"%></button>',
            iframe:
                '<iframe<%each attr%> <%$index%>="<%$value%>"<%/each%>></iframe>',
            mask:
                '<div class="nui-layer-mask'+
                    '<%if skin%> nui-layer-mask-<%skin%><%/if%>" style="<%include \'style\'%>">'+
                    '<div class="layer-mask"></div>'+
                '</div>',
            movemask:
                '<div class="nui-layer-movemask'+
                    '<%if skin%> nui-layer-movemask-<%skin%><%/if%>" style="<%include \'style\'%>">'+
                '</div>',
            style:
                '<%each style%><%$index%>:<%$value%>;<%/each%>'
        },
        /*
        top:弹窗距离窗口顶部距离
        left:弹窗距离窗口左边距离
        width:弹窗宽度
        height:弹窗高度
        */
        data:{},
        _init:function(){
            this._zIndex = ++this.constructor._zIndex;
            this._exec()
        },
        _exec:function(){
            var self = this, opts = self._options;
            self._container = self._jquery(opts.container);
            if(self._container){
                self._containerDOM = self._container.get(0);
                if(self._containerDOM.tagName !== 'BODY'){
                    self._window = self._container;
                    self._isWindow = false;
                    var pos = self._container.css('position');
                    if('absolute relative fixed'.indexOf(pos) === -1){
                        self._container.css('position', 'relative')
                    }
                }
                else{
                    self._window = Nui.win;
                    self._isWindow = true;
                }
                self._isFixed = opts.isFixed && !Nui.bsie6 && self._isWindow;
                self._create();
            }
        },
        _create:function(){
            var self = this, opts = self._options;
            var buttons = self._createButton(), isTitle = false;
            if(opts.isTips !== true){
                isTitle = typeof opts.title === 'string';
            }
            var data = self._tplData({
                content:self._getContent(),
                close:buttons.close,
                button:buttons.button,
                title:isTitle ? (opts.title||'温馨提示') : null,
                bubble:opts.bubble.enable === true ? opts.bubble : null,
                align:opts.align || 'center',
                style:{
                    'z-index':isNaN(parseInt(opts.zIndex)) ? self._zIndex : opts.zIndex,
                    'position':'absolute',
                    'display':'block'
                }
            });
            if(self._isFixed){
                data.style.position = 'fixed';
            }
            self._setTop();
            self.element = self._bindComponentName($(self._tpl2html('layout', data)).appendTo(self._container));
            self._box = self.element.children('.layer-box');
			self.head = self._box.children('.layer-head');
			self._body = self._box.children('.layer-body');
			self.main = self._body.children('.layer-main');
			self.foot = self._box.children('.layer-foot');
            if(opts.isTips !== true){
                if(opts.iframe.enable === true){
                    self._iframe = self.main.children('iframe');
                    self._iframeOnload()
                }
                if(opts.isMove === true && isTitle){
                    self._bindMove();
                }
                if(opts.isStopProp === true){
                    self._stopProp();
                }
                if(opts.isTop === true){
                    self._bindTop();
                }
            }
            if(self._button.length){
                self._buttonEvent();
            }
            if(opts.isFixed === true && !self._isFixed === true){
                self._bindScroll()
            }
            self._event();
            self._show()
        },
        _getContent:function(){
            var self = this, opts = self._options, content = '', tpl = opts.template;
            if(opts.isTips !== true && opts.iframe.enable === true){
                content = self._createIframe();
            }
            else{
                if(tpl){
                    if(typeof tpl === 'string'){
                        content = template.render(tpl, opts.data)
                    }
                    else if(Nui.type(opts.template, 'Object')){
                        content = template.render.call(tpl, tpl.main, opts.data)
                    }
                }
                else if(typeof opts.content === 'string'){
                    content = opts.content
                }
                else if(opts.content instanceof jQuery){
                    content = opts.content.prop('outerHTML')
                }
            }
            return content
        },
        _createIframe:function(){
            var self = this, opts = self._options, name = 'layer-iframe'+self.__id, src = opts.iframe.src;
            if(opts.iframe.cache === false){
                src = util.setParam('_', new Date().getTime(), src)
            }
            return self._tpl2html('iframe', {
                attr:{
                    frameborder:'0',
                    name:name,
                    id:name,
                    src:src,
                    scroll:'hidden',
                    style:'width:100%;'
                }
            })
        },
        _iframeOnload:function(){
            var self = this;
            self._iframe.load(function(){
                self._iframeDocument = self._iframe.contents();
                self._resize()
            })
        },
        _createButton:function(){
            var self = this, opts = self._options, defaults = {}, buttons = {}, caches = {}, isTips = opts.isTips === true;
            var add = function(id, btn){
                self._button[id === 'close' ? 'unshift' : 'push'](btn)
            }
            self._button = [];

            Nui.each(['close', 'confirm', 'cancel'], function(id){
                var btn = opts[id];
                if(btn && btn.enable === true && (!isTips || id === 'close')){
                    defaults[id] = {
                        id:id,
                        name:btn.name,
                        style:btn.style,
                        text:btn.text,
                        callback:btn.callback
                    }
                }
            });

            if(!isTips && opts.button && opts.button.length){
                Nui.each(opts.button, function(val){
                    var id = val.id, btn = val, def;
                    if(!caches[id]){
                        caches[id] = true;
                        if(def = defaults[id]){
                            btn = $.extend(true, {}, def, val);
                            delete defaults[id]
                        }
                        add(id, btn)
                    }
                })
            }

            Nui.each(defaults, function(val, id){
                add(id, val)
            });

            if(self._button[0] && self._button[0].id === 'close'){
                buttons.close = self._button[0],
                buttons.button = self._button.slice(1);
            }
            else{
                buttons.button = self._button
            }

            return buttons
        },
        _buttonEvent:function(){
            var self = this, opts = self._options;
            Nui.each(self._button, function(val){
                self._on('click', self.element, '.layer-button-'+val.id, function(e, button){
                    if(!button.hasClass('nui-button-disabled')){
                        var id = val.id, callback = val.callback;
                        var isCall = typeof callback === 'function' ? callback.call(opts, self, e, button) : null;
                        if((id === 'confirm' && isCall === true) || (id !== 'confirm' && isCall !== false)){
                            self.destroy()
                        }
                    }
                })
            })
        },
        _stopProp:function(){
            this._on('click', this.element, function(e){
                e.stopPropagation()
            });
        },
        _bindTop:function(){
            var self = this;
            self._on('click', self.element, function(){
                self._setzIndex();
            });
        },
        _bindMove:function(){
            var self = this, opts = self._options, element = self.element;
            var _class = self.constructor, elem = element, isMove = false, x, y, _x, _y;
            self._on('mousedown', self.head, function(e, ele){
                isMove = true;
                self._setzIndex();
                if(opts.isMoveMask === true){
                    elem = self._moveMask = $(self._tpl2html('movemask', {
                        skin:opts.skin,
                        style:{
                            'z-index':self._zIndex+1,
                            'cursor':'move',
                            'position':self._isFixed ? 'fixed' : 'absolute'
                        }
                    })).appendTo(self._container);
                    elem.css({
                        width:self.data.outerWidth - _class._getSize(elem, 'lr', 'all'),
                        height:self.data.outerHeight - _class._getSize(elem, 'tb', 'all'),
                        top:self.data.top,
                        left:self.data.left
                    });
                }
                ele.css('cursor','move');
                x = e.pageX - self.data.left;
                y = e.pageY - self.data.top;
                e.stopPropagation();
            });
            self._on('mousemove', Nui.doc, function(e){
                var width = self._container.outerWidth(), height = self._container.outerHeight();
                if(isMove){
                    _x = e.pageX - x;
                    _y = e.pageY - y;
                    _x < 0 && (_x = 0);
                    _y < 0 && (_y = 0);
                    if(opts.isInnerMove === true){
                        _x + self.data.outerWidth > width && (_x = width - self.data.outerWidth);
                        _y + self.data.outerHeight > height && (_y = height - self.data.outerHeight);
                    }
                    self.data.top = _y;
                    self.data.left = _x;
                    elem.css({top:_y, left:_x});
                    return !isMove;
                }
            });
            self._on('mouseup', Nui.doc, function(e){
                if(isMove){
                    isMove = false;
                    self.head.css('cursor','default');
                    if(opts.isMoveMask === true){
                        element.css(self.data);
                        self._moveMask.remove();
                        self._moveMask = null;
                    }
                    self._callback('Move');
                    self.data.offsetTop = self.data.top - self._window.scrollTop();
                    self.data.offsetLeft = self.data.left - self._window.scrollLeft();
                }
            });
        },
        _bindScroll:function(){
            var self = this, opts = self._options;
            self._on('scroll', self._window, function(e, elem){
                var top = self.data.offsetTop + self._window.scrollTop();
                var left = self.data.offsetLeft + self._window.scrollLeft();
                self.data.top = top;
                self.data.left = left;
                self.element.css(self.data);
                self._callback('Scroll', [e, elem, {top:top, left:left}]);
            })
        },
        //鼠标点击弹出层将弹出层层级设置最大
        _setzIndex:function(){
            var self = this, _class = self.constructor;
            if(self._isTop && self.element){
                self._isTop = false;
                self._zIndex = ++_class._zIndex;
                self.element.css('zIndex', self._zIndex);
                self._setTop();
            }
        },
        _setLower:function(destroy){
            var self = this, _class = self.constructor, opts = self._options, unders = [];
            if(opts.under){
                unders = unders.concat(opts.under);
                if(unders.length){
                    Nui.each(unders, function(obj, k){
                        if(obj && obj.element){
                            obj.element.css('z-index', destroy ? (isNaN(parseInt(obj._options.zIndex)) ? obj._zIndex : obj._options.zIndex) : _class._maskzIndex-1)
                        }
                    })
                }
            }
        },
        _setTop:function(){
            var self = this, _class = self.constructor;
            Nui.each(_class.__instances, function(val){
                if(val && val !== self && val._options.isTop === true){
                    val._isTop = true;
                }
            });
        },
        _position:function(){
            var self = this, data = self.data, pos = self._options.position;
            var _pos = {
                top:pos.top,
                left:pos.left,
                right:pos.right,
                bottom:pos.bottom
            }, _v;

            if(_pos.top !== undefined && _pos.bottom !== undefined){
                delete _pos.bottom
            }

            if(_pos.left !== undefined && _pos.right !== undefined){
                delete _pos.right
            }

            Nui.each(_pos, function(v, k){
                if(v === undefined){
                    delete _pos[k];
                    return true;
                }
                _v = v;
                if(typeof v === 'string'){
                    if(!v){
                        _v = 0
                    }
                    else{
                        if(k === 'top' || k === 'bottom'){
                            if(v === 'self'){
                                _v = data.outerHeight
                            }
                            else if(/[\+\-\*\/]/.test(v)){
                                _v = (new Function('var self = '+data.outerHeight+'; return '+v))()
                            }
                        }
                        else{
                            if(v === 'self'){
                                _v = data.outerWidth
                            }
                            else if(/[\+\-\*\/]/.test(v)){
                                _v = (new Function('var self = '+data.outerWidth+'; return '+v))()
                            }
                        }
                    }
                }
                _pos[k] = _v === 'auto' ? 'auto' : parseFloat(_v)+'px'
            })

            return _pos
        },
        _resize:function(type){
            var self = this, _class = self.constructor, opts = self._options, element = self.element;
            var wWidth = self._window.outerWidth();
            var wHeight = self._window.outerHeight();
            var stop = 0;
            var sleft = 0;
            if(!self._isFixed){
                sleft = self._window.scrollLeft();
                stop = self._window.scrollTop();
            }
            self._setSize();
            if(opts.position){
                var pos = element.css(self._position()).position();
                if(Nui.bsie6){
                    sleft = 0;
                    stop = 0;
                }
                self.data.left = pos.left + sleft;
                self.data.top = pos.top + stop;
            }
            else{
                if(type === 'init' || opts.isCenter === true){
                    var left = (wWidth - self.data.outerWidth) / 2 + sleft;
                    var top = (wHeight - self.data.outerHeight) / 2 + stop;
                    var edge = opts.edge > 0 ? opts.edge : 0;
                    self.data.left = left > 0 ? left : edge;
                    self.data.top = top > 0 ? top : edge;
                }
            }
            self.data.offsetTop = self.data.top - self._window.scrollTop();
            self.data.offsetLeft = self.data.left - self._window.scrollLeft();
            element.css(self.data);
        },
        _setSize:function(){
            var self = this, _class = self.constructor, opts = self._options, element = self.element;
            var edge = opts.edge > 0 ? opts.edge*2 : 0;
            var wWidth = self._window.outerWidth() - edge;
            var wHeight = self._window.outerHeight() - edge;
            var scrollbar = opts.scrollbar;

            self._body.css({height:'auto', overflow:'visible'});
            element.css({top:'auto', left:'auto', width:'auto', height:'auto'});
            
            var edgeSize = _class._getSize(self._box, 'tb', 'all') +
                self.head.outerHeight() + 
                _class._getSize(self.head, 'tb', 'margin') + 
                _class._getSize(self._body, 'tb', 'all') + 
                self.foot.outerHeight() + 
                _class._getSize(self.foot, 'tb', 'margin');

            var width = element.outerWidth();
            if(opts.isFull !== true){
                if(opts.width > 0){
                    width = opts.width
                }
                else if(opts.width === '100%' || (opts.scrollbar === true && width > wWidth)){
                    width = wWidth;
                }
                if(opts.maxWidth > 0 && width >= opts.maxWidth){
                    scrollbar = true;
                    width = opts.maxWidth
                }
            }
            else{
                width = wWidth;
            }

            var ws = 'nowrap';
            if(opts.width > 0 || width == opts.maxWidth || width == wWidth){
                ws = 'normal';
            }

            self.data.width = width - _class._getSize(element, 'lr', 'all');
            self.main.css('white-space', ws);
            element.width(self.data.width);

            var height = element.outerHeight();
            if(self._iframeDocument){
                self._iframeDocument[0].layer = self;
                height = edgeSize + self._iframeDocument.find('body').outerHeight();
            }

            if(opts.isFull !== true){
                if(opts.height > 0){
                    height = opts.height
                }
                else if(opts.height === '100%' || ((opts.scrollbar === true || self._iframeDocument) && height > wHeight)){
                    height = wHeight
                }
                if(opts.maxHeight > 0 && height >= opts.maxHeight){
                    scrollbar = true;
                    height = opts.maxHeight
                }
            }
            else{
                height = wHeight
            }

            self.data.outerWidth = width;
            self.data.outerHeight = height;
            self.data.height = height - _class._getSize(element, 'tb', 'all');
            element.height(self.data.height);
            var _height = self.data.height - edgeSize;

            if(self.main.outerHeight() > _height && !self._iframe && scrollbar === true){
                self._body.css('overflow', 'auto')
            }
            if(self._iframe){
                self._iframe.height(_height);
            }
            self._body.height(self.data.contentHeight = _height)
        },
        _showMask:function(){
            var self = this, _class = self.constructor, opts = self._options;
            if(!self._containerDOM.__layermask__){
                self._containerDOM.__layermask__ = $(self._tpl2html('mask', {
                    skin:opts.skin,
                    style:{
                        'z-index':_class._maskzIndex,
                        'position':self._isFixed ? 'fixed' : 'absolute',
                        'top':'0px',
                        'left':'0px',
                        'width':'100%',
                        'height':self._isFixed ? '100%' : self._container.outerHeight()+'px'
                    }
                })).appendTo(self._container);
            }
            if(opts.isStopProp === true){
                self._on('click', self._containerDOM.__layermask__, function(e){
                    e.stopPropagation()
                })
            }
            if(opts.isClickMask === true){
                self._on('click', self._containerDOM.__layermask__, function(){
                    self.hide()
                })
            }
        },
        _show:function(){
            var self = this, opts = self._options;
            component.init(self.main);
            self._resize('init');
            self._setLower();
            if(opts.isMask === true){
                self._showMask()
            }
            if(opts.timer > 0){
                self._time = opts.timer;
                self._timer();
            }
            self._callback('Init');
            return self
        },
        _timer:function(){
            var self = this, opts = self._options;
            if(self._time > 0){
                self._callback('Timer', [self._time]);
                self._timerid = setTimeout(function(){
                    self._time -= 1000;
                    self._timer();
                }, self._time > 1000 ? 1000 : self._time)
            }
            else{
                self.hide()
            }
        },
        _reset:function(){
            var self = this, _class = self.constructor, noMask = true;
            component.exports._reset.call(this);
            component.destroy(self.main);
            Nui.each(_class.__instances, function(val){
                if(val && val._options.isMask === true && val !== self && val._containerDOM === self._containerDOM){
                    return (noMask = false);
                }
            });
            if(noMask && self._containerDOM.__layermask__){
                self._containerDOM.__layermask__.remove();
                self._containerDOM.__layermask__  = null;
            }
            if(self._options.timer > 0){
                self.timer = 0;
                clearTimeout(self._timerid);
            }
        },
        resize:function(){
            var self = this, opts = self._options, element = self.element;
            self._resize();
            self._callback('Resize');
            return self
        },
        hide:function(){
            if(this._options.isHide === true){
                if(this._callback('HideBefore') === false){
                    return
                }
                this.destroy()
            }
        },
        destroy:function(){
            var self = this, _class = self.constructor, opts = self._options;
            if(self._callback('DestroyBefore') === false){
                return
            }
            self._delete();
            self._reset();
            self._setLower(true);
            if(!self._isdestroy){
                _class._zIndex--;
                self._isdestroy = true;
            }
            self._callback('Destroy');
        }
    })
});
__define('lib/components/layer/loading',['lib/components/layer/layer'], function(layer){
    return function(content, width, height){
        var opts;
        if(typeof content === 'object'){
            opts = content;
            content = opts.content;
            delete opts.content;
        }
        if(Nui.type(content, 'Number')){
            height = width;
            width = content;
            content = '';
        }
        return layer(Nui.extend({
            content:'<div>'+(content||'正在加载数据...')+'</div>',
            width:width||'auto',
            height:height||'auto'
        }, opts || {}, {
            id:'loading',
            isTips:true,
            close:{
                enable:false
            }
        }))
    }
})
__define('lib/core/request',function(require){
    var util = require('lib/core/util');
    var loading = require('lib/components/layer/loading');
    var ajax = $.ajax;

    var defaults = {
        //参数配置
        data:{},        
        //接口扩展名 .do .php
        ext:'',
        //响应成功字段名
        name:'result',
        //响应成功字段值
        value:'success',
        //拦截器
        intercept:null
    }

    var request = function(options, text, under){
        
        if(typeof options === 'string'){
            options = {
                url:options,
                type:'GET'
            }
        }

        if(!options.url){
            return
        }

        if(
            options.contentType && 
            options.contentType.indexOf('application/json') !== -1 && 
            options.data && 
            typeof options.data !== 'string'
        ){
            options.dataType = 'json';
            options.data = JSON.stringify(options.data);
        }

        var _loading;
        
        if(text !== null){
            var opts = {
                content:text||'正在加载数据...'
            }
            if(under){
                opts.under = under
            }
            _loading = loading(opts)
        }

        var success = options.success || $.ajaxSettings.success || $.noop;
        var error = options.error || $.ajaxSettings.error || $.noop;

        //登录拦截器
        var intercept = function(){
            if(typeof defaults.intercept === 'function'){
                defaults.intercept.apply(this, arguments)
            }
        }

        options.success = function(res, status, xhr){
            if(_loading){
                _loading.destroy()
            }

            if(res && options.intercept !== false && intercept.call(this, res, status, xhr) === false){
                return false
            }

            success.call(this, res, status, xhr)
        }

        options.error = function(xhr){
            if(_loading){
                _loading.destroy()
            }
            error.apply(this, arguments)
        }

        var paramIndex = options.url.indexOf('?');
        var params = '?';

        if(paramIndex !== -1){
            params = options.url.substr(paramIndex);
            options.url = options.url.substr(0, paramIndex).replace(/\/+$/, '');
        }

        if(options.url && !/^https?:\/\//.test(options.url) && Nui.domain){
            options.url = Nui.domain+options.url;
        }

        if(options.ext !== false && defaults.ext && !/\.\w+$/.test(options.url)){
            options.url += defaults.ext
        }

        if(options.cache !== true){
            params = util.setParam('_', new Date().getTime(), params);
            delete options.cache
        }

        if(options.data && (options.type === 'PUT' || options.type === 'DELETE')){
            params = util.setParam(options.data, params);
            delete options.data
        }

        if(params !== '?'){
            options.url += params
        }

        return ajax($.extend(true, {}, {
            dataType:'json',
            data:(function(data){
                if(typeof data === 'function'){
                    return data()
                }
                return data
            })(defaults.data)
        }, options))
    }

    request.config = function(){
        var args = arguments, len = args.length;
        var defs = {};
        if(len === 1){
            if(typeof args[0] === 'object'){
                defs = args[0]
            }
            else if(typeof args[0] === 'string'){
                return defaults[args[0]]
            }
        }
        else if(len > 1){
            defs[args[0]] = defs[args[1]]
        }
        return $.extend(true, defaults, defs)
    }

    var method = function(options, msg){
        return function(url, data, callback, text, under){

            if(typeof data === 'function'){
                under = text;
                text = callback;
                callback = data;
                data = undefined;
            }
            else if(typeof data === 'string' || data === null){
                under = callback;
                text = data;
                data = callback = undefined;
            }

            if(typeof callback === 'object'){
                if(callback === null){
                    under = text;
                    text = callback;
                    callback = undefined;
                }
                else{
                    var object = callback;
                    callback = function(res, status, xhr){
                        if(res && res[defaults.name]){
                            Nui.each(object, function(_callback, key){
                                if((key === 'other' && res[defaults.name] != defaults.value) || res[defaults.name] == key){
                                    _callback.call(object, res, status, xhr)
                                    return false
                                }
                            })
                        }
                    }
                }
            }

            if(text && typeof text === 'object'){
                under = text;
                text = undefined;
            }

            if(msg && !text && text !== null){
                text = msg
            }

            return request($.extend({
                url:url,
                data:data,
                success:callback
            }, options), text, under)
        }
    }

    request.get = method({
        type:'GET'
    });

    request.sync = method({
        type:'GET',
        async:false
    });

    request.update = method({
        type:'GET'
    }, '正在保存数据...');

    request.jsonp = method({
        type:'GET',
        dataType:'jsonp'
    });

    request.del = method({
        type:'DELETE'
    }, '正在删除数据...');

    request.delSync = method({
        type:'DELETE',
        async:false
    }, '正在删除数据...');

    request.put = method({
        type:'PUT'
    }, '正在保存数据...');

    request.putSync = method({
        type:'PUT',
        async:false
    }, '正在保存数据...');

    request.post = method({
        type:'POST'
    });

    request.postSync = method({
        type:'POST',
        async:false
    });

    request.postUpdate = method({
        type:'POST'
    }, '正在保存数据...');

    request.postJSON = method({
        type:'POST',
        contentType:'application/json;charset=utf-8'
    }, '正在保存数据...');

    return request
})
/**
 * @author Aniu[2017-12-23 16:50]
 * @update Aniu[2018-01-26 11:05]
 * @version 1.0.2
 * @description 搜索
 */

__define('lib/components/search',function(require, imports){
    imports('../assets/components/search/index');
    
    var component = require('lib/core/component');
    var util = require('lib/core/util');
    var request = require('lib/core/request');

    return this.extend(component, {
        _static:{
            _init:function(){
                var self = this, timer = null;
                Nui.win.resize(function(){
                    clearTimeout(timer);
                    timer = setTimeout(function(){
                        Nui.each(self.__instances, function(obj){
                            if(obj._showed){
                                obj.resize()
                            }
                        })
                    }, 100)
                })
            }
        },
        _options:{
            /**
             * @func 请求url
             * @type <String>
             */
            url:'',
            /**
             * @func 查询参数
             * @type <String>
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @param value <String> 文本框输入值
             * @return <Object> 查询参数对象集合
             */
            query:'keyword',
            /**
             * @func 设置层级
             * @type <Number>
             * @desc 若style中已经设置，则不使用该值
             */
            zIndex:19920604,
            /**
             * @func 定义列表模版
             * @type <String>
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @return <String> 返回列表模版
             * @desc 模版中可以使用<%$data%>获取当前行数据，<%$index%>获取当前行索引
             */
            item:'',
            /**
             * @func 定义空数据模版
             * @type <String>
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @return <String> 返回空数据模版
             * @desc 模版中可以使用<%value%>获取当前输入值
             */
            empty:'',
            /**
             * @func 定义提示信息模版
             * @type <String>
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @return <String> 返回提示信息模版
             */
            prompt:'',
            /**
             * @func 定义底部模版
             * @type <String>
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @return <String> 返回底部模版
             */
            foot:'',
            /**
             * @func 列表内容字段名
             * @type <String>
             */
            field:'',
            /**
             * @func 是否在文本获取焦点时展示下拉
             * @type <Boolean>
             * @desc 设置true后组件内部会绑定focus事件，因此不建议手动绑定focus事件调用组件的同时将该参数设置为true，那样会导致事件重复绑定
             */
            focus:false,
            /**
             * @func 是否允许文本框内容为空时展示下拉
             * @type <Boolean> 
             */
            nullable:false,
            /**
             * @func 异步请求数据时，是否缓存
             * @type <Boolean>
             */
            cache:false,
            /**
             * @func 生成html容器
             * @type <String> 字符串选择器
             * @type <Object> dom、jQuery对象
             */
            container:'body',
            /**
             * @func 下拉列表的数量，超过出现滚动条
             * @type <Number>
             */
            limit:6,
            /**
             * @func 增加高宽
             * @type <Object>
             */
            size:null,
            /**
             * @func 设置位置偏移
             * @type <Object>
             */
            offset:null,
            /**
             * @func 设置样式
             * @type <Object>
             */
            style:null,
            /**
             * @func jQuery ajax配置
             * @type <Object>
             */
            ajax:null,
            /**
             * @func 列表原始数据
             * @type <Array>
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @return <Array> 返回原始数据
             */
            data:null,
            /**
             * @func 选中值为标签形式
             * @type <Object>
             */
            tag:{
                /**
                 * @func 标签类型
                 * @type <String>
                 * @type <Array>
                 * @desc 设置后会增加ui-tag-{type}类名
                 */
                type:'',
                /**
                 * @func 是否多选
                 * @type <Boolean>
                 */
                multiple:true,
                /**
                 * @func 是否可以用退格键删除标签
                 * @type <Boolean>
                 */
                backspace:false,
                /**
                 * @func 点击叉号删除标签时是否可以使输入框获取焦点
                 * @type <Boolean>
                 */
                focus:false,
                /**
                 * @func 选择完是否清空输入框
                 * @type <Boolean>
                 */
                clear:false,
                /**
                 * @func 是否设置提示
                 * @type <Boolean>
                 */
                title:true,
                /**
                 * @func 标签填充容器
                 * @type <DOM, jQuery Object, Selector>
                 */
                container:null,
                /**
                 * @func 设置滚动容器
                 * @type <DOM, jQuery Object, Selector>
                 * @desc 如果未设置将取container作为滚动容器
                 */
                scroll:null,
                /**
                 * @func 关闭按钮内容
                 * @type <String>
                 */
                close:'×',
                /**
                 * @func 设置标签数据
                 * @type <Function>
                 * @param self <Object> 组件实例对象
                 * @param elem <jQuery Object> 标签元素对象
                 * @return 返回数据对象
                 */
                getData:null,
                /**
                 * @func 设置是否可以删除标签
                 * @type <Function>
                 * @param self <Object> 组件实例对象
                 * @param data <Object> 需要添加为标签的数据对象
                 * @param tag <Object> 已存在的标签对象
                 * @return <Boolean> 返回true表示需要添加的数据已存在与标签中，需删除； 返回true或者null表示不会被添加为标签
                 */
                deleteMatch:null
            },
            /**
             * @func 设置多菜单
             * @type <Array>
             * [{
             *     title:'',
             *     content:'',
             *     active:true,
             *     onShow:function(){
             * 
             *     }
             * }]
             */
            tabs:null,
            /**
             * @func 
             * @type <Object>
             * {
             *     field:'name',
             *     like:/^\d/
             * }
             * @type <Array>
             * [{
             *     field:'name',
             *     like:/^\d/,
             *     like:'^{value}',
             *     like:function(data, value){
             *          return data.indexOf(value) !== -1
             *     }
             * }]
             */
            match:null,
            /**
             * @func 定义选中列表后的文本框内容
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @param data <Object> 当前选中数据
             * @return <String> 返回自定义填充值
             * @desc 未设置该值时，默认取field中的数据
             */
            setValue:null,
            /**
             * @func 列表渲染时判断某一行是否被选中
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @param data <Object> 列表选中数据
             * @return <Boolean> 
             */
            selected:null,
            /**
             * @func 过滤数据
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @return <Array> 返回过滤后的数组
             */
            filter:null,
            /**
             * @func 请求返回数据时触发回调
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @param response <Anything> 接口返回数据
             * @return <Array> 返回列表数据
             */
            onRequest:null,
            /**
             * @func 选择前触发回调
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @param data <Object> 选中项数据
             * @param event <Object> 事件对象
             * @param elem <jQuery Object> 选中项对象
             * @return <Boolean> 返回false则不会触发setValue以及onSelect
             */
            onSelectBefore:null,
            /**
             * @func 选择后触发回调
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @param data <Object> 选中项数据
             * @param event <Object> 事件对象
             * @param elem <jQuery Object> 选中项对象
             */
            onSelect:null,
            /**
             * @func 输入框失焦后触发
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @param target <jQuery Object> 调用组件对象
             */
            onBlur:null,
            /**
             * @func 调用value实例方法或者删除标签后触发
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @param event <Event Object> 当删除标签时才会有该参数
             */
            onChange:null
        },
        _template:{
            wrap:
                '<div class="<% className %>"<%if style%> style="<%include \'style\'%>"<%/if%>>'+
                    '<div class="con-search-body<%if tabs.length > 1%> con-search-body-tab<%/if%>">'+
                        '<%include "tabs"%>'+
                        '<div class="con-search-inner">'+
                            '<%each tabs%>'+
                                '<div class="con-search-content<%if $index === 0%> con-search-result<%/if%>" style="display:none;"></div>'+
                            '<%/each%>'+
                        '</div>'+
                    '</div>'+
                    '<%include "foot"%>'+
                '</div>',
            result:
                '<%var count = 0%>'+
                '<%if data && (count = data.length)%>'+
                    '<%if prompt && value%>'+
                        '<%include "prompt"%>'+
                    '<%/if%>'+
                    '<%include "list"%>'+
                '<%elseif value%>'+
                    '<%include "empty"%>'+
                '<%/if%>',
            list:
                '<ul class="con-search-list">'+
                    '<%each data $data $index%>'+
                        '<%include "item"%>'+
                    '<%/each%>'+
                '</ul>',
            tabs:
                '<%if tabs.length > 1%>'+
                    '<div class="con-search-tab">'+
                        '<%each tabs tab%>'+
                            '<span class="con-search-tab-nav"<%if typeof tab.style === "object" && tab.style%> style="<%each tab.style%><%$index%>:<%$value%>;<%/each%>"<%/if%>>'+
                                '<%tab.title%>'+
                            '</span>'+
                        '<%/each%>'+
                    '</div>'+
                '<%/if%>',
            tags:
                '<%var _type, _title, _close%>'+
                '<%if type?? && type%>'+
                '<%var _type = [].concat(type)%>'+
                '<%/if%>'+
                '<%if title?? && title%>'+
                '<%var _title = title%>'+
                '<%/if%>'+
                '<%if close?? && close%>'+
                '<%var _close = close%>'+
                '<%/if%>'+
                '<%each data $data k%>'+
                    '<span class="ui-tag<%if _type%><%each _type v i%> ui-tag-<%v%><%/each%><%/if%>">'+
                        '<em class="con-tag-text"<%if _title%> title="<%$data.text%>"<%/if%>><%$data.text%></em>'+
                        '<%if _close%>'+
                        '<b class="con-tag-close"><%_close%></b>'+
                        '<%/if%>'+
                        '<%if $data.fields?? && $data.fields%>'+
                            '<%each $data.fields%>'+
                                '<%if $value !== undefined%>'+
                                '<input type="hidden" name="<%$index%>" value="<%$value%>">'+
                                '<%/if%>'+
                            '<%/each%>'+
                        '<%/if%>'+
                    '</span>'+
                '<%/each%>'
        },
        _events:{
            'mouseenter':'_mouseover',
            'mouseleave':'_mouseout',
            'mouseenter .con-search-result .con-search-item':'_mouseover _itemActive',
            'mouseleave .con-search-result .con-search-item':'_itemCancelActive',
            'click .con-search-result .con-search-item':'_select',
            'click .con-search-tab-nav':'_toggle'
        },
        _toggle:function(e, elem){
            var self = this, opts = self._options, index = elem.index();
            if(index < 0){
                index = 0
            }
            var data = self._elemData[index];
            var container = data.$container;
            if(!container.is(':visible')){
                if(index !== 0){
                    if(container.is(':empty') && data.content){
                        var content = '';
                        if(typeof data.content === 'function'){
                            content = data.content.call(opts, self, elem, container)
                        }
                        else{
                            content = data.content
                        }
                        if(content === false){
                            return
                        }
                        else if(typeof content === 'string'){
                            container.html(content)
                        }
                    }
                    self._selectTab = data;
                }
                elem.addClass('s-crt');
                container.show();
                Nui.each(self._elemData, function(v, i){
                    if(i !== index){
                        v.$elem.removeClass('s-crt')
                        v.$container.hide()
                    }
                })
                self.activeTab = data;
                if(typeof data.onShow === 'function'){
                    data.onShow.call(opts, self, elem, container)
                }
            }
        },
        _mouseover:function(e, elem){
            this._hover = true
        },
        _mouseout:function(e, elem){
            delete this._hover;
        },
        _itemActive:function(e, elem){
            var active = this._activeItem;
            if(!e && active){
                active.removeClass('s-hover');
                delete this._activeItem;
            }
            active = this._activeItem = elem.addClass('s-hover');
            if(e){
                this._activeIndex = active.data('index');
            }
        },
        _itemCancelActive:function(e, elem){
            delete this._activeItem;
            elem.removeClass('s-hover')
        },
        _select:function(e){
            var self = this, opts = self._options, data = self.queryData[self._activeIndex], args = [data, e, this._activeItem], value = '';
            if(data === undefined || !this._activeItem){
                return
            }

            if(self._callback('SelectBefore', args) === false){
                return
            }

            if(typeof opts.setValue === 'function'){
                value = opts.setValue.call(opts, self, data)
            }
            else if(opts.field){
                value = data[opts.field]
            }

            self.value(value);
            self.hide();
            self._callback('Select', args);
        },
        _match:function(data){
            var self = this, opts = self._options, match = false;
            Nui.each(self._matchs, function(val){
                var field = val.field, like = val.like, fieldValue;
                if(field && like && (fieldValue = data[field])){
                    if(Nui.type(like, 'RegExp') && fieldValue.match(like)){
                        match = true
                    }
                    else if(typeof like === 'string'){
                        like = like.replace(/\{value\}/g, self.val);
                        if(fieldValue.match(new RegExp(like))){
                            match = true
                        }
                    }
                    else if(typeof like === 'function'){
                        match = !!like(fieldValue, self.val)
                    }
                    if(match){
                        return false
                    }
                }
            })
            return match
        },
        _storage:function(data){
            var self = this, opts = self._options;
            if(!Nui.type(data, 'Array')){
                data = []
            }
            if(opts.cache === true){
                self._caches[self.val] = data
            }
            self.queryData = data;
            self._show(true)
        },
        _filter:function(){
            var self = this, opts = self._options, data = [], _data = self._setData();
            if(typeof opts.filter === 'function'){
                data = opts.filter.call(opts, self, self.val, _data);
            }
            else if(_data.length && self._matchs && self._matchs.length){
                Nui.each(_data, function(val){
                    if(self._match(val)){
                        data.push(val)
                    }
                })
            }
            else{
                data = _data
            }
            self._storage(data)
        },
        _request:function(){
            var self = this, opts = self._options, data = {}, value = self.val;
            if(opts.query && typeof opts.query === 'string'){
                data[opts.query] = value
            }
            else if(typeof opts.query === 'function'){
                var ret = opts.query.call(opts, self, value);
                if(ret){
                    if(typeof ret === 'object'){
                        data = ret
                    }
                    else if(typeof ret === 'string'){
                        data[ret] = value
                    }
                }
                else{
                    return
                }
            }
            
            var success;
            if(typeof opts.ajax === 'function'){
                success = opts.ajax.success;
                delete opts.ajax.success
            }

            clearTimeout(self._timer);

            if(self._ajax){
                self._ajax.abort()
            }

            self._timer = setTimeout(function(){
                self._ajax = request(jQuery.extend(true, {
                    url:opts.url,
                    data:data,
                    type:'get',
                    dataType:'json',
                    cache:false,
                    async:true,
                    success:function(res, status, xhr){
                        var _data = res;
                        if(typeof success === 'function'){
                            success.call(this, res, status, xhr)
                        }
                        if(typeof opts.onRequest === 'function'){
                            _data = opts.onRequest.call(opts, self, res)
                        }
                        self._storage(_data);
                    }
                }, opts.ajax||{}), null)
            }, 50)
        },
        _setActiveItem:function(code){
            if(this._items){
                var $elem = this._items[this._activeIndex];
                if($elem){
                    this._itemActive(null, $elem);
                    var stop = this['_scroll' + code]($elem.position().top);
                    if(stop !== undefined){
                        this.$list.animate({'scrollTop':stop}, 200)
                    }
                }
            }
        },
        //向下滚动
        _scroll38:function(top){
            var $list = this.$list, height = this._listHeight, stop;
            if(top > height){
                stop = top
            }
            else if(top < 0){
                stop = '-=' + height
            }
            return stop
        },
        //向上滚动
        _scroll40:function(top){
            var $list = this.$list, height = this._listHeight, stop;
            if(top < 0){
                stop = 0
            }
            else if(top >= height){
                stop = '+=' + top
            }
            return stop
        },
        //按上
        _code38:function(){
            var len = this.queryData.length;
            if(len){
                if(this._activeIndex === undefined || this._activeIndex <= 0){
                    this._activeIndex = len
                }
                this._activeIndex -= 1;
                this._setActiveItem(38);
            }
        },
        //按下
        _code40:function(){
            var len = this.queryData.length;
            if(len){
                if(this._activeIndex === undefined || this._activeIndex === len - 1){
                    this._activeIndex = -1
                }
                this._activeIndex += 1;
                this._setActiveItem(40);
                
            }
        },
        //回车
        _code13:function(e){
            this._select(e)
        },
        //退格键删除
        _delete:function(e){
            var self = this;
            //光标位置在输入框起始处时删除末尾的标签
            if(self._tag.backspace === true){
                var tagSize = 0;
                if(self.tagData && (tagSize = self.tagData.length) && !util.getFocusIndex(self.target.get(0))){
                    self.tagData[tagSize - 1].$elem.remove();
                    self._change(e)
                }
            }
        },
        _allow:function(condition){
            if(this.activeTab !== this._selectTab && condition){
                return true
            }
        },
        //无效的按键
        _invalid:function(code){
            //tab 回车 上 下 左 右
            return /^(9|13|37|38|39|40)$/.test(code);
        },
        _bindEvent:function(){
            var self = this, opts = self._options, storeKeycode = [];
            self._on('keyup', self.target, function(e, elem){
                var code = e.keyCode;
                //部分用户的IE6-IE8（不清楚会不会有其它浏览器），在列表出来后，如果鼠标拖动下拉框会触发keydown、keyup事件，
                //按键keyCode分别是17和67，也就是Ctrl+C，不同的时keydown事件时先C后Ctrl，keyup事件时先Ctrl后C，
                //创建一个数组，在keydown事件时存储keyCode，如果这个bug存在，那么最终数组值肯定是[17, 67]，
                //在keyup事件中判断如果数组值等于[17, 67]，则不执行后续操作，等这个bug流程走完后清空数组即可
                if(storeKeycode[0] === 17 && storeKeycode[1] === 67){
                    if(code === 17){
                        storeKeycode = []
                    }
                    return
                }
                
                if(self._invalid(code)){
                    if(self._allow(code === 40 || code === 38)){
                        if(self._showed === true){
                            self['_code'+code](e)
                        }
                        else{
                            self._show()
                        }
                    }
                    return
                }

                if(self.val = Nui.trim(elem.val())){
                    var cache;
                    if(self.val && opts.cache === true && (cache = self._caches[self.val])){
                        self._storage(cache);
                    }
                    else if(opts.url){
                        self._request()
                    }
                    else{
                        self._filter()
                    }
                }
                else{
                    self._show(true)
                }
            })

            //若失去焦点但是悬停在组件相关的元素上，则不允许失去焦点
            self._on('blur', self.target, function(e, elem){
                if(!self._hover){
                    self._callback('Blur', [elem])
                    self.hide()
                }
                else{
                    self._show()
                    self._hover = true;
                    elem.focus()
                }
            })

            self._on('click', self.target, function(e, elem){
                if(!self._showed){
                    self.target.focus()
                }
            })

            if(opts.focus === true){
                self._on('focus', self.target, function(e, elem){
                    self._show()
                })
            }

            self._on('keydown', self.target, function(e, elem){
                var code = e.keyCode;
                if(code !== 67){
                    storeKeycode = []
                }
                storeKeycode.push(code)
                if(self._allow(code === 13)){
                    self['_code'+code](e)
                }
                else if(code === 8){
                    self._delete(e)
                }
            })

            var $tagContainer = self.$tagContainer;
            var $tagScroll = self.$tagScroll;
            if($tagContainer){
                self._on('click', $tagContainer, '.ui-tag > .con-tag-close', function(e, elem){
                    var $tag = elem.closest('.ui-tag');
                    var data = self._getTagData($tag);
                    $tag.remove();
                    delete self._hover;
                    delete data.$elem;
                    if(opts.tag.focus === true){
                        self._hover = true;
                        self.target.focus()
                    }
                    self._change(e);
                })

                if($tagScroll && $tagScroll.find(self.target).length){
                    self._on('mouseenter', $tagScroll , function(){
                        self._mouseover()
                    })
                    self._on('mouseleave', $tagScroll , function(){
                        self._mouseout()
                    })
                    self._on('click', $tagContainer, '.ui-tag', function(){
                        self._tag_event = true;
                    })
                    self._on('click', $tagScroll , function(e){
                        if(!self._tag_event && !self._showed){
                            delete self._hover;
                            self._show();
                            self._hover = true;
                            self.target.focus();
                        }
                        else{
                            delete self._tag_event
                        }
                    })
                }
                else if(opts.tag.focus === true){
                    self._on('mouseenter', $tagContainer, '.ui-tag', function(){
                        self._mouseover()
                    })
                    self._on('mouseleave', $tagContainer, '.ui-tag', function(){
                        self._mouseout()
                    })
                }
            }
        },
        _create:function(){
            var self = this, data = self._tplData(), opts = self._options;
            data.style = opts.style || {};
            data.style.display = 'none';
            if(data.style['z-index'] === undefined){
                data.style['z-index'] = opts.zIndex || 0
            }
            self._elemData = [{
                title:'结果',
                style:{
                    display:'none'
                }
            }];
            if(Nui.isArray(opts.tabs) && opts.tabs.length){
                self._isTab = true;
                self._elemData = self._elemData.concat(opts.tabs);
            }
            data.tabs = self._elemData;
            self.element = $(self._tpl2html('wrap', data)).appendTo(self.container);
            self._setElemData();

            self.$body = self.element.children();
            self.$inner = self.$body.children('.con-search-inner');
            self.$result = self.$inner.children('.con-search-result');

            self._elemData[0].$elem = $();
            self._elemData[0].$container = self.$result;
            
            if(self._isTab){
                var tabs = self.$body.children('.con-search-tab').children();
                var containers = self.$inner.children();
                Nui.each(self._elemData, function(v, i){
                    v.$elem = tabs.eq(i);
                    v.$container = containers.eq(i);
                    if(!self._defaultTab && v.active === true){
                        self._defaultTab = v
                    }
                })
                //没有设置默认显示标签则取第一个
                if(!self._defaultTab){
                    self._defaultTab = self._elemData[1]
                }
            }
            
            self._event()
        },
        _initTemplate:function(name){
            var self = this, opts = self._options, content = opts[name];
            if(typeof content === 'function'){
                content = content.call(opts, self)
            }

            if(!content || typeof content !== 'string'){
                if(name === 'item' && opts.field){
                    content = '<li class="con-search-item<%selected($data)%>" data-index="<%$index%>"><%$data["'+ opts.field +'"]??%></li>'
                }
                else{
                    content = ''
                }
            }
            else if(name === 'item' && content && !/^\s*\<li\s+/i.test(content)){
                content = '<li class="con-search-item<%selected($data)%>" data-index="<%$index%>">'+ content +'</li>'
            }

            if(name !== 'item' && content){
                content = '<div class="con-search-'+ name +'">'+ content +'</div>'
            }

            self._template[name] = content;
        },
        _setData:function(){
            var self = this, opts = self._options, data = opts.data;
            if(typeof opts.data === 'function'){
                data = opts.data.call(opts, self)
            }

            if(!Nui.type(data, 'Array')){
                data = []
            }

            return self.data = data
        },
        _setElemData:function(){
            var self = this, elem = self.element, _class = self.constructor;
            self.elementData = {
                btbWidth:_class._getSize(elem, 'tb', 'border'),
                blrWidth:_class._getSize(elem, 'lr', 'border'),
                ptbWidth:_class._getSize(elem, 'tb', 'padding'),
                plrWidth:_class._getSize(elem, 'lr', 'padding')
            }
        },
        _setTargetData:function(){
            var self = this, target = self.target, _class = self.constructor;
            if(self.container[0].nodeName !== 'BODY'){
                self._container_body = false;
                target = self.container;
                var pos = self.container.css('position');
                if('absolute relative fixed'.indexOf(pos) === -1){
                    self.container.css('position', 'relative')
                }
            }
            else{
                self._container_body = true
            }
            self.targetData = {
                width:target.width(),
                height:target.height(),
                oWidth:target.outerWidth(),
                oHeight:target.outerHeight(),
                blWidth:_class._getSize(target, 'l', 'border'),
                brWidth:_class._getSize(target, 'r', 'border'),
                btWidth:_class._getSize(target, 't', 'border'),
                bbWidth:_class._getSize(target, 'b', 'border')
            }
        },
        _getTagData:function($elem){
            var self = this, opts = self._options, data = {};
            if(typeof self._tag.getData === 'function'){
                data = self._tag.getData.call(opts, self, $elem) || {}
            }
            else{
                data.text = $elem.children('.con-tag-text').text();
            }
            data.$elem = $elem;
            return data
        },
        _setTagsData:function(){
            var self = this, opts = self._options;
            self.$tags = self.$tagContainer.children('.ui-tag');
            self.tagData = [];
            self.$tags.each(function(){
                self.tagData.push(self._getTagData($(this)))
            })
        },
        _initTag:function(){
            var self = this, opts = self._options;
            self._tag = opts.tag;
            if(typeof self._tag !== 'object'){
                self._tag = {}
            }
            self.$tagContainer = self._jquery(self._tag.container);
            self.$tagScroll = self._jquery(self._tag.scroll);
            if(!self.$tagScroll){
                self.$tagScroll = self.$tagContainer
            }
        },
        _initData:function(){
            var self = this, opts = self._options, data = opts.data, match = opts.match;
            self._caches = {};

            self.queryData = [];

            self.data = [];

            self._size = opts.size || {};

            self._offset = opts.offset || {};

            self._isTab = false;

            self._defaultTab = null;

            self._listHeight = 0;

            self._setTargetData();

            self._initTag();

            Nui.each(['item', 'empty', 'prompt', 'foot'], function(name){
                self._initTemplate(name);
            })

            if(match && Nui.type(match, 'Object')){
                match = [match]
            }

            if(Nui.type(match, 'Array')){
                self._matchs = match
            }
        },
        _initTagTplData:function(data){
            var self = this;
            data.title = self._tag.title || false;
            data.close = self._tag.close || false;
            data.type = self._tag.type ? [].concat(self._tag.type) : '';
            return data
        },
        _getSelected:function(){
            var self = this, opts = self._options;
            var selected = function(){
                return '';
            }
            if(typeof opts.selected === 'function'){
                selected = function(data){
                    if(opts.selected.call(opts, self, data) === true){
                        return ' s-crt'
                    }
                    return ''
                }
            }
            else if(opts.field){
                selected = function(data){
                    var cls = '';
                    if(self.tagData){
                        Nui.each(self.tagData, function(v){
                            if(data[opts.field] === v.text){
                                cls = ' s-crt';
                                return false
                            }
                        })
                    }
                    else if(self.val && data[opts.field] === self.val){
                        cls = ' s-crt'
                    }
                    return cls;
                }
            }
            return selected
        },
        _setHeight:function(input){
            var self = this, opts = self._options, len = self.queryData.length;
            if(len > 0 && opts.limit > 0){
                var height = 0;
                var selectedIndex;
                self.$list = self.$result.children('.con-search-list');
                self._items = [];
                self.$list.children().each(function(i){
                    var $elem = $(this);
                    self._items.push($elem);
                    if(!self._isTab && !input && selectedIndex === undefined && $elem.hasClass('s-crt')){
                        selectedIndex = i;
                    }
                })
                if(!self._itemHeight){
                    if(self._items.length){
                        self._itemHeight = height = self._items[0].outerHeight()
                    }
                }
                else{
                    height = self._itemHeight
                }
                if(height){
                    if(len > opts.limit){
                        height *= opts.limit
                    }
                    else{
                        height *= len
                    }
                    self.$list.height(self._listHeight = height);
                }
                self._activeIndex = selectedIndex;
            }
            else{
                delete self.$list;
                delete self._items;
            }
        },
        _scrollto:function(){
            if(this._activeIndex !== undefined && !this._isTab && this.$list){
                this.$list.scrollTop(this._activeIndex * this._itemHeight)
            }
        },
        _render:function(input){
            var self = this, opts = self._options, _class = self.constructor, result = self._elemData[0];
            result.$elem.hide();
            result.$container.hide();
            _class._active = self;
            //输入的时候才会显示
            if((self._isTab && self.val && input) || !self._isTab){
                self.$result.html(self._tpl2html('result', {
                    data:self.queryData,
                    value:self.val,
                    selected:self._getSelected(),
                    prompt:!!self._template.prompt
                }));
                result.$elem.show();
                if(self._defaultTab){
                    self._defaultTab.$elem.hide()
                }
                self._toggle(null, result.$elem);
                self._setHeight(input);
            }
            else if(self._selectTab){
                self._defaultTab.$elem.show();
                self._toggle(null, self._selectTab.$elem)
            }
            else if(self._defaultTab){
                self._toggle(null, self._defaultTab.$elem.show())
            }
            self.element.show();
            self._showed = true;
            self._scrollto();
            self.resize()
        },
        _change:function(e){
            var self = this, opts = self._options;
            self._setTagsData();
            if(self.element){
                self.resize()
                self._callback('Change', [e])
            }
        },
        _data2html:function(data){
            var self = this, array = [], html = '', tag = self._tag;
            Nui.each([].concat(data), function(val){
                if(val && val.text){
                    array.push(val)
                }
            })
            if(array.length){
                html = self._tpl2html('tags', {
                    data:array,
                    title:tag.title,
                    close:tag.close,
                    type:tag.type
                })
            }
            return html
        },
        _exec:function(){
            var self = this, opts = self._options;
            if(self._getTarget() && (self.container = self._jquery(opts.container))){
                self._initData();
                self._bindEvent();
            }
        },
        /**
         * @param input <Boolean> 正在输入操作
         */
        _show:function(input){
            var self = this, opts = self._options, _class = self.constructor;
            self.val = Nui.trim(this.target.val());
            if(self._hover && !input){
                return
            }
            if(_class._active && _class._active !== self){
                _class._active.hide()
            }
            else if(opts.nullable !== true && !self.val){
                self.hide()
            }
            else{
                if(!self.element){
                    self._create()
                }
                if(!self._showed && self.$tagContainer){
                    self._setTagsData()
                }
                //不论输入框是否有值，获得焦点时显示完整列表
                if(!input && opts.nullable === true){
                    if(!opts.url){
                        self.queryData = self._setData()
                    }
                    else{
                        self.queryData = []
                    }
                }
                self._render(input);
            }
        },
        resize:function(){
            var self = this, opts = self._options, target = self.target, elem = self.element, targetData = self.targetData, elemData = self.elementData,
            oWidth = elem.outerWidth(), oHeight = elem.outerHeight(), offset = target.offset(), otop = offset.top, oleft = offset.left,
            _class = self.constructor, wWidth = Nui.win.width(), wHeight = Nui.win.height(), notbody = !self._container_body;

            if(notbody){
                offset = self.container.offset();
                otop = offset.top;
                oleft = offset.left;
                targetData.oWidth = self.container.outerWidth();
                targetData.oHeight = self.container.outerHeight();
            }

            var width = targetData.oWidth - elemData.blrWidth - elemData.plrWidth + (self._size.width || 0);
            var top = otop + targetData.oHeight - targetData.bbWidth + (self._offset.top||0);
            var left = oleft + (self._offset.left||0);

            //内容在可视区域底部显示不全，则在输入框上方显示
            var diff = wHeight - top - oHeight;
            if(diff < 0){
                var _top = otop - oHeight - (self._offset.top||0) + targetData.btWidth;
                if(_top >= 0){
                    top = _top
                }
            }

            //内容在可视区域右侧显示不全，则与输入框居右对齐
            diff = wWidth - left - targetData.oWidth - (self._size.width || 0);
            if(diff < 0){
                diff = targetData.oWidth + (self._size.width || 0) - targetData.oWidth;
                if(diff > 0){
                    var _left = oleft - diff;
                    if(_left >= 0){
                        left = _left
                    }
                }
            }

            if(notbody){
                top -= otop + targetData.bbWidth;
                left -= oleft + targetData.blWidth;
            }

            self.element.css({
                top:top,
                left:left,
                width:width
            })
        },
        /**
         * @func 显示组件
         */
        show:function(){
            this._show()
        },
        /**
         * @func 隐藏组件
         */
        hide:function(){
            var self = this, _class = self.constructor;
            delete self._hover;
            delete self._showed;
            delete self._itemHeight;
            delete self._selectTab;
            delete self._cache;
            if(_class._active === self){
                delete _class._active
            }
            if(self.element){
                self.element.hide()
            }
        },
        /**
         * @func 销毁组件
         */
        destroy:function(){
            this.hide();
            component.exports.destroy.call(this);
        },
        /**
         * @func 设置文本框内容值或者添加tag标签
         * @param data <String>
         * @param data <Object> null为清空
         * {
         *     text:'',
         *     fields:{
         *         field1:value1,
         *         field2:value2,
         *         ...
         *     }
         * }
         * @param data <Array>
         * [{
         *     text:'',
         *     fields:{
         *         field1:value1,
         *         field2:value2,
         *         ...
         *     }
         * }
         * @param add <Boolean> 是否可以添加标签，设置为false则不能新增
         */
        value:function(data, add){
            var self = this, target = self.target, opts = self._options, 
                _class = self.constructor, name = _class.__component_name
                $tagContainer = self.$tagContainer;
            if(typeof data === 'string'){
                data = Nui.trim(data)
            }
            if($tagContainer && (data || data === null)){
                if(data !== null){
                    var array = [], html;
                    if(Nui.type(data, 'Array')){
                        array = array.concat(data)
                    }
                    else if(typeof data === 'object'){
                        if(data.text){
                            data.text = Nui.trim(data.text);
                        }
                        array.push(data)
                    }
                    else{
                        array.push({
                            text:data
                        })
                    }
                    if(opts.tag.multiple === true){
                        var deleteMatch = self._tag.deleteMatch;
                        var isMethod = typeof deleteMatch === 'function';
                        var $last;
                        Nui.each(self.tagData, function(tag){
                            var $elem = tag.$elem, del = false;
                            Nui.each(array, function(data, i){
                                if(data && data.text){
                                    if(isMethod){
                                        del = deleteMatch.call(opts, self, data, tag)
                                    }
                                    else{
                                        del = data.text === tag.text
                                    }
                                    if(del === true || del === null){
                                        delete array[i];
                                        return false
                                    }
                                }
                            })
                            if(del === true){
                                $elem.remove()
                            }
                            else{
                                $last = $elem
                            }
                        })
                    }
                    else{
                        self.$tags.remove()
                    }

                    if(add !== false && (html = self._data2html(array))){
                        //插入到最后一个标签后面
                        if($last){
                            $last.after(html)
                        }
                        else{
                            $tagContainer.prepend(html)
                        }
                        //如果滚动容器有滚动条，添加标签滚动到底部
                        self.$tagScroll.scrollTop(19920604)
                    }
                }
                else if(self.$tags){
                    self.$tags.remove()
                }

                if(self._tag.clear !== false){
                    self.value('')
                }

                self._change()
            }
            else if(target){
                var dom = target.get(0), obj;
                data = data || '';
                if(dom && dom.nui){
                    Nui.each(dom.nui, function(v, k){
                        if(k !== name && typeof v.value === 'function' && v._setStyle && v._createRules){
                            obj = v;
                            return false
                        }
                    })
                }
                if(obj){
                    obj.value(data)
                }
                else{
                    target.val(data)
                }
                if(!$tagContainer){
                    self._callback('Change')
                }
            }
        }
    })
}); 
__define('./script/page',function(require, imports){
    imports('../style/page.less');
    var search = require('lib/components/search');
    var input = require('lib/components/input');
    var data = require('pages/components/search/script/data');
    var template = require('lib/core/template');
    var emps = [];
    var depts = [];

    Nui.each(data.empList, function(val){
        Nui.each(val.list, function(v){
            emps.push(v)
        })
    })

    Nui.each(data.deptList, function(val){
        Nui.each(val.list, function(v){
            depts.push(v)
        })
    })
    
    var all = [].concat(emps, depts);

    $('#demo1').focus(function(){
        $(this).search({
            field:'name',
            empty:'<p class="f-lh20 e-pl5 e-pr5">搜索条件为“<%value%>”未能匹配到数据</p>',
            data:emps,
            nullable:true,
            match:[{
                field:'name',
                like:function(data, value){
                    return data.indexOf(value) !== -1
                }
            }]
        }).search('show')
    })

    $('#demo2').search({
        field:'name',
        empty:'没有搜索结果，请变换搜索条件',
        nullable:true,
        focus:true,
        prompt:'搜索条件为“<%value%>”的员工或部门，匹配到<%count%>条数据',
        events:{
            'click .item-history':function(e, elem){
                this.self.value(elem.text())
            },
            'click .letters > .s-crt':function(e, elem){
                var letter = elem.text();
                var $container = this.self.activeTab.$container;
                var $list = $container.find('.con-search-list');
                var top = $container.find('.letter-box[data-letter="'+ letter +'"]').position().top;
                $list.animate({scrollTop:'+='+top}, 200)
            },
            'click .item-letter':function(e, elem){
                this.self.value(elem.data('name'))
            }
        },
        match:{
            field:'name',
            like:function(data, value){
                return data.indexOf(value) !== -1
            }
        },
        size:{
            width:100
        },
        tag:{
            multiple:true,
            focus:true,
            backspace:true,
            container:'.demo2Tags > div',
            scroll:'.demo2Tags'
        },
        tabs:[{
            title:'最近',
            content:function(){
                return template.render(
                    '<ul class="con-search-list">'+
                        '<%each $list%>'+
                            '<li class="con-search-item item-history e-mt5" data-name="<%$value.name%>"><%$value.name%></li>'+
                        '<%/each%>'+
                    '</ul>'
                    , 
                    data.historyList
                )
            },
            onShow:function(){
                this.data = all;
                this.toggle()
            }
        }, {
            title:'按员工',
            content:function(){
                return this.content(data.empList)
            },
            onShow:function(){
                this.data = emps;
                this.toggle()
            }
        }, {
            title:'按部门',
            content:function(){
                return this.content(data.deptList)
            },
            onShow:function(){      
                this.data = depts;                
                this.toggle()
            }
        }],
        content:function(data){
            return template.render(
                '<div class="letters">'+
                    '<%each "★ABCDEFGHIJKLMNOPQRSTUVWXYZ#".split("")%>'+
                        '<span<%active($value)%>><%$value%></span>'+
                    '<%/each%>'+
                '</div>'+
                '<div class="con-search-list" style="max-height:320px;">'+
                    '<%each data%>'+
                    '<div class="f-clearfix letter-box" data-letter="<%$value.str%>">'+
                        '<em class="e-mt5"><%$value.str%></em>'+
                        '<ul class="list">'+
                            '<%each $value.list v%>'+
                                '<li class="con-search-item e-pl0 e-mt5 item-letter" data-name="<%v.name%>">'+
                                    '<img src="<%photo(v.photo)%>" class="f-fl" width="30" height="30" alt="<%v.name%>">'+
                                    '<span class="f-fl e-ml5 f-toe text"><%v.name%></span>'+
                                '</li>'+
                            '<%/each%>'+
                        '</ul>'+
                    '</div>'+
                    '<%/each%>'+
                '</div>'
                , 
                {
                    data:data,
                    active:function(letter){
                        var cls = '';
                        Nui.each(data, function(v){
                            if(v.str == letter){
                                cls = ' class="s-crt"';
                                return false
                            }
                        })
                        return cls
                    },
                    photo:function(val){
                        return val || '//rs.jss.com.cn/oa/oa/index/images/dept_30.png'
                    }
                }
            )
        },
        toggle:function(){
            var that = this, self = that.self;
            self.activeTab.$container.find('.con-search-item').each(function(){
                var elem = $(this), data = elem.data();
                elem.toggleClass('s-crt', that.selected(self, data))
            })
        },
        selected:function(self, data){
            var exist = false;
            Nui.each(self.tagData, function(val){
                if(data.name === val.text){
                    exist = true;
                    return false
                }
            })
            return exist
        },
        item:function(){    
            return '<li class="con-search-item<%selected($data)%>" data-index="<%$index%>" data-name="<%$data.name%>"><%$data.name%></li>'
        },
        onSelectBefore:function(self, data){
            self.value(data[this.field])
            return false
        },
        onBlur:function(self, elem){
            self.value('');
        },
        onChange:function(self){
            this.toggle()
        }
    })

    $('[name="single"]').click(function(){
        var ele = $(this);
        $('#demo2').search('value', null);
        $('#demo2').search('option', {
            tag:{
                multiple:!ele.prop('checked')
            }
        })
    })

    $('#demo3').search({
        container:'.demo3Tags',
        field:'name',
        empty:'没有搜索结果，请变换搜索条件',
        prompt:'<p style="line-height:40px;">搜索条件为“<%value%>”的部门或员工，匹配到<%count%>条数据</p>',
        nullable:true,
        focus:true,
        match:{
            field:'name',
            like:function(data, value){
                return data.indexOf(value) !== -1
            }
        },
        tag:{
            multiple:true,
            focus:true,
            container:'.demo3Tags > div > div',
            scroll:'.demo3Tags > div'
        },
        tabs:[{
            title:'组织架构',
            content:function(){
                return '<div id="ztree" class="ztree"></div>'
            },
            onShow:function(self){
                var that = this;
                if(!that.ztree){
                    require.async('../../../../assets/script/zTree/jquery.ztree.all-3.5.min.js', function(){
                        var zTreeObj,
                            setting = {
                                view:{
                                    selectedMulti:true
                                },
                                callback:{
                                    beforeClick:function(treeId, treeNode){
                                        that.toggle(treeNode)
                                        return false
                                    }
                                }
                            },
                            zTreeNodes = [{
                                name:'研发中心',
                                children:[{
                                    name:'前端开发组',
                                    children:[{
                                        name:'王福元'
                                    }, {
                                        name:'吕永宝'
                                    }, {
                                        name:'王驰君'
                                    }]
                                }, {
                                    name:'架构组',
                                    children:[{
                                        name:'董丽华'
                                    }, {
                                        name:'方兴苗'
                                    }]
                                }]
                            }, {
                                name:'产品部',
                                children:[{
                                    name:'UED组',
                                    children:[{
                                        name:'孙宛清'
                                    }, {
                                        name:'郭荣'
                                    }]
                                }, {
                                    name:'产品组',
                                    children:[{
                                        name:'邓本'
                                    }, {
                                        name:'秦文倩'
                                    }]
                                }]
                            }]
                        that.ztree = $.fn.zTree.init($('#ztree'), setting, zTreeNodes);
                        that.data = that.ztree.transformToArray(that.ztree.getNodes());
                        that.toggleZtree()
                    })
                }
                else{
                    that.toggleZtree()
                }
            }
        }],
        toggle:function(treeNode){
            var that = this, self = that.self;
            var arr = [], all = [];
            var nodes = that.ztree.transformToArray(treeNode);
            Nui.each(nodes, function(node){
                if(!node.children){
                    var data = that.setValue(self, node);
                    if(!that.selected(self, node)){
                        arr.push(data)
                    }
                    all.push(data)
                }
            })
            //没有被选择的或者全部被选择的
            if(all.length === arr.length || !arr.length){
                self.value(all)
            }
            //只有部分被选择
            else{
                self.value(arr)
            }
        },
        toggleZtree:function(){
            var that = this, self = that.self;
            Nui.each(that.data, function(v){
                if(that.selected(self, v)){
                    that.ztree.selectNode(v, true)
                }
                else{
                    that.ztree.cancelSelectedNode(v)
                }
            })
        },
        setValue:function(selr, data){
            return {
                text:data.name
            }
        },
        selected:function(self, data){
            var exist = false;
            Nui.each(self.tagData, function(val){
                if(data.name === val.text){
                    exist = true;
                    return false
                }
            })
            return exist
        },
        item:function(){    
            return '<li class="con-search-item<%selected($data)%>" data-index="<%$index%>" data-name="<%$data.name%>"><%$data.name%></li>'
        },
        onSelectBefore:function(self, data){
            if(data.children){
                this.toggle(data)
            }
            else{
                self.value(data[this.field])
            }
            return false
        },
        onBlur:function(self, elem){
            self.value('');
        },
        onChange:function(self){
            var that = this;
            self.activeTab.$container.find('.con-search-item').each(function(){
                var elem = $(this), data = elem.data();
                elem.toggleClass('s-crt', that.selected(self, data))
            })
            that.toggleZtree()
        }
    })
})


})(Nui['_module_2_define']);
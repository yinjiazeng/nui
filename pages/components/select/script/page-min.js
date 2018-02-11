;(function(__define){
    function __requireDefaultModule(module){
        if(module && module.defaults !== undefined){
            return module.defaults
        }
        return module
    }
/**
 * Nui&jQuery扩展
 */

__define('src/core/extend',function(){
           
    Nui.win = $(window);

    Nui.doc = $(document);
    
    var prop = $.fn.prop;

    var serializeArray = $.fn.serializeArray; 

    $.fn.extend({
        /**
         * @func 添加或者移除表单属性
         * @param name <String>
         * @param value <String, Boolean>
         * @param className <String, Function> 当第二个参数为false时移除类名，否则增加类名
         */
        prop:function(){
            var args = arguments, arr = Array.prototype.slice.call(args, 0, 2), $ele = $(this), cls = args[2];
            if(typeof cls === 'function'){
                cls = cls.apply(this, arr)
            }
            if(cls){
                $ele[args[1] === false ? 'removeClass':'addClass'](cls)
            }
            return prop.apply(this, arr)
        },
        /**
         * @func 序列化表单值转成url参数形式
         * @param disabled <Boolean> 是否包含禁用元素
         */
        serialize:function(disabled){
            return $.param(this.serializeArray(disabled));
        },
        /**
         * @func 序列化表单值转为JSON数组
         * @param disabled <Boolean> 是否包含禁用元素
         */
        serializeArray:function(disabled){
            if(!disabled){
                return serializeArray.call(this)
            }
            return this.map(function(){
                var elements = $.prop(this, 'elements');
                return elements ? $.makeArray(elements) : this;
            })
            .filter(function(){
                var type = this.type;
                return this.name && this.nodeName &&
                    (/^(?:input|select|textarea|keygen)/i).test(this.nodeName) && 
                    !(/^(?:submit|button|image|reset|file)$/i).test(type) &&
                    (this.checked || !(/^(?:checkbox|radio)$/i).test(type));
            })
            .map(function(i, elem){
                var val = $(this).val();
                return val == null ?
                    null :
                    $.isArray(val) ?
                        $.map(val, function(val){
                            return {name: elem.name, value: val.replace( /\r?\n/g, "\r\n" )};
                        }) :
                        {name: elem.name, value: val.replace( /\r?\n/g, "\r\n" )};
            }).get();
        }
    })
})
/**
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 实用工具集
 */

__define('src/core/util',['src/core/extend'], function(){
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
         * @param selector <String> 将name相同表单元素值分隔，当设置为jquery选择器时，配合field参数使用，用于获取item中表单元素的数据集合
         * @param field <String> 字段名，配合selector参数使用，返回对象中会包含该字段
         * @param disabled <Boolean> 是否包含禁用元素
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
        getData:function(element, selector, field, disabled){
            var that = this;
            var data = {
                'result':{},
                'voids':0, //字段中空值数量
                'total':0 //总计多少个字段
            }
            if(element.length){
                if(typeof selector === 'boolean'){
                    disabled = selector;
                    selector = undefined
                }
                else if(typeof field === 'boolean'){
                    disabled = field;
                    field = undefined
                }
                //form元素
                var array = element.serializeArray(disabled);
                if(!array.length){
                    array = element.find('[name]').serializeArray(disabled);
                }
                var separator = ',';
                if(selector && field === undefined){
                    separator = selector;
                    selector = undefined
                }
                Nui.each(array, function(v, i){
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
                    data.result[k] = v.join(separator)
                })
                if(selector && field && typeof field === 'string'){
                    var once = false;
                    data.result[field] = [];
                    element.find(selector).each(function(){
                        var result = that.getData($(this), disabled).result;
                        if(!$.isEmptyObject(result)){
                            if(!once){
                                Nui.each(result, function(v, k){
                                    delete data.result[k]
                                });
                                once = true
                            }
                            data.result[field].push(result)
                        }
                    })
                }
            }
            return data
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

__define('src/core/template',['src/core/util'], function(util){

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


__define('src/core/events',['src/core/extend'], function(){
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

__define('src/core/component',function(require){
    var template = require('src/core/template');
    var events   = require('src/core/events');
    var ext     = require('./extend');

    var slice = Array.prototype.slice;

    var callMethod = function(method, args, obj){
        if(typeof method === 'function'){
            //实参大于形参，最后一个实参表示id
            if(args.length > method.length){
                var id = args[args.length-1];
                if(id && Nui.type(id, ['String', 'Number']) && obj._options.id !== id && obj.__id !== id){
                    return
                }
            }
            method.apply(obj, args)
        }
    }

    var bindComponent = function(name, elem, mod, options){
        //不能重复绑定
        if(elem.nui && elem.nui[name]){
            return
        }
        var $elem = jQuery(elem), _mod;
        if(options === undefined){
            options = $elem.data(name+'Options');
        }
        if(options && typeof options === 'string'){
            if(/^{[\s\S]*}$/.test(options)){
                options = eval('('+ options +')');
            }
            else if(_mod = require(options, true)){
                if(typeof _mod.exports === 'function'){
                    options = _mod.exports($elem)
                }
                else{
                    options = _mod.exports;
                }
            }
        }
        if(typeof options !== 'object'){
            options = {};
        }
        mod(Nui.extend({}, options, {
            target:elem
        }))
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
                        var self = this, name = self.__component_name, args = arguments, container = args[0], 
                            isContainer = container && container instanceof jQuery,
                            mod = components[name], init = methodName === 'init';
                        if(name && name !== 'component' && mod){
                            if(isContainer){
                                if(init){
                                    container.find('[data-'+name+'-options]').each(function(){
                                        bindComponent(name, this, mod)
                                    })
                                }
                                else{
                                    container.find('[nui_component_'+ name +']').each(function(){
                                        var obj, nui = this.nui;
                                        if(nui && (obj = nui[name])){
                                            callMethod(obj[methodName], slice.call(args, 1), obj)
                                        }
                                    })
                                }
                            }
                            else{
                                Nui.each(self.__instances, function(obj){
                                    callMethod(obj[methodName], args, obj)
                                })
                            }
                        }
                        else if(name === 'component'){
                            var attributes = [];
                            Nui.each(components, function(v, k){
                                if(k !== 'component' && typeof v[methodName] === 'function'){
                                    if(isContainer){
                                        if(init){
                                            attributes.push('[data-'+ k +'-options]')
                                        }
                                        else{
                                            attributes.push('[nui_component_'+ k +']')
                                        }
                                    }
                                    else{
                                        Nui.each(v.constructor.__instances, function(obj){
                                            callMethod(obj[methodName], args, obj)
                                        })
                                    }
                                }
                            })
                            if(attributes.length){
                                var matchRegexp = init ? /^data-(\w+)-options/i : /^nui_component_(\w+)/i;
                                container.find(attributes.join(',')).each(function(index, elem){
                                    var attrs = elem.attributes, nui = elem.nui, obj, i = attrs.length;
                                    while(i--){
                                        var attr = attrs[i];
                                        if(attr && attr.name){
                                            var match = attr.name.match(matchRegexp);
                                            if(match){
                                                var _name = match[1];
                                                var mod = components[_name];
                                                if(init){
                                                    bindComponent(_name, elem, mod, attr.value)
                                                }
                                                else if(nui && (obj = nui[_name])){
                                                    callMethod(obj[methodName], slice.call(args, 1), obj)
                                                }
                                            }
                                        }
                                    }
                                })
                            }
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
                                    attr.apply(object, slice.call(args, 1))
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
        // _$ready:function(name, module){
        //     if(typeof this.init === 'function'){
        //         this.init(Nui.doc)
        //     }
        // },
        config:function(){
            var args = arguments;
            var len = args.length;
            var attr = args[0];
            if(Nui.type(attr, 'Object')){
                return this._options = Nui.extend(true, this._options, attr)
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
        _disabled:function(){
            return this.target.prop('disabled')
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
                return template.render(this._template, id, opts)
            }
            return template.render.call(this._template, this._template[id], data, opts)
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
                this._options = Nui.extend(true, {}, this[isdef === true ? '_defaultOptions' : '_options'], options)
                this._reset();
                this._exec();
            }
            return this
        },
        on:function(name, callback){
            var self = this, callbacks = {};
            if(
                typeof name === 'string' && 
                typeof callback === 'function'
            ){
                callbacks[name] = callback
            }
            else if(typeof name === 'object'){
                callbacks = name
            }
            Nui.each(callbacks, function(v, k){
                self._options['on' + k.substr(0, 1).toUpperCase() + k.substr(1)] = v
            })
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
 * @update Aniu[2016-11-10 22:39]
 * @version 1.0.1
 * @description layer弹出层
 */

__define('src/components/layer/layer',function(require, imports){
    imports('../../assets/components/layer/index');
    
    var component = require('src/core/component');
    var util = require('src/core/util');
    var template = require('src/core/template');

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
__define('src/components/layer/loading',['src/components/layer/layer'], function(layer){
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
__define('src/core/request',function(require){
    var util = require('src/core/util');
    var loading = require('src/components/layer/loading');
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
 * @update Aniu[2018-01-31 11:54]
 * @version 1.0.3
 * @description 搜索
 */

__define('src/components/search',function(require, imports){
    imports('../assets/components/search/index');
    
    var component = require('src/core/component');
    var util = require('src/core/util');
    var request = require('src/core/request');

    var Search = this.extend(component, {
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
            },
            /**
             * @func 将tag数据转为html模版
             * @param data <Object>
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
             * @param option <Object> 
             * {
             *     title:true,
             *     close:'×',
             *     type:'gray'
             * }
             */
            data2html:function(data, option){
                if(data && typeof data === 'object'){
                    if(!option){
                        option = {}
                    }
                    return Search._tpl2html.call(Search, 'tags', {
                        data:[].concat(data),
                        title:option.title === undefined ? true : option.title,
                        close:option.close||'×',
                        type:option.type ? [].concat(option.type) : false
                    })
                }
                return ''
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
             * @desc 配合选项参数selected方法在模版中类名中加入<%selected($data)%>可以设置当前行是否选中
             * @desc 模版中有效列表类名必须包含con-search-item以及data-index="<%$index%>"属性
             */
            item:'',
            /**
             * @func 定义空数据模版
             * @type <String>
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @return <String> 返回空数据时模版
             * @desc 模版中可以使用<%value%>获取当前输入值
             */
            empty:'',
            /**
             * @func 定义输入时有结果返回提示模版
             * @type <String>
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @return <String> 返回提示模版
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
             * @func 设置列表展示内容字段名
             * @type <String>
             * @desc 在展示列表时如果未使用item参数，将会展示该值内容
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
             * @func 搜索时是否缓存数据
             * @type <Boolean>
             * @desc 设置为true后，如果输入之前已经查询过的数据，那么不再执行查询，直接返回该数据
             */
            cache:false,
            /**
             * @func 展示内容显示容器
             * @type <String> 字符串选择器
             * @type <Object> dom、jQuery对象
             * @type <Function> 
             * @param self <Object> 组件实例对象
             * @return <String, Object> 返回选择器或者元素对象
             * @desc 如果设置为body，创建的元素会基于搜索输入框进行定位，如果不是则基于该值定义的元素进行定位
             */
            container:'body',
            /**
             * @func 下拉列表的数量，超过出现滚动条
             * @type <Number>
             */
            limit:6,
            /**
             * @func 为展示元素增加高宽
             * @type <Object>
             */
            size:null,
            /**
             * @func 设置展示元素的偏移值
             * @type <Object>
             */
            offset:null,
            /**
             * @func 设置展示元素样式
             * @type <Object>
             */
            style:null,
            /**
             * @func jQuery ajax配置
             * @type <Object>
             */
            ajax:null,
            /**
             * @func 自定义列表数据
             * @type <Array>
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @return <Array> 返回自定义数据
             */
            data:null,
            /**
             * @func 展示标签配置项
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
                 * @func 关闭按钮内容
                 * @type <String>
                 */
                close:'×',
                /**
                 * @func 是否多选
                 * @type <Boolean>
                 */
                multiple:false,
                /**
                 * @func 是否可以用退格键删除标签
                 * @type <Boolean>
                 */
                backspace:false,
                /**
                 * @func 点击叉号删除标签时是否使输入框获取焦点
                 * @type <Boolean>
                 */
                focus:false,
                /**
                 * @func 选择完是否清空输入框
                 * @type <Boolean>
                 */
                clear:false,
                /**
                 * @func 鼠标悬停在标签上是否有提示
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
                 * @func 设置标签数据
                 * @type <Function>
                 * @param self <Object> 组件实例对象
                 * @param elem <jQuery Object> 标签元素对象
                 * @return 返回数据对象
                 */
                getData:null,
                /**
                 * @func 检测是否可以删除标签
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
             * @func 定义搜索列表选中数据
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
             * @param data <Object> 列表数据
             * @param value <String> 输入框中的值
             * @return <Array> 返回过滤后的数组
             */
            filter:null,
            /**
             * @func 输入框失去焦点时校验内容是否存在
             * @type <Boolean> 为true时默认取field参数对应的字段
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @param data <Object> 遍历的一行数据
             * @param value <String> 输入框中的值
             * @return <Boolean> 返回true则表示数据匹配
             * @desc 仅在单选功能才会启用
             */
            exist:null,
            /**
             * @func 请求返回数据时触发回调
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @param data <Anything> 接口返回数据
             * @return <Array> 返回列表数据
             */
            onResponse:null,
            /**
             * @func 选中列表前触发回调
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @param data <Object> 选中项数据
             * @param event <Object> 事件对象
             * @param elem <jQuery Object> 选中项对象
             * @return <Boolean> 返回false则不会触发setValue以及onSelect
             */
            onSelectBefore:null,
            /**
             * @func 选中列表后触发回调
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
             * @param data <Object> exist参数启用时该参数才存在，表示已选中数据
             */
            onBlur:null,
            /**
             * @func 改变选中值后触发回调
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
                '<%each data $data k%>'+
                    '<%if $data && $data.text%>'+
                    '<span class="ui-tag<%if type%><%each type v i%> ui-tag-<%v%><%/each%><%/if%>">'+
                        '<em class="con-tag-text"<%if title%> title="<%$data.text%>"<%/if%>><%$data.text%></em>'+
                        '<%if close%>'+
                        '<b class="con-tag-close"><%close%></b>'+
                        '<%/if%>'+
                        '<%if $data.fields?? && $data.fields%>'+
                            '<%each $data.fields%>'+
                                '<%if $value !== undefined%>'+
                                '<input type="hidden" name="<%$index%>" value="<%$value%>">'+
                                '<%/if%>'+
                            '<%/each%>'+
                        '<%/if%>'+
                    '</span>'+
                    '<%/if%>'+
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
            var self = this, opts = self._options, data = self.queryData[self._activeIndex], elem = this._activeItem, value = '';
            if(data === undefined || !elem){
                return
            }
            
            self._selectData = data;

            if(self._callback('SelectBefore', [data, e, elem]) === false){
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
            self._callback('Select', [data, e, elem]);
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
        _exist:function(){
            var self = this, opts = self._options, exist = false, data = self.queryData;
            if(data.length && self.val){
                Nui.each(data, function(val){
                    if(self._existCheck.call(opts, val, self.val) === true){
                        exist = val;
                        return false
                    }
                })
            }
            return exist
        },
        _filter:function(){
            var self = this, opts = self._options, data = [], _data = self._setData();
            if(typeof opts.filter === 'function'){
                data = opts.filter.call(opts, self, _data, self.val);
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
                        if(typeof opts.onResponse === 'function'){
                            _data = opts.onResponse.call(opts, self, res)
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
        _setDefault:function(){
            var self = this, opts = self._options;
            if(opts.nullable === true){
                if(!opts.url){
                    self.queryData = self._setData()
                }
                else{
                    self.queryData = []
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
        _backspace:function(e){
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

            var show = function(callback){
                self._show();
                self._hover = true;
                //部分浏览器不会获得焦点
                setTimeout(function(){
                    self.target.focus();
                    callback && callback()
                })
            }

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
                    self._setDefault();
                    self._show(true)
                }
            })

            //悬停在组件相关的元素上，则不允许失去焦点
            self._on('blur', self.target, function(e, elem){
                if(!self._hover){
                    var data, args;
                    if(self._existCheck){
                        args = [self._selectData];
                        if((data = self._exist()) === false){
                            self.value(null)
                        }
                        else if(self._showed && data !== self._selectData){
                            args = [data];
                            self._code40();
                            self._select(e);
                        }
                    }
                    self._callback('Blur', args)
                    self.hide()
                }
                else{
                    show()
                }
            })

            self._on('click', self.target, function(e, elem){
                if(!self._showed){
                    elem.focus()
                }
            })

            if(opts.focus === true){
                self._on('focus', self.target, function(e, elem){
                    self._show()
                })
            }

            self._on('keydown', self.target, function(e, elem){
                var code = e.keyCode;
                if(self._allow(code === 40 || code === 38)){
                    e.preventDefault()
                }
                if(code !== 67){
                    storeKeycode = []
                }
                storeKeycode.push(code)
                if(self._allow(code === 13)){
                    self['_code'+code](e)
                }
                else if(code === 8){
                    self._backspace(e)
                }
            })

            var $tagContainer = self.$tagContainer;
            var $tagScroll = self.$tagScroll;
            var tag = opts.tag;
            if($tagContainer){
                self._on('click', $tagContainer, '.ui-tag > .con-tag-close', function(e, elem){
                    if(self._disabled()){
                        return
                    }
                    elem.closest('.ui-tag').remove();
                    delete self._hover;
                    if(tag.focus === true){
                        show(function(){
                            self._change(e)
                        })
                    }
                    else{
                        self._change(e);
                    }
                })

                if($tagScroll && $tagScroll.find(self.target).length){
                    //关闭标签时隐藏组件
                    if(tag.focus !== true){
                        self._on('mouseenter', $tagContainer, '.ui-tag', function(){
                            delete self._hover
                        })
                    }
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
                            show(function(){
                                self.resize()
                            })
                        }
                        else{
                            delete self._tag_event
                        }
                    })
                }
                else if(tag.focus === true){
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
            self._elementData = {
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
            self._targetData = {
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
            var self = this, opts = self._options, data = opts.data, match = opts.match, target = self.target;
            self._caches = {};

            self.queryData = [];

            self.data = [];

            self._size = opts.size || {};

            self._offset = opts.offset || {};

            self._isTab = false;

            self._defaultTab = null;

            self._listHeight = 0;

            self._multiple = target.prop('multiple') || opts.tag.multiple;

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

            if(self._multiple !== true){
                if(opts.exist === true && opts.field){
                    self._existCheck = function(val){
                        return val[opts.field] === self.val
                    }
                }
                else if(typeof opts.exist === 'function'){
                    self._existCheck = opts.exist
                }
            }
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
                self.$list.children('.con-search-item').each(function(i){
                    var $elem = $(this);
                    self._items.push($elem);
                    if(!self._isTab && !input && selectedIndex === undefined && $elem.hasClass('s-crt')){
                        self._selectData = self.queryData[i];
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
            return this.constructor.data2html(data, this._tag)
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
            if(self._disabled() || (self._hover && !input)){
                return
            }
            //页面中只能存在一个显示的组件
            if(_class._active && _class._active !== self){
                _class._active.hide()
            }
            //输入框值为空不允许展示下拉
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
                if(!input){
                    self._setDefault()
                }
                self._render(input);
                this._callback('Show');
            }
        },
        resize:function(){

            if(!this.element){
                return
            }

            var self = this, opts = self._options, target = self.target, elem = self.element, targetData = self._targetData, elemData = self._elementData,
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
            this._show();
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
            if(_class._active === self){
                delete _class._active
            }
            if(self.element){
                self.element.hide()
            }
            self._callback('Hide')
        },
        /**
         * @func 销毁组件
         */
        destroy:function(){
            this.hide();
            component.exports.destroy.call(this);
        },
        /**
         * @func 填充文本框内容或者添加tag标签，添加tag必须是对象或者数组类型
         * @param data <String> 设置文本框内容
         * @param data <Object> 添加tag标签，对象必须包含text属性，如果需要给标签添加隐藏域则必须包含fields属性；值为null时会清空标签或者文本框内容
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
            if($tagContainer && typeof data === 'object'){
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
                    if(self._multiple === true){
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

                if(data === null || self._tag.clear !== false){
                    self.value('')
                }

                self._change()
            }
            else if(target){
                var dom = target.get(0), obj;
                if(typeof data !== 'string'){
                    data = ''
                }
                else{
                    data = Nui.trim(data)
                }
                self.val = data;
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

    return Search
}); 
/**
 * @author Aniu[2016-11-10 22:39]
 * @update Aniu[2017-12-22 10:17]
 * @version 1.0.1
 * @description 输入框占位符
 */

__define('src/components/placeholder',function(require, imports){
    imports('../assets/components/placeholder/index');

    var component = require('src/core/component');
    var util = require('src/core/util');
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
            wrap:'<span class="<% className %>" style="<%include \'style\'%>" />',
            elem:'<b class="con-placeholder-text" style="<%include \'style\'%>"><%text%></b>'
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
            var self = this, _class = self.constructor, height = self.target.height();;
            self._textarea = self.target.is('textarea');
            var top = _class._getSize(self.target, 't', 'padding')+_class._getSize(self.target, 't');
            if(Nui.bsie7 && 'left right'.indexOf(self.target.css('float')) === -1){
                top += 1
            }
            self._data = {
                'top':top+'px',
                'height':self._textarea ? 'auto' : height+'px',
                'line-height':self._textarea ? 'normal' : height+'px'
            }
        },
        _create:function(){
            var self = this, opts = self._options, _class = self.constructor;
            if(self._condition()){
                var data = self._tplData();
                data.style = {
                    'width':self.target.outerWidth()+'px',
                    'height':self.target.outerHeight()+'px'
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
            if(!this._disabled()){
                this.target.focus()
            }
        },
        _blur:function(){
            delete this.constructor._active;
            return true
        },
        _indent:function(){
            var _class = this.constructor;
            if(this._options.animate && this.$text){
                _class._active = this.target;
                this.$text.stop(true, false).animate({left:this._pLeft+10, opacity:'0.5'});
            }
        },
        _input:function(){
            var val = this._val = this.target.val(), _class = this.constructor;
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
 * @author Aniu[2017-12-23 16:50]
 * @update Aniu[2018-01-31 11:54]
 * @version 1.0.1
 * @description 选择器组件
 */

__define('src/components/select',function(require, imports){
    imports('../assets/components/select/index');

    var Component = require('src/core/component');
    var Placeholder = require('src/components/placeholder');
    var Search = require('src/components/search');

    var Select = this.extend(Component, {
        _static:{

        },
        _options:{

        },
        _template:
            '<div class="nui-select">'+
                '<div class="con-select-wrap">'+
                    '<div class="con-select-combo">'+
                        '<%tpl%>'+
                        '<div class="con-select-edit">'+
                            '<input type="text" class="con-select-input">'+
                        '</div>'+
                    '</div>'+
                    '<div class="con-select-adorn">'+
                        '<span class="con-select-arrow">▼</span>'+
                    '</div>'+
                '</div>'+
            '</div>',
        _exec:function(){
            if(this._getTarget()){
                this.target.hide();
                var val = this.target.val();
                var tpl = '';
                if(val !== null && val !== undefined){
                    var data = [];
                    Nui.each([].concat(val), function(v){
                        data.push({
                            text:v
                        })
                    })
                    tpl = Search.data2html(data);
                }
                this.element = $(this._tpl2html({
                    tpl:tpl
                })).insertBefore(this.target)
                var input = this.element.find('input');
                input.placeholder({
                    text:'请输入'
                })
                var that = this;
                var multi = this.target.prop('multiple');
                
                Search({
                    target:that.element.find('input'),
                    container:that.element,
                    field:'text',
                    focus:true,
                    nullable:true,
                    tag:{
                        container:that.element.find('.con-select-combo'),
                        scroll:that.element.find('.con-select-wrap'),
                        multiple:multi,
                        backspace:true
                    },
                    size:{
                        //width:100
                    },
                    offset:{
                        top:-1
                    },
                    match:{
                        field:'text',
                        like:function(data, value){
                            return data.indexOf(value) !== -1
                        }
                    },
                    data:this._optionToData(),
                    toggle:function(elem){
                        if(elem){
                            elem.toggleClass('s-crt')
                        }
                    },
                    selected:function(self, data){
                        var exist = false;
                        Nui.each(self.tagData, function(v){
                            if(v.text === data.value){
                                exist = true;
                                return false
                            }
                        })
                        return exist
                    },
                    item:function(){
                        return '<%if !value && $data.label%>'+
                                    '<li><%$data.label%></li>'+
                                '<%/if%>'+
                                '<li class="con-search-item<%selected($data)%>" data-index="<%$index%>">'+
                                    '<%$data.text%>'+
                                '</li>'
                    },
                    setValue:function(self, data){
                        return {
                            text:data.value
                        }
                    },
                    onSelectBefore:function(self, data){
                        if(multi){
                            this.toggle(self._items[self._activeIndex]);
                            self.value(this.setValue(self, data));
                            var text = [];
                            Nui.each(self.tagData, function(v){
                                Nui.each(self.data, function(val){
                                    if(v.text === val.value){
                                        text.push(val.text)
                                        return false
                                    }
                                })
                            })
                            //self.value(text.join(','))
                            return false
                        }
                    },
                    onSelect:function(self, data){
                        self.value(data.text)
                    },
                    onShow:function(){
                        that.element.addClass('s-show')
                    },
                    onHide:function(){
                        that.element.removeClass('s-show')
                    },
                    onChange:function(self){
                        var values = [];
                        Nui.each(self.tagData, function(v){
                            values.push(v.text)
                        })
                        //that.target.val(values)
                    }
                })
            }
        },
        _optionToData:function(){
            var that = this;
            var elem = arguments[0] || this.target;
            var option = elem.children();
            var data = [];
            option.each(function(){
                var $ele = $(this);
                if(this.nodeName === 'OPTGROUP'){
                    var groupData = that._optionToData($ele);
                    if(groupData.length){
                        groupData[0].label = this.label
                    }
                    data = data.concat(groupData)
                }
                else{
                    data.push({
                        text:$ele.text(),
                        value:$ele.attr('value'),
                        disabled:$ele.prop('disabled'),
                        selected:$ele.prop('selected')
                    })
                }
            })
            return data
        }
    })

    return Select
})
__define('./script/page',function(require,imports,renders,extend,exports){
	var module=this;
	imports('../style/page.less');
	require('src/components/select');
	
	
	$('select').select()
});

})(Nui['_module_2_define']);
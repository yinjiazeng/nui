;(function(__define){
    function __requireDefaultModule(module){
        if(module && module.defaults !== undefined){
            return module.defaults
        }
        return module
    }
__define('src/components/checkradio',function(){
    
})

__define('src/components/paging',function(require){
    return require('plugins/paging')
})
/**
 * Nui&jQuery扩展
 */

__define('src/core/extends',function(){
           
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

__define('src/core/util',['src/core/extends'], function(){
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


__define('src/core/events',['src/core/extends'], function(){
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

/**
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 组件基类
 */

__define('src/core/component',function(require){
    var template = require('src/core/template');
    var events   = require('src/core/events');
    var ext     = require('./extends');

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
        var $elem = jQuery(elem), _options;
        if(options === undefined){
            options = $elem.data(name+'Options');
        }
        
        if((options && typeof options === 'string') || typeof options === 'number'){
            if(/^{[\s\S]*}$/.test(options)){
                options = eval('('+ options +')');
            }
            else if(_options = require(options)){
                if(typeof _options === 'function'){
                    options = _options($elem)
                }
                else{
                    options = _options
                }
            }
        }
        if(Nui.type(options, 'Object')){
            mod(Nui.extend({}, options, {
                target:elem
            }))
        }
        else{
            mod({
                target:elem
            })
        }
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
                                    var attrs = elem.attributes, nui = elem.nui, obj, i = attrs.length, data = [];
                                    while(i--){
                                        var attr = attrs[i];
                                        if(attr && attr.name){
                                            var match = attr.name.match(matchRegexp);
                                            if(match){
                                                data.push({
                                                    name:match[1],
                                                    value:attr.value
                                                })
                                            }
                                        }
                                    }
                                    Nui.each(data, function(v){
                                        if(init){
                                            bindComponent(v.name, elem, components[v.name], v.value)
                                        }
                                        else if(nui && (obj = nui[v.name])){
                                            callMethod(obj[methodName], slice.call(args, 1), obj)
                                        }
                                    })
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
                    var dom = this, object, options = args[0];
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
                    if(dom.nui && (object = dom.nui[name])){
                        execMethod()
                    }
                    else if(!object){
                        object = module((function(opts){
                            if(Nui.type(opts, 'Object')){
                                opts.target = dom
                                return opts
                            }
                            else{
                                return {target:dom}
                            }
                        })(options))
                        execMethod()
                    }
                })
            }
        },
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

    return this.extend({
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
        _getName:function(_class, array){
            var skin = Nui.trim(this._options.skin);
            _class = _class || this.constructor;
            if(_class.__parent){
                var _pclass = _class.__parent.constructor;
                var _name = _pclass.__component_name;
                if(_name !== 'component'){
                    if(skin){
                        array.unshift('nui-'+_name+'-'+skin);
                    }
                    array.unshift('nui-'+_name);
                    return this._getName(_pclass, array)
                }
            }
            return array
        },
        _tplData:function(data){
            var opts = this._options, 
                skin = Nui.trim(opts.skin),
                _class = this.constructor,
                name = 'nui-' + _class.__component_name, 
                className = this._getName(_class, []);

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

__define('src/components/datagrid',function(require){
    this.imports('../assets/components/datagrid/index');
    
    var component = require('src/core/component');
    var util = require('src/core/util');
    var paging = require('src/components/paging');
    var checkradio = require('src/components/checkradio');

    //获取滚动条宽度
    var scrollBarWidth = (function(){
        var oldWidth, newWidth, div = document.createElement('div');
        div.style.cssText = 'position:absolute; top:-10000em; left:-10000em; width:100px; height:100px; overflow:hidden;';
        oldWidth = document.body.appendChild(div).clientWidth;
        div.style.overflowY = 'scroll';
        newWidth = div.clientWidth;
        document.body.removeChild(div);
        return oldWidth - newWidth;
    })()

    return this.extend(component, {
        _static:{
            _init:function(){
                var self = this;
                Nui.doc.on('click', function(e){
                    var isRow = $(e.target).closest('tr').hasClass('table-row');
                    Nui.each(self.__instances, function(val){
                        if(!isRow && val.element && val._activeElem){
                            val._callback('CancelActive', [e, val._activeElem])
                            Nui.each(val._rowElems, function(v){
                                v[val._activeIndex] && v[val._activeIndex].removeClass('s-crt')
                            })
                            delete val._activeElem;
                            delete val._activeIndex;
                        }
                    })
                });

                var timer = null;
                Nui.win.on('resize', function(){
                    clearTimeout(timer);
                    timer = setTimeout(function(){
                        Nui.each(self.__instances, function(val){
                            if(val._options.height === '100%'){
                                val.resize()
                            }
                        })
                    }, 80)
                })
            },
            _hasChildren:function(value){
                return Nui.isArray(value.children) && value.children.length
            },
            _colspan:function(array, count){
                var self = this;
                if(count === undefined){
                    count = 0
                }
                Nui.each(array, function(v){
                    if(self._hasChildren(v)){
                        count += self._colspan(v.children)
                    }
                    else{
                        count += 1
                    }
                })
                return count
            }
        },
        _options:{
            container:null,
            data:null,
            columns:null,
            isFixed:true,
            isLine:false,
            isActive:true,
            isBorder:true,
            option:null,
            isPaging:true,
            isDir:false,
            keyCode:[9, 13],
            url:null,
            paging:null,
            fields:null,
            dataField:'list',
            width:'100%',
            height:'100%',
            footer:'',
            placeholder:'',

            onFocusin:null,
            onFocusout:null,
            onFocus:null,
            onBlur:null,

            filterQuery:null,
            stringify:null,
            rowRender:null,
            colRender:null,

            onActive:null,
            onCancelActive:null,
            onRowRender:null,
            onRowClick:null,
            onRowDblclick:null,
            onCheckboxChange:null,
            onRender:null,
            onRenderBefore:null,
            onScroll:null
        },
        _template:{
            layout:
                '<div class="<% className %>">'+
                    '<div class="datagrid-body<%if isFixed%> datagrid-fixed<%/if%>">'+
                        '<%include "table"%>'+
                    '</div>'+
                    '<%if footer || paging%>'+
                    '<div class="datagrid-foot">'+
                        '<%if footer%>'+
                        '<%footer%>'+
                        '<%/if%>'+
                        '<%if paging%>'+
                        '<div class="datagrid-paging"></div>'+
                        '<%/if%>'+
                    '</div>'+
                    '<%/if%>'+
                '</div>',
            table:
                '<%each rows v k%>'+
                    '<%if v.length%>'+
                    '<div class="datagrid-table<%if k === "left" || k === "right"%> datagrid-table-fixed<%/if%> datagrid-table-<%k%>">'+
                        '<%if !isFixed%>'+
                            '<div class="datagrid-box">'+
                            '<table class="ui-table<%if !isBorder%> ui-table-nobd<%/if%>">'+
                                '<%include "thead"%>'+
                                '<tbody class="table-tbody datagrid-tbody"></tbody>'+
                            '</table>'+
                            '</div>'+
                        '<%else%>'+
                            '<div class="datagrid-title">'+
                                '<div class="datagrid-thead">'+
                                '<table class="ui-table<%if !isBorder%> ui-table-nobd<%/if%>">'+
                                    '<%include "thead"%>'+
                                '</table>'+
                                '</div>'+
                            '</div>'+
                            '<div class="datagrid-box">'+
                                '<table class="ui-table<%if !isBorder%> ui-table-nobd<%/if%>">'+
                                '<%include "colgroup"%>'+
                                '<tbody class="table-tbody datagrid-tbody"></tbody>'+
                                '</table>'+
                            '</div>'+
                        '<%/if%>'+
                    '</div>'+
                    '<%/if%>'+
                '<%/each%>',
            colgroup:
                '<%if !rowRender%>'+
                    '<colgroup>'+
                        '<%each cols[k] col i%>'+
                        '<col<%if col.width%> width="<%col.width%>"<%/if%>>'+
                        '<%/each%>'+
                    '</colgroup>'+
                '<%/if%>',
            thead:
                '<%include "colgroup"%>'+
                '<thead class="table-thead">'+
                    '<%each v%>'+
                    '<tr class="table-row">'+
                        '<%var cellLastIndex = $value.length-1%>'+
                        '<%each $value val key%>'+
                        '<%var isTitle = true%>'+
                        '<%var _classNames = val.className%>'+
                        '<%if typeof _classNames === "function"%>'+
                            '<%if _classNames = Nui.trim(val.className()||"")%>'+
                                '<%var _classNames = " " + _classNames%>'+
                            '<%/if%>'+
                        '<%/if%>'+
                        '<th class="table-cell<%_classNames%> table-cell-<%key%><%if cellLastIndex === key%> table-cell-last<%/if%>"<%include "attr"%>>'+
                            '<span class="cell-wrap"<%if val.width > 0 && (val.fixed === "left" || val.fixed === "right")%> style="width:<%val.width%>px"<%/if%>>'+
                            '<span class="cell-text">'+
                            '<%if val.title%>'+
                            '<%val.title%>'+
                            '<%if typeof val.order === "object"%>'+
                            '<%var asc = Nui.type(val.order.asc, ["String", "Number"]), desc = Nui.type(val.order.desc, ["String", "Number"])%>'+
                            '<em class="datagrid-order<%if asc && desc%> datagrid-order-both<%/if%>" field="<%val.order.field%>">'+
                            '<%if asc%>'+
                            '<b class="datagrid-order-asc" type="asc" value="<%val.order.asc%>"><i></i><s></s></b>'+
                            '<%/if%>'+
                            '<%if desc%>'+
                            '<b class="datagrid-order-desc" value="<%val.order.desc%>"><i></i><s></s></b>'+
                            '<%/if%>'+
                            '</em>'+
                            '<%/if%>'+
                            '<%elseif val.content === "checkbox"%>'+
                            '<span class="ui-checkradio">'+
                            '<input type="checkbox" name="datagrid-checkbox-all" class="datagrid-checkbox datagrid-checkbox-choose">'+
                            '</span>'+
                            '<%/if%>'+
                            '</span>'+
                            '</span>'+
                        '</th>'+
                        '<%/each%>'+
                    '</tr>'+
                    '<%/each%>'+
                '</thead>',
            cols:
                '<%var colLastIndex = cols.length-1%>'+
                '<%each cols val key%>'+
                '<%var _value%>'+
                '<%if val.field && (!val.content || "number checkbox input".indexOf(val.content)===-1)%>'+
                '<%var _value=$value[val.field]%>'+
                '<%elseif val.content === "number"%>'+
                '<%var _value=$index+1%>'+
                '<%elseif val.content === "checkbox"%>'+
                '<%var _value={"name":val.field ? val.field : "datagrid-checkbox", "class":"datagrid-checkbox"+(!val.title ? " datagrid-checkbox-choose" : ""), "value":$value[val.field]!==undefined?$value[val.field]:""}%>'+
                '<%elseif val.content === "input"%>'+
                '<%var _value={"name":val.field ? val.field : "datagrid-input", "class":"datagrid-input", "value":$value[val.field]!==undefined?$value[val.field]:""}%>'+
                '<%else%>'+
                '<%var _value=val.content%>'+
                '<%/if%>'+
                '<%var _classNames = val.className%>'+
                '<%if typeof _classNames === "function"%>'+
                    '<%if _classNames = Nui.trim(val.className(_value, val.field, $value, $index)||"")%>'+
                        '<%var _classNames = " " + _classNames%>'+
                    '<%/if%>'+
                '<%/if%>'+
                '<td class="table-cell<%_classNames%> table-cell-<%key%><%if colLastIndex === key%> table-cell-last<%/if%>"<%include "attr"%>>'+
                    '<%if typeof val.filter === "function"%>'+
                    '<%var _value = val.filter(_value, val.field, $value, $index)%>'+
                    '<%/if%>'+
                    '<span class="cell-wrap<%if val.nowrap === true%> cell-nowrap<%/if%>"<%if val.width > 0 && (val.fixed === "left" || val.fixed === "right")%> style="width:<%val.width%>px"<%/if%>>'+
                    '<span class="cell-text'+
                        '<%if val.content === "checkbox"%> cell-text-checkbox<%/if%>'+
                        '<%if val.content === "input"%> cell-text-input<%/if%>"'+
                        '<%if val.showtitle === true || val.showtitle === "data" || typeof val.showtitle === "function"%> '+
                            '<%if typeof val.showtitle === "function"%>'+
                            '<%var _showtitle = val.showtitle(_value, val.field, $value, $index)%>'+
                            'title="<%_showtitle??%>"'+
                            '<%else%>'+
                            '<%if val.showtitle !==true%>data-<%/if%>title="<%$value[val.field]??%>"'+
                            '<%/if%>'+
                        '<%/if%>>'+
                    '<%if val.content === "checkbox" && typeof _value === "object"%>'+
                    '<%if checked === true && !val.title && (_value["checked"]=checked)%><%/if%>'+
                    '<span class="ui-checkradio">'+
                    '<input type="checkbox"<%include "_attr"%>>'+
                    '</span>'+
                    '<%elseif val.content === "input" && typeof _value === "object"%>'+
                    '<input type="text" autocomplete="off"<%include "_attr"%>>'+
                    '<%else%>'+
                    '<%include "content"%>'+
                    '<%/if%>'+
                    '</span>'+
                    '</span>'+
                '</td>'+
                '<%/each%>',
            rows:
                '<%if list && list.length%>'+
                '<%var toLower = function(str){'+
                    'return str.replace(/([A-Z])/g, function(a){'+
                        'return "-"+a.toLowerCase()'+
                    '})'+
                '}%>'+
                '<%each list $value _index%>'+
                '<%var $index = insertIndex || _index%>'+
                '<%var rowData = rowRender($value, $index)||{}%>'+
                '<%var className = (rowData.className ? " "+rowData.className : "")%>'+
                '<%delete rowData.className%>'+
                '<tr class="table-row table-row-<%$index%><%className%>" row-pagenum="<%pageNum??%>" row-index="<%$index%>"<%include "data"%><%each rowData _v _n%> <%_n%>="<%_v%>"<%/each%>>'+
                    '<%include "cols"%>'+
                '</tr>'+
                '<%/each%>'+
                '<%elseif type === "all"%>'+
                '<tr>'+
                    '<td class="table-cell table-cell-void" colspan="<%cols.length%>">'+
                        '<span class="ui-void"><%placeholder??%></span>'+
                    '</td>'+
                '</tr>'+
                '<%/if%>',
            _attr:
                '<%if !_value["class"]%>'+
                '<%var _class = _value["class"] = ""%>'+
                '<%/if%>'+
                '<%if _value.className%>'+
                '<%var _class = (_value["class"]+=" "+Nui.trim(_value.className))%>'+
                '<%delete _value.className%>'+
                '<%/if%>'+
                '<%each _value _v _k%>'+
                ' <%_k%>="<%_v%>"'+
                '<%/each%>',
            attr:
                '<%each val value name%>'+
                '<%if !isTitle?? && name === "style"%>'+
                'style="<%each value _v _k%><%_k%>:<%_v%>;<%/each%>"'+
                '<%elseif "width field colspan rowspan cellid".indexOf(name) !== -1%>'+
                ' <%name%>="<%value%>"'+
                '<%/if%>'+
                '<%/each%>',
            data:
                '<%if fields%>'+
                '<%each $value value field%>'+
                '<%if fields === true || $.inArray(field, fields) !== -1%>'+
                '<%var _value = stringify(value)%>'+
                ' data-<%toLower(field)%>=<%if typeof _value !== "undefined"%><%_value%><%else%>"<%value%>"<%/if%>'+
                '<%/if%>'+
                '<%/each%>'+
                '<%/if%>'
        },
        _exec:function(){
            var self = this, opts = self._options, container = opts.container;
            if(container && Nui.isArray(opts.columns) && opts.columns.length){
                self._container = self._jquery(container);
                self._columns = {
                    all:[],
                    left:[],
                    right:[]
                }
                self._checked = false;
                Nui.each(opts.columns, function(v, k){
                    if(v.fixed === 'left' || v.fixed === true){
                        self._columns.left.push(v)
                    }
                    else if(v.fixed === 'right'){
                        self._columns.right.push(v)
                    }
                    self._columns.all.push(v)
                })
                self._keyCode = [];
                if(opts.isDir === true){
                    self._keyCode = self._keyCode.concat([37, 38, 39, 40]);
                }
                if(opts.keyCode){
                    self._keyCode = self._keyCode.concat(opts.keyCode);
                }
                
                self._create()
            }
        },
        _create:function(){
            var self = this, opts = self._options;
            self._rows = {};
            self._cols = {};
            self._rowElems = {};
            self._colTemplates = {};
            self._rowNumber = self._getRowNumber(opts.columns, 0, []);
            self._setTemplate();
            Nui.each(self._columns, function(v, k){
                self._setRowCol(v, k)
            })
            
            self._hasLeftRight = this._cols.left.length || this._cols.right.length;

            self.element = self._bindComponentName($(self._tpl2html('layout', self._tplData({
                cols:self._cols,
                rows:self._rows,
                isFixed:opts.isFixed === true,
                isBorder:opts.isBorder === true,
                paging:opts.paging && typeof opts.paging === 'object' && opts.paging.isPage !== false,
                footer:opts.footer,
                rowRender:typeof opts.rowRender === 'function'
            }))).appendTo(self._container));

            self.element.find('.table-thead .datagrid-checkbox').checkradio(self._checkradio());

            self._body = self.element.children('.datagrid-body');
            self._tableAll = self._body.children('.datagrid-table-all');
            self._tableAllBox =  self._tableAll.find('.datagrid-box');
            self._tableAllTitle = self._tableAll.children('.datagrid-title');
            self._tableAllThead = self._tableAll.find('.datagrid-thead');
            self._tableLeft = self._body.children('.datagrid-table-left');
            self._tableRight = self._body.children('.datagrid-table-right');
            self._tableFixed = self._body.children('.datagrid-table-fixed');
            self._tableFixedBox = self._tableFixed.find('.datagrid-box');
            self._foot = self.element.children('.datagrid-foot');
            self._tableTbody = self._body.find('.datagrid-tbody');

            if(opts.width){
                self._tableAllThead.children().css('width', opts.width);
                self._tableAllBox.children().css('width', opts.width);
            }

            self._theadHeight();
            self._initList();
            self._bindEvent();
        },
        _setTemplate:function(){
            var self = this;
            var tpl = '';
            Nui.each(self._colTemplates, function(v, k){
                tpl += '<%'+ (tpl ? 'else' : '') +'if ("content_"+val.cellid) === "'+ k +'"%><%include "'+ k +'"%>'
            })
            if(tpl){
                tpl += '<%else%><%_value??%><%/if%>'
            }
            else{
                tpl = '<%_value??%>'
            }
            self._template.content = tpl;
        },
        _getRowNumber:function(array, index, arr, cellid, parent){
            var self = this, opts = self._options, _class = self.constructor;
            if(!arr[index]){
                arr[index] = true;
            }

            if(cellid === undefined){
                cellid = 0;
            }

            var opts = opts.option || {};
            
            Nui.each(array, function(v){
                for(var i in opts){
                    if(v[i] === undefined){
                        v[i] = opts[i]
                    }
                }
                v.cellid = cellid++;
                var order = v.order;
                var className = v.className;
                if(order === true){
                    order = 'desc'
                }
                if(order === 'asc' || order === 'desc'){
                    v.order = {};
                    v.order[order] = 1;
                }
                if(v.order && !v.order.field){
                    v.order.field = v.field
                }

                if(v.template === true){
                    var tplid = 'content_'+v.cellid;
                    self._template[tplid] = self._colTemplates[tplid] = v.filter || v.content;
                }

                if(!v.style){
                    v.style = {};
                }
                
                if(v.align){
                    v.style['text-align'] = v.align;
                }

                if(v.valign){
                    v.style['vertical-align'] = v.valign;
                }

                if(v.width){
                    v.width = v.width.toString().replace(/px$/, '');
                }

                if(typeof className !== 'function'){
                    if(!className){
                        className = '';
                    }
    
                    if(className){
                        className = ' ' + Nui.trim(className);
                    }
    
                    v.className = className;
                }

                if($.isEmptyObject(v.style)){
                    delete v.style
                }

                if(parent && parent.fixed){
                    v.fixed = parent.fixed
                }

                if(_class._hasChildren(v)){
                    cellid = self._getRowNumber(v.children, index+1, arr, cellid, v)
                }
            })

            if(parent){
                return cellid
            }

            return arr.length
        },
        _initList:function(){
            var self = this, opts = self._options;
            if(opts.paging){
                delete opts.paging.wrap;
                var container = opts.paging.container;
                opts.paging.wrap = self._foot.children('.datagrid-paging');
                opts.paging.container = !container ? self._tableAllBox : container;
                var pagingId = 'paging_'+self.__id;
                var echoData = opts.paging.echoData;
                opts.paging.echoData = function(data, type){
                    if(self.element){
                        self.data = data;
                        self._render(type);
                        if(typeof echoData === 'function'){
                            echoData.call(opts, data, type)
                        }
                    }
                }
                self.paging = window[pagingId] = new Paging(opts.paging);

                if(opts.isPaging === true){
                    self.paging.query(true)
                }
            }
            else if(opts.data){
                self.data = opts.data;
                self._render();
            }
        },
        _bindEvent:function(){
            var self = this, opts = self._options;
            self._on('scroll', self._tableAllBox, function(e, elem){
                self._scroll(elem);
                self._callback('Scroll', [e, elem, {left:elem.scrollLeft(), top:elem.scrollTop()}]);
            })
            self._event()
        },
        _getList:function(){
            var self = this, opts = self._options, field = opts.dataField, list = self.data, _list;
            if(field && Nui.type(list, 'Object')){
                Nui.each(field.split('.'), function(v){
                    if(list[v]){
                        list = list[v]
                    }
                    else{
                        list = null;
                        return false;
                    }
                })
            }
            if(_list = self._callback('RenderBefore', [list])){
                if(Nui.type(_list, 'Array')){
                    list = _list
                }
            }
            return list||[]
        },
        _renderRow:function(index, data, callback){
            var self = this, 
                opts = self._options,
                rowHtml = '', 
                rowElems = self._rowElems;
            Nui.each(self._cols, function(v, k){
                if(v.length){
                    if(data.length && typeof opts.rowRender === 'function'){
                        rowHtml = opts.rowRender.call(opts, self, data, v, k)
                    }
                    else{
                        rowHtml = self._tpl2html('rows', {
                            type:k,
                            isFixed:opts.isFixed === true,
                            cols:v,
                            fields:opts.fields ? (opts.fields === true ? opts.fields : [].concat(opts.fields)) : null,
                            list:data,
                            insertIndex:index,
                            placeholder:opts.placeholder,
                            pageNum:opts.paging && self.paging ? self.paging.current : undefined,
                            checked:self._checked,
                            stringify:function(val){
                                if(typeof opts.stringify=== 'function'){
                                    return opts.stringify.call(opts, val)
                                }
                            },
                            rowRender:function(val, i){
                                if(typeof opts.onRowRender === 'function'){
                                    return opts.onRowRender.call(opts, self, val, i)
                                }
                                return opts.onRowRender
                            }
                        })
                    }

                    callback(v, k, $(rowHtml))
                }
                else if(index === false){
                    delete rowElems[k]
                }
            })
        },
        _render:function(type){
            var self = this, 
                opts = self._options,
                rowElems = self._rowElems, 
                isScroll = opts.paging && opts.paging.scroll && opts.paging.scroll.enable === true;
            self.list = self._getList();
            if(isScroll && type === 'reload'){
                self.element.find('.datagrid-tbody > [row-pagenum="'+ (self.paging.current) +'"]').nextAll().addBack().remove();
            }
            self._renderRow(false, self.list, function(v, k, $elems){
                if(isScroll && type === 'reload' && rowElems[k]){
                    rowElems[k] = rowElems[k].slice(0, (self.paging.current - 1) * self.paging.pCount)
                }

                var tbody = self.element.find('.datagrid-table-'+k+' .datagrid-tbody');
                var elems;
                if(!rowElems[k]){
                    rowElems[k] = []
                }
                if(!isScroll || (type !== 'jump' && type !== 'reload')){
                    tbody.empty()
                    rowElems[k] = []
                }
                $elems.appendTo(tbody).each(function(i, elem){
                    var $elem = $(elem)
                    rowElems[k].push($elem)
                    $elem.find('.datagrid-checkbox').checkradio(self._checkradio())
                })
            });
            self._resetSize();
            self._callback('Render');
        },
        _checkradio:function(){
            var self = this, opts = self._options;
            var callback = function(elem, e){
                var className = 'datagrid-checkbox-choose';
                if(elem.hasClass(className)){
                    var checked = elem.prop('checked');
                    var index = elem.closest('.table-row').attr('row-index');
                    if(!elem.closest('.datagrid-table').hasClass('datagrid-table-all')){
                        self._rowElems.all[elem.closest('.table-row').attr('row-index')].find('.'+className).checkradio('checked', checked)
                    }
                    if(elem.attr('name') === 'datagrid-checkbox-all'){
                        self._checked = checked;
                        self._tableTbody.find('.'+ className +':enabled').checkradio('checked', checked)
                    }
                    else{
                        var checked = self._tableTbody.find('.'+ className +':checked').length === self._tableTbody.find('.'+className).length;
                        self._checked = checked;
                        self._body.find('.table-thead .'+className).checkradio('checked', checked)
                    }
                }
                self._callback('CheckboxChange', [e, elem]);
            }
            var _opts = {
                callback:callback
            }
            return _opts;
        },
        _resetSize:function(){
            var self = this, opts = self._options, _class = self.constructor;
            self._rowHeight();
            if(opts.height !== 'auto'){
                var stop = self._tableAllBox.scrollTop();
                self._tableAllBox.css('height', 'auto');
                var conntailerHeight = self._container.height();
                if(opts.height > 0){
                    conntailerHeight = opts.height
                }
                var height = conntailerHeight - 
                    self._tableAllTitle.outerHeight() - 
                    _class._getSize(self._tableAllTitle, 'tb', 'margin') - 
                    self._foot.outerHeight() - 
                    _class._getSize(self._foot, 'tb', 'margin');
                self._tableAllBox.height(height);
                if(opts.isFixed === true){
                    var table = self._tableAllBox.children();
                    var barWidth = self._tableAllBox.height() >= table.outerHeight() ? 0 : scrollBarWidth;
                    var fixedHeight = height;

                    if(table.outerWidth() > self._tableAllBox.width()){
                        fixedHeight -= scrollBarWidth;
                    }
                    
                    if(Nui.browser.msie && Nui.browser.version <= 7 && opts.width === '100%'){
                        table.width(self._tableAllBox.width() - barWidth)
                    }

                    self._tableFixedBox.height(fixedHeight);

                    self._tableAllTitle.css({'margin-right':barWidth});

                    self._tableRight.css('right', barWidth)
                }
                self._tableAllBox.scrollTop(stop);
            }
            this._callback('Resize')
        },
        _theadHeight:function(){
            var self = this;
            if(self._hasLeftRight){
                self._tableFixed.find('.table-thead .table-cell').each(function(i){
                    var item = $(this), cellid = item.attr('cellid');
                    var elem = self._tableAll.find('.table-thead .table-cell[cellid="'+ cellid +'"]');
                    var height = elem.height();
                    var _height = item.height(height).height() - height;
                    item.height(height - _height);
                })
            }
        },
        _rowHeight:function(){
            var self = this;
            if(self._hasLeftRight){
                Nui.each(self._rowElems.all, function(v, k){
                    var height = v.outerHeight();
                    if(self._rowElems.left){
                        self._rowElems.left[k].height(height)
                    }
                    if(self._rowElems.right){
                        self._rowElems.right[k].height(height)
                    }
                })
            }
        },
        _setRowCol:function(array, type, row){
            var self = this, opts = self._options, _class = self.constructor;
            if(row === undefined){
                row = 0;
            }

            if(!self._rows[type]){
                self._rows[type] = []
            }

            if(!self._cols[type]){
                self._cols[type] = []
            }

            if(array.length && !self._rows[type][row]){
                self._rows[type][row] = []
            }

            Nui.each(array, function(v){
                var hasChild = _class._hasChildren(v);
                var data = {};

                if(hasChild){
                    data.colspan = _class._colspan(v.children);
                    self._setRowCol(v.children, type, row + 1)
                }

                Nui.each(v, function(val, key){
                    if(key !== 'children'){
                        data[key] = val
                    }
                })

                if(!hasChild){
                    data.rowspan = self._rowNumber - row;
                    self._cols[type].push(v)
                }

                self._rows[type][row].push(data)
            })
        },
        _editInput:function(e, elem){
            var dom = elem.get(0);
            var keycode = e.keyCode;
            if(keycode === 37 || keycode === 39){
                var index = util.getFocusIndex(dom);
                var edge;
                if(keycode === 37){
                    edge = index !== 0;
                }
                else{
                    edge = index !== dom.value.length;
                }
                if(util.isTextSelect() || edge){
                    return false
                }
            }
        },
        _horzFocus:function(e, elem, type, isTab){
            var td = elem.closest('td.table-cell');
            var _td = td[type]();
            if(isTab){
                e.preventDefault();
            }
            if(_td.length){
                var input = _td.find('.datagrid-input');
                if(input.length && !input.prop('readonly') && !input.prop('disabled')){
                    input.focus();
                    setTimeout(function(){
                        input.select()
                    })
                }
                else{
                    this._horzFocus(e, _td.children(), type, isTab)
                }
            }
            else{
                var input;
                var elems = td.closest('.table-row').children('td.table-cell');
                if(type === 'prev'){
                    $.each($.makeArray(elems).reverse(), function(k, v){
                        var _input = $(v).find('.datagrid-input');
                        if(_input.length){
                            input = _input;
                            return false;
                        }
                    });
                }
                else{
                    elems.each(function(){
                        var _input = $(this).find('.datagrid-input');
                        if(_input.length){
                            input = _input;
                            return false;
                        }
                    })
                }
                if(input){
                    this._verticalFocus(e, input, type, true)
                }
            }
        },
        _verticalFocus:function(e, elem, type, flag){
            var self = this;
            var td = elem.closest('td.table-cell');
            var index = td.index();
            var tr = td.closest('.table-row')[type]();
            if(tr.length){
                var callback = function(){
                    var _td = tr.children('td.table-cell').eq(index);
                    var input = _td.find('.datagrid-input');
                    if(input.length && !input.prop('readonly') && !input.prop('disabled')){
                        input.focus()
                        setTimeout(function(){
                            input.select()
                        })
                    }
                    else if(type === 'prev' && flag){
                        self._horzFocus(e, _td.children(), type, flag)
                    }
                    else{
                        self._verticalFocus(e, _td.children(), type, flag)
                    }
                }
                if(flag || this._callback('VerticalFocusBefore', [e, elem, type, callback]) !== false){
                    callback()
                }
            }
            e.preventDefault();
        },
        _dirFocus:function(e, elem){
            var self = this, keycode = e.keyCode;
            if($.inArray(keycode, self._keyCode) !== -1){
                switch(keycode){
                    case 37:
                        self._horzFocus(e, elem, 'prev')
                        break;
                    case 38:
                        self._verticalFocus(e, elem, 'prev')
                        break;
                    case 39:
                        self._horzFocus(e, elem, 'next')
                        break;
                    case 40:
                        self._verticalFocus(e, elem, 'next')
                        break;
                    default:
                        self._horzFocus(e, elem, 'next', true)
                }
            }
        },
        _events:{
            'click .table-tbody .table-row':'_getRowData _active',
            'mouseenter .table-tbody .table-row':function(e, elem){
                var index = elem.attr('row-index');
                Nui.each(this._rowElems, function(v){
                    v[index].addClass('s-hover')
                })
                this._callback('RowMouseover', [e, elem]);
            },
            'mouseleave .table-tbody .table-row':function(e, elem){
                var index = elem.attr('row-index');
                Nui.each(this._rowElems, function(v){
                    v[index].removeClass('s-hover')
                })
                this._callback('RowMouseout', [e, elem]);
            },
            'dblclick .table-tbody .table-row':'_getRowData _rowdblclick',
            'focus .datagrid-input':'_enable _getRowData _focus',
            'blur .datagrid-input':'_enable _getRowData _blur',
            'focusin .table-tbody .table-cell':'_focusin',
            'focusout .table-tbody .table-cell':'_focusout',
            'click .datagrid-order > b':'_order',
            'keydown .datagrid-input':'_editInput _dirFocus'
        },
        _order:function(e, elem){
            var self = this, opts = self._options;
            elem.toggleClass('s-crt');
            elem.siblings().removeClass('s-crt');
            var parent = elem.parent();
            var field = parent.attr('field');
            var value = parent.children('b.s-crt').attr('value');
            var query = this.paging.condition;
            if(this.paging){
                query[field] = value;
                if(typeof opts.filterQuery === 'function'){
                    this.paging.condition = opts.filterQuery.call(opts, self, query, field) || query
                }
                this.paging.query(true)
            }
        },
        _enable:function(e, elem){
            if(elem.prop('readonly') || elem.prop('disabled')){
                e.stopPropagation();
                return false
            }
        },
        _active:function(e, elem, data){
            var self = this;
            if(self._callback('RowClick', [e, elem, data]) === false){
                self.cancelActive();
                return
            }
            if(self._options.isActive === true){
                self.cancelActive();
                self._activeIndex = elem.attr('row-index');
                self._activeElem = elem;
                Nui.each(self._rowElems, function(v){
                    v[self._activeIndex] && v[self._activeIndex].addClass('s-crt')
                })
                self._callback('Active', [e, elem, data]);
            }
        },
        _getRowData:function(e, elem){
            if(elem.hasClass('table-row')){
                return elem.data()
            }
            return elem.closest('.table-row').data()
        },
        _focus:function(e, elem, data){
            this._active(e, elem.closest('.table-row'), data)
            return this._callback('Focus', arguments)
        },
        _blur:function(e, elem, data){
            return this._callback('Blur', arguments)
        },
        _focusin:function(e, elem){
            elem.addClass('s-focus');
            return this._callback('Focusin', arguments)
        },
        _focusout:function(e, elem){
            elem.removeClass('s-focus');
            return this._callback('Focusout', arguments)
        },
        _rowdblclick:function(e, elem, data){
            return this._callback('RowDblclick', arguments)
        },
        _scroll:function(elem){
            var self = this;
            var scrollTop = elem.scrollTop();
            var scrollLeft = elem.scrollLeft();
            self._tableFixedBox.scrollTop(scrollTop);
            self._tableAllThead.scrollLeft(scrollLeft);
        },
        _resetIndex:function(nexts, index, callback){
            var opts = this._options;
            Nui.each(nexts, function(v, k){
                if(v && v.length){
                    Nui.each(v, function(elem, i){
                        var rowIndex = elem.attr('row-index');
                        var newIndex = index + 1 + i;
                        elem.removeClass('table-row-' + rowIndex).attr('row-index', newIndex).addClass('table-row-' + newIndex);
                        if(typeof callback === 'function'){
                            callback.call(opts, elem, newIndex, k)
                        }
                    })
                }
            })
        },
        resize:function(){
            this._theadHeight();
            this._resetSize();
        },
        scrollTo:function(x, y){
            var elem = this._tableAllBox;
            elem.scrollTop(y||0);
            elem.scrollLeft(x||0);
        },
        cancelActive:function(){
            var self = this;
            if(self._options.isActive === true && self._activeElem){
                Nui.each(self._rowElems, function(v){
                    if(v[self._activeIndex]){
                        v[self._activeIndex].removeClass('s-crt')
                    }
                })
                delete self._activeIndex;
                delete self._activeElem;
            }
        },
        checkedData:function(field){
            var self = this;
            var data = [];
            self._tableAllBox.find('.datagrid-checkbox-choose:checked').each(function(){
                var _data = $(this).closest('.table-row').data();
                if(field){
                    data.push(_data[field]);
                }
                else{
                    data.push(_data);
                }
            })
            return data;
        },
        //新增行
        insert:function(data, index, callback){
            var self = this, opts = self._options;
            if(self.list && data && typeof data === 'object'){

                if(typeof index === 'function'){
                    callback = index;
                    index = undefined
                }

                var len = self.list.length, rowElems = self._rowElems, _index, nexts = {};

                if(index < 0){
                    _index = 0
                }
                else if(index >= len || index === undefined){
                    _index = len
                }
                else{
                    _index = (index|0) + 1
                }
                Nui.each([].concat(data), function(_data, i){
                    index = _index + i
                    self._renderRow(index, [_data], function(v, k, $elem){
                        var $tbody;
                        if(!rowElems[k]){
                            $tbody = self.element.find('.datagrid-table-'+k+' .datagrid-tbody');
                            rowElems[k] = []
                        }
                        if(index === 0){
                            if($tbody){
                                $elem = $elem.prependTo($tbody);
                            }
                            else{
                                $elem = $elem.insertBefore(rowElems[k][index])
                            }
                            nexts[k] = rowElems[k].slice(0);
                            self.list.unshift(_data)
                            rowElems[k].unshift($elem)
                        }
                        else if(index === self.list.length){
                            if($tbody){
                                $elem = $elem.appendTo($tbody);
                            }
                            else{
                                $elem = $elem.insertAfter(rowElems[k][index-1])
                            }
                            self.list.push(_data)
                            rowElems[k].push($elem)
                        }
                        else{
                            $elem = $elem.insertAfter(rowElems[k][index-1])
                            self.list = self.list.slice(0, index).concat(_data, self.list.slice(index))
                            rowElems[k] = rowElems[k].slice(0, index).concat($elem, nexts[k] = rowElems[k].slice(index))
                        }
                        $elem.find('.datagrid-checkbox').checkradio(self._checkradio())
                    })
                })

                self._resetIndex(nexts, index, callback);
                self._callback('Insert');
                self._resetSize()
            }
        },
        //删除行
        remove:function(index, callback){
            var self = this, list = self.list, rowElems = self._rowElems;
            if(typeof index === 'function'){
                callback = index;
                index = undefined
            }
            if(list.length){
                if(index === undefined){
                    Nui.each(rowElems, function(v, i){
                        Nui.each(v, function($elem){
                            $elem.remove()
                        })
                        delete rowElems[i]
                    })
                    self.list = []
                }
                else{
                    var indexs = [], temp = {}, newList = [], nexts = {};
                    Nui.each([].concat(index), function(v){
                        var _index = parseInt(v);
                        if(!isNaN(_index) && _index >= 0 && !temp[_index]){
                            temp[_index] = true
                            indexs.push(_index)
                        }
                    })
                    if(indexs.length){
                        Nui.each(indexs.sort(), function(i){
                            if(list[i]){
                                Nui.each(rowElems, function(v){
                                    if(v[i]){
                                        v[i].remove()
                                        delete v[i]
                                    }
                                })
                                delete list[i]
                            }
                        })
                        Nui.each(list, function(v){
                            if(v){
                                newList.push(v)
                            }
                        })
                        Nui.each(rowElems, function(v, i){
                            var elems = [];
                            Nui.each(v, function($elem){
                                if($elem){
                                    elems.push($elem)
                                }
                            })
                            if(elems.length){
                                rowElems[i] = elems
                            }
                            else{
                                delete rowElems[i]
                            }
                            nexts[i] = elems.slice(indexs[0])
                        })
                        self.list = newList;
                        self._resetIndex(nexts, indexs[0]-1, callback);
                    }
                }
                self._callback('Remove');
                self._resetSize()
            }
        },
        //更新行
        update:function(index, data, callback){
            var self = this, _data = self.list[index];
            if(_data){
                if(typeof data === 'function'){
                    callback = data;
                    data = undefined
                }
                if(data && typeof data === 'object'){
                    Nui.each(data, function(v, i){
                        _data[i] = v
                    })
                }
                var self = this, opts = self._options, tpl = '';
                Nui.each(self._cols, function(v, k){
                    if(v.length && self._rowElems[k]){
                        var $row = self._rowElems[k][index];
                        var checked = $row.find('.datagrid-checkbox').prop('checked') || false;
                        if(typeof opts.colRender === 'function'){
                            tpl = opts.colRender.call(opts, self, _data, v, k)
                        }
                        else{
                            tpl = self._tpl2html('cols', {
                                cols:v,
                                $index:index,
                                $value:_data,
                                checked:false
                            })
                        }
                        $row.html(tpl)
                            .find('.datagrid-checkbox')
                                .prop('checked', checked).checkradio(self._checkradio());

                        if(typeof callback === 'function'){
                            callback.call(opts, $row, index, k)
                        }
                    }
                })
                self._callback('Update');
                self._resetSize()
            }
        }
    })
})

__define('./script/demo',function(require,imports,renders,extend,exports){
	var module=this;
	var template = require('src/core/template');
	var datagrid = require('src/components/datagrid');
	
	imports('../style/page.less');
	
	var a = datagrid({
	    container:'#data',
	    paging:{
	        url:'http://127.0.0.1:8001/data/',
	        pCount:20
	    },
	    width:'110%',
	    columns:[{
	        title:'名称',
	        width:100,
	        field:'buname'
	    }, {
	        title:'名称',
	        width:100,
	        field:'buname1'
	    }, {
	        title:'名称',
	        width:200,
	        field:'buname',
	        children:[{
	            title:'名称',
	            width:100,
	            field:'buname'
	        }, {
	            title:'名称',
	            width:100,
	            field:'buname'
	        }]
	    }, {
	        title:'名称',
	        width:100,
	        field:'buname',
	        children:[{
	            title:'名称',
	            width:100,
	            field:'buname'
	        }]
	    }, {
	        title:'名称',
	        width:100,
	        field:'buname'
	    }],
	    rowRender:function(self, list, v, k){
	        return template.render(renders(''+''
	            +'<%each list%>'+''
	                +'<tr class="table-row">'+''
	                    +'<%each cols col%>'+''
	                    +'<td class="table-cell" width="<%col.width%>">'+''
	                    
	                    +'</td>'+''
	                    +'<%/each%>'+''
	                +'</tr>'+''
	            +'<%/each%>'+''
	        +''), {
	            cols:v,
	            list:list
	        })
	    }
	})
	
	$('h1').click(function(){
	    a.option('isBorder', true)
	})
});

})(Nui['_module_2_define']);
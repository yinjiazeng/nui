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

__define('lib/core/util',{
    
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

__define('pages/components/suggest/script/style',function(require,imports,renders,extend,exports){
	var module=this;
	imports('../style/base.less');
});
__define('pages/components/suggest/script/data',function(require,imports,renders,extend,exports){
	var module=this;
	imports('../style/data.less');
	
	return [{"isvoucher":"0","isclean":"0","id":"1","cid":"19","buname":"\u5357\u5c4f\u516c\u9986","buname_record":"","buname_py":"npgg","buname_pinyin":"nanpinggongguan","bulogo":"http:\/\/img2.haoju.cn\/upfiles\/200909\/1252461832.jpg!v6","build_logo":"","areacode":"340104000900671390000000000000000000","areacode_str":"\u5b89\u5fbd \u5408\u80a5\u5e02 \u8700\u5c71\u533a \u5408\u4f5c\u5316\u8def","lng":"0","lat":"0","school":"","buaddress":"\u5408\u80a5\u5e02\u671b\u6c5f\u897f\u8def159\u53f7\uff08\u4e1c\u81f3\u8def\u53e3\uff09","saletel":"0551\u20145167859","saleaddress":"\u5408\u80a5\u5e02\u671b\u6c5f\u897f\u8def159\u53f7\uff08\u4e1c\u81f3\u8def\u53e3\uff09","certificate":"","property":"","bucategory":"","butype":"01001","lastest_news":"","firstpay":"0","firstpay_process":"\u8ba1\u7b97\u8fc7\u7a0b\uff1a0(\u5747\u4ef7) X 83.37(\u6700\u5c0f\u6237\u578b\u9762\u79ef) X 0.3 = 0\u5143","aveprice":"0","change":"0","price_updatetime":"0","deal_aveprice":"0","youhui_type":"","lastest_youhui":"","lastest_kaipan":"1227628800","lastest_kaipan_str":"","salestatus":"5","bulable":"","baseinfo":"","tel_400":"40086597771101","seo_title":"","seo_keywords":"","seo_description":"","level":"D","sort":"0","ifcheck":"1","intime":"1249113715000","restime":"1368163899000","hits":"97176","isdel":"0","sale_huxing":"","bulogo_small":"http:\/\/img3.haoju.cn\/upfiles\/200909\/1252461832.jpg!small","bulogo_mid":"http:\/\/img3.haoju.cn\/upfiles\/200909\/1252461832.jpg!mid","bulogo_lar":"http:\/\/img1.haoju.cn\/upfiles\/200909\/1252461832.jpg!lar","bulogo_thumb":"http:\/\/img1.haoju.cn\/upfiles\/200909\/1252461832.jpg!thumb"},{"isvoucher":"0","isclean":"0","id":"2","cid":"20","buname":"\u9752\u5e74\u8d22\u667a\u5e7f\u573a","buname_record":"","buname_py":"qnczgc","buname_pinyin":"qingniancaizhiguangchang","bulogo":false,"build_logo":"","areacode":"340135000000000000000000000000000000","areacode_str":"\u5b89\u5fbd \u5408\u80a5\u5e02 \u65b0\u7ad9\u533a","lng":"0","lat":"0","school":"","buaddress":"\u5317\u4e8c\u73af\uff08\u53cc\u4e03\u8def\uff09\u4e0e\u9f99\u95e8\u5cad\u8def\u4ea4\u6c47\u5904","saletel":"0551-7102666\u30017103666","saleaddress":"\u5317\u4e8c\u73af\uff08\u53cc\u4e03\u8def\uff09\u4e0e\u9f99\u95e8\u5cad\u8def\u4ea4\u6c47\u5904","certificate":"","property":"","bucategory":"","butype":"01002","lastest_news":"\u521b\u65b0SOLO\u5c0f\u6237\u578b\u516c\u5bd3\u60ca\u8273\u767b\u573a","firstpay":"0","firstpay_process":"\u8ba1\u7b97\u8fc7\u7a0b\uff1a0(\u5747\u4ef7) X (\u6700\u5c0f\u6237\u578b\u9762\u79ef) X 0.3 = 0\u5143","aveprice":"0","change":"0","price_updatetime":"0","deal_aveprice":"0","youhui_type":"","lastest_youhui":"","lastest_kaipan":"0","lastest_kaipan_str":"","salestatus":"5","bulable":"","baseinfo":"","tel_400":"40086597771103","seo_title":"","seo_keywords":"","seo_description":"","level":"D","sort":"0","ifcheck":"1","intime":"1249113715000","restime":"1359604756000","hits":"11121","isdel":"0","sale_huxing":"","bulogo_small":false,"bulogo_mid":false,"bulogo_lar":false,"bulogo_thumb":false},{"isvoucher":"0","isclean":"0","id":"3","cid":"21","buname":"\u7eff\u5885\u79d1\u6e90","buname_record":"","buname_py":"lsky","buname_pinyin":"lvshukeyuan","bulogo":"http:\/\/img3.haoju.cn\/upfiles\/200909\/1252461988.jpg!v6","build_logo":"","areacode":"","areacode_str":"","lng":"0","lat":"0","school":"","buaddress":"\u519c\u79d1\u9662\u5185","saletel":"","saleaddress":"\u672a\u5b9a","certificate":"","property":"","bucategory":"","butype":"01001","lastest_news":"","firstpay":"0","firstpay_process":"\u8ba1\u7b97\u8fc7\u7a0b\uff1a0(\u5747\u4ef7) X (\u6700\u5c0f\u6237\u578b\u9762\u79ef) X 0.3 = 0\u5143","aveprice":"0","change":"0","price_updatetime":"0","deal_aveprice":"0","youhui_type":"","lastest_youhui":"","lastest_kaipan":"0","lastest_kaipan_str":"","salestatus":"5","bulable":"","baseinfo":"","tel_400":"40086597771105","seo_title":"","seo_keywords":"","seo_description":"","level":"","sort":"0","ifcheck":"2","intime":"1249113715000","restime":"1353047200000","hits":"25138","isdel":"0","sale_huxing":"","bulogo_small":"http:\/\/img2.haoju.cn\/upfiles\/200909\/1252461988.jpg!small","bulogo_mid":"http:\/\/img1.haoju.cn\/upfiles\/200909\/1252461988.jpg!mid","bulogo_lar":"http:\/\/img1.haoju.cn\/upfiles\/200909\/1252461988.jpg!lar","bulogo_thumb":"http:\/\/img3.haoju.cn\/upfiles\/200909\/1252461988.jpg!thumb"},{"isvoucher":"0","isclean":"0","id":"4","cid":"22","buname":"\u5149\u5f69\u5e7f\u573a","buname_record":"","buname_py":"gcgc","buname_pinyin":"guangcaiguangchang","bulogo":false,"build_logo":"","areacode":"","areacode_str":"","lng":"0","lat":"0","school":"","buaddress":"\u957f\u6c5f\u897f\u8def699\u53f7","saletel":"","saleaddress":"\u957f\u6c5f\u897f\u8def\u901a\u673a\u6240\uff08\u91d1\u6fe0\u5e7f\u573a\uff09","certificate":"0","property":"","bucategory":"","butype":"01006","lastest_news":"","firstpay":"0","firstpay_process":"\u8ba1\u7b97\u8fc7\u7a0b\uff1a0(\u5747\u4ef7) X (\u6700\u5c0f\u6237\u578b\u9762\u79ef) X 0.3 = 0\u5143","aveprice":"0","change":"0","price_updatetime":"0","deal_aveprice":"0","youhui_type":"","lastest_youhui":"","lastest_kaipan":"0","lastest_kaipan_str":"","salestatus":"5","bulable":"","baseinfo":"","tel_400":"40086597771106","seo_title":"","seo_keywords":"","seo_description":"","level":"","sort":"0","ifcheck":"2","intime":"1249113715000","restime":"1351565568000","hits":"36985","isdel":"0","sale_huxing":"","bulogo_small":false,"bulogo_mid":false,"bulogo_lar":false,"bulogo_thumb":false},{"isvoucher":"0","isclean":"0","id":"5","cid":"23","buname":"\u7199\u56ed","buname_record":"","buname_py":"xy","buname_pinyin":"xiyuan","bulogo":"http:\/\/img1.haoju.cn\/upfiles\/200909\/1252634522.jpg!v6","build_logo":"","areacode":"","areacode_str":"","lng":"0","lat":"0","school":"","buaddress":" ","saletel":"0551-3868333\u30013868222","saleaddress":" ","certificate":"0","property":"","bucategory":"","butype":"01001","lastest_news":"","firstpay":"0","firstpay_process":"\u8ba1\u7b97\u8fc7\u7a0b\uff1a0(\u5747\u4ef7) X (\u6700\u5c0f\u6237\u578b\u9762\u79ef) X 0.3 = 0\u5143","aveprice":"0","change":"0","price_updatetime":"0","deal_aveprice":"0","youhui_type":"","lastest_youhui":"","lastest_kaipan":"0","lastest_kaipan_str":"","salestatus":"1","bulable":"","baseinfo":"","tel_400":"40086597771107","seo_title":"","seo_keywords":"","seo_description":"","level":"D","sort":"0","ifcheck":"2","intime":"1249113715000","restime":"1249958109000","hits":"24858","isdel":"0","sale_huxing":"","bulogo_small":"http:\/\/img1.haoju.cn\/upfiles\/200909\/1252634522.jpg!small","bulogo_mid":"http:\/\/img1.haoju.cn\/upfiles\/200909\/1252634522.jpg!mid","bulogo_lar":"http:\/\/img1.haoju.cn\/upfiles\/200909\/1252634522.jpg!lar","bulogo_thumb":"http:\/\/img3.haoju.cn\/upfiles\/200909\/1252634522.jpg!thumb"},{"isvoucher":"0","isclean":"0","id":"6","cid":"24","buname":"\u4f18\u6d3b\u516c\u5bd3","buname_record":"","buname_py":"yhgy","buname_pinyin":"youhuogongyu","bulogo":"http:\/\/img3.haoju.cn\/upfiles\/201212\/1354520471.jpg!v6","build_logo":"","areacode":"340132000900670983000000000000000000","areacode_str":"\u5b89\u5fbd \u5408\u80a5\u5e02 \u9ad8\u65b0\u533a \u5408\u5bb6\u798f","lng":"0","lat":"0","school":"","buaddress":"\u957f\u6c5f\u897f\u8def699\u53f7","saletel":"0551-5355999","saleaddress":"\u957f\u6c5f\u897f\u8def\u901a\u673a\u6240\uff08\u91d1\u6fe0\u5e7f\u573a\uff09","certificate":"\u5408\u80a5\u5e02\u9ad8\u65b0\u533a","property":"","bucategory":"","butype":"01001","lastest_news":"\u73ed\u8f66\u4e8e9\u670822\u53f7\u5168\u9762\u8fd0\u8425","firstpay":"65344","firstpay_process":"\u8ba1\u7b97\u8fc7\u7a0b\uff1a6500(\u5747\u4ef7) X 33.51(\u6700\u5c0f\u6237\u578b\u9762\u79ef) X 0.3 = 65344.5\u5143","aveprice":"6500","change":"0","price_updatetime":"0","deal_aveprice":"0","youhui_type":"","lastest_youhui":"","lastest_kaipan":"0","lastest_kaipan_str":"","salestatus":"5","bulable":"","baseinfo":"","tel_400":"40086597771108","seo_title":"","seo_keywords":"","seo_description":"","level":"D","sort":"0","ifcheck":"1","intime":"1249113715000","restime":"1359604783000","hits":"79273","isdel":"0","sale_huxing":"","bulogo_small":"http:\/\/img1.haoju.cn\/upfiles\/201212\/1354520471.jpg!small","bulogo_mid":"http:\/\/img2.haoju.cn\/upfiles\/201212\/1354520471.jpg!mid","bulogo_lar":"http:\/\/img1.haoju.cn\/upfiles\/201212\/1354520471.jpg!lar","bulogo_thumb":"http:\/\/img1.haoju.cn\/upfiles\/201212\/1354520471.jpg!thumb"},{"isvoucher":"0","isclean":"0","id":"7","cid":"25","buname":"\u4e07\u8fbe\u516c\u9986","buname_record":"","buname_py":"wdgg","buname_pinyin":"wandagongguan","bulogo":"http:\/\/img3.haoju.cn\/upfiles\/201211\/1354263812.jpg!v6","build_logo":"","areacode":"340111000900670943000000000000000000","areacode_str":"\u5b89\u5fbd \u5408\u80a5\u5e02 \u5305\u6cb3\u533a \u5927\u949f\u697c","lng":"0","lat":"0","school":"","buaddress":"\u5408\u80a5\u9a6c\u978d\u5c71\u8def\u548c\u829c\u6e56\u8def\u4ea4\u6c47\u5904","saletel":"0551-5176666\uff0c5368888","saleaddress":"\u829c\u6e56\u8def\u4e0e\u9a6c\u978d\u5c71\u8def\u4ea4\u6c47\u5904","certificate":"\u5408\u80a5","property":"","bucategory":"","butype":"01002","lastest_news":"1,3#\u697c\u9ad8\u5c4250-150\u33a1\u6237\u578b2.6\u5f00\u76d8","firstpay":"0","firstpay_process":"\u8ba1\u7b97\u8fc7\u7a0b\uff1a14000(\u5747\u4ef7) X (\u6700\u5c0f\u6237\u578b\u9762\u79ef) X 0.3 = 0\u5143","aveprice":"14000","change":"167","price_updatetime":"0","deal_aveprice":"0","youhui_type":"","lastest_youhui":"","lastest_kaipan":"0","lastest_kaipan_str":"","salestatus":"5","bulable":"","baseinfo":"","tel_400":"40086597771109","seo_title":"","seo_keywords":"","seo_description":"","level":"D","sort":"0","ifcheck":"1","intime":"1249113715000","restime":"1359784697000","hits":"25879","isdel":"0","sale_huxing":"","bulogo_small":"http:\/\/img2.haoju.cn\/upfiles\/201211\/1354263812.jpg!small","bulogo_mid":"http:\/\/img3.haoju.cn\/upfiles\/201211\/1354263812.jpg!mid","bulogo_lar":"http:\/\/img1.haoju.cn\/upfiles\/201211\/1354263812.jpg!lar","bulogo_thumb":"http:\/\/img2.haoju.cn\/upfiles\/201211\/1354263812.jpg!thumb"},{"isvoucher":"0","isclean":"0","id":"8","cid":"26","buname":"\u91d1\u5ea7\u5609\u56ed","buname_record":"","buname_py":"jzjy","buname_pinyin":"jinzuojiayuan","bulogo":"http:\/\/img1.haoju.cn\/upfiles\/200905\/200711915738705.jpg!v6","build_logo":"","areacode":"340102000000000000000000000000000000","areacode_str":"\u5b89\u5fbd \u5408\u80a5\u5e02 \u7476\u6d77\u533a","lng":"0","lat":"0","school":"","buaddress":"\u7476\u6d77\u516c\u56ed\u659c\u5bf9\u9762","saletel":"0551-4280777\u30014287777","saleaddress":"\u7476\u6d77\u516c\u56ed\u659c\u5bf9\u9762","certificate":"0","property":"","bucategory":"","butype":"01007","lastest_news":"","firstpay":"0","firstpay_process":"\u8ba1\u7b97\u8fc7\u7a0b\uff1a6200(\u5747\u4ef7) X (\u6700\u5c0f\u6237\u578b\u9762\u79ef) X 0.3 = 0\u5143","aveprice":"6200","change":"0","price_updatetime":"0","deal_aveprice":"0","youhui_type":"","lastest_youhui":"","lastest_kaipan":"1206979200","lastest_kaipan_str":"","salestatus":"5","bulable":"","baseinfo":"","tel_400":"40086597771110","seo_title":"","seo_keywords":"","seo_description":"","level":"D","sort":"0","ifcheck":"1","intime":"1249113715000","restime":"1359604854000","hits":"96770","isdel":"0","sale_huxing":"","bulogo_small":"http:\/\/img3.haoju.cn\/upfiles\/200905\/200711915738705.jpg!small","bulogo_mid":"http:\/\/img2.haoju.cn\/upfiles\/200905\/200711915738705.jpg!mid","bulogo_lar":"http:\/\/img1.haoju.cn\/upfiles\/200905\/200711915738705.jpg!lar","bulogo_thumb":"http:\/\/img1.haoju.cn\/upfiles\/200905\/200711915738705.jpg!thumb"},{"isvoucher":"0","isclean":"0","id":"9","cid":"27","buname":"\u7f8e\u5730\u9633\u5149\u5927\u53a6","buname_record":"","buname_py":"mdygdx","buname_pinyin":"meidiyangguangdaxia","bulogo":false,"build_logo":"","areacode":"","areacode_str":"","lng":"0","lat":"0","school":"","buaddress":"\u8700\u5c71\u533a\u91d1\u5be8\u8def\uff17\uff11\u53f7","saletel":"","saleaddress":"\u8700\u5c71\u533a\u91d1\u5be8\u8def\uff17\uff11\u53f7","certificate":"0","property":"","bucategory":"","butype":"01006","lastest_news":"","firstpay":"0","firstpay_process":"\u8ba1\u7b97\u8fc7\u7a0b\uff1a0(\u5747\u4ef7) X (\u6700\u5c0f\u6237\u578b\u9762\u79ef) X 0.3 = 0\u5143","aveprice":"0","change":"0","price_updatetime":"0","deal_aveprice":"0","youhui_type":"","lastest_youhui":"","lastest_kaipan":"0","lastest_kaipan_str":"","salestatus":"5","bulable":"","baseinfo":"","tel_400":"40086597771112","seo_title":"","seo_keywords":"","seo_description":"","level":"","sort":"0","ifcheck":"2","intime":"1249113715000","restime":"1351566276000","hits":"2321","isdel":"0","sale_huxing":"","bulogo_small":false,"bulogo_mid":false,"bulogo_lar":false,"bulogo_thumb":false},{"isvoucher":"0","isclean":"0","id":"11","cid":"29","buname":"\u84dd\u9f0e\u68e0\u6eaa\u4eba\u5bb6","buname_record":"","buname_py":"ldtxrj","buname_pinyin":"landingtangxirenjia","bulogo":"http:\/\/img1.haoju.cn\/upfiles\/201211\/1354092753.jpg!v6","build_logo":"","areacode":"340134000900671372000000000000000000","areacode_str":"\u5b89\u5fbd \u5408\u80a5\u5e02 \u6ee8\u6e56\u65b0\u533a \u897f\u85cf\u8def","lng":"0","lat":"0","school":"\u897f\u56ed\u5c0f\u5b66\u300150\u4e2d\u5357\u533a\u897f\u56ed\u5c0f\u5b66\u300150\u4e2d\u5357\u533a","buaddress":"\u6ee8\u6e56\u65b0\u533a\u897f\u85cf\u8def\u4e0e\u4e2d\u5c71\u8def\u4ea4\u53e3","saletel":"0551-2888588","saleaddress":"\u6ee8\u6e56\u65b0\u533a\u897f\u85cf\u8def\u4e0e\u4e2d\u5c71\u8def\u4ea4\u53e3","certificate":"\u5408\u80a5\u5e02 \u6ee8\u6e56","property":"40\u5e74","bucategory":"","butype":"01003","lastest_news":"\u73b0\u5728\u53ea\u6709235-368\u5e73\u7c73\u7684\u6237\u578b\u4e86\u3002","firstpay":"0","firstpay_process":"\u8ba1\u7b97\u8fc7\u7a0b\uff1a28000(\u5747\u4ef7) X (\u6700\u5c0f\u6237\u578b\u9762\u79ef) X 0.3 = 0\u5143","aveprice":"28000","change":"120","price_updatetime":"0","deal_aveprice":"0","youhui_type":"1","lastest_youhui":"\u84dd\u9f0e\u6ee8\u6e56\u5047\u65e5\u4f4f\u5b85\u5546\u94fa\u4eab\u5168\u6b3e95\u6298\u6309\u63ed98\u6298\u4f18\u60e0","lastest_kaipan":"1290614400","lastest_kaipan_str":"2013\u5e7410\u6708\u6708\u5e95","salestatus":"5","bulable":"","baseinfo":"","tel_400":"40086597771115","seo_title":"","seo_keywords":"","seo_description":"","level":"D","sort":"0","ifcheck":"1","intime":"1249113715000","restime":"1368165618000","hits":"106708","isdel":"0","sale_huxing":"","bulogo_small":"http:\/\/img1.haoju.cn\/upfiles\/201211\/1354092753.jpg!small","bulogo_mid":"http:\/\/img2.haoju.cn\/upfiles\/201211\/1354092753.jpg!mid","bulogo_lar":"http:\/\/img1.haoju.cn\/upfiles\/201211\/1354092753.jpg!lar","bulogo_thumb":"http:\/\/img3.haoju.cn\/upfiles\/201211\/1354092753.jpg!thumb"}]
});
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
        _jquery:function(elem){
            if(!elem){
                return
            }
            if(elem instanceof jQuery){
                return elem
            }
            return jQuery(elem)
        },
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
        _getTarget:function(){
            var self = this;
            if(!self.target){
                var target = self._options.target;
                var _class = self.constructor;
                target = _class._jquery(target);
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
                selector = self.constructor._jquery(selector)
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
 * @author Aniu[2017-12-23 16:50]
 * @update Aniu[2017-12-23 16:50]
 * @version 1.0.1
 * @description 搜索下拉
 */

__define('lib/components/suggest',['lib/core/component', 'lib/core/util'], function(component, util){
    this.imports('../style/components/suggest/index');
    return this.extend(component, {
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
             * @func 定义顶部模版
             * @type <String>
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @return <String> 返回顶部模版
             */
            head:'',
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
            limit:5,
            /**
             * @func 设置高宽
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
                 * @func 是否多选
                 * @type <Boolean>
                 */
                multiple:false,
                /**
                 * @func 标签填充容器
                 * @type <Object>
                 */
                container:null,
                /**
                 * @func 关闭按钮内容
                 * @type <String>
                 */
                close:'',
                /**
                 * @func 设置标签数据
                 * @type <Function>
                 */
                data:null
            },
            /**
             * @func 设置多菜单
             * @type <Array>
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
             *          return data.indexOf(value)
             *     }
             * }]
             */
            match:null,
            /**
             * @func 自定义选中项目后的文本框内容
             * @type <Function>
             * @param self <Object> 组件实例对象
             * @param data <Object> 当前选中数据
             * @return <String> 返回自定义填充值
             * @desc 未设置该值时，默认取field中的数据
             */
            value:null,
            active:null,
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
             * @return <Boolean> 返回false则不会触发onSelect
             */
            onSelectBefore:null,
            /**
             * @func 选择后触发回调
             * @type <Function>
             * @param self <Object> 组件实例对象
             */
            onSelect:null,
            /**
             * @func 输入框失焦后触发
             * @type <Function>
             * @param self <Object> 组件实例对象
             */
            onBlur:null
        },
        _caches:{},
        queryData:[],
        data:[],
        _template:{
            wrap:
                '<div class="<% className %>"<%if style%> style="<%include \'style\'%>"<%/if%>>'+
                    '<%include "head"%>'+
                    '<div class="suggest-body">'+
                        '<%include "tabs"%>'+
                        '<div class="suggest-inner">'+
                            '<%each tabs%>'+
                                '<div class="suggest-content<%if $index === 0%> suggest-result<%/if%>" style="display:none;"></div>'+
                            '<%/each%>'+
                        '</div>'+
                    '</div>'+
                    '<%include "foot"%>'+
                '</div>',
            result:
                '<%if data && data.length%>'+
                    '<%include "list"%>'+
                '<%elseif value%>'+
                    '<%include "empty"%>'+
                '<%/if%>',
            list:
                '<ul class="suggest-list">'+
                    '<%each data $data $index%>'+
                        '<%include "item"%>'+
                    '<%/each%>'+
                '</ul>',
            tabs:
                '<%if tabs.length > 1%>'+
                    '<div class="suggest-tabs">'+
                        '<%each tabs tab%>'+
                            '<span class="suggest-tab"<%if $index === 0%> style="display:none;"<%/if%>><%tab.title%></span>'+
                        '<%/each%>'+
                    '</div>'+
                '<%/if%>',
            tag:
                '<span class="nui-tag">'+
                    '<em class="nui-tag-text"><%text%></em>'+
                    '<%if close%>'+
                    '<b class="nui-tag-close"><%close%></b>'+
                    '<%/if%>'+
                    '<%if fields?? && fields.length%>'+
                        '<%each fields%>'+
                            '<input type="hidden" name="<%$index%>"> value="<%$value%>"'+
                        '<%/each%>'+
                    '<%/if%>'+
                '</span>'
        },
        _events:{
            'mouseenter':'_suggestMouseover',
            'mouseleave':'_suggestMouseout',
            'mouseenter .suggest-item':'_suggestMouseover _itemMouseover',
            'mouseleave .suggest-item':'_itemMouseout',
            'click .suggest-item':'_select',
            'click .suggest-tab':'_toggle'
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
                }
                elem.addClass('s-crt');
                container.show();
                Nui.each(self._elemData, function(v, i){
                    if(i !== index){
                        v.$elem.removeClass('s-crt')
                        v.$container.hide()
                    }
                })
                if(typeof data.onShow === 'function'){
                    data.onShow.call(opts, self, elem, container)
                }
                self._activeTab = data;
            }
        },
        _suggestMouseover:function(e, elem){
            this._hover = true
        },
        _suggestMouseout:function(e, elem){
            delete this._hover;
        },
        _itemMouseover:function(e, elem){
            this._activeItem = elem.addClass('s-hover');
            this._activeIndex = this._activeItem.data('index');
        },
        _itemMouseout:function(e, elem){
            elem.removeClass('s-hover')
        },
        _select:function(e){
            var self = this, opts = self._options, data = self.queryData[self._activeIndex], args = [data, e, this._activeItem], value = '';
            if(self._callback('SelectBefore', args) === false){
                return false
            }

            if(typeof opts.value === 'function'){
                value = opts.value.call(opts, self, data)
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
            self.show(true)
        },
        _filter:function(){
            var self = this, opts = self._options, data = [], _data = self._data();
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
                self._ajax = jQuery.ajax(jQuery.extend(true, {
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
                }, opts.ajax||{}))
            }, 50)
        },
        //按上
        _code38:function(){

        },
        //按下
        _code40:function(){
            
        },
        //回车
        _code13:function(e){
            //this._select(e)
        },
        //删除
        _code8:function(e){
            var self = this;
            //光标位置在输入框起始处时删除末尾的标签
            if(self.$tags && self.$tags.length && !util.getFocusIndex(self.target.get(0))){
                self.$tags.last().remove();
                self._setTagsData();
                self._update();
                self.resize()
            }
        },
        _bindEvent:function(){
            var self = this, opts = self._options;
            self._on('keyup', self.target, function(e, elem){
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
                    self.show(true)
                }
            })

            self._on('click', self.target, function(e, elem){
                if(!self._show){
                    self.target.focus()
                }
            })

            //若失去焦点但是悬停在组件相关的元素上，则不允许失去焦点
            self._on('blur', self.target, function(e, elem){
                if(!self._hover){
                    self._callback('Blur', [elem])
                    self.hide()
                }
                else{
                    elem.focus()
                }
            })

            if(opts.focus === true){
                self._on('focus', self.target, function(e, elem){
                    self.show()
                })
            }

            self._on('keyup', self.target, function(e, elem){
                if(self._show === true){
                    var method = self['_code'+e.keyCode];
                    if(typeof method === 'function'){
                        method.call(self, e);
                        e.stopPropagation()
                    }
                }
            })

            if(self.$tagContainer){
                self._on('mouseover', self.$tagContainer, '.nui-tag', function(){
                    if(self._show){
                        self._hover = true
                    }
                })
                self._on('mouseout', self.$tagContainer, '.nui-tag', function(){
                    delete self._hover
                })
                self._on('click', self.$tagContainer, '.nui-tag-close', function(e, elem){
                    elem.closest('.nui-tag').remove();
                    self._setTagsData();
                    delete self._hover;
                    if(!self._show){
                        self.target.focus()
                    }
                    else{
                        self._update();
                        self.resize()
                    }
                })
            }
        },
        _create:function(){
            var self = this, data = self._tplData(), opts = self._options;
            data.style = opts.style || {};
            data.style.display = 'none';
            self._elemData = [{
                title:'结果'
            }];
            self._isTab = false;
            self._defaultTab = null;
            if(Nui.isArray(opts.tabs) && opts.tabs.length){
                self._isTab = true;
                self._elemData = self._elemData.concat(opts.tabs);
            }
            data.tabs = self._elemData;
            self.element = $(self._tpl2html('wrap', data)).appendTo(self.$container);
            self.$body = self.element.children();
            self.$inner = self.$body.children('.suggest-inner');
            self.$result = self.$inner.children('.suggest-result');

            self._elemData[0].$elem = $();
            self._elemData[0].$container = self.$result;
            
            if(self._isTab){
                var tabs = self.$body.children('.suggest-tabs').children();
                var containers = self.$inner.children();
                Nui.each(self._elemData, function(v, i){
                    v.$elem = tabs.eq(i);
                    v.$container = containers.eq(i);
                    if(!self._defaultTab && v.select === true){
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

            if(typeof content !== 'string'){
                if(name === 'item' && opts.field){
                    content = '<li class="suggest-item<%active($data)%>" data-index="<%$index%>"><%$data["'+ opts.field +'"]??%></li>'
                }
                else{
                    content = ''
                }
            }
            else if(name === 'item' && content && !/^\s*\<li\s+/i.test(content)){
                content = '<li class="suggest-item<%active($data)%>" data-index="<%$index%>">'+ content +'</li>'
            }

            if(name !== 'item' && content){
                content = '<div class="suggest-'+ name +'">'+ content +'</div>'
            }

            self._template[name] = content;
        },
        _data:function(){
            var self = this, opts = self._options, data = opts.data;
            if(typeof opts.data === 'function'){
                data = opts.data.call(opts, self)
            }

            if(!Nui.type(data, 'Array')){
                data = []
            }

            return self.data = data
        },
        _initData:function(){
            var self = this, opts = self._options, data = opts.data, match = opts.match;

            Nui.each(['item', 'empty', 'head', 'foot'], function(name){
                self._initTemplate(name);
            })

            if(match && Nui.type(match, 'Object')){
                match = [match]
            }

            if(Nui.type(match, 'Array')){
                self._matchs = match
            }
        },
        _setTagsData:function(){
            var self = this, opts = self._options;
            self.$tags = self.$tagContainer.children();
            self.tagData = [];
            if(typeof self._tag.data === 'function'){
                self.tagData = self._tag.data.call(opts, self, self.$tags)
            }
            else{
                self.$tags.each(function(){
                    self.tagData.push($(this).children('.nui-tag-text').text())
                })
            }
            if(!Nui.type(self.tagData, 'Array')){
                self.tagData = []
            }
        },
        _getActive:function(){
            var self = this, opts = self._options;
            var active = function(){
                return '';
            }
            if(typeof opts.active === 'function'){
                active = function(data){
                    if(opts.active.call(opts, self, data) === true){
                        return ' s-crt'
                    }
                    return ''
                }
            }
            else if(opts.field){
                active = function(data){
                    var cls = '';
                    if(self.tagData){
                        Nui.each(self.tagData, function(v){
                            if(data[opts.field] === v){
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
            return active
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
                    active:self._getActive()
                }));
                result.$elem.show();
                if(self._defaultTab){
                    self._defaultTab.$elem.hide()
                }
                self._toggle(null, result.$elem)
            }
            else if(self._defaultTab){
                self._toggle(null, self._defaultTab.$elem.show())
            }
            self.element.show();
            self._show = true;
            self.resize()
        },
        _exec:function(){
            var self = this, opts = self._options, _class = self.constructor, tagContainer;
            self.$container = _class._jquery(opts.container);
            if(self._getTarget() && (self.$container = _class._jquery(opts.container))){
                self._tag = opts.tag;
                if(typeof self._tag !== 'object'){
                    self._tag = {}
                }
                if(typeof self._tag.container === 'function'){
                    tagContainer = _class._jquery(self._tag.container.call(opts, self, self.target))
                }
                else{
                    tagContainer = _class._jquery(self._tag.container)
                }
                if(self.$tagContainer = tagContainer){
                    self._setTagsData();
                }
                self._initData();
                self._bindEvent();
            }
        },
        _update:function(){
            var self = this, opts = self._options;
            if(self._activeTab && typeof self._activeTab.onShow === 'function'){
                self._activeTab.onShow.call(opts, self, self._activeTab.$elem, self._activeTab.$container)
            }
        },
        resize:function(){
            var self = this, opts = self._options, target = self.target, width = target.outerWidth(), height = target.outerHeight(),
                _offset = opts.offset, offset = target.offset(), top = offset.top, left = offset.left;
            if(!_offset){
                _offset = {}
            }
            top = top + height + (_offset.top||0);
            left = left + (_offset.left||0);
            self.element.css({
                top:top,
                left:left
            })
        },
        show:function(input){
            var self = this, opts = self._options, _class = self.constructor;
            self.val = Nui.trim(this.target.val());
            if(self._hover){
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
                //文本框没内容，还原默认数据
                if(!self.val && opts.nullable === true){
                    if(!opts.url){
                        self.queryData = self._data()
                    }
                    else{
                        self.queryData = []
                    }
                }
                self._render(input);
            }
        },
        hide:function(){
            var self = this, _class = self.constructor;
            delete self._hover;
            delete self._show;
            if(_class._active === self){
                delete _class._active
            }
            if(self.element){
                self.element.hide()
            }
        },
        value:function(val){
            var self = this, target = self.target, opts = self._options, name = self.constructor.__component_name;
            if(target){
                if(typeof val === 'string'){
                    val = Nui.trim(val)
                }
                if(self.$tagContainer && val){
                    var data = {}, exist = false;
                    if(typeof val === 'object'){
                        data = val;
                        if(data.text){
                            data.text = Nui.trim(data.text);
                        }
                    }
                    else{
                        data.text = val
                    }
                    if(opts.tag.multiple === true){
                        self.$tags.each(function(){
                            var $elem = $(this), text = Nui.trim($elem.children('.nui-tag-text').text());
                            if(data.text === text){
                                $elem.remove();
                                exist = true;
                                return false
                            }
                        })
                    }
                    else{
                        self.$tags.remove()
                    }
                    if(!exist && data.text){
                        if(!data.close && self._tag.close){
                            data.close = self._tag.close
                        }
                        self.$tagContainer.append(self._tpl2html('tag', data))
                    }
                    self._setTagsData();
                    self.value('');
                    self._update();
                    self.resize()
                }
                else{
                    var dom = target.get(0), obj;
                    if(dom && dom.nui){
                        Nui.each(dom.nui, function(v, k){
                            if(k !== name && typeof v.value === 'function' && v._setStyle && v._createRules){
                                obj = v;
                                return false
                            }
                        })
                    }
                    if(obj){
                        obj.value(val)
                    }
                    else{
                        target.val(val)
                    }
                }
            }
        }
    })
}); 
__define('./script/page',function(require,imports,renders,extend,exports){
	var module=this;
	require('lib/components/suggest');
	var data=__requireDefaultModule(require('pages/components/suggest/script/data'));
	require('pages/components/suggest/script/style');
	var util=__requireDefaultModule(require('lib/core/util'));
	
	$('.search').suggest({
	    url:'http://127.0.0.1:8001/data/?callback=?',
	    data:data,
	    field:'buname',
	    empty:'<%value%> 暂无数据',
	    selectContainer:'#box',
	    //foot:'<a>aaaaaaaa</a>',
	    nullable:true,
	    //cache:true,
	    focus:true,
	    events:{
	        'click .item':function(e, elem){
	            this.self.value(elem.text())
	        }
	    },
	    tag:{
	        multiple:true,
	        close:'<i class="iconfont">x</i>',
	        container:'#box'
	    },
	    tabs:[{
	        title:'最近',
	        active:true,
	        content:renders(''+''
	            +'<ul>'+''
	                +'<li class="item">南屏公馆</li>'+''
	                +'<li class="item">优活公寓</li>'+''
	            +'</ul>'+''
	        +''),
	        onShow:function(self, elem, container){
	            container.find('li').each(function(){
	                var $elem = $(this).removeClass('s-crt');
	                var text = $elem.text();
	                Nui.each(self.tagData, function(v){
	                    if(text === v){
	                        $elem.addClass('s-crt');
	                        return false;
	                    }
	                })
	            })
	        }
	    }, {
	        title:'按用户',
	        content:function(){
	            return '<s>111111</s>'
	        },
	        onShow:function(self){
	            
	        }
	    }, {
	        title:'按区域',
	        onShow:function(self){                      
	            
	        }
	    }],
	    // active:function(self, data){
	    //     var exist = false;
	    //     Nui.each(self.tagData, function(v){
	
	    //     })
	    // },
	    item:function(){    
	        return '<li class="suggest-item<%active($data)%>" data-index="<%$index%>"><span title="<%$data.buname%>"><%$data.buname%></span></li>'
	    },
	    query:function(self, value){
	        return {
	            keywords:encodeURI(value)
	        }
	    },
	    onRequest:function(self, res){
	        return res.list
	    },
	    onSelect:function(self, data){
	        self.show();
	    },
	    onBlur:function(self, elem){
	        self.value('');
	    }
	})
	
	
});

})(Nui['_module_2_define']);
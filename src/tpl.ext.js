/**
 * @filename tpl.js
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 模版引擎增加渲染方法
 */

;!(function($, Nui, undefined){
    Nui.include('tpl', function(tpl){
        var util = Nui.include('util');
        //格式化日期
        tpl.method('format', function(timestamp, format){
            return util.formatDate(timestamp, format)
        })
        
        //设置url
        tpl.method('seturl', function(name, value, url){
            return util.setParam(name, value, url)
        })

    })
})(jQuery, Nui)
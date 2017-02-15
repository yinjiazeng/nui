/**
 * @filename tpl.ext.js
 * @author Aniu[2016-11-11 16:54]
 * @update Aniu[2016-11-11 16:54]
 * @version 1.0.1
 * @description 模版引擎扩展
 */

Nui.define('template.ext', ['util', 'template'], function(util, tpl){
    //格式化日期
    tpl.method('format', function(timestamp, format){
        return util.formatDate(timestamp, format)
    })
    //设置url参数
    tpl.method('seturl', function(name, value, url){
        return util.setParam(name, value, url)
    })
    return tpl
})

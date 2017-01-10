/**
 * @filename layer.ext.js
 * @author Aniu[2016-11-10 22:39]
 * @update Aniu[2016-11-10 22:39]
 * @version 1.0.1
 * @description layer扩展
 */

;!(function($, Nui, undefined){
    
    Nui.use('layer', function(Layer){
        $.layer.alert = function(){
            return new Layer({
                
            })
        }
    })
    
})(jQuery, Nui)
Nui.define("./script/template/page",["template"],function(e){function t(e,t,i){var n=(new Date).getTime();if(Nui.browser.msie&&Nui.browser.version<=8&&"dot"===e)s.yAxis.data.unshift(e+"/不兼容"),s.series[0].data.unshift(0);else{t();var r=(new Date).getTime(),c=r-n;s.yAxis.data.unshift(e),s.series[0].data.unshift(c)}a.setOption(s),setTimeout(function(){i&&i()},500)}var i=this.renders,a=echarts.init(document.getElementById("data")),n=function(){return{xAxis:{type:"value",name:"毫秒"},yAxis:{type:"category",data:[]},series:[{type:"bar",itemStyle:{normal:{color:function(e){return["#AA4744","#4673A7","#89A54F","#806A9B","#3E96AE","#DB843E"][e.dataIndex]},label:{show:!0,position:"right"}}},data:[]}]}},s=n();a.setOption(s),Nui.$(".input").blur(function(){var e=this.value.replace(/[^\d]+/g,""),t=100;$(this).hasClass("count")&&(t=1e4),this.value=e||t});var r=function(){for(var e=$(".piece").val(),t=$(".count").val(),i=[],a={},n=0;n<t;n++)a["index"+n]="value"+n;for(var n=0;n<e;n++)i.push(a);return{list:i}};$("#start").click(function(){var a=r();s=n();var c=$(this);c.hide(),t("nuiTemplate",function(){e.render(i("{{each list val key}}{{each val v k}}{{k}}:{{v}}{{/each}}{{/each}}"),a)},function(){t("dot",function(){doT.compile(i("{{~it.list :val:key}}{{ for(var k in val) { }}{{=k}}:{{=val[k]}}{{ } }}{{~}}"))(a)},function(){t("artTemplate",function(){template.render(i("{{each list as val key}}{{each val as v k}}{{k}}:{{v}}{{/each}}\n{{/each}}"))(a)},function(){t("baiduTemplate",function(){baidu.template(i("<%for(var i=0;i<list.length;i++){%><%for(var j in list[i]){%><%=j%>:<%=list[i][j]%><%}%><%}%>"),a)},function(){t("juicer",function(){juicer(i("{@each list as item, key}{@each item as v, k}${k}:${v}{@/each}{@/each}"),a)},function(){t("handlebars",function(){Handlebars.compile(i("{{#each list}}{{#each this}}{{@key}}:{{this}}{{/each}}{{/each}}"))(a)},function(){c.show()})})})})})})})});
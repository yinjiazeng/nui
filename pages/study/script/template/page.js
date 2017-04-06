Nui.define(['template'], function(tpl){
	var renders = this.renders;
	var chart = echarts.init(document.getElementById('data'));
	var setOption = function(){
		return ({
			xAxis:{
				type:'value',
				name:'毫秒'
			},
			yAxis:{
				type:'category',
				data:[]
			},
			series:[{
				type:'bar',
				itemStyle: {
					normal:{
						color:function(params) {
							var colorList = ['#AA4744','#4673A7','#89A54F','#806A9B','#3E96AE','#DB843E']
							return colorList[params.dataIndex]
						},
						label:{
							show:true,
							position:'right'
						}
					}
				},
				data:[]
			}]
		})
	}
	var options = setOption();

	chart.setOption(options);

	Nui.$('.input').blur(function(){
		var val = this.value.replace(/[^\d]+/g, '');
		var num = 100
		if($(this).hasClass('count')){
			num = 10000;
		}
		this.value = val || num;
	})

	var setData = function(){
		var piece = $('.piece').val();
		var count = $('.count').val();
		var pieces = [];
		var counts = {};
		for(var i=0; i<count; i++){
			counts['index'+i] = 'value'+i;
		}
		for(var i=0; i<piece; i++){
			pieces.push(counts)
		}
		return {list:pieces}
	}

	function run(name, callback){
		var stime = new Date().getTime();
		callback()
		var etime = new Date().getTime();
		var time = etime - stime;
		options.yAxis.data.push(name);
		options.series[0].data.push(time)
		chart.setOption(options);
	}

	$('#start').click(function(){
		var list = setData();
		options = setOption();

		run('artTemplate', function(){
			template.render(renders({
				{{each list as val key}}
					{{each val as v k}}
						{{k}}:{{v}}
					{{/each}}\n
				{{/each}}
			}))(list)
		})

		run('baiduTemplate', function(){
			baidu.template(renders({
				<%for(var i=0;i<list.length;i++){%>
					<%for(var j in list[i]){%>
						<%=j%>:<%=list[i][j]%>
					<%}%>
				<%}%>
			}), list)
		})

		run('juicer', function(){
			juicer(renders({
				{@each list as item, key}
					{@each item as v, k}
						${k}:${v}
					{@/each}
				{@/each}
			}), list)
		})

		run('handlebars', function(){
			Handlebars.compile(renders({
				{{#each list}}
					{{#each this}}
						{{@key}}:{{this}}
					{{/each}}
				{{/each}}
			}))(list)
		})

		run('dot', function(){
			doT.compile(renders({
				{{~it.list :val:key}}
					{{ for(var k in val) { }}
						{{=k}}:{{=val[k]}}
					{{ } }}
				{{~}}
			}))(list)
		})

		run('nuiTemplate', function(){
			tpl.render(renders({
				{{each list val key}}
					{{each val v k}}
						{{k}}:{{v}}
					{{/each}}
				{{/each}}
			}), list)
		})
	})
})
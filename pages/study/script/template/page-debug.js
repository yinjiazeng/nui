Nui.define('./script/template/page',['template'], function(tpl){
	var renders = this.renders;
	var chart = echarts.init(document.getElementById('data'));
	var setOption = function(){
		return ({
			xAxis: {},
			yAxis: {
				data:[]
			},
			series: [{
				type:'bar',
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
		var datas = [];
		for(var i=0; i<piece; i++){
			pieces.push(i)
		}
		for(var i=0; i<count; i++){
			datas.push(pieces)
		}
		return {list:datas}
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
			template.render(renders(''+''
				+'{{each list as val key}}'+''
				+'{{key}}:'+''
				+'{{each val as v k}}'+''
				+'{{k}}:{{v}}'+''
				+'{{/each}}\n'+''
				+'{{/each}}'+''
			+''))(list)
		})

		run('nuiTemplate', function(){
			tpl.render(renders(''+''
				+'{{each list val key}}'+''
				+'{{key}}:'+''
				+'{{each val v k}}'+''
				+'{{k}}:{{v}}'+''
				+'{{/each}}'+''
				+'{{/each}}'+''
			+''), list)
		})
	})
})

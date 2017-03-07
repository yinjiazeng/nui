<!DOCTYPE html>
<html{% block subpage %}{% endblock %}>
<head>
	<meta charset="utf-8" />
	<meta name="renderer" content="webkit" />
	<meta name="keywords" content="Nui,Nui框架,Nui组件,axnfex,诺诺框架,诺诺前端,爱信诺框架,爱信诺前端" />
	<meta name="description" content="Nui框架是诺诺网前端团队根据自身业务的特点开发出来的模块化前端框架，提供了丰富的组件以适应不同业务需求进行快速开发。" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<title>{% block title %}{% endblock %}Nui.js</title>
	<link rel="stylesheet" type="text/css" href="/nui/assets/style/base-min.css?v=1" />
    {% block style %}{% endblock %}
</head>
<body class="g-body">
	<!-- header -->
	<div class="g-header f-clearfix">
	    <a class="m-logo f-fl" href="/nui/">
            <img src="/nui/assets/images/logo.png" alt="Nui.js" class="f-fl" />
            <em class="f-fl e-ml10 f-fs24">Nui.js</em>
        </a>
        <ul class="m-nav f-fr f-fs16">
            {% block nav %}{% endblock %}
        </ul>
	</div>
	<!-- /header -->

	<!-- content -->
	<div class="g-content">
    {% block content %}{% endblock %}
	</div>
	<!-- /content -->

	{% block footer %}{% endblock %}

    <script type="text/javascript" src="/nui/assets/script/jquery.js"></script>
    <script type="text/javascript" src="/nui/dest/nui-min.js"></script>
    <script type="text/javascript">
    Nui.config({
        paths:{
            base:'/nui',
            script:'/assets/script',
            style:'/assets/style',
            cpns:'/src/components',
			light:'/src/components/highlight'
        },
        alias:{
            placeholder:'{cpns}/placeholder',
			highlight:'{light}/highlight'
        }
    })

	Nui.load('{script}/base-min')

    {% block script %}{% endblock %}
    </script>
</body>
</html>

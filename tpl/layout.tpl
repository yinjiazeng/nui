<!DOCTYPE html>
<html{% block subpage %}{% endblock %}>
<head>
	<meta charset="utf-8" />
	<meta name="renderer" content="webkit" />
	<meta name="keywords" content="Nui,Nui框架,Nui组件,axnfex,诺诺框架,诺诺前端,爱信诺框架,爱信诺前端" />
	<meta name="description" content="Nui框架是诺诺网前端团队根据自身业务的特点开发出来的模块化前端框架，提供了丰富的组件以适应不同业务需求进行快速开发。" />
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<title>{% block title %}{% endblock %}Nui.js</title>
    <link rel="icon" type="image/vnd.microsoft.icon" href="/nui/assets/images/favicon.ico"/>
	<link rel="icon" type="image/x-icon" href="/nui/assets/images/favicon.ico"/>
	<link rel="shortcut icon" type="image/x-icon" href="/nui/assets/images/favicon.ico"/>
	<link rel="stylesheet" type="text/css" href="/nui/assets/style/base-min.css"/>
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

    <script type="text/javascript" src="/nui/assets/script/jquery.min.js"></script>
    <script type="text/javascript" src="/nui/dist/nui-min.js"></script>
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

	Nui.load('{script}/base-min', function(page){
        page.init()
    })
    </script>
    {% block assets %}{% endblock %}
    <script type="text/javascript">
    {% block script %}{% endblock %}
    </script>
</body>
</html>

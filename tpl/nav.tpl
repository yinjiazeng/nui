{% macro active(current='index') %}
    <li class="f-fl">
        <a{%if current == 'study' %} class="s-crt"{% endif %} href="/nui/pages/study/">教程</a>
    </li>
    <li class="f-fl">
        <a{%if current == 'component' %} class="s-crt"{% endif %} href="/nui/pages/component/">组件</a>
    </li>
    <li class="f-fl">
        <a href="https://axnfex.github.io/2017/02/28/jobs/" target="_blank">加入我们</a>
    </li>
    <li class="f-fl">
        <a href="http://zjaisino.github.io/" target="_blank">前端规范</a>
    </li>
    <li class="f-fl">
        <a href="https://axnfex.github.io/" target="_blank">团队博客</a>
    </li>
{% endmacro %}

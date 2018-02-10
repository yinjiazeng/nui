{% macro active(current='index') %}
    <li class="f-fl">
        <a{%if current == 'study' %} class="s-crt"{% endif %} href="/nui/pages/">教程</a>
    </li>
    <li class="f-fl">
        <a href="//nuofe.github.io/blog/2017/02/28/jobs/" target="_blank">加入我们</a>
    </li>
    <li class="f-fl">
        <a href="//zjaisino.github.io/" target="_blank">前端规范</a>
    </li>
    <li class="f-fl">
        <a href="//nuofe.github.io/blog/" target="_blank">团队博客</a>
    </li>
{% endmacro %}

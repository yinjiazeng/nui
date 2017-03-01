{% macro active(current='index') %}
    <li class="f-fl{%if current == 'load' %} s-crt{% endif %}">
        <a href="/nui/pages/loader/">加载器</a>
    </li>
    <li class="f-fl{%if current == 'component' %} s-crt{% endif %}">
        <a href="/nui/pages/component/">组件</a>
    </li>
    <li class="f-fl{%if current == 'automate' %} s-crt{% endif %}">
        <a href="/nui/pages/automate/">自动化</a>
    </li>
    <li class="f-fl{%if current == 'join' %} s-crt{% endif %}">
        <a href="/nui/pages/join/">加入我们</a>
    </li>
    <li class="f-fl">
        <a href="http://zjaisino.github.io/" target="_blank">前端规范</a>
    </li>
    <li class="f-fl">
        <a href="https://axnfex.github.io/" target="_blank">团队博客</a>
    </li>
{% endmacro %}

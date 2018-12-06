# Account Registration

Hello, {{user['fullname']}}!

Welcome to {{ config.BRAND }} {% if is_qa %} (QA Version) {% endif %}. Your account has been created on [{{ server_url }}]({{ server_url }}).

Please login with your email: {{user['email_addr']}} and temporary password: {{user['password']}}

Upon login, you will be emailed a code that you will need to enter to verify your account

{% if project_urls %}
You can contribute to the following project(s):
{% for project_url in project_urls %}
- {{project_url}}
{% endfor %}
{% endif %}

Reference manual for {{ config.BRAND }} platform is available at [{{user_manual_url}}]({{user_manual_url}}).

For more information about the processing of your personal data by {{ config.PARENT_BRAND or config.BRAND }}, please review our [privacy policy]({{ config.PRIVACY_POLICY_PAGE }}).

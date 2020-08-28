# {{access_type}} access on {{ config.BRAND }}

Hello,

A {{ config.BRAND }} account for a user with firm id {{firm_id}} has been auto-generated using information from BSSO. This firm id is not on the list of recognized firms. Please ensure this is a valid user of {{ config.BRAND }}.  
{% if is_qa %} (QA Version) {% endif %} at [{{server_url}}]({{server_url}}).

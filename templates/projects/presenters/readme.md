Pybossa Task Presenter Project Templates
========================================

This directory contains Task Presenter project template thumbnail cards. The HTML files contained within this folder include the code for rendering the thumbnail card.

This page is rendered at the url `http://localhost:5000/project/SHORT_NAME/tasks/taskpresentereditor`

## Example: Basic

Below is an example from [basic.html](basic.html). Note the text to specify the title of the card ("Basic") and the description to display along the bottom portion of the card ("The most basic template").

```
{% from "projects/_helpers.html" import render_project_card_option %}
{{ render_project_card_option(project, upload_method, title=_('Basic'), explanation=_('The most basic template'), link=url_for('project.task_presenter_editor', short_name=project.short_name, template='basic'), link_action_text=_('Go'), icon='leaf')}}
```

## Rendering the List of Templates

The list of templates included within this directory are rendered in [projects.py](https://github.com/bloomberg/pybossa/blob/master/pybossa/view/projects.py#L425) by the method `task_presenter_editor()`.

When using the generic url route `/project/SHORT_NAME/tasks/taskpresentereditor`, the list of available templates are [rendered](https://github.com/bloomberg/pybossa/blob/master/pybossa/view/projects.py#L510) by [task_presenter_options.html](https://github.com/bloomberg/pybossa-default-theme/blob/master/templates/projects/task_presenter_options.html).

The code below demonstrates how [projects/snippets/options.html](https://github.com/bloomberg/pybossa-default-theme/blob/master/templates/projects/snippets/options.html#L10-L14) is rendered, which in turn, loops through the list of template thumbnail cards to display on the page.

```html
{% block content %}
<div class="container">
    <div class="col-md-3">
        {{ helper.render_project_local_nav(project, active_link, current_user, pro_features, upload_method) }}
    </div>
    <div class="col-md-9">
        {% include "projects/snippets/options.html" %}
    </div>
</div>
{% endblock %}
```
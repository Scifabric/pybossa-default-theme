Pybossa Task Presenter Snippets
===============================

This directory contains Task Presenter project template snippets. The HTML files contained within this folder include the default code that is displayed within the Task Presenter editor. The user can customize this code within the editor to setup their desired UI for a task.

## Example: Basic

Below is an example from [basic.html](basic.html). This content is rendered at the url `http://localhost:5000/project/SHORT_NAME/tasks/taskpresentereditor?template=basic.html`

```html
<div class="row">
    <div class="col-md-12">
        <h1>Write here your HTML Task Presenter</h1>
    </div>
</div>
<script type="text/javascript">
(function() {
    // Your JavaScript code
    pybossa.presentTask(function(task, deferred){
        // Present the current task to the user
        // Load the task data into the HTML DOM
    });

    pybossa.run('{{project.short_name}}');
})();
</script>
```

## Rendering the Snippet

When the url contains the query string parameter `?template=NAME`, the corresponding snippet is rendered within the task presenter editor in [projects.py](https://github.com/bloomberg/pybossa/blob/master/pybossa/view/projects.py#L533-L534) by the method `task_presenter_editor()`

```python
tmpl_uri = 'projects/snippets/{}.html'.format(tmpl_name)
tmpl = render_template(tmpl_uri, project=project)
```
CSS Styles
==========

CSS styles are implemented using [SASS](https://sass-lang.com/) and stored within this folder.

Custom CSS styles may be added to templates by editing or creating new `.sass` files within the folder `custom`. The following steps show an example for adding a new style for the element ID `#example-id`.

## Adding a New Style

1. Edit the file `_pybossa.scss`
2. Include the following new import command to referernce a new scss file:
    ```
    @import "custom/example";
    ```
3. Create a new file `custom/example.scss` with the following contents:
    ```css
    #example-id {
      font-size: 16px;
      font-weight: bold;
      color: purple;
    }
    ```
4. Reference the new CSS style in your template.
    ```html
    <div id="example-id">Hello World</div>
    ```

## Editing an Existing Style

Existing custom CSS styles can be found within the folder `custom` for the corresponding page to edit. Styles can be added and/or edited accordingly.
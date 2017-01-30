# Pybossa tutorial javascript API
Include `/static/js/pybossa-tutorial.js`, store user's tutorial stage in cookie

Set tutorial complete
```js
window.pybossaTutorial.setComplete()
```

Set tutorial skip
```js
window.pybossaTutorial.setSkipped()
```

Check if user skipped or complete the tutorial
```js
window.pybossaTutorial.isSkippedOrComplete
```

# Integration with IM
First, include `/static/js/amnesty-sso.js`, `/static/js/pybossa-tutorial.js` files

To open modal with 3 options: register, login, skip:
```js
window.amnestySSO.showImModalContent('all');
$('#amnestySSOModal').modal('show');
```

To open login modal:
```js
window.amnestySSO.showImModalContent('login');
$('#amnestySSOModal').modal('show');
```

To open register modal:
```js
window.amnestySSO.showImModalContent('register');
$('#amnestySSOModal').modal('show');
```

After finish login/register with IM, if user hasn't tried tutorial yet, user will be redirected to tutorial url.

# Integration with Discourse forum
Include `/static/js/amnesty-sso.js` file

Add flag link button
```html
<a data-target='#flagModal'>Flag</a>
```
Flag modal doesn't show if tutorial modal is open. Tutorial modal open status is defined by `window.isInTutorial`

If user is not logged in, then click flag button will open the register/login modal.

# Results page
The results page in this pybossa theme use style and images from https://github.com/AltClick/amnesty-theme

## Git submodule
https://github.com/AltClick/amnesty-theme is added as git submodule in this repo 

To manually amnesty-theme as gitsumodule
```
# Pull amnesty theme code as submodule
cd pybossa/themes/default
git submodule add git@github.com:AltClick/amnesty-theme.git static/amnesty-theme
```

## Build style
Copy images, compile less files, pull 3rd libaries
```
cd pybossa/themes/default/static
mkdir -p img/results-page js/results-page
rm -Rf img/results-page/* js/results-page/*
cp -R amnesty-theme/static/img/results-page/* img/results-page
cp -R amnesty-theme/static/js/results-page/* js/results-page
cp -f amnesty-theme/dist/pybossa/* amnesty-theme/static
```

# Pybossa default theme content
This is the default theme for the [Pybossa
server](https://github.com/PyBossa/pybossa).

![Shuttleworth Foundation Funded](http://pybossa.com/assets/img/shuttleworth-funded.png)

PyBossa was inspired by the [BOSSA](http://bossa.berkeley.edu/) crowdsourcing engine but is written in
python (hence the name!). It can be used for any distributed tasks project
but was initially developed to help scientists and other researchers
crowd-source human problem-solving skills!

# See it in Action

PyBossa powers [CrowdCrafting.org](http://crowdcrafting.org/) and [ForestWatchers.net](http://forestwatchers.net)

# Installing and Upgrading

This theme is automatically grabbed and installed in the PyBossa server when
you clone the server with the option **--recursive**, as this theme is included
as a sub-module in PyBossa.

# Translations

If you want to enable the translations for your PyBossa server, you'll have to create 
a symbolic link of the translations folder into the pybossa root folder:

```bash
ln -s pybossa/themes/pybossa-default-theme/translations pybossa/translations
```

Then, restart the server and you'll be done. NOTE: be sure to enable/disable the
locales that you want to use.

# Creating a new theme

In order to create a new theme, fork this repository and make all the required
changes in the **templates** and **static** folder.

# Useful Links

* [Documentation](http://docs.pybossa.com/)
* [Mailing List](http://lists.okfn.org/mailman/listinfo/open-science-dev)

# Contributing

If you want to contribute to the project, please, check the
[CONTRIBUTING file](CONTRIBUTING.md).

It has the instructions to become a contributor.

## Copyright / License

Copyright 2015 [SciFabric LTD](http://scifabric.com).

Source Code License: The GNU Affero General Public License, either version 3 of the License
or (at your option) any later version. (see COPYING file)

The GNU Affero General Public License is a free, copyleft license for
software and other kinds of works, specifically designed to ensure
cooperation with the community in the case of network server software.

Documentation and media is under a Creative Commons Attribution License version
3.

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
ln -s pybossa/themes/default/translations pybossa/translations
```

Then, restart the server and you'll be done. NOTE: be sure to enable/disable the
locales that you want to use.

## How to update pybabel translations for this theme

Go to the your pybossa/pybossa directory and use this two commands:

```bash
pybabel extract . -F themes/default/babel.cfg -k lazy_gettext -o themes/default/translations/messages.pot
pybabel update -i themes/default/translations/messages.pot -d themes/default/translations
```

Be sure to escape special characters correctly like e.g. `'`! Edit ES translations and run finally:

```bash
pybabel compile -d themes/default/translations
```

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

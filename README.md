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

Copyright 2014 SF Isle of Man Limited. 

Source Code License: The GNU Affero General Public License, either version 3 of the License
or (at your option) any later version. (see COPYING file)

The GNU Affero General Public License is a free, copyleft license for
software and other kinds of works, specifically designed to ensure
cooperation with the community in the case of network server software.

Documentation and media is under a Creative Commons Attribution License version
3.

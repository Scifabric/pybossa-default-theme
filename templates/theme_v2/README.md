A place for version 2.0 of pybossa amnesty theme. This pybossa theme will use style from https://github.com/AltClick/amnesty-theme which is pulled into this pybossa at `/static/amnesty-theme` using git submodule .


To be able to force browser using new version of css, jss, we use cssmin ( in https://webassets.readthedocs.io/en/latest/builtin_filters.html#css-compressors )

Install webassets's cssmin filter (should we add it to requirements.txt ?)
```
pip install jsmin cssmin
```
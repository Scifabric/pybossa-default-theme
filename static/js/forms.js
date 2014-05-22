(function(){
    var resource = location.pathname.split('/')[1];
    var name = getNameInputFor(resource);
    var slug = getSlugInputFor(resource);

    name.addEventListener('keyup', function(){
        slug.value = makeSlugFromName(name.value);
    });

    function makeSlugFromName(name){
        var not_valid_chars = /([$#&\/|]+)/g;
        return name.toLowerCase().trim().replace(not_valid_chars, "").replace(/( )+/g, "-");
    }

    function getNameInputFor(resource){
        if (resource === 'app'){
            return document.getElementById('name');
        }
        if (resource === 'account'){
            return document.getElementById('fullname');
        }
    }

    function getSlugInputFor(resource){
        if (resource === 'app'){
            return document.getElementById('short_name');
        }
        if (resource === 'account'){
            return document.getElementById('name');
        }
    }

}());

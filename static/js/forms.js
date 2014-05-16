(function(){
    var name = document.getElementById('name');
    var short_name = document.getElementById('short_name');

    name.addEventListener('keyup', function(){
        short_name.value = makeSlugFromName(name.value);
    });

    function makeSlugFromName(name){
        return name.toLowerCase().trim().replace(/([$#&\/|]+)/g, "").replace(/( )+/g, "-");
    }

}());
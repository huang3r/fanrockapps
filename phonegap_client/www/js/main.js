(function(document) {
    
    // using my app id and secret as the app access token
    var ACCESS_TOKEN="125449617468339|38d56cb6355f6e3d8ab875f4cc51a5bc"
    
    function getGraph(url, data, success) {
        url = "https://graph.facebook.com/v2.0" + url;
        data = _.extend({"access_token" : ACCESS_TOKEN}, data);
        
        return $.getJSON(url, data, success);
    }
    
    var storyTemplate = _.template(document.getElementById("story_template").innerHTML.trim());
    
    getGraph("/FlixsterMovies/feed").success(function(data, textStatus, jqXHR) {
        //console.log(data);
        var div = document.createElement("div");
        _.each(data.data, function(story) {
            $(div).append(storyTemplate({"story":story}));
        })
        $("body").append(div);
    });

})(document);
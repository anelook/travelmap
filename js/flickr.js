
var flickrAPI = (typeof mapBuilder == "undefined" || !mapBuilder) ? {} : mapBuilder;

flickrAPI.app_key = '762796f11c4d40e5a3baef0dbc8d22e1';


flickrAPI.images = function () {

    function publicGetImageByPosition(latitude, longitude, objectId, answerDelegator) {
        var photoURL;
        $.ajax({
            url: "http://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=" + flickrAPI.app_key + "&format=json&lat=" + latitude + "&lon=" + longitude + "&per_page=1&jsoncallback=?",
            type: "GET",
            cache: true,
            dataType: 'jsonp',
            success: function (data) {
   
                
                if (data.photos.photo.length > 0) {
                    photo = data.photos.photo[0];

                    photoURL = 'http://farm' + photo.farm + '.static.flickr.com/' + photo.server + '/' + photo.id + '_' + photo.secret + '_m.jpg'
                }
                else { }

                answerDelegator(objectId, photoURL);
            }
        });

    }
    return {
        getImageByPosition: publicGetImageByPosition
    };

}();

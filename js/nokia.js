var mapAPI = (typeof mapBuilder == "undefined" || !mapBuilder) ? {} : mapBuilder;

mapAPI.app_id = 'KsP3LuNGYrN5T53fX9G8';
mapAPI.app_code = 'Hl6xeGgwoXFQNHx9O67ZrQ';

mapAPI.mapBuilder = function () {
    var map,
    mapContainer,
    searchCenter,
    searchManager,
    markersContainer,
    gfx,
    customMarkerCollection;

    //#region Interface Methods
    function publicInitialization(containerId) {
        return initialization(containerId);
    }

    function publicAddMarkerByCoordinates(latitude, longitude, label) {
        var result = Object.create(core.Result);
        result.success = true;

        var coords = new nokia.maps.geo.Coordinate(latitude, longitude);
        marker = new nokia.maps.map.StandardMarker(coords, { text: label });
        var resultSet = new nokia.maps.map.Container();
        resultSet.objects.add(marker);
        map.objects.add(resultSet);

        return result;
    }

    function publicRequestNameByCordinates(latitude, longitude, resultsDelegator) {

        var processResults = function (data, requestStatus, requestId) {
            var result = Object.create(core.Result);
            result.success = true;

            var result, city, country;
            result.Data = '';

            if (requestStatus == "OK") {
                if (data.location && data.location.address) {
                    result.Data = data.location.address.city +
                        ", " +
                        data.location.address.country;
                } else {
                    result.success = false;
                    result.errorMsg = core.errors.noResultsForSearch; 
                }
            } else {
                result.success = false;
                result.errorMsg = core.errors.searchRequestFailed;
            }

            resultsDelegator(result);
        };

        nokia.places.search.manager.reverseGeoCode({
            latitude: latitude,
            longitude: longitude,
            onComplete: processResults
        });

        return true;
    }

    //todo refactor and simplify
    function publicAddMarkerByAddress(searchTerm, requestImageUrlDelegator)
    {
        var resultSet;
        // Function for receiving search results from places search and process them

        //test that delegetor is called back
        //add delegator object todo move to 
        var onImageLoaded = function (id, imageUrl) {
            var marker = customMarkerCollection[id];
            marker.icon = new gfx.BitmapImage(imageUrl, null, 50, 50);
            map.objects.add(marker);
        }

        var processResults = function (data, requestStatus, requestId) {
            var i, len, locations, marker;

            if (requestStatus == "OK" && data) {
                // The function findPlaces() and reverseGeoCode() of  return results in slightly different formats
                locations = data.results ? data.results.items : [data.location];
                // We check that at least one location has been found
                if (locations.length > 0) {
                    // Remove results from previous search from the map
                    if (resultSet) map.objects.remove(resultSet);
                    // Convert all found locations into a set of markers
                    resultSet = new nokia.maps.map.Container();
                    for (i = 0, len = locations.length; i < len; i++) {
                        var img = new gfx.BitmapImage("http://anelook.de/loader.gif", null, 25, 25);
                        marker = new nokia.maps.map.Marker(locations[i].position, {
                            icon: img,
                            anchor: {
                                x: 0,
                                y: 0
                            }
                        })

                        requestImageUrlDelegator(locations[i].position.latitude, locations[i].position.longitude, marker.id, onImageLoaded);

                        markersContainer.objects.addAll([marker]);
                        // I bet the API has a vay to retrieve the marker by its ID, which I jsut cannot find. however, for now:
                        customMarkerCollection[marker.id] = marker;
                        resultSet.objects.add(marker);
                    }
                    // Next we add the marker(s) to the map's object collection so they will be rendered onto the map
                    map.objects.add(resultSet);
                } else {
                    alert(core.errors.noResultsForSearch);
                }
            } else {
                alert(core.errors.searchRequestFailed);
            }
            //Todo, make a return object with success status and display error from ui.js
        };
        searchManager.geoCode({
            searchTerm: searchTerm,
            onComplete: processResults
        });

        return true;
    }

    function publicRemoveMarkerByAddress()
    {
        // todo : find a nice way to remove marker by label
        // and remove the nasty workaround of resetting the whole list of markers...
    }

    function publicAddManyMarkers(places, cleanFirst, getImageUrlDelegator) {
        if (cleanFirst)
        {
            map.objects.clear();
        }
        
        for (index = 0; index < places.length; ++index) {
            var place = places[index];
            mapAPI.mapBuilder.addMarkerBySearchTerm(place, getImageUrlDelegator);
        }

        return true;
    }

    function initialization(containerId) {
        
        nokia.Settings.set("app_id", mapAPI.app_id);
        nokia.Settings.set("app_code", mapAPI.app_code);
        // Use staging environment (remove the line for production environment)
        nokia.Settings.set("serviceMode", "cit");
        
        // Get the DOM node to which we will append the map
        mapContainer = document.getElementById(containerId);
        
        // Create a map inside the map container DOM node
        map = new nokia.maps.map.Display(mapContainer, {
            // Initial center and zoom level of the map
            center: [52.51, 13.4],
            zoomLevel: 3,
            // We add the behavior component to allow panning / zooming of the map
            components: [new nokia.maps.map.component.Behavior()]
        });
        
        searchCenter = new nokia.maps.geo.Coordinate(52.51, 13.4);
        searchManager = nokia.places.search.manager;
        markersContainer = new nokia.maps.map.Container();
        map.objects.add(markersContainer);
        gfx = nokia.maps.gfx;
        customMarkerCollection = {};
        return true;
    }

    return {
        initialize: publicInitialization,
        addMarkerBySearchTerm: publicAddMarkerByAddress,
        addMarkerByCoordinates: publicAddMarkerByCoordinates,
        requestNameByCordinates: publicRequestNameByCordinates,
        addManyMarkers: publicAddManyMarkers
    };

}();

var ui = (typeof ui == "undefined" || !ui) ? {} : ui;

ui.Home = function () {
    var storageKeyForPlaces = 'visitedPlaces';
    var icNewPlace = $('#textPlace'),
    lAddPlaceSuccess = $('#lAddPlaceSuccess'),
    lAddPlaceError = $('#lAddPlaceError'),
    placeList = $('#placeList');

    function publicPageWarmUp() {
        var supported = core.Storage.isStorageSupported();

        if (!supported)
        {
            var message = "Unfortunately, your web browser does not support HTML5 LocalStorage functionality. "+
            "Current version of this website uses LocalStorage to save the list of places visited";
            alert(message);
        }

        mapAPI.mapBuilder.initialize('mapContainer');

        new nokia.places.widgets.SearchBox({
            targetNode: "customSearchBox",
            template: "customSearchBox",
            searchCenter: function () {
                return {
                    latitude: 52.516274,
                    longitude: 13.377678
                };
            },
            onResults: function (data) {
            }
        });

        refreshListView();
        resetModal();
        addMarkersForAllStoredPlaces();
        tryMarkCurrentLocation();

        $('#btnAddPlace').click(function () {
            onAddPlace();
        });
    }

    function onAddPlace() {
        //todo, if place does not exist, inform and not add it to the list
        var place = $('#textPlace').val();
        if (place.length === 0) {
            lAddPlaceError.text('Please enter a name of the place...')
            lAddPlaceError.show();
            return;
        }
        var existsAlready = core.Helpers.isPlaceAlreadyAdded(place, null, storageKeyForPlaces)
        if (existsAlready) {
            lAddPlaceError.text('You already have this place in your list. Enter a new one, please.')
            lAddPlaceError.show();
            return;
        }

        var places = storePlace(place);
        mapAPI.mapBuilder.addMarkerBySearchTerm(place, flickrAPI.images.getImageByPosition);
        refreshListView();
    }

    function storePlace(newPlace) {
        var places;
        var getExistingElements = core.Storage.getValueByKey(storageKeyForPlaces);

        if (!getExistingElements.success) {
            displayError(getExistingElements.errorMsg);
            return null;
        }

        if (!getExistingElements.data) {
            places = [];
        }
        else {
            places = getExistingElements.data;
        }

        if (core.Helpers.isPlaceAlreadyAdded(newPlace, places)) {

            return null;
        }

        places.push(newPlace);
        core.Storage.setValueByKey(storageKeyForPlaces, places);

        var closeOnAdd = $('#closeOnAdd').val();
        if (closeOnAdd)
            hideModal();
        else
        {
            resetModal();
            lAddPlaceSuccess.show();
        }
        return places;
    }

    function hideModal()
    {
        resetModal();
        $('#placeModal').modal('hide')
    }

    function refreshListView() {
        cleanListView();
        var response = core.Storage.getValueByKey(storageKeyForPlaces);
        if (response.success) {
            var places = response.data;
            populateListView(places);
        }
        else {
            console.error(response.errorMsg);
        }
    }

    function populateListView(places)
    {
        if (!places)
            return;

        var frag = document.createDocumentFragment();
        for (index = 0; index < places.length; ++index) {
            var place = places[index];
            var newListItem = document.createElement("li");

            newListItem.innerHTML =
            '<button type="button" class="btnRemovePlace btn btn-default btn-xs" onclick="ui.Home.removePlace(\'' + place + '\')">' +
            '<span class="glyphicon glyphicon-trash "></span> </button> ' +
             place;

            frag.appendChild(newListItem);
        }
        placeList.get(0).appendChild(frag);
    }

    function publicRemovePlace(place) {
        var getExistingElements = core.Storage.getValueByKey(storageKeyForPlaces);
        var places = getExistingElements.data;
        var index = places.indexOf(place);
        places.splice(index, 1);
        core.Storage.setValueByKey(storageKeyForPlaces, places);

        mapAPI.mapBuilder.addManyMarkers(places, true, flickrAPI.images.getImageByPosition);
        
        refreshListView();
        addMarkersForAllStoredPlaces();
    }

    function resetModal() {
        $('#lAddPlaceError').hide();
        $('#lAddPlaceSuccess').hide();
        $('#textPlace').val('');
    }

    function tryMarkCurrentLocation() {
        var saveCurrentLocationToList = function (response) {
            if (response.success) {
                storePlace(response.Data);
                refreshListView();
                addMarkersForAllStoredPlaces();
            }
            else {
                //we just cannot mark the current location. Probably, no point in bothering user.
            }
        }

        var addToMap = function (position) {
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;

            mapAPI.mapBuilder.requestNameByCordinates(latitude, longitude, saveCurrentLocationToList);
            
        }
        var noStartPosition = function (err) {
            //just do nothing at the moment.
        }
        core.Geolocation.requestCurrentLocation(addToMap, noStartPosition);
    }

    function cleanListView() {
        var placelist = $('#placeList');
        placelist.empty();
    }

    function addMarkersForAllStoredPlaces() {
        var getExistingElements = core.Storage.getValueByKey(storageKeyForPlaces);
        var places = getExistingElements.data;
        if (!places)
            return;
        mapAPI.mapBuilder.addManyMarkers(places, true, flickrAPI.images.getImageByPosition);
    }

    function showError(message)
    {

    }

    return{
        removePlace: publicRemovePlace,
        pageWarmUp: publicPageWarmUp
    };

}();
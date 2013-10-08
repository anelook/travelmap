var core = (typeof core == "undefined" || !core) ? {} : core;


core.Result = {
success : undefined,
errorMsg : undefined,
data : undefined
}

core.errors = {};
core.errors.noStorageSupport = "Browser does not support local storage";
core.errors.keyIsNotDefined = "When manipulating the storage the key must not be undefined, empty or null";
core.errors.noResultsForSearch = "Your search produced no results!";
core.errors.searchRequestFailed = "The search request failed";
core.Storage = function () {

    //#region Interface Methods
    function publicIsStorageSupported() {
        isStorageAvailable = Modernizr.localstorage;

        if (!isStorageAvailable) {
            warnNoAvailability();
        }

        return isStorageAvailable;
    }

    //unittest check if supported and run for empty object
    function publicGetValueByKey(key) {
        var result = Object.create(core.Result);
        result.success = true;

        if (!key) {
            result.success = false;
            result.errorMsg = core.errors.keyIsNotDefined;
            return result;
        }

        if (!isStorageAvailable) {
            warnNoAvailability();
            result.success = false;
            result.errorMsg = core.errors.noStorageSupport;
        }
        else {
            var value = localStorage.getItem(key);
            result.data = JSON.parse(value);
        }
        return result;
    }

    //unittest check if supported and run for empty object
    function publicSetValueByKey(key, value) {
        var result = Object.create(core.Result)
        result.success = true;

        if (!key)
        {
            result.success = false;
            result.errorMsg = core.errors.keyIsNotDefined;
            return result;
        }

        if (!isStorageAvailable) {
            warnNoAvailability()
            result.success = false;
            result.errorMsg = core.errorNoStorageSupport;
        }
        else {
            var stringified = JSON.stringify(value);
            localStorage.setItem(key, stringified);
        }
        return result;
    }

    //unittest check if supported and run for empty object
    function publicRemoveItemByKey(key){
        var result = Object.create(core.Result)
        result.success = true;
        if (!key) {
            result.success = false;
            result.errorMsg = core.errors.keyIsNotDefined;
            return result;
        }

        if (!isStorageAvailable) {
            warnNoAvailability()
            result.success = false;
            result.errorMsg = core.errorNoStorageSupport;
        }
        else {
            localStorage.removeItem(key, value);
        }

        return result;
    }

    //unittest check if supported and run for empty object
    function publicClearArea() {
        var result = Object.create(core.Result)
        result.success = true;

        if (!isStorageAvailable) {
            warnNoAvailability()
            result.success = false;
            result.errorMsg = core.errorNoStorageSupport;
        }
        else {
            localStorage.clear();
        }

        return result;
    }

    //#endregion

    var isStorageAvailable;


    function warnNoAvailability()
    {
        console.log("no storage");
    }


    return {
        isStorageSupported: publicIsStorageSupported,
        getValueByKey: publicGetValueByKey,
        setValueByKey: publicSetValueByKey,
        removeItemByKey: publicRemoveItemByKey,
        clearArea: publicClearArea
    };

}();


core.Geolocation = function () {

    //unittest
    function publicRequestCurrentLocation(onsuccess, onerror)
    {
        if (Modernizr.geolocation) {
            navigator.geolocation.getCurrentPosition(onsuccess, onerror);
        } else {
            onerror();
        }
    }

    return {
        requestCurrentLocation: publicRequestCurrentLocation
    };

}();

core.Helpers = function () {
    function publicIsPlaceAlreadyAdded(place, places, storageKeyForPlaces) {
        if (!places) {
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
        }
        return places.indexOf(place) > -1;

    }
    return {
        isPlaceAlreadyAdded: publicIsPlaceAlreadyAdded
    };
}();
describe("API Settings", function () {
    it("has here.com app_id", function () {
        expect(mapAPI.app_id).toBeDefined();
        expect(mapAPI.app_id.length).toBeGreaterThan(0);
    });

    it("has here.com  app_code", function () {
        expect(mapAPI.app_code).toBeDefined();
        expect(mapAPI.app_code.length).toBeGreaterThan(0);
    });

    it("has flickr app_key", function () {
        expect(flickrAPI.app_key).toBeDefined();
        expect(flickrAPI.app_key.length).toBeGreaterThan(0);
    });
});

describe("mapAPI.mapBuilder", function () {

    var containerId = "containerId"
    var container;

    beforeEach(function () {
        container = document.createElement("div");
        container.id = containerId;
        document.body.appendChild(container);
    });

    it("initializes map objects", function () {
        expect(mapAPI.mapBuilder.initialize).toBeDefined();
        expect(mapAPI.mapBuilder.initialize("containerId")).toBe(true);
    });

    it("adds a marker by coordinates", function () {
        expect(mapAPI.mapBuilder.initialize("containerId")).toBe(true);
        expect(mapAPI.mapBuilder.addMarkerByCoordinates(52.516274, 13.377678, "newMarker")).toBe(true);
    });

    it("requests a name by provided coordinates", function () {
        expect(mapAPI.mapBuilder.initialize("containerId")).toBe(true);
        var t;
        var resultsDelegator = function () { t = 1;};
        expect(mapAPI.mapBuilder.requestNameByCordinates(52.516274, 13.377678, resultsDelegator)).toBe(true);
        setTimeout(function () {
            expect(t).toEqual(3);
        }, 1000);
    });

    it("adds a marker by a search term", function () {
        expect(mapAPI.mapBuilder.initialize("containerId")).toBe(true);
        expect(mapAPI.mapBuilder.addMarkerBySearchTerm("Paris", "0")).toBe(true);
    });

    it("adds several markers from a list", function () {
        expect(mapAPI.mapBuilder.initialize("containerId")).toBe(true);
        expect(mapAPI.mapBuilder.addManyMarkers(["Paris", "Rome"], true)).toBe(true);
    });
    
});


describe("core.Storage", function () {
    //at the moment this testsuit is browser dependent.. todo - mock isStorageSupported private property(?)
    var isStorageSupported;
    var storageKey = "someKey";

    beforeEach(function () {
        isStorageSupported = core.Storage.isStorageSupported()
    });

    afterEach(function () {
        if (localStorage)
            localStorage.clear();
    });

    it("has method isStorageSupported", function () {
        expect(core.Storage.isStorageSupported).toBeDefined();
        //it can be either true or false depending on browser we test in
        expect(core.Storage.isStorageSupported()).toBeDefined();
    });

    it("sets a value by key", function () {
        expect(core.Storage.setValueByKey).toBeDefined();
        
        if (isStorageSupported)
            expect(core.Storage.setValueByKey(storageKey).success).toBe(true);
        else
            expect(core.Storage.setValueByKey(storageKey).success).toBe(false);
    });

    it("returns error when sets value by key, which is undefined", function () {
        expect(core.Storage.setValueByKey).toBeDefined();
        //it can be either true or false depending on browser we test in
        if (isStorageSupported) {
            expect(core.Storage.setValueByKey().success).toBe(false);
            expect(core.Storage.setValueByKey().errorMsg).toEqual(core.errors.keyIsNotDefined);
        }
        else {
            expect(core.Storage.setValueByKey().success).toBe(false);
            expect(core.Storage.setValueByKey().errorMsg).toEqual(core.errors.noStorageSupport);
        }
    });

    it("sets and gets a value by key", function () {
        expect(core.Storage.setValueByKey).toBeDefined();
        //it can be either true or false depending on browser we test in
        if (isStorageSupported) {
            core.Storage.setValueByKey(storageKey, "testvalue");

            expect(core.Storage.getValueByKey(storageKey).success).toBe(true);
            expect(core.Storage.getValueByKey(storageKey).data).toEqual("testvalue");
        }
        else {
            expect(core.Storage.getValueByKey().success).toBe(false);
            expect(core.Storage.setValueByKey().errorMsg).toEqual(core.errors.noStorageSupport);
        }
    });

    it("returns error when gets value by key, which is undefined", function () {
        expect(core.Storage.setValueByKey).toBeDefined();
        //it can be either true or false depending on browser we test in
        if (isStorageSupported) {
            expect(core.Storage.getValueByKey().success).toBe(false);
            expect(core.Storage.getValueByKey().errorMsg).toEqual(core.errors.keyIsNotDefined);
        }
    });

    it("returns error when removes item, where key is undefined", function () {
        expect(core.Storage.removeItemByKey).toBeDefined();
        //it can be either true or false depending on browser we test in
        if (isStorageSupported) {
            expect(core.Storage.removeItemByKey().success).toBe(false);
            expect(core.Storage.removeItemByKey().errorMsg).toEqual(core.errors.keyIsNotDefined);
        }
    });

});
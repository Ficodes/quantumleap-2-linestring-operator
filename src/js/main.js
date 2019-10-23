/*
 * QuantumLeap-2-LineString-operator
 * https://github.com/mjimenez/QuantumLeap-2-LineString
 *
 * Copyright (c) 2019 CoNWeT
 * Licensed under the GPLv2 license.
 */

(function () {

    "use strict";

    var previousEntityID = null;

    var handleQLInput = function handleQLInput(data) {
        var entity = {};
        entity.id = data.entityId + "-route";
        entity.type = "PublicTransportRoute";
        entity.location = {};
        entity.location.type = "LineString";
        entity.location.coordinates = [];

        // Copy the locations
        var locations = data.attributes.filter(a => {return a.attrName === "location"});
        if (locations.length < 1) {
            MashupPlatform.widget.log("Not received location data in a location attribute", MashupPlatform.log.ERROR);
            return -1;
        }

        locations[0].values.forEach(element => {
            entity.location.coordinates.push(element.coordinates);
        });

        var poi = {};
        poi.data = entity;
        poi.id = entity.id;
        poi.selectable = false;
        poi.title = data.entityId + " route";
        poi.location = entity.location;
        poi.style = {
            "stroke": "#008000"
        };


        // Send events
        if (previousEntityID) {
            MashupPlatform.wiring.pushEvent("previous", {id: previousEntityID});
        }
        MashupPlatform.wiring.pushEvent("route", poi);
        previousEntityID = entity.id;
    };

    MashupPlatform.wiring.registerCallback('historyInput', handleQLInput);
})();

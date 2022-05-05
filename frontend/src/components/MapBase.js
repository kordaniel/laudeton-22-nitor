import React, { useEffect } from 'react';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import './MapBase.css';

const MapBase = () => {
    useEffect(() => {
        map.setTarget('map');
    });

    const map = new Map({
        target: null,
        view: new View({
            center: [3617200, 4951081],
            zoom: 5,
        }),
        layers: [
            new TileLayer({
                source: new OSM(),
            }),
        ],
    });

    return (
        <>
            <div id="map"></div>
        </>
    );
};

export default MapBase;
import React, { useEffect, useState, useRef } from 'react';
import {Feature, Map, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import './MapBase.css';
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import activitiesService from "../services/activitiesService";
import {Point} from "ol/geom";
import {fromLonLat} from "ol/proj";

const MapBase = () => {
    const [ map, setMap ] = useState()
    const [ activitiesLayer, setActivitiesLayer ] = useState(new VectorLayer({
        source: new VectorSource()
    }))
    const [ selectedCoord , setSelectedCoord ] = useState()

    const mapElement = useRef()
    const mapRef = useRef()
    mapRef.current = map

    useEffect(() => {
        const initialMap = new Map({
            target: mapElement.current,
            view: new View({
                center: [3617200, 4951081],
                zoom: 5,
            }),
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                activitiesLayer
            ],
        });
        initialMap.on('click', handleMapClick)
        setMap(initialMap)
    }, []);

    useEffect(() => {
        activitiesService.getActivities().then((activities) => {
            activities.forEach(activity => {
                const feature = new Feature({
                    geometry: new Point(
                        fromLonLat([activity.coordinates.long, activity.coordinates.lat])
                    )
                });
                activitiesLayer.getSource().addFeature(feature);
            });
        })
    }, [activitiesLayer]);

    const handleMapClick = (event) => {
        const clickedCoord = mapRef.current.getCoordinateFromPixel(event.pixel);
        setSelectedCoord(clickedCoord);
    }

    return (
        <>
            <div  ref={mapElement} id="map"></div>
        </>
    );
};

export default MapBase;
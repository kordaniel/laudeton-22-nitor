import React, { useEffect, useState, useRef } from 'react';
import {Feature, Map, Overlay, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import './MapBase.css';
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import activitiesService from "../services/activitiesService";
import {Point} from "ol/geom";
import {fromLonLat, transform} from "ol/proj";
import AddActivityForm from "./AddActivityForm";

const MapBase = () => {
    const [ map, setMap ] = useState()
    const [ activitiesLayer, setActivitiesLayer ] = useState(new VectorLayer({
        source: new VectorSource()
    }))
    const [ overlay, setOverlay ] = useState(new Overlay({
        element: null,
        autoPan: {
            animation: {
                duration: 250,
            },
        },
    }))
    const [ selectedCoord, setSelectedCoord ] = useState()

    const mapElement = useRef()
    const overlayElement = useRef()
    const mapRef = useRef()

    mapRef.current = map

    const addActivityToMap = (activity) => {
        const feature = new Feature({
            geometry: new Point(
                fromLonLat([activity.coordinates.long, activity.coordinates.lat])
            )
        });
        activitiesLayer.getSource().addFeature(feature);
    }

    const updateActivities = () => {
        activitiesService.getActivities().then((activities) => {
            activities.forEach(activity => addActivityToMap(activity));
        })
    }

    useEffect(() => {
        updateActivities();
        if (map !== undefined) return;
        const initialMap = new Map({
            target: mapElement.current,
            view: new View({
                center: [3245000, 9923000],
                zoom: 13
            }),
            overlays: [overlay],
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                activitiesLayer
            ],
        });
        initialMap.on('click', handleMapClick)
        setMap(initialMap)
        overlay.setElement(overlayElement.current)
    }, []);

    const handleMapClick = (event) => {
        const clickedCoord = mapRef.current.getCoordinateFromPixel(event.pixel);
        const coord = transform(clickedCoord,  'EPSG:3857', "EPSG:4326")
        overlay.setPosition(clickedCoord)
        setSelectedCoord(coord);
    }

    const closeOverlay = () => {
        overlay.setPosition(undefined);
    }

    return (
        <>
            <div ref={mapElement} id="map"></div>
            <div ref={overlayElement} id="popup" className="ol-popup">
                <a href="#" id="popup-closer" className="ol-popup-closer" onClick={closeOverlay}></a>
                <div id="popup-content"><AddActivityForm coordinates={selectedCoord} close={closeOverlay} addActivityToMap={addActivityToMap}/></div>
            </div>
        </>
    );
};

export default MapBase;
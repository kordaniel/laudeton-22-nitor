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
import {fromLonLat} from "ol/proj";
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
        if (map !== undefined) return;
        const initialMap = new Map({
            target: mapElement.current,
            view: new View({
                center: [3617200, 4951081],
                zoom: 5,
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
        console.log(initialMap)
        overlay.setElement(overlayElement.current)
    }, []);

    const handleMapClick = (event) => {
        const clickedCoord = mapRef.current.getCoordinateFromPixel(event.pixel);
        overlay.setPosition(clickedCoord)
        setSelectedCoord(clickedCoord);
    }

    const closeOverlay = () => {
        overlay.setPosition(undefined);
    }

    return (
        <>
            <div ref={mapElement} id="map"></div>
            <div ref={overlayElement} id="popup" className="ol-popup">
                <a href="#" id="popup-closer" className="ol-popup-closer" onClick={closeOverlay}></a>
                <div id="popup-content"><AddActivityForm coordinates={selectedCoord} close={closeOverlay}/></div>
            </div>
        </>
    );
};

export default MapBase;
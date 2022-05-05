import React, { useEffect, useState, useRef } from 'react';
import {Feature, Map, Overlay, View} from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import 'ol/ol.css';
import './MapBase.css';
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import activitiesService from "../services/activitiesService";
import {LineString, Point} from "ol/geom";
import {fromLonLat, transform} from "ol/proj";
import AddActivityForm from "./AddActivityForm";
import ActivityInfo from "./ActivityInfo";
import {Stroke, Style} from "ol/style";

const MapBase = () => {
    const svg = ""
    const [ map, setMap ] = useState()
    const [ activitiesLayer, setActivitiesLayer ] = useState(new VectorLayer({
        source: new VectorSource()
    }))
    const [ pathLayer, setPathLayer ] = useState(new VectorLayer({
        source: new VectorSource(),
        style: new Style({
            stroke : new Stroke({
                color: '#0000ff',
                width: 2
            })
        })
    }))
    const [ overlay, setOverlay ] = useState(new Overlay({
        element: null,
        autoPan: {
            animation: {
                duration: 250,
            },
        },
    }))
    const [ selectOverlay, setSelectOverlay ] = useState(new Overlay({
        element: null,
        autoPan: {
            animation: {
                duration: 250,
            },
        },
    }))
    const [ selectedCoord, setSelectedCoord ] = useState()
    const [ selectedFeature, setSelectedFeature] = useState()

    const mapElement = useRef()
    const overlayElement = useRef()
    const selectOverlayElement = useRef()
    const mapRef = useRef()

    mapRef.current = map

    const addActivityToMap = (activity) => {
        const feature = new Feature({
            geometry: new Point(
                fromLonLat([activity.coordinates.long, activity.coordinates.lat])
            ),
        });
        feature.setId(activity.id);
        console.log(activity.id)
        activitiesLayer.getSource().addFeature(feature);
        pathLayer.getSource().getFeatures().forEach(feat => feat.getGeometry().appendCoordinate(feature.getGeometry().getCoordinates()));
    }

    const updateActivities = () => {
        activitiesService.getActivities().then((activities) => {
            activities.forEach(activity => addActivityToMap(activity));
            const points = activitiesLayer.getSource().getFeatures().map(feat => feat.getGeometry().getCoordinates());
            pathLayer.getSource().addFeature(new Feature({
                geometry: new LineString(points)
            }))
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
            overlays: [overlay, selectOverlay],
            layers: [
                new TileLayer({
                    source: new OSM(),
                }),
                activitiesLayer, pathLayer
            ]
        });
        initialMap.on('click', handleMapClick)
        setMap(initialMap)
        overlay.setElement(overlayElement.current)
        selectOverlay.setElement(selectOverlayElement.current)
    }, []);

    const handleMapClick = (event) => {
        closeOverlay();
        const featuresAtPixel = mapRef.current.getFeaturesAtPixel(event.pixel);
        if (featuresAtPixel.length > 0) {
            const feature = featuresAtPixel[0]
            console.log(feature)
            const coordinates = feature.getGeometry().getCoordinates()
            const pixel = mapRef.current.getPixelFromCoordinate(coordinates);
            setSelectedFeature(feature)
            selectOverlay.setPosition(coordinates);
        } else {
            const clickedCoord = mapRef.current.getCoordinateFromPixel(event.pixel);
            const coord = transform(clickedCoord,  'EPSG:3857', "EPSG:4326")
            overlay.setPosition(clickedCoord)
            setSelectedCoord(coord);
        }

    }

    const closeOverlay = () => {
        overlay.setPosition(undefined);
        selectOverlay.setPosition(undefined);
    }

    return (
        <>
            <div ref={mapElement} id="map"></div>
            <div ref={overlayElement} id="popup" className="ol-popup">
                <a href="#" className="ol-popup-closer" onClick={closeOverlay}></a>
                <div id="popup-content"><AddActivityForm coordinates={selectedCoord} close={closeOverlay} addActivityToMap={addActivityToMap}/></div>
            </div>
            <div ref={selectOverlayElement} className="ol-popup">
                <a href="#" className="ol-popup-closer" onClick={closeOverlay}></a>
                <div id="popup-content"><ActivityInfo id={selectedFeature?.getId()}/></div>
            </div>
        </>
    );
};

export default MapBase;
import Map from "./ol/Map.js"
import View from "./ol/View.js"
import Feature from "./ol/Feature.js";
import OSM from "./ol/source/OSM.js"
import {getTransform, transform} from "./ol/proj.js"
import {ScaleLine, defaults as defaultControls} from './ol/control.js';
import {DragRotateAndZoom, defaults as defaultInteractions} from "./ol/interaction.js";
import TileLayer from "./ol/layer/Tile.js";
import VectorTileSource from "./ol/source/VectorTile.js"
import VectorTileLayer from "./ol/layer/VectorTile.js";
import MVT from "./ol/format/MVT.js";
import {createBasicStyle} from "./ol/style/basic.js"

const map = new Map({
    target: 'map',
    controls: defaultControls().extend([new ScaleLine({ units : "metric"})]),
    interactions: defaultInteractions().extend([new DragRotateAndZoom()]),
});

//View 설정, EPSG 3857
function EPSG3857_OLMapView(pLongitude, pLatitude, pZoom)
{
    map.setView(new View({
        center: [pLongitude , pLatitude], //3857에 좌표계
        zoom: pZoom,
        minZoom: 3,
        maxZoom: 15,
    }));
}

function EPSG4326_OLMapView(pLatitude, pLongitude, pZoom)
{
    var _pos = ConvertEPSG4326toEPSG3857(pLatitude, pLongitude);

    EPSG3857_OLMapView(_pos[0], _pos[1], pZoom);
}

//GPS 좌표계를 지도의 숫자값으로 변환한다.
function ConvertEPSG4326toEPSG3857(pLatitude, pLongitude)
{
    var _pos = transform([pLongitude, pLatitude], 'EPSG:4326', 'EPSG:3857');
    return _pos;
}

function create_vectorlayer(url_str) {
    map.addLayer(new VectorTileLayer({
        source : new VectorTileSource({
            format : new MVT(),
            url: url_str,
        }),
        style : function (feature,resolution) {
            return createBasicStyle(feature, resolution);
        }
    }));
}


window.onload = function () {
    EPSG4326_OLMapView(33.35,126.55,5);
    create_vectorlayer('http://192.168.0.86:3650/api/tiles/maptiler-planet/{z}/{x}/{y}');
}
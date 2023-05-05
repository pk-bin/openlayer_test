import Style from "./Style.js";
import Fill from "./Fill.js";
import Stroke from "./Stroke.js";
import Icon from "./Icon.js";
import Text from "./Text.js";
import fill from "./Fill.js";

/// used osm-bright-gl-style 사용.
export function createBasicStyle(feature , resolution) {
    var layer = feature.get('layer');
    var type = feature.getGeometry().getType()

    switch (layer) {
        case 'boundary':
            return createBoundary(
                feature.get('admin_level'),
                feature.get('maritime'),
                feature.get('disputed'),
                resolution);
        case 'water':
            return createWater();
        case 'landcover':
            return createLandCover(feature.get('class'),resolution);
        case 'park':
            //return createPark(feature.get('class'));
            break;
        case 'landuse':
            //return createLanduse(feature.get('class'),resolution);
            break;
        case 'transportation':
            /*
            return createTransportation(feature.get('class'),
                type,
                feature.get('brunnel'),
                feature.get('ramp'),
                resolution);
            */
            break;
        default:
            return null;
    }
}
function ZoomToResolution(zoom_level) {
    let origin_zero_resolution = 156543.03390625;

    return origin_zero_resolution / Math.pow(2, zoom_level);
}

function createStopsColor(stops , resolution , r, g, b ,a) {
    let i;
    let opacity = a;
    for (i = stops.length - 1; i >= 0; --i)  {
        stop = stops[i];
        if (resolution <= ZoomToResolution(stop[0])) {
            opacity = stop[1];
            break;
        }
    }
    return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
}
function createStopsWidth(stops , resolution , default_width) {
    let i;
    let width = default_width;
    for (i = stops.length - 1; i >= 0; --i) {
        stop = stops[i];
        if (resolution <= ZoomToResolution(stop[0])) {
            width = stop[1];
            break;
        }
    }
    return width;
}

/// landcover 설정
function createLandCover(cls, resolution) {
    switch (cls) {
        case 'wood':
            if (resolution <= ZoomToResolution(10)) {

                let _icon = new Icon({
                    src : 'http://127.0.0.1:8080/svg_file/dots-t.svg',
                    color : 'rgba(94, 94, 94, 0.5)',
                    size: [32,32],
                });

            }
        case 'grass':
            if (resolution <= ZoomToResolution(10)) {
                let _icon = new Icon({
                    src : 'http://127.0.0.1:8080/svg_file/dash-t.svg',
                    color : 'rgba(94, 94, 94, 0.5)',
                    size: [32,32],
                });
                let _image = _icon.getImage(undefined,1);
                return new Style({
                    fill : new fill({
                        color : _image.getContext('2d').createPattern(_image,'repeat'),
                    }),
                });
            }
            break;
        default:
            return null;

    }
}
/// water 설정
function createWater() {
    return new Style({
        fill : new Fill({
            color: 'hsl(210, 67%, 85%)',
        }),
    });
}
/// Boundary style 생성
function createBoundary(level , maritime, disputed , resolution) {
    //boundary-land-level-4
    if ( level >= 3 && level <= 6 && maritime != 1) {
        if(resolution <= ZoomToResolution(2)) {
            return new Style({
                stroke: new Stroke({
                    color: '#9e9cab',
                    lineDash: [3, 1, 1, 1],
                    width: createStopsWidth([[4, 0.4], [5, 1], [12, 2.5]], resolution, 1.4),
                    lineJoin: 'round',
                }),
            });
        }
    }
    //boundary-land-level-2
    if ( level == 2 && maritime != 1 && disputed != 1) {
        return new Style({
            stroke: new Stroke({
                color: 'hsl(248, 7%, 66%)',
                width: createStopsWidth([[0, 0.6], [4, 1.4], [5, 2], [12, 8]], resolution, 1),
                lineCap: 'round',
                lineJoin: 'round',
            }),
        });
    }

    //boundary-land-disputed
    if ( maritime != 1 && disputed == 1) {
        return new Style({
            stroke: new Stroke({
                color: 'hsl(248, 7%, 70%)',
                lineDash: [1, 3],
                width: createStopsWidth([[0, 0.6], [4, 1.4], [5, 2], [12, 8]], resolution, 1),
                lineCap: 'round',
                lineJoin: 'round',
            }),
        });
    }
    return null;
}
/// landuse 설정
function createLanduse(cls, resolution) {
    switch (cls) {
        case 'railway':
            return new Style({
                fill : new Fill({
                    color: 'hsla(30, 19%, 90%, 0.4)',
                }),
            });
        default:
            return null;
    }
}
/// Transportation
function createTransportation(cls,type,brunnel,ramp,resolution) {
    switch (cls) {
        case 'service':
        case 'track':
            return createServiceTrack(type,brunnel,ramp,resolution);
        case 'motorway':
            return createMotorway(type,brunnel,ramp,resolution);
        case 'rail':
            return new Style({
                stroke: new Stroke({
                    color: 'hsl(34, 12%, 66%)',
                    width: 2
                })
            });
        case 'ferry':
            return new Style({
                stroke: new Stroke({
                    color: 'rgba(108, 159, 182, 1)',
                    lineDash: [2,2],
                    width: 1.1,
                })
            });
        case 'pier':
            switch (type) {
                case 'Polygon':
                    return new Style({
                        fill: new Fill({
                            color: '#f8f4f0',
                        })
                    });
                    break;
                case 'LineString':
                    return new Style({
                        stroke: new Stroke({
                            color: '#f8f4f0',
                            width: createStopsWidth([[15, 1], [17, 4]], resolution, 1.2),
                        })
                    });
                    break;
            }
            break;

        default:
            break;
    }
    return null;
}

function createServiceTrack(type,brunnel,ramp,resolution) {
    switch (brunnel) {
        case 'tunnel':
            return new Style({
                stroke: new Stroke({
                    color: '#fff',
                    width: createStopsWidth([[15.5, 0], [16, 2], [20, 7.5]], resolution, 1.2),
                    lineJoin: 'round',
                })
            });
            break;
        case 'bridge':
            if(type == 'LineString') {
                return new Style({
                    stroke: new Stroke({
                        color: '#fff',
                        width: createStopsWidth([[13.5, 0], [14, 2.5], [20, 11.5]], resolution, 1.2),
                        lineJoin: 'round',
                        lineCap: 'round',
                    })
                });
            }
            break;
        default:
            if(type == 'LineString') {
                return new Style({
                    stroke: new Stroke({
                        color: '#fff',
                        width: createStopsWidth([[13.5, 0], [14, 2.5], [20, 11.5]], resolution, 1.2),
                        lineJoin: 'round',
                        lineCap: 'round',
                    })
                });
            }
            break;
    }
    return null;
}
function createMotorway(type,brunnel,ramp,resolution) {
    switch (brunnel) {
        case 'tunnel':
            if (ramp == 1) {
                return new Style({
                    stroke: new Stroke({
                        color: 'rgba(200, 147, 102, 1)',
                        width: createStopsWidth([[12.5, 0], [13, 1.5], [14, 2.5], [20, 11.5]], resolution, 1.2),
                        lineJoin: 'round',
                    })
                });
            } else {
                return new Style({
                    stroke: new Stroke({
                        color: '#ffdaa6',
                        width: createStopsWidth([[6.5, 0], [7, 0.5], [20, 18]], resolution, 1.2),
                        lineJoin: 'round',
                        lineCap: 'round'
                    })
                });
            }
            break;
        case 'bridge':
            if (ramp == 1) {
                return new Style({
                    stroke: new Stroke({
                        color: '#fc8',
                        width: createStopsWidth([[12.5, 0], [13, 1.5], [14, 2.5], [20, 11.5]], resolution, 1.2),
                        lineJoin: 'round',
                        lineCap: 'round'
                    })
                });
            } else {
                return new Style({
                    stroke: new Stroke({
                        color: '#fc8',
                        width: createStopsWidth([[6.5, 0], [7, 0.5], [20, 18]], resolution, 1.2),
                        lineJoin: 'round',
                        lineCap: 'round'
                    })
                });
            }
            break;
        default:
            if (ramp == 1) {
                return new Style({
                    stroke: new Stroke({
                        color: '#fc8',
                        width: createStopsWidth([[12.5, 0], [13, 1.5], [14, 2.5], [20, 11.5]], resolution, 1.2),
                        lineJoin: 'round',
                        lineCap: 'round'
                    })
                });
            } else {
                if (type == 'LineString') {
                    return new Style({
                        stroke: new Stroke({
                            color: '#fc8',
                            width: createStopsWidth([[6.5, 0], [7, 0.5], [20, 18]], resolution, 1.2),
                            lineJoin: 'round',
                            lineCap: 'round,'
                        })
                    });
                }
            }
            break;
    }
}



/*
export const exportStyle =
    [
        { "id" : "landuse-residential" , "style" : new Style({
                fill : new Fill({
                    color : layer_style['background'].paint["background-color"]
                })
            })},
        { "id" : "background" , "style" : new Style({
                fill : new Fill({
                    color : layer_style['background'].paint["background-color"]
                })
            })},
        { "id" : "background" , "style" : new Style({
                fill : new Fill({
                    color : layer_style['background'].paint["background-color"]
                })
            })},
        { "id" : "background" , "style" : new Style({
                fill : new Fill({
                    color : layer_style['background'].paint["background-color"]
                })
            })},
        { "id" : "background" , "style" : new Style({
                fill : new Fill({
                    color : layer_style['background'].paint["background-color"]
                })
            })},
        { "id" : "background" , "style" : new Style({
                fill : new Fill({
                    color : layer_style['background'].paint["background-color"]
                })
            })},
    ]
*/
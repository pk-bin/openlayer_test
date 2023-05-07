import Style from "./Style.js";
import Fill from "./Fill.js";
import Stroke from "./Stroke.js";
import Icon from "./Icon.js";
import Text from "./Text.js";
import fill from "./Fill.js";
import Circle from "./Circle.js";
import {DotsSvg} from "./../../../svg_file/TonerStyle.js";
import style from "./Style.js";
import text from "./Text.js";

const wood_svg = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
                <svg width="8" height="8" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="4" cy="4" r="3" fill="rgba(0,255,127,1)"/>
                </svg>`);

const glass_svg= 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(`
                <svg width="8" height="8" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="4" cy="4" r="3"  fill="rgba(111,193,61,0.75)"/>
                </svg>`);

let glass_image = new Image();
let glass_context = document.createElement('canvas').getContext('2d');

let wood_image = new Image();
let wood_context = document.createElement('canvas').getContext('2d');

export function createStyleInit() {
    wood_image.src = wood_svg;
    glass_image.src = glass_svg;
}

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
            return createTransportation(feature.get('class'),
                type,
                resolution);
        case 'water_name':
            return createWaterName(feature.get('class'),type,feature.get('name:ko'),feature.get('name:latin'),feature.get('name:nonlatin'),resolution);
        case 'transportation_name':
            return createTransportationName(feature.get('class'),type,feature.get('name:ko'),feature.get('name:latin'),feature.get('name:nonlatin'),resolution);
        case 'place':
            return createPlace(feature.get('class'),type,feature.get('name:ko'),feature.get('name:latin'),feature.get('name:nonlatin'),resolution);
        default:
            return null;
    }
}
function ZoomToResolution(zoom_level) {
    let origin_zero_resolution = 156543.03390625;

    return origin_zero_resolution / Math.pow(2, zoom_level);
}

function createStopsColor(stops , resolution , param_color) {
    let i;
    let default_color = param_color;
    for (i = stops.length - 1; i >= 0; --i)  {
        stop = stops[i];
        if (resolution <= ZoomToResolution(stop[0])) {
            default_color = stop[1];
            break;
        }
    }
    return default_color;
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
function createStopsDash(stops , resolution , default_dash) {
    let i;
    let dash = default_dash;
    for (i = stops.length - 1; i >= 0; --i) {
        stop = stops[i];
        if (resolution <= ZoomToResolution(stop[0])) {
            dash = stop[1];
            break;
        }
    }
    return dash;
}
function createStopFont(stops , resolution, default_font) {
    let i;
    let _font = default_font;
    for (i = stops.length - 1; i >= 0; --i) {
        stop = stops[i];
        if (resolution <= ZoomToResolution(stop[0])) {
            _font = stop[1];
            break;
        }
    }
    return _font;
}
function getDisplayLabelValue(name_ko,name_latin,name_nonlatin) {
    if(name_ko !== undefined) {
        return name_ko;
    }
    if(name_latin !== undefined) {
        return name_latin;
    }
    if(name_nonlatin !== undefined) {
        return name_nonlatin;
    }
    return '';
}

function createPlace(cls, type , name_ko,name_latin,name_nonlatin, resolution) {
    switch (cls) {
        case 'village':
        case 'hamlet':
            if(type == 'Point') {
                if (resolution <= ZoomToResolution(12)) {
                    return new style({
                        text : new Text({
                            overflow: true,
                            text :getDisplayLabelValue(name_ko,name_latin,name_nonlatin),
                            font : 'Regular 12px Nunito',
                            placement : 'point',
                            fill : new Fill({
                                color : 'rgba(11,11,11,1)',
                            }),
                        }),
                    })
                }
            }
            break;
        case 'city':
            if(type == 'Point') {
                if (resolution <= ZoomToResolution(4)) {
                    return new style({
                        text : new Text({
                            overflow: true,
                            text :getDisplayLabelValue(name_ko,name_latin,name_nonlatin),
                            font : createStopFont([[4,'Bold 12px Nunito'],[7,'Bold 13px Nunito'],[8,'Bold 14px Nunito'],[16,'Bold 26px Nunito']],resolution,'Bold 12px Nunito'),
                            placement : 'point',
                            fill : new Fill({
                                color : 'rgba(0,0,0,1)',
                            }),
                        }),
                    })
                }
            }
            break;
        case 'town':
            if(type == 'Point') {
                if (resolution <= ZoomToResolution(10)) {
                    return new style({
                        text : new Text({
                            overflow: true,
                            text :getDisplayLabelValue(name_ko,name_latin,name_nonlatin),
                            font : createStopFont([[8,'Regular 15px Nunito'],[14,'Regular 15px Nunito'],[16,'Regular 18px Nunito']],resolution,'Regular 15px Nunito'),
                            placement : 'point',
                            fill : new Fill({
                                color : 'rgba(0,0,0,1)',
                            }),
                        }),
                    })
                }
            }
            break;
        case 'state':
            if (resolution <= ZoomToResolution(4)) {
                return new style({
                    text : new Text({
                        overflow: true,
                        text :getDisplayLabelValue(name_ko,name_latin,name_nonlatin),
                        font : 'Semi Bold 13px Nunito',
                        fill : new Fill({
                            color : 'rgba(0,0,0,1)',
                        }),
                    }),
                })
            }
            break;
        case 'country':
            return new style({
                text : new Text({
                    overflow: true,
                    text :getDisplayLabelValue(name_ko,name_latin,name_nonlatin),
                    font : createStopFont([[3,'Bold 14px Nunito'],[4,'Bold 16px Nunito'],[5,'Bold 21px Nunito']],resolution,'Bold 14px Nunito'),
                    fill : new Fill({
                        color : 'rgba(0,0,0,1)',
                    }),
                }),
            })
            break;
        default:
            break;
    }
    return null;
}

function createTransportationName(cls, type , name_ko,name_latin,name_nonlatin, resolution) {
    switch (cls) {
        case 'minor':
        case 'service':
        case 'track':
            if (resolution <= ZoomToResolution(14.5)) {
                return new style({
                    text : new Text({
                        overflow: true,
                        text :getDisplayLabelValue(name_ko,name_latin,name_nonlatin),
                        font : 'Regular 13px Noto Sans',
                        placement : 'line',
                        fill : new Fill({
                            color : 'rgba(0,0,0,1)',
                        }),
                    }),
                })
            }
            break;
        case 'secondary':
        case 'tertiary':
        case 'trunk':
        case 'primary':
            if (resolution <= ZoomToResolution(14.5)) {
                return new style({
                    text : new Text({
                        overflow: true,
                        text :getDisplayLabelValue(name_ko,name_latin,name_nonlatin),
                        font : 'Regular 13px Noto Sans',
                        placement : 'line',
                        fill : new Fill({
                            color : 'rgba(0,0,0,1)',
                        }),
                    }),
                })
            }
            break;
        default:
            break;
    }
    return null;
}

function createWaterName(cls, type , name_ko,name_latin,name_nonlatin, resolution) {
    switch (cls) {
        case 'ocean':
            if (resolution <= ZoomToResolution(2)) {
                return new style({
                    text : new Text({
                        overflow: true,
                        text :getDisplayLabelValue(name_ko,name_latin,name_nonlatin),
                        font : 'Italic 14px Noto Sans',
                        placement : 'point',
                        padding : [5,2,5,2],
                        fill : new Fill({
                            color : 'rgba(255,255,255,1)',
                        }),
                    }),
                })
            }
            break;
        case 'sea':
            if (resolution <= ZoomToResolution(4)) {
                return new style({
                    text : new Text({
                        overflow: true,
                        text :getDisplayLabelValue(name_ko,name_latin,name_nonlatin),
                        font : 'Italic 14px Noto Sans',
                        placement : 'point',
                        padding : [5,2,5,2],
                        fill : new Fill({
                            color : 'rgba(255,255,255,1)',
                        }),
                    }),
                })
            }
            break;
        default:
            break;
    }
    return null;
}

/// landcover 설정
function createLandCover(cls, resolution) {
    switch (cls) {
        case 'grass':
            if(resolution < ZoomToResolution(10)) {
                return new Style({
                    fill : new fill({
                        color : glass_context.createPattern(glass_image,'repeat'),
                    }),
                });
            }
            break;
        case 'wood':
            if(resolution < ZoomToResolution(10)) {
                return new Style({
                    fill : new fill({
                        color : wood_context.createPattern(wood_image,'repeat'),
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
    if ( (level >= 3 && level < 6) && maritime != 1) {
        return new Style({
            stroke: new Stroke({
                color: 'rgba(0,0,0,1)',
                lineDash: [1, 2],
                width: createStopsWidth([[5, 1], [6, 2]], resolution, 1),
                lineCap: 'round',
                lineJoin: 'round',
            }),
        });
    }
    //boundary-land-level-2
    if ( level == 2 && maritime != 1) {
        return new Style({
            stroke: new Stroke({
                color: 'rgba(0,0,0,1)',
                lineDash: [1, 2],
                width: createStopsWidth([[5, 1], [6, 2]], resolution, 1),
                lineCap: 'round',
                lineJoin: 'round',
            }),
        });
    }
    return null;
}

/// Transportation
function createTransportation(cls,type,resolution) {
    switch (cls) {
        case 'motorway':
        case 'trunk':
            return createRoadHighway(type,resolution);
        case 'rail':
            return createRail(resolution);
        case 'path':
            return createPath(type,resolution);
        case 'secondary':
        case 'tertiary':
        case 'minor':
        case 'service':
            return createSecondary(type,resolution);
        case 'primary':
            return createPrimary(type,resolution);
        default:
            break;
    }
    return null;
}
function createPrimary(type,resolution) {
    if(type == 'LineString') {
        if (resolution <= ZoomToResolution(10)){
            return new Style({
                stroke: new Stroke({
                    color: createStopsColor([[8,'rgba(0,0,0,0.19)'], [10,'rgba(0,0,0,0.6)'],[17,'rgba(0,0,0,1)']],resolution, 'rgba(0,0,0,0.3)'),
                    width: createStopsWidth([[12, 0.75], [15, 6],[17, 8]], resolution, 0.75),
                    lineCap: 'round',
                    lineJoin: 'round',
                }),
            });
        }
    }
    return null;
}

function createSecondary(type,resolution) {
    if(type == 'LineString') {
        if (resolution <= ZoomToResolution(10)){
            return new Style({
                stroke: new Stroke({
                    color: createStopsColor([[10,'rgba(0,0,0,0.3)'], [10,'rgba(0,0,0,0.5)'],[16,'rgba(0,0,0,1)']],resolution, 'rgba(0,0,0,0.3)'),
                    width: createStopsWidth([[13, 0.5], [15, 3],[17, 8]], resolution, 0.5),
                    lineCap: 'round',
                    lineJoin: 'round',
                }),
            });
        }
    }
    return null;
}

function createPath(type, resolution) {
    if(type == 'LineString') {
        if (resolution <= ZoomToResolution(14)) {
            return new Style({
                stroke: new Stroke({
                    color: 'rgba(255,255,255,1)',
                    width: createStopsWidth([[14, 2], [17, 14]], resolution, 2),
                    lineCap: 'round',
                    lineJoin: 'round',
                }),
            });
        }
    }
    return null;
}

function createRail(resolution) {
    if (resolution <= ZoomToResolution(13)) {
        if (resolution <= ZoomToResolution(15)) {
            const rail_default = new Style({
                stroke: new Stroke({
                    color: 'rgba(216, 216, 216, 1)',
                    width: 0.85,
                }),
            });
            const rail_hatch = new Style({
                stroke: new Stroke({
                    color: 'rgba(38, 38, 38, 1)',
                    lineDash: [0.2,0.8],
                    width: 2,
                }),
            })
            return [rail_hatch, rail_default];
        }
        return new Style({
            stroke: new Stroke({
                color: 'rgba(216, 216, 216, 1)',
                width: 0.85,
            }),
        })
    }
}

function createRoadHighway(type, resolution) {
    if(type == 'LineString') {
        if (resolution <= ZoomToResolution(9)) {
            const highway_defulat = new Style({
                stroke: new Stroke({
                    color: createStopsColor([[6,'rgba(0,0,0,0.2)'], [10,'rgba(0,0,0,0.6)'],[16,'rgba(0,0,0,1)']],resolution, 'rgba(0,0,0,0.2)'),
                    width: createStopsWidth([[7, 1], [10, 2], [16, 8]], resolution, 1),
                    lineCap: 'round',
                    lineJoin: 'round',
                }),
            });
            const highway_cash = new Style({
                stroke: new Stroke({
                    color: createStopsColor([[8,'rgba(219,219,219,1)'], [10,'rgba(255,255,255,1)'],[16,'rgba(255,255,255,1)']],resolution, 'rgba(219,219,219,1)'),
                    width: createStopsWidth([[10, 4], [16, 16]], resolution, 3),
                    lineCap: 'round',
                    lineJoin: 'round',
                }),
            });
            return [highway_cash, highway_defulat];
        }
    }
    return null;
}
/* eslint-disable react/prop-types */
import React from 'react';
import mapboxgl from 'mapbox-gl';
import config from '../../config.json';
import 'mapbox-gl/dist/mapbox-gl.css';

const { TOKEN, MAPBOX_STYLE, INITIAL_COORD, INITIAL_ZOOM } = config;

function CCTVMap(props) {
  const { mapRef, popupRef } = props;

  // const {position, zoom, backgroundColor} = savedOptions;
  const mapContainerRef = React.useRef(null);

  // initialize map
  React.useEffect(() => {
    if (mapContainerRef.current === null) {
      console.error('mapContainer is null');
      return;
    }
    console.log('set new Map instance');
    mapboxgl.accessToken = TOKEN;
    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: MAPBOX_STYLE,
      center: INITIAL_COORD,
      zoom: INITIAL_ZOOM,
    });
    // eslint-disable-next-line consistent-return
    return () => {
      mapRef.current.remove();
    };
  }, [mapRef]);

  const handleClick = React.useCallback(
    (event) => {
      console.log(event);
      const map = mapRef.current;
      const { lngLat } = event;
      const { lat, lng } = lngLat;
      console.log('lll show msgbox');
      popupRef.current = new mapboxgl.Popup({
        offset: [0, -15],
        closeButton: false,
      })
        .setLngLat([lng, lat])
        .setHTML(
          `<h3 style="font-size: 20px; min-width: 200px;text-align: center;color: black;">AA</h3>`,
        )
        .addTo(map);
    },
    [mapRef, popupRef],
  );

  // attach event handler
  React.useEffect(() => {
    if (mapRef.current === null) {
      return;
    }
    const map = mapRef.current;
    map.on('click', handleClick);
    map.on('load', () => {
      // map.doubleClickZoom.disable();
      // map.touchZoomRotate.disable();
      // disable move by drag
      // map.dragPan.disable();
      // map.touchPitch.disable();

      // moveCenter(map, position);
      // changeZoom(map, zoom);

      // setBackgroundColor(map, backgroundColor)
    });
    // eslint-disable-next-line consistent-return
    return () => {
      mapRef.current.off('click', handleClick);
    };
  }, [handleClick, mapRef]);

  return <div id="map-container" ref={mapContainerRef} />;
}

export default React.memo(CCTVMap);

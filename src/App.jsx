import { useState, useRef } from "react";
import { hikes } from "./data";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";
import "./App.css";

const MAP_CENTER = { lat: 47.5, lng: -121.8 };
const MAP_ZOOM = 7;
const MAP_CONTAINER_STYLE = { width: "100%", height: "100vh" };

function App() {
  const [selected, setSelected] = useState(null);
  const [isStreetView, setIsStreetView] = useState(false);
  const mapRef = useRef(null);

  const handleStreetView = (coords) => {
    const map = mapRef.current;
    if (map) {
      const streetView = map.getStreetView();
      streetView.setPosition(coords);
      streetView.setPov({ heading: 100, pitch: 0 });
      streetView.setVisible(true);
      setIsStreetView(true);
    }
  };

  const handleMapView = () => {
    const map = mapRef.current;
    if (map) {
      const streetView = map.getStreetView();
      streetView.setVisible(false);
      setIsStreetView(false);
    }
  };

  return (
    <div className="app-container">
      <LoadScript googleMapsApiKey={"AIzaSyA7YM2A6eyE09Eum6dCeafdVb4p11Xdt6A"}>
        <div className="main-content">
          <div className="sidebar">
            <h1>Hike-gregator</h1>
            <ul className="hike-list">
              {hikes.map((hike) => (
                <li
                  key={hike.id}
                  className={selected?.id === hike.id ? "selected" : ""}
                  onClick={() => {
                    setSelected(hike);
                    handleMapView();
                  }}
                >
                  <strong>{hike.name}</strong>
                  <div className="hike-location">{hike.location}</div>
                  <div className="hike-stats">{hike.stats}</div>
                </li>
              ))}
            </ul>
          </div>
          <div className="map-panel">
            <GoogleMap
              mapContainerStyle={MAP_CONTAINER_STYLE}
              center={selected ? selected.coords : MAP_CENTER}
              zoom={selected ? 11 : MAP_ZOOM}
              onLoad={map => (mapRef.current = map)}
              options={{ streetViewControl: false }}
            >
              {hikes.map((hike) => (
                <Marker
                  key={hike.id}
                  position={hike.coords}
                  onClick={() => {
                    setSelected(hike);
                    handleMapView();
                  }}
                />
              ))}
            </GoogleMap>
            {selected && (
              <div className="hike-detail">
                <h2>{selected.name}</h2>
                <div className="hike-location">{selected.location}</div>
                <div className="hike-stats">{selected.stats}</div>
                <ul className="hike-highlights">
                  {selected.highlights.map((hl, i) => (
                    <li key={i}>{hl}</li>
                  ))}
                </ul>
                <div className="hike-note">{selected.speakerNote}</div>
                {!isStreetView ? (
                  <button
                    className="streetview-btn"
                    onClick={() => handleStreetView(selected.coords)}
                  >
                    Street View
                  </button>
                ) : (
                  <button
                    className="streetview-btn"
                    onClick={handleMapView}
                  >
                    Back to Map
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </LoadScript>
    </div>
  );
}

export default App;

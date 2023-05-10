import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import { GoogleMap } from "@react-google-maps/api";
import { useState } from "react";
import { PolylineF } from "@react-google-maps/api";

const mapContainerStyle = {
  height: "800px",
  width: "1200px"
}

const options = {
  strokeColor: '#000000',
  strokeOpacity: 1,
  strokeWeight: 3,
  fillColor: '#000000',
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 30000,
  zIndex: 1
};

const options2 = {
  strokeColor: '#AA0000',
  strokeOpacity: 1,
  strokeWeight: 1,
  fillColor: '#AA0000',
  fillOpacity: 0.35,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
  radius: 30000,
  zIndex: 1
};

function CrossingPointsObserver({ setLoggedOut, onLogout}) {

  const [data, setData] = useState([]);
  const [river, setRiver] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const controller = new AbortController()

    fetch("/river-catalog", {
        signal: controller.signal,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        if (res.status === 401 || res.status === 403) {
          setLoggedOut();
          localStorage.removeItem('token');
        }
        return res.json();
      })
      .then(data => {
        setData(data);
      })
      .catch(error => {
        if (error.name === 'SyntaxError') {
            alert('There was an error fetching data from the server. Please try again later.');
        }
    })
    
      return () => controller.abort();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const controller = new AbortController()

    fetch('/river', {
        signal: controller.signal,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
        .then(res => {
          if (res.status === 401 || res.status === 403) {
            setLoggedOut();
            localStorage.removeItem('token');
          }
          return res.json();
        })
        .then(json => {
            setRiver(json)
        })
        .catch(error => {
            if (error.name === 'SyntaxError') {
                alert('There was an error fetching data from the server. Please try again later.');
            }
        })

    return () => controller.abort();
}, [])

  return (
    <div>
      <h1>Crossing Points Observer</h1>
      <Navbar />
      <GoogleMap
        id="google-map"
        mapContainerStyle={mapContainerStyle}
        zoom={9}
        center={{
            "lng": 27.16827264000007,
            "lat": 41.35322476700003
        }}>

          {data && data.map((d) => {
            return <PolylineF
              path={d}
              options={options} />
          })}

          {river && river.map(riverBranch => (
            <PolylineF
                key={"id" + riverBranch.branchId}
                path={riverBranch.riverPoints}
                options={options2}/>
            ))}


        <PolylineF />

      </GoogleMap>
    </div>
  );
}

export default CrossingPointsObserver;
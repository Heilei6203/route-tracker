let map;
let routeCoords = [];
let userCoords = [];
let userMarker = null;
let routePolyline, userPolyline;
let isTracking = false;
let watchId = null;
let startTime = null;
let elapsedSeconds = 0;
let timerInterval = null;
let isTimerRunning = false;
let totalDistance = 0;

function initMap() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map = new google.maps.Map(document.getElementById('map'), {
        center: userLocation,
        zoom: 17,
      });
    }, () => {
      fallbackInit();
    });
  } else {
    fallbackInit();
  }
}

function fallbackInit() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 25.034, lng: 121.5645 },
    zoom: 15,
  });
}

function loadGpx(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const text = e.target.result;

    // 使用內建 DOMParser 解析 XML 字串
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(text, "application/xml");

    const trkpts = xmlDoc.getElementsByTagName("trkpt");
    if (!trkpts.length) {
      updateStatus("❌ GPX 中找不到任何 trkpt 路徑點");
      return;
    }

    routeCoords = Array.from(trkpts).map(pt => ({
      lat: parseFloat(pt.getAttribute("lat")),
      lng: parseFloat(pt.getAttribute("lon")),
    }));

    updateStatus(`✅ GPX 載入成功，共 ${routeCoords.length} 點`);

    if (routePolyline) routePolyline.setMap(null);
    routePolyline = new google.maps.Polyline({
      path: routeCoords,
      map,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 3,
    });

    if (routeCoords.length === 1) {
      map.setCenter(routeCoords[0]);
      map.setZoom(17);
    } else {
      const bounds = new google.maps.LatLngBounds();
      routeCoords.forEach(coord => bounds.extend(coord));
      map.fitBounds(bounds);
    }
  };

  reader.readAsText(file);
}

function toggleTracking() {
  isTracking = !isTracking;
  document.getElementById('toggleBtn').textContent = isTracking ? "暫停" : "開始";
  document.getElementById('endBtn').style.display = 'inline-block';

  isTracking ? startTracking() : stopTracking();
}

function startTracking() {
  if (userCoords.length === 0) {
    elapsedSeconds = 0;
    totalDistance = 0;
    document.getElementById("elapsedTime").textContent = '0';
    document.getElementById("totalDistance").textContent = '0.0';
    document.getElementById("avgSpeed").textContent = '0.0';
  }

  if (!userPolyline) {
    userPolyline = new google.maps.Polyline({
      path: [],
      map,
      strokeColor: "#0000FF",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
  }

  if (!isTimerRunning) {
    startTime = Date.now();
    timerInterval = setInterval(() => {
      const now = Date.now();
      const currentDuration = Math.floor((now - startTime) / 1000);
      const totalElapsed = elapsedSeconds + currentDuration;

      document.getElementById("elapsedTime").textContent = totalElapsed;
      const avg = totalDistance / totalElapsed;
      document.getElementById("avgSpeed").textContent = (avg * 3.6).toFixed(1);
    }, 1000);
    isTimerRunning = true;
  }

  watchId = navigator.geolocation.watchPosition((pos) => {
    const { latitude, longitude } = pos.coords;
    const position = new google.maps.LatLng(latitude, longitude);
    userCoords.push(position);
    userPolyline.setPath(userCoords);

    if (!userMarker) {
      userMarker = new google.maps.Marker({
        position,
        map,
        title: "你的位置",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: 'white',
        }
      });
    } else {
      userMarker.setPosition(position);
    }

    if (userCoords.length >= 2) {
      const prev = userCoords[userCoords.length - 2];
      const dist = google.maps.geometry.spherical.computeDistanceBetween(prev, position);
      if (dist > 1) {
        totalDistance += dist;
        document.getElementById("totalDistance").textContent = totalDistance.toFixed(1);
      }
    }

    const onRoute = routeCoords.some(p => {
      const routePoint = new google.maps.LatLng(p.lat, p.lng);
      return google.maps.geometry.spherical.computeDistanceBetween(position, routePoint) < 10;
    });

    updateStatus(onRoute ? "✅ 在路線上" : "❌ 偏離路線");
  }, (err) => {
    updateStatus("❌ 定位錯誤：" + err.message);
  }, {
    enableHighAccuracy: true,
    maximumAge: 1000,
    timeout: 5000
  });
}

function stopTracking() {
  if (watchId) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
  if (timerInterval) {
    const pausedAt = Date.now();
    const duration = Math.floor((pausedAt - startTime) / 1000);
    elapsedSeconds += duration;

    clearInterval(timerInterval);
    timerInterval = null;
    isTimerRunning = false;
  }
}

function endSession() {
  stopTracking();

  const elapsed = elapsedSeconds;
  const avg = totalDistance / elapsed;

  const summary = {
    distance: totalDistance.toFixed(1),
    duration: elapsed,
    avgSpeed: (avg * 3.6).toFixed(1),
    timestamp: new Date().toISOString()
  };

  localStorage.setItem("latestRide", JSON.stringify(summary));

  // ✅ 返回上層頁面
  window.location.href = "../";
}

function relocateUser() {
  if (!map) return;

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const userLocation = {
        lat: position.coords.latitude,
        lng: position.coords.longitude
      };

      map.setCenter(userLocation);
      map.setZoom(17);

      if (userMarker) {
        userMarker.setPosition(userLocation);
      } else {
        userMarker = new google.maps.Marker({
          position: userLocation,
          map,
          title: "你的位置",
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: 'white',
          }
        });
      }

      updateStatus("📍 已重新定位使用者位置");
    }, () => {
      updateStatus("❌ 無法取得目前位置");
    });
  } else {
    updateStatus("❌ 此瀏覽器不支援定位功能");
  }
}

function relocateRoute() {
  if (!map) return;

  if (!routeCoords.length) {
    updateStatus("❌ 尚未載入任何 GPX 路線");
    return;
  }

  if (routeCoords.length === 1) {
    map.setCenter(routeCoords[0]);
    map.setZoom(17);
  } else {
    const bounds = new google.maps.LatLngBounds();
    routeCoords.forEach(coord => bounds.extend(coord));
    map.fitBounds(bounds);
  }

  updateStatus("🎯 已定位至目標路線");
}


function updateStatus(text) {
  const statusEl = document.getElementById("status");
  if (statusEl) statusEl.textContent = text;
}

document.getElementById("gpxFile").addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) loadGpx(file);
});

window.onload = initMap;
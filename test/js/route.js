let map;
let routeCoords = [];
let userCoords = [];
let userMarker = null;
let routePolyline, userPolyline;
let isTracking = false;
let watchId = null;
let startTime = null;
let sessionStartTime = null;
let elapsedSeconds = 0;
let timerInterval = null;
let isTimerRunning = false;
let totalDistance = 0;
let averageSpeed = 0;

window.initMap = function () {
  const polylineStr = "e_wwCspwdVUzI";
  if (!polylineStr) {
    updateStatus("❌ 無法載入路線資料");
    return;
  }

  const decodedPath = google.maps.geometry.encoding.decodePath(polylineStr);
  if (decodedPath.length < 2) {
    updateStatus("❌ 路線資料不足");
    return;
  }

  routeCoords = decodedPath.map(latlng => ({ lat: latlng.lat(), lng: latlng.lng() }));

  map = new google.maps.Map(document.getElementById("map"), {
    center: decodedPath[0],
    zoom: 15
  });

  routePolyline = new google.maps.Polyline({
    path: decodedPath,
    map: map,
    strokeColor: '#FF0000',
    strokeOpacity: 0.9,
    strokeWeight: 7
  });

  const bounds = new google.maps.LatLngBounds();
  decodedPath.forEach(p => bounds.extend(p));
  map.fitBounds(bounds);

  new google.maps.Marker({
    position: decodedPath[0],
    map: map,
    label: "起點",
    icon: "http://maps.google.com/mapfiles/ms/icons/green-dot.png"
  });

  new google.maps.Marker({
    position: decodedPath[decodedPath.length - 1],
    map: map,
    label: "終點",
    icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
  });

  navigator.geolocation.getCurrentPosition((pos) => {
    const { latitude, longitude } = pos.coords;
    const position = new google.maps.LatLng(latitude, longitude);
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
  }, (err) => {
    updateStatus("⚠️ 目前位置讀取失敗：" + err.message);
  });
};

function toggleTracking() {
  isTracking = !isTracking;
  document.getElementById('toggleBtn').textContent = isTracking ? "暫停" : "開始";
  document.getElementById('endBtn').style.display = 'inline-block';
  isTracking ? startTracking() : stopTracking();
}

function startTracking() {
  updateStatus("🚶 等待 GPS 精準定位中...");

  let gpsReady = false;

  if (userCoords.length === 0) {
    sessionStartTime = getLocalTimeString();
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
      averageSpeed = avg * 3.6;
      document.getElementById("avgSpeed").textContent = averageSpeed.toFixed(1);
    }, 1000);
    isTimerRunning = true;
  }

  watchId = navigator.geolocation.watchPosition((pos) => {
    const { latitude, longitude, accuracy } = pos.coords;

    if (!gpsReady) {
      if (accuracy < 20) {
        gpsReady = true;
        updateStatus("📍 GPS 已穩定，開始記錄路線");
      } else {
        updateStatus(`⏳ GPS 不穩定 (精準度 ${Math.round(accuracy)}m)，等待中...`);
        return; // 不處理此點
      }
    }

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

    const onRoute = google.maps.geometry.poly.isLocationOnEdge(position, routePolyline, 0.0001);
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
  const confirmEnd = window.confirm("確認結束訓練？");
  if (!confirmEnd) return;

  if (!sessionStartTime) {
    location.href = '/';
    return;
  }

  stopTracking();

  const endTime = new Date();
  const filename = sessionStartTime.replace(/[: ]/g, '-');

  const durationMs = endTime - parseLocalTime(sessionStartTime);
  const durationSec = Math.floor(durationMs / 1000);

  const data = {
    start_time: sessionStartTime,
    duration: durationSec,
    distance: totalDistance,
    average_speed: averageSpeed
  };

  fetch('/save_ride', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename, data })
  }).then(res => {
    console.log('已儲存:', res);
    location.href = '/';
  });
}

function updateStatus(text) {
  const statusEl = document.getElementById("status");
  if (statusEl) statusEl.textContent = text;
}

function getLocalTimeString() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const MM = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  return `${yyyy}-${MM}-${dd} ${hh}:${mm}:${ss}`;
}

function parseLocalTime(timeStr) {
  const [datePart, timePart] = timeStr.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, minute, second] = timePart.split(':').map(Number);
  return new Date(year, month - 1, day, hour, minute, second);
}

const app = document.getElementById('app');
const navItems = document.querySelectorAll('.nav-item');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    navItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    const page = item.dataset.page;
    loadPage(page);
  });
});

function loadPage(page) {
  if (page === 'home') renderHome();
  else if (page === 'plans') renderPlans();
  else if (page === 'progress') renderProgress();
  else if (page === 'profile') renderProfile();
  else renderComingSoon(page);
}

// --- Home 頁 ---
function renderHome() {
  app.innerHTML = `
      <div class="logo">
        <h1>Fit</h1><span>Route AI</span>
      </div>

      <div class="welcome">
        <h2>Hello, ${user_name || 'Guest'}!</h2>
        <p>Select your cycling activity to get started</p>
      </div>
      <div class="activity-grid">
        <div class="activity-card" onclick="location.href='/mood'">Road Cycling</div>
        <div class="activity-card" onclick="location.href='/mood'">Mountain Biking</div>
        <div class="activity-card" onclick="location.href='/mood'">Time Trial</div>
        <div class="activity-card" onclick="location.href='/mood'">Training</div>
      </div>
    </div>
  `;
}

// --- Plans 頁 ---
function renderPlans() {
  app.innerHTML = `
    <div class="plans-header"><h2>Training Plans</h2></div>
    <div class="tabs">
      <div class="tab active" onclick="switchTab('week')">Week</div>
      <div class="tab" onclick="switchTab('month')">Month</div>
      <div class="tab" onclick="switchTab('custom')">Custom</div>
    </div>
    <div id="plan-content"></div>
  `;
  renderWeek();
}

function switchTab(tab) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  document.querySelector(`.tab[onclick*="${tab}"]`).classList.add('active');
  if (tab === 'week') renderWeek();
  else if (tab === 'month') renderMonth();
  else renderCustom();
}

function renderWeek() {
  document.getElementById('plan-content').innerHTML = `
    <div class="plan-week">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div><strong>May 13 - May 19</strong></div>
        <button class="button-edit" onclick="alert('Editing Plan (Mockup)')">Edit Plan</button>
      </div>
      <div class="weekdays">
        <div class="day-circle done">M</div><div class="day-circle done">T</div><div class="day-circle done">W</div><div class="day-circle">T</div><div class="day-circle">F</div><div class="day-circle">S</div><div class="day-circle">S</div>
      </div>
      <small>3/7 workouts completed</small>
    </div>
    <div class="plan-cards">
      <div class="plan-card">Monday - Recovery Ride<br><small>45 min Easy</small><div class="view-details" onclick="viewDetail('Recovery Ride')">View Details ></div></div>
      <div class="plan-card">Tuesday - Interval Training<br><small>60 min Hard</small><div class="view-details" onclick="viewDetail('Interval Training')">View Details ></div></div>
      <div class="plan-card">Wednesday - Rest Day<br><small>0 min Rest</small><div class="view-details" onclick="viewDetail('Rest Day')">View Details ></div></div>
      <div class="plan-card">Thursday - Tempo Ride<br><small>90 min Moderate</small><div class="view-details" onclick="viewDetail('Tempo Ride')">View Details ></div></div>
      <div class="plan-card">Friday - Skills Session<br><small>45 min Easy</small><div class="view-details" onclick="viewDetail('Skills Session')">View Details ></div></div>
      <div class="plan-card">Saturday - Long Endurance<br><small>120 min Moderate</small><div class="view-details" onclick="viewDetail('Long Endurance')">View Details ></div></div>
      <div class="plan-card">Sunday - Hill Repeats<br><small>75 min Hard</small><div class="view-details" onclick="viewDetail('Hill Repeats')">View Details ></div></div>
    </div>
    <div class="goals-section">
      <h3>Goals & Targets</h3>
      <div class="goal-card">Monthly Distance<br><div class="goal-bar"><div class="goal-bar-inner" style="width:68%"></div></div><small>342/500 km</small></div>
      <div class="goal-card">Weekly Ride Count<br><div class="goal-bar"><div class="goal-bar-inner" style="width:43%"></div></div><small>3/7 rides</small></div>
    </div>
  `;
}

function renderMonth() {
  document.getElementById('plan-content').innerHTML = '<p>Month plan coming soon...</p>';
}

function renderCustom() {
  document.getElementById('plan-content').innerHTML = '<p>Custom plan coming soon...</p>';
}

function viewDetail(title) {
  app.innerHTML = `
    <div class="plan-detail">
      <h2>${title}</h2>
      <p>Details about the plan: training instructions, goals, and expectations.</p>
      <button class="submit-btn" onclick="loadPage('plans')">Back to Plans</button>
    </div>
  `;
}

// --- Progress頁 ---
function renderProgress() {
  const app = document.getElementById('app');

  app.innerHTML = `
    <div class="plans-header">
      <h2>My Progress</h2>
      <div id="map-btn-container" style="text-align:center; margin-top: 15px;"></div>
    </div>

    <div class="tabs">
      <div class="tab active">Week</div>
      <div class="tab">Month</div>
      <div class="tab">Year</div>
    </div>

    <div class="activity-grid" style="grid-template-columns: repeat(2, 1fr); margin: 20px 0;">
      <div class="plan-card" style="text-align: center;">
        <div style="font-size: 24px; color: #3b82f6;">85 km</div>
        <small>Distance</small><br><small style="color:green;">+12% from last week</small>
      </div>
      <div class="plan-card" style="text-align: center;">
        <div style="font-size: 24px; color: #3b82f6;">19.2 km/h</div>
        <small>Avg. Speed</small><br><small style="color:green;">+1.5 km/h improvement</small>
      </div>
    </div>

    <div class="plans-header" style="margin-top: 30px;"><h3>Weekly Distance</h3></div>

    <div class="plan-card" style="text-align: center;">
      <small>Last 4 Weeks</small>
      <div style="display: flex; align-items: flex-end; justify-content: space-around; margin-top: 10px; height: 80px;">
        <div style="width: 15px; height: 60%; background: linear-gradient(#93c5fd, #3b82f6); border-radius: 8px;"></div>
        <div style="width: 15px; height: 70%; background: linear-gradient(#93c5fd, #3b82f6); border-radius: 8px;"></div>
        <div style="width: 15px; height: 50%; background: linear-gradient(#93c5fd, #3b82f6); border-radius: 8px;"></div>
        <div style="width: 15px; height: 65%; background: linear-gradient(#93c5fd, #3b82f6); border-radius: 8px;"></div>
      </div>
      <small>Distance trend chart</small>
    </div>

    <div class="plans-header" style="margin-top: 30px;"><h3>Achievements <span style="float:right;color:#1f4c8a;cursor:pointer;">See All</span></h3></div>

    <div class="activity-grid" style="grid-template-columns: repeat(2, 1fr);">
      <div class="plan-card">🏆<br><strong>Century Rider</strong><br><small>Completed May 10, 2023</small></div>
      <div class="plan-card">🌅<br><strong>Early Bird</strong><br><small>Completed May 5, 2023</small></div>
      <div class="plan-card">🏔️<br><strong>Elevation Master</strong><br><small>Climb 1000m a week</small></div>
      <div class="plan-card">🔄<br><strong>Consistent Rider</strong><br><small>Ride 3x per week</small></div>
    </div>

    <div class="plans-header" style="margin-top: 30px;">
  <h3>Recent Activities <span style="float:right;color:#1f4c8a;cursor:pointer;">See All</span></h3>
</div>

<div class="activity-grid" style="grid-template-columns: 1fr;">
  <div class="plan-card" style="display:flex; align-items:center; gap:10px;">
    <div style="font-size:24px;">🗺️</div>
    <div style="flex-grow:1;">
      <strong>Morning Commute</strong><br>
      <small>18.5 km ・ May 15, 2023 ・ <span style="color:green;">+2 min faster</span></small>
    </div>
    <div style="font-weight:bold;">55 min</div>
  </div>

  <div class="plan-card" style="display:flex; align-items:center; gap:10px;">
    <div style="font-size:24px;">🗺️</div>
    <div style="flex-grow:1;">
      <strong>Weekend Trail</strong><br>
      <small>32.2 km ・ May 13, 2023 ・ <span style="color:green;">+5 min faster</span></small>
    </div>
    <div style="font-weight:bold;">1h 40m</div>
  </div>

  <div class="plan-card" style="display:flex; align-items:center; gap:10px;">
    <div style="font-size:24px;">🗺️</div>
    <div style="flex-grow:1;">
      <strong>Evening Ride</strong><br>
      <small>12.8 km ・ May 11, 2023 ・ <span style="color:red;">-3 min slower</span></small>
    </div>
    <div style="font-weight:bold;">42 min</div>
  </div>
</div>
  `;

  const btnContainer = document.getElementById('map-btn-container');
  const mapBtn = document.createElement('button');
  mapBtn.textContent = '🚴 啟動路線追蹤';
  mapBtn.style.padding = '10px 20px';
  mapBtn.style.backgroundColor = '#3b82f6';
  mapBtn.style.color = 'white';
  mapBtn.style.border = 'none';
  mapBtn.style.borderRadius = '6px';
  mapBtn.style.cursor = 'pointer';
  mapBtn.onclick = () => {
    window.location.href = '/route';
  };
  btnContainer.appendChild(mapBtn);

  const last = JSON.parse(localStorage.getItem("latestRide") || "{}");
if (last.distance) {
  const rideSummary = document.createElement("div");
  rideSummary.className = "plan-card";
  rideSummary.innerHTML = `
    <strong>🗺️ 最新訓練結果</strong><br>
    時間：${last.duration} 秒<br>
    距離：${last.distance} 公尺<br>
    平均速度：${last.avgSpeed} km/h<br>
    <small>${last.timestamp}</small>
  `;
  document.querySelector('.activity-grid')?.prepend(rideSummary);
}

}

// --- Profile頁 ---
function renderProfile() {
  
  const fitnessGoals = {
    goal: "---",
    intensity: "---",
    distance: "---",
    rides: "---"
  };

  document.getElementById("app").innerHTML = `
    <div class="plans-header"><h2>Profile</h2></div>
    <div class="plan-card" style="text-align: center; padding: 20px;" id="userDisplay">
      <div id="avatar" style="font-size: 40px;">👤</div>
      <h3 style="margin: 10px 0;">${user_name || 'Guest'}</h3>
      <p style="color: #888;">${user_email || '---'}</p>
    </div>
    
    <!-- Personal Info -->
  <div class="plans-header" style="margin-top: 30px;">
    <h3>Personal Information</h3>
  </div>
  <div class="plan-card" style="padding: 15px;" id="personalDisplay">
    <p>Age: <strong id="ageVal">---</strong> years</p>
    <p>Gender: <strong id="genderVal">---</strong></p>
    <p>Height: <strong id="heightVal">---</strong> cm</p>
    <p>Weight: <strong id="weightVal">---</strong> kg</p>
    <p>Bike Weight: <strong id="bikeVal">---</strong> kg</p>
  </div>
  <div style="text-align: center; margin-top: 10px;">
    <button type="button" id="voice-btn" onmousedown="startListening()" onmouseup="stopListening()">
      🎤 Voice Input
    </button>
  </div>


    <!-- Fitness Goals -->
    <div class="plans-header" style="margin-top: 30px;">
      <h3>Fitness Goals 
        <span onclick="toggleEdit('fitnessForm')" style="float:right; cursor:pointer; color:#1f4c8a;">Edit ✏️</span>
      </h3>
    </div>
    <div class="plan-card" style="padding: 15px;" id="fitnessDisplay">
      <p>Primary Goal: <strong>${fitnessGoals.goal}</strong></p>
      <p>Intensity: <strong>${fitnessGoals.intensity}</strong></p>
      <p>Weekly Distance: <strong>${fitnessGoals.distance} km</strong></p>
      <p>Weekly Rides: <strong>${fitnessGoals.rides} rides</strong></p>
    </div>
    <form id="fitnessForm" style="display:none; padding:15px;" onsubmit="event.preventDefault(); saveFitnessGoals();">
      Primary Goal: <input type="text" id="goal" value="${fitnessGoals.goal}"><br><br>
      Intensity: <input type="text" id="intensity" value="${fitnessGoals.intensity}"><br><br>
      Weekly Distance (km): <input type="text" id="distance" value="${fitnessGoals.distance}"><br><br>
      Weekly Rides: <input type="text" id="rides" value="${fitnessGoals.rides}"><br><br>
      <button type="submit">Save</button>
    </form>
    <div class="plans-header" style="margin-top: 30px;">
      <h3>Account Settings</h3>
    </div>
    <div class="plan-card" style="padding: 15px;">
      <p>App Settings ➔</p>
      
    </div>
    <a href="/logout" class="setting-card">Log Out ➔</a>
    </div>
  `;

  // 函式掛到全域
  window.toggleEdit = function (id) {
    const form = document.getElementById(id);
    form.style.display = form.style.display === "none" ? "block" : "none";
  };

  // --- 語音輸入區塊 ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  recognition.lang = 'zh-TW';
  recognition.continuous = false;
  recognition.interimResults = false;

  window.startListening = function () {
    recognition.start();
    document.getElementById("voice-btn").innerText = "🎤 辨識中...";
  };

  window.stopListening = function () {
    recognition.stop();
    document.getElementById("voice-btn").innerText = "🎤 Voice Input ";
  };

  recognition.onresult = function (event) {
    const transcript = event.results[0][0].transcript;
    console.log("語音結果：", transcript);

    const fuzzyWords = ["大概", "可能", "差不多", "應該", "左右", "好像"];
    const clean = transcript.replace(new RegExp(fuzzyWords.join("|"), "g"), "");

    const ageMatch = clean.match(/(\d+)\s*歲/);
    const heightMatch = clean.match(/(身高|高).*?(\d+)\s*(公分|cm)?/);
    const weightMatch = clean.match(/(體重|重).*?(\d+)\s*(公斤|kg)?/);
    const bikeWeightMatch = clean.match(/(單車|腳踏車|自行車).*?(\d+)\s*(公斤|kg)?/);
    const genderMatch = clean.match(/(男|女|男性|女性)/);

    if (ageMatch) document.getElementById("ageVal").innerText = ageMatch[1];
    if (heightMatch) document.getElementById("heightVal").innerText = heightMatch[2];
    if (weightMatch) document.getElementById("weightVal").innerText = weightMatch[2];
    if (bikeWeightMatch) document.getElementById("bikeVal").innerText = bikeWeightMatch[2];
    if (genderMatch) {
      const gender = genderMatch[1];
      document.getElementById("genderVal").innerText = gender === "男" || gender === "男性" ? "Male" : "Female";
      // 更新頭像
      const avatarIcon = gender.includes("男") ? "👨" : "👩";
      document.getElementById("avatar").innerText = avatarIcon;
    }
  };

  recognition.onerror = function (event) {
    alert("語音辨識錯誤：" + event.error);
  };
} else {
  alert("此瀏覽器不支援語音辨識（建議用 Chrome）");
}


  window.saveFitnessGoals = function () {
    const goal = document.getElementById("goal").value;
    const intensity = document.getElementById("intensity").value;
    const distance = document.getElementById("distance").value;
    const rides = document.getElementById("rides").value;

    document.getElementById("fitnessDisplay").innerHTML = `
      <p>Primary Goal: <strong>${goal}</strong></p>
      <p>Intensity: <strong>${intensity}</strong></p>
      <p>Weekly Distance: <strong>${distance} km</strong></p>
      <p>Weekly Rides: <strong>${rides} rides</strong></p>
    `;

    toggleEdit("fitnessForm");
  };
}


// 預設載入 Home
renderHome();

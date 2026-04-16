// --- 1. 定数・GAS設定 ---
const GAS_URL = "https://script.google.com/macros/s/AKfycby6xzV78NwyDdxv7F27UdnwshUfiAgvpssqG4CWUxpX0YqJg3SV0oNvdIDtcKRWWptE/exec";

// --- 2. ゲージ・バーを動かすコア関数 ---
function updateGauge(type, val) {
    let targetPercent = parseInt(val);
    if(isNaN(targetPercent)) targetPercent = 0;
    if(targetPercent > 100) targetPercent = 100;

console.log("Updating:", type, targetPercent);

    // --- 英検バー（パイン用） ---
    if (type === 'eiken') {
        $('#eiken-bar-fill-pine').css('width', targetPercent + '%');
        $('#eiken-percent').text(targetPercent); // 数値表示も更新
        return;
    }

    // --- 英検バー（マミー用） ---
    if (type === 'mummy') {
        $('#eiken-bar-fill-mummy').css('width', targetPercent + '%');
        $('#mummy-percent').text(targetPercent); 
        return;
    }

    // --- パイチャート（半円ゲージ） ---
    let currentPercent = 0;
    let step = targetPercent / 50; 
    let color = (type === 'total') ? "#ff00ff" : "#00e5ff";

    let timer = setInterval(() => {
        currentPercent += step;
        if (currentPercent >= targetPercent) {
            currentPercent = targetPercent;
            clearInterval(timer);
        }
        let degrees = (currentPercent / 100) * 180 - 90;
        $(`#${type}-gauge-fill`).css({
            'background': `conic-gradient(from -90deg, ${color} ${currentPercent / 2}%, transparent 0)`,
            'transform': 'rotate(0deg)'
        });
        $(`#${type}-percent`).text(Math.round(currentPercent));
    }, 20);
}

// --- 3. GASからデータを取得して反映 ---
function fetchDataFromGAS() {
    console.log("Fetching data from GAS...");
    $.getJSON(GAS_URL, function(data) {
        console.log("Data Received:", data);
        
        // スプシの項目名（A列）とHTMLのID（type）を紐付け
        const mapping = {
            '英検': 'eiken',
            '数': 'numbers',
            '図形': 'geometry',
            '論理': 'logic',
            'トータル': 'total',
            'マミー': 'mummy'

        };

        for (let key in data) {
            if (mapping[key]) {
                updateGauge(mapping[key], data[key]);
            }
        }
    }).fail(function() {
        console.error("GASからのデータ取得に失敗したぜ。URLか公開設定を確認してくれ！");
    });
}

// --- 4. Active.html の「SYNC DATA」ボタンを押したときに、この加算処理を呼び出す ---
// --- ボタンを押してGASに加算リクエストを送る ---
function sendProgressDirect(type) {
    const inputId = `#input-${type}`;
    const val = $(inputId).val();
    
    if (!val || val <= 0) {
        alert("ミッションの成果を入力してくれ！");
        return;
    }

    console.log(`Sending update: ${type} + ${val}`);
    
    // GASへ送信（加算リクエスト）
    $.ajax({
        url: GAS_URL,
        type: 'GET', // CORS対策でGETで送るのが無難
        data: {
            action: 'update', // 必要ならGAS側で分岐させる
            type: type,
            newValue: val
        },
        dataType: 'jsonp', // クロスドメイン対策
        complete: function() {
            alert(`${type} の同期が完了したぜ！`);
            $(inputId).val(''); // 入力欄をクリア
            fetchDataFromGAS(); // 最新の値を再取得してバーを動かす！
        }
    });
}


// --- 6. 英検カウントダウンタイマー ---
function updateEikenTimer() {
    const targetDate = new Date("2026-06-01T00:00:00").getTime();
    const timerDisplay = document.getElementById('eiken-timer');
    if (!timerDisplay) return;

    setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;
        if (distance < 0) {
            timerDisplay.innerHTML = "MISSION IN PROGRESS";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

        timerDisplay.innerHTML = `
            <div style="display: flex; justify-content: center; gap: 15px; font-size: 2.5rem; font-weight: bold; color: #e5ff00;">
                <div>${days}<span style="font-size: 1rem;">D</span></div>
                <div>${hours.toString().padStart(2, '0')}<span style="font-size: 1rem;">H</span></div>
                <div>${minutes.toString().padStart(2, '0')}<span style="font-size: 1rem;">M</span></div>
            </div>
            `;
     
            // 期限が過ぎた場合
        if (distance < 0) {
            clearInterval(countdown);
            timerDisplay.innerHTML = "MISSION IN PROGRESS";
            timerDisplay.style.color = "#ff0000";
        }
    }, 1000);
}

// --- 5. 起動時処理 ---
$(document).ready(function() {
    console.log("Maris System: Dashboard Sync Started.");
    fetchDataFromGAS();
    updateEikenTimer();
    if (typeof summonQuest === 'function') summonQuest();
});






//Deactiveページの5分タイマー
function startMaintenance() {
    // ボタンを無効化して連打防止
    const btn = document.getElementById('start-maintenance-btn');
    btn.disabled = true;
    btn.innerText = "MAINTENANCE IN PROGRESS...";
    btn.style.opacity = "0.5";

    let timeLeft = 300; // 5分 = 300秒
    const display = document.getElementById('timer-display');
    const nextPhase = document.getElementById('next-phase');

    const timer = setInterval(() => {
        let minutes = Math.floor(timeLeft / 60);
        let seconds = timeLeft % 60;

        // 00:00 形式で表示
        display.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // 残り30秒で色を変えて「もうすぐ終わるぜ」感を出す
        if (timeLeft <= 30) {
            display.style.color = "#00e5ff"; // シアンに変化
        }

        if (timeLeft <= 0) {
            clearInterval(timer);
            display.innerText = "SYSTEM REBOOTED";
            display.classList.add('animate__animated', 'animate__pulse'); // 鼓動する演出
            
            // 次のページへの案内を表示
            nextPhase.style.display = "block";
            btn.style.display = "none";
        }
        timeLeft--;
    }, 1000);
}



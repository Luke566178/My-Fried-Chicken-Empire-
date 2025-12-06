// --- Main Game Logic ---

let buckets = 0;
let totalBuckets = 0;
let clickLevel = 0;
let fryerLevel = 0;
let rebirths = 0;

// Empire Name + Owner code
let empireName = "🍗 Fried Chicken Empire 🍗";
const secretOwnerName = "chicasaysfrychickensuccessfully";
let ownerUnlocked = false;

// Upgrades
let items = {
    cookingPower: { level: 0, baseCost: 10, cps: 1 },
    fryerPower: { level: 0, baseCost: 200, cps: 0 },
    chef: { level: 0, baseCost: 50, cps: 2 },
    delivery: { level: 0, baseCost: 400, cps: 7 },
    sodaStation: { level: 0, baseCost: 700, cps: 8 },
    dessertCorner: { level: 0, baseCost: 1000, cps: 12 },
    saladBar: { level: 0, baseCost: 1300, cps: 15 },
    driveThru: { level: 0, baseCost: 1800, cps: 25 }
};

// Rare Chickens (from rare-chickens.js)
let rareChickenBoost = 0;

// DOM elements
const bucketDisplay = document.getElementById("bucketDisplay");
const perClickDisplay = document.getElementById("perClickDisplay");
const perSecondDisplay = document.getElementById("perSecondDisplay");
const chickenButton = document.getElementById("chickenButton");
const shopDiv = document.getElementById("shop");
const rebirthBtn = document.getElementById("rebirthBtn");
const rebirthInfo = document.getElementById("rebirthInfo");
const editNameBtn = document.getElementById("editNameBtn");
const ownerPanel = document.getElementById("ownerPanel");

// --- Update Displays ---
function updateDisplay() {
    bucketDisplay.innerText = `Buckets: ${Math.floor(buckets)}`;
    perClickDisplay.innerText = `Per Click: ${(1 + clickLevel + rareChickenBoost) * Math.pow(2, fryerLevel)}`;
    let perSecond = Object.values(items).reduce((sum,i)=>sum+i.level*i.cps,0);
    perSecondDisplay.innerText = `Per Second: ${perSecond}`;
}

// --- Chicken click ---
chickenButton.addEventListener("click", () => {
    let clickPower = (1 + clickLevel + rareChickenBoost) * Math.pow(2, fryerLevel);
    buckets += clickPower;
    totalBuckets += clickPower;
    triggerRandomEmoji();
    updateDisplay();
});

// --- Shop ---
function createShop() {
    shopDiv.innerHTML = "";
    for (let key in items) {
        let item = items[key];
        let btn = document.createElement("div");
        btn.className = "shop-item";
        btn.innerText = `${key} (Lvl ${item.level})\nCost: ${item.baseCost}\nCPS: ${item.cps}`;
        btn.addEventListener("click", () => buyItem(key));
        shopDiv.appendChild(btn);
    }
}

function buyItem(name) {
    let item = items[name];
    if (buckets >= item.baseCost) {
        buckets -= item.baseCost;
        item.level++;
        item.baseCost = Math.floor(item.baseCost * 1.2);
        updateDisplay();
        createShop();
    }
}

// --- Rebirth ---
rebirthBtn.addEventListener("click", () => {
    if (buckets >= 5000) {
        rebirths++;
        buckets = 0;
        totalBuckets = 0;
        clickLevel = 0;
        fryerLevel = 0;
        for (let key in items) items[key].level = 0;
        rebirthInfo.innerText = `You have rebirthed ${rebirths} times! (+${rebirths*0.5}x CPS buff)`;
    }
});

// --- Edit Empire Name ---
editNameBtn.addEventListener("click", () => {
    let newName = prompt("Enter new empire name:", empireName);
    if (!newName) return;
    empireName = newName;
    document.getElementById("empireName").innerText = empireName;
    if (newName.toLowerCase() === secretOwnerName) {
        ownerUnlocked = true;
        ownerPanel.classList.remove("hidden");
        alert("Owner menu unlocked!");
    }
});

// --- Rare Chicken Effects ---
function spawnRareChicken() {
    let r = Math.random();
    if (r < diamondChicken.chance) {
        rareChickenBoost = 3.5;
        setTimeout(()=>{rareChickenBoost=0}, 40000);
        alert("💎 Diamond Chicken appeared! Boost 40s!");
    } else if (r < goldChicken.chance + diamondChicken.chance) {
        rareChickenBoost = 2;
        setTimeout(()=>{rareChickenBoost=0}, 60000);
        alert("🥇 Gold Chicken appeared! Boost 60s!");
    } else if (r < silverChicken.chance + goldChicken.chance + diamondChicken.chance) {
        rareChickenBoost = 1.5;
        setTimeout(()=>{rareChickenBoost=0}, 15000);
        alert("🥈 Silver Chicken appeared! Boost 15s!");
    }
}

// --- Random Emoji ---
function triggerRandomEmoji() {
    let emoji = ["🍗","✨","🔥","💥"][Math.floor(Math.random()*4)];
    let div = document.createElement("div");
    div.className = "falling-emoji";
    div.style.left = Math.random()*400 + "px";
    div.innerText = emoji;
    document.body.appendChild(div);
    setTimeout(()=>document.body.removeChild(div),3000);
}

// --- Per Second CPS ---
setInterval(()=>{
    let cps = Object.values(items).reduce((sum,i)=>sum+i.level*i.cps,0);
    cps *= 1 + rebirths*0.5;
    buckets += cps/10; // increment every 100ms
    totalBuckets += cps/10;
    updateDisplay();
},100);

// --- Rare Chicken spawn every 30s ---
setInterval(spawnRareChicken,30000);

// Initialize
updateDisplay();
createShop();

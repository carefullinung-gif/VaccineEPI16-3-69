/**
 * Vaccine Guide - Smart Console Application Logic (v2)
 * Clean, Reactive, and Patient-Centric Architecture
 * หน่วยงาน: ห้องตรวจพิเศษเด็ก 1 OPD 27 โรงพยาบาลมหาราชนครเชียงใหม่
 */

// Application State
const state = {
    currentAgeKey: "2", // Default to 2 months milestone
    selectedDob: null,
    activePreset: "basic", // 'basic' | 'comfort' | 'total' | 'custom'
    selectedOptional: {}, // Map of ageKey -> Set of optional item IDs
    ipdSelections: {}, // Map of ageKey -> { name, price }
    searchQuery: ""
};

// Initialize Application
document.addEventListener("DOMContentLoaded", () => {
    initMilestonesBar();
    initDefaultSelections();
    renderConsole();
});

/**
 * Initialize Default Selections for All Age Milestones
 */
function initDefaultSelections() {
    Object.keys(vaccineData).forEach(ageKey => {
        state.selectedOptional[ageKey] = new Set();
        state.ipdSelections[ageKey] = null;
    });
}

/**
 * Render Milestone Navigation Chips
 */
function initMilestonesBar() {
    const container = document.getElementById("milestonesBar");
    if (!container) return;

    container.innerHTML = "";
    ageMilestones.forEach(item => {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = `milestone-chip ${item.key === state.currentAgeKey ? "active" : ""}`;
        btn.id = `milestoneChip_${item.key}`;
        btn.textContent = item.label;
        btn.title = item.desc;
        btn.onclick = () => selectAgeMilestone(item.key);
        container.appendChild(btn);
    });
}

/**
 * Handle Age Milestone Selection
 */
function selectAgeMilestone(ageKey) {
    state.currentAgeKey = ageKey;

    // Update active class on milestone chips
    document.querySelectorAll(".milestone-chip").forEach(chip => {
        chip.classList.remove("active");
    });
    const activeChip = document.getElementById(`milestoneChip_${ageKey}`);
    if (activeChip) activeChip.classList.add("active");

    // Detect preset state for this age
    detectPresetState();

    // Re-render UI
    renderConsole();
}

/**
 * Handle Patient Date of Birth Change (Smart DOB & Appointment Engine)
 */
function handleDobChange() {
    const input = document.getElementById("dobInput");
    const calcResultEl = document.getElementById("dobCalcResult");
    const ageTextEl = document.getElementById("dobAgeText");
    const nextVisitEl = document.getElementById("nextVisitBadge");
    const nextVisitTextEl = document.getElementById("nextVisitDateText");

    if (!input || !input.value) {
        state.selectedDob = null;
        if (calcResultEl) calcResultEl.style.display = "none";
        if (nextVisitEl) nextVisitEl.style.display = "none";
        return;
    }

    const dob = new Date(input.value);
    const today = new Date();

    if (dob > today) {
        alert("วันเกิดต้องไม่เป็นวันที่ในอนาคตครับ");
        input.value = "";
        return;
    }

    state.selectedDob = dob;

    // Calculate Age in Months and Days
    let months = (today.getFullYear() - dob.getFullYear()) * 12 + (today.getMonth() - dob.getMonth());
    let days = today.getDate() - dob.getDate();
    if (days < 0) {
        months -= 1;
        const prevMonthDays = new Date(today.getFullYear(), today.getMonth(), 0).getDate();
        days += prevMonthDays;
    }

    // Display Exact Age
    let ageStr = "";
    if (months <= 0) {
        ageStr = `น้องอายุ: ${days} วัน`;
    } else {
        const years = Math.floor(months / 12);
        const remMonths = months % 12;
        if (years > 0) {
            ageStr = `น้องอายุ: ${years} ขวบ ${remMonths} เดือน (${days} วัน)`;
        } else {
            ageStr = `น้องอายุ: ${months} เดือน ${days} วัน`;
        }
    }

    ageTextEl.textContent = ageStr;
    calcResultEl.style.display = "inline-flex";

    // Auto-match closest age milestone
    const matchedKey = matchClosestMilestone(months);
    selectAgeMilestone(matchedKey);

    // Calculate Next Visit Date
    const nextVisit = calculateNextVisit(dob, matchedKey);
    if (nextVisit) {
        nextVisitTextEl.textContent = nextVisit;
        nextVisitEl.style.display = "inline-flex";
    } else {
        nextVisitEl.style.display = "none";
    }
}

/**
 * Match Closest Pediatric Milestone
 */
function matchClosestMilestone(months) {
    if (months < 1) return "0";
    if (months < 2) return "1";
    if (months < 3) return "2";
    if (months < 5) return "4";
    if (months < 8) return "6";
    if (months < 11) return "9";
    if (months < 14) return "12";
    if (months < 17) return "15";
    if (months < 22) return "18";
    if (months < 36) return "24";
    return "48";
}

/**
 * Calculate Next Visit Date based on Milestone
 */
function calculateNextVisit(dob, currentMilestone) {
    const milestoneSchedule = [
        { key: "0", nextMonths: 1, label: "1 เดือน" },
        { key: "1", nextMonths: 2, label: "2 เดือน" },
        { key: "2", nextMonths: 4, label: "4 เดือน" },
        { key: "4", nextMonths: 6, label: "6 เดือน" },
        { key: "6", nextMonths: 9, label: "9 เดือน" },
        { key: "9", nextMonths: 12, label: "1 ปี" },
        { key: "12", nextMonths: 15, label: "1 ปี 3 เดือน" },
        { key: "15", nextMonths: 18, label: "1 ปี 6 เดือน" },
        { key: "18", nextMonths: 24, label: "2 ปี" },
        { key: "24", nextMonths: 48, label: "4 ปี" }
    ];

    const match = milestoneSchedule.find(m => m.key === currentMilestone);
    if (!match) return null;

    const nextDate = new Date(dob);
    nextDate.setMonth(nextDate.getMonth() + match.nextMonths);

    const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const day = nextDate.getDate();
    const month = thaiMonths[nextDate.getMonth()];
    const year = nextDate.getFullYear() + 543;

    return `~ช่วง ${match.label} (ราววันที่ ${day} ${month} ${year})`;
}

/**
 * 1-Click Smart Clinical Presets
 */
function applyPreset(presetType) {
    state.activePreset = presetType;
    const ageKey = state.currentAgeKey;
    const items = vaccineData[ageKey] || [];
    const selectedSet = new Set();

    if (presetType === "basic") {
        // Clear all optional vaccines
        state.selectedOptional[ageKey] = selectedSet;
        state.ipdSelections[ageKey] = null;
    } else if (presetType === "comfort") {
        // Select vaccines tagged with 'comfort'
        items.forEach(item => {
            if (item.type === "optional" && item.preset && item.preset.includes("comfort")) {
                selectedSet.add(item.id);
                if (item.isIpdGroup && item.subVariants && item.subVariants.length > 0) {
                    state.ipdSelections[ageKey] = item.subVariants[0]; // Default to Synflorix
                }
            }
        });
        state.selectedOptional[ageKey] = selectedSet;
    } else if (presetType === "total") {
        // Select all vaccines tagged with 'total'
        items.forEach(item => {
            if (item.type === "optional" && item.preset && item.preset.includes("total")) {
                selectedSet.add(item.id);
                if (item.isIpdGroup && item.subVariants) {
                    // Default to Prevnar 20 (or first variant)
                    const prevnar = item.subVariants.find(v => v.name.includes("Prevnar 20")) || item.subVariants[0];
                    state.ipdSelections[ageKey] = prevnar;
                }
            }
        });
        state.selectedOptional[ageKey] = selectedSet;
    }

    updatePresetUI();
    renderConsole();
}

/**
 * Detect Current Preset State based on Active Selections
 */
function detectPresetState() {
    const ageKey = state.currentAgeKey;
    const selectedSet = state.selectedOptional[ageKey] || new Set();

    if (selectedSet.size === 0) {
        state.activePreset = "basic";
    } else {
        // Check if matches comfort or total or custom
        const items = vaccineData[ageKey] || [];
        const comfortItems = items.filter(i => i.preset && i.preset.includes("comfort")).map(i => i.id);
        const totalItems = items.filter(i => i.preset && i.preset.includes("total")).map(i => i.id);

        const isComfort = comfortItems.length > 0 && comfortItems.every(id => selectedSet.has(id)) && selectedSet.size === comfortItems.length;
        const isTotal = totalItems.length > 0 && totalItems.every(id => selectedSet.has(id)) && selectedSet.size === totalItems.length;

        if (isTotal) state.activePreset = "total";
        else if (isComfort) state.activePreset = "comfort";
        else state.activePreset = "custom";
    }

    updatePresetUI();
}

/**
 * Update Preset UI Badges and Active Styles
 */
function updatePresetUI() {
    const pBasic = document.getElementById("presetBasic");
    const pComfort = document.getElementById("presetComfort");
    const pTotal = document.getElementById("presetTotal");

    const iconBasic = document.getElementById("presetBasicIcon");
    const iconComfort = document.getElementById("presetComfortIcon");
    const iconTotal = document.getElementById("presetTotalIcon");

    [pBasic, pComfort, pTotal].forEach(el => {
        if (el) el.className = "preset-card";
    });

    if (state.activePreset === "basic" && pBasic) {
        pBasic.classList.add("active");
        if (iconBasic) iconBasic.textContent = "✓ กำลังเลือกแผนนี้";
        if (iconComfort) iconComfort.textContent = "○ แตะเพื่อเลือกแผนนี้";
        if (iconTotal) iconTotal.textContent = "○ แตะเพื่อเลือกแผนนี้";
    } else if (state.activePreset === "comfort" && pComfort) {
        pComfort.classList.add("active-comfort");
        if (iconBasic) iconBasic.textContent = "○ แตะเพื่อเลือกแผนนี้";
        if (iconComfort) iconComfort.textContent = "✓ กำลังเลือกแผนนี้";
        if (iconTotal) iconTotal.textContent = "○ แตะเพื่อเลือกแผนนี้";
    } else if (state.activePreset === "total" && pTotal) {
        pTotal.classList.add("active-total");
        if (iconBasic) iconBasic.textContent = "○ แตะเพื่อเลือกแผนนี้";
        if (iconComfort) iconComfort.textContent = "○ แตะเพื่อเลือกแผนนี้";
        if (iconTotal) iconTotal.textContent = "✓ กำลังเลือกแผนนี้";
    } else {
        // Custom
        if (iconBasic) iconBasic.textContent = "○ แตะเพื่อเลือกแผนนี้";
        if (iconComfort) iconComfort.textContent = "○ แตะเพื่อเลือกแผนนี้";
        if (iconTotal) iconTotal.textContent = "○ แตะเพื่อเลือกแผนนี้";
    }
}

/**
 * Main Render Console Function
 */
function renderConsole() {
    const ageKey = state.currentAgeKey;
    const items = vaccineData[ageKey] || [];
    const selectedSet = state.selectedOptional[ageKey] || new Set();

    // Determine Replaced Basic IDs
    const replacedIds = new Set();
    items.forEach(item => {
        if (item.type === "optional" && selectedSet.has(item.id) && item.replaceIds) {
            item.replaceIds.forEach(id => replacedIds.add(id));
        }
    });

    renderBasicColumn(items, replacedIds);
    renderOptionalColumn(items, selectedSet);
    updateTrackerAndSummary(items, selectedSet, replacedIds);
}

/**
 * Render Left Column: Basic Schedule (EPI / Free)
 */
function renderBasicColumn(items, replacedIds) {
    const container = document.getElementById("basicListContainer");
    if (!container) return;

    const basicItems = items.filter(i => i.type === "basic" || i.type === "screening");
    if (basicItems.length === 0) {
        container.innerHTML = `
            <div class="v-card" style="text-align: center; color: var(--slate-light); padding: 30px 20px;">
                <span>🛡️ ไม่มีรายการวัคซีนพื้นฐานที่ต้องฉีดในรอบอายุนี้</span>
            </div>
        `;
        return;
    }

    let html = "";
    basicItems.forEach(item => {
        const isReplaced = replacedIds.has(item.id);
        const cardClass = isReplaced ? "v-card replaced-card" : "v-card";

        html += `
            <div class="${cardClass}" id="card_${item.id}">
                ${isReplaced ? `
                    <div class="replaced-banner">
                        <span>✓ ได้รับวัคซีนทางเลือกทดแทนแล้ว (ลดเจ็บตัว/ลดไข้)</span>
                    </div>
                ` : ""}

                <div class="v-card-head">
                    <div class="v-card-title">${item.name}</div>
                    <span class="v-tag tag-route">${item.route ? item.route : "ตรวจเลือด"}</span>
                </div>

                <div class="v-card-tags">
                    ${item.diseases ? `<span class="v-tag tag-disease">🛡️ ป้องกัน: ${item.diseases}</span>` : ""}
                    ${item.site ? `<span class="v-tag tag-route">📍 ${item.site}</span>` : ""}
                    <span class="v-tag tag-price">0 บาท (สปสช.)</span>
                </div>

                ${item.detail ? `<div class="v-card-desc">${item.detail}</div>` : ""}

                <div class="v-card-care-box">
                    <div class="care-label">
                        <span>🌡️ อาการข้างเคียง:</span>
                    </div>
                    <div>${item.sideEffect || "-"}</div>
                    <div class="care-label" style="margin-top: 4px;">
                        <span>💡 วิธีดูแล:</span>
                    </div>
                    <div>${item.care || "-"}</div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * Render Right Column: Optional & Upgraded Vaccines
 */
function renderOptionalColumn(items, selectedSet) {
    const container = document.getElementById("optionalListContainer");
    if (!container) return;

    const optionalItems = items.filter(i => i.type === "optional");
    if (optionalItems.length === 0) {
        container.innerHTML = `
            <div class="v-card" style="text-align: center; color: var(--slate-light); padding: 30px 20px;">
                <span>⭐ ไม่มีรายการวัคซีนเสริมเฉพาะในรอบอายุนี้ (ดูสรุปที่คลังวัคซีนเสริมได้ครับ)</span>
            </div>
        `;
        return;
    }

    let html = "";
    optionalItems.forEach(item => {
        const isChecked = selectedSet.has(item.id);
        const cardClass = isChecked ? "v-card selected-active" : "v-card";

        // Determine price text
        let priceDisplay = "";
        if (item.isIpdGroup) {
            const chosen = state.ipdSelections[state.currentAgeKey];
            priceDisplay = chosen ? `${chosen.price.toLocaleString()} บาท` : "1,469 - 2,533 บาท";
        } else {
            priceDisplay = `${item.price.toLocaleString()} บาท`;
        }

        html += `
            <div class="${cardClass}" id="card_${item.id}">
                <div class="v-card-head">
                    <label class="custom-checkbox-label" for="chk_${item.id}">
                        <input type="checkbox" id="chk_${item.id}" class="v-checkbox" ${isChecked ? "checked" : ""} onchange="toggleOptional('${item.id}')">
                        <span class="v-card-title">${item.name}</span>
                    </label>
                    <span class="v-tag tag-price">${priceDisplay}</span>
                </div>

                <div class="v-card-tags">
                    ${item.diseases ? `<span class="v-tag tag-disease">🛡️ ป้องกัน: ${item.diseases}</span>` : ""}
                    ${item.site ? `<span class="v-tag tag-route">📍 ${item.site}</span>` : ""}
                    ${item.replaceIds ? `<span class="v-tag" style="background: #FEF3C7; color: #92400E; font-weight: bold;">⚡ ${item.replaceIds.length > 1 ? "รวมเข็มลดเจ็บตัว" : "ทดแทนวัคซีนพื้นฐาน"}</span>` : ""}
                </div>

                ${item.detail ? `<div class="v-card-desc">${item.detail}</div>` : ""}

                ${item.isIpdGroup && isChecked ? renderIpdSelector(item) : ""}

                <div class="v-card-care-box">
                    <div class="care-label">
                        <span>🌡️ อาการข้างเคียง:</span>
                    </div>
                    <div>${item.sideEffect || "ไข้ต่ำ ปวดบวมเล็กน้อย"}</div>
                    <div class="care-label" style="margin-top: 4px;">
                        <span>💡 วิธีดูแล:</span>
                    </div>
                    <div>${item.care || "เช็ดตัวลดไข้ หรือประคบเย็น"}</div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * Render IPD Variant Dropdown
 */
function renderIpdSelector(item) {
    const ageKey = state.currentAgeKey;
    const chosen = state.ipdSelections[ageKey];
    const currentName = chosen ? chosen.name : "";

    let options = `<option value="">-- กรุณาเลือกยี่ห้อและจำนวนสายพันธุ์ IPD --</option>`;
    item.subVariants.forEach(variant => {
        const isSelected = currentName === variant.name ? "selected" : "";
        options += `<option value="${variant.name}" ${isSelected}>${variant.name} (${variant.tag}) - ${variant.price.toLocaleString()} บาท</option>`;
    });

    const isWarning = !chosen;

    return `
        <div class="ipd-selector-wrapper">
            <label style="font-size: 12.5px; font-weight: 700; color: #0284C7; display: block; margin-bottom: 4px;">
                💊 เลือกยี่ห้อวัคซีน IPD ที่ต้องการรับบริการ:
            </label>
            <select class="ipd-select-input" onchange="handleIpdVariantChange(this.value)">
                ${options}
            </select>
            ${isWarning ? `
                <div class="ipd-warning-alert">
                    <span>⚠️ กรุณาเลือกยี่ห้อ IPD เพื่อคำนวณยอดที่ถูกต้อง</span>
                </div>
            ` : ""}
        </div>
    `;
}

function toggleOptional(itemId) {
    const ageKey = state.currentAgeKey;
    const selectedSet = state.selectedOptional[ageKey] || new Set();
    const items = vaccineData[ageKey] || [];
    const currentItem = items.find(i => i.id === itemId);

    if (selectedSet.has(itemId)) {
        selectedSet.delete(itemId);
        // If it was IPD, clear selection
        if (currentItem && currentItem.isIpdGroup) {
            state.ipdSelections[ageKey] = null;
        }
    } else {
        // หากเป็นวัคซีนเสริมที่มีการทดแทน (replaceIds) ให้ยกเลิกการเลือกวัคซีนเสริมตัวอื่นที่ทดแทนวัคซีนตัวเดียวกัน
        if (currentItem && currentItem.replaceIds && currentItem.replaceIds.length > 0) {
            items.forEach(other => {
                if (other.id !== itemId && other.replaceIds && selectedSet.has(other.id)) {
                    const hasOverlap = currentItem.replaceIds.some(id => other.replaceIds.includes(id));
                    if (hasOverlap) {
                        selectedSet.delete(other.id);
                        if (other.isIpdGroup) {
                            state.ipdSelections[ageKey] = null;
                        }
                    }
                }
            });
        }

        selectedSet.add(itemId);
        // If it is IPD, auto-select first variant
        if (currentItem && currentItem.isIpdGroup && currentItem.subVariants && currentItem.subVariants.length > 0) {
            state.ipdSelections[ageKey] = currentItem.subVariants[0]; // Default Synflorix
        }
    }

    state.selectedOptional[ageKey] = selectedSet;
    detectPresetState();
    renderConsole();
}

/**
 * Handle IPD Variant Selection Change
 */
function handleIpdVariantChange(variantName) {
    const ageKey = state.currentAgeKey;
    const items = vaccineData[ageKey] || [];
    const ipdItem = items.find(i => i.isIpdGroup);

    if (!ipdItem) return;

    if (!variantName) {
        state.ipdSelections[ageKey] = null;
    } else {
        const found = ipdItem.subVariants.find(v => v.name === variantName);
        state.ipdSelections[ageKey] = found || null;
    }

    renderConsole();
}

/**
 * Update Anatomical Injection Sites Tracker & Floating Summary Metrics
 */
function updateTrackerAndSummary(items, selectedSet, replacedIds) {
    const siteLeftThighEl = document.getElementById("siteLeftThigh");
    const siteRightThighEl = document.getElementById("siteRightThigh");
    const siteArmEl = document.getElementById("siteArm");
    const siteOralEl = document.getElementById("siteOral");
    const savingsBadgeEl = document.getElementById("needleSavingsBadge");

    const sumCostEl = document.getElementById("summaryTotalCost");
    const sumNeedleEl = document.getElementById("summaryNeedleCount");
    const sumOralEl = document.getElementById("summaryOralCount");
    const sumPainEl = document.getElementById("summaryPainSaved");

    // Lists for sites
    const leftThighItems = [];
    const rightThighItems = [];
    const armItems = [];
    const oralItems = [];

    let totalCost = 0;
    let basicNeedles = 0;
    let optionalNeedles = 0;
    let oralCount = 0;
    let replacedCount = 0;

    // Process Basic Items
    items.forEach(item => {
        if (item.type === "basic") {
            if (replacedIds.has(item.id)) {
                replacedCount++;
                return; // Replaced, no jab!
            }

            if (item.route === "Oral") {
                oralCount++;
                oralItems.push(item.name.split(" ")[0]);
            } else {
                basicNeedles++;
                if (item.site && item.site.includes("แขน")) {
                    armItems.push(item.name.split(" ")[0]);
                } else if (item.site && item.site.includes("ซ้าย")) {
                    leftThighItems.push(item.name.split(" ")[0]);
                } else if (item.site && item.site.includes("ขวา")) {
                    rightThighItems.push(item.name.split(" ")[0]);
                } else {
                    leftThighItems.push(item.name.split(" ")[0]);
                }
            }
        }
    });

    // Process Selected Optional Items
    items.forEach(item => {
        if (item.type === "optional" && selectedSet.has(item.id)) {
            if (item.isIpdGroup) {
                const chosen = state.ipdSelections[state.currentAgeKey];
                if (chosen) {
                    totalCost += chosen.price;
                    optionalNeedles++;
                    rightThighItems.push(`IPD (${chosen.name.split(" ")[0]})`);
                }
            } else {
                totalCost += item.price;
                if (item.route === "Oral") {
                    oralCount++;
                    oralItems.push(item.name.split(" ")[0]);
                } else {
                    optionalNeedles++;
                    if (item.site && item.site.includes("แขน")) {
                        armItems.push(item.name.split(" ")[0]);
                    } else if (item.site && item.site.includes("ซ้าย")) {
                        leftThighItems.push(item.name.split(" ")[0]);
                    } else if (item.site && item.site.includes("ขวา")) {
                        rightThighItems.push(item.name.split(" ")[0]);
                    } else {
                        rightThighItems.push(item.name.split(" ")[0]);
                    }
                }
            }
        }
    });

    const totalNeedles = basicNeedles + optionalNeedles;

    // Render Anatomical Site Boxes
    siteLeftThighEl.innerHTML = leftThighItems.length > 0 ? leftThighItems.join(", ") : `<span class="site-empty">- ไม่มีเข็มฉีด -</span>`;
    siteRightThighEl.innerHTML = rightThighItems.length > 0 ? rightThighItems.join(", ") : `<span class="site-empty">- ไม่มีเข็มฉีด -</span>`;
    siteArmEl.innerHTML = armItems.length > 0 ? armItems.join(", ") : `<span class="site-empty">- ไม่มีเข็มฉีด -</span>`;
    siteOralEl.innerHTML = oralItems.length > 0 ? oralItems.join(", ") : `<span class="site-empty">- ไม่มีการหยอด -</span>`;

    // Update Needle Savings Pill
    if (replacedCount > 0) {
        savingsBadgeEl.className = "needle-savings-pill highlight-anim";
        savingsBadgeEl.innerHTML = `<span>🎉 รวมเข็มสำเร็จ! เจ็บตัวลดลง ${replacedCount} เข็ม</span>`;
    } else {
        savingsBadgeEl.className = "needle-savings-pill";
        savingsBadgeEl.innerHTML = `<span>💉 สถิติตามเกณฑ์ปกติ</span>`;
    }

    // Update Floating Metrics
    sumCostEl.textContent = `${totalCost.toLocaleString()} บาท`;
    sumNeedleEl.textContent = `${totalNeedles} เข็ม`;
    sumOralEl.textContent = `${oralCount} ครั้ง`;

    if (replacedCount > 0) {
        sumPainEl.textContent = `ลดเจ็บ ${replacedCount} เข็ม!`;
        sumPainEl.style.color = "#34D399";
    } else {
        sumPainEl.textContent = "เกณฑ์ปกติ";
        sumPainEl.style.color = "#94A3B8";
    }
}

/**
 * Toggle Guidelines Accordion
 */
function toggleGuidelineAccordion() {
    const content = document.getElementById("guidelineContent");
    const chevron = document.getElementById("accordionChevron");
    if (!content) return;

    if (content.style.display === "block") {
        content.style.display = "none";
        chevron.textContent = "▼ คลิกดูรายละเอียด";
    } else {
        content.style.display = "block";
        chevron.textContent = "▲ ซ่อนรายละเอียด";
    }
}

/**
 * Quick Vaccine Search Modal Logic
 */
function openSearchModal() {
    const modal = document.getElementById("searchModal");
    const input = document.getElementById("modalSearchInput");
    if (!modal) return;

    modal.style.display = "flex";
    if (input) {
        input.value = "";
        input.focus();
    }
    renderSearchResults("");
}

function closeSearchModal() {
    const modal = document.getElementById("searchModal");
    if (modal) modal.style.display = "none";
}

function handleModalBackdropClick(event) {
    if (event.target.id === "searchModal") {
        closeSearchModal();
    }
}

function handleSearchFilter() {
    const input = document.getElementById("modalSearchInput");
    const query = input ? input.value.trim().toLowerCase() : "";
    renderSearchResults(query);
}

function renderSearchResults(query) {
    const container = document.getElementById("searchResultsContainer");
    if (!container) return;

    const filtered = optionalSummary.filter(item => {
        if (!query) return true;
        return item.name.toLowerCase().includes(query) ||
               item.thai.toLowerCase().includes(query) ||
               item.target.toLowerCase().includes(query) ||
               item.info.toLowerCase().includes(query);
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div style="text-align: center; color: var(--slate-light); padding: 30px;">
                <span>ไม่พบข้อมูลวัคซีนที่ค้นหา</span>
            </div>
        `;
        return;
    }

    let html = "";
    filtered.forEach(item => {
        html += `
            <div class="search-item-card">
                <div class="search-item-title">
                    <span>${item.name} <small style="font-weight: 500; color: #475569;">(${item.thai})</small></span>
                    <span class="v-tag tag-price">${item.priceText}</span>
                </div>
                <div class="search-item-desc" style="margin-bottom: 4px;">
                    <strong>🛡️ ป้องกัน:</strong> ${item.target}
                </div>
                <div class="search-item-desc" style="color: #0369A1;">
                    <strong>📅 ช่วงอายุที่ฉีด:</strong> ${item.info} | <strong>วิธีให้:</strong> ${item.route}
                </div>
                ${item.note ? `<div class="search-item-desc" style="margin-top: 4px; color: #64748B;">*${item.note}</div>` : ""}
            </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * 1-Click Copy Summary for LINE Messaging
 */
function copyLineSummary() {
    const ageKey = state.currentAgeKey;
    const milestone = ageMilestones.find(m => m.key === ageKey);
    const items = vaccineData[ageKey] || [];
    const selectedSet = state.selectedOptional[ageKey] || new Set();

    let optionalLines = [];
    let totalCost = 0;

    items.forEach(item => {
        if (item.type === "optional" && selectedSet.has(item.id)) {
            if (item.isIpdGroup) {
                const chosen = state.ipdSelections[ageKey];
                if (chosen) {
                    totalCost += chosen.price;
                    optionalLines.push(`• IPD (${chosen.name}): ${chosen.price.toLocaleString()} บาท`);
                }
            } else {
                totalCost += item.price;
                optionalLines.push(`• ${item.name}: ${item.price.toLocaleString()} บาท`);
            }
        }
    });

    let ageDisplay = milestone ? milestone.label : `${ageKey} เดือน`;
    if (state.selectedDob) {
        const ageTextEl = document.getElementById("dobAgeText");
        if (ageTextEl) ageDisplay += ` (${ageTextEl.textContent})`;
    }

    const text = 
`🏥 สรุปแผนวัคซีนเด็ก - OPD 27 รพ.มหาราชนครเชียงใหม่
👶 ช่วงอายุ: ${ageDisplay}
───────────────────
🛡️ แผนวัคซีนพื้นฐาน สปสช.: รับบริการตามเกณฑ์ (0 บาท)
⭐ วัคซีนทางเลือก/วัคซีนเสริมที่เลือก:
${optionalLines.length > 0 ? optionalLines.join("\n") : "• ไม่ได้รับวัคซีนเสริมเพิ่มเติม"}
───────────────────
💰 ยอดชำระโดยประมาณ: ${totalCost.toLocaleString()} บาท

🌡️ การดูแลเมื่อมีไข้หลังฉีด:
- เช็ดตัวด้วยน้ำอุ่นบิดหมาด
- ทานยาลดไข้พาราเซตามอลตามขนาดที่แพทย์สั่ง
- หากปวดบวมให้ประคบเย็น 24 ชม. แรก
- สอบถามเพิ่มเติมโทร: 35757 / 36658 (OPD 27)`;

    navigator.clipboard.writeText(text).then(() => {
        showToast("✓ คัดลอกข้อความสรุปสำหรับส่ง LINE เรียบร้อยแล้ว");
    }).catch(() => {
        // Fallback
        const dummy = document.createElement("textarea");
        dummy.value = text;
        document.body.appendChild(dummy);
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);
        showToast("✓ คัดลอกข้อความสรุปเรียบร้อยแล้ว");
    });
}

/**
 * Print A4 Counseling Sheet
 */
function printCounselingSheet() {
    const ageKey = state.currentAgeKey;
    const milestone = ageMilestones.find(m => m.key === ageKey);
    const printMetaEl = document.getElementById("printMetaInfo");

    const today = new Date();
    const thaiMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const dateStr = `${today.getDate()} ${thaiMonths[today.getMonth()]} ${today.getFullYear() + 543}`;

    if (printMetaEl) {
        printMetaEl.textContent = `วันที่ประเมิน: ${dateStr} | ช่วงอายุเด็ก: ${milestone ? milestone.label : ageKey + " เดือน"}`;
    }

    window.print();
}

/**
 * Toast Notification Helper
 */
function showToast(msg) {
    const toast = document.getElementById("toastNotice");
    const msgEl = document.getElementById("toastMessage");
    if (!toast || !msgEl) return;

    msgEl.textContent = msg;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2800);
}

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa",
  "Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala",
  "Madhya Pradesh","Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland",
  "Odisha","Punjab","Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
  "Uttar Pradesh","Uttarakhand","West Bengal","Delhi"
];

const STATE_CITY_MAP = {
  "Gujarat": ["Ahmedabad","Surat","Rajkot","Vadodara","Bhavnagar","Gandhinagar"],
  "Maharashtra": ["Mumbai","Pune","Nagpur","Nashik","Thane"],
  "Rajasthan": ["Jaipur","Jodhpur","Udaipur","Kota"],
  "Delhi": ["New Delhi"],
  "Madhya Pradesh": ["Indore","Bhopal","Gwalior"],
  "Uttar Pradesh": ["Lucknow","Kanpur","Noida","Ghaziabad"]
};

function cleanText(text) {
    if (!text) return "";
    return text.toString().trim();
}

let allData = [];
let headers = [];
let cityIndex, stateIndex, categoryIndex;

const stateFilter = document.getElementById("stateFilter");
const cityFilter = document.getElementById("cityFilter");
const categoryFilter = document.getElementById("categoryFilter");
const okBtn = document.getElementById("okBtn");
const thead = document.getElementById("tableHead");
const tbody = document.getElementById("tableBody");

// ---------- LOAD CSV ----------
Papa.parse("data.csv", {
    download: true,
    skipEmptyLines: true,
    complete: function (result) {

        const rows = result.data.slice(1);
        headers = rows[0];
        allData = rows.slice(1);

        stateIndex = headers.indexOf("State");
        cityIndex = headers.indexOf("City");
        categoryIndex = headers.indexOf("Category of Business");

        createTableHeader();
        showTable(allData);
        populateStateFilter();
        populateCategoryDropdown();
    }
});

// ---------- CREATE TABLE HEADER ----------
function createTableHeader() {
    let tr = document.createElement("tr");
    headers.forEach(h => {
        let th = document.createElement("th");
        th.textContent = h;
        tr.appendChild(th);
    });
    thead.appendChild(tr);
}

// ---------- SHOW TABLE ----------
function showTable(data) {
    tbody.innerHTML = "";

    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="${headers.length}" style="text-align:center;">No data found</td></tr>`;
        return;
    }

    data.forEach(r => {
        let tr = document.createElement("tr");
        r.forEach(c => {
            let td = document.createElement("td");
            td.textContent = c;
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}

// ---------- POPULATE STATE FILTER ----------
function populateStateFilter() {
    stateFilter.innerHTML = `<option value="">Select State</option>`;
    cityFilter.innerHTML = `<option value="">Select City</option>`;
    cityFilter.disabled = true;

    INDIAN_STATES.forEach(state => {
        stateFilter.innerHTML += `<option value="${state}">${state}</option>`;
    });
}

// ---------- STATE → CITY ----------
stateFilter.onchange = function () {
    const selectedState = stateFilter.value;

    cityFilter.innerHTML = `<option value="">Select City</option>`;
    cityFilter.disabled = true;

    if (!selectedState) return;

    (STATE_CITY_MAP[selectedState] || []).forEach(city => {
        cityFilter.innerHTML += `<option value="${city}">${city}</option>`;
    });

    cityFilter.disabled = false;
};

// ---------- POPULATE CATEGORY DROPDOWN ----------
function populateCategoryDropdown() {
    const uniqueCategories = new Set();

    allData.forEach(row => {
        const cat = (row[categoryIndex] || "").trim();
        if (cat) uniqueCategories.add(cat);
    });

    const sortedCategories = [...uniqueCategories].sort();

    categoryFilter.innerHTML = '<option value="">Select Category</option>';
    sortedCategories.forEach(cat => {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        categoryFilter.appendChild(opt);
    });
}

// ---------- OK BUTTON FILTER ----------
okBtn.onclick = function () {

    const selectedState = stateFilter.value.toLowerCase();
    const selectedCity = cityFilter.value.toLowerCase();
    const selectedCategory = categoryFilter.value.toLowerCase();

    const filtered = allData.filter(r => {

        const rowState = (r[stateIndex] || "").toLowerCase();
        const rowCity = (r[cityIndex] || "").toLowerCase();
        const rowCategory = (r[categoryIndex] || "").toLowerCase();

        if (selectedState && rowState !== selectedState) return false;
        if (selectedCity && rowCity !== selectedCity) return false;
        if (selectedCategory && rowCategory !== selectedCategory) return false;

        return true;
    });

    showTable(filtered);
};

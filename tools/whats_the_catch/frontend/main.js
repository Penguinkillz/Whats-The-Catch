const form = document.getElementById("catch-form");
const claimEl = document.getElementById("claim");
const btn = document.getElementById("submit-btn");
const btnLabel = document.getElementById("submit-label");
const spinner = document.getElementById("submit-spinner");
const statusEl = document.getElementById("status");
const resultsEl = document.getElementById("results");
const metaEl = document.getElementById("results-meta");
const emptyEl = document.getElementById("empty-state");
const nuancedEl = document.getElementById("nuanced");
const nuancedTextEl = document.getElementById("nuanced-text");

function setLoading(on) {
  btn.disabled = on;
  btnLabel.style.display = on ? "none" : "";
  spinner.style.display = on ? "inline" : "none";
}

function setStatus(msg, isError) {
  statusEl.textContent = msg;
  statusEl.className = "status" + (isError ? " error" : "");
}

function clearResults() {
  resultsEl.innerHTML = "";
  nuancedEl.style.display = "none";
  nuancedTextEl.textContent = "";
  emptyEl.style.display = "block";
  metaEl.textContent = "Nothing yet.";
}

function renderResult(data) {
  resultsEl.innerHTML = "";
  emptyEl.style.display = "none";
  metaEl.textContent = '"' + (data.claim.length > 40 ? data.claim.slice(0, 40) + "…" : data.claim) + '"';

  data.catches.forEach(function (text, i) {
    const item = document.createElement("div");
    item.className = "catch-item";
    const num = document.createElement("div");
    num.className = "catch-num";
    num.textContent = i + 1;
    const txt = document.createElement("div");
    txt.className = "catch-text";
    txt.textContent = text;
    item.append(num, txt);
    resultsEl.appendChild(item);
  });

  nuancedTextEl.textContent = data.nuanced_take;
  nuancedEl.style.display = "block";
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  var claim = claimEl.value.trim();
  if (!claim) {
    setStatus("Enter a belief, trend, or product.", true);
    return;
  }

  setLoading(true);
  setStatus("Thinking...");
  clearResults();

  try {
    var res = await fetch("/api/catch/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ claim: claim }),
    });
    if (!res.ok) {
      var err = await res.json().catch(function () { return {}; });
      throw new Error(err.detail || "Server error " + res.status);
    }
    var data = await res.json();
    renderResult(data);
    setStatus("");
  } catch (err) {
    setStatus(err.message || "Something went wrong.", true);
  } finally {
    setLoading(false);
  }
});

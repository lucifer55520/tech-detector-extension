document.addEventListener("DOMContentLoaded", function () {

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {

    // ✅ Check if tab exists
    if (!tabs || tabs.length === 0) {
      document.getElementById("results").innerHTML =
        "<div class='item'>❌ No active tab found</div>";
      return;
    }

    let tab = tabs[0];

    // ✅ Check tab id
    if (!tab.id) {
      document.getElementById("results").innerHTML =
        "<div class='item'>❌ Cannot access this page</div>";
      return;
    }

    // ❗ Block chrome pages
    if (tab.url.startsWith("chrome://") || tab.url.startsWith("edge://")) {
      document.getElementById("results").innerHTML =
        "<div class='item'>⚠️ Cannot run on this page</div>";
      return;
    }

    // 🔍 Send message to content.js
    chrome.tabs.sendMessage(tab.id, { action: "detect" }, function (response) {

      // ✅ Handle error
      if (chrome.runtime.lastError || !response) {
        document.getElementById("results").innerHTML =
          "<div class='item'>⚠️ Refresh the page and try again</div>";
        return;
      }

      let html = "";

      function createSection(title, items) {
        html += `<div class="section">
                  <div class="section-title">${title}</div>`;

        if (!items || items.length === 0) {
          html += `<div class="empty">None detected</div>`;
        } else {
          items.forEach(item => {
            html += `<div class="item">${item}</div>`;
          });
        }

        html += `</div>`;
      }

      // 📊 Show all sections
      createSection("Frontend", response.frontend);
      createSection("Backend", response.backend);
      createSection("Security", response.security);
      createSection("Analytics", response.analytics);
      createSection("CMS", response.cms);

      document.getElementById("results").innerHTML = html;
    });

  });

});
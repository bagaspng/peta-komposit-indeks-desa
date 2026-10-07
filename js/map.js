/**
 * Peta Komposit Indeks Desa - Map Initialization & Data Loader
 * Loads externalized JSON data and renders the Leaflet HTMLWidget map
 */
(function () {
  "use strict";

  var widgetId = "htmlwidget-2c4681b0d20fe137bdac";

  function initMap() {
    var el = document.getElementById(widgetId);
    if (!el) return;

    fetch("./data/indeks-desa.json")
      .then(function (response) {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status + " while loading map data");
        }
        return response.json();
      })
      .then(function (data) {
        // Resolve binding
        var binding = null;
        if (window.HTMLWidgets && window.HTMLWidgets.widgets) {
          for (var i = 0; i < window.HTMLWidgets.widgets.length; i++) {
            if (window.HTMLWidgets.widgets[i].name === "leaflet") {
              binding = window.HTMLWidgets.widgets[i];
              break;
            }
          }
          if (!binding) {
            binding = window.HTMLWidgets.widgets[0];
          }
        }

        // Get instance created during HTMLWidgets staticRender
        var instance = window.HTMLWidgets && window.HTMLWidgets.getInstance(el);

        if (!instance && binding && binding.initialize) {
          var rect = el.getBoundingClientRect();
          instance = binding.initialize(el, rect.width, rect.height);
        }

        if (binding && instance) {
          // Resolve string members if needed
          if (data.evals) {
            if (!(data.evals instanceof Array)) data.evals = [data.evals];
            for (var k = 0; k < data.evals.length; k++) {
              window.HTMLWidgets.evaluateStringMember(data.x, data.evals[k]);
            }
          }

          // Render Leaflet map
          binding.renderValue(el, data.x, instance);

          // Populate JSON script tag in DOM for backwards compatibility
          var scriptData = document.querySelector("script[data-for='" + widgetId + "'][type='application/json']");
          if (!scriptData) {
            scriptData = document.createElement("script");
            scriptData.type = "application/json";
            scriptData.setAttribute("data-for", widgetId);
            document.body.appendChild(scriptData);
          }
        }
      })
      .catch(function (error) {
        console.error("Gagal memuat atau merender data peta:", error);
      });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMap);
  } else {
    initMap();
  }
})();

const PREFECTURE_GEOJSON_URL =
  "https://raw.githubusercontent.com/dataofjapan/land/master/japan.geojson";

const REGIONS = [
  { name: "北海道", color: "#62d8ff", ids: [1] },
  { name: "東北", color: "#5cffb1", ids: [2, 3, 4, 5, 6, 7] },
  { name: "関東", color: "#fff06a", ids: [8, 9, 10, 11, 12, 13, 14] },
  { name: "中部", color: "#ffb85c", ids: [15, 16, 17, 18, 19, 20, 21, 22, 23] },
  { name: "近畿", color: "#ff7f73", ids: [24, 25, 26, 27, 28, 29, 30] },
  { name: "中国", color: "#cfa7ff", ids: [31, 32, 33, 34, 35] },
  { name: "四国", color: "#78a8ff", ids: [36, 37, 38, 39] },
  { name: "九州", color: "#ff77c8", ids: [40, 41, 42, 43, 44, 45, 46] },
  { name: "沖縄", color: "#8ef6e4", ids: [47] },
];

const FALLBACK_FEATURES = {
  type: "FeatureCollection",
  features: [
    regionFeature("北海道", 1, [
      [140.2, 41.4],
      [145.9, 42.8],
      [144.5, 45.6],
      [141.1, 45.4],
      [139.4, 43.2],
      [140.2, 41.4],
    ]),
    regionFeature("東北", 2, [
      [139.4, 37.0],
      [141.8, 37.3],
      [142.1, 41.5],
      [140.0, 41.6],
      [139.4, 37.0],
    ]),
    regionFeature("関東", 8, [
      [138.3, 34.8],
      [140.9, 35.0],
      [141.0, 36.9],
      [138.9, 37.2],
      [138.3, 34.8],
    ]),
    regionFeature("中部", 15, [
      [136.0, 34.4],
      [139.2, 34.8],
      [138.9, 38.0],
      [136.2, 37.3],
      [136.0, 34.4],
    ]),
    regionFeature("近畿", 24, [
      [134.6, 33.7],
      [136.8, 33.9],
      [136.6, 35.7],
      [134.8, 35.5],
      [134.6, 33.7],
    ]),
    regionFeature("中国", 31, [
      [130.8, 33.8],
      [134.9, 33.8],
      [134.6, 35.6],
      [131.0, 35.3],
      [130.8, 33.8],
    ]),
    regionFeature("四国", 36, [
      [132.0, 32.8],
      [134.8, 33.0],
      [134.3, 34.4],
      [132.0, 34.2],
      [132.0, 32.8],
    ]),
    regionFeature("九州", 40, [
      [129.4, 30.9],
      [132.0, 31.3],
      [131.8, 34.0],
      [129.5, 33.7],
      [129.4, 30.9],
    ]),
    regionFeature("沖縄", 47, [
      [123.5, 24.0],
      [128.4, 24.0],
      [128.4, 27.2],
      [123.5, 27.2],
      [123.5, 24.0],
    ]),
  ],
};

const regionById = new Map(REGIONS.flatMap((region) => region.ids.map((id) => [id, region])));
const statusEl = document.querySelector("#map-status");
const legendItemsEl = document.querySelector("#legend-items");
let map;

setupTabs();
renderLegend();
initEarthquakeMap();

function setupTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
      document.querySelectorAll(".panel").forEach((panel) => panel.classList.remove("panel-active"));

      tab.classList.add("active");
      document.querySelector(`#${tab.dataset.panel}`).classList.add("panel-active");

      if (tab.dataset.panel === "earthquake-panel" && map) {
        requestAnimationFrame(() => map.invalidateSize());
      }
    });
  });
}

function renderLegend() {
  legendItemsEl.replaceChildren(
    ...REGIONS.map((region) => {
      const row = document.createElement("div");
      row.className = "legend-row";

      const swatch = document.createElement("span");
      swatch.className = "swatch";
      swatch.style.backgroundColor = region.color;

      const label = document.createElement("span");
      label.textContent = region.name;

      row.append(swatch, label);
      return row;
    }),
  );
}

async function initEarthquakeMap() {
  map = L.map("map", {
    attributionControl: true,
    zoomControl: true,
    scrollWheelZoom: true,
    minZoom: 4,
    maxZoom: 9,
  });

  try {
    const response = await fetch(PREFECTURE_GEOJSON_URL);
    if (!response.ok) {
      throw new Error(`GeoJSON request failed: ${response.status}`);
    }

    const geojson = await response.json();
    drawGeoJson(geojson);
    statusEl.textContent = "外部GeoJSONから日本地図を表示中";
    map.attributionControl.addAttribution(
      '<a href="https://github.com/dataofjapan/land" target="_blank" rel="noreferrer">dataofjapan/land</a>',
    );
  } catch (error) {
    drawGeoJson(FALLBACK_FEATURES);
    statusEl.textContent = "外部地図の取得に失敗。簡易地図で表示中";
    console.warn(error);
  }
}

function drawGeoJson(geojson) {
  const layer = L.geoJSON(geojson, {
    style: (feature) => {
      const region = getRegion(feature);
      return {
        color: "#d7fbff",
        fillColor: region.color,
        fillOpacity: 0.58,
        opacity: 0.72,
        weight: 1,
      };
    },
    onEachFeature: (feature, layerItem) => {
      const region = getRegion(feature);
      const prefecture = feature.properties.nam_ja ?? feature.properties.name ?? region.name;
      layerItem.bindTooltip(`${prefecture} / ${region.name}`, {
        direction: "top",
        sticky: true,
      });
    },
  }).addTo(map);

  map.fitBounds(layer.getBounds(), {
    padding: [18, 18],
  });
}

function getRegion(feature) {
  return regionById.get(Number(feature.properties.id)) ?? REGIONS[0];
}

function regionFeature(name, id, coordinates) {
  return {
    type: "Feature",
    properties: { name, nam_ja: name, id },
    geometry: {
      type: "Polygon",
      coordinates: [coordinates],
    },
  };
}

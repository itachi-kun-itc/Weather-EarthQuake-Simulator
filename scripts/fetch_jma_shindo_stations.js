const fs = require("node:fs");
const path = require("node:path");
const https = require("node:https");

const root = path.resolve(__dirname, "..");
const sourceUrl = "https://www.jma.go.jp/jma/kishou/know/jishin/intens-st/stations.json";
const pageUrl = "https://www.jma.go.jp/jma/kishou/know/jishin/intens-st/index.html";
const localAreasPath = path.join(root, "web", "data", "jma_local_areas.geojson");
const outputPath = path.join(root, "web", "data", "jma_shindo_stations.json");

const affiliationLabels = {
  0: "気象庁",
  1: "地方公共団体",
  2: "防災科学技術研究所",
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

async function main() {
  const sourceText = await fetchText(sourceUrl);
  const sourceStations = JSON.parse(stripBom(sourceText));
  const localAreas = JSON.parse(fs.readFileSync(localAreasPath, "utf8"));
  const stations = normalizeStations(sourceStations, localAreas);
  const affiliationCounts = countByAffiliation(stations);

  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(
    outputPath,
    `${JSON.stringify(
      {
        source: sourceUrl,
        page: pageUrl,
        updated: new Date().toISOString(),
        count: stations.length,
        affiliationCounts,
        stations,
      },
      null,
      2,
    )}\n`,
  );

  console.log(`Wrote ${stations.length} shindo stations to ${path.relative(root, outputPath)}`);
}

function normalizeStations(sourceStations, localAreas) {
  const seen = new Set();
  const stations = [];

  for (const sourceStation of sourceStations) {
    const latitude = Number(sourceStation.lat);
    const longitude = Number(sourceStation.lon);
    const affiliationCode = String(sourceStation.affi ?? "");
    const name = String(sourceStation.name ?? "").trim();

    if (!name || !Number.isFinite(latitude) || !Number.isFinite(longitude)) {
      continue;
    }

    const duplicateKey = `${name}|${latitude.toFixed(4)}|${longitude.toFixed(4)}|${affiliationCode}`;
    if (seen.has(duplicateKey)) {
      continue;
    }
    seen.add(duplicateKey);

    const area = findFeatureAtPoint(localAreas, longitude, latitude) ?? findNearestFeature(localAreas, longitude, latitude);
    stations.push({
      id: `${stations.length + 1}`.padStart(5, "0"),
      areaName: cleanAreaName(area?.properties?.name ?? ""),
      name,
      address: "",
      latitude: round(latitude, 5),
      longitude: round(longitude, 5),
      affiliation: affiliationLabels[affiliationCode] ?? "不明",
      affiliationCode,
      start: "",
      end: "",
      active: true,
    });
  }

  return stations;
}

function countByAffiliation(stations) {
  return stations.reduce((counts, station) => {
    counts[station.affiliation] = (counts[station.affiliation] ?? 0) + 1;
    return counts;
  }, {});
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        if (response.statusCode !== 200) {
          reject(new Error(`Request failed: ${response.statusCode}`));
          response.resume();
          return;
        }

        response.setEncoding("utf8");
        let data = "";
        response.on("data", (chunk) => {
          data += chunk;
        });
        response.on("end", () => resolve(data));
      })
      .on("error", reject);
  });
}

function stripBom(text) {
  return text.replace(/^\uFEFF/, "");
}

function cleanAreaName(name) {
  return String(name)
    .replace(/^気象庁予報警報規程別表第四の二に示す「(.+)」の区域$/, "$1")
    .trim();
}

function findFeatureAtPoint(geojson, longitude, latitude) {
  return geojson.features.find((feature) =>
    getFeaturePolygons(feature).some((polygon) => pointInPolygon([longitude, latitude], polygon)),
  );
}

function findNearestFeature(geojson, longitude, latitude) {
  const point = [longitude, latitude];
  let nearestFeature = null;
  let nearestDistance = Infinity;

  for (const feature of geojson.features) {
    const distance = getFeaturePolygons(feature).reduce(
      (minimum, polygon) => Math.min(minimum, distanceToPolygonKilometers(point, polygon)),
      Infinity,
    );

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestFeature = feature;
    }
  }

  return nearestFeature;
}

function getFeaturePolygons(feature) {
  if (feature.geometry.type === "Polygon") {
    return [feature.geometry.coordinates];
  }

  if (feature.geometry.type === "MultiPolygon") {
    return feature.geometry.coordinates;
  }

  return [];
}

function pointInPolygon(point, polygon) {
  return pointInRing(point, polygon[0]) && polygon.slice(1).every((ring) => !pointInRing(point, ring));
}

function distanceToPolygonKilometers(point, polygon) {
  if (pointInPolygon(point, polygon)) {
    return 0;
  }

  return polygon.reduce(
    (minimum, ring) => Math.min(minimum, distanceToRingKilometers(point, ring)),
    Infinity,
  );
}

function distanceToRingKilometers(point, ring) {
  let minimum = Infinity;

  for (let index = 0; index < ring.length - 1; index += 1) {
    minimum = Math.min(minimum, distanceToSegmentKilometers(point, ring[index], ring[index + 1]));
  }

  return minimum;
}

function distanceToSegmentKilometers(point, start, end) {
  const x = point[0];
  const y = point[1];
  const x1 = start[0];
  const y1 = start[1];
  const x2 = end[0];
  const y2 = end[1];
  const dx = x2 - x1;
  const dy = y2 - y1;
  const lengthSquared = dx * dx + dy * dy;
  const t = lengthSquared === 0 ? 0 : Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / lengthSquared));
  const nearest = [x1 + t * dx, y1 + t * dy];
  return haversineKilometers(point, nearest);
}

function pointInRing(point, ring) {
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];
    const intersects =
      yi > point[1] !== yj > point[1] &&
      point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi || Number.EPSILON) + xi;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

function haversineKilometers(start, end) {
  const earthRadiusKm = 6371;
  const startLat = toRadians(start[1]);
  const endLat = toRadians(end[1]);
  const deltaLat = toRadians(end[1] - start[1]);
  const deltaLon = toRadians(end[0] - start[0]);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(deltaLon / 2) ** 2;

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function round(value, digits) {
  const scale = 10 ** digits;
  return Math.round(value * scale) / scale;
}

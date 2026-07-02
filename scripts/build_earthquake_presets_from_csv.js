const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const sourceDir = "C:\\開発\\ソース\\気象・地震シミュレーション\\主要地震";
const eewSourceDir = "C:\\開発\\ソース\\気象・地震シミュレーション\\緊急地震速報（警報）";
const outputPath = path.join(root, "web", "data", "earthquake_presets.json");

const presetFiles = [
  "兵庫県南部地震（1995）.csv",
  "新潟県中越地震（2004）.csv",
  "東北地方太平洋沖地震（2011）.csv",
  "熊本地震 前震（2016）.csv",
  "熊本地震 本震（2016）.csv",
  "大阪北部地震（2018）.csv",
  "北海道胆振東部地震（2018）.csv",
  "能登半島沖地震（2024）.csv",
];

const eewForecastAreasByName = {
  "兵庫県南部地震（1995）": ["近畿"],
  "新潟県中越地震（2004）": ["新潟", "長野"],
  "東北地方太平洋沖地震（2011）": ["東北", "関東", "新潟", "長野", "静岡"],
  "熊本地震 前震（2016）": ["九州"],
  "熊本地震 本震（2016）": ["九州"],
  "大阪北部地震（2018）": ["近畿"],
  "北海道胆振東部地震（2018）": ["北海道"],
  "能登半島沖地震（2024）": ["北陸", "長野"],
};

const representativeIntensity = new Map([
  ["震度７", 6.5],
  ["震度6強", 6.0],
  ["震度６強", 6.0],
  ["震度6弱", 5.5],
  ["震度６弱", 5.5],
  ["震度6", 5.5],
  ["震度６", 5.5],
  ["震度5強", 5.0],
  ["震度５強", 5.0],
  ["震度5弱", 4.5],
  ["震度５弱", 4.5],
  ["震度5", 4.5],
  ["震度５", 4.5],
  ["震度4", 3.5],
  ["震度４", 3.5],
  ["震度3", 2.5],
  ["震度３", 2.5],
  ["震度2", 1.5],
  ["震度２", 1.5],
  ["震度1", 0.5],
  ["震度１", 0.5],
]);

function main() {
  const presets = presetFiles.map((fileName) => parsePreset(fileName));
  const output = {
    sourceDirectory: sourceDir,
    generatedAt: new Date().toISOString(),
    note: "CSVに計測震度がない観測点は measuredIntensity: null とし、表示では '-' とする。",
    presets,
  };

  fs.writeFileSync(outputPath, `${JSON.stringify(output)}\n`, "utf8");
  console.log(`Wrote ${presets.length} presets to ${path.relative(root, outputPath)}`);
}

function parsePreset(fileName) {
  const eventName = fileName.replace(/\.csv$/i, "");
  const filePath = path.join(sourceDir, fileName);
  const rows = parseCsv(fs.readFileSync(filePath, "utf8")).filter((row) =>
    row.some((cell) => String(cell).trim() !== ""),
  );
  const headers = rows[0];
  const eventRows = [];
  let index = 1;

  while (index < rows.length && rows[index][0] !== "都道府県") {
    if (rows[index].length >= headers.length) {
      eventRows.push(objectFromRow(headers, rows[index]));
    }
    index += 1;
  }

  const primaryEvent = eventRows[0];
  const observationHeader = rows[index] ?? [];
  const observations = [];
  for (index += 1; index < rows.length; index += 1) {
    const row = objectFromRow(observationHeader, rows[index]);
    const intensityLabel = normalizeIntensityLabel(row["震度"]);
    const intensityValue = getRepresentativeIntensityValue(intensityLabel);
    const stationNames = splitStationNames(row["観測点名"]);

    if (!Number.isFinite(intensityValue)) {
      continue;
    }

    stationNames.forEach((stationName) => {
      observations.push({
        prefecture: row["都道府県"] ?? "",
        stationName,
        intensityLabel,
        intensityValue,
        measuredIntensity: null,
      });
    });
  }
  const detailedObservations = parseDetailedObservations(eventName);
  const finalObservations =
    detailedObservations.length > 0
      ? dedupeObservations([...detailedObservations, ...observations])
      : dedupeObservations(observations);

  return {
    id: slugify(eventName),
    label: eventName,
    date: primaryEvent["地震の発生日"] ?? "",
    time: primaryEvent["地震の発生時刻"] ?? "",
    epicenterName: primaryEvent["震央地名"] ?? eventName,
    latitude: parseCoordinate(primaryEvent["緯度"]),
    longitude: parseCoordinate(primaryEvent["経度"]),
    depthKm: parseDepth(primaryEvent["深さ"]),
    magnitude: parseMagnitude(primaryEvent["Ｍ"]),
    maxIntensity: primaryEvent["最大震度"] ?? "",
    observedStations: finalObservations,
    eewForecastAreas: eewForecastAreasByName[eventName] ?? [],
    eewReports: parseEewReports(eventName),
  };
}

function parseDetailedObservations(eventName) {
  const filePath = path.join(sourceDir, `【詳細1】${eventName}.csv`);
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const rows = parseCsv(fs.readFileSync(filePath, "utf8")).filter((row) =>
    row.some((cell) => String(cell).trim() !== ""),
  );
  const observations = [];
  let currentIntensityLabel = "";
  let currentIntensityValue = null;

  rows.slice(1).forEach((row) => {
    const firstCell = normalizeIntensityLabel(row[0]);
    const nextIntensityValue = getRepresentativeIntensityValue(firstCell);
    let prefecture = "";
    let stationText = "";

    if (Number.isFinite(nextIntensityValue)) {
      currentIntensityLabel = firstCell;
      currentIntensityValue = nextIntensityValue;
      prefecture = row[1] ?? "";
      stationText = row[2] ?? "";
    } else if (Number.isFinite(currentIntensityValue)) {
      prefecture = row[0] ?? "";
      stationText = row[1] ?? row[2] ?? "";
    }

    splitStationNames(stationText).forEach((stationName) => {
      observations.push({
        prefecture,
        stationName,
        intensityLabel: currentIntensityLabel,
        intensityValue: currentIntensityValue,
        measuredIntensity: null,
      });
    });
  });

  return dedupeObservations(observations);
}

function parseEewReports(eventName) {
  const filePath = path.join(eewSourceDir, `緊急地震速報 ${eventName}.csv`);
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const rows = parseCsv(fs.readFileSync(filePath, "utf8")).filter((row) =>
    row.some((cell) => String(cell).trim() !== ""),
  );
  const warningReportNumbers = parseWarningReportNumbers(rows);
  const reportRows = [];
  const detailAreasByMarker = new Map();
  let currentMarker = null;

  rows.forEach((row) => {
    const firstCell = String(row[0] ?? "").trim();
    const elapsedSec = Number(row[2]);
    const marker = String(row[7] ?? "").trim();

    if (/^\d+$/.test(firstCell) && Number.isFinite(elapsedSec)) {
      reportRows.push({
        reportNumber: Number(firstCell),
        elapsedSec,
        marker,
      });
      return;
    }

    if (/^※\d+/.test(firstCell)) {
      currentMarker = firstCell;
    }

    if (!currentMarker || !/^※\d+/.test(currentMarker)) {
      return;
    }

    const detailType = String(row[1] ?? "").trim();
    if (!isEewWarningDetailType(detailType)) {
      return;
    }

    const areaText = String(row[2] ?? "").trim();
    if (!areaText || areaText === "—" || areaText === "--") {
      return;
    }

    const areas = splitEewAreas(areaText);
    if (areas.length === 0) {
      return;
    }

    const areaSet = detailAreasByMarker.get(currentMarker) ?? new Set();
    areas.forEach((area) => areaSet.add(area));
    detailAreasByMarker.set(currentMarker, areaSet);
  });

  const firstWarningReportNumber =
    warningReportNumbers.length > 0 ? Math.min(...warningReportNumbers) : 1;
  let cumulativeAreas = new Set();

  return reportRows
    .filter((report) => report.reportNumber >= firstWarningReportNumber)
    .map((report) => {
      const areas = detailAreasByMarker.get(report.marker) ?? new Set();
      cumulativeAreas = new Set([...cumulativeAreas, ...areas]);
      return {
        reportNumber: report.reportNumber,
        elapsedSec: report.elapsedSec,
        marker: report.marker,
        areas: [...cumulativeAreas],
      };
    })
    .filter((report) => report.areas.length > 0);
}

function isEewWarningDetailType(value) {
  const detailType = String(value ?? "").normalize("NFKC").replace(/\s+/g, "");
  if (detailType.startsWith("震度")) {
    return true;
  }

  const longPeriodMatch = detailType.match(/長周期地震動階級(\d+)/);
  return longPeriodMatch ? Number(longPeriodMatch[1]) >= 3 : false;
}

function parseWarningReportNumbers(rows) {
  const text = rows.map((row) => row.join(" ")).join(" ");
  const match = text.match(/警報[^第]*\[([^\]]+)\]/);
  if (!match) {
    return [];
  }

  return [...match[1].matchAll(/第\s*(\d+)\s*報/g)].map((item) => Number(item[1]));
}

function splitEewAreas(value) {
  return String(value ?? "")
    .split(/[、,]/)
    .map((area) => area.trim())
    .filter(Boolean);
}

function objectFromRow(headers, row) {
  return Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""]));
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let value = "";
  let inQuotes = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];
    const next = text[index + 1];

    if (char === '"' && inQuotes && next === '"') {
      value += '"';
      index += 1;
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(value.trim());
      value = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") {
        index += 1;
      }
      row.push(value.trim());
      rows.push(row);
      row = [];
      value = "";
      continue;
    }

    value += char;
  }

  if (value.length > 0 || row.length > 0) {
    row.push(value.trim());
    rows.push(row);
  }

  return rows;
}

function splitStationNames(value) {
  return String(value ?? "")
    .split(/[、,・\s]+/)
    .map((stationName) => cleanStationName(stationName))
    .filter(Boolean);
}

function cleanStationName(stationName) {
  return String(stationName ?? "")
    .replace(/[＊*]/g, "")
    .replace(/（旧[^）]*）/g, "")
    .replace(/\(旧[^)]*\)/g, "")
    .trim();
}

function normalizeIntensityLabel(value) {
  return String(value ?? "").replace(/\s+/g, "");
}

function getRepresentativeIntensityValue(label) {
  const normalizedLabel = normalizeIntensityLabel(label);
  const candidates = [
    normalizedLabel,
    `震度${normalizedLabel}`,
    normalizedLabel.replace(/^震度/, ""),
  ];

  for (const candidate of candidates) {
    if (representativeIntensity.has(candidate)) {
      return representativeIntensity.get(candidate);
    }
  }

  if (/^7$|震度7/.test(normalizedLabel)) return 6.5;
  if (/^6強$|震度6強|６強/.test(normalizedLabel)) return 6.0;
  if (/^6弱$|震度6弱|６弱/.test(normalizedLabel)) return 5.5;
  if (/^6$|震度6/.test(normalizedLabel)) return 5.5;
  if (/^5強$|震度5強|５強/.test(normalizedLabel)) return 5.0;
  if (/^5弱$|震度5弱|５弱/.test(normalizedLabel)) return 4.5;
  if (/^5$|震度5/.test(normalizedLabel)) return 4.5;
  if (/^4$|震度4/.test(normalizedLabel)) return 3.5;
  if (/^3$|震度3/.test(normalizedLabel)) return 2.5;
  if (/^2$|震度2/.test(normalizedLabel)) return 1.5;
  if (/^1$|震度1/.test(normalizedLabel)) return 0.5;
  return null;
}

function dedupeObservations(observations) {
  const seen = new Set();
  return observations.filter((observation) => {
    const stationName = cleanStationName(observation.stationName);
    if (!stationName) {
      return false;
    }

    const key = `${observation.prefecture}|${stationName}|${observation.intensityValue}`;
    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    observation.stationName = stationName;
    return true;
  });
}

function parseCoordinate(value) {
  const match = String(value ?? "").match(/(\d+(?:\.\d+)?)°\s*(\d+(?:\.\d+)?)?′?/);
  if (!match) {
    return null;
  }

  const degrees = Number(match[1]);
  const minutes = Number(match[2] ?? 0);
  return Number((degrees + minutes / 60).toFixed(4));
}

function parseDepth(value) {
  if (/ごく浅い/.test(String(value ?? ""))) {
    return 0;
  }

  const match = String(value ?? "").match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : 10;
}

function parseMagnitude(value) {
  const match = String(value ?? "").match(/\d+(?:\.\d+)?/);
  return match ? Number(match[0]) : 0;
}

function slugify(value) {
  return String(value)
    .normalize("NFKC")
    .replace(/[（）]/g, "-")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

main();

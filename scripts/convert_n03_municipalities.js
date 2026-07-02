const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const defaultJmaInputDir = path.join(root, "data", "raw", "jma_weather_city_areas");
const defaultN03InputDir = path.join(root, "data", "raw", "N03-20230101_GML");
const legacyN03InputDir = path.join(root, "N03-180101_GML");
const inputDir = process.env.MUNICIPALITIES_INPUT_DIR
  ? path.resolve(root, process.env.MUNICIPALITIES_INPUT_DIR)
  : firstExistingDirectory([defaultJmaInputDir, defaultN03InputDir, legacyN03InputDir]);
const outputPath = path.join(root, "web", "data", "municipalities.geojson");
const namesOutputPath = path.join(root, "data", "processed", "municipality_names.json");
const tolerance = Number(process.env.SIMPLIFY_TOLERANCE || 0.0004);
const minArea = Number(process.env.MIN_RING_AREA || 0.000001);
const sourceName = path.relative(root, inputDir);

const shpPath = findFile(".shp");
const dbfPath = findFile(".dbf");
const { records, schema } = readDbf(dbfPath);
const municipalityMap = new Map();

readShp(shpPath, (recordIndex, rings) => {
  const record = records[recordIndex];
  const municipality = normalizeMunicipalityRecord(record, schema);

  if (!municipality?.code) {
    return;
  }

  if (!municipalityMap.has(municipality.code)) {
    municipalityMap.set(municipality.code, {
      ...municipality,
      polygons: [],
    });
  }

  municipalityMap.get(municipality.code).polygons.push(...buildPolygons(rings));
});

const municipalities = [...municipalityMap.values()].filter(
  (municipality) => municipality.polygons.length > 0,
);

const features = municipalities.map((municipality) => ({
  type: "Feature",
  properties: {
    code: municipality.code,
    prefectureCode: municipality.prefectureCode,
    prefecture: municipality.prefecture,
    subprefecture: municipality.subprefecture,
    county: municipality.county,
    municipality: municipality.municipality,
    name: municipality.name,
    nameKana: municipality.nameKana,
    source: sourceName,
  },
  geometry: {
    type: "MultiPolygon",
    coordinates: municipality.polygons,
  },
}));

const municipalityNames = municipalities
  .map((municipality) => ({
    code: municipality.code,
    prefectureCode: municipality.prefectureCode,
    prefecture: municipality.prefecture,
    subprefecture: municipality.subprefecture,
    county: municipality.county,
    municipality: municipality.municipality,
    name: municipality.name,
    nameKana: municipality.nameKana,
  }))
  .sort((a, b) => a.code.localeCompare(b.code, "ja"));

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(
  outputPath,
  JSON.stringify({
    type: "FeatureCollection",
    name: schema === "jma_weather_city" ? "JMA weather warning municipalities" : "N03 municipalities",
    source: sourceName,
    features,
  }),
);

fs.mkdirSync(path.dirname(namesOutputPath), { recursive: true });
let wroteMunicipalityNames = true;
try {
  fs.writeFileSync(
    namesOutputPath,
    JSON.stringify(
      {
        source: sourceName,
        schema,
        count: municipalityNames.length,
        municipalities: municipalityNames,
      },
      null,
      2,
    ),
  );
} catch (error) {
  if (error.code !== "EPERM") {
    throw error;
  }

  wroteMunicipalityNames = false;
  console.warn(`Skipped locked municipality names file: ${path.relative(root, namesOutputPath)}`);
}

console.log(`Input schema: ${schema}`);
console.log(`Wrote ${features.length} municipalities to ${path.relative(root, outputPath)}`);
if (wroteMunicipalityNames) {
  console.log(`Wrote ${municipalityNames.length} municipality names to ${path.relative(root, namesOutputPath)}`);
}

function firstExistingDirectory(directories) {
  const directory = directories.find((candidate) => fs.existsSync(candidate));

  if (!directory) {
    throw new Error(`No municipality input directory found: ${directories.join(", ")}`);
  }

  return directory;
}

function findFile(extension) {
  const fileName = fs.readdirSync(inputDir).find((name) => name.endsWith(extension));
  if (!fileName) {
    throw new Error(`No ${extension} file found in ${inputDir}`);
  }
  return path.join(inputDir, fileName);
}

function normalizeMunicipalityRecord(record, schema) {
  if (schema === "jma_weather_city") {
    const code = record.regioncode;
    const name = cleanWeatherCityName(record.regionname, record.name);

    return {
      code,
      prefectureCode: code.slice(0, 2),
      prefecture: record.regionname.match(/^(東京都|北海道|(?:京都|大阪)府|.{2,3}県)/u)?.[0] ?? "",
      subprefecture: "",
      county: "",
      municipality: name,
      name,
      nameKana: record.namekana,
    };
  }

  const code = record.N03_007;
  if (!code) {
    return null;
  }

  const municipality = {
    code,
    prefectureCode: code.slice(0, 2),
    prefecture: record.N03_001,
    subprefecture: record.N03_002,
    county: record.N03_003,
    municipality: record.N03_004,
    nameKana: "",
  };

  return {
    ...municipality,
    name: municipalityName(municipality),
  };
}

function municipalityName(municipality) {
  const area = municipality.county ?? "";
  const name = municipality.municipality ?? "";

  if (area && name.startsWith(area)) {
    return [municipality.prefecture, name].filter(Boolean).join("");
  }

  return [municipality.prefecture, area, name].filter(Boolean).join("");
}

function cleanWeatherCityName(regionName, fallbackName) {
  return (
    String(regionName ?? "").match(/^気象庁予報警報規程別表第四の二に示す「(.+)」の区域$/)?.[1] ??
    fallbackName ??
    regionName ??
    ""
  );
}

function readDbf(filePath) {
  const buffer = fs.readFileSync(filePath);
  const recordCount = buffer.readUInt32LE(4);
  const headerLength = buffer.readUInt16LE(8);
  const recordLength = buffer.readUInt16LE(10);
  const fields = [];

  for (let offset = 32; buffer[offset] !== 0x0d; offset += 32) {
    fields.push({
      name: buffer.subarray(offset, offset + 11).toString("ascii").replace(/\0/g, ""),
      length: buffer[offset + 16],
      offset: fields.reduce((sum, field) => sum + field.length, 1),
    });
  }

  const fieldNames = fields.map((field) => field.name);
  const schema = fieldNames.includes("regioncode") && fieldNames.includes("regionname")
    ? "jma_weather_city"
    : "n03";
  const decoder = new TextDecoder(schema === "jma_weather_city" ? "utf-8" : "shift_jis");

  return {
    schema,
    records: Array.from({ length: recordCount }, (_, recordIndex) => {
      const start = headerLength + recordIndex * recordLength;
      const record = {};

      for (const field of fields) {
        const raw = buffer.subarray(start + field.offset, start + field.offset + field.length);
        record[field.name] = decoder.decode(raw).trim();
      }

      return record;
    }),
  };
}

function readShp(filePath, onRecord) {
  const buffer = fs.readFileSync(filePath);
  let offset = 100;
  let recordIndex = 0;

  while (offset < buffer.length) {
    const contentLength = buffer.readInt32BE(offset + 4) * 2;
    const recordStart = offset + 8;
    const shapeType = buffer.readInt32LE(recordStart);

    if (shapeType !== 5) {
      offset += 8 + contentLength;
      recordIndex += 1;
      continue;
    }

    const partCount = buffer.readInt32LE(recordStart + 36);
    const pointCount = buffer.readInt32LE(recordStart + 40);
    const partOffsets = Array.from({ length: partCount }, (_, index) =>
      buffer.readInt32LE(recordStart + 44 + index * 4),
    );
    const pointStart = recordStart + 44 + partCount * 4;
    const points = Array.from({ length: pointCount }, (_, index) => {
      const pointOffset = pointStart + index * 16;
      return [buffer.readDoubleLE(pointOffset), buffer.readDoubleLE(pointOffset + 8)];
    });

    const rings = partOffsets
      .map((start, index) => {
        const end = partOffsets[index + 1] ?? points.length;
        return simplifyRing(points.slice(start, end));
      })
      .filter((ring) => ring.length >= 4 && Math.abs(ringArea(ring)) >= minArea);

    onRecord(recordIndex, rings);
    offset += 8 + contentLength;
    recordIndex += 1;
  }
}

function simplifyRing(ring) {
  const openRing = pointsEqual(ring[0], ring.at(-1)) ? ring.slice(0, -1) : ring;
  const simplified = tolerance > 0 ? douglasPeucker(openRing, tolerance) : openRing;
  const rounded = simplified.map(([longitude, latitude]) => [
    Number(longitude.toFixed(5)),
    Number(latitude.toFixed(5)),
  ]);

  if (!pointsEqual(rounded[0], rounded.at(-1))) {
    rounded.push([...rounded[0]]);
  }

  return rounded;
}

function buildPolygons(rings) {
  const outers = [];
  const holes = [];

  for (const ring of rings) {
    const item = { ring, area: ringArea(ring) };

    if (item.area < 0) {
      outers.push(item);
    } else {
      holes.push(item);
    }
  }

  if (outers.length === 0) {
    return rings.map((ring) => [ensureClockwise(ring)]);
  }

  const polygons = outers
    .sort((a, b) => Math.abs(b.area) - Math.abs(a.area))
    .map((outer) => [ensureClockwise(outer.ring)]);

  for (const hole of holes) {
    const point = hole.ring[0];
    const containerIndex = outers.findIndex((outer) => pointInRing(point, outer.ring));

    if (containerIndex >= 0) {
      polygons[containerIndex].push(ensureCounterClockwise(hole.ring));
    }
  }

  return polygons;
}

function ensureClockwise(ring) {
  return ringArea(ring) <= 0 ? ring : [...ring].reverse();
}

function ensureCounterClockwise(ring) {
  return ringArea(ring) >= 0 ? ring : [...ring].reverse();
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
      point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

function douglasPeucker(points, epsilon) {
  if (points.length <= 3) {
    return points;
  }

  let maxDistance = 0;
  let maxIndex = 0;

  for (let index = 1; index < points.length - 1; index += 1) {
    const distance = perpendicularDistance(points[index], points[0], points.at(-1));
    if (distance > maxDistance) {
      maxDistance = distance;
      maxIndex = index;
    }
  }

  if (maxDistance <= epsilon) {
    return [points[0], points.at(-1)];
  }

  return [
    ...douglasPeucker(points.slice(0, maxIndex + 1), epsilon).slice(0, -1),
    ...douglasPeucker(points.slice(maxIndex), epsilon),
  ];
}

function perpendicularDistance(point, start, end) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];

  if (dx === 0 && dy === 0) {
    return Math.hypot(point[0] - start[0], point[1] - start[1]);
  }

  return Math.abs(dy * point[0] - dx * point[1] + end[0] * start[1] - end[1] * start[0]) /
    Math.hypot(dx, dy);
}

function ringArea(ring) {
  return ring.reduce((sum, point, index) => {
    const next = ring[(index + 1) % ring.length];
    return sum + point[0] * next[1] - next[0] * point[1];
  }, 0) / 2;
}

function pointsEqual(a, b) {
  return a[0] === b[0] && a[1] === b[1];
}

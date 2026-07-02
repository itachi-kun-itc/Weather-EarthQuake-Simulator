const MUNICIPALITIES_URL = "./data/municipalities.geojson";
const BOUNDARY_LAYERS_URL = "./data/boundary_layers.geojson";
const JMA_LOCAL_AREAS_URL = "./data/jma_local_areas.geojson";
const SEA_EPICENTER_AREAS_URL = "./data/sea_epicenter_areas.geojson";
const PLATE_BOUNDARIES_URL = "./data/plate_boundaries.geojson";
const SURROUNDING_LAND_URL = "./data/surrounding_land.geojson";
const GROUND_MODEL_URL = "./data/ground_model.json";
const SHINDO_STATIONS_URL = "./data/jma_shindo_stations.json";
const EARTHQUAKE_PRESETS_URL = "./data/earthquake_presets.json";

const INITIAL_CENTER = [139.767, 35.681];
const INITIAL_ZOOM = 5.25;
const MUNICIPALITY_BOUNDARY_MIN_ZOOM = 8;
const EARTH_RADIUS_KM = 6371;
const EARTHQUAKE_MODEL = {
  pWaveVelocityKmPerSec: 6.5,
  sWaveVelocityKmPerSec: 3.8,
  eewProcessingDelaySec: 2.0,
  defaultSiteAmplification: 0,
};
const EEW_BLINK_INTERVAL_SEC = 0.7;
const EEW_BLINK_PHASES = 6;
const EARTHQUAKE_PRESETS = [
  {
    id: "tohoku-2011",
    label: "東北地方太平洋沖地震（2011）",
    latitude: 38 + 6.2 / 60,
    longitude: 142 + 51.6 / 60,
    depthKm: 24,
    magnitude: 9.0,
    epicenterName: "三陸沖",
    observedStations: [
      { stationId: "00518", intensityValue: 6.6 },
      ...observationsFromNames(
        [
          "栗原市若柳",
          "石巻市桃生町",
          "登米市米山町",
          "大崎市古川三日町",
          "大崎市田尻",
          "宮城川崎町前川",
          "仙台宮城野区苦竹",
          "名取市増田",
          "栗原市高清水",
          "大崎市古川北町",
          "宮城美里町木間塚",
          "東松島市矢本",
          "大崎市鹿島台",
          "栗原市一迫",
          "塩竈市旭町",
          "涌谷町新町",
          "大衡村大衡",
          "蔵王町円田",
          "登米市南方町",
          "山元町浅生原",
        ],
        6.1,
      ),
      ...observationsFromNames(
        [
          "栗原市金成",
          "登米市迫町",
          "大崎市松山",
          "岩沼市桜",
          "石巻市門脇",
          "石巻市前谷地",
          "気仙沼市赤岩",
          "角田市角田",
          "仙台若林区遠見塚",
          "仙台泉区将監",
          "宮城美里町北浦",
          "登米市豊里町",
          "仙台青葉区大倉",
          "登米市登米町",
          "栗原市栗駒",
          "東松島市小野",
          "松島町高城",
          "登米市中田町",
          "白石市亘理町",
          "利府町利府",
          "大郷町粕川",
          "大河原町新南",
          "仙台宮城野区五輪",
          "南三陸町歌津",
          "石巻市鮎川浜",
          "仙台空港",
          "亘理町下小路",
          "大和町吉岡",
        ],
        5.7,
      ),
    ],
    eewForecastAreas: ["東北", "関東", "新潟", "長野", "静岡"],
  },
  {
    id: "osaka-northern-2018",
    label: "大阪北部地震（2018）",
    latitude: 34 + 50.6 / 60,
    longitude: 135 + 37.2 / 60,
    depthKm: 13,
    magnitude: 6.1,
    epicenterName: "大阪府北部",
    observedStations: [
      { stationId: "02670", intensityValue: 5.6 },
      { stationId: "02678", intensityValue: 5.6 },
      { stationId: "02682", intensityValue: 5.6 },
      { stationId: "02683", intensityValue: 5.6 },
      { stationId: "02688", intensityValue: 5.6 },
      ...observationsFromNames(
        [
          "大阪都島区都島本通",
          "大阪東淀川区北江口",
          "大阪旭区大宮",
          "大阪淀川区木川東",
          "豊中市曽根南町",
          "豊中市役所",
          "吹田市内本町",
          "高槻市桃園町",
          "高槻市消防本部",
          "寝屋川市役所",
          "箕面市箕面",
          "摂津市三島",
          "交野市私部",
          "島本町若山台",
          "京都中京区河原町御池",
          "京都伏見区向島",
          "京都伏見区久我",
          "京都西京区大枝",
          "亀岡市余部町",
          "長岡京市開田",
          "八幡市八幡",
          "大山崎町円明寺",
          "久御山町田井",
        ],
        5.1,
      ),
      ...observationsFromNames(
        [
          "大阪福島区福島",
          "大阪此花区春日出北",
          "大阪港区築港",
          "大阪西淀川区千舟",
          "大阪東淀川区柴島",
          "大阪生野区舎利寺",
          "大阪国際空港",
          "池田市城南",
          "守口市京阪本通",
          "大東市新町",
          "四條畷市中野",
          "豊能町余野",
          "能勢町役場",
          "京都伏見区竹田",
          "京都伏見区醍醐",
          "京都伏見区淀",
          "京都西京区樫原",
          "宇治市宇治琵琶",
          "宇治市折居台",
          "亀岡市安町",
          "城陽市寺田",
          "向日市寺戸町",
          "京田辺市田辺",
          "井手町井手",
          "精華町南稲八妻",
          "南丹市八木町八木",
          "大津市南郷",
          "尼崎市昭和通",
          "西宮市宮前町",
          "西宮市平木",
          "伊丹市千僧",
          "川西市中央町",
          "大和郡山市北郡山町",
          "御所市役所",
          "高取町観覚寺",
          "広陵町南郷",
        ],
        4.6,
      ),
      ...observationsFromNames(
        [
          "大阪西区九条南",
          "大阪大正区泉尾",
          "大阪天王寺区上本町",
          "大阪浪速区元町",
          "大阪東成区東中本",
          "大阪城東区放出西",
          "大阪阿倍野区松崎町",
          "大阪住吉区遠里小野",
          "大阪東住吉区杭全",
          "大阪西成区岸里",
          "大阪鶴見区横堤",
          "大阪住之江区御崎",
          "大阪平野区平野南",
          "大阪中央区大手前",
          "八尾市本町",
          "柏原市安堂町",
          "門真市中町",
          "東大阪市荒本北",
          "能勢町今西",
          "岸和田市畑町",
          "泉大津市東雲町",
          "富田林市高辺台",
          "松原市阿保",
          "大阪和泉市府中町",
          "羽曳野市誉田",
          "藤井寺市岡",
          "大阪太子町山田",
          "河南町白木",
          "大阪堺市堺区山本町",
          "大阪堺市堺区大浜南町",
        ],
        4.0,
      ),
    ],
    eewForecastAreas: ["近畿"],
  },
  {
    id: "kumamoto-2016",
    label: "熊本地震（2016）",
    latitude: 32 + 45.2 / 60,
    longitude: 130 + 45.7 / 60,
    depthKm: 12,
    magnitude: 7.3,
    epicenterName: "熊本県熊本地方",
    observedStations: [
      { stationId: "03947", intensityValue: 6.7 },
      { stationId: "03944", intensityValue: 6.6 },
      ...observationsFromNames(
        [
          "菊池市旭志",
          "南阿蘇村河陽",
          "宇土市浦田町",
          "嘉島町上島",
          "合志市竹迫",
          "宇城市豊野町",
          "大津町大津",
          "宇城市松橋町",
          "宇城市小川町",
          "熊本中央区大江",
          "熊本東区佐土原",
          "熊本西区春日",
        ],
        6.1,
      ),
      ...observationsFromNames(
        [
          "南阿蘇村中松",
          "熊本美里町馬場",
          "宇城市不知火町",
          "熊本南区城南町",
          "熊本南区富合町",
          "菊陽町久保田",
          "熊本北区植木町",
          "阿蘇市内牧",
          "菊池市隈府",
          "山都町下馬尾",
          "氷川町島地",
          "和水町江田",
          "大津町引水",
          "御船町御船",
          "玉名市天水町",
          "熊本美里町永富",
          "菊池市泗水町",
          "合志市御代志",
          "玉名市横島町",
          "阿蘇市一の宮町",
          "上天草市大矢野町",
          "天草市五和町",
          "八代市鏡町",
        ],
        5.7,
      ),
      ...observationsFromNames(
        [
          "南小国町赤馬場",
          "産山村山鹿",
          "玉東町木葉",
          "南阿蘇村吉田",
          "八代市千丁町",
          "熊本高森町高森",
          "甲佐町豊内",
          "氷川町宮原",
          "八代市松江城町",
          "山鹿市鹿央町",
          "菊池市七城町",
          "熊本小国町宮原",
          "長洲町長洲",
          "八代市平山新町",
          "上天草市松島町",
          "山鹿市菊鹿町",
          "玉名市中尾",
          "山鹿市鹿本町",
          "芦北町芦北",
          "芦北町田浦町",
        ],
        5.2,
      ),
      ...observationsFromNames(
        [
          "阿蘇市波野",
          "八代市坂本町",
          "玉名市岱明町",
          "山都町大平",
          "山都町今",
          "和水町板楠",
          "山江村山田",
          "山鹿市老人福祉センター",
          "山鹿市山鹿",
          "宇城市三角町",
          "津奈木町小津奈木",
          "荒尾市宮内出目",
          "八代市泉支所",
          "南関町関町",
          "人吉市西間下町",
          "あさぎり町須惠",
          "八代市東陽町",
          "水俣市牧ノ内",
          "上天草市姫戸町",
        ],
        4.7,
      ),
    ],
    eewForecastAreas: ["九州"],
  },
];
const INTENSITY_CLASSES = [
  { label: "0", shortLabel: "0", min: 0, color: "#d9dde3", textColor: "#1f2937", rank: 0 },
  { label: "1", shortLabel: "1", min: 0.5, color: "#ffffff", textColor: "#111827", rank: 1 },
  { label: "2", shortLabel: "2", min: 1.5, color: "#74d7ff", textColor: "#111827", rank: 2 },
  { label: "3", shortLabel: "3", min: 2.5, color: "#0068b7", textColor: "#ffffff", rank: 3 },
  { label: "4", shortLabel: "4", min: 3.5, color: "#fff2a8", textColor: "#111827", rank: 4 },
  { label: "5弱", shortLabel: "5-", min: 4.5, color: "#ffd400", textColor: "#111827", rank: 5 },
  { label: "5強", shortLabel: "5+", min: 5.0, color: "#ff8a00", textColor: "#111827", rank: 6 },
  { label: "6弱", shortLabel: "6-", min: 5.5, color: "#e60012", textColor: "#ffffff", rank: 7 },
  { label: "6強", shortLabel: "6+", min: 6.0, color: "#a50034", textColor: "#ffffff", rank: 8 },
  { label: "7", shortLabel: "7", min: 6.5, color: "#5f007e", textColor: "#ffffff", rank: 9 },
];
const INTENSITY_COLOR_SCHEMES = {
  low: {
    colors: {
      0: "#cfd4da",
      1: "#f2f4f7",
      2: "#9ed7e8",
      3: "#4f8fc1",
      4: "#eee4ad",
      "5-": "#e7cf60",
      "5+": "#d8994a",
      "6-": "#c95757",
      "6+": "#a74762",
      7: "#7c4b91",
    },
    textColors: {
      0: "#1f2937",
      1: "#111827",
      2: "#102a35",
      3: "#ffffff",
      4: "#222222",
      "5-": "#1d1d1d",
      "5+": "#171717",
      "6-": "#ffffff",
      "6+": "#ffffff",
      7: "#ffffff",
    },
  },
  normal: {
    colors: {
      0: "#d9dde3",
      1: "#ffffff",
      2: "#74d7ff",
      3: "#0068b7",
      4: "#fff2a8",
      "5-": "#ffd400",
      "5+": "#ff8a00",
      "6-": "#e60012",
      "6+": "#a50034",
      7: "#5f007e",
    },
    textColors: {
      0: "#1f2937",
      1: "#111827",
      2: "#111827",
      3: "#ffffff",
      4: "#111827",
      "5-": "#111827",
      "5+": "#111827",
      "6-": "#ffffff",
      "6+": "#ffffff",
      7: "#ffffff",
    },
  },
  high: {
    colors: {
      0: "#c4cbd3",
      1: "#ffffff",
      2: "#00c8ff",
      3: "#0047ff",
      4: "#fff000",
      "5-": "#ffd000",
      "5+": "#ff7a00",
      "6-": "#ff1a1a",
      "6+": "#b00030",
      7: "#6a00a8",
    },
    textColors: {
      0: "#111827",
      1: "#111827",
      2: "#001b2a",
      3: "#ffffff",
      4: "#111827",
      "5-": "#111827",
      "5+": "#111827",
      "6-": "#ffffff",
      "6+": "#ffffff",
      7: "#ffffff",
    },
  },
};

function observationsFromNames(stationNames, intensityValue) {
  return stationNames.map((stationName) => ({ stationName, intensityValue }));
}

const state = {
  latitude: 35.681,
  longitude: 139.767,
  depthKm: 10,
  magnitude: 6.0,
  epicenterName: "未選択",
  municipalityName: "未選択",
  maxIntensityLabel: "未計算",
  epicenterEditEnabled: true,
  showStationLayer: false,
  showRegionLayer: true,
  showEewWarningLayer: false,
  selectedPresetId: "",
  intensityColorScheme: "normal",
  eewWarningForecastAreas: [],
  eewWarningBlinkStartedAt: {},
  eewInitialWarningKeys: new Set(),
  eewPreviousWarningKeys: new Set(),
  maxIntensityHistory: [],
  simulationRunning: false,
  simulationPaused: false,
  mapInteracting: false,
};

const els = {
  status: document.querySelector("#map-status"),
  epicenterRegion: document.querySelector("#epicenter-region"),
  latitude: document.querySelector("#latitude-input"),
  longitude: document.querySelector("#longitude-input"),
  depth: document.querySelector("#depth-input"),
  magnitude: document.querySelector("#magnitude-input"),
  historicalEarthquake: document.querySelector("#historical-earthquake-select"),
  intensityColorScheme: document.querySelector("#intensity-color-scheme"),
  municipalityOutput: document.querySelector("#municipality-output"),
  maxIntensityOutput: document.querySelector("#max-intensity-output"),
  epicenterEditToggle: document.querySelector("#epicenter-edit-toggle"),
  stationLayerToggle: document.querySelector("#station-layer-toggle"),
  regionLayerToggle: document.querySelector("#region-layer-toggle"),
  eewWarningToggle: document.querySelector("#eew-warning-toggle"),
  simulationStationLayerToggle: document.querySelector("#simulation-station-layer-toggle"),
  simulationRegionLayerToggle: document.querySelector("#simulation-region-layer-toggle"),
  simulationEewWarningToggle: document.querySelector("#simulation-eew-warning-toggle"),
  resetEpicenter: document.querySelector("#reset-epicenter"),
  setupSheetToggle: document.querySelector("#setup-sheet-toggle"),
  simulationSheetToggle: document.querySelector("#simulation-sheet-toggle"),
  setupPanel: document.querySelector("#setup-panel"),
  simulationPanel: document.querySelector("#simulation-panel"),
  simulationStart: document.querySelector("#simulation-start"),
  simulationPause: document.querySelector("#simulation-pause"),
  simulationStop: document.querySelector("#simulation-stop"),
  simulationMaxIntensity: document.querySelector("#simulation-max-intensity"),
  simulationMagnitude: document.querySelector("#simulation-magnitude"),
  simulationEpicenter: document.querySelector("#simulation-epicenter"),
  simulationRegionName: document.querySelector("#simulation-region-name"),
  simulationDepth: document.querySelector("#simulation-depth"),
  simulationTime: document.querySelector("#simulation-time"),
  maxStationList: document.querySelector("#max-station-list"),
  eewForecastPanel: document.querySelector("#eew-forecast-panel"),
  eewForecastList: document.querySelector("#eew-forecast-list"),
};

let map;
let epicenterMarker;
let municipalityData;
let municipalityDisplayData;
let municipalityLoadPromise;
let boundaryData;
let boundaryLoadPromise;
let localAreaData;
let localAreaLoadPromise;
let seaEpicenterData;
let seaEpicenterLoadPromise;
let plateBoundaryData;
let plateBoundaryLoadPromise;
let surroundingLandData;
let surroundingLandLoadPromise;
let groundModelData;
let groundModelLoadPromise;
let shindoStationData;
let shindoStationLoadPromise;
let stationIntensityFeatureCache;
let presetObservationLookupCache;
let stationPopup;
let stationClickPopup;
let stationHoverEventsBound = false;
let locationResolveTimer;
let simulationFrame;
let simulationStartedAt;
let simulationPausedAt;
let simulationPreviousEpicenterEditEnabled = false;
let simulationEpicenter = [state.longitude, state.latitude];
let simulationRenderBucket = -1;
let localAreaStationMembershipCache;
const SOURCE_LINKS = [
  { label: "気象庁", href: "https://www.jma.go.jp/" },
  { label: "東北地方太平洋沖地震（2011）", href: "https://www.data.jma.go.jp/eqev/data/2011_03_11_tohoku/" },
  { label: "大阪北部地震（2018）", href: "https://www.data.jma.go.jp/eqev/data/higai/20180618_oosaka_jishin_menu.html" },
  { label: "熊本地震（2016）", href: "https://www.data.jma.go.jp/eqev/data/2016_04_14_kumamoto/index.html" },
  { label: "地震本部", href: "https://www.jishin.go.jp/" },
  { label: "国土数値情報", href: "https://nlftp.mlit.go.jp/ksj/" },
  { label: "J-SHIS", href: "https://www.j-shis.bosai.go.jp/" },
  { label: "Natural Earth", href: "https://www.naturalearthdata.com/" },
  { label: "気象研究所 プレート形状データ / Hirose Fuyuki", href: "https://www.mri-jma.go.jp/Dep/sei/fhirose/plate/PlateData.html" },
];
const SOURCE_UPDATED_AT = "2026 07 03";
const SOURCE_SECTIONS = [
  {
    title: "気象庁",
    description: "震央区分、震度観測点、緊急地震速報（警報）の府県予報区、震度階級、長周期地震動、過去地震資料の参照に使用。このサイトでは緊急地震速報の特別警報相当も警報として扱い、表示上は区別しません。",
    links: [
      { label: "気象庁", href: "https://www.jma.go.jp/" },
      { label: "震度情報で用いる区域名", href: "https://www.jma.go.jp/jma/kishou/know/jishin/joho/shindo-name.html" },
      { label: "震度観測点", href: "https://www.data.jma.go.jp/eqev/data/kyoshin/jma-shindo.html" },
      { label: "緊急地震速報のしくみ", href: "https://www.jma.go.jp/jma/kishou/know/jishin/eew/shikumi/shikumi.html" },
      { label: "長周期地震動に関する情報の運用開始について", href: "https://www.jma.go.jp/jma/kishou/know/jishin/eew/shiryo/lpgm_start202302/202302_setsumei.pdf" },
      { label: "震度について", href: "https://www.jma.go.jp/jma/kishou/know/shindo/index.html" },
      { label: "東北地方太平洋沖地震（2011）", href: "https://www.data.jma.go.jp/eqev/data/2011_03_11_tohoku/" },
      { label: "大阪府北部の地震（2018）", href: "https://www.data.jma.go.jp/eqev/data/higai/20180618_oosaka_jishin_menu.html" },
      { label: "熊本地震（2016）", href: "https://www.data.jma.go.jp/eqev/data/2016_04_14_kumamoto/index.html" },
    ],
  },
  {
    title: "気象研究所 プレート形状データ",
    description: "日本周辺の海域プレート境界・海溝・トラフ線の描画に使用。",
    links: [
      { label: "プレート形状 数値データ", href: "https://www.mri-jma.go.jp/Dep/sei/fhirose/plate/PlateData.html" },
      { label: "plate_data.tar.gz", href: "https://www.mri-jma.go.jp/Dep/sei/fhirose/data/plate_data.tar.gz" },
    ],
    note: "データを使用した際の引用について\n※データを使用した場合には，使用地域に対応した出典論文を正確に明記するようにお願いします．以下に例を示します．\n北海道～東北地方の場合\nKita et al. (2010, EPSL)およびNakajima and Hasegawa (2006, GRL)\n\n東北地方南部～関東地方の場合\nNakajima and Hasegawa (2006, GRL)，弘瀬・他 (2008, 地震)，Nakajima et al. (2009, JGR)\n\n西南日本の場合\nBaba et al. (2002, PEPI)，Nakajima and Hasegawa (2007, JGR)，Hirose et al. (2008, JGR)",
  },
  {
    title: "地図・地盤・境界データ",
    description: "市区町村、周辺陸域、地盤増幅、シミュレーション補正、背景地図の作成に使用。",
    links: [
      { label: "国土数値情報", href: "https://nlftp.mlit.go.jp/ksj/" },
      { label: "気象庁 GISデータ", href: "https://www.data.jma.go.jp/developer/gis.html" },
      { label: "J-SHIS 地震ハザードステーション", href: "https://www.j-shis.bosai.go.jp/" },
      { label: "地震本部", href: "https://www.jishin.go.jp/" },
      { label: "Natural Earth", href: "https://www.naturalearthdata.com/" },
      { label: "MapLibre GL JS", href: "https://maplibre.org/maplibre-gl-js/docs/" },
    ],
  },
];
let stationDataCache = {
  bucket: null,
  data: null,
};
let areaDataCache = {
  bucket: null,
  data: null,
};
let lastManagedEpicenter = {
  latitude: state.latitude,
  longitude: state.longitude,
};

setupTabs();
renderDepthOptions();
renderMagnitudeOptions();
renderEarthquakePresetOptions();
loadEarthquakePresets();
bindSimulationControls();
applyIntensityColorScheme(state.intensityColorScheme, { refreshLayers: false });
setupMobileSheets();
preventNonMapZoom();
setupViewportStability();

if (window.maplibregl) {
  initEarthquakeMap();
} else {
  els.status.textContent = "MapLibre GL JSを読み込めませんでした";
}

function setupTabs() {
  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((item) => item.classList.remove("active"));
      document.querySelectorAll(".panel").forEach((panel) => panel.classList.remove("panel-active"));

      tab.classList.add("active");
      document.querySelector(`#${tab.dataset.panel}`).classList.add("panel-active");

      if (tab.dataset.panel === "earthquake-panel" && map) {
        requestAnimationFrame(() => map.resize());
      }
    });
  });
}

function renderDepthOptions() {
  const shallow = document.createElement("option");
  shallow.value = "0";
  shallow.textContent = "ごく浅い";

  const depthOptions = Array.from({ length: 491 }, (_, index) => {
    const depth = index + 10;
    const option = document.createElement("option");
    option.value = String(depth);
    option.textContent = `${depth} km`;
    return option;
  });

  els.depth.replaceChildren(shallow, ...depthOptions);
}

function renderMagnitudeOptions() {
  if (!els.magnitude) {
    return;
  }

  const selectedMagnitude = state.magnitude.toFixed(1);
  const magnitudeOptions = Array.from({ length: 100 }, (_, index) => {
    const magnitude = ((index + 1) / 10).toFixed(1);
    const option = document.createElement("option");
    option.value = magnitude;
    option.textContent = magnitude;
    option.selected = magnitude === selectedMagnitude;
    return option;
  });

  els.magnitude.replaceChildren(...magnitudeOptions);
}

function renderEarthquakePresetOptions() {
  if (!els.historicalEarthquake) {
    return;
  }

  const noneOption = document.createElement("option");
  noneOption.value = "";
  noneOption.textContent = "指定なし";

  const presetOptions = EARTHQUAKE_PRESETS.map((preset) => {
    const option = document.createElement("option");
    option.value = preset.id;
    option.textContent = preset.label;
    return option;
  });

  els.historicalEarthquake.replaceChildren(noneOption, ...presetOptions);
  els.historicalEarthquake.value = state.selectedPresetId;
}

async function loadEarthquakePresets() {
  try {
    const response = await fetch(`${EARTHQUAKE_PRESETS_URL}?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to load earthquake presets: ${response.status}`);
    }

    const data = await response.json();
    if (!Array.isArray(data.presets)) {
      throw new Error("earthquake_presets.json does not contain presets");
    }

    EARTHQUAKE_PRESETS.splice(0, EARTHQUAKE_PRESETS.length, ...data.presets);
    renderEarthquakePresetOptions();
    invalidateIntensityEstimateCache();
    updateIntensityLayer();
  } catch (error) {
    console.warn(error);
  }
}

function bindSimulationControls() {
  [els.latitude, els.longitude].forEach((input) => {
    input.addEventListener("input", () => {
      validateCoordinateInput(input, { report: true });
    });
    input.addEventListener("blur", () => {
      updateStateFromInputs({ resolveLocation: true, enforceManagedArea: true });
      syncInputs();
    });
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        input.blur();
      }
    });
  });
  els.depth.addEventListener("input", () => updateStateFromInputs());
  els.magnitude.addEventListener("input", () => updateStateFromInputs());
  els.historicalEarthquake?.addEventListener("change", () => applyEarthquakePreset(els.historicalEarthquake.value));
  els.intensityColorScheme?.addEventListener("change", () => {
    applyIntensityColorScheme(els.intensityColorScheme.value);
  });
  els.epicenterEditToggle.addEventListener("change", () => updateEpicenterEditMode());
  els.stationLayerToggle.addEventListener("change", () => updateDisplayMode());
  els.regionLayerToggle.addEventListener("change", () => updateDisplayMode());
  els.eewWarningToggle.addEventListener("change", () => updateDisplayMode());
  els.simulationStationLayerToggle.addEventListener("change", () => syncSimulationLayerToggles());
  els.simulationRegionLayerToggle.addEventListener("change", () => syncSimulationLayerToggles());
  els.simulationEewWarningToggle.addEventListener("change", () => syncSimulationLayerToggles());
  els.simulationStart.addEventListener("click", () => {
    if (state.simulationRunning) {
      stopSimulation();
      return;
    }

    startSimulation();
  });
  els.simulationPause?.addEventListener("click", () => toggleSimulationPause());
  els.simulationStop.addEventListener("click", () => stopSimulation());

  els.resetEpicenter.addEventListener("click", () => {
    state.latitude = 35.681;
    state.longitude = 139.767;
    state.depthKm = 10;
    state.magnitude = 6.0;
    state.selectedPresetId = "";
    state.epicenterName = "未選択";
    state.municipalityName = "未選択";
    invalidateIntensityEstimateCache();
    syncInputs();
    updateEpicenter({ resolveLocation: true, enforceManagedArea: true });
    map.easeTo({ center: INITIAL_CENTER, zoom: 6, duration: 450 });
  });

  syncInputs();
  updateDisplayMode();
  updateSimulationAvailability();
}

function applyIntensityColorScheme(schemeId, options = {}) {
  const scheme = INTENSITY_COLOR_SCHEMES[schemeId] ?? INTENSITY_COLOR_SCHEMES.normal;
  const nextSchemeId = INTENSITY_COLOR_SCHEMES[schemeId] ? schemeId : "normal";
  state.intensityColorScheme = nextSchemeId;

  INTENSITY_CLASSES.forEach((intensityClass) => {
    const key = intensityClass.shortLabel;
    intensityClass.color = scheme.colors[key] ?? intensityClass.color;
    intensityClass.textColor = scheme.textColors[key] ?? intensityClass.textColor;
  });

  if (els.intensityColorScheme) {
    els.intensityColorScheme.value = nextSchemeId;
  }

  updateLegendColors();

  if (options.refreshLayers === false) {
    return;
  }

  invalidateIntensityEstimateCache();
  updateIntensityLayer();
}

function updateLegendColors() {
  document.querySelectorAll(".intensity-scale span").forEach((legendItem) => {
    const label = legendItem.textContent.trim();
    const intensityClass = INTENSITY_CLASSES.find(
      (item) => item.shortLabel === label || item.label === label,
    );

    if (!intensityClass) {
      return;
    }

    legendItem.style.setProperty("--color", intensityClass.color);
    legendItem.style.setProperty("--text-color", intensityClass.textColor);
  });
}

function applyEarthquakePreset(presetId) {
  state.selectedPresetId = presetId;
  const preset = EARTHQUAKE_PRESETS.find((item) => item.id === presetId);

  if (!preset) {
    syncInputs();
    updateDisplayMode();
    updateSimulationAvailability();
    return;
  }

  state.latitude = Number(preset.latitude.toFixed(3));
  state.longitude = Number(preset.longitude.toFixed(3));
  state.depthKm = preset.depthKm;
  state.magnitude = preset.magnitude;
  state.epicenterName = preset.epicenterName;
  state.municipalityName = "海域";
  invalidateIntensityEstimateCache();
  syncInputs();
  updateEpicenter({ resolveLocation: true });

  if (map) {
    map.easeTo({
      center: [state.longitude, state.latitude],
      zoom: Math.max(map.getZoom(), 6),
      duration: 450,
      essential: true,
    });
  }
}

function getSelectedPreset() {
  return EARTHQUAKE_PRESETS.find((preset) => preset.id === state.selectedPresetId) ?? null;
}

function clearSelectedPreset() {
  if (!state.selectedPresetId) {
    return;
  }

  state.selectedPresetId = "";
  if (els.historicalEarthquake) {
    els.historicalEarthquake.value = "";
  }
}

function getPresetStationObservation(station) {
  const preset = getSelectedPreset();
  if (!preset?.observedStations) {
    return null;
  }

  const lookup = getPresetObservationLookup(preset);
  const normalizedStationName = normalizeStationNameForMatch(station.name);
  const exactMatch = lookup.byStationId.get(station.id) ?? lookup.byName.get(normalizedStationName);
  if (exactMatch) {
    return exactMatch;
  }

  return (
    lookup.fuzzyCandidates.find(
      (observation) => {
        const normalizedObservationName = observation.normalizedStationName;
        return (
          normalizedObservationName &&
          (normalizedStationName.includes(normalizedObservationName) ||
            normalizedObservationName.includes(normalizedStationName))
        );
      },
    ) ??
    null
  );
}

function getPresetObservationLookup(preset) {
  if (presetObservationLookupCache?.presetId === preset.id) {
    return presetObservationLookupCache;
  }

  const byStationId = new Map();
  const byName = new Map();
  const fuzzyCandidates = [];
  (preset.observedStations ?? []).forEach((observation) => {
    const normalizedStationName = normalizeStationNameForMatch(observation.stationName);
    const normalizedObservation = {
      ...observation,
      normalizedStationName,
    };

    if (observation.stationId) {
      byStationId.set(observation.stationId, normalizedObservation);
    }
    if (normalizedStationName && !byName.has(normalizedStationName)) {
      byName.set(normalizedStationName, normalizedObservation);
    }
    if (normalizedStationName.length >= 3) {
      fuzzyCandidates.push(normalizedObservation);
    }
  });

  presetObservationLookupCache = {
    presetId: preset.id,
    byStationId,
    byName,
    fuzzyCandidates,
  };
  return presetObservationLookupCache;
}

function normalizeStationNameForMatch(name) {
  return String(name ?? "")
    .normalize("NFKC")
    .replace(/[＊*]/g, "")
    .replace(/（旧[^）]*）/g, "")
    .replace(/\(旧[^)]*\)/g, "")
    .replace(/[()\[\]（）「」『』\s]/g, "")
    .trim();
}

function setupMobileSheets() {
  document.querySelectorAll(".sim-panel").forEach((panel) => {
    setSheetState(panel, isCompactViewport() && panel.id === "simulation-panel" ? "collapsed" : "open");
    const handle = panel.querySelector(".sheet-handle");
    const toggleButton =
      panel.id === "simulation-panel" ? els.simulationSheetToggle : els.setupSheetToggle;

    const toggleSheet = (event) => {
      event?.preventDefault();
      event?.stopPropagation();
      setSheetState(panel, panel.dataset.sheetState === "collapsed" ? "open" : "collapsed");
    };

    toggleButton?.addEventListener("click", toggleSheet);

    if (handle) {
      handle.addEventListener("click", toggleSheet);
    }
  });
}

function getCollapsedSheetOffset(panel) {
  return Math.max(panel.getBoundingClientRect().height - 66, 0);
}

function isCompactViewport() {
  return window.matchMedia("(max-width: 720px)").matches;
}

function usesSeparateSimulationPanel() {
  return isCompactViewport();
}

function setSheetState(panel, stateName) {
  if (!panel) {
    return;
  }

  panel.dataset.sheetState = stateName;
  const handle = panel.querySelector(".sheet-handle");
  if (handle) {
    handle.textContent = getSheetHandleLabel(stateName);
    handle.setAttribute("aria-expanded", String(stateName === "open"));
  }
  updateMobileSheetToggleLabels();
}

function updateMobileSheetToggleLabels() {
  const setupCollapsed = els.setupPanel?.dataset.sheetState === "collapsed";
  const simulationCollapsed = els.simulationPanel?.dataset.sheetState === "collapsed";

  if (els.setupSheetToggle) {
    els.setupSheetToggle.textContent = setupCollapsed ? "設定画面を表示" : "マップを表示";
    els.setupSheetToggle.setAttribute("aria-expanded", String(!setupCollapsed));
  }
  if (els.simulationSheetToggle) {
    els.simulationSheetToggle.textContent = simulationCollapsed ? "メニューを表示" : "メニューを非表示";
    els.simulationSheetToggle.setAttribute("aria-expanded", String(!simulationCollapsed));
  }
}

function getSheetHandleLabel(stateName) {
  if (isCompactViewport()) {
    return stateName === "collapsed" ? "∧" : "∨";
  }

  return stateName === "collapsed" ? "‹" : "›";
}

function preventNonMapZoom() {
  const isInsideMap = (target) => Boolean(target?.closest?.("#map"));

  window.addEventListener(
    "wheel",
    (event) => {
      if (event.ctrlKey && !isInsideMap(event.target)) {
        event.preventDefault();
      }
    },
    { passive: false },
  );

  window.addEventListener(
    "touchmove",
    (event) => {
      if (event.touches.length > 1 && !isInsideMap(event.target)) {
        event.preventDefault();
      }
    },
    { passive: false },
  );

  window.addEventListener("keydown", (event) => {
    if (!event.ctrlKey && !event.metaKey) {
      return;
    }

    if (["+", "-", "=", "_", "0"].includes(event.key) && !isInsideMap(document.activeElement)) {
      event.preventDefault();
    }
  });
}

function setupViewportStability() {
  updateAppViewportHeight();

  const handleViewportChange = () => {
    updateAppViewportHeight();
    if (map) {
      map.resize();
    }
  };

  window.addEventListener("resize", handleViewportChange, { passive: true });

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", handleViewportChange, { passive: true });
    window.visualViewport.addEventListener("scroll", handleViewportChange, { passive: true });
  }
}

function updateAppViewportHeight() {
  const viewportHeight = window.visualViewport?.height ?? window.innerHeight;
  document.documentElement.style.setProperty("--app-height", `${Math.round(viewportHeight)}px`);
}

async function initEarthquakeMap() {
  map = new maplibregl.Map({
    container: "map",
    style: {
      version: 8,
      glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
      sources: {},
      layers: [
        {
          id: "sea-background",
          type: "background",
          paint: {
            "background-color": "#061a3a",
          },
        },
      ],
    },
    center: INITIAL_CENTER,
    zoom: INITIAL_ZOOM,
    minZoom: 4,
    maxZoom: 10,
    attributionControl: false,
    dragRotate: false,
    pitchWithRotate: false,
    touchPitch: false,
  });

  map.dragRotate.disable();
  map.touchZoomRotate.disableRotation();
  map.keyboard?.disableRotation?.();

  addZoomOnlyControl();
  addSourceInfoControl();
  updateEpicenterEditMode();
  map.on("movestart", () => {
    state.mapInteracting = true;
  });
  map.on("moveend", () => {
    state.mapInteracting = false;
    simulationRenderBucket = -1;
  });

  map.on("click", (event) => {
    if (!state.epicenterEditEnabled) {
      return;
    }

    state.latitude = Number(event.lngLat.lat.toFixed(3));
    state.longitude = Number(event.lngLat.lng.toFixed(3));
    clearSelectedPreset();
    invalidateIntensityEstimateCache();
    syncInputs();
    updateEpicenter({ resolveLocation: true, enforceManagedArea: true });
  });

  try {
    await onceMapLoaded();
    await showMapLayers();
    els.status.textContent = "市町村区分地図を表示中";
  } catch (error) {
    els.status.textContent = "地図データの読み込みに失敗しました";
    console.warn(error);
  }

  updateEpicenter({ resolveLocation: true, enforceManagedArea: true });
}

function onceMapLoaded() {
  if (map.loaded()) {
    return Promise.resolve();
  }

  return new Promise((resolve) => map.once("load", resolve));
}

function addZoomOnlyControl() {
  const zoomControl = {
    onAdd(targetMap) {
      const container = document.createElement("div");
      container.className = "maplibregl-ctrl maplibregl-ctrl-group zoom-only-control";

      const zoomIn = document.createElement("button");
      zoomIn.type = "button";
      zoomIn.title = "拡大";
      zoomIn.setAttribute("aria-label", "拡大");
      zoomIn.textContent = "+";
      zoomIn.addEventListener("click", () => targetMap.zoomIn({ duration: 240 }));

      const zoomOut = document.createElement("button");
      zoomOut.type = "button";
      zoomOut.title = "縮小";
      zoomOut.setAttribute("aria-label", "縮小");
      zoomOut.textContent = "−";
      zoomOut.addEventListener("click", () => targetMap.zoomOut({ duration: 240 }));

      container.append(zoomIn, zoomOut);
      return container;
    },
    onRemove() {},
  };

  map.addControl(zoomControl, "top-right");
}

function addSourceInfoControl() {
  const overlay = createSourceInfoOverlay();
  document.body.append(overlay);

  const sourceInfoControl = {
    onAdd() {
      const container = document.createElement("div");
      container.className = "maplibregl-ctrl source-info-control";

      const button = document.createElement("button");
      button.type = "button";
      button.className = "source-info-button";
      button.textContent = "i";
      button.setAttribute("aria-label", "出典を表示");
      button.setAttribute("aria-expanded", "false");

      button.addEventListener("click", () => {
        overlay.classList.remove("hidden");
        document.body.classList.add("source-overlay-open");
        button.setAttribute("aria-expanded", "true");
      });

      overlay.addEventListener("source-overlay-close", () => {
        button.setAttribute("aria-expanded", "false");
      });

      container.append(button);
      return container;
    },
    onRemove() {},
  };

  map.addControl(sourceInfoControl, "top-right");
}

function createSourceInfoOverlay() {
  const overlay = document.createElement("section");
  overlay.className = "source-info-overlay hidden";
  overlay.setAttribute("aria-modal", "true");
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-label", "出典");
  overlay.innerHTML = buildSourceInfoOverlayHtml();

  const closeButton = overlay.querySelector(".source-info-close");
  const closeOverlay = () => {
    overlay.classList.add("hidden");
    document.body.classList.remove("source-overlay-open");
    overlay.dispatchEvent(new CustomEvent("source-overlay-close"));
  };

  closeButton?.addEventListener("click", closeOverlay);
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      closeOverlay();
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !overlay.classList.contains("hidden")) {
      closeOverlay();
    }
  });

  return overlay;
}

function buildSourceInfoOverlayHtml() {
  const sections = SOURCE_SECTIONS.map((section) => {
    const links = section.links
      .map(
        (source) =>
          `<li><a href="${source.href}" target="_blank" rel="noreferrer">${escapeHtml(source.label)}</a></li>`,
      )
      .join("");
    const note = section.note ? `<pre class="source-citation-note">${escapeHtml(section.note)}</pre>` : "";

    return `
      <section class="source-info-section">
        <h3>${escapeHtml(section.title)}</h3>
        <p>${escapeHtml(section.description)}</p>
        <ul>${links}</ul>
        ${note}
      </section>
    `;
  }).join("");

  return `
    <button class="source-info-close" type="button" aria-label="出典を閉じる">×</button>
    <div class="source-info-overlay-content">
      <header class="source-info-header">
        <p>DATA SOURCES</p>
        <h2>このサイトで使用している出典</h2>
      </header>
      <div class="source-info-sections">${sections}</div>
    </div>
    <p class="source-info-updated">更新日 ${SOURCE_UPDATED_AT}</p>
  `;
}

async function showMapLayers() {
  const [surroundingLand, municipalities, boundaries, localAreas, seaAreas, plateBoundaries, shindoStations] =
    await Promise.all([
      loadSurroundingLand(),
      loadMunicipalities(),
      loadBoundaryLayers(),
      loadLocalAreas(),
      loadSeaEpicenterAreas(),
      loadPlateBoundaries(),
      loadShindoStations(),
    ]);

  municipalityDisplayData = municipalityDisplayData ?? withoutInteriorRings(municipalities);

  addGeoJsonSource("surrounding-land", surroundingLand);
  addGeoJsonSource("municipalities", municipalityDisplayData);
  addGeoJsonSource("jma-local-areas", buildIntensityAreaData(localAreas));
  addGeoJsonSource("sea-epicenter-areas", seaAreas);
  addGeoJsonSource("plate-boundaries", plateBoundaries);
  addGeoJsonSource("shindo-stations", buildStationIntensityData(shindoStations));
  addGeoJsonSource("p-wave", emptyFeatureCollection());
  addGeoJsonSource("s-wave", emptyFeatureCollection());
  addGeoJsonSource("boundaries", boundaries);

  addMapLayers();
  setupStationHoverPopup();
  moveLayerToTop("shindo-station-points");
  moveLayerToTop("shindo-station-labels");
  fitInitialMapBounds(getGeoJsonBounds(municipalityDisplayData));
  loadGroundModel()
    .then(() => {
      invalidateIntensityEstimateCache();
      updateIntensityLayer();
    })
    .catch((error) => console.warn(error));
}

function addGeoJsonSource(id, data) {
  if (map.getSource(id)) {
    map.getSource(id).setData(data);
    return;
  }

  map.addSource(id, {
    type: "geojson",
    data,
  });
}

function addMapLayers() {
  addLayerIfMissing({
    id: "surrounding-land-fill",
    type: "fill",
    source: "surrounding-land",
    paint: {
      "fill-color": "#6f777f",
      "fill-opacity": 1,
    },
  });

  addLayerIfMissing({
    id: "japan-land-fill",
    type: "fill",
    source: "municipalities",
    paint: {
      "fill-color": "#8c9298",
      "fill-opacity": 1,
    },
  });

  addLayerIfMissing({
    id: "japan-land-edge-cover",
    type: "line",
    source: "municipalities",
    paint: {
      "line-color": "#8c9298",
      "line-opacity": 1,
      "line-width": ["interpolate", ["linear"], ["zoom"], 4, 5.2, 7, 3.2, 10, 1.2],
    },
  });

  addLayerIfMissing({
    id: "plate-boundaries",
    type: "line",
    source: "plate-boundaries",
    paint: {
      "line-color": [
        "match",
        ["get", "kind"],
        "trough",
        "#f2d06b",
        "slab_contour",
        "#9be7ff",
        "#78d4ff",
      ],
      "line-opacity": ["match", ["get", "kind"], "trench", 0.48, 0.34],
      "line-width": [
        "match",
        ["get", "kind"],
        "trench",
        1.25,
        0.85,
      ],
      "line-dasharray": [4, 2.5],
    },
  });

  addLayerIfMissing({
    id: "jma-intensity-fill",
    type: "fill",
    source: "jma-local-areas",
    paint: {
      "fill-color": ["get", "intensityColor"],
      "fill-opacity": [
        "case",
        ["<=", ["get", "intensityRank"], 0],
        0,
        ["interpolate", ["linear"], ["get", "intensityRank"], 1, 0.54, 2, 0.72, 9, 0.94],
      ],
    },
  });
  updateLayerVisibility("jma-intensity-fill", state.showRegionLayer);

  addLayerIfMissing({
    id: "eew-warning-fill",
    type: "fill",
    source: "jma-local-areas",
    filter: ["==", ["get", "eewWarning"], true],
    paint: {
      "fill-color": ["case", ["==", ["get", "eewBlinkOff"], true], "#8c9298", "#e60012"],
      "fill-opacity": 0.94,
    },
  });
  updateLayerVisibility("eew-warning-fill", state.showEewWarningLayer);

  addLayerIfMissing({
    id: "municipality-boundaries",
    type: "line",
    source: "municipalities",
    minzoom: MUNICIPALITY_BOUNDARY_MIN_ZOOM,
    paint: {
      "line-color": "#ffffff",
      "line-opacity": 0.58,
      "line-width": ["interpolate", ["linear"], ["zoom"], 8, 0.36, 10, 0.58],
    },
  });

  addLayerIfMissing({
    id: "prefecture-boundaries",
    type: "line",
    source: "boundaries",
    filter: ["==", ["get", "layer"], "prefecture"],
    paint: {
      "line-color": "#e4e9ef",
      "line-opacity": ["interpolate", ["linear"], ["zoom"], 4, 0.42, 7, 0.58, 10, 0.72],
      "line-width": ["interpolate", ["linear"], ["zoom"], 4, 0.5, 7, 0.85, 10, 1.2],
    },
  });

  addLayerIfMissing({
    id: "jma-region-boundaries",
    type: "line",
    source: "boundaries",
    filter: ["==", ["get", "layer"], "jma_region"],
    paint: {
      "line-color": "#d5dee8",
      "line-opacity": ["interpolate", ["linear"], ["zoom"], 4, 0.62, 7, 0.78, 10, 0.9],
      "line-width": ["interpolate", ["linear"], ["zoom"], 4, 1.05, 7, 1.7, 10, 2.45],
    },
  });

  addLayerIfMissing({
    id: "shindo-station-points",
    type: "circle",
    source: "shindo-stations",
    layout: {
      "circle-sort-key": ["get", "intensityRank"],
    },
    paint: {
      "circle-color": ["get", "intensityColor"],
      "circle-opacity": 0.98,
      "circle-radius": ["interpolate", ["linear"], ["zoom"], 4, 7.5, 7, 9, 10, 10.5],
      "circle-stroke-color": "#111827",
      "circle-stroke-opacity": 1,
      "circle-stroke-width": 0.75,
    },
  });
  updateLayerVisibility("shindo-station-points", state.showStationLayer);

  addLayerIfMissing({
    id: "shindo-station-labels",
    type: "symbol",
    source: "shindo-stations",
    minzoom: 7.2,
    layout: {
      "text-field": ["get", "intensityShortLabel"],
      "text-font": ["Noto Sans Regular"],
      "text-size": ["interpolate", ["linear"], ["zoom"], 4, 8, 8, 9.5, 11, 10.5],
      "symbol-sort-key": ["get", "intensityRank"],
      "text-allow-overlap": true,
      "text-ignore-placement": true,
    },
    paint: {
      "text-color": ["get", "intensityTextColor"],
      "text-halo-color": ["case", ["<=", ["get", "intensityRank"], 2], "rgba(255,255,255,0.7)", "rgba(0,0,0,0.32)"],
      "text-halo-width": 0.45,
    },
  });
  updateLayerVisibility("shindo-station-labels", state.showStationLayer);

  addLayerIfMissing({
    id: "p-wave-fill",
    type: "fill",
    source: "p-wave",
    paint: {
      "fill-color": "rgba(45, 212, 255, 0.08)",
      "fill-opacity": 1,
    },
  });

  addLayerIfMissing({
    id: "p-wave-line",
    type: "line",
    source: "p-wave",
    paint: {
      "line-color": "#7de7ff",
      "line-opacity": 0.9,
      "line-width": 2,
    },
  });

  addLayerIfMissing({
    id: "s-wave-fill",
    type: "fill",
    source: "s-wave",
    paint: {
      "fill-color": "rgba(255, 55, 95, 0.1)",
      "fill-opacity": 1,
    },
  });

  addLayerIfMissing({
    id: "s-wave-line",
    type: "line",
    source: "s-wave",
    paint: {
      "line-color": "#ff6b7f",
      "line-opacity": 0.95,
      "line-width": 3,
    },
  });

  moveLayerToTop("p-wave-fill");
  moveLayerToTop("p-wave-line");
  moveLayerToTop("s-wave-fill");
  moveLayerToTop("s-wave-line");
  moveLayerToTop("shindo-station-points");
  moveLayerToTop("shindo-station-labels");
}

function addLayerIfMissing(layer) {
  if (!map.getLayer(layer.id)) {
    try {
      map.addLayer(layer);
    } catch (error) {
      console.warn(`Layer ${layer.id} could not be added`, error);
    }
  }
}

function moveLayerToTop(layerId) {
  if (map?.getLayer(layerId)) {
    map.moveLayer(layerId);
  }
}

function updateLayerVisibility(layerId, visible) {
  if (map?.getLayer(layerId)) {
    map.setLayoutProperty(layerId, "visibility", visible ? "visible" : "none");
  }
}

function fitInitialMapBounds(bounds) {
  if (!bounds) {
    return;
  }

  map.fitBounds(bounds, {
    padding: getInitialMapPadding(),
    duration: 0,
  });

  map.setZoom(Math.min(map.getZoom() + 0.9, map.getMaxZoom()));
}

function getInitialMapPadding() {
  return isCompactViewport()
    ? { top: 22, right: 12, bottom: 88, left: 12 }
    : { top: 18, right: 18, bottom: 18, left: 390 };
}

function scheduleLocationResolve(options = {}) {
  window.clearTimeout(locationResolveTimer);
  locationResolveTimer = window.setTimeout(() => {
    updateEpicenter({ resolveLocation: true, enforceManagedArea: true, ...options });
  }, 180);
}

function updateEpicenterEditMode() {
  state.epicenterEditEnabled = state.simulationRunning ? false : els.epicenterEditToggle.checked;

  if (map) {
    map.getCanvas().classList.toggle("epicenter-edit-enabled", state.epicenterEditEnabled);
  }

  els.epicenterEditToggle.checked = state.epicenterEditEnabled;
  els.epicenterEditToggle.disabled = state.simulationRunning;

  if (epicenterMarker) {
    epicenterMarker.setDraggable(state.epicenterEditEnabled);
  }
}

function updateDisplayMode() {
  state.showStationLayer = els.stationLayerToggle.checked;
  state.showRegionLayer = els.regionLayerToggle.checked;
  state.showEewWarningLayer = els.eewWarningToggle.checked;
  els.simulationStationLayerToggle.checked = state.showStationLayer;
  els.simulationRegionLayerToggle.checked = state.showRegionLayer;
  els.simulationEewWarningToggle.checked = state.showEewWarningLayer;
  updateLayerVisibility("shindo-station-points", state.showStationLayer);
  updateLayerVisibility("shindo-station-labels", state.showStationLayer);
  updateLayerVisibility("jma-intensity-fill", state.showRegionLayer);
  updateLayerVisibility("eew-warning-fill", state.showEewWarningLayer);
  if (state.showStationLayer && map?.getSource("shindo-stations")) {
    map.getSource("shindo-stations").setData(getStationIntensityDataForElapsed(getSimulationStationElapsedSec()));
    moveLayerToTop("shindo-station-points");
    moveLayerToTop("shindo-station-labels");
  }
  updateEewReplacementMode();
  updateEewForecastPanel();
}

function syncSimulationLayerToggles() {
  state.showStationLayer = els.simulationStationLayerToggle.checked;
  state.showRegionLayer = els.simulationRegionLayerToggle.checked;
  state.showEewWarningLayer = els.simulationEewWarningToggle.checked;
  els.stationLayerToggle.checked = state.showStationLayer;
  els.regionLayerToggle.checked = state.showRegionLayer;
  els.eewWarningToggle.checked = state.showEewWarningLayer;
  updateDisplayMode();
}

function updateEewReplacementMode() {
  if (!map?.getLayer("jma-intensity-fill")) {
    return;
  }

  const replaceWithWarning = state.showRegionLayer && state.showEewWarningLayer;
  map.setFilter(
    "jma-intensity-fill",
    replaceWithWarning ? ["!", ["==", ["get", "eewWarning"], true]] : null,
  );
}

function setupStationHoverPopup() {
  if (stationHoverEventsBound) {
    return;
  }

  stationHoverEventsBound = true;
  stationPopup = new maplibregl.Popup({
    closeButton: false,
    closeOnClick: false,
    className: "station-popup",
    offset: 10,
  });
  stationClickPopup = new maplibregl.Popup({
    closeButton: true,
    closeOnClick: true,
    className: "station-popup",
    offset: 14,
  });

  map.on("mouseenter", "shindo-station-points", () => {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mousemove", "shindo-station-points", (event) => {
    const feature = event.features?.[0];
    if (!feature) {
      return;
    }

    stationPopup
      .setLngLat(event.lngLat)
      .setHTML(stationPopupHtml(feature.properties))
      .addTo(map);
  });

  map.on("click", "shindo-station-points", (event) => {
    const feature = event.features?.[0];
    if (!feature) {
      return;
    }

    event.preventDefault();
    stationClickPopup
      .setLngLat(event.lngLat)
      .setHTML(stationPopupHtml(feature.properties))
      .addTo(map);
  });

  map.on("mouseleave", "shindo-station-points", () => {
    map.getCanvas().style.cursor = "";
    stationPopup.remove();
  });
}

function stationPopupHtml(properties) {
  const waveLabel =
    properties.waveState === "p"
      ? `P波到達 / S波 ${Number(properties.sArrivalSec).toFixed(1)}秒`
      : `震度${properties.intensityLabel}`;
  const currentValue = Number(properties.currentIntensityValue ?? properties.intensityValue ?? 0);
  const predictedValue = Number(properties.predictedIntensityValue ?? 0);
  const currentMeasured = formatMeasuredIntensity(properties, currentValue);
  const predictedMeasured = formatMeasuredIntensity(properties, predictedValue);

  return [
    `<strong>${escapeHtml(properties.name)}</strong>`,
    `<span>${escapeHtml(properties.areaName ?? "")}</span>`,
    `<span>${escapeHtml(properties.observationStatus ?? "")}</span>`,
    `<span>${escapeHtml(waveLabel)}</span>`,
    `<span>現在震度 ${escapeHtml(properties.intensityLabel ?? "0")}（計測震度 ${currentMeasured}）</span>`,
    `<span>最大震度 ${escapeHtml(properties.predictedIntensityLabel ?? "0")}（計測震度 ${predictedMeasured}）</span>`,
    `<span>震央距離 ${Number(properties.epicentralDistanceKm ?? 0).toFixed(0)} km</span>`,
    `<span>P波 ${Number(properties.pArrivalSec ?? 0).toFixed(1)}秒 / S波 ${Number(properties.sArrivalSec ?? 0).toFixed(1)}秒</span>`,
  ].join("");
}

function formatMeasuredIntensity(properties, fallbackValue) {
  if (properties.actualObserved && properties.measuredIntensity == null) {
    return "-";
  }

  const value = Number(properties.measuredIntensity ?? fallbackValue);
  return Number.isFinite(value) ? value.toFixed(1) : "-";
}

function startSimulation() {
  if (els.simulationStart.disabled) {
    return;
  }

  simulationPreviousEpicenterEditEnabled = state.epicenterEditEnabled;
  simulationEpicenter = [state.longitude, state.latitude];
  state.maxIntensityHistory = [];
  state.eewWarningBlinkStartedAt = {};
  state.eewInitialWarningKeys = new Set();
  state.eewPreviousWarningKeys = new Set();
  simulationRenderBucket = -1;
  state.simulationRunning = true;
  state.simulationPaused = false;
  state.epicenterEditEnabled = false;
  els.epicenterEditToggle.checked = false;
  state.showStationLayer = true;
  els.stationLayerToggle.checked = true;
  updateEpicenterEditMode();
  updateDisplayMode();
  simulationStartedAt = performance.now();
  simulationPausedAt = null;
  updateIntensityLayer();
  updateSimulationSummary(0);
  if (els.simulationPause) {
    els.simulationPause.textContent = "一時停止";
    els.simulationPause.disabled = false;
  }
  els.simulationStart.textContent = "シミュレーション中止";
  els.setupPanel.classList.add("hidden");
  els.simulationPanel.classList.remove("hidden");
  setSheetState(els.simulationPanel, isCompactViewport() ? "collapsed" : "open");
  cancelAnimationFrame(simulationFrame);
  tickSimulation(simulationStartedAt);
}

function stopSimulation() {
  state.simulationRunning = false;
  state.simulationPaused = false;
  state.eewWarningBlinkStartedAt = {};
  state.eewInitialWarningKeys = new Set();
  state.eewPreviousWarningKeys = new Set();
  cancelAnimationFrame(simulationFrame);
  simulationFrame = null;
  simulationStartedAt = null;
  simulationPausedAt = null;
  simulationRenderBucket = -1;
  state.epicenterEditEnabled = simulationPreviousEpicenterEditEnabled;
  els.epicenterEditToggle.checked = state.epicenterEditEnabled;
  updateEpicenterEditMode();
  els.simulationStart.textContent = "シミュレーション開始";
  if (els.simulationPause) {
    els.simulationPause.textContent = "一時停止";
    els.simulationPause.disabled = true;
  }
  els.setupPanel.classList.remove("hidden");
  els.simulationPanel.classList.add("hidden");
  setSheetState(els.setupPanel, "open");
  setWaveRadiusData(0, 0);
  updateIntensityLayer();
  updateSimulationAvailability();
}

function toggleSimulationPause() {
  if (!state.simulationRunning || !simulationStartedAt) {
    return;
  }

  if (state.simulationPaused) {
    const pauseDuration = performance.now() - simulationPausedAt;
    simulationStartedAt += pauseDuration;
    simulationPausedAt = null;
    state.simulationPaused = false;
    els.simulationPause.textContent = "一時停止";
    simulationFrame = requestAnimationFrame(tickSimulation);
    return;
  }

  state.simulationPaused = true;
  simulationPausedAt = performance.now();
  cancelAnimationFrame(simulationFrame);
  simulationFrame = null;
  els.simulationPause.textContent = "再開";
}

function tickSimulation(now) {
  if (!state.simulationRunning || state.simulationPaused) {
    return;
  }

  const elapsedSec = getSimulationElapsedSec(now);
  const rawPRadiusKm = elapsedSec * EARTHQUAKE_MODEL.pWaveVelocityKmPerSec;
  const rawSRadiusKm = elapsedSec * EARTHQUAKE_MODEL.sWaveVelocityKmPerSec;
  const pRadiusKm = Math.max(rawPRadiusKm, rawSRadiusKm + 0.01);
  const sRadiusKm = Math.min(rawSRadiusKm, pRadiusKm - 0.01);
  const currentBucket = toSimulationBucket(elapsedSec);

  setWaveRadiusData(pRadiusKm, sRadiusKm);
  els.simulationTime.textContent = `${elapsedSec.toFixed(1)} 秒`;

  if (currentBucket !== simulationRenderBucket && !state.mapInteracting) {
    simulationRenderBucket = currentBucket;

    if (map?.getSource("shindo-stations") && shindoStationData) {
      map.getSource("shindo-stations").setData(getStationIntensityDataForElapsed(elapsedSec));
    }
    if (map?.getSource("jma-local-areas") && localAreaData) {
      map.getSource("jma-local-areas").setData(buildIntensityAreaData(localAreaData, elapsedSec));
    }

    updateSimulationSummary(elapsedSec);
  }

  if (isSimulationComplete(elapsedSec)) {
    state.simulationRunning = false;
    state.simulationPaused = false;
    simulationFrame = null;
    simulationPausedAt = null;
    setWaveRadiusData(0, 0);
    updateSimulationSummary(Infinity);
    state.epicenterEditEnabled = simulationPreviousEpicenterEditEnabled;
    els.epicenterEditToggle.checked = state.epicenterEditEnabled;
    updateEpicenterEditMode();
    els.simulationStart.textContent = "シミュレーション開始";
    if (els.simulationPause) {
      els.simulationPause.textContent = "一時停止";
      els.simulationPause.disabled = true;
    }
    updateSimulationAvailability();
    return;
  }

  simulationFrame = requestAnimationFrame(tickSimulation);
}

function getSimulationElapsedSec(now = performance.now()) {
  const currentTime = state.simulationPaused && simulationPausedAt ? simulationPausedAt : now;
  return simulationStartedAt ? Math.max((currentTime - simulationStartedAt) / 1000, 0) : 0;
}

function toSimulationBucket(elapsedSec) {
  return Number.isFinite(elapsedSec) ? Math.max(Math.floor(elapsedSec * 5), 0) : Infinity;
}

function updateSimulationSummary(elapsedSec = getSimulationStationElapsedSec()) {
  const stationFeatures = shindoStationData
    ? getStationIntensityDataForElapsed(elapsedSec).features.filter(
        (feature) => feature.properties.observed && feature.properties.intensityRank > 0,
      )
    : [];
  const maxRank = stationFeatures.reduce(
    (rank, feature) => Math.max(rank, feature.properties.intensityRank),
    0,
  );
  const observedStations = stationFeatures
    .sort((a, b) => b.properties.currentIntensityValue - a.properties.currentIntensityValue)
    .slice(0, 100);
  const maxClass = INTENSITY_CLASSES.find((item) => item.rank === maxRank) ?? INTENSITY_CLASSES[0];
  const maxValue = observedStations[0]?.properties.currentIntensityValue ?? 0;

  els.simulationMaxIntensity.textContent = maxClass.label;
  els.simulationMagnitude.textContent = `M ${state.magnitude.toFixed(1)}`;
  els.simulationEpicenter.textContent = `${state.latitude.toFixed(3)}, ${state.longitude.toFixed(3)}`;
  els.simulationRegionName.textContent = state.epicenterName;
  els.simulationDepth.textContent = formatDepth(state.depthKm);
  els.maxIntensityOutput.textContent = state.maxIntensityLabel;
  els.maxStationList.replaceChildren(
    ...(observedStations.length > 0
      ? observedStations.map((feature) => {
          const item = document.createElement("li");
          item.textContent = `${feature.properties.name}　震度${feature.properties.intensityLabel}（${formatMeasuredIntensity(
            feature.properties,
            feature.properties.currentIntensityValue,
          )}）`;
          return item;
        })
      : [document.createElement("li")]),
  );

  if (observedStations.length === 0) {
    els.maxStationList.firstElementChild.textContent = "震度1以上の観測点はありません";
  }

  recordMaxIntensityHistory(elapsedSec, maxValue);
}

function recordMaxIntensityHistory(elapsedSec, maxValue) {
  if (!state.simulationRunning || !Number.isFinite(elapsedSec)) {
    return;
  }

  const lastPoint = state.maxIntensityHistory.at(-1);
  if (lastPoint && elapsedSec - lastPoint.elapsedSec < 0.25) {
    lastPoint.maxIntensityValue = Number(Math.max(lastPoint.maxIntensityValue, maxValue).toFixed(2));
    return;
  }

  state.maxIntensityHistory.push({
    elapsedSec: Number(elapsedSec.toFixed(2)),
    maxIntensityValue: Number(maxValue.toFixed(2)),
  });
}

function isSimulationComplete(elapsedSec) {
  if (!shindoStationData) {
    return false;
  }

  const observedStations = buildStationIntensityFeatures(shindoStationData).filter(
    (feature) => feature.properties.predictedIntensityRank >= 1,
  );
  if (observedStations.length === 0) {
    return elapsedSec > 3;
  }

  const latestEndSec = Math.max(
    ...observedStations.map((feature) => feature.properties.intensityCompleteSec),
  );
  return elapsedSec >= latestEndSec;
}

function setWaveRadiusData(pRadiusKm, sRadiusKm) {
  const pSource = map?.getSource("p-wave");
  const sSource = map?.getSource("s-wave");

  if (pSource) {
    pSource.setData(wavePolygonFeatureCollection(pRadiusKm));
  }

  if (sSource) {
    sSource.setData(wavePolygonFeatureCollection(sRadiusKm));
  }
}

function wavePolygonFeatureCollection(radiusKm) {
  if (!Number.isFinite(radiusKm) || radiusKm <= 0) {
    return emptyFeatureCollection();
  }

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          radiusKm: Number(radiusKm.toFixed(2)),
        },
        geometry: {
          type: "Polygon",
          coordinates: [buildGeodesicCircle(simulationEpicenter, radiusKm)],
        },
      },
    ],
  };
}

function buildGeodesicCircle(center, radiusKm, steps = 56) {
  const coordinates = [];

  for (let index = 0; index <= steps; index += 1) {
    const bearingDeg = (index / steps) * 360;
    coordinates.push(destinationPoint(center, bearingDeg, radiusKm));
  }

  return coordinates;
}

function destinationPoint([longitude, latitude], bearingDeg, distanceKm) {
  const angularDistance = distanceKm / EARTH_RADIUS_KM;
  const bearing = toRadians(bearingDeg);
  const lat1 = toRadians(latitude);
  const lon1 = toRadians(longitude);
  const sinLat1 = Math.sin(lat1);
  const cosLat1 = Math.cos(lat1);
  const sinAngularDistance = Math.sin(angularDistance);
  const cosAngularDistance = Math.cos(angularDistance);

  const lat2 = Math.asin(
    sinLat1 * cosAngularDistance + cosLat1 * sinAngularDistance * Math.cos(bearing),
  );
  const lon2 =
    lon1 +
    Math.atan2(
      Math.sin(bearing) * sinAngularDistance * cosLat1,
      cosAngularDistance - sinLat1 * Math.sin(lat2),
    );

  return [normalizeLongitude(toDegrees(lon2)), toDegrees(lat2)];
}

function normalizeLongitude(longitude) {
  if (!Number.isFinite(longitude)) {
    return longitude;
  }

  return ((longitude + 540) % 360) - 180;
}

function emptyFeatureCollection() {
  return {
    type: "FeatureCollection",
    features: [],
  };
}

async function loadMunicipalities() {
  if (municipalityData) {
    return municipalityData;
  }

  if (!municipalityLoadPromise) {
    municipalityLoadPromise = fetchJson(MUNICIPALITIES_URL, "Municipality GeoJSON");
  }

  municipalityData = await municipalityLoadPromise;
  return municipalityData;
}

async function loadBoundaryLayers() {
  if (boundaryData) {
    return boundaryData;
  }

  if (!boundaryLoadPromise) {
    boundaryLoadPromise = fetchJson(BOUNDARY_LAYERS_URL, "Boundary GeoJSON");
  }

  boundaryData = await boundaryLoadPromise;
  return boundaryData;
}

async function loadLocalAreas() {
  if (localAreaData) {
    return localAreaData;
  }

  if (!localAreaLoadPromise) {
    localAreaLoadPromise = fetchJson(JMA_LOCAL_AREAS_URL, "JMA local area GeoJSON");
  }

  localAreaData = await localAreaLoadPromise;
  return localAreaData;
}

async function loadSeaEpicenterAreas() {
  if (seaEpicenterData) {
    return seaEpicenterData;
  }

  if (!seaEpicenterLoadPromise) {
    seaEpicenterLoadPromise = fetchJson(SEA_EPICENTER_AREAS_URL, "Sea epicenter area GeoJSON");
  }

  seaEpicenterData = await seaEpicenterLoadPromise;
  return seaEpicenterData;
}

async function loadPlateBoundaries() {
  if (plateBoundaryData) {
    return plateBoundaryData;
  }

  if (!plateBoundaryLoadPromise) {
    plateBoundaryLoadPromise = fetchJson(PLATE_BOUNDARIES_URL, "Plate boundary GeoJSON");
  }

  plateBoundaryData = await plateBoundaryLoadPromise;
  return plateBoundaryData;
}

async function loadSurroundingLand() {
  if (surroundingLandData) {
    return surroundingLandData;
  }

  if (!surroundingLandLoadPromise) {
    surroundingLandLoadPromise = fetchJson(SURROUNDING_LAND_URL, "Surrounding land GeoJSON");
  }

  surroundingLandData = await surroundingLandLoadPromise;
  return surroundingLandData;
}

async function loadGroundModel() {
  if (groundModelData) {
    return groundModelData;
  }

  if (!groundModelLoadPromise) {
    groundModelLoadPromise = fetchJson(GROUND_MODEL_URL, "J-SHIS ground model");
  }

  groundModelData = await groundModelLoadPromise;
  return groundModelData;
}

async function loadShindoStations() {
  if (shindoStationData) {
    return shindoStationData;
  }

  if (!shindoStationLoadPromise) {
    shindoStationLoadPromise = fetchJson(SHINDO_STATIONS_URL, "JMA shindo stations");
  }

  shindoStationData = await shindoStationLoadPromise;
  return shindoStationData;
}

async function fetchJson(url, label) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`${label} request failed: ${response.status}`);
  }

  return response.json();
}

function withoutInteriorRings(geojson) {
  return {
    ...geojson,
    features: geojson.features.map((feature) => ({
      ...feature,
      geometry: {
        ...feature.geometry,
        coordinates:
          feature.geometry.type === "MultiPolygon"
            ? feature.geometry.coordinates.map((polygon) => [polygon[0]])
            : [feature.geometry.coordinates[0]],
      },
    })),
  };
}

function updateStateFromInputs(options = {}) {
  if (!validateCoordinateInput(els.latitude, { report: true }) || !validateCoordinateInput(els.longitude, { report: true })) {
    return;
  }

  if (isPendingDecimalInput(els.latitude.value) || isPendingDecimalInput(els.longitude.value)) {
    return;
  }

  const nextLatitude = parseClampedInput(els.latitude.value, state.latitude, 20, 47);
  const nextLongitude = parseClampedInput(els.longitude.value, state.longitude, 117, 154);
  const epicenterMoved =
    Math.abs(nextLatitude - state.latitude) > 0.0001 ||
    Math.abs(nextLongitude - state.longitude) > 0.0001;

  state.latitude = nextLatitude;
  state.longitude = nextLongitude;
  state.depthKm = clamp(Number(els.depth.value), 0, 500);
  state.magnitude = parseClampedInput(els.magnitude.value, state.magnitude, 0.1, 10);
  if (!options.preservePreset && epicenterMoved) {
    clearSelectedPreset();
  }
  invalidateIntensityEstimateCache();
  updateEpicenter({
    resolveLocation: Boolean(options.resolveLocation),
    enforceManagedArea: Boolean(options.enforceManagedArea),
  });

  if (state.simulationRunning) {
    updateSimulationSummary();
    const elapsedSec = getSimulationElapsedSec();
    const rawPRadiusKm = elapsedSec * EARTHQUAKE_MODEL.pWaveVelocityKmPerSec;
    const rawSRadiusKm = elapsedSec * EARTHQUAKE_MODEL.sWaveVelocityKmPerSec;
    setWaveRadiusData(
      Math.max(rawPRadiusKm, rawSRadiusKm + 0.01),
      Math.min(rawSRadiusKm, Math.max(rawPRadiusKm, rawSRadiusKm + 0.01) - 0.01),
    );
  }

  if (options.resolveLocation) {
    scheduleLocationResolve();
  }
}

function sanitizeDecimalInput(value) {
  const characters = String(value).replace(/[^\d.]/g, "").split("");
  let hasDecimalPoint = false;
  return characters
    .filter((character) => {
      if (character !== ".") {
        return true;
      }

      if (hasDecimalPoint) {
        return false;
      }

      hasDecimalPoint = true;
      return true;
    })
    .join("");
}

function validateCoordinateInput(input, options = {}) {
  const value = input.value.trim();
  const valid = value === "" || value === "." || /^\d+(\.\d*)?$/.test(value);
  input.setCustomValidity(valid ? "" : "数字と小数点だけで入力してください");

  if (!valid && options.report) {
    input.reportValidity();
  }

  return valid;
}

function isPendingDecimalInput(value) {
  const trimmed = value.trim();
  return trimmed === "" || trimmed === ".";
}

function parseClampedInput(value, fallback, min, max) {
  if (value === "" || value === ".") {
    return fallback;
  }

  const number = Number(value);
  return Number.isFinite(number) ? clamp(number, min, max) : fallback;
}

function invalidateIntensityEstimateCache() {
  stationIntensityFeatureCache = null;
  presetObservationLookupCache = null;
  stationDataCache = { bucket: null, data: null };
  areaDataCache = { bucket: null, data: null };
  localAreaStationMembershipCache = null;
  simulationRenderBucket = -1;
}

function syncInputs() {
  if (els.magnitude && els.magnitude.options.length === 0) {
    renderMagnitudeOptions();
  }

  if (document.activeElement !== els.latitude) {
    els.latitude.value = state.latitude.toFixed(3);
  }
  if (document.activeElement !== els.longitude) {
    els.longitude.value = state.longitude.toFixed(3);
  }
  els.depth.value = String(state.depthKm);
  els.magnitude.value = state.magnitude.toFixed(1);
  if (els.historicalEarthquake) {
    els.historicalEarthquake.value = state.selectedPresetId;
  }
  if (els.intensityColorScheme) {
    els.intensityColorScheme.value = state.intensityColorScheme;
  }
  els.epicenterRegion.value = state.epicenterName;
  els.municipalityOutput.textContent = state.municipalityName;
  els.maxIntensityOutput.textContent = state.maxIntensityLabel;
  els.stationLayerToggle.checked = state.showStationLayer;
  els.regionLayerToggle.checked = state.showRegionLayer;
  els.eewWarningToggle.checked = state.showEewWarningLayer;
  els.simulationStationLayerToggle.checked = state.showStationLayer;
  els.simulationRegionLayerToggle.checked = state.showRegionLayer;
  els.simulationEewWarningToggle.checked = state.showEewWarningLayer;
}

function updateSimulationAvailability() {
  if (!els.simulationStart) {
    return;
  }

  if (state.simulationRunning) {
    els.simulationStart.disabled = false;
    els.simulationStart.title = "";
    return;
  }

  const predictedMaximum = getPredictedMaximumIntensity();
  const canStart =
    Number.isFinite(predictedMaximum.value) && predictedMaximum.rank >= 1;

  els.simulationStart.disabled = !canStart;
  els.simulationStart.title = canStart
    ? ""
    : "震度1以上が見込まれないため開始できません";
}

async function updateEpicenter(options = {}) {
  if (!map) {
    return;
  }

  if (options.resolveLocation) {
    const locationInManagedArea = await updateLocationNames();
    if (options.enforceManagedArea && !locationInManagedArea) {
      state.latitude = lastManagedEpicenter.latitude;
      state.longitude = lastManagedEpicenter.longitude;
      await updateLocationNames();
      syncInputs();
      if (epicenterMarker) {
        epicenterMarker.setLngLat([state.longitude, state.latitude]);
      }
      updateIntensityLayer();
      return;
    }

    if (locationInManagedArea) {
      lastManagedEpicenter = {
        latitude: state.latitude,
        longitude: state.longitude,
      };
    }
  }

  updateIntensityLayer();
  syncInputs();
  const lngLat = [state.longitude, state.latitude];

  if (!epicenterMarker) {
    const markerElement = document.createElement("span");
    markerElement.className = "epicenter-marker-shell";
    markerElement.innerHTML = `
      <svg class="epicenter-marker" viewBox="0 0 48 48" aria-hidden="true">
        <path d="M10 15 L15 10 L24 19 L33 10 L38 15 L29 24 L38 33 L33 38 L24 29 L15 38 L10 33 L19 24 Z" />
      </svg>
    `;

    epicenterMarker = new maplibregl.Marker({
      element: markerElement,
      draggable: state.epicenterEditEnabled,
    })
      .setLngLat(lngLat)
      .addTo(map);

    markerElement.addEventListener("click", (event) => {
      event.stopPropagation();
      epicenterMarker.getPopup()?.addTo(map);
    });

    epicenterMarker.on("dragend", () => {
      const markerLngLat = epicenterMarker.getLngLat();
      state.latitude = Number(markerLngLat.lat.toFixed(3));
      state.longitude = Number(markerLngLat.lng.toFixed(3));
      clearSelectedPreset();
      invalidateIntensityEstimateCache();
      syncInputs();
    updateEpicenter({ resolveLocation: true, enforceManagedArea: true });
  });
    updateEpicenterEditMode();
  }

  epicenterMarker
    .setLngLat(lngLat)
    .setPopup(
      new maplibregl.Popup({ offset: 24 }).setHTML(
        [
          `${escapeHtml(state.epicenterName)}`,
          `M ${state.magnitude.toFixed(1)}`,
          `深さ ${formatDepth(state.depthKm)}`,
          `最大震度 ${escapeHtml(state.maxIntensityLabel)}`,
          `${state.latitude.toFixed(3)}, ${state.longitude.toFixed(3)}`,
        ].join("<br>"),
      ),
    );
}

async function updateLocationNames() {
  let inManagedArea = false;

  try {
    const [municipalities, localAreas, seaAreas] = await Promise.all([
      loadMunicipalities(),
      loadLocalAreas(),
      loadSeaEpicenterAreas(),
    ]);
    const municipality = findFeatureAtPoint(municipalities, state.longitude, state.latitude);
    const localArea = municipality
      ? findFeatureAtPoint(localAreas, state.longitude, state.latitude)
      : null;
    const seaArea = municipality
      ? null
      : findFeatureAtPoint(seaAreas, state.longitude, state.latitude) ??
        findNearestSeaArea(seaAreas, state.longitude, state.latitude);
    inManagedArea = Boolean(municipality || seaArea);
    if (
      isExcludedTerritoryName(municipality?.properties?.name) ||
      isExcludedTerritoryName(localArea?.properties?.name) ||
      isExcludedTerritoryName(seaArea?.properties?.name)
    ) {
      inManagedArea = false;
    }

    state.municipalityName = municipality ? cleanDisplayAreaName(municipality.properties.name) : "該当なし";
    state.epicenterName = localArea
      ? cleanDisplayAreaName(localArea.properties.name)
      : seaArea
        ? cleanDisplayAreaName(seaArea.properties.name)
        : "最寄り海域なし";

  } catch (error) {
    state.municipalityName = "判定できません";
    state.epicenterName = "判定できません";
    console.warn(error);
  }

  els.epicenterRegion.value = state.epicenterName;
  els.municipalityOutput.textContent = state.municipalityName;
  return inManagedArea;
}

function isExcludedTerritoryName(name) {
  return Boolean(name && /北方領土|樺太|サハリン|竹島|択捉|択捉島|国後|国後島|色丹|色丹島|歯舞|歯舞群島/.test(name));
}

function cleanDisplayAreaName(name) {
  return String(name ?? "")
    .replace(/^気象庁予報警報規程別表第四の二に示す「(.+)」の区域$/, "$1")
    .trim();
}

function updateIntensityLayer() {
  if (!map || !localAreaData) {
    return;
  }

  if (map.getSource("shindo-stations") && shindoStationData) {
    map.getSource("shindo-stations").setData(getStationIntensityDataForElapsed(getSimulationStationElapsedSec()));
  }

  if (map.getSource("jma-local-areas")) {
    map.getSource("jma-local-areas").setData(buildIntensityAreaData(localAreaData, getSimulationStationElapsedSec()));
  }

  updateSimulationAvailability();
}

function getSimulationStationElapsedSec() {
  return state.simulationRunning ? getSimulationElapsedSec() : Infinity;
}

function getStationIntensityDataForElapsed(elapsedSec = Infinity) {
  if (!shindoStationData) {
    return emptyFeatureCollection();
  }

  const bucket = toSimulationBucket(elapsedSec);
  if (stationDataCache.bucket === bucket && stationDataCache.data) {
    return stationDataCache.data;
  }

  const data = buildStationIntensityData(shindoStationData, elapsedSec);
  stationDataCache = {
    bucket,
    data,
  };
  return data;
}

function getPredictedMaximumIntensity() {
  if (!shindoStationData) {
    return { rank: 0, value: 0 };
  }

  return buildStationIntensityFeatures(shindoStationData).reduce(
    (maximum, feature) => {
      const rank = feature.properties.predictedIntensityRank;
      const value = feature.properties.predictedIntensityValue;
      if (rank > maximum.rank || (rank === maximum.rank && value > maximum.value)) {
        return { rank, value };
      }

      return maximum;
    },
    { rank: 0, value: 0 },
  );
}

function buildIntensityAreaData(geojson, elapsedSec = Infinity) {
  const bucket = toSimulationBucket(elapsedSec);
  if (areaDataCache.bucket === bucket && areaDataCache.data) {
    return areaDataCache.data;
  }

  const isSimulation = Number.isFinite(elapsedSec);
  const selectedPreset = getSelectedPreset();
  const predictedStationFeatures = shindoStationData ? buildStationIntensityFeatures(shindoStationData) : [];
  const stationFeatures = shindoStationData
      ? isSimulation
        ? getStationIntensityDataForElapsed(elapsedSec).features.filter(
          (feature) => feature.properties.observed,
        )
      : predictedStationFeatures
    : [];
  const areaStationIds = getLocalAreaStationMembership(geojson, predictedStationFeatures);
  const activeStationById = new Map(stationFeatures.map((feature) => [feature.properties.id, feature]));
  const predictedStationById = new Map(
    predictedStationFeatures.map((feature) => [feature.properties.id, feature]),
  );
  let maxClass = INTENSITY_CLASSES[0];
  let maxValue = 0;
  let predictedMaxClass = INTENSITY_CLASSES[0];

  const areaFeatures = geojson.features.map((feature, index) => {
    const stationIds = areaStationIds[index] ?? [];
    const areaStations = stationIds.map((stationId) => activeStationById.get(stationId)).filter(Boolean);
    const predictedAreaStations = stationIds
      .map((stationId) => predictedStationById.get(stationId))
      .filter(Boolean);
    const intensityValue =
      areaStations.length > 0
        ? Math.max(...areaStations.map((stationFeature) => stationFeature.properties.intensityValue))
        : isSimulation
          ? 0
          : selectedPreset
            ? 0
            : estimateMaxIntensityForFeature(feature);
    const predictedIntensityValue =
      predictedAreaStations.length > 0
        ? Math.max(
            ...predictedAreaStations.map((stationFeature) => stationFeature.properties.predictedIntensityValue),
          )
        : selectedPreset
          ? 0
          : estimateMaxIntensityForFeature(feature);
    const intensityClass = toJmaIntensityClass(intensityValue);
    const predictedIntensityClass = toJmaIntensityClass(predictedIntensityValue);

    if (intensityClass.rank > maxClass.rank || intensityValue > maxValue) {
      maxClass = intensityClass;
      maxValue = intensityValue;
    }
    if (predictedIntensityClass.rank > predictedMaxClass.rank) {
      predictedMaxClass = predictedIntensityClass;
    }

    return {
      ...feature,
      properties: {
        ...feature.properties,
        intensityValue: Number(intensityValue.toFixed(2)),
        intensityLabel: intensityClass.label,
        intensityRank: intensityClass.rank,
        intensityColor: intensityClass.color,
        predictedIntensityValue: Number(predictedIntensityValue.toFixed(2)),
        predictedIntensityRank: predictedIntensityClass.rank,
      },
    };
  });

  const shouldIssueEew = predictedMaxClass.rank >= 5;
  const features = areaFeatures.map((feature) => {
    const eewForecastArea = getEewForecastAreaName(feature.properties.name);
    const eewWarning = selectedPreset
      ? isPresetEewWarningFeature(selectedPreset, feature, eewForecastArea, elapsedSec)
      : shouldIssueEew && feature.properties.predictedIntensityRank >= 4;

    return {
      ...feature,
      properties: {
        ...feature.properties,
        eewWarning,
        eewForecastArea,
      },
    };
  });

  if (!selectedPreset) {
    applyAdaptiveEewExpansion(features, shouldIssueEew);
  }
  applyEewBlinkState(features, elapsedSec);
  const warningForecastAreas = new Set(
    features
      .filter((feature) => feature.properties.eewWarning)
      .map((feature) => feature.properties.eewForecastArea),
  );

  state.eewWarningForecastAreas = compactForecastAreas([...warningForecastAreas]);
  updateEewForecastPanel();

  state.maxIntensityLabel = `${maxClass.label}（計測震度 ${selectedPreset ? "-" : maxValue.toFixed(1)}）`;

  const data = {
    ...geojson,
    name: "JMA local areas with representative maximum intensity",
    features,
  };

  areaDataCache = {
    bucket,
    data,
  };

  return data;
}

function applyAdaptiveEewExpansion(features, shouldIssueEew) {
  if (!shouldIssueEew) {
    return;
  }

  const offshoreFactor = getOffshoreEpicenterFactor();
  const predictedMax = features.reduce(
    (maximum, feature) =>
      Math.max(maximum, feature.properties.predictedIntensityValue ?? 0),
    0,
  );
  const allowPredictedExpansion = offshoreFactor >= 0.75 || state.magnitude >= 7.4;
  const warningAreas = new Set(
    features.filter((feature) => feature.properties.eewWarning).map((feature) => feature.properties.eewForecastArea),
  );

  features.forEach((feature) => {
    if (feature.properties.eewWarning) {
      return;
    }

    const sameForecastAreaAlreadyWarned = warningAreas.has(feature.properties.eewForecastArea);
    const predictedRank = feature.properties.predictedIntensityRank ?? 0;
    const predictedValue = feature.properties.predictedIntensityValue ?? 0;
    const currentRank = feature.properties.intensityRank ?? 0;

    if (
      (allowPredictedExpansion && sameForecastAreaAlreadyWarned && predictedRank >= 3) ||
      (predictedMax >= 5.0 && currentRank >= 3 && sameForecastAreaAlreadyWarned) ||
      (offshoreFactor >= 0.75 && predictedValue >= 3.8)
    ) {
      feature.properties.eewWarning = true;
      warningAreas.add(feature.properties.eewForecastArea);
    }
  });
}

function isPresetEewWarningFeature(preset, feature, forecastArea, elapsedSec = Infinity) {
  const reportAreas = getPresetEewAreasForElapsed(preset, elapsedSec);
  if (reportAreas.length === 0) {
    return false;
  }

  const featureArea = normalizeEewAreaName(feature.properties.name);
  const forecast = normalizeEewAreaName(forecastArea);

  return reportAreas.some((areaName) => {
    const area = normalizeEewAreaName(areaName);
    const groupedAreas = (FORECAST_AREA_GROUP_MEMBERS[areaName] ?? []).map(normalizeEewAreaName);
    return (
      area === featureArea ||
      area === forecast ||
      groupedAreas.includes(forecast) ||
      groupedAreas.includes(featureArea) ||
      (area.length >= 2 && featureArea.includes(area)) ||
      (area.length >= 2 && forecast.includes(area))
    );
  });
}

function getPresetEewAreasForElapsed(preset, elapsedSec = Infinity) {
  const reports = preset.eewReports ?? [];
  if (reports.length === 0) {
    return [];
  }

  if (!Number.isFinite(elapsedSec)) {
    return reports[reports.length - 1]?.areas ?? [];
  }

  for (let index = reports.length - 1; index >= 0; index -= 1) {
    if (Number(reports[index].elapsedSec) <= elapsedSec) {
      return reports[index].areas ?? [];
    }
  }

  return [];
}

function normalizeEewAreaName(value) {
  return String(value ?? "")
    .normalize("NFKC")
    .replace(/\s+/g, "")
    .trim();
}

function applyEewBlinkState(features, elapsedSec) {
  const isSimulation = state.simulationRunning && Number.isFinite(elapsedSec);
  if (!isSimulation) {
    state.eewWarningBlinkStartedAt = {};
    state.eewInitialWarningKeys = new Set();
    features.forEach((feature) => {
      feature.properties.eewBlinkOff = false;
    });
    return;
  }

  const activeWarningKeys = features
    .filter((feature) => feature.properties.eewWarning)
    .map(getEewFeatureKey);
  if (state.eewInitialWarningKeys.size === 0 && activeWarningKeys.length > 0) {
    activeWarningKeys.forEach((key) => state.eewInitialWarningKeys.add(key));
  }

  features.forEach((feature) => {
    if (!feature.properties.eewWarning) {
      feature.properties.eewBlinkOff = false;
      return;
    }

    const key = getEewFeatureKey(feature);
    if (state.eewInitialWarningKeys.has(key)) {
      feature.properties.eewBlinkOff = false;
      return;
    }

    if (!Object.prototype.hasOwnProperty.call(state.eewWarningBlinkStartedAt, key)) {
      state.eewWarningBlinkStartedAt[key] = elapsedSec;
    }

    const elapsedSinceWarning = elapsedSec - state.eewWarningBlinkStartedAt[key];
    const phase = Math.floor(elapsedSinceWarning / EEW_BLINK_INTERVAL_SEC);
    feature.properties.eewBlinkOff = phase < EEW_BLINK_PHASES && phase % 2 === 1;
  });
}

function getEewFeatureKey(feature) {
  return String(feature.properties.code ?? feature.properties.name ?? feature.id ?? "");
}

function getLocalAreaStationMembership(geojson, stationFeatures) {
  if (
    localAreaStationMembershipCache &&
    localAreaStationMembershipCache.areaCount === geojson.features.length &&
    localAreaStationMembershipCache.stationCount === stationFeatures.length
  ) {
    return localAreaStationMembershipCache.stationIdsByArea;
  }

  const stationIdsByArea = geojson.features.map(() => []);
  stationFeatures.forEach((stationFeature) => {
    const point = stationFeature.geometry.coordinates;
    const areaIndex = geojson.features.findIndex((feature) =>
      getFeaturePolygons(feature).some((polygon) => pointInPolygon(point, polygon)),
    );

    if (areaIndex >= 0) {
      stationIdsByArea[areaIndex].push(stationFeature.properties.id);
    }
  });

  localAreaStationMembershipCache = {
    areaCount: geojson.features.length,
    stationCount: stationFeatures.length,
    stationIdsByArea,
  };

  return stationIdsByArea;
}

function compactForecastAreas(areaNames) {
  const sortedNames = sortForecastAreas([...new Set(areaNames)]);
  const groups = Object.entries(FORECAST_AREA_GROUP_MEMBERS).map(([name, members]) => ({ name, members }));
  const remaining = new Set(sortedNames);
  const compacted = [];

  groups.forEach((group) => {
    const included = group.members.filter((member) => remaining.has(member));
    if (included.length >= 3 || included.length / group.members.length >= 0.5) {
      compacted.push(group.name);
      included.forEach((member) => remaining.delete(member));
    }
  });

  return sortForecastAreasForDisplay([...compacted, ...remaining]);
}

const FORECAST_AREA_GROUP_MEMBERS = {
  北海道: ["北海道道央", "北海道道南", "北海道道北", "北海道道東"],
  関東: ["東京", "神奈川", "埼玉", "千葉", "茨城", "栃木", "群馬", "山梨"],
  東北: ["青森", "岩手", "宮城", "秋田", "山形", "福島"],
  北陸: ["新潟", "富山", "石川", "福井"],
  東海: ["静岡", "愛知", "岐阜", "三重"],
  近畿: ["滋賀", "京都", "大阪", "兵庫", "奈良", "和歌山"],
  中国: ["鳥取", "島根", "岡山", "広島", "山口"],
  四国: ["徳島", "香川", "愛媛", "高知"],
  九州: ["福岡", "佐賀", "長崎", "熊本", "大分", "宮崎", "鹿児島"],
};

const FORECAST_AREA_ORDER = [
  "北海道",
  "北海道道央",
  "北海道道南",
  "北海道道北",
  "北海道道東",
  "東北",
  "青森",
  "岩手",
  "宮城",
  "秋田",
  "山形",
  "福島",
  "関東",
  "茨城",
  "栃木",
  "群馬",
  "埼玉",
  "千葉",
  "東京",
  "神奈川",
  "山梨",
  "北陸",
  "新潟",
  "富山",
  "石川",
  "福井",
  "長野",
  "東海",
  "岐阜",
  "静岡",
  "愛知",
  "三重",
  "近畿",
  "滋賀",
  "京都",
  "大阪",
  "兵庫",
  "奈良",
  "和歌山",
  "中国",
  "鳥取",
  "島根",
  "岡山",
  "広島",
  "山口",
  "四国",
  "徳島",
  "香川",
  "愛媛",
  "高知",
  "九州",
  "福岡",
  "佐賀",
  "長崎",
  "熊本",
  "大分",
  "宮崎",
  "鹿児島",
  "奄美群島",
  "沖縄本島",
  "大東島",
  "宮古島",
  "八重山",
  "伊豆諸島",
  "小笠原",
];

const PREFECTURE_NAMES = [
  "北海道",
  "青森県",
  "岩手県",
  "宮城県",
  "秋田県",
  "山形県",
  "福島県",
  "茨城県",
  "栃木県",
  "群馬県",
  "埼玉県",
  "千葉県",
  "東京都",
  "神奈川県",
  "新潟県",
  "富山県",
  "石川県",
  "福井県",
  "山梨県",
  "長野県",
  "岐阜県",
  "静岡県",
  "愛知県",
  "三重県",
  "滋賀県",
  "京都府",
  "大阪府",
  "兵庫県",
  "奈良県",
  "和歌山県",
  "鳥取県",
  "島根県",
  "岡山県",
  "広島県",
  "山口県",
  "徳島県",
  "香川県",
  "愛媛県",
  "高知県",
  "福岡県",
  "佐賀県",
  "長崎県",
  "熊本県",
  "大分県",
  "宮崎県",
  "鹿児島県",
  "沖縄県",
];

function sortForecastAreas(areaNames) {
  return [...areaNames].sort((a, b) => {
    const diff = forecastAreaSortIndex(a) - forecastAreaSortIndex(b);
    return diff === 0 ? a.localeCompare(b, "ja") : diff;
  });
}

function sortForecastAreasForDisplay(areaNames) {
  return [...areaNames].sort((a, b) => {
    const broadAreaDiff = forecastAreaDisplayGroupIndex(a) - forecastAreaDisplayGroupIndex(b);
    if (broadAreaDiff !== 0) {
      return broadAreaDiff;
    }

    const diff = forecastAreaSortIndex(a) - forecastAreaSortIndex(b);
    return diff === 0 ? a.localeCompare(b, "ja") : diff;
  });
}

function forecastAreaDisplayGroupIndex(areaName) {
  return isBroadForecastArea(areaName) ? 0 : 1;
}

function isBroadForecastArea(areaName) {
  return [
    "北海道",
    "北海道道央",
    "北海道道南",
    "北海道道北",
    "北海道道東",
    "東北",
    "関東",
    "北陸",
    "東海",
    "近畿",
    "中国",
    "四国",
    "九州",
    "奄美群島",
    "沖縄本島",
    "大東島",
    "宮古島",
    "八重山",
    "伊豆諸島",
    "小笠原",
  ].includes(areaName);
}

function forecastAreaSortIndex(areaName) {
  const index = FORECAST_AREA_ORDER.indexOf(areaName);
  return index >= 0 ? index : FORECAST_AREA_ORDER.length;
}

function updateEewForecastPanel() {
  if (!els.eewForecastPanel || !els.eewForecastList) {
    return;
  }

  const visible = state.showEewWarningLayer && state.eewWarningForecastAreas.length > 0;
  els.eewForecastPanel.classList.toggle("hidden", !visible);
  els.eewForecastList.replaceChildren(
    ...state.eewWarningForecastAreas.map((areaName) => {
      const item = document.createElement("li");
      item.textContent = areaName;
      return item;
    }),
  );
}

function getEewForecastAreaName(localAreaName) {
  if (!localAreaName) {
    return "不明";
  }

  const hokkaidoForecastArea = getHokkaidoEewForecastAreaName(localAreaName);
  if (hokkaidoForecastArea) {
    return hokkaidoForecastArea;
  }

  if (/^東京都(２３区|多摩)/.test(localAreaName)) {
    return "東京";
  }

  if (["伊豆大島", "新島", "神津島", "三宅島", "八丈島"].includes(localAreaName)) {
    return "伊豆諸島";
  }

  if (localAreaName === "小笠原") {
    return "小笠原";
  }

  if (localAreaName.startsWith("鹿児島県奄美")) {
    return "奄美群島";
  }

  if (localAreaName.startsWith("沖縄県本島")) {
    return "沖縄本島";
  }

  if (localAreaName.startsWith("沖縄県大東島")) {
    return "大東島";
  }

  if (localAreaName.startsWith("沖縄県宮古島")) {
    return "宮古島";
  }

  if (/^沖縄県(石垣島|与那国島|西表島)/.test(localAreaName)) {
    return "八重山";
  }

  const prefecture = PREFECTURE_NAMES.find((name) => localAreaName.startsWith(name));
  if (prefecture) {
    return prefecture.replace(/[都府県]$/, "");
  }

  return localAreaName;
}

function getHokkaidoEewForecastAreaName(localAreaName) {
  if (
    [
      "石狩地方北部",
      "石狩地方中部",
      "石狩地方南部",
      "後志地方北部",
      "後志地方東部",
      "後志地方西部",
      "空知地方北部",
      "空知地方中部",
      "空知地方南部",
    ].includes(localAreaName)
  ) {
    return "北海道道央";
  }

  if (
    [
      "渡島地方北部",
      "渡島地方東部",
      "渡島地方西部",
      "檜山地方",
      "北海道奥尻島",
      "胆振地方西部",
      "胆振地方中東部",
      "日高地方西部",
      "日高地方中部",
      "日高地方東部",
    ].includes(localAreaName)
  ) {
    return "北海道道南";
  }

  if (
    [
      "上川地方北部",
      "上川地方中部",
      "上川地方南部",
      "留萌地方中北部",
      "留萌地方南部",
      "宗谷地方北部",
      "宗谷地方南部",
      "北海道利尻礼文",
    ].includes(localAreaName)
  ) {
    return "北海道道北";
  }

  if (
    [
      "網走地方",
      "北見地方",
      "紋別地方",
      "十勝地方北部",
      "十勝地方中部",
      "十勝地方南部",
      "釧路地方北部",
      "釧路地方中南部",
      "根室地方北部",
      "根室地方中部",
      "根室地方南部",
    ].includes(localAreaName)
  ) {
    return "北海道道東";
  }

  return null;
}

function buildStationIntensityData(data, elapsedSec = Infinity) {
  const isSimulation = Number.isFinite(elapsedSec);

  return {
    type: "FeatureCollection",
    name: "Observed JMA shindo stations with estimated intensity",
    source: data.source,
    updated: data.updated,
    features: buildStationIntensityFeatures(data)
      .filter(
        (feature) =>
          feature.properties.intensityRank >= 1 &&
          (isSimulation
            ? feature.properties.pArrivalSec <= elapsedSec
            : feature.properties.sArrivalSec <= elapsedSec),
      )
      .map((feature) => {
        const currentProperties = getCurrentIntensityProperties(feature.properties, elapsedSec);
        return {
          ...feature,
          properties: {
            ...feature.properties,
            ...currentProperties,
          },
        };
      })
      .filter((feature) => feature.properties.intensityRank >= 1),
  };
}

function getCurrentIntensityProperties(properties, elapsedSec = Infinity) {
  const isSimulation = Number.isFinite(elapsedSec);
  const observed = !isSimulation || elapsedSec >= properties.pArrivalSec;
  const waveState = isSimulation && properties.sArrivalSec > elapsedSec ? "p" : "s";
  const riseProfile = getGroundRiseProfile(properties);
  const riseProgress = isSimulation
    ? groundAwareRiseProgress(elapsedSec - properties.sArrivalSec, riseProfile)
    : 1;
  const pWaveProgress = isSimulation
    ? smoothStep(
        clamp(
          (elapsedSec - properties.pArrivalSec) /
            Math.max(properties.sArrivalSec - properties.pArrivalSec, 0.5),
          0,
          1,
        ),
      )
    : 1;
  const pWaveTarget =
    properties.predictedIntensityValue >= 1.5
      ? clamp(properties.predictedIntensityValue * 0.18, 0.18, 0.85)
      : Math.min(properties.predictedIntensityValue * 0.12, 0.28);
  const pWaveIntensity = pWaveTarget * pWaveProgress;
  const currentIntensityValue =
    waveState === "p"
      ? pWaveIntensity
      : Math.max(pWaveIntensity, properties.predictedIntensityValue * riseProgress);
  const currentClass = toJmaIntensityClass(currentIntensityValue);

  return {
    observed,
    waveState,
    riseProgress: Number(riseProgress.toFixed(3)),
    currentIntensityValue: Number(currentIntensityValue.toFixed(2)),
    intensityValue: Number(currentIntensityValue.toFixed(2)),
    intensityLabel: currentClass.label,
    intensityShortLabel: currentClass.shortLabel,
    intensityRank: currentClass.rank,
    intensityColor: currentClass.color,
    intensityTextColor: currentClass.textColor,
  };
}

function getGroundRiseProfile(properties) {
  const avs = properties.groundAvs ?? 400;
  const amplification = properties.groundAmplification ?? EARTHQUAKE_MODEL.defaultSiteAmplification;
  const softness = clamp((520 - avs) / 420, 0, 1);
  const amplificationFactor = clamp((amplification + 0.6) / 1.8, 0, 1);
  const waveformProfile = getEarthquakeWaveformProfile();
  const durationSec =
    3.8 +
    softness * 5.8 +
    amplificationFactor * 2.2 +
    waveformProfile.durationExtensionSec;
  const curvature =
    1.15 +
    softness * 1.25 +
    amplificationFactor * 0.65 -
    waveformProfile.slowRise;

  return {
    durationSec,
    curvature: Math.max(curvature, 0.55),
    lateEnergy: waveformProfile.lateEnergy,
    multiPeak: waveformProfile.multiPeak,
  };
}

function groundAwareRiseProgress(timeSinceSArrivalSec, profile) {
  if (timeSinceSArrivalSec <= 0) {
    return 0;
  }

  const normalizedTime = timeSinceSArrivalSec / Math.max(profile.durationSec, 0.1);
  const exponentialEnvelope = 1 - Math.exp(-profile.curvature * normalizedTime);
  const lateEnergy = profile.lateEnergy * smoothStep(clamp((normalizedTime - 0.46) / 0.54, 0, 1));
  const multiPeakEnergy =
    profile.multiPeak *
    (0.45 * smoothStep(clamp((normalizedTime - 0.16) / 0.18, 0, 1)) +
      0.35 * smoothStep(clamp((normalizedTime - 0.38) / 0.2, 0, 1)) +
      0.2 * smoothStep(clamp((normalizedTime - 0.66) / 0.24, 0, 1)));
  return clamp(exponentialEnvelope + lateEnergy + multiPeakEnergy, 0, 1);
}

function getEarthquakeWaveformProfile() {
  const magnitudeExcess = Math.max(state.magnitude - 6.5, 0);
  const giantMagnitude = Math.max(state.magnitude - 8.0, 0);
  const offshoreFactor = getOffshoreEpicenterFactor();

  return {
    durationExtensionSec:
      magnitudeExcess * 4.8 +
      offshoreFactor * (2.5 + magnitudeExcess * 5.8) +
      giantMagnitude * 18,
    slowRise: clamp(offshoreFactor * 0.28 + giantMagnitude * 0.18, 0, 0.58),
    lateEnergy: clamp(0.07 + offshoreFactor * 0.08 + giantMagnitude * 0.08, 0.07, 0.24),
    multiPeak: clamp(offshoreFactor * 0.12 + giantMagnitude * 0.12, 0, 0.28),
  };
}

function getOffshoreEpicenterFactor() {
  const name = state.epicenterName ?? "";
  if (/沖|海|湾|灘|海峡|トラフ|海溝|台湾付近|台湾東方沖/.test(name)) {
    return 1;
  }

  if (/近海|東方|南方|北西|南東/.test(name)) {
    return 0.75;
  }

  return 0;
}

function buildStationIntensityFeatures(data) {
  if (stationIntensityFeatureCache) {
    return stationIntensityFeatureCache;
  }

  stationIntensityFeatureCache = data.stations
    .filter((station) => station.active)
    .map((station) => {
      const ground = getGroundModelAt(station.longitude, station.latitude);
      const actualObservation = getPresetStationObservation(station);
      const preset = getSelectedPreset();
      if (preset && !actualObservation) {
        return null;
      }
      const intensityValue = actualObservation
        ? actualObservation.intensityValue
        : estimateIntensityAtPoint(station.longitude, station.latitude);
      const intensityClass = toJmaIntensityClass(intensityValue);
      const epicentralDistanceKm = haversineKilometers(
        [state.longitude, state.latitude],
        [station.longitude, station.latitude],
      );
      const hypocentralDistanceKm = Math.hypot(epicentralDistanceKm, state.depthKm);
      const pArrivalSec = hypocentralDistanceKm / EARTHQUAKE_MODEL.pWaveVelocityKmPerSec;
      const sArrivalSec = hypocentralDistanceKm / EARTHQUAKE_MODEL.sWaveVelocityKmPerSec;
      const groundAmplification =
        ground?.intensityAmplification ?? EARTHQUAKE_MODEL.defaultSiteAmplification;
      const riseProfile = getGroundRiseProfile({
        groundAvs: ground?.avs,
        groundAmplification,
      });

      return {
        type: "Feature",
        properties: {
          id: station.id,
          name: station.name,
          areaName: station.areaName,
          address: station.address,
          predictedIntensityValue: Number(intensityValue.toFixed(2)),
          predictedIntensityLabel: intensityClass.label,
          predictedIntensityShortLabel: intensityClass.shortLabel,
          predictedIntensityRank: intensityClass.rank,
          predictedIntensityColor: intensityClass.color,
          actualObserved: Boolean(actualObservation),
          observationStatus: actualObservation ? "実観測" : preset ? "欠測（当時の観測点なし・補完）" : "推定",
          measuredIntensity:
            actualObservation?.measuredIntensity == null
              ? null
              : Number(actualObservation.measuredIntensity),
          intensityValue: Number(intensityValue.toFixed(2)),
          intensityLabel: intensityClass.label,
          intensityShortLabel: intensityClass.shortLabel,
          intensityRank: intensityClass.rank,
          intensityColor: intensityClass.color,
          intensityTextColor: intensityClass.textColor,
          groundCode: ground?.code ?? "",
          groundArv: ground?.arv ?? null,
          groundAvs: ground?.avs ?? null,
          groundAmplification: Number(groundAmplification.toFixed(2)),
          epicentralDistanceKm: Number(epicentralDistanceKm.toFixed(1)),
          hypocentralDistanceKm: Number(hypocentralDistanceKm.toFixed(1)),
          pArrivalSec: Number(pArrivalSec.toFixed(2)),
          sArrivalSec: Number(sArrivalSec.toFixed(2)),
          intensityRiseDurationSec: Number(riseProfile.durationSec.toFixed(2)),
          intensityCompleteSec: Number((sArrivalSec + riseProfile.durationSec * 3).toFixed(2)),
        },
        geometry: {
          type: "Point",
          coordinates: [station.longitude, station.latitude],
        },
      };
    })
    .filter(Boolean);

  return stationIntensityFeatureCache;
}

function estimateMaxIntensityForFeature(feature) {
  const epicenter = [state.longitude, state.latitude];
  const nearestPoint = getNearestPointOnFeature(epicenter, feature);
  return estimateIntensityAtPoint(nearestPoint.point[0], nearestPoint.point[1], nearestPoint.distanceKm);
}

function estimateIntensityAtPoint(longitude, latitude, knownEpicentralDistanceKm = null) {
  const epicenter = [state.longitude, state.latitude];
  const epicentralDistanceKm =
    knownEpicentralDistanceKm ?? haversineKilometers(epicenter, [longitude, latitude]);
  const effectiveEpicentralDistanceKm = getEffectiveEpicentralDistance(epicentralDistanceKm);
  const hypocentralDistanceKm = Math.hypot(effectiveEpicentralDistanceKm, state.depthKm);
  const ground = getGroundModelAt(longitude, latitude);

  return estimateInstrumentalIntensity({
    magnitude: state.magnitude,
    hypocentralDistanceKm,
    siteAmplification: ground?.intensityAmplification ?? EARTHQUAKE_MODEL.defaultSiteAmplification,
  });
}

function estimatePresetGapIntensity(longitude, latitude, preset) {
  const distanceKm = haversineKilometers([preset.longitude, preset.latitude], [longitude, latitude]);
  const baseValue =
    preset.id === "tohoku-2011"
      ? estimateTohoku2011GapIntensity(distanceKm, longitude, latitude)
      : preset.id === "kumamoto-2016"
        ? estimateKumamoto2016GapIntensity(distanceKm, longitude, latitude)
        : preset.id === "osaka-northern-2018"
          ? estimateOsaka2018GapIntensity(distanceKm, longitude, latitude)
          : estimateIntensityAtPoint(longitude, latitude);
  const ground = getGroundModelAt(longitude, latitude);
  const siteAdjustment = clamp((ground?.intensityAmplification ?? 0) * 0.28, -0.22, 0.28);
  return clamp(baseValue + siteAdjustment, 0, 6.45);
}

function estimateTohoku2011GapIntensity(distanceKm, longitude, latitude) {
  const pacificSideBoost = longitude >= 140 ? 0.35 : 0;
  const northeastBoost = latitude >= 36.5 && latitude <= 40.8 ? 0.25 : 0;
  return 6.25 - 1.55 * Math.log10(distanceKm + 30) - 0.0024 * distanceKm + pacificSideBoost + northeastBoost;
}

function estimateKumamoto2016GapIntensity(distanceKm, longitude, latitude) {
  const kyushuBoost = longitude >= 129 && longitude <= 132.2 && latitude >= 31.2 && latitude <= 33.8 ? 0.2 : 0;
  return 6.35 - 1.72 * Math.log10(distanceKm + 12) - 0.0062 * distanceKm + kyushuBoost;
}

function estimateOsaka2018GapIntensity(distanceKm, longitude, latitude) {
  const kinkiBoost = longitude >= 134.2 && longitude <= 136.8 && latitude >= 34.0 && latitude <= 35.8 ? 0.18 : 0;
  return 5.85 - 1.68 * Math.log10(distanceKm + 8) - 0.0074 * distanceKm + kinkiBoost;
}

function getEffectiveEpicentralDistance(epicentralDistanceKm) {
  const ruptureLengthKm = estimateRuptureLengthKm();
  const finiteFaultReductionKm = ruptureLengthKm * (0.1 + getOffshoreEpicenterFactor() * 0.04);
  return Math.max(epicentralDistanceKm - finiteFaultReductionKm, 1);
}

function estimateRuptureLengthKm() {
  if (state.magnitude < 6.6) {
    return 0;
  }

  return clamp(10 ** (-2.44 + 0.59 * state.magnitude), 0, 520);
}

function estimateInstrumentalIntensity({
  magnitude,
  hypocentralDistanceKm,
  siteAmplification = EARTHQUAKE_MODEL.defaultSiteAmplification,
}) {
  const distance = Math.max(hypocentralDistanceKm, 1);
  const giantMagnitudeSaturation = 0.55 * Math.max(magnitude - 7.0, 0) ** 2;
  return clamp(
    1.55 * magnitude -
      giantMagnitudeSaturation -
      2.05 * Math.log10(distance + 20) -
      0.0036 * distance +
      siteAmplification -
      1.2,
    0,
    7,
  );
}

function toJmaIntensityClass(instrumentalIntensity) {
  for (let index = INTENSITY_CLASSES.length - 1; index >= 0; index -= 1) {
    if (instrumentalIntensity >= INTENSITY_CLASSES[index].min) {
      return INTENSITY_CLASSES[index];
    }
  }

  return INTENSITY_CLASSES[0];
}

function getGroundModelAt(longitude, latitude) {
  if (!groundModelData?.meshes) {
    return null;
  }

  const code = meshCode1km(longitude, latitude);
  const values = groundModelData.meshes[code];
  if (!values) {
    return null;
  }

  const [arv, avs, s0, maxDepthM] = values;
  return {
    code,
    arv,
    avs,
    s0,
    maxDepthM,
    intensityAmplification: groundToIntensityAmplification({ arv, avs, maxDepthM }),
  };
}

function groundToIntensityAmplification({ arv, avs, maxDepthM }) {
  const velocityAmplification = arvToIntensityAmplification(arv);
  const shallowSoftness = Number.isFinite(avs) ? clamp((420 - avs) / 360, -0.28, 0.45) : 0;
  const basinAmplification = Number.isFinite(maxDepthM)
    ? clamp(Math.log10(Math.max(maxDepthM, 100) / 900) * 0.18, -0.08, 0.16)
    : 0;

  return clamp(velocityAmplification + shallowSoftness * 0.45 + basinAmplification, -0.45, 0.75);
}

function arvToIntensityAmplification(arv) {
  if (!Number.isFinite(arv) || arv <= 0) {
    return EARTHQUAKE_MODEL.defaultSiteAmplification;
  }

  // ARV is a peak velocity amplification factor. JMA instrumental intensity is
  // logarithmic, so use a modest log10 correction to avoid over-amplifying.
  return clamp(1.05 * Math.log10(arv), -0.35, 0.62);
}

function meshCode1km(longitude, latitude) {
  const latBase = Math.floor(latitude * 1.5);
  const lonBase = Math.floor(longitude) - 100;
  const latRemainder = latitude - latBase / 1.5;
  const lonRemainder = longitude - Math.floor(longitude);
  const latSecond = clamp(Math.floor(latRemainder / (5 / 60)), 0, 7);
  const lonSecond = clamp(Math.floor(lonRemainder / (7.5 / 60)), 0, 7);
  const latThirdRemainder = latRemainder - latSecond * (5 / 60);
  const lonThirdRemainder = lonRemainder - lonSecond * (7.5 / 60);
  const latThird = clamp(Math.floor(latThirdRemainder / (30 / 3600)), 0, 9);
  const lonThird = clamp(Math.floor(lonThirdRemainder / (45 / 3600)), 0, 9);

  return `${String(latBase).padStart(2, "0")}${String(lonBase).padStart(2, "0")}${latSecond}${lonSecond}${latThird}${lonThird}`;
}

function formatDepth(depthKm) {
  return depthKm === 0 ? "ごく浅い" : `${depthKm} km`;
}

function findFeatureAtPoint(geojson, longitude, latitude) {
  return geojson.features.find((feature) =>
    getFeaturePolygons(feature).some((polygon) => pointInPolygon([longitude, latitude], polygon)),
  );
}

function findNearestSeaArea(geojson, longitude, latitude) {
  const point = [longitude, latitude];
  let nearestFeature = null;
  let nearestDistance = Infinity;

  geojson.features.forEach((feature) => {
    const distance = getFeaturePolygons(feature).reduce(
      (minimum, polygon) => Math.min(minimum, distanceToPolygonKilometers(point, polygon)),
      Infinity,
    );

    if (distance < nearestDistance) {
      nearestDistance = distance;
      nearestFeature = feature;
    }
  });

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

function getNearestPointOnFeature(point, feature) {
  let nearest = {
    point,
    distanceKm: Infinity,
  };

  for (const polygon of getFeaturePolygons(feature)) {
    const candidate = getNearestPointOnPolygon(point, polygon);
    if (candidate.distanceKm < nearest.distanceKm) {
      nearest = candidate;
    }
  }

  return nearest.distanceKm === Infinity ? { point, distanceKm: 0 } : nearest;
}

function getNearestPointOnPolygon(point, polygon) {
  if (pointInPolygon(point, polygon)) {
    return { point, distanceKm: 0 };
  }

  let nearest = {
    point,
    distanceKm: Infinity,
  };

  for (const ring of polygon) {
    for (let index = 0; index < ring.length - 1; index += 1) {
      const candidate = nearestPointOnSegmentKilometers(point, ring[index], ring[index + 1]);
      if (candidate.distanceKm < nearest.distanceKm) {
        nearest = candidate;
      }
    }
  }

  return nearest;
}

function distanceToRingKilometers(point, ring) {
  let minimum = Infinity;

  for (let index = 0; index < ring.length - 1; index += 1) {
    minimum = Math.min(
      minimum,
      distanceToSegmentKilometers(point, ring[index], ring[index + 1]),
    );
  }

  return minimum;
}

function distanceToSegmentKilometers(point, start, end) {
  return nearestPointOnSegmentKilometers(point, start, end).distanceKm;
}

function nearestPointOnSegmentKilometers(point, start, end) {
  const startPoint = toLocalKilometers(start, point);
  const endPoint = toLocalKilometers(end, point);
  const segmentX = endPoint[0] - startPoint[0];
  const segmentY = endPoint[1] - startPoint[1];
  const segmentLengthSquared = segmentX * segmentX + segmentY * segmentY;

  if (segmentLengthSquared === 0) {
    return {
      point: start,
      distanceKm: Math.hypot(startPoint[0], startPoint[1]),
    };
  }

  const t = clamp(
    -((startPoint[0] * segmentX + startPoint[1] * segmentY) / segmentLengthSquared),
    0,
    1,
  );
  const nearestPoint = [
    start[0] + (end[0] - start[0]) * t,
    start[1] + (end[1] - start[1]) * t,
  ];

  return {
    point: nearestPoint,
    distanceKm: Math.hypot(startPoint[0] + segmentX * t, startPoint[1] + segmentY * t),
  };
}

function toLocalKilometers(coordinate, origin) {
  const latitudeScale = 110.57;
  const longitudeScale = 111.32 * Math.cos((origin[1] * Math.PI) / 180);

  return [
    (coordinate[0] - origin[0]) * longitudeScale,
    (coordinate[1] - origin[1]) * latitudeScale,
  ];
}

function haversineKilometers(start, end) {
  const startLat = toRadians(start[1]);
  const endLat = toRadians(end[1]);
  const deltaLat = toRadians(end[1] - start[1]);
  const deltaLon = toRadians(end[0] - start[0]);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(deltaLon / 2) ** 2;

  return 2 * EARTH_RADIUS_KM * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRadians(value) {
  return (value * Math.PI) / 180;
}

function toDegrees(value) {
  return (value * 180) / Math.PI;
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

function getGeoJsonBounds(geojson) {
  const bounds = {
    west: Infinity,
    south: Infinity,
    east: -Infinity,
    north: -Infinity,
  };

  geojson.features.forEach((feature) => {
    forEachCoordinate(feature.geometry.coordinates, (coordinate) => {
      bounds.west = Math.min(bounds.west, coordinate[0]);
      bounds.south = Math.min(bounds.south, coordinate[1]);
      bounds.east = Math.max(bounds.east, coordinate[0]);
      bounds.north = Math.max(bounds.north, coordinate[1]);
    });
  });

  if (!Number.isFinite(bounds.west)) {
    return null;
  }

  return [
    [bounds.west, bounds.south],
    [bounds.east, bounds.north],
  ];
}

function forEachCoordinate(coordinates, callback) {
  if (typeof coordinates[0] === "number") {
    callback(coordinates);
    return;
  }

  coordinates.forEach((item) => forEachCoordinate(item, callback));
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return entities[character];
  });
}

function smoothStep(value) {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
}

function clamp(value, min, max) {
  if (Number.isNaN(value)) {
    return min;
  }

  return Math.min(Math.max(value, min), max);
}

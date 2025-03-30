const fs = require("fs");
const path = require("path");

// 都道府県名 → ローマ字ファイル名のマップ
const prefNameMap = {
  北海道: "Hokkaido",
  青森県: "Aomori",
  岩手県: "Iwate",
  宮城県: "Miyagi",
  秋田県: "Akita",
  山形県: "Yamagata",
  福島県: "Fukushima",
  茨城県: "Ibaraki",
  栃木県: "Tochigi",
  群馬県: "Gunma",
  埼玉県: "Saitama",
  千葉県: "Chiba",
  東京都: "Tokyo",
  神奈川県: "Kanagawa",
  新潟県: "Niigata",
  富山県: "Toyama",
  石川県: "Ishikawa",
  福井県: "Fukui",
  山梨県: "Yamanashi",
  長野県: "Nagano",
  岐阜県: "Gifu",
  静岡県: "Shizuoka",
  愛知県: "Aichi",
  三重県: "Mie",
  滋賀県: "Shiga",
  京都府: "Kyoto",
  大阪府: "Osaka",
  兵庫県: "Hyogo",
  奈良県: "Nara",
  和歌山県: "Wakayama",
  鳥取県: "Tottori",
  島根県: "Shimane",
  岡山県: "Okayama",
  広島県: "Hiroshima",
  山口県: "Yamaguchi",
  徳島県: "Tokushima",
  香川県: "Kagawa",
  愛媛県: "Ehime",
  高知県: "Kochi",
  福岡県: "Fukuoka",
  佐賀県: "Saga",
  長崎県: "Nagasaki",
  熊本県: "Kumamoto",
  大分県: "Oita",
  宮崎県: "Miyazaki",
  鹿児島県: "Kagoshima",
  沖縄県: "Okinawa",
};

const inputFile = "./N03-20240101.json";
const outputDir = "./ad";

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

const raw = fs.readFileSync(inputFile, "utf-8");
const geojson = JSON.parse(raw);

// グループ化
const grouped = {};

for (const feature of geojson.features) {
  const prefecture = feature.properties.N03_001 || "不明";

  if (!grouped[prefecture]) {
    grouped[prefecture] = [];
  }

  // deep copy + 座標を string に変換
  const convertedFeature = JSON.parse(JSON.stringify(feature));
  const coords = convertedFeature.geometry.coordinates;

  function toStringCoords(coords) {
    if (Array.isArray(coords[0][0])) {
      return coords.map((poly) => poly.map((pair) => pair.map((v) => String(v))));
    } else {
      return coords.map((pair) => pair.map((v) => String(v)));
    }
  }

  convertedFeature.geometry.coordinates = toStringCoords(coords);

  grouped[prefecture].push(convertedFeature);
}

// 書き出し
for (const [prefecture, features] of Object.entries(grouped)) {
  const romajiName = prefNameMap[prefecture] || `unknown_${prefecture.replace(/[^\w]/g, "")}`;
  const filePath = path.join(outputDir, `${romajiName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(features, null, 2), "utf-8");
  console.log(`✅ ${prefecture} → ${romajiName}.json (${features.length} 件)`);
}

console.log("🎉 分割 & 指定形式での書き出し完了！");

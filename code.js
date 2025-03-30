const fs = require("fs");
const path = require("path");

// データがあるディレクトリ
const inputDir = path.join(__dirname, "public", "GSI_GIS_NO_GEOM", "ad");

// 出力ファイル
const outputFile = path.join(__dirname, "merged_municipalities.json");

// データ格納用
const merged = {};

// ディレクトリ内のすべての .json ファイルを読み込む
const files = fs.readdirSync(inputDir).filter((f) => f.endsWith(".json"));

for (const file of files) {
  const filePath = path.join(inputDir, file);
  const raw = fs.readFileSync(filePath, "utf-8");
  const features = JSON.parse(raw); // Feature[]

  for (const feature of features) {
    const p = feature.properties;
    const code = p.N03_007;

    if (!code) continue; // コードなしスキップ

    // name_a: N03_002 〜 N03_007（null除外）
    const name_a_parts = [p.N03_002, p.N03_003, p.N03_004, p.N03_005].filter(Boolean);
    const name_a = name_a_parts.join("");

    // name_b: N03_003 〜 N03_007（null除外）
    const name_b_parts = [p.N03_003, p.N03_004, p.N03_005].filter(Boolean);
    const name_b = name_b_parts.join("");

    const isPref = p.N03_004 === "所属未定地" || (p.N03_004 === null && p.N03_005 === null);

    merged[code] = {
      isPref,
      N03_001: p.N03_001 ?? null,
      N03_002: p.N03_002 ?? null,
      N03_003: p.N03_003 ?? null,
      N03_004: p.N03_004 ?? null,
      N03_005: p.N03_005 ?? null,
      N03_007: code,
      name_a,
      name_b,
    };
  }
}

// 出力
fs.writeFileSync(outputFile, JSON.stringify(merged, null, 2), "utf-8");

console.log(`✅ 統合完了！ ${outputFile} に保存しました。`);

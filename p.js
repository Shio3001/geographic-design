const fs = require("fs");
const path = require("path");

// public/GSI_GIS が実ファイルの場所
const inputDir = path.join(__dirname, "public", "GSI_GIS");
// 出力先（geometryをパス文字列に置換したファイル群）
const outputDir = path.join(__dirname, "public", "GSI_GIS_NO_GEOM");

// geometry に書き込むパスの prefix（public は含めない）
const visibleRoot = "GSI_GIS";

// ファイル内の geometry をファイルパス文字列に置換
function replaceGeometryWithPath(jsonData, relativePathForGeometry) {
  if (Array.isArray(jsonData)) {
    return jsonData.map((feature) => ({
      ...feature,
      geometry: relativePathForGeometry,
    }));
  } else if (jsonData.type === "FeatureCollection" && Array.isArray(jsonData.features)) {
    return {
      ...jsonData,
      features: jsonData.features.map((feature) => ({
        ...feature,
        geometry: relativePathForGeometry,
      })),
    };
  } else {
    return jsonData;
  }
}

// 再帰的にディレクトリ処理
function processDirectory(inputPath, outputPath, relPath = "") {
  const items = fs.readdirSync(inputPath, { withFileTypes: true });

  for (const item of items) {
    const inputItemPath = path.join(inputPath, item.name);
    const outputItemPath = path.join(outputPath, item.name);
    const currentRelPath = path.join(relPath, item.name).replace(/\\/g, "/");

    if (item.isDirectory()) {
      fs.mkdirSync(outputItemPath, { recursive: true });
      processDirectory(inputItemPath, outputItemPath, currentRelPath);
    } else if (item.isFile() && item.name.endsWith(".json")) {
      try {
        const raw = fs.readFileSync(inputItemPath, "utf-8");
        const parsedJson = JSON.parse(raw);

        // geometry に使うパス（public は含めず GSI_GIS からにする）
        const pathForGeometry = path.posix.join(visibleRoot, currentRelPath);

        const modifiedJson = replaceGeometryWithPath(parsedJson, pathForGeometry);

        fs.writeFileSync(outputItemPath, JSON.stringify(modifiedJson, null, 2), "utf-8");

        console.log(`✅ 書き出し: ${pathForGeometry}`);
      } catch (error) {
        console.warn(`⚠️ 失敗: ${currentRelPath} - ${error.message}`);
      }
    }
  }
}

// 出力ディレクトリ作成
fs.mkdirSync(outputDir, { recursive: true });

// 実行！
processDirectory(inputDir, outputDir);

console.log("🎉 完了！geometry に GSI_GIS/... のパスを埋め込んだファイル群を出力しました！");

// Illustrator JSXスクリプト：レイヤー1内のグループを独立レイヤーにする
var doc = app.activeDocument;
var parentLayer = doc.layers[0]; // レイヤー1

for (var i = parentLayer.groupItems.length - 1; i >= 0; i--) {
  var group = parentLayer.groupItems[i];
  var newLayer = doc.layers.add();
  newLayer.name = group.name || "Layer_" + i;
  group.move(newLayer, ElementPlacement.PLACEATBEGINNING);
}

export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Gradient Generator 3.2`
)});
  main.variable(observer("gradient")).define("gradient", ["randomColors","n","settings","foci","w","scales","skews","rotates","translations","shuffle","html","saturation"], function(randomColors,n,settings,foci,w,scales,skews,rotates,translations,shuffle,html,saturation)
{
  // styles
  const bgStyles = `#bg {fill:${randomColors[0]}}`
  const fgStylesArray = []
  for (var i = 0; i < n; i++) {
    fgStylesArray.push(`.rect${i} {fill:url(#rg${i})}`)
  }
  const fgStyles = fgStylesArray.reduce((acc, curr) => acc + curr)
  const styles = `<style>
    ${bgStyles}
    ${fgStyles}
  </style>`
  
  // radial gradients
  const radialGradientsArray = []
  for (var i = 0; i < n; i++) {
    for (var j = 0; j < settings.numGradientsPerSet; j++) { // loop within each set
      radialGradientsArray.push(
        `<radialGradient
          id="rg${i}"
          fx="${foci[i][j][0]}"
          fy="${foci[i][j][1]}">
          <stop offset="0%" stop-color="${randomColors[i]}"/>
          <stop offset="100%" stop-color="${randomColors[i]}" stop-opacity="0"/>
        </radialGradient>`)
    }
  }
  const radialGradients = radialGradientsArray.reduce((acc, curr) => acc + curr)
  
  // defs
  const defs = `${styles}
  ${radialGradients}`
  
  // rects
  const bgRect = `<rect id="bg" x="0" y="0" width="100%" height="100%"/>`
  const fgRectsArray = []
  for (var i = 0; i < n; i++) { // loop over color sets
    for (var j = 0; j < settings.numGradientsPerSet; j++) { // loop within each set
      fgRectsArray.push(
        `<rect class="rect rect${i}" x="0" y="0" width="100%" height="100%"
          transform="translate(${w/2} ${w/2}) scale(${scales[i][j][0]} ${scales[i][j][1]}) skewX(${skews[i][j]}) rotate(${rotates[i][j]}) translate(${translations[i][j][0]} ${translations[i][j][1]}) translate(${-w/2} ${-w/2})"/>`)
    }
  }
  shuffle(fgRectsArray)
  const fgRects = fgRectsArray.reduce((acc, curr) => acc + curr)
  const rects = bgRect + fgRects
  
  // put it all together
  return html`<svg viewBox="0 0 ${w} ${w}" preserveAspectRatio="xMidYMid slice" class="flex-shrink-0" style="min-width:100%;min-height:100%;filter:saturate(${saturation}%);-webkit-filter:saturate(${saturation}%)">
  <defs>${defs}</defs>
  ${rects}
</svg>`
}
);
  main.variable(observer("randomColors")).define("randomColors", function()
{
  // randomizeColors;
  return [
    "#5135FF", // violet
    "#FF5828", // orangeish
    "#F69CFF", // pink
    "#FFA50F", // mustard
  ]
}
);
  main.variable(observer("n")).define("n", function(){return(
4
)});
  main.variable(observer("settings")).define("settings", function(){return(
{
  numGradientsPerSet: 3,
  scaleMin: 0.67,
  scaleMax: 1.25,
  fociMin: 0.3,
  fociMax: 0.4,
  translateMin: 0,
  translateMax: 0.5,
  skewMax: 45,
}
)});
  main.variable(observer("w")).define("w", function(){return(
3000
)});
  main.variable(observer("saturation")).define("saturation", function(){return(
150
)});
  main.variable(observer("foci")).define("foci", ["makeSet","generateRandomFoci"], function(makeSet,generateRandomFoci){return(
makeSet(generateRandomFoci)
)});
  main.variable(observer("scales")).define("scales", ["makeSet","generateRandomScale"], function(makeSet,generateRandomScale){return(
makeSet(generateRandomScale)
)});
  main.variable(observer("translations")).define("translations", ["makeSet","generateRandomTranslation"], function(makeSet,generateRandomTranslation){return(
makeSet(generateRandomTranslation)
)});
  main.variable(observer("skews")).define("skews", ["makeSet","generateRandomSkew"], function(makeSet,generateRandomSkew){return(
makeSet(generateRandomSkew)
)});
  main.variable(observer("rotates")).define("rotates", ["makeSet","generateRandomRotate"], function(makeSet,generateRandomRotate){return(
makeSet(generateRandomRotate)
)});
  main.variable(observer("makeSet")).define("makeSet", ["n","settings"], function(n,settings){return(
(f) => {
  var outer = []
  for (var i = 0; i < n; i++) {
    var inner = []
    for (var j = 0; j < settings.numGradientsPerSet; j++) {
      inner.push(f())
    }
    outer.push(inner)
  }
  return outer
}
)});
  main.variable(observer("generateRandomFoci")).define("generateRandomFoci", ["random","settings"], function(random,settings){return(
() => [random(settings.fociMin, settings.fociMax), 0.5]
)});
  main.variable(observer("generateRandomScale")).define("generateRandomScale", ["random","settings"], function(random,settings){return(
() => {
  const xScale = random(settings.scaleMin, settings.scaleMax)
  const yScale = random(settings.scaleMin, settings.scaleMax)
  return [xScale, yScale]
}
)});
  main.variable(observer("generateRandomTranslation")).define("generateRandomTranslation", ["random","settings","w","randomSign"], function(random,settings,w,randomSign){return(
() => {
  const xTrans = random(settings.translateMin, settings.translateMax) * w * randomSign()
  const yTrans = random(settings.translateMin, settings.translateMax) * w * randomSign()
  return [xTrans, yTrans]
}
)});
  main.variable(observer("generateRandomSkew")).define("generateRandomSkew", ["random","settings"], function(random,settings){return(
() => random(-settings.skewMax, settings.skewMax)
)});
  main.variable(observer("generateRandomRotate")).define("generateRandomRotate", ["random"], function(random){return(
() => random(0, 360)
)});
  main.variable(observer("shuffle")).define("shuffle", function(){return(
(a) => {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
)});
  main.variable(observer("random")).define("random", function(){return(
(min, max) => {
  return (Math.random() * (max - min)) + min;
}
)});
  main.variable(observer("randomSign")).define("randomSign", function(){return(
() => {
  return Math.random() < 0.5 ? -1 : 1;
}
)});
  return main;
}
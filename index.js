document.addEventListener('DOMContentLoaded', ()=>{
    initCanvas();
    enableMark = false;
    enableLine = false;
    defaultColor = "#000000";
    lining = false;
    lineWidth = 2;
    lineColor = defaultColor;
    path = {
      from: {
        x: 0,
        y: 0
      },
      to:{
        x:0,
        y:0
      }
    }
    image = null;
    document.getElementById('picked-color-code').innerText = defaultColor;
    document.getElementById('enable-dot').innerText = enableMark;
    document.getElementById('enable-line').innerText = enableLine;
    document.getElementById('line-width').innerText = lineWidth;
    document.getElementById('line-color').style.backgroundColor = lineColor;
    document.getElementById('line-color-code').innerText = lineColor;
    document.getElementById("imgInp").addEventListener('change', (e)=>{
        image = e.target;
        readURL(image);
    })

    document.getElementById("myCanvas").addEventListener('click', (e)=>{
        getPixelData(e);
        if (enableMark){
          mark(e);
          markCoord(e);
        }
        if(enableLine){
          if(!lining){
            lining = true;
            path.from = translatePos(e);
          }else{
            path.to = translatePos(e);
            drawLine(e.target, path.from, path.to, lineWidth,lineColor);
            lining = false;
          }
        }
    })
})

function initCanvas(){
    var c = setCanvasWidthtHeight();
    let ctx = c.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, c.getAttribute('width'), c.getAttribute("height"));
}

function setCanvasWidthtHeight(){
    var c = document.getElementById("myCanvas");
    var nav = document.getElementById('nav');
    var navHeight = parseInt(window.getComputedStyle(nav).height.split('px')[0]);
    let width = document.documentElement.clientWidth,
        height = document.documentElement.clientHeight - navHeight - 10;
    c.setAttribute('width',width);
    c.setAttribute('height',height);
    return c;
}

function drawLine(canvas, fromCanvasPos, toCanvasPos, lineWidth=2, strokeStyle='black'){
   var ctx = canvas.getContext('2d');
   ctx.moveTo(fromCanvasPos.x, fromCanvasPos.y);
   ctx.lineTo(toCanvasPos.x, toCanvasPos.y);
   ctx.strokeStyle = strokeStyle;
   ctx.lineWidth = lineWidth;
   ctx.stroke();
}

function translatePos(e){
  let x = e.clientX, y = e.clientY;
  var canvas = e.target;
  let actualX = x - canvas.offsetLeft + window.scrollX,
      actualY = y - canvas.offsetTop + window.scrollY;
  return {x: actualX, y: actualY};
}

function toggleDot(){
  enableMark = !enableMark;
  document.getElementById('enable-dot').innerText = enableMark;
}

function toggleLine(){
  enableLine = !enableLine;
  document.getElementById('enable-line').innerText = enableLine;
}

function mark(e){
  var pos = translatePos(e);
  var canvas = e.target;
  var ctx = canvas.getContext("2d");
  ctx.strokeStyle = 'blue';
  ctx.strokeRect(pos.x,pos.y,1,1);
  console.log(pos.x, pos.y);
}

function unmark(e){
  var x = parseInt(e.target.parentNode.innerText.replace(/[^\d,]/g,'').split(',')[0]);
  var y = parseInt(e.target.parentNode.innerText.replace(/[^\d,]/g,'').split(',')[1]);
  var canvas = document.getElementById("myCanvas");
  var ctx = canvas.getContext("2d");
  ctx.fillStyle = 'white';
  ctx.fillRect(x-1,y-1,3,3);
}

function markCoord(e){
  //span 其實在絕對的位置，但他的text是canvas內相對的座標
  let x = e.clientX, y = e.clientY;
  var displayPos = translatePos(e);

  s = document.createElement('span');
  s.classList.add('coord');
  s.style.left = `${x}px`;
  s.style.top = `${y-30}px`;
  s.innerText =`(${displayPos.x}, ${displayPos.y})`;
  var deleteElement = document.createElement('span');
  deleteElement.classList.add('delete');
  deleteElement.innerText="X";
  deleteElement.addEventListener('click', (e)=>{deleteCoord(e)})
  s.appendChild(deleteElement);

  document.body.append(s);
}

function deleteCoord(e){
  unmark(e);
  e.target.parentNode.remove();
}

function getPixelData(e)
{
  var pos = translatePos(e);
  var canvas = e.target;
  var ctx = canvas.getContext("2d");
  var imageData=ctx.getImageData(pos.x,pos.y,1,1); //posx, poxy ,width, height?
  var pixel = imageData.data;
  var hex = "#" + ("000000" + rgbToHex(pixel[0], pixel[1], pixel[2])).slice(-6);
  var color = document.getElementById('picked-color');
  var colorCode = document.getElementById('picked-color-code');
  color.style.backgroundColor = hex;
  colorCode.innerText = hex;
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function reset(){
  window.location.href = window.location.href;
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            var temp_img = new Image(); //這是另一招
            temp_img.onload = () => {
              // console.log(temp_img.naturalWidth + 'x' + temp_img.naturalHeight);
              var c = document.getElementById("myCanvas");
              c.setAttribute('width',temp_img.naturalWidth);
              c.setAttribute('height',temp_img.naturalHeight);

              var ctx = c.getContext("2d");
              ctx.drawImage(temp_img, 0, 0, temp_img.naturalWidth, temp_img.naturalHeight);
            }
            temp_img.src = e.target.result;
        }
        reader.readAsDataURL(input.files[0]);
    }
}

const copyToClipboard = () => {
  const el = document.createElement('textarea');
  el.value = document.getElementById('picked-color-code').innerText;
  alert(`已複製 ${el.value}`);
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};
document.addEventListener('click',(e)=>{
    // console.log('From document:',e.clientX, e.clientY);
})
document.addEventListener('DOMContentLoaded', ()=>{
    setUpCanvas();

    document.getElementById("imgInp").addEventListener('change', (e)=>{
        readURL(e.target);
    })
    // var c = document.getElementById("myCanvas");
    // var ctx=c.getContext("2d");
    // ctx.fillStyle="red";
    // ctx.fillRect(10,10,50,50);

    document.getElementById("myCanvas").addEventListener('click', (e)=>{
        mark(e);
        getPixelData(e);
    })
})

function setUpCanvas(){
    var c = document.getElementById("myCanvas");
    c.setAttribute('width',window.innerWidth);
    c.setAttribute('height',window.innerHeight);
}
function translatePos(e){
  let x = e.clientX, y = e.clientY;
  var canvas = e.target;
  let actualX = x - canvas.offsetLeft + window.scrollX,
      actualY = y - canvas.offsetTop + window.scrollY;
  return {x: actualX, y: actualY};
}
function mark(e){
  var pos = translatePos(e);
  var canvas = e.target;
  var ctx = canvas.getContext("2d");
  console.log(pos.x,pos.y)
  ctx.strokeRect(pos.x,pos.y,1,1);
  markCoord(e);
}

function markCoord(e){
  var pos = translatePos(e);
  var s = document.createElement('span');
  s.style.position = 'absolute';
  s.style.left = `${pos.x}px`;
  s.style.top = `${pos.y}px`;
  s.innerText =`(${pos.x}, ${pos.y})`;
  document.body.append(s);
}

function getPixelData(e)
{
  var pos = translatePos(e);
  var canvas = e.target;
  var ctx = canvas.getContext("2d");
  var imageData=ctx.getImageData(pos.x,pos.y,1,1); //posx, poxy ,width, height?
  var pixel = imageData.data;
  var hex = "#" + ("000000" + rgbToHex(pixel[0], pixel[1], pixel[2])).slice(-6);
  console.log(hex);
}

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            // Canvas drawImage支援 HTMLImageElement(<img src='...'>)或是用Image new出的物件
            // var img = document.getElementById('img-upload');
            // img.src = e.target.result;
            // var temp_img = document.createElement("img"); //這是一招
            var temp_img = new Image(); //這是另一招
            temp_img.onload = () => {
            //   console.log(this.)
              alert(temp_img.naturalWidth + 'x' + temp_img.naturalHeight);
              var c = document.getElementById("myCanvas");
              var ctx=c.getContext("2d");
              ctx.drawImage(temp_img, 10, 10, temp_img.naturalWidth, temp_img.naturalHeight);
              console.log('drew');
            }
            temp_img.src = e.target.result;

        }

        reader.readAsDataURL(input.files[0]);
    }
}
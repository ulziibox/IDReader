const realFileBtn = document.getElementById("real-file");
const customBtn = document.getElementById("upload-button");
const customTxt = document.getElementById("upload-text");

customBtn.addEventListener("click", function() {
  document.getElementById("real-file").click();
});

realFileBtn.addEventListener("change", function() {
  if (realFileBtn.value) {
    customTxt.innerHTML = realFileBtn.value.match(
      /[\/\\]([\w\d\s\.\-\(\)]+)$/
    )[1];
  }
});

// cropperjs

var canvas = $("#canvas"),
  context = canvas.get(0).getContext("2d");

$("#real-file").on("change", function(e) {
  document.getElementById("btnCrop").style.display = "inline";
  document.getElementById("upload-button").remove();
  if (e.target.files && e.target.files[0]) {
    if (e.target.files[0].type.match(/^image\//)) {
      var reader = new FileReader();
      reader.onload = function(evt) {
        var img = new Image();
        img.onload = function() {
          context.canvas.height = img.height;
          context.canvas.width = img.width;
          context.drawImage(img, 0, 0);
          var cropper = canvas.cropper({
            aspectRatio: 9.5 / 2.6
          });
          $("#btnCrop").click(function() {
            document.getElementById("reader").remove();
            document.getElementById("loading").style.display = "block";

            // Get a string base 64 data url
            var croppedImageDataURL = canvas
              .cropper("getCroppedCanvas")
              .toDataURL("image/png");
            // $result.append($("<img>").attr("src", croppedImageDataURL));

            recognizeFile(croppedImageDataURL, img.src);
          });
        };
        img.src = evt.target.result;
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      alert("Invalid file type! Please select an image file.");
    }
  } else {
    alert("No file(s) selected.");
  }
});

function progressUpdate(packet, oldImg) {
  $result = $("#resultImg");
  if (packet.status == "done"&& packet.data.text.match(/[А-Я][А-Я]\d\d\d\d\d\d\d\d/g)) {
    document.getElementById("loading").remove();
    document.getElementById("result").style.display = "block";
    $result.append($("<img>").attr("src", oldImg));
    let idData = dataGenerator(packet.data.text);
    document.getElementById("data").innerHTML = `<h5>Регистр</h5>
    <p>${packet.data.text}</p>
    <h5>Төрсөн аймаг</h5>
    <p>${idData.bornIn}</p>
    <h5>Төрсөн он сар өдөр</h5>
    <p>${idData.birthDay}</p>
    <h5>Нас</h5>
    <p>${idData.age}</p>
    <h5>Хүйс</h5>
    <p>${idData.sex}</p>`;
    // document.getElementById("resultImg").style.display = "block";
    console.log(packet.data.text);
  }
  else {console.log("error"); console.log(packet.data.text);}
}
function recognizeFile(file, oldImg) {
  const corePath =
    window.navigator.userAgent.indexOf("Edge") > -1
      ? "tesseract.js-core/tesseract-core.asm.js"
      : "tesseract.js-core/tesseract-core.wasm.js";
  const { TesseractWorker } = Tesseract;
  const worker = new TesseractWorker({
    corePath
  });
  worker.recognize(file, "mon+eng").then(function(data) {
    // console.log(data);
    progressUpdate({ status: "done", data: data }, oldImg);
  });
}

function loveCount() {
  let btn = document.getElementById("loveBtn");
  let count = document.getElementById("loveCount");
  let love = 200;

  btn.style.opacity = "1";
  count.innerHTML = love + 1;
}

function restartOcr() {
  window.location.reload(true);
}

function dataGenerator(b) {
  let t;
  switch (b.charAt(0)) {
    case "А":
      t = `Архангай`;
      break;
    case "Б":
      t = `Баян-Өлгий`;
      break;
    case "В":
      t = `Баянхонгор`;
      break;
    case "Г":
      t = `Булган`;
      break;
    case "Д":
      t = `Говь-Алтай`;
      break;
    case "Е":
      t = `Дорноговь`;
      break;
    case "Ж":
      t = `Дорнод`;
      break;
    case "З":
      t = `Дундговь`;
      break;
    case "И":
      t = `Завхан`;
      break;
    case "Й":
      t = `Өвөрхангай`;
      break;
    case "К":
      t = `Өмнөговь`;
      break;
    case "Л":
      t = `Сүхбаатар`;
      break;
    case "М":
      t = `Сэлэнгэ`;
      break;
    case "Н":
      t = `Төв`;
      break;
    case "О":
      t = `Увс`;
      break;
    case "П":
      t = `Ховд`;
      break;
    case "Р":
      t = `Хөвсгөл`;
      break;
    case "С":
      t = `Хэнтий`;
      break;
    case "Т":
      t = `Дархан-Уул`;
      break;
    case "Ф":
      t = `Орхон`;
      break;
    case "Х":
      t = `Говьсүмбэр`;
      break;
    case "У":
      t = `Улаанбаатар`;
      break;
  }
  if ((parseInt(b[4]) * 10 + parseInt(b[5])) < 13) {
    y=1900+parseInt(b[2])*10+parseInt(b[3]);
    m = b[4]+b[5];
  } else if ((parseInt(b[4]) * 10 + parseInt(b[5]) > 12)&&(parseInt(b[4]) * 10 + parseInt(b[5]) < 30)){
    y=2000+parseInt(b[2])*10+parseInt(b[3]);
    m = '0'+b[5];
  }
  else if ((parseInt(b[4]) * 10 + parseInt(b[5])) < 32){
    y=2000+parseInt(b[2])*10+parseInt(b[3]);
    m = '1'+b[5];
  }
  d = b[6] + b[7];
  if (parseInt(b[8]) % 2 == 0) {
    h = `Эмэгтэй`;
  } else {
    h = `Эрэгтэй`;
  }
  glg = new Date();
  gl = new Date(y, m, d);

  return {
    bornIn: t,
    age: Math.floor((glg - gl) / 1000 / 3600 / 24 / 365.25),
    birthDay: `${y}/${m}/${d}`,
    sex: h
  };
}

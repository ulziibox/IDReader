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
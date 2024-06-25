const form = document.querySelector("#form");
const card = document.querySelector("#card");
const photoInput = form.querySelector("#photo");
const canvasBackground = document.querySelector("#canvas-bg");
const canvasText = document.querySelector("#canvas-data");
const canvasPhoto = document.querySelector("#canvas-photo");
const canvasTexture = document.querySelector("#canvas-texture");
const downloadLink = document.querySelector("a[download]");
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const initCardBackground = () => {
  const { width, height } = canvasBackground;
  const ctx = canvasBackground.getContext("2d");
  const background = new Image();
  background.src = "./card.png";

  background.onload = () => {
    ctx.drawImage(background, 0, 0, width, height);
  };
};

const initCardText = (data) => {
  const { name, birthDate, debutDate } = data;
  const { width, height } = canvasText;
  const ctx = canvasText.getContext("2d");
  ctx.clearRect(0, 0, width, height);

  ctx.fillStyle = "#000";
  ctx.font = "bold 98px 'Courier Prime', monospace";
  ctx.fillText(name.toUpperCase(), 1866, 476, 583);

  ctx.letterSpacing = "-1px";
  ctx.fillText(
    `${
      months[birthDate.getMonth()]
    } ${birthDate.getDay()},${birthDate.getFullYear()}`,
    1820,
    616
  );
  ctx.fillText(
    `${
      months[debutDate.getMonth()]
    } ${debutDate.getDay()},${debutDate.getFullYear()}`,
    1819,
    795
  );

  ctx.font = "normal 117px 'Nothing You Could Do', cursive";
  ctx.fillText(name.toUpperCase(), 1633, 1539, 723);
};

const initPhotoCanvas = (e) => {
  const ctx = canvasPhoto.getContext("2d");
  const img = e.currentTarget;

  ctx.filter = "grayscale(1)";
  ctx.drawImage(img, 215, 425, 890, 1020);
  URL.revokeObjectURL(img.src);
};

const initPhotoTexture = (e) => {
  const ctx = canvasTexture.getContext("2d");
  const texture = new Image();
  texture.src = "./texture.png";
  texture.onload = () => {
    ctx.filter = "brightness(16.5)";
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.05;
    ctx.drawImage(texture, 215, 425, 890, 1020);
  };
};

const onPhotoInput = (e) => {
  const file = e.target.files[0];
  const image = new Image();
  image.src = URL.createObjectURL(file);
  image.onload = (e) => {
    initPhotoCanvas(e);
    initPhotoTexture(e);
  };
};

const mergeCanvases = () => {
  const canvasMerged = document.createElement("canvas");
  canvasMerged.width = canvasBackground.width;
  canvasMerged.height = canvasBackground.height;

  const ctx = canvasMerged.getContext("2d");
  ctx.drawImage(canvasBackground, 0, 0);
  ctx.drawImage(canvasText, 0, 0);
  ctx.drawImage(canvasPhoto, 0, 0);
  ctx.drawImage(canvasTexture, 0, 0);

  const mergedDataURL = canvasMerged.toDataURL("image/jpg");

  return mergedDataURL;
};

const showCard = (data) => {
  initCardBackground();
  initCardText(data);

  const cardUrl = mergeCanvases();
  const image = new Image();
  image.src = cardUrl;

  image.onload = () => {
    const prevImage = card.querySelector("img");
    prevImage && prevImage.remove();
    card.append(image);
    downloadLink.href = cardUrl;
    card.style.visibility = "visible";
    card.scrollIntoView({ behavior: "smooth" });
  };
};

const handleSubmit = async (e) => {
  e.preventDefault();

  const { currentTarget } = e;
  const name = currentTarget.name.value;
  const birthDate = new Date(currentTarget.birth.value);
  const debutDate = new Date(currentTarget.debut.value);

  showCard({ name, birthDate, debutDate });
};

form.addEventListener("submit", handleSubmit);
photoInput.addEventListener("change", onPhotoInput);
window.addEventListener("DOMContentLoaded", initCardBackground);

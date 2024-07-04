const form = document.querySelector("#form");
const card = document.querySelector("#card");
const photoInput = form.querySelector("#photo");
const canvasBackground = document.querySelector("#canvas-bg");
const canvasText = document.querySelector("#canvas-data");
const canvasPhoto = document.querySelector("#canvas-photo");
const canvasTexture = document.querySelector("#canvas-texture");
const canvasSignature = document.querySelector("#canvas-signature");
const downloadLink = document.querySelector("a[download]");
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
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

const initCardSignature = (ctx, signature) => {
  const { width, height } = canvasSignature;
  ctx.clearRect(0, 0, width, height);
  ctx.save();
  ctx.fillStyle = "#292929";
  ctx.rotate((-3 * Math.PI) / 180);
  ctx.translate(-150, 125);
  ctx.font = "normal 117px 'Nothing You Could Do', cursive";
  ctx.fillText(signature, 1633, 1539, 723);
  ctx.restore();
};

const initCardText = async (data) => {
  const { name, birthDate, debutDate } = data;
  const { width, height } = canvasText;
  const ctx = canvasText.getContext("2d");
  const signatureCtx = canvasSignature.getContext("2d");

  const birthDateText = `${
    months[birthDate.getMonth()]
  } ${birthDate.getDate()}, ${birthDate.getFullYear()}`;
  const debutDateText = `${
    months[debutDate.getMonth()]
  } ${debutDate.getDate()}, ${debutDate.getFullYear()}`;

  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#292929";

  ctx.font = "bold 98px monospace";
  ctx.fillText(name.toUpperCase(), 1866, 476, 583);
  ctx.fillText(birthDateText, 1820, 616);
  ctx.fillText(debutDateText, 1819, 795);
  ctx.font = "normal 117px cursive";
  ctx.fillText(name.toUpperCase(), 1633, 1539, 723);

  try {
    await Promise.all([
      document.fonts.load(
        "98px 'Courier Prime'",
        name + birthDateText + debutDateText
      ),
      document.fonts.load("117px 'Nothing You Could Do'", name),
    ]);

    ctx.clearRect(0, 0, width, 900);
    ctx.font = "98px 'Courier Prime', monospace";
    ctx.fillText(name.toUpperCase(), 1866, 476, 583);
    ctx.fillText(birthDateText, 1820, 616);
    ctx.fillText(debutDateText, 1819, 795);

    ctx.clearRect(0, 1400, width, height);
    initCardSignature(signatureCtx, name.toUpperCase());
  } catch (error) {
    console.log(error);
  }
};

const initPhotoCanvas = (e) => {
  const ctx = canvasPhoto.getContext("2d");
  const img = e.currentTarget;

  ctx.filter = "grayscale(1)";
  ctx.drawImage(img, 215, 423, 890, 1022);
  const imageData = ctx.getImageData(215, 423, 890, 1022);
  const { data } = imageData;
  const { length } = data;
  const amount = 1;

  for (let i = 0; i < length; i += 4) {
    const luma = data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722;
    data[i + 0] += (luma - data[i + 0]) * amount;
    data[i + 1] += (luma - data[i + 1]) * amount;
    data[i + 2] += (luma - data[i + 2]) * amount;
  }

  ctx.putImageData(imageData, 215, 423);
  URL.revokeObjectURL(img.src);
};

const initPhotoTexture = (e) => {
  const { width, height } = canvasTexture;
  const ctx = canvasTexture.getContext("2d");
  const texture = new Image();
  texture.src = "./texture.png";
  texture.onload = () => {
    ctx.filter = "brightness(16.5) grayscale(1)";
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.05;

    for (let x = 215; x <= 815; x = x + 300) {
      for (let y = 423; y <= 1383; y = y + 160) {
        ctx.drawImage(texture, x, y, 300, 160);
      }
    }

    ctx.clearRect(1105, 0, width, height);
    ctx.clearRect(0, 1445, width, height);
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
  ctx.drawImage(canvasSignature, 0, 0);

  const mergedDataURL = canvasMerged.toDataURL("image/jpeg", 0.6);

  return mergedDataURL;
};

const showCard = async (data) => {
  initCardBackground();
  await initCardText(data);

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

  await showCard({ name, birthDate, debutDate });
};

form.addEventListener("submit", handleSubmit);
photoInput.addEventListener("change", onPhotoInput);
window.addEventListener("DOMContentLoaded", initCardBackground);

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
  ctx.fillStyle = "#222";

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
  ctx.drawImage(img, 215, 423, 890, 1020);
  URL.revokeObjectURL(img.src);
};

const initPhotoTexture = (e) => {
  const { width, height } = canvasTexture;
  const ctx = canvasTexture.getContext("2d");
  const texture = new Image();
  texture.src = "./texture.png";
  texture.onload = () => {
    ctx.filter = "brightness(16.5)";
    ctx.globalCompositeOperation = "screen";
    ctx.globalAlpha = 0.05;
    // ctx.drawImage(texture, 215, 423, 890, 1020);

    ctx.fillStyle = "red";
    ctx.drawImage(texture, 215, 423, 300, 160);
    ctx.drawImage(texture, 515, 423, 300, 160);
    ctx.drawImage(texture, 815, 423, 300, 160);

    ctx.drawImage(texture, 215, 583, 300, 160);
    ctx.drawImage(texture, 515, 583, 300, 160);
    ctx.drawImage(texture, 815, 583, 300, 160);

    ctx.drawImage(texture, 215, 743, 300, 160);
    ctx.drawImage(texture, 515, 743, 300, 160);
    ctx.drawImage(texture, 815, 743, 300, 160);

    ctx.drawImage(texture, 215, 903, 300, 160);
    ctx.drawImage(texture, 515, 903, 300, 160);
    ctx.drawImage(texture, 815, 903, 300, 160);

    ctx.drawImage(texture, 215, 1063, 300, 160);
    ctx.drawImage(texture, 515, 1063, 300, 160);
    ctx.drawImage(texture, 815, 1063, 300, 160);

    ctx.drawImage(texture, 215, 1223, 300, 160);
    ctx.drawImage(texture, 515, 1223, 300, 160);
    ctx.drawImage(texture, 815, 1223, 300, 160);

    ctx.drawImage(texture, 215, 1383, 300, 160);
    ctx.drawImage(texture, 515, 1383, 300, 160);
    ctx.drawImage(texture, 815, 1383, 300, 160);

    ctx.clearRect(1105, 0, width, height);
    ctx.clearRect(0, 1430, width, height);
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

  const mergedDataURL = canvasMerged.toDataURL("image/jpeg", 0.7);

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

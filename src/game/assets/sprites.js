
const spriteFiles = {
  cewekKanan: "cewek/kanan.png",
  cewekKiri: "cewek/kiri.png",
  cewekNormal: "cewek/normal.png",
  cewekSenang: "cewek/senang.png",

  cowokKanan: "cowok/kanan.png",
  cowokKiri: "cowok/kiri.png",
  cowokNormal: "cowok/normal.png",
  cowokSenang: "cowok/senang.png"
};

export function loadHeadSprites() {
  const sprites = {};

  Object.entries(spriteFiles).forEach(([key, file]) => {
    const image = new Image();

    image.onerror = () => {
      console.warn("Gagal memuat sprite:", file);
    };

    image.src =
      `${import.meta.env.BASE_URL}game/characters/${file}`;

    sprites[key] = image;
  });

  return sprites;
}


const spriteFiles = {
  cewekNormal: "cewek/normal.png",
  cewekSenang: "cewek/senang.png",
  cewekKedip: "cewek/kedip.png",
  cewekMalu: "cewek/malu.png",
  cewekSedih: "cewek/sedih.png",
  cewekTerkejut: "cewek/terkejut.png",
  cewekSampingNormal: "cewek/samping-normal.png",
  cewekSampingKedip: "cewek/samping-kedip.png",
  cewekSampingTerkejut: "cewek/samping-terkejut.png",
  cewekSampingSedih: "cewek/samping-sedih.png",
  cewekSampingMalu: "cewek/samping-malu.png",
  cewekSampingSenang: "cewek/samping-senang.png",

  cowokNormal: "cowok/normal.png",
  cowokSenang: "cowok/senang.png",
  cowokKedip: "cowok/kedip.png",
  cowokMalu: "cowok/malu.png",
  cowokSedih: "cowok/sedih.png",
  cowokTerkejut: "cowok/terkejut.png",
  cowokSampingNormal: "cowok/samping-normal.png",
  cowokSampingKedip: "cowok/samping-kedip.png",
  cowokSampingTerkejut: "cowok/samping-terkejut.png",
  cowokSampingSedih: "cowok/samping-sedih.png",
  cowokSampingMalu: "cowok/samping-malu.png",
  cowokSampingSenang: "cowok/samping-senang.png"
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

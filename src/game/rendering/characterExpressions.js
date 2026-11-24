// Nama ekspresi mengikuti nama PNG yang dimuat oleh assets/sprites.js.
export function getCharacterExpression(character, time, {
  role = "player",
  finishStep = null,
  failed = false,
  celebrating = false
} = {}) {
  if (failed) return "Sedih";

  if (["meet", "together", "enter"].includes(finishStep)) return "Malu";
  if (finishStep === "slide" && role === "partner") return "Terkejut";
  if (["slide", "walk", "appear", "celebrate", "done"].includes(finishStep)) return "Senang";

  const airborne = role === "player" && !character.onGround && !character.onLadder;
  if (airborne) return "Terkejut";
  if (celebrating) return "Senang";

  if (Math.abs(character.vx ?? 0) > 0.1 || character.onLadder) {
    return character.facing === "kiri" ? "Kiri" : "Kanan";
  }

  // Waktu kedip kedua karakter berbeda agar tidak selalu serempak.
  const blinkTime = (time + (role === "partner" ? 1100 : 0)) % 4000;
  return blinkTime >= 3600 && blinkTime < 3740 ? "Kedip" : "Normal";
}

export function getCharacterHeadSprite(sprites, kind, character, time, context = {}) {
  const expression = getCharacterExpression(character, time, context);
  const sideFacing = character.facing === "kiri" || character.facing === "kanan";

  if (sideFacing) {
    const sideExpression = expression === "Kanan" || expression === "Kiri" ? "Normal" : expression;
    const expressionImage = sprites[`${kind}Samping${sideExpression}`];
    const loaded = expressionImage?.complete && expressionImage.naturalWidth > 0;
    return {
      // Semua PNG samping menghadap kanan. Netral tetap memakai gambar asli.
      image: loaded ? expressionImage : sprites[`${kind}SampingNormal`],
      flipX: character.facing === "kiri"
    };
  }

  return { image: sprites[`${kind}${expression}`] ?? sprites[`${kind}Normal`] };
}

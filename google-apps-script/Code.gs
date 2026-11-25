// Jalankan setupAlbum sekali dari editor sebelum men-deploy web app.
// Script Properties: DRIVE_FOLDER_ID dan ALBUM_ACCESS_CODE (minimal 12 karakter).
var ALBUM_MAX_BYTES = 8 * 1024 * 1024;
var ALBUM_FILE_PATTERN = /^princess-([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})--(princess|love-strip|scrapbook|royal|birthday-doodle)--([1-4])\.png$/;

function albumFail_(code, message) {
  var error = new Error(message);
  error.albumCode = code;
  throw error;
}

function albumHash_(value) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value, Utilities.Charset.UTF_8)
    .map(function (byte) { return ('0' + ((byte + 256) % 256).toString(16)).slice(-2); }).join('');
}

function setupAlbum() {
  var properties = PropertiesService.getScriptProperties();
  var folderId = properties.getProperty('DRIVE_FOLDER_ID');
  var code = (properties.getProperty('ALBUM_ACCESS_CODE') || '').trim();
  if (!folderId || code.length < 12 || code.length > 128) {
    throw new Error('Isi DRIVE_FOLDER_ID dan ALBUM_ACCESS_CODE sepanjang 12–128 karakter di Script Properties.');
  }
  DriveApp.getFolderById(folderId).getName();
  properties.setProperty('ALBUM_ACCESS_HASH', albumHash_(code));
  properties.deleteProperty('ALBUM_ACCESS_CODE');
  console.log('Album siap. Kode akses sudah diubah menjadi hash dan tidak dicetak ke log.');
}

function albumAuthenticate_(request) {
  var properties = PropertiesService.getScriptProperties();
  var folderId = properties.getProperty('DRIVE_FOLDER_ID');
  var expected = properties.getProperty('ALBUM_ACCESS_HASH');
  if (!folderId || !expected) albumFail_('NOT_CONFIGURED', 'Album kenangan belum dihubungkan.');
  var code = typeof request.code === 'string' ? request.code.trim() : '';
  if (code.length < 12 || code.length > 128) albumFail_('UNAUTHORIZED', 'Kode album belum cocok. Coba periksa lagi.');
  var actual = albumHash_(code);
  var difference = actual.length ^ expected.length;
  for (var i = 0; i < expected.length; i++) difference |= actual.charCodeAt(i) ^ expected.charCodeAt(i);
  if (difference) albumFail_('UNAUTHORIZED', 'Kode album belum cocok. Coba periksa lagi.');
  return DriveApp.getFolderById(folderId);
}

function albumMetadata_(file, thumbnail) {
  var match = ALBUM_FILE_PATTERN.exec(file.getName());
  if (!match || file.getMimeType() !== 'image/png' || file.isTrashed()) return null;
  var result = {
    id: match[1], driveId: file.getId(), name: file.getName(), frame: match[2], count: Number(match[3]),
    createdAt: file.getDateCreated().toISOString(), size: file.getSize()
  };
  if (thumbnail) {
    try {
      var image = file.getThumbnail();
      if (image && /^image\/(png|jpeg|webp)$/.test(image.getContentType())) {
        var bytes = image.getBytes();
        if (bytes.length <= 150 * 1024) result.thumbnail = 'data:' + image.getContentType() + ';base64,' + Utilities.base64Encode(bytes);
      }
    } catch (ignored) { /* Drive mungkin masih menyiapkan thumbnail foto baru. */ }
  }
  return result;
}

function albumUpload_(folder, request) {
  var photo = request.photo || {};
  var name = 'princess-' + photo.id + '--' + photo.frame + '--' + photo.count + '.png';
  if (!ALBUM_FILE_PATTERN.test(name) || typeof photo.base64 !== 'string') albumFail_('INVALID_PHOTO', 'Data foto belum lengkap.');
  if (photo.base64.length > Math.ceil(ALBUM_MAX_BYTES / 3) * 4) albumFail_('TOO_LARGE', 'Ukuran foto melebihi 8 MB.');
  if (!/^[A-Za-z0-9+/]+={0,2}$/.test(photo.base64) || photo.base64.length % 4) albumFail_('INVALID_PHOTO', 'Data foto tidak valid.');
  var bytes = Utilities.base64Decode(photo.base64);
  if (bytes.length > ALBUM_MAX_BYTES) albumFail_('TOO_LARGE', 'Ukuran foto melebihi 8 MB.');
  var signature = [137, 80, 78, 71, 13, 10, 26, 10];
  if (bytes.length < 24 || signature.some(function (byte, index) { return ((bytes[index] + 256) % 256) !== byte; })) {
    albumFail_('INVALID_PHOTO', 'Hanya hasil foto PNG yang bisa disimpan.');
  }
  var lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) albumFail_('BUSY', 'Album sedang menyimpan foto lain. Coba lagi sebentar.');
  try {
    // Nama tetap dan lock mencegah duplikasi ketika koneksi terputus lalu dicoba lagi.
    var existing = folder.getFilesByName(name);
    if (existing.hasNext()) return albumMetadata_(existing.next(), false);
    return albumMetadata_(folder.createFile(Utilities.newBlob(bytes, 'image/png', name)), false);
  } finally { lock.releaseLock(); }
}

function albumList_(folder, request) {
  var offset = Number(request.cursor || 0);
  if (!Number.isInteger(offset) || offset < 0) albumFail_('INVALID_REQUEST', 'Halaman album tidak valid.');
  var iterator = folder.getFilesByType('image/png');
  var files = [];
  while (iterator.hasNext()) {
    var file = iterator.next();
    var metadata = albumMetadata_(file, false);
    if (metadata) files.push({ file: file, metadata: metadata });
  }
  files.sort(function (a, b) {
    return b.metadata.createdAt.localeCompare(a.metadata.createdAt) || b.metadata.id.localeCompare(a.metadata.id);
  });
  var page = files.slice(offset, offset + 12);
  return {
    files: page.map(function (item) { return albumMetadata_(item.file, true); }),
    nextCursor: offset + 12 < files.length ? String(offset + 12) : null
  };
}

function albumRead_(folder, request) {
  if (typeof request.driveId !== 'string' || !/^[A-Za-z0-9_-]{10,200}$/.test(request.driveId)) albumFail_('NOT_FOUND', 'Foto tidak ditemukan.');
  var file;
  try { file = DriveApp.getFileById(request.driveId); }
  catch (ignored) { albumFail_('NOT_FOUND', 'Foto tidak ditemukan.'); }
  var parents = file.getParents();
  var belongs = false;
  while (parents.hasNext()) if (parents.next().getId() === folder.getId()) belongs = true;
  if (!belongs || !albumMetadata_(file, false)) albumFail_('NOT_FOUND', 'Foto tidak ditemukan.');
  if (file.getSize() > ALBUM_MAX_BYTES) albumFail_('TOO_LARGE', 'Foto terlalu besar untuk dibuka di album.');
  return { mimeType: 'image/png', base64: Utilities.base64Encode(file.getBlob().getBytes()), name: file.getName() };
}

function albumJson_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  // GET hanya memberi status layanan. Foto dan kode akses tidak dimasukkan ke URL.
  return albumJson_({ ok: true, data: { service: 'princess-birthday-album', version: 1 } });
}

function doPost(event) {
  try {
    var body = event && event.postData && event.postData.contents;
    if (!body || body.length > Math.ceil(ALBUM_MAX_BYTES / 3) * 4 + 4096) albumFail_('INVALID_REQUEST', 'Permintaan album tidak valid atau terlalu besar.');
    var request;
    try { request = JSON.parse(body); }
    catch (ignored) { albumFail_('INVALID_REQUEST', 'Permintaan album tidak valid.'); }
    if (!request || typeof request !== 'object') albumFail_('INVALID_REQUEST', 'Permintaan album tidak valid.');
    var folder = albumAuthenticate_(request);
    var data;
    if (request.action === 'upload') data = albumUpload_(folder, request);
    else if (request.action === 'list') data = albumList_(folder, request);
    else if (request.action === 'read') data = albumRead_(folder, request);
    else albumFail_('INVALID_REQUEST', 'Permintaan album tidak dikenal.');
    return albumJson_({ ok: true, data: data });
  } catch (error) {
    return albumJson_({ ok: false, error: {
      code: error.albumCode || 'SERVER_ERROR',
      message: error.albumCode ? error.message : 'Album belum bisa dihubungi. Coba lagi sebentar.'
    } });
  }
}

// @ts-check

export const MAX_IMPORT_BYTES = 25 * 1024 * 1024;

/**
 * @param {{name: string, size: number, type?: string}} file
 * @returns {{ok: true} | {ok: false, message: string}}
 */
export function validateImportFileMetadata(file) {
  if (!file.name.toLowerCase().endsWith('.html')) {
    return { ok: false, message: 'Selecione um arquivo HTML exportado pelo Instagram.' };
  }

  if (file.size <= 0) {
    return { ok: false, message: 'O arquivo está vazio.' };
  }

  if (file.size > MAX_IMPORT_BYTES) {
    return { ok: false, message: 'O arquivo excede o limite local de 25 MB.' };
  }

  const type = file.type ?? '';
  if (type && type !== 'text/html' && type !== 'application/xhtml+xml') {
    return { ok: false, message: 'O tipo do arquivo não parece ser HTML.' };
  }

  return { ok: true };
}

// Ayudas para los campos de texto que se guardan como listas o números

// "pollo, arroz" -> ['pollo', 'arroz']
export const toList = (text) => (text || '').split(',').map((item) => item.trim()).filter(Boolean)

// ['pollo', 'arroz'] -> "pollo, arroz"
export const toText = (list) => (list || []).join(', ')

// "" -> undefined, "7" -> 7
export const toNumber = (text) => (text === '' || text === undefined || text === null ? undefined : Number(text))

// 7 -> "7", undefined -> ""
export const numberToText = (value) => (value === undefined || value === null ? '' : String(value))

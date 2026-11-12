// Ayudas para trabajar con los grupos del SMAE

// "Cereales y tubérculos (sin grasa)"
export const groupLabel = (group) => (group.subgroup ? `${group.name} (${group.subgroup.toLowerCase()})` : group.name)

// Mapa groupKey -> grupo, para buscarlos rápido
export const groupsByKey = (groups) => new Map(groups.map((group) => [group.key, group]))

// Kcal de una lista de { groupKey, equivalents }: equivalentes × kcal del grupo
export const getKcal = (items, groups) => {
  const byKey = groupsByKey(groups)
  const total = items.reduce((sum, item) => sum + (item.equivalents || 0) * (byKey.get(item.groupKey)?.energyKcal || 0), 0)
  return Math.round(total)
}

// Cantidad para cierto número de equivalentes: 1 equivalente de arroz = 0.25 taza, 2 = 0.5 taza
export const quantityFor = (suggestedQuantity, equivalents) => Math.round(suggestedQuantity * equivalents * 100) / 100

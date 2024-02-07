export function calculateMinAmount(
  minMarketUmbral: number,
  price: number,
  leverage: number,
  quantityPrecision: number
): string {
  // Calcula el valor nocional mínimo que necesita el usuario para cumplir con el umbral del mercado
  const minNotionalValue = minMarketUmbral * leverage

  // Calcula la cantidad mínima de criptomoneda que representa ese valor nocional mínimo
  let minCryptoAmount = minNotionalValue / price

  // Trunca la cantidad de criptomoneda a X decimales sin redondear hacia arriba
  minCryptoAmount = Math.floor(minCryptoAmount * Math.pow(10, quantityPrecision)) / Math.pow(10, quantityPrecision)

  // Ahora calcula el valor bloqueado (locked value) que resultaría de esa cantidad de criptomoneda
  let lockedValue = (minCryptoAmount * price) / leverage

  const minChunkValue = 1 / Math.pow(10, quantityPrecision)


  // Ajusta la cantidad de criptomoneda hacia arriba si el valor bloqueado es menor que el umbral mínimo del mercado
  while (lockedValue < minMarketUmbral) {
    minCryptoAmount += minChunkValue
    lockedValue = (minCryptoAmount * price) / leverage
  }

  // El valor mínimo en dólares que el usuario necesita invertir es el valor nocional dividido por el apalancamiento
  const minAmountInDollars = (minCryptoAmount * price) / leverage

  // Devuelve este valor mínimo en dólares, asegurándose de que está truncado a dos decimales
  return Math.ceil(minAmountInDollars).toString()
}

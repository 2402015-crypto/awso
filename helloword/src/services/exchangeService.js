import axios from "axios"

const API_URL = "https://api.frankfurter.dev/v1/latest"

export async function obtenerTipoCambio() {
  try {
    const respuesta = await axios.get(API_URL, {
      params: {
        from: "EUR",
        to: "MXN"
      }
    })

    if (!respuesta.data?.rates?.MXN) {
      throw new Error("No se encontró el tipo de cambio en la respuesta")
    }

    return respuesta.data.rates.MXN
  } catch (error) {
    throw new Error(error.message || "No se pudo obtener el tipo de cambio")
  }
}

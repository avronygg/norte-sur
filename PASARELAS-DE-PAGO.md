# Pasarelas de pago en Chile — comparación de comisiones

> Referencia para Norte Sur. Datos de 2026. Las comisiones cambian y varias son
> **negociables según rubro y volumen** → conviene confirmarlas al activar cada cuenta.

## Tabla comparativa

| Pasarela | Crédito | Débito | Transferencia | Costo efectivo aprox. crédito (con IVA) | Abono | Notas |
|---|---|---|---|---|---|---|
| **Transbank Webpay Plus** | 2,35% | 1,75% | — | ~2,35% | 24 h háb. (déb.) / 48 h háb. (créd.) | La más barata en tarjetas. Requiere contrato con Transbank. La tasa se vuelve **dinámica** según tus ventas del mes anterior. |
| **Flow** | 2,89% + IVA | 2,89% + IVA | desde 0,99% + $100 + IVA | **~3,44%** | 24 × 7 | Una sola integración: Webpay + tarjetas + transferencia. Activación rápida. Sin costo fijo, inscripción ni mantención. |
| **Mercado Pago** (Checkout Pro) | 2,89%–3,19% + IVA | igual | igual | **~3,44%** (10 días) / **~3,80%** (al instante) | eliges: al instante o 10 días | Sin costo fijo; solo cobra cuando el pago está acreditado. Nuevos vendedores pagan menos los primeros meses (2,59% / 2,29% + IVA). Bueno si quieres ofrecer cuotas. |
| **Khipu** (solo transferencia) | — | — | 1% + IVA (tope $500/transacción) | **~1,19%** | según banco | Sin tarjeta. Muy barato para montos grandes B2B. Para montos altos conviene el plan por transacción fija (0,0105 UF + IVA). |

> El % de **Flow** y **Mercado Pago** va **+ IVA**, así que el costo real ≈ % × 1,19.
> En **Transbank** el porcentaje mostrado es la comisión del comercio.

## Ejemplo: venta de $100.000 con tarjeta de crédito

| Pasarela | Comisión aprox. |
|---|---|
| Transbank | ~$2.350 |
| Flow | ~$3.440 |
| Mercado Pago (10 días) | ~$3.440 |
| Mercado Pago (al instante) | ~$3.800 |
| Khipu (transferencia) | ~$1.190 |

En una venta grande B2B de **$1.000.000 por transferencia con Khipu**: ~$1.190 (por el tope
de $500 + IVA por transacción; en montos altos conviene el plan por transacción fija).

## Recomendación para Norte Sur (mayorista / industrial)

- **Para partir rápido:** **Flow** — una sola integración con Webpay, tarjetas y
  transferencia; se activa en días. Comisión algo más alta, pero cero fricción.
- **Para bajar el costo de tarjetas a largo plazo:** **Transbank Webpay Plus directo**
  (2,35% / 1,75%), aunque requiere contrato y algo más de trámite.
- **Para las ventas grandes B2B:** sumar **transferencia (Khipu o la de Flow)**, mucho
  más barata que tarjeta y habitual entre empresas.

> El checkout del sitio está hecho "enchufable": se puede **partir con Flow** y agregar
> Transbank / Khipu después sin rehacer nada.

## A tener en cuenta al cobrar de verdad

- **Boleta / factura electrónica (SII):** al vender necesitas emitir documento tributario
  electrónico (integración con el SII o un proveedor: Bsale, Nubox, etc.).
- **Ley del Consumidor (19.496):** precios con IVA incluido, derecho de retracto 10 días,
  garantía legal.

## Fuentes

- Flow — https://web.flow.cl/es-cl/tarifas/
- Mercado Pago Chile — https://www.mercadopago.cl/ayuda/costo-recibir-pagos-dinero_220
- Transbank (tarifas / simulador) — https://publico.transbank.cl/tarifas
- Khipu — https://www.khipu.com/page/tarifas-instantaneos-chile

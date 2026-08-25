import { canalById } from "../../data/canales";

function row(values) {
  return values.map((v) => `<td>${v ?? ""}</td>`).join("");
}

export function buildReportHTML({ clientes, interacciones, casos, guiones, kpis }) {
  const clientesRows = clientes
    .map((c) => `<tr>${row([c.id, c.nombre, c.edad, c.ciudad, c.nivelDigital, canalById(c.canalHabitual).nombre, c.necesidad, c.prioridad, c.estado])}</tr>`)
    .join("");

  const interaccionesRows = interacciones
    .map((i) => {
      const cliente = clientes.find((c) => c.id === i.cliente);
      return `<tr>${row([i.id, cliente ? cliente.nombre : "—", i.fecha, canalById(i.canal).nombre, i.motivo, i.estado, i.siguiente])}</tr>`;
    })
    .join("");

  const casosBlocks = casos
    .map((c) => `<div class="item"><h4>${c.id} · ${c.titulo} <span class="tag">${canalById(c.canal).nombre}</span></h4><p><b>Contexto:</b> ${c.contexto}</p><p><b>Instrucción:</b> ${c.instruccion}</p><p><b>Resultado esperado:</b> ${c.resultado}</p></div>`)
    .join("");

  const guionesBlocks = guiones
    .map((g) => `<div class="item"><h4>${g.titulo} <span class="tag">${canalById(g.canal).nombre}</span></h4><p><b>Saludo:</b> ${g.saludo}</p><p><b>Identificación:</b> ${g.identificacion}</p><p><b>Propósito:</b> ${g.proposito}</p><p><b>Sondeo:</b> ${g.sondeo}</p><p><b>Gestión:</b> ${g.gestion}</p><p><b>Cierre:</b> ${g.cierre}</p></div>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="es"><head><meta charset="UTF-8"><title>Informe CRM Omnicanal</title>
<style>
body{font-family:Arial,Helvetica,sans-serif;color:#111827;max-width:900px;margin:32px auto;padding:0 20px;line-height:1.5;}
h1{font-size:24px;margin-bottom:2px;} h2{font-size:18px;margin-top:36px;border-bottom:2px solid #111827;padding-bottom:6px;}
.sub{color:#6B7280;font-size:13px;margin-bottom:24px;}
.kpis{display:flex;gap:14px;flex-wrap:wrap;margin:16px 0;}
.kpi{border:1px solid #D1D5DB;border-radius:8px;padding:10px 16px;min-width:140px;}
.kpi b{display:block;font-size:22px;}
table{border-collapse:collapse;width:100%;margin-top:10px;font-size:12px;}
th,td{border:1px solid #D1D5DB;padding:6px 8px;text-align:left;}
th{background:#F3F4F6;}
.item{border:1px solid #D1D5DB;border-radius:8px;padding:12px 14px;margin-top:10px;}
.item h4{margin:0 0 8px 0;font-size:14px;}
.tag{font-size:11px;background:#EEF2FF;color:#4338CA;border-radius:999px;padding:2px 8px;margin-left:6px;}
.item p{margin:4px 0;font-size:12.5px;}
footer{margin-top:40px;font-size:11px;color:#9CA3AF;}
@media print{ body{margin:0;} }
</style></head>
<body>
<h1>Informe de operación — CRM Omnicanal</h1>
<div class="sub">Taller: Construcción y Simulación de un CRM para una Operación de Contact Center Omnicanal · Generado ${new Date().toLocaleString("es-CO")}</div>

<h2>1. Resumen ejecutivo</h2>
<div class="kpis">
  <div class="kpi"><b>${kpis.fcr}%</b>FCR (primer contacto)</div>
  <div class="kpi"><b>${kpis.tasaResolucion}%</b>Tasa de resolución</div>
  <div class="kpi"><b>${kpis.tasaEscalamiento}%</b>Tasa de escalamiento</div>
  <div class="kpi"><b>${kpis.total}</b>Interacciones totales</div>
  <div class="kpi"><b>${clientes.length}</b>Clientes registrados</div>
</div>

<h2>2. Base de clientes</h2>
<table><thead><tr><th>ID</th><th>Nombre</th><th>Edad</th><th>Ciudad</th><th>Nivel digital</th><th>Canal habitual</th><th>Necesidad</th><th>Prioridad</th><th>Estado</th></tr></thead><tbody>${clientesRows}</tbody></table>

<h2>3. Bitácora de interacciones</h2>
<table><thead><tr><th>ID</th><th>Cliente</th><th>Fecha</th><th>Canal</th><th>Motivo</th><th>Estado</th><th>Próximo paso</th></tr></thead><tbody>${interaccionesRows}</tbody></table>

<h2>4. Casos de simulación</h2>
${casosBlocks}

<h2>5. Guiones de atención</h2>
${guionesBlocks}

<footer>Documento generado automáticamente desde la consola OmniConsole — Guía 10 · Transferencia de Conocimiento.<br/>Sugerencia: abra este archivo en el navegador y use Imprimir → Guardar como PDF si necesita entregarlo en ese formato.</footer>
</body></html>`;
}

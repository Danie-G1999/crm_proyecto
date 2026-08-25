import { useRef } from "react";
import { Download } from "lucide-react";
import { Card, SectionTitle, GhostBtn, PrimaryBtn } from "../../components/ui";
import { FRect, FDiamond, FPill, FArrow } from "./FlowShapes";

const WIDTH = 900;
const HEIGHT = 1240;

const COLORS = {
  rectFill: "#F3F6FA", rectStroke: "#334155",
  decFill: "#FEF3C7", decStroke: "#D97706",
  pillFill: "#DCFCE7", pillStroke: "#16A34A",
  migFill: "#EDE9FE", migStroke: "#7C3AED",
};

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function FlujoTab() {
  const svgRef = useRef(null);

  const downloadSVG = () => {
    const source = new XMLSerializer().serializeToString(svgRef.current);
    triggerDownload(new Blob([source], { type: "image/svg+xml;charset=utf-8" }), "diagrama_flujo_omnicanal.svg");
  };

  const downloadPNG = () => {
    const source = new XMLSerializer().serializeToString(svgRef.current);
    const svg64 = btoa(unescape(encodeURIComponent(source)));
    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const canvas = document.createElement("canvas");
      canvas.width = WIDTH * scale;
      canvas.height = HEIGHT * scale;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => triggerDownload(blob, "diagrama_flujo_omnicanal.png"));
    };
    img.src = "data:image/svg+xml;base64," + svg64;
  };

  const { rectFill, rectStroke, decFill, decStroke, pillFill, pillStroke, migFill, migStroke } = COLORS;

  return (
    <div>
      <SectionTitle
        eyebrow="Proceso"
        title="Diagrama de flujo de atención"
        desc="Diagrama vectorial tipo draw.io, con conectores y decisiones. Se puede descargar como imagen para anexar al informe."
        action={
          <div style={{ display: "flex", gap: 8 }}>
            <GhostBtn onClick={downloadSVG} Icon={Download}>SVG</GhostBtn>
            <PrimaryBtn onClick={downloadPNG} Icon={Download}>Descargar PNG</PrimaryBtn>
          </div>
        }
      />
      <Card style={{ padding: 12, overflowX: "auto" }}>
        <svg ref={svgRef} viewBox={`0 0 ${WIDTH} ${HEIGHT}`} width={WIDTH} height={HEIGHT} xmlns="http://www.w3.org/2000/svg" style={{ background: "#FFFFFF", borderRadius: 8, display: "block", margin: "0 auto" }}>
          <defs>
            <marker id="arrowhead" markerWidth="9" markerHeight="9" refX="7" refY="4" orient="auto">
              <path d="M0,0 L8,4 L0,8 Z" fill="#334155" />
            </marker>
          </defs>

          <FPill cx={450} cy={35} w={140} h={44} label="Cliente" fill={pillFill} stroke={pillStroke} />
          <FArrow d="M450,57 L450,90" />

          <FRect x={310} y={90} w={280} h={50} lines={["Identificación de necesidad"]} fill={rectFill} stroke={rectStroke} />
          <FArrow d="M450,140 L450,170" />

          <FRect x={310} y={170} w={280} h={50} lines={["Perfilamiento"]} fill={rectFill} stroke={rectStroke} />
          <FArrow d="M450,220 L450,250" />

          <FRect x={310} y={250} w={280} h={50} lines={["Selección de canal"]} fill={rectFill} stroke={rectStroke} />
          <FArrow d="M450,300 L450,330" />

          <FRect x={310} y={330} w={280} h={50} lines={["Inicio de atención"]} fill={rectFill} stroke={rectStroke} />
          <FArrow d="M450,380 L450,410" />

          <FRect x={310} y={410} w={280} h={50} lines={["Clasificación"]} fill={rectFill} stroke={rectStroke} />
          <FArrow d="M450,460 L450,490" />

          <FRect x={310} y={490} w={280} h={50} lines={["Gestión"]} fill={rectFill} stroke={rectStroke} />
          <FArrow d="M450,540 L450,565" />

          <FDiamond cx={450} cy={630} w={230} h={100} lines={["¿Se puede", "resolver?"]} fill={decFill} stroke={decStroke} />

          <FArrow d="M335,630 L150,630 L150,700" label="Sí" labelX={230} labelY={618} />
          <FRect x={40} y={700} w={220} h={54} lines={["Resolver / Cerrar"]} fill={pillFill} stroke={pillStroke} />

          <FArrow d="M565,630 L750,630 L750,700" label="No" labelX={670} labelY={618} />
          <FRect x={640} y={700} w={220} h={54} lines={["Escalar / Seguimiento"]} fill={rectFill} stroke={rectStroke} />

          <FArrow d="M150,754 L150,800 L450,800 L450,825" />
          <FArrow d="M750,754 L750,800 L450,800 L450,825" />

          <FDiamond cx={450} cy={890} w={250} h={100} lines={["¿Necesita", "otro canal?"]} fill={decFill} stroke={decStroke} />

          <FArrow d="M335,890 L150,890 L150,960" label="Sí" labelX={230} labelY={878} />
          <FRect x={40} y={960} w={220} h={54} lines={["Migración de canal"]} fill={migFill} stroke={migStroke} />

          <FArrow d="M575,890 L750,890 L750,1020" label="No" labelX={670} labelY={878} />

          <FArrow d="M150,1014 L150,1045 L450,1045" />
          <FRect x={310} y={1045} w={280} h={54} lines={["Trazabilidad"]} fill={rectFill} stroke={rectStroke} />
          <FArrow d="M750,1020 L750,1072 L590,1072" />

          <FArrow d="M450,1099 L450,1125" />
          <FRect x={310} y={1125} w={280} h={50} lines={["Registro en CRM"]} fill={rectFill} stroke={rectStroke} />
          <FArrow d="M450,1175 L450,1195" />

          <FPill cx={450} cy={1218} w={200} h={44} label="Cierre → Auditoría QA" fill={pillFill} stroke={pillStroke} />
        </svg>
      </Card>
    </div>
  );
}

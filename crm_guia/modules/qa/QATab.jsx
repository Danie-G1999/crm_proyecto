import { useState, useEffect } from "react";
import { Loader2, Check } from "lucide-react";
import { C } from "../../theme/tokens";
import { QA_ITEMS } from "../../data/constants";
import { Card, SectionTitle, PrimaryBtn } from "../../components/ui";
import { getClientes } from "../../services/clientes";
import { api } from "../../lib/api";

// Mapeo de valores de UI a valores aceptados por la validación del Backend
const MAPA_RESPUESTAS_API = {
  "Sí": "SI",
  "No": "NO",
  "N/A": "NA"
};

export function QATab() {
  const [respuestas, setRespuestas] = useState({});
  const [observaciones, setObservaciones] = useState("");
  const [clientes, setClientes] = useState([]);
  const [asesores, setAsesores] = useState([]);
  const [bitacoras, setBitacoras] = useState([]);

  const [formData, setFormData] = useState({
    bitacora_id: "",
    cliente_id: "",
    asesor_id: "",
    supervisor_id: "",
    evaluador_id: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [cliRes, aseRes, bitRes] = await Promise.all([
          getClientes(),
          api.get("/asesores"),
          api.get("/bitacora"),
        ]);

        if (isMounted) {
          setClientes(Array.isArray(cliRes) ? cliRes : cliRes.data || []);
          setAsesores(Array.isArray(aseRes.data) ? aseRes.data : aseRes.data.data || []);
          setBitacoras(Array.isArray(bitRes.data) ? bitRes.data : bitRes.data.data || []);
        }
      } catch (err) {
        if (isMounted) console.error("Error al cargar datos del formulario QA:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const setRespuesta = (idx, val) => setRespuestas((r) => ({ ...r, [idx]: val }));
  const handleSelectChange = (key, val) => setFormData((f) => ({ ...f, [key]: val }));

  const contestadas = Object.keys(respuestas).length;
  const positivas = Object.values(respuestas).filter((v) => v === "Sí").length;
  const score = contestadas ? Math.round((positivas / contestadas) * 100) : null;

  const saveAuditoria = async () => {
    if (
      !formData.bitacora_id ||
      !formData.cliente_id ||
      !formData.asesor_id ||
      !formData.supervisor_id ||
      !formData.evaluador_id
    ) {
      return alert("Por favor complete todos los campos de selección requeridos.");
    }

    if (contestadas < QA_ITEMS.length) {
      return alert("Debe calificar todos los criterios de la lista antes de guardar.");
    }

    setSaving(true);

    const payload = {
      bitacora_id: Number(formData.bitacora_id),
      cliente_id: Number(formData.cliente_id),
      asesor_id: Number(formData.asesor_id),
      supervisor_id: Number(formData.supervisor_id),
      evaluador_id: Number(formData.evaluador_id),
      puntaje_total: score,
      total_evaluados: QA_ITEMS.length,
      observaciones,
      detalles: QA_ITEMS.map((item, idx) => ({
        criterio: item,
        respuesta: MAPA_RESPUESTAS_API[respuestas[idx]] || respuestas[idx],
      })),
    };

    try {
      await api.post("/auditorias-qa", payload);
      alert("Auditoría QA guardada con éxito.");
      setRespuestas({});
      setObservaciones("");
      setFormData({
        bitacora_id: "",
        cliente_id: "",
        asesor_id: "",
        supervisor_id: "",
        evaluador_id: "",
      });
    } catch (err) {
      console.error("Error al guardar la auditoría:", err);
      alert(err.response?.data?.message || "Ocurrió un error al guardar la auditoría.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 40, color: C.muted }}>
        <Loader2 className="animate-spin" style={{ marginRight: 8 }} /> Cargando formulario de QA...
      </div>
    );
  }

  const selectStyle = {
    width: "100%",
    padding: "8px 12px",
    background: C.panelAlt,
    color: C.text,
    border: `1px solid ${C.line}`,
    borderRadius: 6,
    outline: "none",
    fontSize: 13,
  };

  return (
    <div>
      <SectionTitle
        eyebrow="Caso 5 · Auditoría"
        title="Checklist de calidad (QA)"
        desc="Marque cada criterio mientras observa una atención simulada. El puntaje se calcula en vivo."
      />

      <Card style={{ padding: 16, marginBottom: 16, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        <div>
          <label style={{ display: "block", fontSize: 12, color: C.text, marginBottom: 4 }}>
            Bitácora / Sesión <span style={{ color: C.danger }}>*</span>
          </label>
          <select value={formData.bitacora_id} onChange={(e) => handleSelectChange("bitacora_id", e.target.value)} style={selectStyle}>
            <option value="">-- Seleccionar --</option>
            {bitacoras.map((b) => (
              <option key={b.id} value={b.id}>
                # {b.id} - {b.observaciones || `Bitácora #${b.id}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: 12, color: C.text, marginBottom: 4 }}>
            Cliente <span style={{ color: C.danger }}>*</span>
          </label>
          <select value={formData.cliente_id} onChange={(e) => handleSelectChange("cliente_id", e.target.value)} style={selectStyle}>
            <option value="">-- Seleccionar --</option>
            {clientes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nombre || c.nombre_completo || `Cliente #${c.id}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: 12, color: C.text, marginBottom: 4 }}>
            Asesor Evaluado <span style={{ color: C.danger }}>*</span>
          </label>
          <select value={formData.asesor_id} onChange={(e) => handleSelectChange("asesor_id", e.target.value)} style={selectStyle}>
            <option value="">-- Seleccionar --</option>
            {asesores.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre || `Asesor #${a.id}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: 12, color: C.text, marginBottom: 4 }}>
            Supervisor <span style={{ color: C.danger }}>*</span>
          </label>
          <select value={formData.supervisor_id} onChange={(e) => handleSelectChange("supervisor_id", e.target.value)} style={selectStyle}>
            <option value="">-- Seleccionar --</option>
            {asesores.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre || `Supervisor #${a.id}`}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: 12, color: C.text, marginBottom: 4 }}>
            Evaluador <span style={{ color: C.danger }}>*</span>
          </label>
          <select value={formData.evaluador_id} onChange={(e) => handleSelectChange("evaluador_id", e.target.value)} style={selectStyle}>
            <option value="">-- Seleccionar --</option>
            {asesores.map((a) => (
              <option key={a.id} value={a.id}>
                {a.nombre || `Evaluador #${a.id}`}
              </option>
            ))}
          </select>
        </div>
      </Card>

      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <div
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 24,
            fontWeight: 700,
            color: score === null ? C.mutedDim : score >= 70 ? C.ok : score >= 40 ? C.warn : C.danger,
          }}
        >
          {score === null ? "—" : `${score}%`}
        </div>
        <div style={{ fontSize: 12, color: C.muted }}>
          puntaje de cumplimiento ({contestadas}/{QA_ITEMS.length} evaluados)
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {QA_ITEMS.map((item, idx) => (
          <Card key={idx} style={{ padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexDirection: "row" }}>
            <span style={{ fontSize: 13.5, color: C.text }}>{item}</span>
            <div style={{ display: "flex", gap: 6 }}>
              {["Sí", "No", "N/A"].map((opt) => (
                <button
                  key={opt}
                  onClick={() => setRespuesta(idx, opt)}
                  style={{
                    padding: "5px 12px",
                    borderRadius: 8,
                    fontSize: 12,
                    cursor: "pointer",
                    border: `1px solid ${
                      respuestas[idx] === opt ? (opt === "Sí" ? C.ok : opt === "No" ? C.danger : C.mutedDim) : C.line
                    }`,
                    background:
                      respuestas[idx] === opt ? (opt === "Sí" ? C.ok + "1A" : opt === "No" ? C.danger + "1A" : C.panelAlt) : "transparent",
                    color: respuestas[idx] === opt ? (opt === "Sí" ? C.ok : opt === "No" ? C.danger : C.muted) : C.mutedDim,
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </Card>
        ))}
      </div>

      <div style={{ marginTop: 16 }}>
        <label style={{ display: "block", fontSize: 12, color: C.text, marginBottom: 6 }}>Observaciones de la Auditoría</label>
        <textarea
          rows={3}
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          placeholder="Escriba comentarios o retroalimentación técnica..."
          style={{ ...selectStyle, resize: "vertical" }}
        />
      </div>

      <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end" }}>
        <PrimaryBtn onClick={saveAuditoria} Icon={saving ? Loader2 : Check} disabled={saving}>
          {saving ? "Guardando..." : "Guardar Auditoría QA"}
        </PrimaryBtn>
      </div>
    </div>
  );
}
import { useState, useEffect } from "react";
import { Plus, Check, X, Pencil, Trash2, ArrowRight, Calendar } from "lucide-react";
import { C } from "../../theme/tokens";
import { FIELDS_CLIENTE } from "../../data/fields";
import { BLANK_CLIENTE } from "../../data/blanks";
import { estadoTone } from "../../utils/estado";
import { Card, SectionTitle, PrimaryBtn, IconBtn, Pill, Tag, EntityForm } from "../../components/ui";
import { api } from "../../lib/api";

export function ClientesTab() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [creating, setCreating] = useState(false);

  // Estados para controlar el modal de selección de fecha y hora
  const [showPickerModal, setShowPickerModal] = useState(false);
  const [tempDate, setTempDate] = useState("");

  const formatToInputDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";

    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const formatStaticDate = (dateStr) => {
    if (!dateStr) return "Sin registro";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Sin registro";

    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const mapClientesFromApi = (data) =>
    data.map((c) => ({
      id: c.id,
      nombre: `${c.nombre} ${c.apellidos}`.trim(),
      tipoIdentificacion: c.tipo_identificacion || "CEDULA_CIUDADANIA",
      numeroIdentificacion: c.numero_identificacion || "",
      correoElectronico: c.correo_electronico || "",
      edad: c.edad || 0,
      ingresosMensuales: c.ingresos_mensuales || 0,
      ciudad: c.direccion || "",
      nivelDigital: c.nivel_digital || "MEDIO",
      canalHabitual: c.canal_habitual || "TELEFONO",
      campaña: c.campaña || "",
      prioridad: c.prioridad || "MEDIO",
      estado: c.estado || "en_gestion",
      canalInicial: c.canal_inicial || "TELEFONO",
      canalActual: c.canal_actual || "TELEFONO",
      observaciones: c.observaciones || "",
      necesidad: c.observaciones || "Sin observación",
      responsable: c.asesor ? c.asesor.nombre : "Sin asignar",
      asesor_id: c.asesor_id || 1,
      ultimoContacto: formatToInputDate(c.ultimo_contacto),
      ultimoContactoLabel: formatStaticDate(c.ultimo_contacto),
    }));

  const sanitizeCanal = (val) => {
    const valid = ["TELEFONO", "WHATSAPP", "CHAT_WEB", "CORREO_ELECTRONICO", "REDES_SOCIALES"];
    const formatted = String(val || "").toUpperCase().trim();
    return valid.includes(formatted) ? formatted : "TELEFONO";
  };

  const sanitizePrioridad = (val) => {
    const formatted = String(val || "").toUpperCase().trim();
    if (["ALTA", "ALTO"].includes(formatted)) return "ALTO";
    if (["MEDIA", "MEDIO"].includes(formatted)) return "MEDIO";
    if (["BAJA", "BAJO"].includes(formatted)) return "BAJO";
    return "MEDIO";
  };

  const sanitizeNivelDigital = (val) => {
    const formatted = String(val || "").toUpperCase().trim();
    return ["BAJO", "MEDIO", "ALTO"].includes(formatted) ? formatted : "MEDIO";
  };

  const sanitizeEstado = (val) => {
    const valid = ["en_gestion", "resuelto", "cerrado", "escalado", "seguimiento"];
    const formatted = String(val || "").toLowerCase().trim();
    return valid.includes(formatted) ? formatted : "en_gestion";
  };

  const refreshClientes = async () => {
    try {
      const res = await api.get("/clientes");
      setClientes(mapClientesFromApi(res.data));
    } catch (error) {
      console.error("Error al refrescar clientes:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    api
      .get("/clientes")
      .then((res) => {
        if (isMounted) setClientes(mapClientesFromApi(res.data));
      })
      .catch((err) => {
        if (isMounted) console.error("Error al cargar clientes:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const startEdit = (c) => {
    setEditingId(c.id);
    setDraft({ ...c });
    setCreating(false);
  };

  const startCreate = () => {
    setCreating(true);
    setDraft({ ...BLANK_CLIENTE });
    setEditingId(null);
  };

  const cancel = () => {
    setEditingId(null);
    setCreating(false);
    setDraft(null);
  };

  const handleFieldChange = (key, val) => {
    if (key === "ultimoContactoModalTrigger") {
      setTempDate(draft?.ultimoContacto || "");
      setShowPickerModal(true);
      return;
    }
    setDraft((d) => ({ ...d, [key]: val }));
  };

  const applyModalDate = () => {
    setDraft((d) => ({ ...d, ultimoContacto: tempDate }));
    setShowPickerModal(false);
  };

  const save = async () => {
    if (!draft.nombre?.trim()) {
      alert("El nombre es obligatorio.");
      return;
    }

    const nameParts = draft.nombre.trim().split(" ");
    const nombre = nameParts[0] || "Cliente";
    const apellidos = nameParts.slice(1).join(" ") || "Registrado";

    let ultimoContactoIso = null;
    if (draft.ultimoContacto) {
      const parsedDate = new Date(draft.ultimoContacto);
      if (!isNaN(parsedDate.getTime())) {
        ultimoContactoIso = parsedDate.toISOString();
      }
    }

    const payload = {
      tipo_identificacion: draft.tipoIdentificacion || "CEDULA_CIUDADANIA",
      numero_identificacion: String(draft.numeroIdentificacion || `ID-${Date.now()}`),
      nombre: nombre,
      apellidos: apellidos,
      correo_electronico: draft.correoElectronico || null,
      direccion: draft.ciudad || null,
      edad: Number(draft.edad) || null,
      ingresos_mensuales: draft.ingresosMensuales !== "" && draft.ingresosMensuales !== null ? Number(draft.ingresosMensuales) : null,
      nivel_digital: sanitizeNivelDigital(draft.nivelDigital),
      canal_habitual: sanitizeCanal(draft.canalHabitual),
      campaña: draft.campaña || null,
      ultimo_contacto: ultimoContactoIso,
      prioridad: sanitizePrioridad(draft.prioridad),
      estado: sanitizeEstado(draft.estado),
      canal_inicial: sanitizeCanal(draft.canalInicial),
      canal_actual: sanitizeCanal(draft.canalActual),
      asesor_id: draft.asesor_id || 1,
      observaciones: draft.observaciones || draft.necesidad || null,
    };

    try {
      if (creating) {
        await api.post("/clientes", payload);
      } else {
        await api.put(`/clientes/${editingId}`, payload);
      }
      await refreshClientes();
      cancel();
    } catch (error) {
      console.error("Error al guardar cliente:", error.response?.data || error);
      alert("Error de validación al guardar. Revisa la consola.");
    }
  };

  const remove = async (id) => {
    if (window.confirm("¿Eliminar este cliente? Esta acción no se puede deshacer.")) {
      try {
        await api.delete(`/clientes/${id}`);
        setClientes((prev) => prev.filter((c) => c.id !== id));
      } catch (error) {
        console.error("Error al eliminar cliente:", error);
      }
    }
  };

  const filtered = clientes.filter((c) =>
    (c.nombre + c.id + (c.ciudad || "") + (c.campaña || "") + (c.correoElectronico || "")).toLowerCase().includes(q.toLowerCase())
  );

  if (loading) {
    return <div style={{ padding: 20, color: C.text }}>Cargando clientes desde el servidor...</div>;
  }

  return (
    <div>
      <SectionTitle
        eyebrow="Hoja 1"
        title="Base de clientes"
        desc="Cree, edite o elimine clientes sincronizados con Laravel API."
        action={<PrimaryBtn onClick={startCreate} Icon={Plus}>Agregar cliente</PrimaryBtn>}
      />

      <input
        placeholder="Buscar por nombre, ID, ciudad, correo o campaña…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{
          width: "100%",
          padding: "10px 14px",
          borderRadius: 10,
          marginBottom: 16,
          background: C.panelAlt,
          border: `1px solid ${C.line}`,
          color: C.text,
          fontSize: 13,
          outline: "none",
          boxSizing: "border-box"
        }}
      />

      {creating && (
        <Card style={{ marginBottom: 14, borderColor: C.live + "55" }}>
          <div style={{ fontSize: 12, color: C.live, marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>NUEVO CLIENTE</div>
          <EntityForm fields={FIELDS_CLIENTE} value={draft} onChange={handleFieldChange} />
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <PrimaryBtn onClick={save} Icon={Check}>Guardar</PrimaryBtn>
            <IconBtn onClick={cancel} Icon={X} title="Cancelar" />
          </div>
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {filtered.map((c) => (
          editingId === c.id ? (
            <Card key={c.id} style={{ gridColumn: "span 2", borderColor: C.live + "55" }}>
              <div style={{ fontSize: 12, color: C.live, marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>EDITANDO CLI-{c.id}</div>
              <EntityForm fields={FIELDS_CLIENTE} value={draft} onChange={handleFieldChange} />
              <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                <PrimaryBtn onClick={save} Icon={Check}>Guardar cambios</PrimaryBtn>
                <IconBtn onClick={cancel} Icon={X} title="Cancelar" />
              </div>
            </Card>
          ) : (
            <Card key={c.id} style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.mutedDim }}>CLI-{c.id}</div>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: C.text }}>{c.nombre}</div>
                  <div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>
                    {c.edad} años · {c.ciudad || "Sin dirección"} · Nivel digital: {c.nivelDigital}
                  </div>
                  <div style={{ fontSize: 12, color: C.mutedDim, marginTop: 2 }}>
                    ✉ {c.correoElectronico || "Sin correo"}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <Pill tone={estadoTone(c.estado)}>{c.estado}</Pill>
                  <IconBtn onClick={() => startEdit(c)} Icon={Pencil} title="Editar" />
                  <IconBtn onClick={() => remove(c.id)} Icon={Trash2} tone={C.danger} title="Eliminar" />
                </div>
              </div>

              <div style={{ marginTop: 10, fontSize: 12, color: C.text, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <span><strong>Ingresos:</strong> ${Number(c.ingresosMensuales || 0).toLocaleString()}</span>
                <span><strong>Campaña:</strong> {c.campaña || "N/A"}</span>
              </div>

              <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap", alignItems: "center" }}>
                <Tag canalId={c.canalInicial} />
                {c.canalInicial !== c.canalActual && <><ArrowRight size={13} color={C.mutedDim} /><Tag canalId={c.canalActual} /></>}
                <Pill tone={c.prioridad === "ALTO" ? "danger" : c.prioridad === "MEDIO" ? "warn" : "muted"}>Prioridad {c.prioridad}</Pill>
              </div>

              <div style={{ marginTop: 10, fontSize: 12, color: C.mutedDim, lineHeight: 1.5 }}>{c.observaciones}</div>
              
              <div 
                suppressHydrationWarning 
                style={{ marginTop: 8, fontSize: 11.5, color: C.mutedDim, fontFamily: "'IBM Plex Mono', monospace" }}
              >
                {c.responsable} · Último contacto: {c.ultimoContactoLabel}
              </div>
            </Card>
          )
        ))}
        {filtered.length === 0 && !creating && (
          <div style={{ gridColumn: "span 2", color: C.mutedDim, fontSize: 13, padding: 20, textAlign: "center" }}>
            No hay clientes que coincidan con la búsqueda.
          </div>
        )}
      </div>

      {/* MODAL CON TEMA OSCURO PARA FECHA Y HORA */}
      {showPickerModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.6)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 9999
        }}>
          <div style={{
            background: C.panel,
            border: `1px solid ${C.line}`,
            borderRadius: 12,
            padding: 20,
            width: 320,
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12, color: C.text }}>
              <Calendar size={18} color={C.live || C.text} />
              <strong style={{ fontSize: 14 }}>Seleccionar Último Contacto</strong>
            </div>

            <label style={{ fontSize: 12, color: C.muted, display: "block", marginBottom: 6 }}>
              Fecha y Hora:
            </label>
            <input
              type="datetime-local"
              value={tempDate}
              onChange={(e) => setTempDate(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                background: C.panelAlt,
                border: `1px solid ${C.line}`,
                color: C.text,
                fontSize: 13,
                outline: "none",
                boxSizing: "border-box",
                colorScheme: "dark"
              }}
            />

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 18 }}>
              <button
                onClick={() => setShowPickerModal(false)}
                style={{
                  padding: "8px 12px",
                  background: "transparent",
                  border: `1px solid ${C.line}`,
                  color: C.text,
                  borderRadius: 6,
                  cursor: "pointer",
                  fontSize: 12
                }}
              >
                Cancelar
              </button>
              <PrimaryBtn onClick={applyModalDate} Icon={Check}>
                Confirmar
              </PrimaryBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
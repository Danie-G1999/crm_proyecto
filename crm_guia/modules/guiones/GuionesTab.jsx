import { useState, useEffect } from "react";
import { Plus, Check, X, Pencil, Trash2, Loader2 } from "lucide-react";
import { C } from "../../theme/tokens";
import { CANALES } from "../../data/canales";
import { FIELDS_GUION } from "../../data/fields";
import { BLANK_GUION } from "../../data/blanks";
import { Card, SectionTitle, PrimaryBtn, IconBtn, Tag, EntityForm } from "../../components/ui";
import { api } from "../../lib/api";

export function GuionesTab() {
  const [guiones, setGuiones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [filtro, setFiltro] = useState("todos");
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [creating, setCreating] = useState(false);

  // Función independiente para recargar datos tras guardar o eliminar
  const reloadGuiones = async () => {
    try {
      const response = await api.get("/guiones");
      const data = Array.isArray(response.data) ? response.data : response.data.data || [];
      setGuiones(data);
    } catch (err) {
      console.error("Error al recargar guiones:", err);
    }
  };

  // Carga inicial dentro del useEffect sin causar la advertencia del linter
  useEffect(() => {
    let ignore = false;

    async function startFetching() {
      try {
        const response = await api.get("/guiones");
        if (!ignore) {
          const data = Array.isArray(response.data) ? response.data : response.data.data || [];
          setGuiones(data);
        }
      } catch (err) {
        if (!ignore) {
          console.error("Error al obtener guiones:", err);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    startFetching();

    return () => {
      ignore = true;
    };
  }, []);

  const startEdit = (g) => { 
    setEditingId(g.id); 
    setDraft({ ...g }); 
    setCreating(false); 
  };

  const startCreate = () => { 
    setCreating(true); 
    setDraft({ ...BLANK_GUION, canal: filtro !== "todos" ? filtro : "whatsapp" }); 
    setEditingId(null); 
  };

  const cancel = () => { 
    setEditingId(null); 
    setCreating(false); 
    setDraft(null); 
  };

  const change = (key, val) => setDraft((d) => ({ ...d, [key]: val }));

  // Guardar (Crear o Actualizar)
  const save = async () => {
    if (!draft?.titulo?.trim()) {
      return alert("El título es obligatorio.");
    }

    setSaving(true);
    try {
      if (creating) {
        await api.post("/guiones", draft);
      } else {
        await api.put(`/guiones/${editingId}`, draft);
      }
      await reloadGuiones();
      cancel();
    } catch (err) {
      console.error("Error al guardar guion:", err);
      alert(err.response?.data?.message || "Error al guardar el guion.");
    } finally {
      setSaving(false);
    }
  };

  // Eliminar
  const remove = async (id) => {
    if (!window.confirm("¿Está seguro de eliminar este guion?")) return;

    try {
      await api.delete(`/guiones/${id}`);
      setGuiones((prev) => prev.filter((g) => g.id !== id));
    } catch (err) {
      console.error("Error al eliminar guion:", err);
      alert("No se pudo eliminar el guion.");
    }
  };

  const filtrados = filtro === "todos" ? guiones : guiones.filter((g) => g.canal === filtro);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 40, color: C.muted }}>
        <Loader2 className="animate-spin" style={{ marginRight: 8 }} /> Cargando guiones de atención...
      </div>
    );
  }

  return (
    <div>
      <SectionTitle
        eyebrow="Netiqueta aplicada"
        title="Guiones de atención"
        desc="Cree, edite o elimine guiones. Estructura común: saludo, identificación, propósito, sondeo, gestión y cierre."
        action={<PrimaryBtn onClick={startCreate} Icon={Plus}>Agregar guion</PrimaryBtn>}
      />

      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <button
          onClick={() => setFiltro("todos")}
          style={{
            padding: "8px 12px",
            borderRadius: 999,
            border: `1px solid ${filtro === "todos" ? C.live : C.line}`,
            background: filtro === "todos" ? C.live + "1A" : "transparent",
            color: filtro === "todos" ? C.live : C.muted,
            fontSize: 12.5,
            cursor: "pointer",
          }}
        >
          Todos
        </button>
        {CANALES.map((ch) => (
          <button
            key={ch.id}
            onClick={() => setFiltro(ch.id)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "8px 12px",
              borderRadius: 999,
              border: `1px solid ${filtro === ch.id ? ch.color : C.line}`,
              background: filtro === ch.id ? ch.color + "1A" : "transparent",
              color: filtro === ch.id ? ch.color : C.muted,
              fontSize: 12.5,
              cursor: "pointer",
            }}
          >
            <ch.Icon size={13} /> {ch.nombre}
          </button>
        ))}
      </div>

      {creating && (
        <Card style={{ marginBottom: 14, borderColor: C.live + "55" }}>
          <div style={{ fontSize: 12, color: C.live, marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>NUEVO GUION</div>
          <EntityForm fields={FIELDS_GUION} value={draft} onChange={change} columns={2} />
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <PrimaryBtn onClick={save} Icon={saving ? Loader2 : Check} disabled={saving}>
              {saving ? "Guardando..." : "Guardar"}
            </PrimaryBtn>
            <IconBtn onClick={cancel} Icon={X} title="Cancelar" disabled={saving} />
          </div>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filtrados.map((g) => {
          const c = CANALES.find((ch) => ch.id === g.canal) ?? CANALES[0];
          if (editingId === g.id) {
            return (
              <Card key={g.id} style={{ borderColor: C.live + "55" }}>
                <div style={{ fontSize: 12, color: C.live, marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>EDITANDO #{g.id}</div>
                <EntityForm fields={FIELDS_GUION} value={draft} onChange={change} columns={2} />
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <PrimaryBtn onClick={save} Icon={saving ? Loader2 : Check} disabled={saving}>
                    {saving ? "Guardando..." : "Guardar cambios"}
                  </PrimaryBtn>
                  <IconBtn onClick={cancel} Icon={X} title="Cancelar" disabled={saving} />
                </div>
              </Card>
            );
          }
          return (
            <Card key={g.id}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <c.Icon size={16} color={c.color} />
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: C.text }}>{g.titulo}</span>
                </div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <Tag canalId={g.canal} />
                  <IconBtn onClick={() => startEdit(g)} Icon={Pencil} title="Editar" />
                  <IconBtn onClick={() => remove(g.id)} Icon={Trash2} tone={C.danger} title="Eliminar" />
                </div>
              </div>
              {[
                ["Saludo", g.saludo],
                ["Identificación", g.identificacion],
                ["Propósito", g.proposito],
                ["Sondeo", g.sondeo],
                ["Gestión", g.gestion],
                ["Cierre", g.cierre],
              ].map(([k, v]) => (
                <div key={k} style={{ display: "flex", gap: 14, padding: "10px 0", borderTop: `1px solid ${C.line}` }}>
                  <div style={{ width: 110, flexShrink: 0, fontSize: 11.5, color: C.mutedDim, fontFamily: "'IBM Plex Mono', monospace", paddingTop: 2 }}>
                    {k.toUpperCase()}
                  </div>
                  <div style={{ fontSize: 13.5, color: C.text, lineHeight: 1.5 }}>{v || "—"}</div>
                </div>
              ))}
            </Card>
          );
        })}
        {filtrados.length === 0 && !creating && (
          <div style={{ color: C.mutedDim, fontSize: 13, padding: 20, textAlign: "center" }}>
            No hay guiones registrados para este canal.
          </div>
        )}
      </div>
    </div>
  );
}
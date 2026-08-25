import { useEffect, useState } from "react";
import { Plus, Check, X, Pencil, Trash2, User } from "lucide-react";
import { C } from "../../theme/tokens";
import { Card, SectionTitle, PrimaryBtn, IconBtn, EntityForm } from "../../components/ui";
import { api } from "../../lib/api";

export function ReflexionTab() {
  const [reflexiones, setReflexiones] = useState([]);
  const [asesores, setAsesores] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados para creación y edición
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);

  const fetchInitialData = async () => {
    const [resAsesores, resReflexiones] = await Promise.allSettled([
      api.get("/asesores"),
      api.get("/reflexiones"),
    ]);

    let loadedAsesores = [];
    let loadedReflexiones = [];

    if (resAsesores.status === "fulfilled") {
      const data = resAsesores.value.data;
      loadedAsesores = Array.isArray(data) ? data : (data?.data || []);
    }

    if (resReflexiones.status === "fulfilled") {
      const data = resReflexiones.value.data;
      loadedReflexiones = Array.isArray(data) ? data : (data?.data || []);
    }

    return { loadedAsesores, loadedReflexiones };
  };

  // Carga inicial segura para evitar ejecuciones de setState síncronas en el efecto
  useEffect(() => {
    let active = true;

    fetchInitialData()
      .then(({ loadedAsesores, loadedReflexiones }) => {
        if (active) {
          setAsesores(loadedAsesores);
          setReflexiones(loadedReflexiones);
        }
      })
      .catch((error) => {
        console.error("Error al cargar los datos:", error);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const refreshData = async () => {
    try {
      const { loadedAsesores, loadedReflexiones } = await fetchInitialData();
      setAsesores(loadedAsesores);
      setReflexiones(loadedReflexiones);
    } catch (error) {
      console.error("Error al recargar los datos:", error);
    }
  };

  const formatStaticDate = (dateStr) => {
    if (!dateStr) return "Sin fecha";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Sin fecha";
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  // Campos para el formulario dinámico
  const fieldsReflexion = [
    {
      key: "asesor_id",
      label: "Asesor",
      type: "select",
      options: [
        { value: "", label: "-- Seleccionar Asesor --" },
        ...asesores.map((a) => ({
          value: a.id,
          label: `${a.nombre || a.name || ""} ${a.apellidos || ""}`.trim() || `Asesor #${a.id}`,
        })),
      ],
      w: 2,
    },
    {
      key: "reflexion",
      label: "Reflexión",
      type: "textarea",
      placeholder: "Escriba aquí su reflexión individual...",
      w: 2,
    },
  ];

  const startCreate = () => {
    setCreating(true);
    setEditingId(null);
    setDraft({
      asesor_id: asesores[0]?.id || "",
      reflexion: "",
    });
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setCreating(false);
    setDraft({
      asesor_id: item.asesor_id,
      reflexion: item.reflexion || "",
    });
  };

  const cancel = () => {
    setCreating(false);
    setEditingId(null);
    setDraft(null);
  };

  const change = (key, val) => {
    setDraft((prev) => ({ ...prev, [key]: val }));
  };

  const save = async () => {
    if (!draft.asesor_id) {
      alert("Debes seleccionar un asesor.");
      return;
    }
    if (!draft.reflexion?.trim()) {
      alert("El campo reflexión no puede estar vacío.");
      return;
    }

    try {
      const payload = {
        asesor_id: Number(draft.asesor_id),
        reflexion: draft.reflexion.trim(),
      };

      if (creating) {
        await api.post("/reflexiones", payload);
      } else if (editingId) {
        await api.put(`/reflexiones/${editingId}`, payload);
      }

      await refreshData();
      cancel();
    } catch (error) {
      console.error("Error al guardar la reflexión:", error.response?.data || error);
      alert(error.response?.data?.message || "Ocurrió un error al guardar la reflexión.");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar esta reflexión?")) return;
    try {
      await api.delete(`/reflexiones/${id}`);
      setReflexiones((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error al eliminar la reflexión:", error);
      alert("No se pudo eliminar la reflexión.");
    }
  };

  if (loading) {
    return <div style={{ padding: 20, color: C.text }}>Cargando reflexiones...</div>;
  }

  return (
    <div>
      <SectionTitle
        eyebrow="Cierre individual"
        title="Reflexión"
        desc={`"Tengo un cliente, una necesidad y varios canales disponibles: ¿qué canal utilizo, cómo atiendo, cómo registro, cuándo cambio de canal, cómo mantengo la trazabilidad y cómo demuestro que la atención fue de calidad?"`}
        action={<PrimaryBtn onClick={startCreate} Icon={Plus}>Nueva reflexión</PrimaryBtn>}
      />

      {/* Formulario de Creación */}
      {creating && (
        <Card style={{ marginBottom: 16, borderColor: C.live + "55" }}>
          <div style={{ fontSize: 12, color: C.live, marginBottom: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
            CREANDO NUEVA REFLEXIÓN
          </div>
          <EntityForm fields={fieldsReflexion} value={draft} onChange={change} />
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <PrimaryBtn onClick={save} Icon={Check}>Guardar</PrimaryBtn>
            <IconBtn onClick={cancel} Icon={X} title="Cancelar" />
          </div>
        </Card>
      )}

      {/* Lista de Reflexiones */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {reflexiones.length === 0 && !creating && (
          <Card style={{ padding: 20, textAlign: "center", color: C.muted }}>
            No hay reflexiones registradas aún.
          </Card>
        )}

        {reflexiones.map((item) => {
          const asesor = asesores.find((a) => Number(a.id) === Number(item.asesor_id)) || item.asesor;
          const nombreAsesor = asesor
            ? `${asesor.nombre || asesor.name || ""} ${asesor.apellidos || ""}`.trim()
            : `Asesor #${item.asesor_id}`;

          // Vista de edición inline
          if (editingId === item.id) {
            return (
              <Card key={item.id} style={{ padding: 16, borderColor: C.live + "55" }}>
                <div style={{ fontSize: 12, color: C.live, marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>
                  EDITANDO REFLEXIÓN #{item.id}
                </div>
                <EntityForm fields={fieldsReflexion} value={draft} onChange={change} />
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <PrimaryBtn onClick={save} Icon={Check}>Guardar cambios</PrimaryBtn>
                  <IconBtn onClick={cancel} Icon={X} title="Cancelar" />
                </div>
              </Card>
            );
          }

          // Vista normal en tarjeta
          return (
            <Card key={item.id} style={{ padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 600, color: C.text }}>
                  <User size={16} color={C.live} />
                  <span>{nombreAsesor}</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11.5, color: C.mutedDim, fontFamily: "'IBM Plex Mono', monospace" }}>
                    {formatStaticDate(item.created_at)}
                  </span>
                  <IconBtn onClick={() => startEdit(item)} Icon={Pencil} title="Editar" />
                  <IconBtn onClick={() => remove(item.id)} Icon={Trash2} tone={C.danger} title="Eliminar" />
                </div>
              </div>

              <div
                style={{
                  fontSize: 13.5,
                  color: C.text,
                  lineHeight: 1.6,
                  whiteSpace: "pre-wrap",
                  background: C.panelAlt || "#1a1d24",
                  padding: 12,
                  borderRadius: 8,
                  border: `1px solid ${C.line || "#333"}`,
                }}
              >
                {item.reflexion}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
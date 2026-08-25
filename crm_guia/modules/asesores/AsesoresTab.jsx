import { useEffect, useState } from "react";
import { Plus, Check, X, Pencil, Trash2, Mail, ShieldCheck } from "lucide-react";
import { C } from "../../theme/tokens";
import { Card, SectionTitle, PrimaryBtn, IconBtn, Pill, EntityForm } from "../../components/ui";
import { api } from "../../lib/api";

const ROLES_ASESOR = ["ASESOR", "SUPERVISOR", "ADMINISTRADOR"];
const ESTADOS_ASESOR = ["activo", "inactivo"];

export function AsesoresTab() {
  const [asesores, setAsesores] = useState([]);
  const [loading, setLoading] = useState(true);

  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);

  const loadAsesores = async () => {
    try {
      const res = await api.get("/asesores");
      const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
      setAsesores(data);
    } catch (error) {
      console.error("Error al cargar asesores:", error);
    }
  };

  // Carga inicial asíncrona limpia sin setState síncronos dentro del efecto
  useEffect(() => {
    let active = true;

    api.get("/asesores")
      .then((res) => {
        if (active) {
          const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
          setAsesores(data);
        }
      })
      .catch((error) => {
        console.error("Error al cargar asesores:", error);
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

  const fieldsAsesor = [
    {
      key: "nombre",
      label: "Nombre Completo",
      type: "text",
      placeholder: "Ej. Juan Pérez",
      w: 1,
    },
    {
      key: "correo",
      label: "Correo Electrónico",
      type: "email",
      placeholder: "ejemplo@correo.com",
      w: 1,
    },
    {
      key: "rol",
      label: "Rol de Asesor",
      type: "select",
      options: ROLES_ASESOR,
      w: 1,
    },
    {
      key: "estado",
      label: "Estado",
      type: "select",
      options: ESTADOS_ASESOR,
      w: 1,
    },
  ];

  const startCreate = () => {
    setCreating(true);
    setEditingId(null);
    setDraft({
      nombre: "",
      correo: "",
      rol: "ASESOR",
      estado: "activo",
    });
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setCreating(false);
    setDraft({
      nombre: item.nombre || item.name || "",
      correo: item.correo || item.email || "",
      rol: item.rol || "ASESOR",
      estado: item.estado || "activo",
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
    if (!draft.nombre?.trim() || !draft.correo?.trim()) {
      alert("Debes ingresar el nombre y el correo electrónico.");
      return;
    }

    try {
      const payload = {
        nombre: draft.nombre.trim(),
        correo: draft.correo.trim(),
        rol: draft.rol,
        estado: draft.estado,
      };

      if (creating) {
        await api.post("/asesores", payload);
      } else if (editingId) {
        await api.put(`/asesores/${editingId}`, payload);
      }

      await loadAsesores();
      cancel();
    } catch (error) {
      console.error("Error al guardar el asesor:", error.response?.data || error);
      alert(error.response?.data?.message || "Ocurrió un error al guardar el asesor.");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este asesor?")) return;
    try {
      await api.delete(`/asesores/${id}`);
      setAsesores((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error("Error al eliminar el asesor:", error);
      alert("No se pudo eliminar el asesor.");
    }
  };

  if (loading) {
    return <div style={{ padding: 20, color: C.text }}>Cargando asesores...</div>;
  }

  return (
    <div>
      <SectionTitle
        eyebrow="Gestión de Personal"
        title="Asesores"
        desc="Administre el equipo de asesores, sus credenciales, roles y estado actual."
        action={<PrimaryBtn onClick={startCreate} Icon={Plus}>Nuevo Asesor</PrimaryBtn>}
      />

      {creating && (
        <Card style={{ marginBottom: 16, borderColor: C.live + "55" }}>
          <div style={{ fontSize: 12, color: C.live, marginBottom: 12, fontFamily: "'IBM Plex Mono', monospace" }}>
            CREANDO NUEVO ASESOR
          </div>
          <EntityForm fields={fieldsAsesor} value={draft} onChange={change} />
          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <PrimaryBtn onClick={save} Icon={Check}>Guardar</PrimaryBtn>
            <IconBtn onClick={cancel} Icon={X} title="Cancelar" />
          </div>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {asesores.length === 0 && !creating && (
          <Card style={{ padding: 20, textAlign: "center", color: C.muted }}>
            No hay asesores registrados en la base de datos.
          </Card>
        )}

        {asesores.map((item) => {
          if (editingId === item.id) {
            return (
              <Card key={item.id} style={{ padding: 16, borderColor: C.live + "55" }}>
                <div style={{ fontSize: 12, color: C.live, marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>
                  EDITANDO ASESOR #{item.id}
                </div>
                <EntityForm fields={fieldsAsesor} value={draft} onChange={change} />
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <PrimaryBtn onClick={save} Icon={Check}>Guardar cambios</PrimaryBtn>
                  <IconBtn onClick={cancel} Icon={X} title="Cancelar" />
                </div>
              </Card>
            );
          }

          const isActivo = (item.estado || "").toLowerCase() === "activo";

          return (
            <Card key={item.id} style={{ padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.mutedDim }}>
                    ID-{item.id}
                  </span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>
                    {item.nombre || item.name}
                  </span>
                  <Pill tone={isActivo ? "ok" : "muted"}>
                    {item.estado || "activo"}
                  </Pill>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12.5, color: C.muted }}>
                    <Mail size={14} color={C.mutedDim} />
                    <span>{item.correo || item.email}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.live, fontFamily: "'IBM Plex Mono', monospace" }}>
                    <ShieldCheck size={14} />
                    <span>{item.rol || "ASESOR"}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <IconBtn onClick={() => startEdit(item)} Icon={Pencil} title="Editar" />
                    <IconBtn onClick={() => remove(item.id)} Icon={Trash2} tone={C.danger} title="Eliminar" />
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
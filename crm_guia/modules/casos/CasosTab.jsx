import { useState, useEffect } from "react";
import { Plus, Check, X, Pencil, Trash2, Eye, Loader2 } from "lucide-react";
import { C } from "../../theme/tokens";
import { FIELDS_CASO } from "../../data/fields";
import { BLANK_CASO } from "../../data/blanks";
import { getCasos, getCasoById, createCaso, updateCaso, deleteCaso } from "../../services/casos";
import { getClientes, getProductosByCliente } from "../../services/clientes";
import { Card, SectionTitle, PrimaryBtn, IconBtn, Tag, EntityForm } from "../../components/ui";

export function CasosTab() {
  const [casos, setCasos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [productosCliente, setProductosCliente] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingProductos, setLoadingProductos] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewingCaso, setViewingCaso] = useState(null);
  const [draft, setDraft] = useState(null);
  const [creating, setCreating] = useState(false);

  const refreshCasos = async () => {
    try {
      const data = await getCasos();
      setCasos(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      console.error("Error al recargar casos de simulación:", err);
    }
  };

  // 1. Cargar Casos y Clientes en montaje
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      try {
        const [casosRes, clientesRes] = await Promise.all([
          getCasos(),
          getClientes(),
        ]);

        if (isMounted) {
          setCasos(Array.isArray(casosRes) ? casosRes : casosRes.data || []);
          setClientes(Array.isArray(clientesRes) ? clientesRes : clientesRes.data || []);
        }
      } catch (err) {
        if (isMounted) console.error("Error al cargar datos iniciales:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Cargar productos cuando cambie el cliente seleccionado (Sin llamadas sincrónicas)
  useEffect(() => {
    let isMounted = true;

    const loadProductos = async () => {
      if (!draft?.cliente_id) {
        if (isMounted) setProductosCliente([]);
        return;
      }

      setLoadingProductos(true);
      try {
        const prods = await getProductosByCliente(draft.cliente_id);
        if (isMounted) {
          setProductosCliente(Array.isArray(prods) ? prods : prods.data || []);
        }
      } catch (err) {
        if (isMounted) {
          const cliente = clientes.find((c) => String(c.id) === String(draft.cliente_id));
          setProductosCliente(cliente?.productos_clientes || cliente?.productos || []);
        }
      } finally {
        if (isMounted) setLoadingProductos(false);
      }
    };

    loadProductos();

    return () => {
      isMounted = false;
    };
  }, [draft?.cliente_id, clientes]);

  const showDetail = async (id) => {
    try {
      const data = await getCasoById(id);
      setViewingCaso(data.data || data);
    } catch (err) {
      console.error("Error al obtener detalle del caso:", err);
    }
  };

  const startEdit = (c) => { 
    setEditingId(c.id); 
    setDraft({ ...c }); 
    setCreating(false); 
    setViewingCaso(null);
  };

  const startCreate = () => { 
    setCreating(true); 
    setDraft({ ...BLANK_CASO, cliente_id: "", producto_cliente_id: "", situacion: "" }); 
    setEditingId(null); 
    setViewingCaso(null);
  };

  const cancel = () => { 
    setEditingId(null); 
    setCreating(false); 
    setDraft(null); 
    setViewingCaso(null);
  };

  const change = (key, val) => setDraft((d) => ({ ...d, [key]: val }));

  const save = async () => {
    if (!draft?.titulo?.trim()) return alert("El título es obligatorio.");
    if (!draft?.cliente_id) return alert("Debe seleccionar un cliente.");
    if (!draft?.producto_cliente_id) return alert("Debe seleccionar un producto.");
    if (!draft?.situacion?.trim()) return alert("La situación es obligatoria.");

    try {
      if (creating) {
        await createCaso(draft);
      } else {
        await updateCaso(editingId, draft);
      }
      await refreshCasos();
      cancel();
    } catch (err) {
      console.error("Error al guardar:", err);
      alert(err.response?.data?.message || "Ocurrió un error al guardar los cambios.");
    }
  };

  const remove = async (id) => {
    if (window.confirm("¿Eliminar este caso de simulación?")) {
      try {
        await deleteCaso(id);
        await refreshCasos();
      } catch (err) {
        console.error("Error al eliminar el caso:", err);
        alert("Ocurrió un error al eliminar el caso.");
      }
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 40, color: C.muted }}>
        <Loader2 className="animate-spin" style={{ marginRight: 8 }} /> Cargando casos de simulación...
      </div>
    );
  }

  return (
    <div>
      <SectionTitle
        eyebrow="Simulación"
        title="Casos de simulación"
        desc="Cree, edite o elimine los casos que el equipo usará durante la práctica."
        action={<PrimaryBtn onClick={startCreate} Icon={Plus}>Agregar caso</PrimaryBtn>}
      />

      {(creating || editingId) && (
        <Card style={{ marginBottom: 14, borderColor: C.live + "55" }}>
          <div style={{ fontSize: 12, color: C.live, marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>
            {creating ? "NUEVO CASO" : `EDITANDO CASO #${editingId}`}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginBottom: 12 }}>
            <div>
              <label style={{ display: "block", fontSize: 12, color: C.text, marginBottom: 4 }}>
                Cliente <span style={{ color: C.danger }}>*</span>
              </label>
              <select
                value={draft?.cliente_id || ""}
                onChange={(e) => change("cliente_id", e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: C.panelAlt,
                  color: C.text,
                  border: `1px solid ${C.line}`,
                  borderRadius: 6,
                  outline: "none",
                }}
              >
                <option value="">-- Seleccionar cliente --</option>
                {clientes.map((cli) => (
                  <option key={cli.id} value={cli.id}>
                    {cli.nombre || cli.nombre_completo || `Cliente #${cli.id}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: 12, color: C.text, marginBottom: 4 }}>
                Producto del cliente <span style={{ color: C.danger }}>*</span>
              </label>
              <select
                value={draft?.producto_cliente_id || ""}
                onChange={(e) => change("producto_cliente_id", e.target.value)}
                disabled={!draft?.cliente_id || loadingProductos}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: C.panelAlt,
                  color: C.text,
                  border: `1px solid ${C.line}`,
                  borderRadius: 6,
                  outline: "none",
                  opacity: !draft?.cliente_id ? 0.5 : 1,
                }}
              >
                <option value="">
                  {loadingProductos
                    ? "Cargando productos..."
                    : !draft?.cliente_id
                    ? "Seleccione primero un cliente"
                    : "-- Seleccionar producto --"}
                </option>
                {productosCliente.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.producto?.nombre || p.nombre || `Producto #${p.id}`} {p.saldo ? `- Saldo: $${p.saldo}` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <EntityForm fields={FIELDS_CASO} value={draft} onChange={change} columns={2} />

          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <PrimaryBtn onClick={save} Icon={Check}>
              {creating ? "Guardar" : "Guardar cambios"}
            </PrimaryBtn>
            <IconBtn onClick={cancel} Icon={X} title="Cancelar" />
          </div>
        </Card>
      )}

      {viewingCaso && (
        <Card style={{ marginBottom: 14, borderColor: C.ok + "55" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: C.ok, fontFamily: "'IBM Plex Mono', monospace" }}>
              DETALLE COMPLETO DEL CASO #{viewingCaso.id}
            </span>
            <IconBtn onClick={() => setViewingCaso(null)} Icon={X} title="Cerrar" />
          </div>
          <div style={{ fontSize: 16, fontWeight: 600, color: C.text }}>{viewingCaso.titulo}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10, marginTop: 12, fontSize: 12.5 }}>
            <div><b style={{ color: C.text }}>Cliente ID: </b>{viewingCaso.cliente_id}</div>
            <div><b style={{ color: C.text }}>Producto Cliente ID: </b>{viewingCaso.producto_cliente_id}</div>
            <div><b style={{ color: C.text }}>Situación: </b>{viewingCaso.situacion || "Sin información"}</div>
            <div><b style={{ color: C.text }}>Actitud Cliente: </b>{viewingCaso.actitud_cliente || "Sin información"}</div>
            <div><b style={{ color: C.text }}>Objetivo Asesor: </b>{viewingCaso.objetivo_asesor || "Sin información"}</div>
            <div><b style={{ color: C.text }}>Días Mora: </b>{viewingCaso.dias_mora ?? "N/A"} días</div>
            <div><b style={{ color: C.text }}>Capacidad de Pago: </b>${viewingCaso.capacidad_estimada_pago ? Number(viewingCaso.capacidad_estimada_pago).toLocaleString() : 0}</div>
          </div>
        </Card>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
        {casos.map((c) => (
          <Card key={c.id} style={{ padding: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.live }}>ID: {c.id}</span>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {c.canal && <Tag canalId={c.canal} />}
                <IconBtn onClick={() => showDetail(c.id)} Icon={Eye} title="Ver detalle" />
                <IconBtn onClick={() => startEdit(c)} Icon={Pencil} title="Editar" />
                <IconBtn onClick={() => remove(c.id)} Icon={Trash2} tone={C.danger} title="Eliminar" />
              </div>
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 16, fontWeight: 600, color: C.text, marginTop: 6 }}>
              {c.titulo}
            </div>
            <div style={{ fontSize: 12.5, color: C.mutedDim, marginTop: 8, lineHeight: 1.5 }}>
              <b>Situación: </b>{c.situacion}
            </div>
            <div style={{ fontSize: 12.5, color: C.muted, marginTop: 8, lineHeight: 1.5 }}>
              <b style={{ color: C.text }}>Actitud: </b>{c.actitud_cliente || "N/A"}
            </div>
            <div style={{ marginTop: 10, padding: "8px 10px", background: C.panelAlt, borderRadius: 8, fontSize: 12, color: C.ok, border: `1px solid ${C.line}` }}>
              <b>Objetivo: </b>{c.objetivo_asesor}
            </div>
          </Card>
        ))}
        {casos.length === 0 && !creating && !editingId && (
          <div style={{ gridColumn: "span 2", color: C.mutedDim, fontSize: 13, padding: 20, textAlign: "center" }}>
            No hay casos registrados en el servidor.
          </div>
        )}
      </div>
    </div>
  );
}
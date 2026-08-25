import { useState, useEffect } from "react";
import { Plus, Check, X, Pencil, Trash2, Timer, CreditCard } from "lucide-react";
import { C } from "../../theme/tokens";
import { BLANK_INTERACCION } from "../../data/blanks";
import { estadoTone } from "../../utils/estado";
import { Card, SectionTitle, PrimaryBtn, IconBtn, Pill, Tag, EntityForm } from "../../components/ui";
import { api } from "../../lib/api";

const ESTADOS_VALIDOS = ["en_gestion", "contactado", "pendiente", "cerrado"];
const PROCEDIMIENTOS = [
  { value: "negociacion", label: "Negociación" },
  { value: "reporte", label: "Reporte" },
  { value: "cierre", label: "Cierre" },
];
const CANALES_COMUNICACION = ["TELEFONO", "WHATSAPP", "CHAT_WEB", "CORREO_ELECTRONICO", "REDES_SOCIALES"];

export function BitacoraTab({ clientes: clientesProps = [] }) {
  const [interacciones, setInteracciones] = useState([]);
  const [clientes, setClientes] = useState(clientesProps);
  const [asesores, setAsesores] = useState([]);
  const [casos, setCasos] = useState([]);
  const [productosCliente, setProductosCliente] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(null);
  const [creating, setCreating] = useState(false);

  // Estados del Cronómetro
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  const [showPickerModal, setShowPickerModal] = useState(false);
  const [tempDate, setTempDate] = useState("");

  // Cronómetro
  useEffect(() => {
    let interval = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatTimer = (totalSeconds) => {
    const mins = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
    const secs = String(totalSeconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const formatToInputDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const formatStaticDate = (dateStr) => {
    if (!dateStr) return "Sin fecha";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "Sin fecha";
    const pad = (n) => String(n).padStart(2, "0");
    return `${date.getFullYear()}/${pad(date.getMonth() + 1)}/${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const formatCurrency = (val) => {
    if (val === null || val === undefined) return "N/A";
    return `$${Number(val).toLocaleString()}`;
  };

  const mapInteraccionesFromApi = (data) =>
    (Array.isArray(data) ? data : []).map((i) => ({
      id: i.id,
      cliente_id: i.cliente_id || (i.cliente ? i.cliente.id : null),
      asesor_id: i.asesor_id || (i.asesor ? i.asesor.id : null),
      caso_simulacion_id: i.caso_simulacion_id || (i.caso_simulacion ? i.caso_simulacion.id : null),
      clienteNombre: i.cliente ? `${i.cliente.nombre} ${i.cliente.apellidos || ""}`.trim() : "Cliente no encontrado",
      fecha: formatToInputDate(i.fecha_interaccion || i.created_at),
      fechaLabel: formatStaticDate(i.fecha_interaccion || i.created_at),
      canal: i.canal_contacto || i.canal || "TELEFONO",
      estado: i.estado || "en_gestion",
      motivo: i.motivo || "",
      gestion: i.gestion || "",
      siguiente: i.proximo_paso || i.siguiente || "",
      primerContacto: Boolean(i.primer_contacto),
    }));

  const reloadData = async () => {
    try {
      const res = await api.get("/bitacora");
      setInteracciones(mapInteraccionesFromApi(res.data));
    } catch (error) {
      console.warn("No se pudo refrescar la bitácora desde la API:", error);
    }
  };

  useEffect(() => {
    let isMounted = true;
    const loadAsyncData = async () => {
      try {
        const [resClientes, resAsesores, resCasos, resBitacora] = await Promise.allSettled([
          api.get("/clientes"),
          api.get("/asesores"),
          api.get("/casos-simulacion"),
          api.get("/bitacora"),
        ]);

        if (isMounted) {
          if (resClientes.status === "fulfilled") setClientes(Array.isArray(resClientes.value.data) ? resClientes.value.data : []);
          if (resAsesores.status === "fulfilled") setAsesores(Array.isArray(resAsesores.value.data) ? resAsesores.value.data : []);
          if (resCasos.status === "fulfilled") setCasos(Array.isArray(resCasos.value.data) ? resCasos.value.data : []);
          if (resBitacora.status === "fulfilled") setInteracciones(mapInteraccionesFromApi(resBitacora.value.data));
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAsyncData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Carga asíncrona de productos del cliente adaptada a res.data.data
  useEffect(() => {
    let active = true;
    const clienteId = draft?.cliente_id;

    if (clienteId) {
      api
        .get(`/clientes/${clienteId}/productos`)
        .then((res) => {
          if (active) {
            const dataArray = Array.isArray(res.data) 
              ? res.data 
              : (Array.isArray(res.data?.data) ? res.data.data : []);
            setProductosCliente(dataArray);
          }
        })
        .catch(() => {
          if (active) setProductosCliente([]);
        });
    }

    return () => {
      active = false;
    };
  }, [draft?.cliente_id]);

  const listaProductos = Array.isArray(productosCliente) ? productosCliente : [];

  // Buscar el producto pivote seleccionado
  const productoSeleccionado = listaProductos.find(
    (p) => String(p.id) === String(draft?.producto_id)
  );

  const fieldsInteraccion = [
    {
      key: "cliente_id",
      label: "Cliente",
      type: "select",
      options: clientes.map((c) => ({
        value: c.id,
        label: `${c.nombre} ${c.apellidos || ""}`.trim(),
      })),
      w: 1,
    },
    {
      key: "producto_id",
      label: "Producto del Cliente",
      type: "select",
      options: [
        { value: "", label: "-- Seleccionar Producto --" },
        ...listaProductos.map((p) => ({
          value: p.id,
          label: p.producto?.nombre || p.nombre || `Producto #${p.id}`,
        })),
      ],
      w: 1,
    },
    {
      key: "tipo_procedimiento",
      label: "Tipo de Procedimiento",
      type: "select",
      options: PROCEDIMIENTOS,
      w: 1,
    },
    {
      key: "canal",
      label: "Canal de Comunicación",
      type: "select",
      options: CANALES_COMUNICACION,
      w: 1,
    },
    {
      key: "estado_simulacion",
      label: "Estado de la Simulación",
      type: "select",
      options: ["Pendiente", "Solucionado"],
      w: 1,
    },
    {
      key: "asesor_id",
      label: "Asesor",
      type: "select",
      options: asesores.map((a) => ({
        value: a.id,
        label: `${a.nombre || a.name} ${a.apellidos || ""}`.trim(),
      })),
      w: 1,
    },
    { key: "fecha", label: "Fecha y hora", type: "modal-date", w: 1 },
    { key: "estado", label: "Estado Bitácora", type: "select", options: ESTADOS_VALIDOS, w: 1 },
    { key: "motivo", label: "Motivo", type: "text", w: 2 },
    { key: "gestion", label: "Gestión", type: "textarea", w: 2 },
    { key: "siguiente", label: "Próximo paso", type: "text", w: 2 },
  ];

  const startCreate = () => {
    const initialClienteId = clientes[0]?.id || "";
    setCreating(true);
    setTimerSeconds(0);
    setProductosCliente([]);

    setDraft({
      ...BLANK_INTERACCION,
      cliente_id: initialClienteId,
      producto_id: "",
      tipo_procedimiento: "negociacion",
      canal: "TELEFONO",
      estado_simulacion: "Pendiente",
      asesor_id: asesores[0]?.id || "",
      fecha: formatToInputDate(new Date()),
      estado: ESTADOS_VALIDOS[0] || "en_gestion",
      primerContacto: false,
    });

    if (initialClienteId) {
      setIsTimerRunning(true);
    }

    setEditingId(null);
  };

  const startEdit = (i) => {
    setEditingId(i.id);
    setDraft({ ...i });
    setCreating(false);
    setIsTimerRunning(false);
  };

  const cancel = () => {
    setEditingId(null);
    setCreating(false);
    setDraft(null);
    setIsTimerRunning(false);
    setTimerSeconds(0);
    setProductosCliente([]);
  };

  const change = (key, val) => {
    if (key === "ultimoContactoModalTrigger") {
      setTempDate(draft?.fecha || formatToInputDate(new Date()));
      setShowPickerModal(true);
      return;
    }

    if (key === "cliente_id") {
      setProductosCliente([]);
      if (val) {
        setIsTimerRunning(true);
      }
    }

    setDraft((d) => ({ ...d, [key]: val }));
  };

  const save = async () => {
    if (!draft.cliente_id || !draft.asesor_id || !draft.motivo?.trim()) {
      alert("Debes seleccionar Cliente, Asesor y especificar el motivo.");
      return;
    }

    setIsTimerRunning(false);

    let fechaIso = null;
    if (draft.fecha) {
      const parsed = new Date(draft.fecha);
      if (!isNaN(parsed.getTime())) {
        fechaIso = parsed.toISOString();
      }
    }

    try {
      const casoPayload = {
        nombre: `Caso - ${draft.motivo}`,
        cliente_id: Number(draft.cliente_id),
        producto_id: draft.producto_id ? Number(draft.producto_id) : null,
        tipo_procedimiento: draft.tipo_procedimiento,
        canal: draft.canal,
        estado_simulacion: draft.estado_simulacion,
        duracion_segundos: timerSeconds,
      };

      const resCaso = await api.post("/casos-simulacion", casoPayload);
      const casoId = resCaso.data.id;

      const bitacoraPayload = {
        cliente_id: Number(draft.cliente_id),
        asesor_id: Number(draft.asesor_id),
        caso_simulacion_id: casoId,
        fecha_interaccion: fechaIso,
        canal_contacto: draft.canal,
        estado: draft.estado,
        motivo: draft.motivo,
        gestion: draft.gestion || "",
        proximo_paso: draft.siguiente || "",
        primer_contacto: Boolean(draft.primerContacto),
      };

      if (creating) {
        await api.post("/bitacora", bitacoraPayload);
      } else {
        await api.put(`/bitacora/${editingId}`, bitacoraPayload);
      }

      await reloadData();
      cancel();
    } catch (error) {
      console.error("Error al guardar:", error.response?.data || error);
      alert(error.response?.data?.message || "No se pudo guardar el registro.");
    }
  };

  const remove = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este registro?")) return;
    try {
      await api.delete(`/bitacora/${id}`);
      setInteracciones((prev) => prev.filter((i) => i.id !== id));
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("No se pudo eliminar el registro.");
    }
  };

  if (loading) {
    return <div style={{ padding: 20, color: C.text }}>Cargando bitácora desde la base de datos...</div>;
  }

  return (
    <div>
      <SectionTitle
        eyebrow="Bitácora omnicanal"
        title="Registro de interacciones"
        desc="Cree, edite o elimine interacciones sincronizadas con Laravel API."
        action={<PrimaryBtn onClick={startCreate} Icon={Plus}>Agregar interacción</PrimaryBtn>}
      />

      {creating && (
        <Card style={{ marginBottom: 14, borderColor: C.live + "55" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 12, color: C.live, fontFamily: "'IBM Plex Mono', monospace" }}>NUEVA INTERACCIÓN</div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, background: C.panelAlt, padding: "6px 14px", borderRadius: 8, border: `1px solid ${C.line}` }}>
              <Timer size={20} color={isTimerRunning ? C.live : C.muted} />
              <span style={{ fontFamily: "'Space Grotesk', monospace", fontSize: 22, fontWeight: 700, color: isTimerRunning ? C.live : C.text }}>
                {formatTimer(timerSeconds)}
              </span>
            </div>
          </div>

          <EntityForm fields={fieldsInteraccion} value={draft} onChange={change} />

          {/* Muestra los datos específicos retornados por la API */}
          {productoSeleccionado && (
            <div
              style={{
                marginTop: 14,
                padding: 12,
                borderRadius: 8,
                background: C.panelAlt || "#1a1d24",
                border: `1px solid ${C.line || "#333"}`,
                fontSize: 12.5,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: 600, color: C.live, marginBottom: 8 }}>
                <CreditCard size={16} /> Detalles del Producto Adquirido
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10 }}>
                <div>
                  <span style={{ color: C.muted }}>Nombre del Producto:</span>{" "}
                  <b style={{ color: C.text }}>{productoSeleccionado.producto?.nombre || "N/A"}</b>
                </div>
                <div>
                  <span style={{ color: C.muted }}>Valor Inicial:</span>{" "}
                  <b style={{ color: C.text }}>{formatCurrency(productoSeleccionado.valor)}</b>
                </div>
                <div>
                  <span style={{ color: C.muted }}>Saldo Pendiente:</span>{" "}
                  <b style={{ color: C.text }}>{formatCurrency(productoSeleccionado.saldo)}</b>
                </div>
                <div>
                  <span style={{ color: C.muted }}>Cuota Mensual:</span>{" "}
                  <b style={{ color: C.text }}>{formatCurrency(productoSeleccionado.cuota_mensual)}</b>
                </div>
                <div>
                  <span style={{ color: C.muted }}>Estado del Producto:</span>{" "}
                  <b style={{ color: C.text }}>{productoSeleccionado.producto?.estado || "N/A"}</b>
                </div>
                <div>
                  <span style={{ color: C.muted }}>Fecha de Adquisición:</span>{" "}
                  <b style={{ color: C.text }}>{formatStaticDate(productoSeleccionado.created_at)}</b>
                </div>
              </div>
            </div>
          )}

          <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 12.5, color: C.muted }}>
            <input type="checkbox" checked={!!draft?.primerContacto} onChange={(e) => change("primerContacto", e.target.checked)} />
            Es el primer contacto de este caso
          </label>

          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            <PrimaryBtn onClick={save} Icon={Check}>Guardar</PrimaryBtn>
            <IconBtn onClick={cancel} Icon={X} title="Cancelar" />
          </div>
        </Card>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {interacciones.map((i) => {
          const cliente = clientes.find((c) => Number(c.id) === Number(i.cliente_id));
          const nombreCliente = cliente ? `${cliente.nombre} ${cliente.apellidos || ""}`.trim() : i.clienteNombre;

          if (editingId === i.id) {
            return (
              <Card key={i.id} style={{ padding: 16, borderColor: C.live + "55" }}>
                <div style={{ fontSize: 12, color: C.live, marginBottom: 10, fontFamily: "'IBM Plex Mono', monospace" }}>EDITANDO INT-{i.id}</div>
                <EntityForm fields={fieldsInteraccion} value={draft} onChange={change} />
                <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <PrimaryBtn onClick={save} Icon={Check}>Guardar cambios</PrimaryBtn>
                  <IconBtn onClick={cancel} Icon={X} title="Cancelar" />
                </div>
              </Card>
            );
          }

          return (
            <Card key={i.id} style={{ padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: C.mutedDim }}>INT-{i.id}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{nombreCliente}</span>
                  <Tag canalId={i.canal} />
                  {!i.primerContacto && <Pill tone="muted">continuación</Pill>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11.5, color: C.mutedDim, fontFamily: "'IBM Plex Mono', monospace" }}>{i.fechaLabel}</span>
                  <Pill tone={estadoTone(i.estado)}>{i.estado}</Pill>
                  <IconBtn onClick={() => startEdit(i)} Icon={Pencil} title="Editar" />
                  <IconBtn onClick={() => remove(i.id)} Icon={Trash2} tone={C.danger} title="Eliminar" />
                </div>
              </div>
              <div style={{ marginTop: 8, fontSize: 13, color: C.muted }}><b style={{ color: C.text }}>Motivo:</b> {i.motivo}</div>
              <div style={{ marginTop: 4, fontSize: 13, color: C.muted }}><b style={{ color: C.text }}>Gestión:</b> {i.gestion}</div>
              <div style={{ marginTop: 4, fontSize: 12.5, color: C.mutedDim }}>Próximo paso: {i.siguiente}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
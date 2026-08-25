import { C } from "../../theme/tokens";
import { CANALES } from "../../data/canales";

function FieldInput({ field, value, onChange }) {
  const common = {
    value: value ?? "",
    onChange: (e) => onChange(field.key, e.target.value),
    style: {
      width: "100%", padding: "8px 10px", borderRadius: 8, background: C.panel,
      border: `1px solid ${C.line}`, color: C.text, fontSize: 12.5, outline: "none",
      fontFamily: "'Inter', sans-serif", boxSizing: "border-box",
    },
  };

  if (field.type === "select") {
    return (
      <select {...common}>
        {field.options.map((o) => {
          const val = typeof o === "object" ? o.value : o;
          const lbl = typeof o === "object" ? o.label : o;
          return <option key={val} value={val}>{lbl}</option>;
        })}
      </select>
    );
  }
  if (field.type === "canal") {
    return (
      <select {...common}>
        {CANALES.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
      </select>
    );
  }
  if (field.type === "textarea") return <textarea {...common} rows={2} style={{ ...common.style, resize: "vertical" }} />;
  if (field.type === "date") return <input {...common} type="date" />;
  if (field.type === "number") return <input {...common} type="number" />;
  return <input {...common} type="text" />;
}

/**
 * Renderiza un formulario completo a partir de un esquema declarativo
 * (ver src/data/fields.js). `value` es el objeto en edición/creación,
 * `onChange(key, val)` actualiza un campo puntual.
 */
// En tu componente EntityForm.jsx
export function EntityForm({ fields, value, onChange }) {
  // Estilo base unificado para todos los campos (input, select, textarea)
  const inputStyle = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 8,
    background: C.panelAlt,
    border: `1px solid ${C.line}`,
    color: C.text,
    fontSize: 13,
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const labelStyle = {
    fontSize: 11,
    color: C.mutedDim,
    display: "block",
    marginBottom: 6,
    fontFamily: "'Space Grotesk', sans-serif",
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
      {fields.map((f) => {
        // Caso: Input con disparador de Modal
        if (f.type === "modal-date") {
          const displayVal = value?.[f.key] ? value[f.key].replace("T", " ") : "Seleccionar fecha y hora...";
          return (
            <div key={f.key}>
              <label style={labelStyle}>{f.label}</label>
              <input
                type="text"
                readOnly
                value={displayVal}
                onClick={() => onChange("ultimoContactoModalTrigger", true)}
                style={{
                  ...inputStyle,
                  cursor: "pointer",
                  color: value?.[f.key] ? C.text : C.mutedDim,
                }}
              />
            </div>
          );
        }

        // Caso: Selects
        if (f.type === "select") {
          return (
            <div key={f.key}>
              <label style={labelStyle}>{f.label}</label>
              <select
                value={value?.[f.key] || ""}
                onChange={(e) => onChange(f.key, e.target.value)}
                style={inputStyle}
              >
                {f.options?.map((opt) => {
                  const val = typeof opt === "object" ? opt.value : opt;
                  const lbl = typeof opt === "object" ? opt.label : opt;
                  return (
                    <option key={val} value={val} style={{ background: C.panelAlt, color: C.text }}>
                      {lbl}
                    </option>
                  );
                })}
              </select>
            </div>
          );
        }

        // Caso: Textarea (Observaciones)
        if (f.type === "textarea") {
          return (
            <div key={f.key} style={{ gridColumn: "span 2" }}>
              <label style={labelStyle}>{f.label}</label>
              <textarea
                value={value?.[f.key] || ""}
                onChange={(e) => onChange(f.key, e.target.value)}
                rows={3}
                style={{ ...inputStyle, resize: "vertical" }}
              />
            </div>
          );
        }

        // Caso general: text, number, etc.
        return (
          <div key={f.key}>
            <label style={labelStyle}>{f.label}</label>
            <input
              type={f.type || "text"}
              value={value?.[f.key] ?? ""}
              onChange={(e) => onChange(f.key, e.target.value)}
              style={inputStyle}
            />
          </div>
        );
      })}
    </div>
  );
}
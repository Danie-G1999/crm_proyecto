import { useEffect, useState } from "react";

export const STORAGE_AVAILABLE = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

/**
 * useState respaldado en localStorage. Carga el valor guardado al montar
 * (si existe) y persiste automáticamente cada cambio, con un pequeño
 * debounce para no escribir en cada tecla.
 *
 * Devuelve [state, setState, sync] donde sync es uno de:
 * "cargando" | "listo" | "guardando" | "guardado" | "error" | "sin-bd"
 */
export function usePersistentState(key, initialValue) {
  const [state, setState] = useState(initialValue);
  const [hydrated, setHydrated] = useState(false);
  const [sync, setSync] = useState(STORAGE_AVAILABLE ? "cargando" : "sin-bd");

  // Carga inicial desde localStorage
  useEffect(() => {
    let cancelled = false;
    if (!STORAGE_AVAILABLE) return;
    try {
      const raw = window.localStorage.getItem(key);
      if (!cancelled && raw) setState(JSON.parse(raw));
    } catch (e) {
      // clave inexistente o JSON corrupto: se conserva el valor semilla
    }
    if (!cancelled) {
      setHydrated(true);
      setSync("listo");
    }
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Guardado automático (debounced) en cada cambio, una vez hidratado
  useEffect(() => {
    if (!hydrated || !STORAGE_AVAILABLE) return;
    setSync("guardando");
    const timeout = setTimeout(() => {
      try {
        window.localStorage.setItem(key, JSON.stringify(state));
        setSync("guardado");
      } catch (e) {
        setSync("error");
      }
    }, 500);
    return () => clearTimeout(timeout);
  }, [state, hydrated, key]);

  return [state, setState, sync];
}

/** Borra todas las llaves dadas de localStorage (usado por "Restablecer datos"). */
export function resetAllData(keys) {
  if (!STORAGE_AVAILABLE) return;
  for (const key of keys) {
    try {
      window.localStorage.removeItem(key);
    } catch (e) {
      // el navegador bloqueó el almacenamiento (modo privado, cuota, etc.)
    }
  }
}

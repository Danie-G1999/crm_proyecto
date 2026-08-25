"use client";

import { useState } from "react";
import { usePersistentState } from "./hooks/usePersistentState";
import { CLIENTES_SEED, INTERACCIONES_SEED, CASOS_SEED, GUIONES_SEED } from "./data/seeds";
import { MODULE_REGISTRY } from "./modules/registry";
import { ConsoleLayout } from "./layouts/ConsoleLayout";

const DB_KEYS = ["crm_clientes_v1", "crm_interacciones_v1", "crm_casos_v1", "crm_guiones_v1"];

export default function App() {
  const [tab, setTab] = useState("panel");

  // La persistencia (guardado automático en localStorage) sigue activa,
  // solo se quitó el indicador visual y el botón de reinicio del sidebar.
  const [clientes, setClientes] = usePersistentState(DB_KEYS[0], CLIENTES_SEED);
  const [interacciones, setInteracciones] = usePersistentState(DB_KEYS[1], INTERACCIONES_SEED);
  const [casos, setCasos] = usePersistentState(DB_KEYS[2], CASOS_SEED);
  const [guiones, setGuiones] = usePersistentState(DB_KEYS[3], GUIONES_SEED);

  // Props que cada módulo necesita del estado global. Los módulos que no
  // aparecen aquí (canales, qa, roles) no reciben props: son autocontenidos.
  const moduleProps = {
    panel: { clientes, interacciones },
    clientes: { clientes, setClientes },
    bitacora: { clientes, interacciones, setInteracciones },
    casos: { casos, setCasos },
    guiones: { guiones, setGuiones },
    informe: { clientes, interacciones, casos, guiones },
  };

  const active = MODULE_REGISTRY.find((m) => m.id === tab) ?? MODULE_REGISTRY[0];
  const ActiveComponent = active.Component;

  return (
    <ConsoleLayout activeTab={tab} onTabChange={setTab}>
      <ActiveComponent {...(moduleProps[tab] ?? {})} />
    </ConsoleLayout>
  );
}
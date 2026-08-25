/**
 * Genera el siguiente ID incremental con prefijo fijo y 3 dígitos,
 * a partir del mayor ID existente en la lista. Ej: nextId(clientes, "CLI") -> "CLI011"
 */
export function nextId(list, prefix) {
  const nums = list
    .map((x) => parseInt(x.id.replace(prefix, ""), 10))
    .filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return prefix + String(next).padStart(3, "0");
}

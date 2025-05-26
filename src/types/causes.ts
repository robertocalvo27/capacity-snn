export interface Cause {
  name: string;
  subcauses: string[];
}

export const CAUSES: Cause[] = [
  {
    name: "Mano_obra",
    subcauses: [
      "Caminatas (entrevistas)",
      "Entrenamientos (línea completa detenida por entrenamiento)",
      "Entrenamientos (no planeados y no reflejados en meta)",
      "Espera a llegada de área de soporte - Entrenador",
      "Espera a llegada de área de soporte - Equipment Clerk",
      "Espera a llegada de área de soporte - Ingeniería",
      "Espera a llegada de área de soporte - Ingeniería de calidad",
      "Espera a llegada de área de soporte - Inspector de Calidad",
      "Espera a llegada de área de soporte - IT",
      "Espera a llegada de área de soporte - Líder",
      "Espera a llegada de área de soporte - Otros sistemas",
      "Espera a llegada de área de soporte - Sistema Agile",
      "Evento de seguridad laboral",
      "NC / DC",
      "Reunión no planeada"
    ]
  },
  {
    name: "Maquinaria",
    subcauses: [
      "Calibraciones de equipos no planeado",
      "Cambio de tooling",
      "Falla de equipo (flujo lento)",
      "Falla de equipo (línea detenida)",
      "Falta carritos",
      "Mantenimientos preventivo no planeado"
    ]
  },
  {
    name: "Material",
    subcauses: [
      "Falta de WO",
      "Falta material del almacén",
      "Material defectuoso (inspección especial)",
      "Material defectuoso (línea detenida)"
    ]
  },
  {
    name: "Medición",
    subcauses: [
      "Muestreo de calidad",
      "Pruebas de sellado"
    ]
  },
  {
    name: "Medio_ambiente",
    subcauses: [
      "Disrupción por facilidades",
      "Particulado (Joint Repair)",
      "Retraso de rutas de buses",
      "Shutdown"
    ]
  },
  {
    name: "Método",
    subcauses: [
      "Documentación errónea",
      "Documentación no disponible",
      "Exceso de tiempo cambio de PN / Conversión",
      "Exceso tiempo en el cierre de turno",
      "Exceso tiempo line clearance",
      "Llenado de línea",
      "Re-trabajo de calidad (algunas operaciones)",
      "Re-trabajo de calidad (toda la línea)",
      "Revisión de metas",
      "Validaciones (flujo lento)",
      "Validaciones (línea detenida)"
    ]
  }
];
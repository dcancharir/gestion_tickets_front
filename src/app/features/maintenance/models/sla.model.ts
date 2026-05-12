export interface Sla {
    slaId:              number;
    categoriaId:        number;
    categoriaNombre:    string;
    prioridadId:        number;
    prioridadNombre:    string;
    tiempoRespuestaMin: number;
    tiempoResolucionMin: number;
    activo:             boolean;
}

export interface CrearSlaDto {
    categoriaId:        number;
    prioridadId:        number;
    tiempoRespuestaMin: number;
    tiempoResolucionMin: number;
}

export interface ActualizarSlaDto extends CrearSlaDto {
    activo: boolean;
}

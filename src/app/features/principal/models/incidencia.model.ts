export interface Incidencia{
    publicId : string;
    numeroTicket : string;
    titulo : string;
    categoria : string;
    prioridad : string;
    nivelPrioridad : number;
    estado : string;
    esEstadoFinal : boolean;
    solicitante : string;
    tecnico : string;
    fechaRegistro : string;
    fechaLimiteResolucion : string;
    cumpleSla : boolean;
    resueltoEnPrimerContacto : boolean;
    descripcion? : string;
    sede?:string
}
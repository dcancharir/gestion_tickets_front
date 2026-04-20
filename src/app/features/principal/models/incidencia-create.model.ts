export interface IncidenciaCreate{
    titulo : string;
    descripcion : string;
    categoriaId : number;
    canalReporte : string;
    impacto : number;
    urgencia : number;
    prioridadId : number;
    sedeId : number;
}
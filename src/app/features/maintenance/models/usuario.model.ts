export interface Usuario{
    publicId : string;
    nombre : string;
    apellidos : string;
    email : string;
    rolId? : number;
    rolNombre? : string;
    activo : boolean;
    fechaCreacion? : Date;
    userName : string;
}
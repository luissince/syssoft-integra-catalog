export interface FormOrderDetail {
    cantidad: number,
    codigo: string,
    id: number | string,
    idImpuesto: string,
    idMedida: string,
    idProducto: string,
    imagen: string,
    nombre: string,
    nombreImpuesto: string,
    nombreMedida: string,
    porcentajeImpuesto: number,
    precio: number
}

export interface FormOrderDelivery {
    email: string
    telefono: string
    celular: string
    direccion: string
    referencia: string
}

export interface FormOrderCustomer {
    idTipoDocumento: string
    documento: string
    informacion: string
    telefono: string
    celular: string
    email: string
    clave: string
    direccion: string
}

export interface FormOrder {
    cliente: FormOrderCustomer

    idComprobante: string
    idMoneda: string
    idSucursal: string
    idUsuario: string
    observacion: string
    nota: string
    instruccion: string

    idTipoEntrega: string
    fechaEntrega: string
    horaEntrega: string

    entrega: FormOrderDelivery | null

    detalles: FormOrderDetail[]
}

export interface FormCustomer {
    idPersona: string,
    idTipoDocumento: string,
    documento: string,
    informacion: string,
    celular: string,
    telefono: string,
    email: string,
    clave: string,
    direccion: string,
}
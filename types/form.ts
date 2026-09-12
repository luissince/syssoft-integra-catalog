export interface FormOrderDetail {
    id?: number | string,
    idProducto: string,
    cantidad: number,
    codigo?: string,
    idImpuesto: string,
    idMedida: string,
    imagen?: string,
    nombre?: string,
    nombreImpuesto?: string,
    nombreMedida?: string,
    porcentajeImpuesto?: number,
    precio: number
}

export interface FormOrderShipping {
    direccion: string | null
    referencia: string | null
    idSucursal: string | null
    fechaPedido: string | null
    horaPedido: string | null
    idAgencia: string | null
    destino: string | null
    receptor: string | null
}

export interface FormOrder {
    idTipoPedido: string
    pedidoEnvio: FormOrderShipping
    idSucursal: string
    idUsuario: string
    idMoneda: string
    idComprobante: string
    idCliente: string
    nota: string

    detalles: FormOrderDetail[]
}

export interface FormCustomer {
    idPersona?: string,
    idTipoDocumento: string,
    documento: string,
    informacion: string,
    cliente?: boolean,
    proveedor?: boolean,
    conductor?: boolean,
    licenciaConducir?: string,
    telefono: string,
    celular: string,
    email?: string,
    clave?: string,
    fechaNacimiento?: string,
    genero?: string,
    direccion?: string,
    idUbigeo?: string,
    estadoCivil?: string,
    predeterminado?: boolean,
    estado?: boolean,
    observacion?: string,
    idUsuario?: string,
}

export interface FormOrderResponse {
    idPedido: string,
    message: string
}
export enum RolUsuario {
  AdminFenamac = 'ADMIN_FENAMAC',
  AdminEstatal = 'ADMIN_ESTATAL',
  AdminMunicipal = 'ADMIN_MUNICIPAL',
  AdminTorneo = 'ADMIN_TORNEO',
  Arbitro = 'ARBITRO',
  Staff = 'STAFF',
}

export enum NivelArbitro {
  Oficial = 'OFICIAL',
  Nacional = 'NACIONAL',
  Fide = 'FIDE',
  Internacional = 'INTERNACIONAL',
}

export enum AlcanceTorneo {
  Municipal = 'MUNICIPAL',
  Estatal = 'ESTATAL',
  Nacional = 'NACIONAL',
}

export enum EstadoTorneo {
  Borrador = 'BORRADOR',
  Publicado = 'PUBLICADO',
  EnCurso = 'EN_CURSO',
  Finalizado = 'FINALIZADO',
  Cancelado = 'CANCELADO',
}

export enum TipoRitmo {
  Clasico = 'CLASICO',
  Rapido = 'RAPIDO',
  Blitz = 'BLITZ',
}

export enum TipoRating {
  Fide = 'FIDE',
  Nacional = 'NACIONAL',
  Estatal = 'ESTATAL',
}

export enum EstadoInscripcion {
  Pendiente = 'PENDIENTE',
  Confirmada = 'CONFIRMADA',
  Cancelada = 'CANCELADA',
}

export enum ResultadoPartida {
  Pendiente = 'PENDIENTE',
  BlancasGana = 'BLANCAS_GANA',
  NegrasGana = 'NEGRAS_GANA',
  Tablas = 'TABLAS',
  WoBlancas = 'WO_BLANCAS',
  WoNegras = 'WO_NEGRAS',
}

export enum TipoTransaccion {
  Ingreso = 'INGRESO',
  Egreso = 'EGRESO',
}

export enum TipoEvidencia {
  Acta = 'ACTA',
  Foto = 'FOTO',
  Documento = 'DOCUMENTO',
}
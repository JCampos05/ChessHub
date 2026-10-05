import { Torneo } from '../../domain/entities/Torneo.js';
import type { AlcanceTorneo } from '../../domain/enums.js';
import type { ITorneoRepository } from '../../domain/repositories/ITorneoRepository.js';
import { RitmoJuego } from '../../domain/value-objects/RitmoJuego.js';
import type { TipoRitmo } from '../../domain/enums.js';

interface DatosCrearTorneo {
  nombre: string;
  alcance: AlcanceTorneo;
  estadoId: string;
  sistemaCompetenciaId: string;
  ritmoTipo: TipoRitmo;
  ritmoMinutosBase: number;
  ritmoIncrementoSegundos: number;
  fechaInicio: Date;
  fechaFin: Date;
  sede?: string;
  creadoPorId: string;
}

export class CrearTorneo {
  constructor(private readonly torneoRepository: ITorneoRepository) {}

  async ejecutar(datos: DatosCrearTorneo): Promise<Torneo> {
    const ritmoJuego = RitmoJuego.crear(datos.ritmoTipo, datos.ritmoMinutosBase, datos.ritmoIncrementoSegundos);

    const torneo = Torneo.crear({
      nombre: datos.nombre,
      alcance: datos.alcance,
      estadoId: datos.estadoId,
      sistemaCompetenciaId: datos.sistemaCompetenciaId,
      ritmoJuego,
      fechaInicio: datos.fechaInicio,
      fechaFin: datos.fechaFin,
      sede: datos.sede,
      creadoPorId: datos.creadoPorId,
    });

    await this.torneoRepository.guardar(torneo);
    return torneo;
  }
}

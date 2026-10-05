import type { Mesa } from '../../domain/entities/Mesa.js';
import { ResultadoPartida } from '../../domain/enums.js';
import type { IMesaRepository } from '../../domain/repositories/IMesaRepository.js';
import type { IPartidaRepository } from '../../domain/repositories/IPartidaRepository.js';

interface DatosReasignarMesa {
  jugadorBlancasId: string;
  jugadorNegrasId?: string;
}

export class MesaNoEncontradaError extends Error {}
export class MesaYaJugadaError extends Error {}

export class ReasignarMesa {
  constructor(
    private readonly mesaRepository: IMesaRepository,
    private readonly partidaRepository: IPartidaRepository,
  ) {}

  async ejecutar(mesaId: string, datos: DatosReasignarMesa): Promise<Mesa> {
    const mesa = await this.mesaRepository.buscarPorId(mesaId);
    if (!mesa) {
      throw new MesaNoEncontradaError(`mesa ${mesaId} no encontrada`);
    }

    // Solo se puede reasignar antes de jugarse - si la Partida de esta mesa
    // ya tiene resultado, reasignar los jugadores invalidaría ese resultado.
    const partida = await this.partidaRepository.buscarPorMesaId(mesaId);
    if (partida && partida.resultado !== ResultadoPartida.Pendiente) {
      throw new MesaYaJugadaError(`la mesa ${mesaId} ya tiene un resultado registrado, no se puede reasignar`);
    }

    mesa.reasignarJugadores(datos.jugadorBlancasId, datos.jugadorNegrasId); // lanza si blancas = negras

    await this.mesaRepository.guardar(mesa);
    return mesa;
  }
}

import { ResultadoPartida } from '../../domain/enums.js';
import type { IPartidaRepository } from '../../domain/repositories/IPartidaRepository.js';

export interface PosicionJugador {
  jugadorId: string;
  puntos: number;
}

const PUNTOS_POR_RESULTADO: Record<ResultadoPartida, { blancas: number; negras: number }> = {
  [ResultadoPartida.Pendiente]: { blancas: 0, negras: 0 },
  [ResultadoPartida.BlancasGana]: { blancas: 1, negras: 0 },
  [ResultadoPartida.NegrasGana]: { blancas: 0, negras: 1 },
  [ResultadoPartida.Tablas]: { blancas: 0.5, negras: 0.5 },
  [ResultadoPartida.WoBlancas]: { blancas: 1, negras: 0 },
  [ResultadoPartida.WoNegras]: { blancas: 0, negras: 1 },
};

export class CalcularTablaPosiciones {
  constructor(private readonly partidaRepository: IPartidaRepository) {}

  async ejecutar(torneoId: string): Promise<PosicionJugador[]> {
    const partidasConMesa = await this.partidaRepository.listarConMesaPorTorneoId(torneoId);
    const puntosPorJugador = new Map<string, number>();

    const sumar = (jugadorId: string, puntos: number): void => {
      puntosPorJugador.set(jugadorId, (puntosPorJugador.get(jugadorId) ?? 0) + puntos);
    };

    for (const { partida, mesa } of partidasConMesa) {
      if (partida.resultado === ResultadoPartida.Pendiente) {
        continue; // no jugada todavía, no suma
      }
      const puntos = PUNTOS_POR_RESULTADO[partida.resultado];
      sumar(mesa.jugadorBlancasId, puntos.blancas);
      if (mesa.jugadorNegrasId !== undefined) {
        sumar(mesa.jugadorNegrasId, puntos.negras);
      }
    }

    return [...puntosPorJugador.entries()]
      .map(([jugadorId, puntos]) => ({ jugadorId, puntos }))
      .sort((a, b) => b.puntos - a.puntos);
  }
}

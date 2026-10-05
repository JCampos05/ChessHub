import type { Mesa } from '../entities/Mesa.js';
import type { Partida } from '../entities/Partida.js';

export interface IPartidaRepository {
  guardar(partida: Partida): Promise<void>;
  buscarPorId(id: string): Promise<Partida | undefined>;
  // Partida no tiene torneoId directo (Partida -> Mesa -> Ronda -> Torneo), así
  // que CalcularTablaPosiciones necesita la Mesa junto con cada Partida para
  // saber quién jugó con blancas/negras.
  listarConMesaPorTorneoId(torneoId: string): Promise<Array<{ partida: Partida; mesa: Mesa }>>;
  // Usado por ReasignarMesa para bloquear la reasignación si la mesa ya se jugó.
  buscarPorMesaId(mesaId: string): Promise<Partida | undefined>;
}

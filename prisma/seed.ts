import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.sistemaCompetencia.createMany({
    data: [
      { clave: "SUIZO", nombre: "Sistema Suizo", esPorEquipos: false },
      { clave: "ROUND_ROBIN_INDIVIDUAL", nombre: "Round Robin (individual)", esPorEquipos: false },
      { clave: "ROUND_ROBIN_EQUIPO", nombre: "Round Robin (por equipos)", esPorEquipos: true },
    ],
    skipDuplicates: true,
  });

  await prisma.metodoDesempate.createMany({
    data: [
      { clave: "BUCHHOLZ", nombre: "Buchholz" },
      { clave: "SONNEBORN_BERGER", nombre: "Sonneborn-Berger" },
      { clave: "PROGRESIVO", nombre: "Progresivo" },
      { clave: "ENFRENTAMIENTO_DIRECTO", nombre: "Enfrentamiento directo" },
    ],
    skipDuplicates: true,
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

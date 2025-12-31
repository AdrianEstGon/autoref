import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed de datos...');

  // Crear temporadas
  const temporada2425 = await prisma.temporada.upsert({
    where: { id: 'temp-2024-2025' },
    update: {},
    create: {
      id: 'temp-2024-2025',
      nombre: '2024/2025',
      fechaInicio: new Date('2024-09-01'),
      fechaFin: new Date('2025-06-30'),
      activa: true,
    },
  });

  const temporada2526 = await prisma.temporada.upsert({
    where: { id: 'temp-2025-2026' },
    update: {},
    create: {
      id: 'temp-2025-2026',
      nombre: '2025/2026',
      fechaInicio: new Date('2025-09-01'),
      fechaFin: new Date('2026-06-30'),
      activa: false,
    },
  });

  console.log('✅ Temporadas creadas');

  // Crear modalidades
  const futbolSala = await prisma.modalidad.upsert({
    where: { id: 'mod-futbol-sala' },
    update: {},
    create: {
      id: 'mod-futbol-sala',
      nombre: 'Fútbol Sala',
      descripcion: 'Fútbol sala federado',
      activo: true,
    },
  });

  const baloncesto = await prisma.modalidad.upsert({
    where: { id: 'mod-baloncesto' },
    update: {},
    create: {
      id: 'mod-baloncesto',
      nombre: 'Baloncesto',
      descripcion: 'Baloncesto federado',
      activo: true,
    },
  });

  const voleibol = await prisma.modalidad.upsert({
    where: { id: 'mod-voleibol' },
    update: {},
    create: {
      id: 'mod-voleibol',
      nombre: 'Voleibol',
      descripcion: 'Voleibol federado',
      activo: true,
    },
  });

  console.log('✅ Modalidades creadas');

  // Crear categorías para Fútbol Sala
  const categoriasFutsal = [
    { id: 'cat-fs-prebenjamin', nombre: 'Prebenjamín', edadMinima: 6, edadMaxima: 7, orden: 1 },
    { id: 'cat-fs-benjamin', nombre: 'Benjamín', edadMinima: 8, edadMaxima: 9, orden: 2 },
    { id: 'cat-fs-alevin', nombre: 'Alevín', edadMinima: 10, edadMaxima: 11, orden: 3 },
    { id: 'cat-fs-infantil', nombre: 'Infantil', edadMinima: 12, edadMaxima: 13, orden: 4 },
    { id: 'cat-fs-cadete', nombre: 'Cadete', edadMinima: 14, edadMaxima: 15, orden: 5 },
    { id: 'cat-fs-juvenil', nombre: 'Juvenil', edadMinima: 16, edadMaxima: 18, orden: 6 },
    { id: 'cat-fs-senior', nombre: 'Senior', edadMinima: 19, edadMaxima: null, orden: 7 },
    { id: 'cat-fs-veteranos', nombre: 'Veteranos', edadMinima: 35, edadMaxima: null, orden: 8 },
  ];

  for (const cat of categoriasFutsal) {
    await prisma.categoria.upsert({
      where: { id: cat.id },
      update: {},
      create: {
        id: cat.id,
        nombre: cat.nombre,
        edadMinima: cat.edadMinima,
        edadMaxima: cat.edadMaxima,
        orden: cat.orden,
        modalidadId: futbolSala.id,
        activo: true,
      },
    });
  }

  // Crear categorías para Baloncesto
  const categoriasBasket = [
    { id: 'cat-bk-minibasket', nombre: 'Minibasket', edadMinima: 8, edadMaxima: 11, orden: 1 },
    { id: 'cat-bk-infantil', nombre: 'Infantil', edadMinima: 12, edadMaxima: 13, orden: 2 },
    { id: 'cat-bk-cadete', nombre: 'Cadete', edadMinima: 14, edadMaxima: 15, orden: 3 },
    { id: 'cat-bk-junior', nombre: 'Junior', edadMinima: 16, edadMaxima: 18, orden: 4 },
    { id: 'cat-bk-senior', nombre: 'Senior', edadMinima: 19, edadMaxima: null, orden: 5 },
  ];

  for (const cat of categoriasBasket) {
    await prisma.categoria.upsert({
      where: { id: cat.id },
      update: {},
      create: {
        id: cat.id,
        nombre: cat.nombre,
        edadMinima: cat.edadMinima,
        edadMaxima: cat.edadMaxima,
        orden: cat.orden,
        modalidadId: baloncesto.id,
        activo: true,
      },
    });
  }

  // Crear categorías para Voleibol
  const categoriasVoley = [
    { id: 'cat-vb-alevin', nombre: 'Alevín', edadMinima: 10, edadMaxima: 11, orden: 1 },
    { id: 'cat-vb-infantil', nombre: 'Infantil', edadMinima: 12, edadMaxima: 13, orden: 2 },
    { id: 'cat-vb-cadete', nombre: 'Cadete', edadMinima: 14, edadMaxima: 15, orden: 3 },
    { id: 'cat-vb-juvenil', nombre: 'Juvenil', edadMinima: 16, edadMaxima: 18, orden: 4 },
    { id: 'cat-vb-senior', nombre: 'Senior', edadMinima: 19, edadMaxima: null, orden: 5 },
  ];

  for (const cat of categoriasVoley) {
    await prisma.categoria.upsert({
      where: { id: cat.id },
      update: {},
      create: {
        id: cat.id,
        nombre: cat.nombre,
        edadMinima: cat.edadMinima,
        edadMaxima: cat.edadMaxima,
        orden: cat.orden,
        modalidadId: voleibol.id,
        activo: true,
      },
    });
  }

  console.log('✅ Categorías creadas');

  console.log('');
  console.log('🎉 Seed completado exitosamente!');
  console.log('');
  console.log('Datos creados:');
  console.log(`  - 2 temporadas (2024/2025 activa, 2025/2026)`);
  console.log(`  - 3 modalidades (Fútbol Sala, Baloncesto, Voleibol)`);
  console.log(`  - ${categoriasFutsal.length + categoriasBasket.length + categoriasVoley.length} categorías`);
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

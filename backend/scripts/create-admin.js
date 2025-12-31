const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  try {
    // Verificar si ya existe
    const existingAdmin = await prisma.usuario.findUnique({
      where: { email: 'admin@federacion.com' }
    })

    if (existingAdmin) {
      console.log('⚠️  El usuario admin ya existe')
      console.log('📧 Email: admin@federacion.com')
      return
    }

    // Crear nuevo admin
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const admin = await prisma.usuario.create({
      data: {
        email: 'admin@federacion.com',
        password: hashedPassword,
        rol: 'FEDERACION',
        activo: true
      }
    })

    console.log('✅ Usuario admin creado exitosamente!')
    console.log('📧 Email: admin@federacion.com')
    console.log('🔑 Password: admin123')
    console.log('')
    console.log('Ahora puedes iniciar sesión en http://localhost:3000')
  } catch (error) {
    console.error('❌ Error creando usuario admin:', error.message)
    throw error
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

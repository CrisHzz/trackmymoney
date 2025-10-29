/**
 * Configuración de Jest para BDD
 */

// Configurar variables de entorno para pruebas
process.env.NODE_ENV = 'test';
process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'test_clerk_key';
process.env.CLERK_SECRET_KEY = 'test_clerk_secret';

console.log('✅ Entorno de pruebas BDD configurado');
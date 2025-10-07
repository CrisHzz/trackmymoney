const { chromium } = require('@playwright/test');

async function createTestUser() {
  console.log('🔧 Creando usuario de prueba...');
  
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  try {
    // Navegar a la página de registro
    await page.goto('http://localhost:3000/pages/sign-up');
    await page.waitForLoadState('networkidle');
    
    console.log('📝 Llenando formulario de registro...');
    
    // Buscar campos de registro
    const emailInput = page.locator('input[type="email"]').first();
    const passwordInput = page.locator('input[type="password"]').first();
    const submitButton = page.locator('button').filter({ hasText: /continuar|registr|sign/i }).first();
    
    // Llenar formulario
    await emailInput.fill('miwaj37560@erynka.com');
    await passwordInput.fill('2536182Pepito.');
    
    console.log('🔘 Haciendo clic en registrar...');
    await submitButton.click();
    
    // Esperar redirección
    await page.waitForTimeout(5000);
    
    const currentUrl = page.url();
    console.log(`📍 URL después del registro: ${currentUrl}`);
    
    if (!currentUrl.includes('/sign-up')) {
      console.log('✅ Usuario creado exitosamente');
    } else {
      console.log('❌ Error al crear usuario');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await browser.close();
  }
}

createTestUser();

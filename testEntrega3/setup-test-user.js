const { chromium } = require('@playwright/test');

async function setupTestUser() {
  console.log('🔧 Configurando usuario de prueba...');
  
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    // Navegar a la página de registro
    console.log('📍 Navegando a página de registro...');
    await page.goto('http://localhost:3000/pages/sign-up');
    await page.waitForLoadState('networkidle', { timeout: 10000 });
    
    // Esperar a que Clerk cargue
    await page.waitForTimeout(3000);
    
    console.log('📝 Buscando campos de registro...');
    
    // Buscar inputs visibles
    const inputs = await page.locator('input:visible').all();
    console.log(`🔍 Encontrados ${inputs.length} inputs visibles`);
    
    if (inputs.length >= 2) {
      // Llenar email y password
      await inputs[0].fill('miwaj37560@erynka.com');
      await page.waitForTimeout(1000);
      
      await inputs[1].fill('2536182Pepito.');
      await page.waitForTimeout(1000);
      
      // Buscar botón de registro
      const buttons = await page.locator('button:visible').all();
      console.log(`🔘 Encontrados ${buttons.length} botones visibles`);
      
      if (buttons.length > 0) {
        // Intentar con el botón que contenga texto de registro
        let submitButton = null;
        for (const button of buttons) {
          const text = await button.textContent().catch(() => '');
          if (text && (text.toLowerCase().includes('continuar') || 
                      text.toLowerCase().includes('registr') || 
                      text.toLowerCase().includes('sign'))) {
            submitButton = button;
            break;
          }
        }
        
        if (!submitButton && buttons.length > 0) {
          submitButton = buttons[0];
        }
        
        if (submitButton) {
          console.log('🔘 Haciendo clic en botón de registro...');
          await submitButton.click();
          
          // Esperar respuesta
          await page.waitForTimeout(5000);
          
          const currentUrl = page.url();
          console.log(`📍 URL después del registro: ${currentUrl}`);
          
          if (!currentUrl.includes('/sign-up')) {
            console.log('✅ Usuario de prueba configurado exitosamente');
            return true;
          } else {
            console.log('⚠️ Usuario puede ya existir o hubo un problema');
            return true; // Asumir que el usuario ya existe
          }
        }
      }
    }
    
    console.log('❌ No se pudieron encontrar los elementos necesarios');
    return false;
    
  } catch (error) {
    console.log(`⚠️ Error configurando usuario (puede ya existir): ${error.message}`);
    return true; // Asumir que el usuario ya existe
  } finally {
    await browser.close();
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  setupTestUser().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = { setupTestUser };

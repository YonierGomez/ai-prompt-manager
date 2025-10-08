// Script para limpiar caché manualmente
(function() {
  'use strict';

  // Función para limpiar todos los cachés
  async function clearAllCaches() {
    try {
      // Limpiar caché del navegador
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map(cacheName => caches.delete(cacheName))
        );
        console.log('✅ Caché del Service Worker limpiado');
      }

      // Desregistrar Service Worker
      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(
          registrations.map(registration => registration.unregister())
        );
        console.log('✅ Service Worker desregistrado');
      }

      // Limpiar localStorage
      localStorage.clear();
      console.log('✅ localStorage limpiado');

      // Limpiar sessionStorage
      sessionStorage.clear();
      console.log('✅ sessionStorage limpiado');

      // Mostrar mensaje de éxito
      alert('🎉 Caché limpiado completamente. La página se recargará automáticamente.');
      
      // Recargar la página
      window.location.reload(true);
    } catch (error) {
      console.error('❌ Error al limpiar caché:', error);
      alert('Error al limpiar caché. Revisa la consola para más detalles.');
    }
  }

  // Función para mostrar información del caché
  async function showCacheInfo() {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        console.log('📦 Cachés disponibles:', cacheNames);
        
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const keys = await cache.keys();
          console.log(`📁 ${cacheName}:`, keys.map(req => req.url));
        }
      }

      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        console.log('🔧 Service Workers registrados:', registrations.length);
      }

      console.log('💾 localStorage items:', Object.keys(localStorage).length);
      console.log('🗂️ sessionStorage items:', Object.keys(sessionStorage).length);
    } catch (error) {
      console.error('❌ Error al obtener información del caché:', error);
    }
  }

  // Exponer funciones globalmente para uso en consola
  window.clearAllCaches = clearAllCaches;
  window.showCacheInfo = showCacheInfo;

  console.log('🛠️ Herramientas de caché cargadas:');
  console.log('   - clearAllCaches(): Limpia todo el caché');
  console.log('   - showCacheInfo(): Muestra información del caché');
})();

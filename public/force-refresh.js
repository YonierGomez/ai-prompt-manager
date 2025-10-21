// Script para forzar recarga completa y eliminar todo tipo de caché
(function() {
  'use strict';

  // Función para forzar recarga completa
  function forceCompleteRefresh() {
    try {
      // 1. Limpiar todos los cachés del Service Worker
      if ('caches' in window) {
        caches.keys().then(function(cacheNames) {
          return Promise.all(
            cacheNames.map(function(cacheName) {
              console.log('🗑️ Eliminando caché:', cacheName);
              return caches.delete(cacheName);
            })
          );
        }).then(function() {
          console.log('✅ Todos los cachés del Service Worker eliminados');
        });
      }

      // 2. Desregistrar todos los Service Workers
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
          registrations.forEach(function(registration) {
            console.log('🔧 Desregistrando Service Worker:', registration.scope);
            registration.unregister();
          });
        });
      }

      // 3. Limpiar almacenamiento local
      try {
        localStorage.clear();
        sessionStorage.clear();
        console.log('🧹 Storage local limpiado');
      } catch (e) {
        console.warn('⚠️ No se pudo limpiar storage:', e);
      }

      // 4. Limpiar cookies del dominio actual
      document.cookie.split(";").forEach(function(c) {
        document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      // 5. Agregar timestamp para evitar caché del navegador
      const timestamp = new Date().getTime();
      const currentUrl = new URL(window.location.href);
      currentUrl.searchParams.set('_t', timestamp);
      
      console.log('🔄 Forzando recarga completa...');
      
      // 6. Recargar con caché deshabilitado
      window.location.replace(currentUrl.href);
      
    } catch (error) {
      console.error('❌ Error en recarga forzada:', error);
      // Fallback: recarga normal con caché deshabilitado
      window.location.reload(true);
    }
  }

  // Función para detectar F5 y Ctrl+R
  function setupForceRefreshListeners() {
    document.addEventListener('keydown', function(event) {
      // F5 o Ctrl+R o Cmd+R
      if (event.key === 'F5' || 
          (event.ctrlKey && event.key === 'r') || 
          (event.metaKey && event.key === 'r')) {
        
        event.preventDefault();
        console.log('🚀 Detectada tecla de recarga, forzando limpieza completa...');
        forceCompleteRefresh();
      }
    });
  }

  // Función para agregar headers anti-caché a todas las requests
  function interceptFetchRequests() {
    const originalFetch = window.fetch;
    
    window.fetch = function(...args) {
      const [resource, config = {}] = args;
      
      // Agregar headers anti-caché
      const headers = {
        'Cache-Control': 'no-cache, no-store, must-revalidate, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        ...config.headers
      };

      // Agregar timestamp a URLs para evitar caché
      let url = resource;
      if (typeof resource === 'string') {
        const urlObj = new URL(resource, window.location.origin);
        urlObj.searchParams.set('_t', Date.now());
        url = urlObj.toString();
      }

      return originalFetch(url, {
        ...config,
        cache: 'no-store',
        headers
      });
    };
  }

  // Función para limpiar caché automáticamente al cargar
  function autoCleanOnLoad() {
    // Solo limpiar si no hay parámetro de timestamp reciente
    const urlParams = new URLSearchParams(window.location.search);
    const timestamp = urlParams.get('_t');
    const now = Date.now();
    
    if (!timestamp || (now - parseInt(timestamp)) > 5000) {
      console.log('🧹 Limpieza automática de caché al cargar...');
      
      if ('caches' in window) {
        caches.keys().then(function(cacheNames) {
          cacheNames.forEach(function(cacheName) {
            caches.delete(cacheName);
          });
        });
      }
    }
  }

  // Inicializar todo
  function init() {
    console.log('🛠️ Sistema anti-caché inicializado');
    console.log('   - F5, Ctrl+R, Cmd+R: Recarga con limpieza completa');
    console.log('   - Fetch interceptado con headers anti-caché');
    console.log('   - Limpieza automática de Service Worker cache');
    
    setupForceRefreshListeners();
    interceptFetchRequests();
    autoCleanOnLoad();
    
    // Exponer función global para uso manual
    window.forceCompleteRefresh = forceCompleteRefresh;
  }

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

export default function HomePage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-slate-200 via-blue-200 to-indigo-300 bg-clip-text text-transparent">
        ¡Bienvenido a AI Prompt Manager! ✨
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Prompts</h3>
          <p className="text-3xl font-bold text-blue-600">24</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Favoritos</h3>
          <p className="text-3xl font-bold text-red-600">8</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Usos Totales</h3>
          <p className="text-3xl font-bold text-green-600">156</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Categorías</h3>
          <p className="text-3xl font-bold text-purple-600">6</p>
        </div>
      </div>

      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold mb-4">¡Comienza tu viaje con IA!</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Crea tu primer prompt para potenciar tu trabajo con inteligencia artificial. 
          Organiza, gestiona y comparte tus mejores prompts.
        </p>
        <div className="space-x-4">
          <a 
            href="/new" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            ➕ Crear Mi Primer Prompt
          </a>
          <a 
            href="/templates" 
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            ✨ Explorar Plantillas
          </a>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-8">
        <a href="/new" className="p-4 text-center bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-2">➕</div>
          <div className="font-medium text-sm">Crear Prompt</div>
        </a>
        
        <a href="/templates" className="p-4 text-center bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-2">✨</div>
          <div className="font-medium text-sm">Plantillas</div>
        </a>
        
        <a href="/favorites" className="p-4 text-center bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-2">❤️</div>
          <div className="font-medium text-sm">Favoritos</div>
        </a>
        
        <a href="/import" className="p-4 text-center bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-2">📥</div>
          <div className="font-medium text-sm">Importar</div>
        </a>
        
        <a href="/export" className="p-4 text-center bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-pink-500 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-2">📤</div>
          <div className="font-medium text-sm">Exportar</div>
        </a>
        
        <a href="/analytics" className="p-4 text-center bg-white dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-shadow">
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white text-xl mx-auto mb-2">📊</div>
          <div className="font-medium text-sm">Análisis</div>
        </a>
      </div>
    </div>
  )
}

import { useApp } from '../hooks/useApp';

const Hero = () => {
  const { openAuthModal } = useApp();

  return (
    <section className="relative bg-gradient-to-r from-[#004aad] to-[#0066cc] py-20">
      {/* Patrón de fondo sutil */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #ffffff 2px, transparent 2px), radial-gradient(circle at 75% 75%, #ffffff 2px, transparent 2px)`,
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contenido principal */}
          <div className="text-white space-y-8">
            <div>
              <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Descubre la
                <span className="block text-yellow-300">Robótica Educativa</span>
              </h1>
              <p className="text-xl text-blue-100 leading-relaxed mb-8">
                Cursos educativos de robótica y electrónica diseñados para que los niños aprendan ciencia y tecnología de forma divertida y segura.
              </p>
            </div>

            {/* Botones de acción */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => openAuthModal('register')}
                className="bg-yellow-400 hover:bg-yellow-500 text-[#004aad] px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                Ver Cursos Educativos
              </button>
            </div>

            {/* Estadísticas compactas */}
            <div className="flex gap-8 pt-4">
              <div>
                <div className="text-2xl font-bold text-yellow-300">5K+</div>
                <div className="text-sm text-blue-200">Niños aprendiendo</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-300">98%</div>
                <div className="text-sm text-blue-200">Padres satisfechos</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-300">100%</div>
                <div className="text-sm text-blue-200">Seguro</div>
              </div>
            </div>
          </div>

          {/* Panel visual */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <div className="space-y-6">
                {/* Simulación de kit de robótica */}
                <div className="bg-white/20 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-yellow-400 rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-[#004aad]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Kit Robot Caminante</div>
                      <div className="text-blue-200 text-sm">8-14 años • 25 actividades</div>
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-full h-2">
                    <div className="bg-yellow-400 h-2 rounded-full w-4/5"></div>
                  </div>
                  <div className="text-xs text-blue-200 mt-2">Progreso del proyecto: 80%</div>
                </div>

                <div className="bg-white/20 rounded-lg p-4">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-10 h-10 bg-[#003399] rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-white font-semibold">Kit Electrónica Básica</div>
                      <div className="text-blue-200 text-sm">¡Completado! ⭐</div>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-2">
                  <div className="text-yellow-300 font-semibold text-lg">¡Aprende jugando!</div>
                  <div className="text-blue-100 text-sm">Más de 20 cursos educativos disponibles</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

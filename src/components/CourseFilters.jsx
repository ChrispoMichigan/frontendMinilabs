import { useState } from 'react';
import { categories, levels, ageRanges } from '../utils/mockData';

const CourseFilters = ({ onFilterChange }) => {
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedLevel, setSelectedLevel] = useState('Todos');
  const [selectedAge, setSelectedAge] = useState('Todos');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState([0, 300]);

  const handleFilterChange = (type, value) => {
    let newFilters = {
      category: selectedCategory,
      level: selectedLevel,
      age: selectedAge,
      search: searchTerm,
      priceRange
    };

    switch (type) {
      case 'category':
        setSelectedCategory(value);
        newFilters.category = value;
        break;
      case 'level':
        setSelectedLevel(value);
        newFilters.level = value;
        break;
      case 'age':
        setSelectedAge(value);
        newFilters.age = value;
        break;
      case 'search':
        setSearchTerm(value);
        newFilters.search = value;
        break;
      case 'price':
        setPriceRange(value);
        newFilters.priceRange = value;
        break;
    }

    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setSelectedCategory('Todos');
    setSelectedLevel('Todos');
    setSelectedAge('Todos');
    setSearchTerm('');
    setPriceRange([0, 300]);
    onFilterChange({
      category: 'Todos',
      level: 'Todos',
      age: 'Todos',
      search: '',
      priceRange: [0, 300]
    });
  };

  return (
    <div className="bg-gradient-to-r from-white via-blue-50/50 to-[#004aad]/5 rounded-2xl shadow-xl p-6 mb-8 border border-[#004aad]/20 relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#004aad]/10 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-yellow-400/10 to-transparent rounded-full blur-xl"></div>
      
      <div className="relative flex flex-col lg:flex-row gap-6">
        {/* Búsqueda */}
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar Cursos
          </label>
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="Buscar por nombre o temática..."
              className="w-full pl-10 pr-4 py-2 border border-[#004aad]/30 rounded-lg focus:ring-2 focus:ring-[#004aad] focus:border-[#004aad] transition-all duration-300 bg-white/80 backdrop-blur-sm"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoría
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => handleFilterChange('category', e.target.value)}
            className="w-full px-3 py-2 border border-[#004aad]/30 rounded-lg focus:ring-2 focus:ring-[#004aad] focus:border-[#004aad] transition-all duration-300 bg-white/80 backdrop-blur-sm"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Edad */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Edad
          </label>
          <select
            value={selectedAge}
            onChange={(e) => handleFilterChange('age', e.target.value)}
            className="w-full px-3 py-2 border border-[#004aad]/30 rounded-lg focus:ring-2 focus:ring-[#004aad] focus:border-[#004aad] transition-all duration-300 bg-white/80 backdrop-blur-sm"
          >
            {ageRanges.map(age => (
              <option key={age} value={age}>
                {age}
              </option>
            ))}
          </select>
        </div>

        {/* Nivel */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dificultad
          </label>
          <select
            value={selectedLevel}
            onChange={(e) => handleFilterChange('level', e.target.value)}
            className="w-full px-3 py-2 border border-[#004aad]/30 rounded-lg focus:ring-2 focus:ring-[#004aad] focus:border-[#004aad] transition-all duration-300 bg-white/80 backdrop-blur-sm"
          >
            {levels.map(level => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Rango de precio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Precio máximo: ${priceRange[1]}
          </label>
          <input
            type="range"
            min="0"
            max="300"
            value={priceRange[1]}
            onChange={(e) => handleFilterChange('price', [0, parseInt(e.target.value)])}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>$0</span>
            <span>$300</span>
          </div>
        </div>

        {/* Botón limpiar filtros */}
        <div className="flex items-end">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-[#004aad]/10 hover:to-[#0066cc]/10 text-gray-700 hover:text-[#004aad] rounded-lg font-medium transition-all duration-300 whitespace-nowrap border border-gray-300 hover:border-[#004aad]/30"
          >
            Limpiar Filtros
          </button>
        </div>
      </div>

      {/* Filtros activos */}
      <div className="mt-4 flex flex-wrap gap-2">
        {selectedCategory !== 'Todos' && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
            {selectedCategory}
            <button
              onClick={() => handleFilterChange('category', 'Todos')}
              className="ml-2 text-blue-600 hover:text-blue-800"
            >
              ×
            </button>
          </span>
        )}
        {selectedLevel !== 'Todos' && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
            {selectedLevel}
            <button
              onClick={() => handleFilterChange('level', 'Todos')}
              className="ml-2 text-green-600 hover:text-green-800"
            >
              ×
            </button>
          </span>
        )}
        {selectedAge !== 'Todos' && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
            {selectedAge}
            <button
              onClick={() => handleFilterChange('age', 'Todos')}
              className="ml-2 text-purple-600 hover:text-purple-800"
            >
              ×
            </button>
          </span>
        )}
        {searchTerm && (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
            "{searchTerm}"
            <button
              onClick={() => handleFilterChange('search', '')}
              className="ml-2 text-yellow-600 hover:text-yellow-800"
            >
              ×
            </button>
          </span>
        )}
      </div>
    </div>
  );
};

export default CourseFilters;

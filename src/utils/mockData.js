export const mockCourses = [
  {
    id: 1,
    title: "Kit Robótica Básica - Mi Primer Robot",
    description: "Kit perfecto para iniciar en el mundo de la robótica. Incluye sensores, motores y guía paso a paso para niños de 6-10 años.",
    image: "https://images.unsplash.com/photo-1561144257-e32e5653b1c3?w=400&h=250&fit=crop",
    price: 79.99,
    originalPrice: 99.99,
    duration: "2-3 horas de armado",
    lessons: 15,
    level: "Principiante",
    instructor: "Ing. María Robotics",
    rating: 4.9,
    students: 1250,
    tags: ["Robótica", "Principiante", "6-10 años"],
    ageRange: "6-10 años",
    components: ["Arduino UNO", "Sensores", "LED", "Motores"]
  },
  {
    id: 2,
    title: "Kit Electrónica Divertida - Circuitos Mágicos",
    description: "Aprende electrónica básica con experimentos seguros y divertidos. Crea luces, sonidos y efectos increíbles.",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=250&fit=crop",
    price: 59.99,
    originalPrice: 79.99,
    duration: "1-2 horas por proyecto",
    lessons: 20,
    level: "Principiante",
    instructor: "Prof. Carlos Electrón",
    rating: 4.8,
    students: 1890,
    tags: ["Electrónica", "Circuitos", "5-12 años"],
    ageRange: "5-12 años",
    components: ["Breadboard", "Resistencias", "LED", "Cables"]
  },
  {
    id: 3,
    title: "Robot Caminante - Aventura Mecánica",
    description: "Construye tu propio robot que camina y evita obstáculos. Perfecto para entender mecánica y programación básica.",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=250&fit=crop",
    price: 129.99,
    originalPrice: 159.99,
    duration: "3-4 horas de construcción",
    lessons: 25,
    level: "Intermedio",
    instructor: "Dra. Ana Mecánica",
    rating: 4.9,
    students: 750,
    tags: ["Robótica", "Mecánica", "8-14 años"],
    ageRange: "8-14 años",
    components: ["Microcontrolador", "Sensores ultrasónicos", "Motores", "Chasis"]
  },
  {
    id: 4,
    title: "Kit Solar Educativo - Energía Verde",
    description: "Descubre las energías renovables construyendo proyectos que funcionan con energía solar. ¡Ecológico y educativo!",
    image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=250&fit=crop",
    price: 89.99,
    originalPrice: 119.99,
    duration: "2-3 horas por experimento",
    lessons: 18,
    level: "Intermedio",
    instructor: "Ing. Diego Solar",
    rating: 4.7,
    students: 920,
    tags: ["Energía Solar", "Ecología", "9-15 años"],
    ageRange: "9-15 años",
    components: ["Panel solar", "Motor solar", "Engranajes", "Cables"]
  },
  {
    id: 5,
    title: "Laboratorio de Inventos - Pequeños Científicos",
    description: "Kit completo para experimentar con ciencia y tecnología. Más de 50 experimentos seguros y educativos.",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop",
    price: 109.99,
    originalPrice: 139.99,
    duration: "1 hora por experimento",
    lessons: 50,
    level: "Principiante",
    instructor: "Prof. Laura Ciencia",
    rating: 4.8,
    students: 2100,
    tags: ["Ciencia", "Experimentos", "7-13 años"],
    ageRange: "7-13 años",
    components: ["Kit químico seguro", "Microscopio", "Imanes", "Materiales varios"]
  },
  {
    id: 6,
    title: "Robot Programable - Código para Niños",
    description: "Aprende programación de manera visual construyendo y programando tu propio robot. Incluye app móvil.",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=250&fit=crop",
    price: 149.99,
    originalPrice: 199.99,
    duration: "4-5 horas completas",
    lessons: 30,
    level: "Avanzado",
    instructor: "Ing. Javier Code",
    rating: 4.9,
    students: 650,
    tags: ["Programación", "Robot", "10-16 años"],
    ageRange: "10-16 años",
    components: ["Robot programable", "Sensores múltiples", "App móvil", "Manual digital"]
  }
];

export const categories = [
  "Todos",
  "Robótica",
  "Electrónica",
  "Energía Solar",
  "Ciencia",
  "Programación"
];

export const levels = [
  "Todos",
  "Principiante",
  "Intermedio",
  "Avanzado"
];

export const ageRanges = [
  "Todos",
  "5-8 años",
  "9-12 años",
  "13-16 años"
];

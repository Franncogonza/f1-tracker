# 🏎️ F1 Tracker

Aplicación web desarrollada en **Angular v19.2.14** que permite visualizar información de la Fórmula 1: equipos, pilotos, rankings y buscador dinámico. Construida como parte de una evaluación técnica.

## 📦 Requisitos
- Node.js v18+
- Angular CLI v16 o superior
- Git

## 🚀 Instalación y ejecución

1. **Clonar el repositorio**
git clone https://github.com/Franncogonza/f1-tracker.git

**Abrir en consola**
2. cd f1-tracker 

3. **Instalar dependencias**
npm install

4. **Levantar el servidor en modo desarrollo**
npm run start

5. **Abrir en el navegador**
   - Navegar a `http://localhost:4200` para ver la aplicación en acción

## 📖 Descripción del proyecto
🛠️ Stack tecnológico
Angular 19.2.14 con arquitectura standalone y lazy loading

NG-Zorro como librería de componentes UI

RxJS para programación reactiva

API pública: https://f1api.dev

## 📊 Funcionalidades
📅 Selección de año y visualización de equipos

🧑‍🚀 Visualización de pilotos por equipo

🔍 Buscador de pilotos por nombre y año (mínimo 4 caracteres)

📈 Gráficos de ranking (Top 5) de pilotos y constructores por año

🌐 Acceso directo a Wikipedia de cada piloto

## 📂 Estructura del proyecto
src/
├── app/
│   ├── core/              # Servicios, modelos y pipes reutilizables
│   ├── pages/             # Componentes de páginas: teams, drivers, standings, etc.
│   ├── shared/            # Componentes compartidos
│   └── app.config.ts      # Configuración de rutas
├── assets/
└── index.html


## 📚 Documentación
📌 Consideraciones técnicas
El buscador filtra pilotos solo cuando se ingresan 4 o más caracteres.

Arquitectura preparada para SSR, aunque se ejecuta en modo client-side.

Manejo robusto de fechas inconsistentes de la API (dd/MM/yyyy y yyyy-MM-dd).

## 🛠️ Contribuciones
👨‍💻 Autor
Desarrollado por Franco David González
🔗 GitHub - Franncogonza

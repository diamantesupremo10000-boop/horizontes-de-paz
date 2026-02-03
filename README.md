# 🕊️ Horizontes de Paz

> Un MMORPG de exploración y restauración pacífica en el navegador.

![License](https://img.shields.io/badge/license-MIT-green)
![Tech](https://img.shields.io/badge/Three.js-r160-white)
![Platform](https://img.shields.io/badge/PWA-Mobile%20Ready-blue)
![Status](https://img.shields.io/badge/Status-Beta-orange)

**Horizontes de Paz** es una experiencia web inmersiva de mundo abierto ("Open World") que combina gráficos estilo anime (Cel-Shading) con mecánicas de juego pacíficas. Inspirado técnicamente en títulos como *Wuthering Waves* o *Genshin Impact*, pero enfocado en la restauración de la naturaleza y la contemplación de la creación.

![Gameplay Screenshot](./public/icon-512.png) 
*(Reemplaza esta línea con una captura real de tu juego cuando puedas)*

## ✨ Características Principales

### 🎨 Gráficos High-End en Web
* **Anime Toon Shader:** Renderizado personalizado para personajes con bordes y sombreado por bandas.
* **Atmósfera Volumétrica:** Sistema de partículas GPU, Ciclo Día/Noche dinámico y Niebla exponencial.
* **Post-Procesado:** Efecto Bloom (resplandor) cinematográfico y Tone Mapping ACES Filmic.
* **Vegetación Masiva:** Sistema de `InstancedMesh` capaz de renderizar 25,000+ briznas de hierba con física de viento e interacción con el jugador.
* **Agua Dinámica:** Shaders personalizados con desplazamiento de vértices para simular oleaje.

### 🛠️ Ingeniería Full-Stack
* **Híbrido Online/Offline:** Funciona como **PWA (Progressive Web App)** instalable. Si se pierde la conexión, el juego continúa en modo local sin interrupciones.
* **Multijugador Real-Time:** Servidor WebSocket (Node.js) propio que sincroniza posición y acciones de jugadores en la misma sala.
* **Optimización Móvil:** Controles táctiles (Joystick virtual), `touch-action` handling y optimización de pixel ratio para Android/iOS.

### 🎮 Jugabilidad
* **Locomoción Avanzada:** Sistema de movimiento fluido con **Planeador (Glider)** activable en el aire.
* **Mecánica de Restauración:** El mundo reacciona a tus acciones. Transforma zonas grises/muertas en áreas verdes y vivas mediante shaders dinámicos.
* **Audio 3D:** Sonido posicional espacial y mezcla de audio ambiental adaptativa según la hora del día.
* **Compañero IA:** Sistema de "Lazy Follow" para el Eco acompañante.

## 🚀 Tecnologías

* **Frontend:** JavaScript (ES6+), [Three.js](https://threejs.org/), Vite.
* **Backend:** Node.js, Express, `ws` (WebSockets).
* **Shaders:** GLSL (Vertex & Fragment shaders personalizados).

## 📦 Instalación y Despliegue

### Requisitos Previos
* Node.js (v18 o superior)
* npm

### Ejecutar Localmente

1.  **Clonar el repositorio:**
    ```bash
    git clone [https://github.com/TU_USUARIO/horizontes-de-paz.git](https://github.com/TU_USUARIO/horizontes-de-paz.git)
    cd horizontes-de-paz
    ```

2.  **Instalar dependencias:**
    ```bash
    npm install
    ```

3.  **Construir y Ejecutar (Modo Producción):**
    Este es el método recomendado para probar el multijugador correctamente.
    ```bash
    npm run build
    npm start
    ```
    Visita `http://localhost:3000` en tu navegador.

4.  **Modo Desarrollo (Hot Reload):**
    Si solo editas frontend. Nota: El multiplayer requiere el servidor corriendo en paralelo.
    ```bash
    npm run dev
    ```

## 🎮 Controles

| Acción | PC (Teclado/Mouse) | Móvil (Táctil) |
| :--- | :--- | :--- |
| **Moverse** | W, A, S, D | Joystick Izquierdo |
| **Cámara** | Mover Mouse | Deslizar lado derecho |
| **Correr** | Shift (Mantener) | (Automático al empujar joystick) |
| **Saltar / Volar** | Espacio (x2 para volar) | Botón "Saltar" |
| **Restaurar** | Tecla E o Clic Izq. | Botón "✨" |

## 🌐 Despliegue en la Nube (Render)

Este proyecto está configurado para desplegarse fácilmente en [Render.com](https://render.com) como un **Web Service**.

1.  Crea un nuevo Web Service conectado a tu repo.
2.  **Build Command:** `npm install && npm run build`
3.  **Start Command:** `npm start`
4.  ¡Listo!

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, abre un "Issue" para discutir cambios mayores antes de enviar un "Pull Request".

1.  Fork el proyecto
2.  Crea tu rama de características (`git checkout -b feature/AmazingFeature`)
3.  Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4.  Push a la rama (`git push origin feature/AmazingFeature`)
5.  Abre un Pull Request

## 📄 Licencia

Distribuido bajo la licencia MIT. Ver `LICENSE` para más información.

---
*Desarrollado con ❤️ y principios de paz.*

# Math Magic Battle - Juego de Matemáticas

## Descripción
Un juego educativo de matemáticas con temática de dragones y magia, diseñado para niños.

## Flujo de Navegación

### Pantalla Inicial (Landing Page)
- **Archivo**: `webJuegoMultimedia/index.html`
- **Función**: Página de presentación con animaciones y información del juego
- **Navegación**: Al hacer clic en "¡JUGAR AHORA!" o "¡EMPEZAR LA AVENTURA!" redirige al juego principal

### Juego Principal
- **Archivo**: `index.html` (en la raíz)
- **Función**: Contiene todo el juego de matemáticas
- **Características**:
  - Pantalla de título
  - Menú de selección de operación y nivel
  - Pantalla de juego
  - Pantalla de resultados

## Características del Juego

### Feedback Infantil
- **Respuestas Correctas**: Mensajes como "¡MUY BIEN! 🌟", "¡EXCELENTE! ⭐"
- **Respuestas Incorrectas**: Mensajes como "¡UY! 😢", "¡OOPS! 😅"
- **Animaciones**: Efectos de rebote, brillo y arcoíris

### Fondo Dinámico del Menú
- El fondo del menú cambia según el nivel seleccionado:
  - Nivel 1 (Aprendiz): `images/fondo2.jpg`
  - Nivel 2 (Mago): `images/fondo3.jpg`
  - Nivel 3 (Archimago): `images/fondo4.jpg`

### Operaciones Matemáticas
- Suma
- Resta
- Multiplicación
- División
- Mixto (todas las operaciones)

### Niveles de Dificultad
- **Aprendiz**: Números del 1 al 10
- **Mago**: Números del 1 al 50
- **Archimago**: Números del 1 al 100

## Cómo Jugar

1. Abrir `landing.html` o `webJuegoMultimedia/index.html` en el navegador
2. Explorar la landing page con scroll
3. Hacer clic en "¡JUGAR AHORA!" o "¡EMPEZAR LA AVENTURA!"
4. Seleccionar operación matemática y nivel de dificultad
5. Hacer clic en "COMENZAR BATALLA"
6. Resolver las operaciones matemáticas antes de que el enemigo llegue al jugador

## Archivos Principales

- `landing.html` - Redirección automática a la landing page
- `webJuegoMultimedia/index.html` - Landing page principal
- `index.html` - Juego principal
- `scripts/main.js` - Lógica del juego
- `styles/style.css` - Estilos del juego principal
- `webJuegoMultimedia/css/` - Estilos de la landing page

## Tecnologías Utilizadas

- HTML5
- CSS3 (con animaciones y efectos visuales)
- JavaScript (vanilla)
- Fuentes web (Google Fonts)
- Imágenes y sonidos para efectos multimedia 
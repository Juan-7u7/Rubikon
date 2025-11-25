# 🎮 Rubikon - Juego 3D con React Native

## 📖 Descripción

Rubikon es un juego 3D desarrollado con React Native y Three.js que presenta un fantasma de caballero medieval controlable en un entorno 3D interactivo. El proyecto utiliza Expo para soporte multiplataforma y ofrece una experiencia de juego fluida tanto en dispositivos móviles como en navegadores web.

## ✨ Características

- 🎮 **Controles Adaptativos**: Teclado para desktop, joystick virtual para móviles
- 👻 **Personaje 3D**: Fantasma de caballero medieval con armadura y efectos especiales
- 📹 **Sistema de Cámara Dual**:
  - Cámara fija que sigue al personaje
  - Cámara libre con control manual (rotar y zoom)
- 🌈 **Iluminación Dinámica**: Ambiente colorido con múltiples fuentes de luz
- 🎨 **Diseño Minimalista**: Interfaz limpia con efectos glassmorphism
- 📱 **Multiplataforma**: Web, iOS y Android
- 🕹️ **Controles Táctiles**: Soporte completo para gestos en móviles

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js 18 o superior
- npm o yarn
- Expo CLI (se instala automáticamente)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Juan-7u7/Rubikon.git
cd Rubikon

# Instalar dependencias
npm install
```

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm start

# Ejecutar en web
npm run web

# Ejecutar en iOS (requiere macOS)
npm run ios

# Ejecutar en Android
npm run android
```

## 🎮 Controles

### Desktop (PC/Mac)

- **W** o **↑**: Mover adelante
- **S** o **↓**: Mover atrás
- **A** o **←**: Mover izquierda
- **D** o **→**: Mover derecha
- **Mouse + Arrastrar**: Rotar cámara (modo libre)
- **Scroll**: Zoom in/out

### Móvil/Tablet

- **Joystick**: Mover personaje
- **Un dedo + Arrastrar**: Rotar cámara
- **Pinch (dos dedos)**: Zoom in/out

### Botones de UI

- **📹/🎥**: Alternar entre cámara fija y libre

## 🏗️ Arquitectura

### Estructura del Proyecto

```
Rubikon/
├── app/                    # Aplicación principal
│   ├── components/        # Componentes React
│   │   ├── GameMap3D.tsx # Escena 3D principal
│   │   ├── Joystick.tsx  # Control virtual
│   │   └── ...
│   ├── _layout.tsx       # Layout raíz
│   └── index.tsx         # Pantalla principal
├── context/              # React Contexts
├── hooks/                # Custom Hooks
├── lib/                  # Configuración de librerías
├── styles/               # Estilos globales
├── types/                # Definiciones TypeScript
└── assets/               # Recursos estáticos
```

### Tecnologías Principales

- **React Native**: Framework principal
- **Expo**: Toolchain y SDK
- **Three.js**: Motor 3D
- **TypeScript**: Tipado estático
- **React Native Gesture Handler**: Gestos táctiles
- **React Native Reanimated**: Animaciones fluidas
- **Supabase**: Backend y autenticación

## 🎨 Personaje

El personaje principal es un **Fantasma de Caballero Medieval** con:

- Armadura metálica semi-transparente
- Casco con visera y cresta roja
- Ojos cyan brillantes (efecto fantasmal)
- Capa azul oscuro flotante
- Aura mágica azul
- Efectos de transparencia y emisión de luz

## 🛠️ Scripts Disponibles

```bash
npm start          # Iniciar servidor de desarrollo
npm run web        # Ejecutar en navegador
npm run ios        # Ejecutar en iOS
npm run android    # Ejecutar en Android
npm run lint       # Ejecutar linter
```

## 📝 Configuración

El proyecto utiliza variables de entorno para configuración sensible:

```env
EXPO_PUBLIC_SUPABASE_URL=tu_url_de_supabase
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_clave_anonima
```

## 🧪 Testing

```bash
npm test           # Ejecutar tests (próximamente)
```

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Autores

- **Juan-7u7** - [GitHub](https://github.com/Juan-7u7)

## 🙏 Agradecimientos

- Expo team por el excelente framework
- Three.js community por el motor 3D
- React Native community

## 📞 Contacto

Para preguntas o sugerencias, abre un issue en GitHub.

---

**¡Disfruta jugando con Rubikon!** 🎮✨

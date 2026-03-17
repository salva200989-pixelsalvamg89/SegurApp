# SegurApp — Crear APK con Capacitor
## Guía paso a paso

---

## REQUISITOS (instalar primero)

1. **Node.js** → https://nodejs.org  (descargar versión LTS)
2. **Android Studio** → https://developer.android.com/studio
   - Al instalar, acepta instalar también: Android SDK, Android SDK Tools
   - Cuando abra por primera vez, acepta todas las licencias

---

## PASO 1 — Preparar las librerías offline

Abre una terminal/consola en la carpeta de SegurApp-PWA y ejecuta:

```
node get-libs.js
```

Esto descargará las librerías JavaScript a la carpeta `lib/` para que
la app funcione 100% sin internet dentro del APK.

---

## PASO 2 — Instalar dependencias

```
npm install
```

---

## PASO 3 — Inicializar Capacitor (solo la primera vez)

```
npx cap init "SegurApp" "com.salvadormg.segurapp" --web-dir .
```

---

## PASO 4 — Añadir plataforma Android

```
npx cap add android
```

---

## PASO 5 — Añadir permisos en AndroidManifest.xml

Abre el archivo:
  android/app/src/main/AndroidManifest.xml

Mira el archivo "android-permissions.xml" que tienes en esta carpeta
y añade los permisos indicados.

---

## PASO 6 — Sincronizar

```
npx cap sync android
```

---

## PASO 7 — Abrir en Android Studio

```
npx cap open android
```

Se abrirá Android Studio con tu proyecto.

---

## PASO 8 — Generar el APK

En Android Studio:
1. Espera a que termine de indexar (barra de progreso abajo)
2. Menú superior: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
3. Espera unos minutos
4. Aparecerá un mensaje "Build successful" con un enlace "locate"
5. El APK está en: android/app/build/outputs/apk/debug/app-debug.apk

---

## PASO 9 — Instalar en tu móvil

### Opción A: Por USB
1. Conecta el móvil al PC por USB
2. En el móvil: Ajustes → Opciones de desarrollador → Depuración USB (activar)
3. En Android Studio: Run → Run 'app' (selecciona tu móvil)

### Opción B: Manualmente
1. Copia el APK al móvil (WhatsApp, email, cable USB)
2. En el móvil: Ajustes → Seguridad → Instalar apps desconocidas → activar
3. Abre el APK desde el explorador de archivos
4. Instalar

---

## DATOS DE LA APP

- App ID: com.salvadormg.segurapp
- Nombre: SegurApp
- Versión: 2.0
- Almacenamiento: Local en el dispositivo (no requiere internet)
- Permisos: Cámara, Almacenamiento (para fotos y PDFs)

---

## ACTUALIZAR LA APP

Cuando hagas cambios en los archivos HTML/JS:

```
npx cap sync android
```

Luego en Android Studio: **Build → Build APK(s)** de nuevo.

---

## PROBLEMAS COMUNES

**"SDK not found"**: En Android Studio → File → Project Structure → SDK Location → 
selecciona la carpeta del SDK de Android

**"Java not found"**: Instala JDK 17 → https://adoptium.net

**La app no abre la cámara**: Asegúrate de haber añadido los permisos del PASO 5

**"Gradle sync failed"**: File → Sync Project with Gradle Files

---

Creado por Salvador M.G. — SegurApp v2.0

# Simulador BIND9

Esta es una aplicación web que simula la configuración de un servidor DNS BIND9. 
![alt text](image.png)

Proporciona una interfaz fácil de usar para crear, editar y validar archivos de configuración de BIND9. 
![alt text](image-1.png)
![alt text](image-2.png)

La aplicación aprovecha la API de Google Gemini para proporcionar retroalimentación inteligente, incluida la validación de sintaxis y explicaciones de los archivos de configuración.

## Características

*   **Gestión de archivos:** Cree, edite y elimine fácilmente archivos de configuración de BIND9 (por ejemplo, `named.conf`, archivos de zona).
*   **Validación de sintaxis:** Obtenga retroalimentación instantánea sobre su configuración de BIND9. La aplicación utiliza un servicio impulsado por IA para verificar errores de sintaxis y lógicos.
*   **Explicación de la configuración:** Comprenda qué hace su configuración de BIND9 con explicaciones claras y concisas generadas por una IA.
*   **Soporte multilingüe:** La interfaz de usuario y las respuestas generadas por IA están disponibles en inglés, español y ruso.

## Stack de tecnología

*   **Frontend:** React, TypeScript, Vite
*   **IA:** API de Google Gemini
*   **UI:** Componentes personalizados para un editor de código, pestañas de archivos y una consola de salida.

## Cómo empezar

### Prerrequisitos

*   Node.js instalado en su máquina.
*   Una clave de API de Google Gemini.

### Instalación y configuración

1.  **Clone el repositorio:**
    ```bash
    git clone <url-del-repositorio>
    cd bind9-simulator
    ```

2.  **Instale las dependencias:**
    ```bash
    npm install
    ```

3.  **Configure sus variables de entorno:**
    Cree un archivo `.env.local` en la raíz del proyecto y agregue su clave de API de Google Gemini:
    ```
    API_KEY=su-clave-de-api-de-gemini
    ```

4.  **Ejecute la aplicación:**
    ```bash
    npm run dev
    ```
    La aplicación estará disponible en `http://localhost:5173` (u otro puerto si el 5173 está en uso).

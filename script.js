/*==================================================
                VARIABLES
==================================================*/

const nombre = document.getElementById("nombre");
const correo = document.getElementById("correo");
const pregunta = document.getElementById("pregunta");

const btnEnviar = document.getElementById("btn-enviar");

const prompt = document.getElementById("prompt");

const chat = document.getElementById("chat-container");

const thinking = document.getElementById("thinking");

const progress = document.getElementById("progress-bar");

const aiStatus = document.getElementById("ai-status");

const emailStatus = document.getElementById("email-status");

const correoPara = document.getElementById("em-to");

const correoAsunto = document.getElementById("em-subject");

const correoBody = document.getElementById("em-body");

const emailAnimation = document.getElementById("email-animation");

const btnCopiar = document.getElementById("btn-copy");

const btnNuevo = document.getElementById("btn-new-chat");

const btnRegenerar = document.getElementById("btn-regenerate");

/*==================================================
                EVENTOS
==================================================*/

btnEnviar.addEventListener("click", ejecutarIA);

btnCopiar.addEventListener("click", copiarRespuesta);

btnNuevo.addEventListener("click", nuevoChat);

btnRegenerar.addEventListener("click", regenerarRespuesta);

pregunta.addEventListener("input", generarPrompt);

nombre.addEventListener("input", generarPrompt);

/*==================================================
                VARIABLES GLOBALES
==================================================*/

let ultimaPregunta = "";

let ultimaRespuesta = "";

/*==================================================
                INICIO
==================================================*/

generarPrompt();

/*==================================================
            VALIDACIONES
==================================================*/

function validarFormulario() {

    if (nombre.value.trim() === "") {

        alert("Ingrese su nombre.");

        nombre.focus();

        return false;

    }

    if (correo.value.trim() === "") {

        alert("Ingrese su correo.");

        correo.focus();

        return false;

    }

    if (pregunta.value.trim() === "") {

        alert("Escriba una pregunta.");

        pregunta.focus();

        return false;

    }

    return true;

}

/*==================================================
            GENERAR PROMPT
==================================================*/

function generarPrompt() {

    prompt.textContent =
`Eres un asistente inteligente especializado en tecnología.

Nombre del usuario:
${nombre.value || "Sin nombre"}

Pregunta:
${pregunta.value || "Esperando pregunta..."}

Instrucciones:

- Responde de forma clara.
- Utiliza un lenguaje sencillo.
- Explica paso a paso.
- Si es posible incluye ejemplos.
- Finaliza con una recomendación.`;

}

/*==================================================
                ESPERA
==================================================*/

function esperar(ms) {

    return new Promise(resolve => setTimeout(resolve, ms));

}

/*==================================================
            EJECUTAR IA
==================================================*/

async function ejecutarIA() {

    if (!validarFormulario()) {

        return;

    }

    ultimaPregunta = pregunta.value;

    generarPrompt();

    btnEnviar.disabled = true;

    btnEnviar.innerHTML = "Procesando...";

    aiStatus.innerHTML = "Analizando...";

    progress.style.width = "0%";

    await iniciarFlujo();

}
/*==================================================
            OBTENER HORA
==================================================*/

function obtenerHora() {

    const ahora = new Date();

    return ahora.toLocaleTimeString("es-CO", {

        hour: "2-digit",
        minute: "2-digit"

    });

}

/*==================================================
        AGREGAR MENSAJE DEL USUARIO
==================================================*/

function agregarMensajeUsuario(texto) {

    chat.innerHTML += `

        <div class="message user">

            <div class="avatar">
                👤
            </div>

            <div class="message-content">

                <h4>${nombre.value}</h4>

                <p>${texto}</p>

                <span class="message-time">

                    ${obtenerHora()}

                </span>

            </div>

        </div>

    `;

    bajarChat();

}

/*==================================================
        AGREGAR MENSAJE DE LA IA
==================================================*/

function agregarMensajeIA(texto) {

    chat.innerHTML += `

        <div class="message bot">

            <div class="avatar">
                🤖
            </div>

            <div class="message-content">

                <h4>Asistente IA</h4>

                <p>${texto}</p>

                <span class="message-time">

                    ${obtenerHora()}

                </span>

            </div>

        </div>

    `;

    bajarChat();

}

/*==================================================
        BAJAR CHAT AUTOMÁTICAMENTE
==================================================*/

function bajarChat() {

    chat.scrollTop = chat.scrollHeight;

}
/*==================================================
            ACTIVAR PASO DEL FLUJO
==================================================*/

function activarPaso(id){

    document.querySelectorAll(".step").forEach(step=>{

        step.classList.remove("active");

        step.classList.remove("done");

    });

    if(id==="step-user"){

        document.getElementById("step-user").classList.add("active");

        return;

    }

    document.getElementById("step-user").classList.add("done");

    if(id==="step-n8n"){

        document.getElementById("step-n8n").classList.add("active");

        return;

    }

    document.getElementById("step-n8n").classList.add("done");

    if(id==="step-ai"){

        document.getElementById("step-ai").classList.add("active");

        return;

    }

    document.getElementById("step-ai").classList.add("done");

    if(id==="step-email"){

        document.getElementById("step-email").classList.add("active");

    }

}

/*==================================================
            BARRA DE PROGRESO
==================================================*/

async function progreso(){

    progress.style.width="0%";

    for(let i=0;i<=100;i+=5){

        progress.style.width=i+"%";

        await esperar(80);

    }

}

/*==================================================
            PENSANDO...
==================================================*/

function mostrarPensando(){

    thinking.classList.add("active");

    aiStatus.innerHTML="Pensando...";

}

function ocultarPensando(){

    thinking.classList.remove("active");

    aiStatus.innerHTML="Respuesta generada";

}

/*==================================================
            FLUJO PRINCIPAL
==================================================*/

async function iniciarFlujo(){

    agregarMensajeUsuario(pregunta.value);

    activarPaso("step-user");

    await esperar(700);

    activarPaso("step-n8n");

    await esperar(1000);

    mostrarPensando();

    activarPaso("step-ai");

    await progreso();

    await esperar(1000);

    ocultarPensando();

    let respuesta=generarRespuesta(pregunta.value);

    ultimaRespuesta=respuesta;

    agregarMensajeIA(respuesta);

    await esperar(800);

    activarPaso("step-email");

    await generarCorreo(respuesta);

    btnEnviar.disabled=false;

    btnEnviar.innerHTML=`
        <i class="fa-solid fa-paper-plane"></i>
        Enviar Consulta
    `;

}

/*==================================================
            BASE DE CONOCIMIENTO
==================================================*/

const conocimiento = {

    java: [

        "Java es un lenguaje de programación orientado a objetos. Se utiliza para desarrollar aplicaciones de escritorio, aplicaciones web, sistemas empresariales y aplicaciones móviles con Android.",

        "Java destaca por su portabilidad. Gracias a la Máquina Virtual de Java (JVM), un programa puede ejecutarse en diferentes sistemas operativos sin necesidad de modificar el código.",

        "Para dominar Java es recomendable aprender en este orden: variables, estructuras de control, métodos, clases, objetos, herencia, polimorfismo, colecciones y bases de datos."

    ],

    html: [

        "HTML es el lenguaje encargado de definir la estructura de una página web mediante etiquetas como títulos, párrafos, imágenes, tablas y formularios.",

        "HTML trabaja junto con CSS y JavaScript. HTML crea la estructura, CSS proporciona el diseño y JavaScript agrega interactividad.",

        "Las etiquetas más utilizadas en HTML son: <header>, <main>, <section>, <article>, <footer>, <form>, <table> e <img>."

    ],

    css: [

        "CSS permite dar estilo a una página web modificando colores, tamaños, fuentes, márgenes, sombras y animaciones.",

        "Con Flexbox y Grid puedes construir diseños modernos, adaptables y organizados para cualquier dispositivo.",

        "Las animaciones y transiciones de CSS mejoran la experiencia del usuario sin necesidad de utilizar JavaScript."

    ],

    javascript: [

        "JavaScript permite crear páginas web dinámicas e interactivas manipulando el HTML y el CSS en tiempo real.",

        "Con JavaScript puedes validar formularios, consumir APIs, actualizar información sin recargar la página y crear aplicaciones completas.",

        "Actualmente JavaScript es uno de los lenguajes más utilizados en el desarrollo web moderno."

    ],

    python: [

        "Python es un lenguaje muy utilizado en automatización, inteligencia artificial, análisis de datos y desarrollo web.",

        "Su sintaxis sencilla facilita el aprendizaje para quienes comienzan en programación.",

        "Frameworks como Flask y Django permiten crear aplicaciones web profesionales utilizando Python."

    ],

    mysql: [

        "MySQL es un sistema gestor de bases de datos relacionales que permite almacenar y consultar información de manera eficiente.",

        "Con SQL puedes insertar, consultar, actualizar y eliminar datos mediante instrucciones como SELECT, INSERT, UPDATE y DELETE.",

        "MySQL es ampliamente utilizado junto con Java, PHP, Python y Node.js."

    ],

    api: [

        "Una API permite que dos aplicaciones intercambien información mediante solicitudes y respuestas.",

        "Las APIs REST utilizan normalmente los métodos GET, POST, PUT y DELETE para comunicarse.",

        "Actualmente la mayoría de servicios modernos ofrecen APIs para integrarse con otras aplicaciones."

    ],

    n8n: [

        "n8n es una plataforma de automatización que permite conectar aplicaciones mediante flujos de trabajo.",

        "Con n8n puedes integrar bases de datos, correos electrónicos, APIs, hojas de cálculo e Inteligencia Artificial.",

        "Los flujos de n8n están compuestos por nodos conectados entre sí que ejecutan diferentes tareas."

    ],

    ia: [

        "La Inteligencia Artificial permite analizar información, reconocer patrones y generar respuestas similares a las de una persona.",

        "Los modelos de lenguaje modernos pueden comprender preguntas complejas y generar respuestas útiles en diferentes áreas.",

        "Actualmente la IA se utiliza en educación, medicina, programación, atención al cliente y automatización empresarial."

    ]

};

/*==================================================
            GENERAR RESPUESTA
==================================================*/

function generarRespuesta(texto){

    texto = texto.toLowerCase();

    for(const tema in conocimiento){

        if(texto.includes(tema)){

            const respuestas = conocimiento[tema];

            const indice = Math.floor(Math.random() * respuestas.length);

            return respuestas[indice];

        }

    }

    return "He analizado tu pregunta. Aunque no tengo una respuesta específica para ese tema, te recomiendo investigar fuentes confiables, practicar con ejemplos y desarrollar pequeños proyectos para fortalecer tus conocimientos.";

}
/*==================================================
            GENERAR CORREO
==================================================*/

async function generarCorreo(respuesta){

    emailStatus.innerHTML = "Preparando...";

    correoPara.textContent = correo.value;

    correoAsunto.textContent = "Respuesta automática del Asistente IA";

    correoBody.innerHTML = `
        <p><strong>Hola ${nombre.value}</strong></p>

        <br>

        <p>Gracias por utilizar nuestro asistente inteligente.</p>

        <p>Esta es la respuesta generada para tu consulta:</p>

        <hr>

        <p>${respuesta}</p>

        <hr>

        <p><strong>Pregunta realizada:</strong></p>

        <p>${ultimaPregunta}</p>

        <br>

        <p>Este mensaje fue generado automáticamente por la simulación del flujo HTML + CSS + JavaScript + n8n.</p>
    `;

    emailAnimation.innerHTML = "📤 Preparando envío...";

    await esperar(800);

    emailAnimation.innerHTML = "📨 Enviando correo...";

    await esperar(1200);

    emailAnimation.innerHTML = "✅ Correo enviado correctamente";

    emailStatus.innerHTML = "Enviado";

}

/*==================================================
            COPIAR RESPUESTA
==================================================*/

async function copiarRespuesta(){

    if(ultimaRespuesta===""){

        alert("No existe ninguna respuesta para copiar.");

        return;

    }

    try{

        await navigator.clipboard.writeText(ultimaRespuesta);

        btnCopiar.innerHTML=`
            <i class="fa-solid fa-check"></i>
            Copiado
        `;

        setTimeout(()=>{

            btnCopiar.innerHTML=`
                <i class="fa-solid fa-copy"></i>
                Copiar respuesta
            `;

        },2000);

    }catch(error){

        alert("No fue posible copiar la respuesta.");

    }

}

/*==================================================
            NUEVO CHAT
==================================================*/

function nuevoChat(){

    if(!confirm("¿Deseas iniciar un nuevo chat?")){

        return;

    }

    nombre.value="";

    correo.value="";

    pregunta.value="";

    ultimaPregunta="";

    ultimaRespuesta="";

    generarPrompt();

    aiStatus.innerHTML="En espera";

    emailStatus.innerHTML="En espera";

    progress.style.width="0%";

    thinking.classList.remove("active");

    correoPara.textContent="Esperando...";

    correoAsunto.textContent="Respuesta automática";

    correoBody.textContent="El contenido del correo aparecerá aquí...";

    emailAnimation.innerHTML="📧 Esperando envío...";

    chat.innerHTML=`

        <div class="message bot">

            <div class="avatar">

                🤖

            </div>

            <div class="message-content">

                <h4>Asistente IA</h4>

                <p>

                    ¡Hola! 👋

                </p>

                <p>

                    Bienvenido nuevamente.

                </p>

                <p>

                    Escribe una nueva pregunta y comenzaré el proceso de análisis.

                </p>

                <span class="message-time">

                    Ahora

                </span>

            </div>

        </div>

    `;

    activarPaso("step-user");

}

/*==================================================
            REGENERAR RESPUESTA
==================================================*/

async function regenerarRespuesta(){

    if(ultimaPregunta===""){

        alert("Primero debes realizar una consulta.");

        return;

    }

    mostrarPensando();

    aiStatus.innerHTML="Regenerando...";

    progress.style.width="0%";

    await progreso();

    await esperar(1000);

    ocultarPensando();

    const nuevaRespuesta=generarRespuesta(ultimaPregunta);

    ultimaRespuesta=nuevaRespuesta;

    agregarMensajeIA(nuevaRespuesta);

    await generarCorreo(nuevaRespuesta);

}

/*==================================================
            ENTER PARA ENVIAR
==================================================*/

pregunta.addEventListener("keydown",function(e){

    if(e.key==="Enter" && !e.shiftKey){

        e.preventDefault();

        ejecutarIA();

    }

});

/*==================================================
            ACTUALIZAR PROMPT
==================================================*/

correo.addEventListener("input",generarPrompt);

/*==================================================
            MENSAJE DE BIENVENIDA
==================================================*/

window.addEventListener("load",()=>{

    activarPaso("step-user");

    generarPrompt();

});
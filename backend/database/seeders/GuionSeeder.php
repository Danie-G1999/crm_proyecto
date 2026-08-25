<?php

namespace Database\Seeders;

use App\Models\Guion;
use Illuminate\Database\Seeder;

class GuionSeeder extends Seeder
{
    public function run(): void
    {
        Guion::truncate();

        Guion::create([
            'titulo'         => 'Atención Inicial WhatsApp',
            'canal'          => 'WHATSAPP', // Cambiado de 'whatsapp' a 'WHATSAPP'
            'saludo'         => '¡Hola! Qué gusto saludarte.',
            'identificacion' => 'Mi nombre es [Asesor] del equipo de Atención al Cliente.',
            'proposito'      => 'Me comunico para darte soporte con tu requerimiento reciente.',
            'sondeo'         => '¿Podrías confirmarme tu número de documento para verificar tu cuenta?',
            'gestion'        => 'Procedo a revisar tu historial en el sistema para darte la solución inmediata.',
            'cierre'         => '¿Hay algo más en lo que te pueda colaborar hoy? ¡Que tengas un excelente día!',
        ]);

        Guion::create([
            'titulo'         => 'Gestión Telefónica Cobranzas',
            'canal'          => 'TELEFONO', // Cambiado de 'llamada' a 'TELEFONO'
            'saludo'         => 'Buenos días/tardes.',
            'identificacion' => 'Le habla [Asesor] del departamento de soluciones financieras.',
            'proposito'      => 'El motivo de mi llamada es revisar el estado de su obligación financiera.',
            'sondeo'         => '¿A qué se debió el retraso en su pago correspondiente a este mes?',
            'gestion'        => 'Le ofrecemos una alternativa de pago con descuento de moratoria hoy mismo.',
            'cierre'         => 'Quedamos atentos a la confirmación de su comprobante de pago. Feliz día.',
        ]);

        Guion::create([
            'titulo'         => 'Respuesta Correo Soporte',
            'canal'          => 'CORREO_ELECTRONICO', // Cambiado de 'correo' a 'CORREO_ELECTRONICO'
            'saludo'         => 'Estimado/a cliente, reciba un cordial saludo.',
            'identificacion' => 'Le escribe [Asesor], especialista de soporte técnico.',
            'proposito'      => 'Dando respuesta a la solicitud enviada mediante nuestra plataforma.',
            'sondeo'         => 'Agradecemos nos indique si el inconveniente persiste al reiniciar el módem.',
            'gestion'        => 'Hemos ajustado los parámetros de red asignados a su línea de servicio.',
            'cierre'         => 'Agradecemos su preferencia. Quedamos a sus órdenes para cualquier otra consulta.',
        ]);
    }
}

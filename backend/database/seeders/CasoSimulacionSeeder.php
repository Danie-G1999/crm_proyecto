<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CasoSimulacionSeeder extends Seeder
{
    public function run(): void
    {
        $casos = [
            [
                'id' => 1,
                'titulo' => 'Cliente con dificultad económica',
                'cliente_id' => 1,
                'producto_cliente_id' => 1,
                'dias_mora' => 75,
                'capacidad_estimada_pago' => 300000,
                'situacion' => 'Disminución de ingresos',
                'actitud_cliente' => 'Preocupado. Quiere pagar. No puede asumir la cuota actual.',
                'objetivo_asesor' => 'Conseguir un acuerdo sostenible evitando que el cliente abandone la negociación.',
            ],
            [
                'id' => 2,
                'titulo' => 'Cliente con capacidad de pago, pero olvidadizo',
                'cliente_id' => 2,
                'producto_cliente_id' => 2,
                'dias_mora' => 45,
                'capacidad_estimada_pago' => 500000,
                'situacion' => 'Olvido de pagos debido a múltiples compromisos personales.',
                'actitud_cliente' => 'Tranquilo. Reconoce la obligación. Espera una solución rápida.',
                'objetivo_asesor' => 'Lograr un pago inmediato o acuerdo de corto plazo aprovechando su capacidad económica.',
            ],
            [
                'id' => 3,
                'titulo' => 'Cliente desempleado',
                'cliente_id' => 3,
                'producto_cliente_id' => 3,
                'dias_mora' => 90,
                'capacidad_estimada_pago' => 100000,
                'situacion' => 'Perdió su empleo hace 3 meses, está buscando trabajo.',
                'actitud_cliente' => 'Preocupada. Quiere cumplir. Se siente presionada por las llamadas.',
                'objetivo_asesor' => 'Mantener la negociación abierta y establecer un compromiso realista.',
            ],
            [
                'id' => 4,
                'titulo' => 'Cliente molesto por las llamadas',
                'cliente_id' => 4,
                'producto_cliente_id' => 4,
                'dias_mora' => 60,
                'capacidad_estimada_pago' => 400000,
                'situacion' => 'Molesto por considerar que recibe llamadas excesivas de cobranza.',
                'actitud_cliente' => 'Molesto, interrumpe al asesor. Exige atención respetuosa.',
                'objetivo_asesor' => 'Desescalar la situación, recuperar confianza y lograr el compromiso.',
            ],
            [
                'id' => 5,
                'titulo' => 'Cliente que cuestiona el valor de la deuda',
                'cliente_id' => 5,
                'producto_cliente_id' => 5,
                'dias_mora' => 70,
                'capacidad_estimada_pago' => 700000,
                'situacion' => 'No reconoce el valor total informado, considera que los intereses son altos.',
                'actitud_cliente' => 'Desconfiada. Solicita explicación del saldo.',
                'objetivo_asesor' => 'Escuchar inconformidad, orientar con claridad la información del saldo.',
            ],
            [
                'id' => 6,
                'titulo' => 'Cliente con reducción salarial',
                'cliente_id' => 6,
                'producto_cliente_id' => 6,
                'dias_mora' => 100,
                'capacidad_estimada_pago' => 400000,
                'situacion' => 'Reducción de salario en la empresa donde labora.',
                'actitud_cliente' => 'Quiere pagar, explica detalladamente su situación.',
                'objetivo_asesor' => 'Aplicar negociación colaborativa y ajustar la cuota.',
            ],
            [
                'id' => 7,
                'titulo' => 'Cliente evasivo (Llámeme después)',
                'cliente_id' => 7,
                'producto_cliente_id' => 7,
                'dias_mora' => 80,
                'capacidad_estimada_pago' => 500000,
                'situacion' => 'Tiene ingresos suficientes pero evita concretar acuerdos.',
                'actitud_cliente' => 'Evasivo, dice estar ocupado siempre.',
                'objetivo_asesor' => 'Identificar razón real de evasión y concretar un compromiso.',
            ],
            [
                'id' => 8,
                'titulo' => 'Cliente agresivo',
                'cliente_id' => 8,
                'producto_cliente_id' => 8,
                'dias_mora' => 120,
                'capacidad_estimada_pago' => 900000,
                'situacion' => 'Molesto con la entidad, responsabiliza a la empresa por su saldo.',
                'actitud_cliente' => 'Habla elevado, interrumpe, manifiesta que no piensa pagar.',
                'objetivo_asesor' => 'Demostrar autocontrol y manejo de conflictos para lograr la negociación.',
            ],
            [
                'id' => 9,
                'titulo' => 'Cliente con capacidad parcial de pago',
                'cliente_id' => 9,
                'producto_cliente_id' => 9,
                'dias_mora' => 65,
                'capacidad_estimada_pago' => 250000,
                'situacion' => 'Tiene múltiples obligaciones y sólo puede destinar parte de sus ingresos.',
                'actitud_cliente' => 'Quiere pagar, tiene temor a comprometerse e incumplir.',
                'objetivo_asesor' => 'Construir un acuerdo realista acorde a su capacidad económica actual.',
            ],
            [
                'id' => 10,
                'titulo' => 'Cliente que solicita descuento no autorizado',
                'cliente_id' => 10,
                'producto_cliente_id' => 10,
                'dias_mora' => 150,
                'capacidad_estimada_pago' => 9800000,
                'situacion' => 'Exige 50% de descuento inmediato para pagar la totalidad de contado.',
                'actitud_cliente' => 'Negocia fuertemente, amenaza con no pagar sin descuento.',
                'objetivo_asesor' => 'Negociar dentro de las políticas autorizadas sin ceder a descuentos indebidos.',
            ],
            [
                'id' => 11,
                'titulo' => 'Cliente con ingresos variables',
                'cliente_id' => 11,
                'producto_cliente_id' => 11,
                'dias_mora' => 55,
                'capacidad_estimada_pago' => 325000,
                'situacion' => 'Trabajadora independiente con flujos de caja inconstantes.',
                'actitud_cliente' => 'Quiere pagar, solicita flexibilidad.',
                'objetivo_asesor' => 'Estructurar alternativa adaptable a la variabilidad de sus ingresos.',
            ],
            [
                'id' => 12,
                'titulo' => 'Cliente que perdió un negocio',
                'cliente_id' => 12,
                'producto_cliente_id' => 12,
                'dias_mora' => 180,
                'capacidad_estimada_pago' => 500000,
                'situacion' => 'Cierre de negocio propio; actualmente es empleado con menor ingreso.',
                'actitud_cliente' => 'Preocupado, cuota actual inviable.',
                'objetivo_asesor' => 'Establecer alternativa sostenible a su nueva realidad laboral.',
            ],
            [
                'id' => 13,
                'titulo' => 'Cliente que prefiere canales digitales',
                'cliente_id' => 13,
                'producto_cliente_id' => 13,
                'dias_mora' => 40,
                'capacidad_estimada_pago' => 300000,
                'situacion' => 'Teletrabajo, no responde llamadas telefónicas.',
                'actitud_cliente' => 'Dispuesto a pagar, exige gestión por WhatsApp/Correo.',
                'objetivo_asesor' => 'Formalizar acuerdo respetando canal preferido según protocolos.',
            ],
            [
                'id' => 14,
                'titulo' => 'Cliente con múltiples obligaciones',
                'cliente_id' => 14,
                'producto_cliente_id' => 14,
                'dias_mora' => 110,
                'capacidad_estimada_pago' => 450000,
                'situacion' => 'Sobreendeudamiento con múltiples acreedores.',
                'actitud_cliente' => 'Preocupado, busca evitar nuevos incumplimientos.',
                'objetivo_asesor' => 'Diagnóstico adecuado, identificar capacidad real de pago y acordar cuota sostenible.',
            ],
        ];

        foreach ($casos as $caso) {
            DB::table('casos_simulacion')->updateOrInsert(
                ['id' => $caso['id']],
                array_merge($caso, [
                    'estado_simulacion' => 'pendiente',
                    'created_at' => Carbon::now(),
                    'updated_at' => Carbon::now(),
                ])
            );
        }
    }
}

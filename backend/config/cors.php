<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        env('FRONTEND_URL'),
    ],

    'allowed_origins_patterns' => [
        // Opcional: Permite cualquier vista previa/deploy preview que te genere Vercel
        'https://.*\.vercel\.app',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,

];

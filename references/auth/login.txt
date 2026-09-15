@php
    $image = asset('imgs/auth/auth1.jpg');
    $title = 'LogIn';
    $quote = \Illuminate\Foundation\Inspiring::quotes()->random();

    $styles = [
        'header_container' => 'mb-8',
        'heading' => 'text-3xl font-extrabold text-quaternary mb-2',
        'subheading' => 'text-tertiary',
        'form' => 'space-y-6',
        'label' => 'block text-sm font-medium text-quaternary mb-1',
        'input' => 'w-full px-4 py-3 rounded-xl border border-extra focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all',
        'link' => 'text-sm font-semibold text-accent hover:text-[#7d9460] transition-colors',
        'submit_btn' => 'w-full bg-accent hover:bg-[#7d9460] text-white font-bold py-3 px-4 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 shadow-md mt-4',
        'footer_container' => 'mt-8 text-center',
        'footer_text' => 'text-sm text-tertiary',
        'footer_link' => 'font-bold text-accent hover:text-[#7d9460] transition-colors ml-1'
    ];
@endphp

<x-auth-layout :image="$image" :title="$title" :quote="$quote">

    <x-slot name="content">
        <div class="{{ $styles['header_container'] }}">
            <h2 class="{{ $styles['heading'] }}">Bienvenido de nuevo</h2>
            <p class="{{ $styles['subheading'] }}">Ingresa tus credenciales para continuar.</p>
        </div>

        <form action="{{ route('logIn.post') }}" method="POST" class="{{ $styles['form'] }}">
            @csrf

            <div>
                <label for="email" class="{{ $styles['label'] }}">Correo electrónico</label>
                <input type="email" name="email" id="email" class="{{ $styles['input'] }} @error('email') border-red-500 ring-red-500 @enderror" placeholder="tu@correo.com"
                    value="{{ old('email') }}" required>
                @error('email')
                    <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <div class="flex items-center justify-between mb-1">
                    <label for="password" class="{{ $styles['label'] }} !mb-0">Contraseña</label>
                    <a href="{{ route('verifyEmail') }}" class="{{ $styles['link'] }}">
                        ¿Olvidaste tu contraseña?
                    </a>
                </div>
                <input type="password" name="password" id="password" class="{{ $styles['input'] }} @error('password') border-red-500 ring-red-500 @enderror"
                    placeholder="••••••••" required>
                @error('password')
                    <p class="text-red-500 text-xs mt-1">{{ $message }}</p>
                @enderror
            </div>

            <button type="submit" class="{{ $styles['submit_btn'] }}">
                Iniciar sesión
            </button>
        </form>

        <div class="{{ $styles['footer_container'] }}">
            <p class="{{ $styles['footer_text'] }}">
                ¿No tienes una cuenta?
                <a href="{{ route('signIn') }}" class="{{ $styles['footer_link'] }}">Regístrate</a>
            </p>
        </div>
    </x-slot>
</x-auth-layout>
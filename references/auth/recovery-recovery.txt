@php
    $image = asset('imgs/auth/auth5.jpeg');
    $title = 'Restablecer Contraseña';
    $quote = \Illuminate\Foundation\Inspiring::quotes()->random();

    $styles = [
        'header_container' => 'mb-8',
        'heading' => 'text-3xl font-extrabold text-quaternary mb-2',
        'subheading' => 'text-tertiary',
        'form' => 'space-y-6',
        'label' => 'block text-sm font-medium text-quaternary mb-1',
        'input' => 'w-full px-4 py-3 rounded-xl border border-extra focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all',
        'submit_btn' => 'w-full bg-accent hover:bg-[#7d9460] text-white font-bold py-3 px-4 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 shadow-md mt-6',
    ];
@endphp

<x-auth-layout :image="$image" :title="$title" :quote="$quote">

    <x-slot name="content">
        <div class="{{ $styles['header_container'] }}">
            <h2 class="{{ $styles['heading'] }}">Ingresa tu nueva contraseña</h2>
            <p class="{{ $styles['subheading'] }}">Asegúrate de usar caracteres seguros para proteger tu cuenta.</p>
        </div>

        <form action="{{ route('password.update') }}" method="POST" class="{{ $styles['form'] }}">
            @csrf

            <div>
                <label for="password" class="{{ $styles['label'] }}">Nueva Contraseña</label>
                <input type="password" name="password" id="password" class="{{ $styles['input'] }} @error('password') border-red-500 @enderror"
                    placeholder="••••••••" required>
                @error('password') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
            </div>

            <div>
                <label for="password_confirmation" class="{{ $styles['label'] }}">Confirmar Contraseña</label>
                <input type="password" name="password_confirmation" id="password_confirmation"
                    class="{{ $styles['input'] }}" placeholder="••••••••" required>
            </div>

            <button type="submit" class="{{ $styles['submit_btn'] }}">
                Restablecer Contraseña
            </button>
        </form>
    </x-slot>
</x-auth-layout>
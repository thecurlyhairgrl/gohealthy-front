@php
$image = asset('imgs/auth/auth2.jpg');
$title = 'Regístrate';
$quote = \Illuminate\Foundation\Inspiring::quotes()->random();

$styles = [
'header_container' => 'mb-5',
'heading' => 'text-3xl font-extrabold text-quaternary mb-1',
'subheading' => 'text-tertiary text-sm',
'form' => 'space-y-3',
'grid_2_cols' => 'grid grid-cols-1 sm:grid-cols-2 gap-3',
'label' => 'block text-sm font-medium text-quaternary mb-1',
'input' => 'w-full px-4 py-2 rounded-xl border border-extra focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all',
'submit_btn' => 'w-full bg-accent hover:bg-[#7d9460] text-white font-bold py-3 px-4 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 shadow-md mt-4',
'footer_container' => 'mt-6 text-center border-t border-extra/50 pt-4',
'footer_text' => 'text-sm text-tertiary',
'footer_link' => 'font-bold text-accent hover:text-[#7d9460] transition-colors ml-1'
];
@endphp

<x-auth-layout :image="$image" :title="$title" :quote="$quote">

    <x-slot name="content">
        <div class="{{ $styles['header_container'] }}">
            <h2 class="{{ $styles['heading'] }}">Crear una cuenta</h2>
            <p class="{{ $styles['subheading'] }}">Ingresa tus datos para asegurar tus propiedades.</p>
        </div>

        <form action="{{ route('signIn.post') }}" method="POST" class="{{ $styles['form'] }}">
            @csrf

            <div class="{{ $styles['grid_2_cols'] }}">
                <div>
                    <label for="name" class="{{ $styles['label'] }}">Nombre</label>
                    <input type="text" name="name" id="name" class="{{ $styles['input'] }} @error('name') border-red-500 @enderror" placeholder="Tu nombre"
                        value="{{ old('name') }}" required>
                    @error('name') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>
                <div>
                    <label for="username" class="{{ $styles['label'] }}">Usuario</label>
                    <input type="text" name="username" id="username" class="{{ $styles['input'] }} @error('username') border-red-500 @enderror"
                        placeholder="mi_usuario" value="{{ old('username') }}" required>
                    @error('username') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>
            </div>

            <div class="{{ $styles['grid_2_cols'] }}">
                <div>
                    <label for="father_lastname" class="{{ $styles['label'] }}">Apellido Paterno</label>
                    <input type="text" name="father_lastname" id="father_lastname" class="{{ $styles['input'] }} @error('father_lastname') border-red-500 @enderror"
                        placeholder="Pérez" value="{{ old('father_lastname') }}" required>
                    @error('father_lastname') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>
                <div>
                    <label for="mother_lastname" class="{{ $styles['label'] }}">Apellido Materno</label>
                    <input type="text" name="mother_lastname" id="mother_lastname" class="{{ $styles['input'] }} @error('mother_lastname') border-red-500 @enderror"
                        placeholder="García" value="{{ old('mother_lastname') }}">
                    @error('mother_lastname') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>
            </div>

            <div class="{{ $styles['grid_2_cols'] }}">
                <div>
                    <label for="email" class="{{ $styles['label'] }}">Correo electrónico</label>
                    <input type="email" name="email" id="email" class="{{ $styles['input'] }} @error('email') border-red-500 @enderror"
                        placeholder="tu@correo.com" value="{{ old('email') }}" required>
                    @error('email') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>
                <div>
                    <label for="phone" class="{{ $styles['label'] }}">Teléfono</label>
                    <input type="tel" name="phone" id="phone" class="{{ $styles['input'] }} @error('phone') border-red-500 @enderror" placeholder="5512345678"
                        value="{{ old('phone') }}" required>
                    @error('phone') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>
            </div>

            <div>
                <label for="birth_date" class="{{ $styles['label'] }}">Fecha de Nacimiento</label>
                <input type="date" name="birth_date" id="birth_date" class="{{ $styles['input'] }} @error('birth_date') border-red-500 @enderror"
                    value="{{ old('birth_date') }}" required>
                @error('birth_date') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
            </div>

            <div>
                <label for="gender" class="{{ $styles['label'] }}">Género</label>
                <select name="gender" id="gender" class="{{ $styles['input'] }} @error('gender') border-red-500 @enderror" required>
                    <option value="" disabled selected>Selecciona tu género</option>
                    @foreach(\App\Enums\GenderEnum::cases() as $gender)
                    <option value="{{ $gender->value }}" {{ old('gender') == $gender->value ? 'selected' : '' }}>{{ $gender->label() }}</option>
                    @endforeach
                </select>
                @error('gender') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
            </div>

            <div class="{{ $styles['grid_2_cols'] }}">
                <div>
                    <label for="password" class="{{ $styles['label'] }}">Contraseña</label>
                    <input type="password" name="password" id="password" class="{{ $styles['input'] }} @error('password') border-red-500 @enderror"
                        placeholder="••••••••" required>
                    @error('password') <p class="text-red-500 text-xs mt-1">{{ $message }}</p> @enderror
                </div>
                <div>
                    <label for="password_confirmation" class="{{ $styles['label'] }}">Confirmar Contraseña</label>
                    <input type="password" name="password_confirmation" id="password_confirmation"
                        class="{{ $styles['input'] }}" placeholder="••••••••" required>
                </div>
            </div>

            <button type="submit" class="{{ $styles['submit_btn'] }}">
                Crear cuenta
            </button>
        </form>

        <div class="{{ $styles['footer_container'] }}">
            <p class="{{ $styles['footer_text'] }}">
                ¿Ya tienes una cuenta?
                <a href="{{ route('logIn') }}" class="{{ $styles['footer_link'] }}">Inicia sesión</a>
            </p>
        </div>
    </x-slot>
</x-auth-layout>
@php
    $image = asset('imgs/auth/auth4.jpg');
    $title = 'Validar Token';
    $quote = \Illuminate\Foundation\Inspiring::quotes()->random();

    $styles = [
        'header_container' => 'mb-8',
        'heading' => 'text-3xl font-extrabold text-quaternary mb-2',
        'subheading' => 'text-tertiary',
        'form' => 'space-y-6',
        'label' => 'block text-sm font-medium text-quaternary mb-3 text-center',
        'input_container' => 'flex justify-center gap-2 sm:gap-4 mb-2',
        'input_char' => 'w-10 sm:w-12 h-12 sm:h-14 text-center text-xl font-bold rounded-xl border border-extra focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all uppercase',
        'submit_btn' => 'w-full bg-accent hover:bg-[#7d9460] text-white font-bold py-3 px-4 rounded-full transition-all duration-300 transform hover:-translate-y-0.5 shadow-md mt-6',
        'footer_container' => 'mt-8 text-center pt-6',
        'footer_text' => 'text-sm text-tertiary',
        'footer_link' => 'font-bold text-accent hover:text-[#7d9460] transition-colors ml-1'
    ];
@endphp

<x-auth-layout :image="$image" :title="$title" :quote="$quote">

    <x-slot name="content">
        <div class="{{ $styles['header_container'] }}">
            <h2 class="{{ $styles['heading'] }}">Ingresa tu código</h2>
            <p class="{{ $styles['subheading'] }}">Hemos enviado un token de verificación a tu correo electrónico.
                Revisa tu bandeja de entrada o spam.</p>
        </div>

        <form action="{{ route('password.verifyToken') }}" method="POST" class="{{ $styles['form'] }}">
            @csrf

            <div>
                <input type="hidden" name="email" value="{{ $email }}">
                <label for="token" class="{{ $styles['label'] }}">Código de Seguridad (Token)</label>
                
                <div class="{{ $styles['input_container'] }}">
                    @for ($i = 0; $i < 6; $i++)
                        <input type="text" maxlength="1" class="{{ $styles['input_char'] }} token-input" data-index="{{ $i }}" {{ $i === 0 ? 'autofocus' : '' }}>
                    @endfor
                </div>
                
                <input type="hidden" name="token" id="token" required>
                @error('token') <p class="text-red-500 text-sm mt-1 text-center font-bold">{{ $message }}</p> @enderror
            </div>

            <button type="submit" class="{{ $styles['submit_btn'] }}">
                Validar Token
            </button>
        </form>

        <script>
            document.addEventListener('DOMContentLoaded', function() {
                const inputs = document.querySelectorAll('.token-input');
                const hiddenToken = document.getElementById('token');

                inputs.forEach((input, index) => {
                    input.addEventListener('input', (e) => {
                        // Ensure uppercase
                        input.value = input.value.toUpperCase();
                        
                        if (e.target.value.length === 1 && index < inputs.length - 1) {
                            inputs[index + 1].focus();
                        }
                        updateToken();
                    });

                    input.addEventListener('keydown', (e) => {
                        if (e.key === 'Backspace' && !e.target.value && index > 0) {
                            inputs[index - 1].focus();
                        }
                    });
                    
                    input.addEventListener('paste', (e) => {
                        e.preventDefault();
                        const pastedData = e.clipboardData.getData('text').slice(0, 6).toUpperCase();
                        if (pastedData) {
                            pastedData.split('').forEach((char, i) => {
                                if (inputs[i]) {
                                    inputs[i].value = char;
                                }
                            });
                            if (pastedData.length < 6) {
                                inputs[pastedData.length].focus();
                            } else {
                                inputs[5].focus();
                            }
                            updateToken();
                        }
                    });
                });

                function updateToken() {
                    let tokenStr = '';
                    inputs.forEach(input => tokenStr += input.value);
                    hiddenToken.value = tokenStr;
                }
            });
        </script>

        <div class="{{ $styles['footer_container'] }}">
            <p class="{{ $styles['footer_text'] }}">
                ¿No recibiste el correo?
                <a href="{{ route('verifyEmail') }}" class="{{ $styles['footer_link'] }}">Reenviar código</a>
            </p>
        </div>
    </x-slot>
</x-auth-layout>
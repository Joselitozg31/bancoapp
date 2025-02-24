// src/app/(auth)/login/page.js
import Link from 'next/link'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl p-8 transition-all duration-300 hover:shadow-3xl">
        <div className="flex justify-center mb-8 animate-fade-in">
          <Image
            src="/logo.png"
            alt="Logo del Banco"
            width={180}
            height={60}
            borderradius={10}
            className="rounded-full overflow-hidden h-24 w-auto transform hover:scale-105 transition-transform"
          />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center font-serif">
          Bienvenido de vuelta
        </h1>

        <form className="space-y-6">
          <div className="group">
            <label className="block text-sm font-medium text-gray-600 mb-2 group-hover:text-blue-600 transition-colors">
              Correo Electrónico
            </label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              placeholder="tu@email.com"
            />
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-gray-600 mb-2 group-hover:text-blue-600 transition-colors">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
              />
              <span className="text-sm text-gray-600">Recordar dispositivo</span>
            </div>
            
            <Link href="#" className="text-sm text-blue-600 hover:text-blue-500 underline-offset-2 hover:underline">
              ¿Contraseña olvidada?
            </Link>
          </div>

          <button className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transform hover:scale-[1.01] transition-all active:scale-95">
            Acceder a mi cuenta
          </button>
        </form>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <p className="text-center text-sm text-gray-500">
            ¿Primera vez en el banco?{' '}
            <Link href="#" className="font-semibold text-blue-600 hover:text-blue-500 underline underline-offset-2">
              Abre tu cuenta ahora
            </Link>
          </p>
          
          <div className="mt-6 flex justify-center space-x-4">
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <span className="sr-only">Google</span>
              <Image src="/google-icon.svg" width={24} height={24} alt="Google" />
            </button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <span className="sr-only">Apple</span>
              <Image src="/apple-icon.svg" width={24} height={24} alt="Apple" />
            </button>
            <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
              <span className="sr-only">Facebook</span>
              <Image src="/facebook-icon.svg" width={24} height={24} alt="Facebook" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
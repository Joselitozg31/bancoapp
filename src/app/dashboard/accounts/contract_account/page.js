'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/header';

export default function ContractAccountPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCheckboxError, setShowCheckboxError] = useState(false);
  const [formData, setFormData] = useState({
    account_type: '',
    currency: 'EUR',
    termsAccepted: false,
    privacyAccepted: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.termsAccepted || !formData.privacyAccepted) {
      setShowCheckboxError(true);
      setError('Debes aceptar los términos y la política de privacidad');
      return;
    }
    
    setShowCheckboxError(false);
    setLoading(true);
    setError('');

    try {
      const userData = JSON.parse(localStorage.getItem('user'));
      if (!userData || !userData.document_number) {
        throw new Error('Usuario no autenticado');
      }

      const response = await fetch('/api/dashboard/accounts/contract_account', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'document_number': userData.document_number
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Error al contratar la cuenta');
      }

      router.push('/dashboard/accounts/list_account');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full flex flex-col items-center justify-center bg-blue-900 pt-24">
      <Header />
      <div className="container max-w-2xl p-8 bg-white bg-opacity-75 rounded-lg shadow-lg mt-24">
        <h1 className="text-2xl font-bold mb-6 text-center text-white">Contratar Nueva Cuenta</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-white mb-2">Tipo de Cuenta</label>
            <select
              value={formData.account_type}
              onChange={(e) => setFormData({...formData, account_type: e.target.value})}
              className="w-full p-2 rounded"
              required
            >
              <option value="">Seleccione tipo de cuenta</option>
              <option value="AHORRO">Cuenta de Ahorro</option>
              <option value="CORRIENTE">Cuenta Corriente</option>
              <option value="NOMINA">Cuenta Nómina</option>
            </select>
          </div>

          <div>
            <label className="block text-white mb-2">Moneda</label>
            <select
              value={formData.currency}
              onChange={(e) => setFormData({...formData, currency: e.target.value})}
              className="w-full p-2 rounded"
              required
            >
              <option value="EUR">Euro (EUR)</option>
              <option value="USD">Dólar (USD)</option>
              <option value="GBP">Libra (GBP)</option>
            </select>
          </div>

          <div className="space-y-4 flex flex-col items-center">
            <div className="flex items-center justify-center w-full">
              <input
                type="checkbox"
                id="terms"
                checked={formData.termsAccepted}
                onChange={(e) => setFormData({...formData, termsAccepted: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-white">
                Acepto los términos y condiciones
              </label>
            </div>

            <div className="flex items-center justify-center w-full">
              <input
                type="checkbox"
                id="privacy"
                checked={formData.privacyAccepted}
                onChange={(e) => setFormData({...formData, privacyAccepted: e.target.checked})}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="privacy" className="ml-2 block text-sm text-white">
                Firmar acuerdo
              </label>
            </div>

            {showCheckboxError && (!formData.termsAccepted || !formData.privacyAccepted) && (
              <p className="text-red-500 text-sm font-medium">
                * Debes marcar ambas casillas para continuar
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !formData.termsAccepted || !formData.privacyAccepted}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loading ? 'Contratando...' : 'Contratar Cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { Loader2, TrendingUp, TrendingDown, Clock, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalPaid: 0,
    totalRefunded: 0,
    totalPending: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data: payments, error } = await supabase
        .from('payments')
        .select(`
          amount,
          refunds ( amount )
        `);

      if (error) throw error;

      if (payments) {
        let paid = 0;
        let refunded = 0;

        payments.forEach((p: any) => {
          const pAmount = Number(p.amount) || 0;
          paid += pAmount;
          if (p.refunds) {
            p.refunds.forEach((r: any) => {
              refunded += Number(r.amount) || 0;
            });
          }
        });

        // Ensure no negative pending due to bad data
        const pending = Math.max(0, paid - refunded);

        setStats({
          totalPaid: paid,
          totalRefunded: refunded,
          totalPending: pending
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(amount);
  };

  return (
    <div>
      <h2 className='text-2xl font-bold mb-6 text-gray-800 dark:text-white'>Resumen Financiero</h2>
      
      <div className='mb-8 p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
        <h1 className='text-xl text-gray-600 dark:text-gray-300'>
          Hola, <span className='font-bold text-gray-900 dark:text-white'>{user?.email}</span>
        </h1>
        <p className='text-sm text-gray-500 mt-1'>Aquí tienes el estado actual de tus cuentas compartidas.</p>
      </div>

      {loading ? (
        <div className='flex justify-center p-8'>
          <Loader2 className='w-8 h-8 animate-spin text-blue-600' />
        </div>
      ) : (
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          {/* Total Paid */}
          <div className='p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800 transition hover:shadow-lg hover:-translate-y-1 relative overflow-hidden'>
            <div className='relative z-10'>
               <div className='flex items-center justify-between mb-4'>
                <h3 className='text-sm font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300'>Yo Pagué</h3>
                <TrendingUp className='w-6 h-6 text-blue-600 dark:text-blue-400' />
              </div>
              <p className='text-4xl font-extrabold text-blue-900 dark:text-white'>{formatCurrency(stats.totalPaid)}</p>
              <p className='text-xs text-blue-600/80 dark:text-blue-400 mt-2'>Salidas totales de dinero</p>
            </div>
          </div>

          {/* Total Refunded */}
          <div className='p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-100 dark:border-green-800 transition hover:shadow-lg hover:-translate-y-1 relative overflow-hidden'>
             <div className='relative z-10'>
              <div className='flex items-center justify-between mb-4'>
                <h3 className='text-sm font-bold uppercase tracking-wider text-green-800 dark:text-green-300'>Me Pagaron</h3>
                <TrendingDown className='w-6 h-6 text-green-600 dark:text-green-400' />
              </div>
              <p className='text-4xl font-extrabold text-green-900 dark:text-white'>{formatCurrency(stats.totalRefunded)}</p>
              <p className='text-xs text-green-600/80 dark:text-green-400 mt-2'>Dinero recuperado</p>
            </div>
          </div>

          {/* Pending */}
          <div className='p-6 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-100 dark:border-orange-800 transition hover:shadow-lg hover:-translate-y-1 relative overflow-hidden'>
             <div className='relative z-10'>
               <div className='flex items-center justify-between mb-4'>
                <h3 className='text-sm font-bold uppercase tracking-wider text-orange-800 dark:text-orange-300'>Me Deben</h3>
                <Clock className='w-6 h-6 text-orange-600 dark:text-orange-400' />
              </div>
              <p className='text-4xl font-extrabold text-orange-900 dark:text-white'>{formatCurrency(stats.totalPending)}</p>
              <p className='text-xs text-orange-600/80 dark:text-orange-400 mt-2'>Saldo pendiente de cobro</p>
            </div>
          </div>
        </div>
      )}

      {/* Visual Bar Chart (CSS based) */}
      {!loading && stats.totalPaid > 0 && (
        <div className='mb-8 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700'>
          <h3 className='text-lg font-bold text-gray-800 dark:text-white mb-6'>Balance General</h3>
          <div className='flex items-end space-x-8 h-64 border-b border-gray-200 dark:border-gray-700 pb-2'>
            {/* Bar: Total Paid */}
            <div className='flex-1 flex flex-col justify-end items-center group relative'>
               <div className='text-xs font-bold text-blue-600 dark:text-blue-400 mb-2 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6'>
                 {formatCurrency(stats.totalPaid)}
               </div>
               <div 
                 className='w-full max-w-[100px] bg-blue-500 rounded-t-lg hover:bg-blue-600 transition-all duration-500 relative'
                 style={{ height: '100%' }}
               >
                 <div className='absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity animate-pulse' />
               </div>
               <p className='text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium'>Yo Pagué</p>
            </div>

            {/* Bar: Total Refunded */}
            <div className='flex-1 flex flex-col justify-end items-center group relative'>
               <div className='text-xs font-bold text-green-600 dark:text-green-400 mb-2 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6'>
                 {formatCurrency(stats.totalRefunded)}
               </div>
               <div 
                 className='w-full max-w-[100px] bg-green-500 rounded-t-lg hover:bg-green-600 transition-all duration-500'
                 style={{ height: `${Math.min((stats.totalRefunded / stats.totalPaid) * 100, 100)}%` }}
               />
               <p className='text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium'>Me Pagaron</p>
            </div>
             
             {/* Bar: Pending */ }
             <div className='flex-1 flex flex-col justify-end items-center group relative'>
                <div className='text-xs font-bold text-orange-600 dark:text-orange-400 mb-2 opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6'>
                 {formatCurrency(stats.totalPending)}
               </div>
               <div 
                 className='w-full max-w-[100px] bg-orange-500 rounded-t-lg hover:bg-orange-600 transition-all duration-500'
                 style={{ height: `${Math.min((stats.totalPending / stats.totalPaid) * 100, 100)}%` }}
               />
               <p className='text-sm text-gray-600 dark:text-gray-400 mt-3 font-medium'>Pendiente</p>
             </div>
          </div>
        </div>
      )}

      <div className='flex justify-end gap-4'>
        <Link to='/debts' className='px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 font-medium transition'>
          Ver Reporte por Persona
        </Link>
        <Link to='/payments' className='flex items-center text-blue-600 hover:text-blue-800 font-medium px-4 py-2 border border-blue-100 dark:border-blue-900/30 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/10 transition'>
          <Search className='w-4 h-4 mr-2'/>
          Ver Historial Completo
        </Link>
      </div>
    </div>
  );
}

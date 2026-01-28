import { useParams, useNavigate } from 'react-router-dom';

export default function PaymentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  return (
    <div className="max-w-2xl mx-auto">
       <h2 className="text-2xl font-semibold mb-6 text-gray-800 dark:text-white">{isEdit ? 'Edit Payment' : 'New Payment'}</h2>
       <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
         <form className="space-y-6">
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Service Name</label>
               <input type="text" className="mt-1 block w-full rounded-md border text-black border-slate-700 p-2" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount</label>
               <input type="number" step="0.01" className="mt-1 block w-full rounded-md border text-black border-slate-700 p-2" />
            </div>
            <div>
               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
               <input type="date" className="mt-1 block w-full rounded-md border text-black border-slate-700 p-2" />
            </div>
            <div className="flex justify-end space-x-3">
               <button type="button" onClick={() => navigate(-1)} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Cancel</button>
               <button type="button" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Save</button>
            </div>
         </form>
       </div>
    </div>
  )
}

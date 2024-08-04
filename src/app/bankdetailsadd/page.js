import { Suspense } from 'react';
import BankaddComponents from '@/components/app/BankaddComponents'
 
export default function addbankdetails() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <BankaddComponents />
    </Suspense>
  )
}

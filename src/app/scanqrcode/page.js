import { Suspense} from 'react';
import ScanqrcodeComponent from '@/components/app/ScanqrcodeComponent'
export default function Scanqrcode() {
  return (
      <Suspense fallback={<p>...Loading</p>}>
        <ScanqrcodeComponent />
      </Suspense>
  )
}

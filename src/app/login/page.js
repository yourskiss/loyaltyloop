import { Suspense} from 'react';
import LoginComponent from '@/components/app/LoginComponent';
export default function login() {
  return (
    <Suspense fallback={<p>...Loading</p>}>
      <LoginComponent />
    </Suspense>
)
}

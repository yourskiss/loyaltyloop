// import localFont from 'next/font/local';
// const lneue = localFont({ weight: 'normal', variable: '--font-lneue', src: '../../public/assets/fonts/LarishNeueSemiboldRegular.woff2' });
// const arialmt = localFont({ weight: 'normal', variable: '--font-arialmt', src: '../../public/assets/fonts/arialmt.woff2' });

import { Roboto } from "next/font/google";
const rbt = Roboto({
  weight: ["300","400", "500", "700","900"],
  style: "normal",
  subsets: ["latin"],
  fallback: ["system-ui", "sans-serif"],
  display: "swap",
});
import "./globals.css";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Starfield from 'react-starfield';
import { GoogleAnalytics } from '@next/third-parties/google';
import PwaModal from '@/components/shared/PwaModal';
import PwaIOS from '@/components/shared/PwaIOS';
 
export const metadata = {
  title: "LoyaltyLoop",
  description: "LoyaltyLoop is an easy and affordable customer experience service for any business or brand",
  manifest:'/manifest.json',
  robots: {
    index: false,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: false,
      noimageindex: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      url: '/assets/images/icons/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      url: '/assets/images/icons/favicon-16x16.png',
    },
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      url: '/assets/images/icons/apple-touch-icon.png',
    },
  ],
};

export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <meta name="background_color" content="#7A4FF3"/>
      <meta name="theme-color" content="#5A39A2"/>
      <GoogleAnalytics gaId="G-xxxxxxxxx" />
      <meta name="google-site-verification" content="xxxxxxxxxxxxxxxxxxxxxxxxxx" />

      <body className={rbt.className}>
      

        <main className="main">
            {children}
            <PwaModal />
            <PwaIOS />
            <ToastContainer position="top-center" autoClose={2000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="colored"  />
            <Starfield starCount={1000} starColor={[255, 255, 255]} speedFactor={0.05} />

        </main>
      </body>
    </html>
  );
}


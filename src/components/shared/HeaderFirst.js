"use client";
import Image from 'next/image';
 
export default  function HeaderFirst() {
 
  return (
    <div className='headercontainer'>
      <header className='headersection'>
        <aside className="logo">
          <Image src="/assets/images/logo.png" width={270} height={50} alt="logo" quality={99} />
        </aside>
      </header>
    </div>
  )
}

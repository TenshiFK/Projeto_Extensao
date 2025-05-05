import Image from 'next/image';
import Img1 from '../../assets/imgs/img.png';



export default function Page() {

    return (
      <main>
        <div className='flex items-center justify-center w-full md:mt-20 md:h-full h-screen'>
          <Image src={Img1} alt='Img-Home' className='w-80 sm:w-100'/> 
        </div>
        
      </main>
    );
}
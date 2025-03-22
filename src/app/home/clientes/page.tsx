import Tables from "@/app/components/tables/Tables";
import { PlusIcon } from "@heroicons/react/24/outline";


export default async function Page() {

    return (
        <main>
          <div className="flex flex-col md:flex-row md:items-center">
            <form className="w-full flex sm:space-x-8">
              <button className="bg-main-blue text-main-white md:text-base text-sm font-semibold py-2 px-5 rounded-[30px]">Filtrar por:</button>
              <input className="px-4 md:w-[75%] w-full border" type="text" />
            </form>
            
            <div className="flex md:justify-end md:w-130 w-full">
              <button className="flex justify-center gap-2 bg-main-blue text-main-white md:text-base text-sm font-semibold py-2 px-4 rounded-[30px]">Cadastrar novo cliente <PlusIcon className="w-6 h-6 text-main-white"/> </button> 
            </div>
            
          </div>
          <div className="mt-16">
            <Tables/>
          </div>
        </main>
    );
}
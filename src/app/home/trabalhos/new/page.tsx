import NewEditTrabalhoForm from "@/app/components/forms/NewEditTrabalho";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Page() {
  

    return (
      <main>
        <div className="mb-4">
          <Link href="/home/trabalhos">
            <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer"/>
          </Link>
        </div>
        <h1 className={`mb-4 text-xl md:text-2xl`}>
          Novo Trabalho
        </h1>
        <NewEditTrabalhoForm/>                                         
      </main>
    );
}
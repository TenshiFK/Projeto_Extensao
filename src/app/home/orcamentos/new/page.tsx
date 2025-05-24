import NewEditOrcamentoForm from "@/app/components/forms/NewEditOrcamento";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export const metadata = {
  title: 'Novo Orçamento',
};

export default function Page() {
  

    return (
      <main>
        <div className="mb-4">
          <Link href="/home/orcamentos">
            <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer"/>
          </Link>
        </div>
        <h1 className={`mb-4 text-xl md:text-2xl font-semibold`}>
          Novo Orçamento
        </h1>
        <NewEditOrcamentoForm/>                                         
      </main>
    );
}
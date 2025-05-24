import NewEditFornecedoresForm from "@/app/components/forms/NewEditFornecedores";
import { ArrowLeftCircleIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export const metadata = {
  title: 'Novo Fornecedor',
};

export default function Page() {
  

    return (
      <main>
        <div className="mb-4">
          <Link href="/home/fornecedores">
            <ArrowLeftCircleIcon className="size-8 text-main-blue cursor-pointer"/>
          </Link>
        </div>
        <h1 className={`mb-4 text-xl md:text-2xl font-semibold`}>
          Novo Fornecedor
        </h1>
        <NewEditFornecedoresForm/>                                         
      </main>
    );
}
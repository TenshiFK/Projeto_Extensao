import NewEditFornecedoresForm from "@/app/components/forms/NewEditFornecedores";


export default function Page() {
  

    return (
      <main>
        <h1 className={`mb-4 text-xl md:text-2xl`}>
          Novo Fornecedor
        </h1>
        <NewEditFornecedoresForm/>                                         
      </main>
    );
}
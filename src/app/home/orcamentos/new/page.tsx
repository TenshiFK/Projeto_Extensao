import NewEditOrcamentoForm from "@/app/components/forms/NewEditOrcamento";

export default function Page() {
  

    return (
      <main>
        <h1 className={`mb-4 text-xl md:text-2xl`}>
          Novo Orçamento
        </h1>
        <NewEditOrcamentoForm/>                                         
      </main>
    );
}
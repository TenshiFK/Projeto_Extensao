import NewEditProdutoForm from "@/app/components/forms/NewEditEstoque";

export default function Page() {
  

    return (
      <main>
        <h1 className={`mb-4 text-xl md:text-2xl`}>
          Novo Produto
        </h1>
        <NewEditProdutoForm/>                                         
      </main>
    );
}
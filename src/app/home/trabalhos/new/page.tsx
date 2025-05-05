import NewEditTrabalhoForm from "@/app/components/forms/NewEditTrabalho";

export default function Page() {
  

    return (
      <main>
        <h1 className={`mb-4 text-xl md:text-2xl`}>
          Novo Trabalho
        </h1>
        <NewEditTrabalhoForm/>                                         
      </main>
    );
}
import NewEditClientForm from "@/app/components/forms/NewEditClient";

export default function Page() {
  

    return (
      <main>
        <h1 className={`mb-4 text-xl md:text-2xl`}>
          Novo Cliente
        </h1>
        <NewEditClientForm/>                                         
      </main>
    );
}
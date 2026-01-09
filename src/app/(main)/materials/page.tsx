import Materials_Section from "@/components/MaterialPage/Materials-Section";
import { getMaterialsService } from "@/services/materialServices";

export const dynamic = "force-dynamic";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export default async function Home(props: { searchParams: SearchParams }) {
  const searchParams = await props.searchParams;
  let materials = [];
  const startWithDerivados = searchParams?.derivados === "true";
  try {
    materials = await getMaterialsService();
  } catch (error) {
    console.error("Error cargando materiales:", error);
  }

  return (
    <main>
      <Materials_Section
        initialMaterials={materials}
        initialDerivados={startWithDerivados}
      />
    </main>
  );
}

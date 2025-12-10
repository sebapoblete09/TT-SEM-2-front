import Materials_Section from "@/components/MaterialPage/Materials-Section";
import { getMaterialsService } from "@/services/materialServices";

export default async function Home() {
  let materials = [];
  try {
    materials = await getMaterialsService();
  } catch (error) {
    console.error("Error cargando materiales:", error);
  }

  return (
    <main>
      <Materials_Section initialMaterials={materials} />
    </main>
  );
}

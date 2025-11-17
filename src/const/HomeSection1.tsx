import { Leaf, Lightbulb, Users } from "lucide-react";

const benefits = [
  {
    icon: Leaf,
    title: "Sostenible",
    description:
      "Reduce la huella de carbono usando materiales renovables y biodegradables.",
    iconColor: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "hover:border-primary",
  },
  {
    icon: Lightbulb,
    title: "Innovador",
    description:
      "Fomenta la investigación y el desarrollo de nuevas tecnologías en la UTEM.",
    iconColor: "text-accent", // <--- Color 2
    bgColor: "bg-accent/10",
    borderColor: "hover:border-accent",
  },
  {
    icon: Users,
    title: "Comunitario",
    description:
      "Construye una base de conocimiento abierta, creada y compartida por todos.",
    iconColor: "text-secondary", // <--- Color 3
    bgColor: "bg-secondary/10",
    borderColor: "hover:border-secondary",
  },
];

export default benefits;

import "@testing-library/jest-dom";
import { render } from "@testing-library/svelte";

import DatasetList from "./DatasetList.svelte";
import type { Dataset } from "src/definitions/datasets";

describe("Test the dataset list", () => {
  const now = new Date();
  const fakeDatasets: Dataset[] = [
    {
      id: "uuid1",
      createdAt: now,
      title: "Inventaire des arbres et forêts",
      description: "Fichier de l'ensemble des arbres et forêts de France.",
      formats: ["database"],
    },
    {
      id: "uuid2",
      createdAt: now,
      title: "Bureaux de vote Hauts-de-France",
      description:
        "Fichier JSON des bureaux de vote de l'ensemble des circonscriptions de la région Hauts-de-France.",
      formats: ["api"],
    },
    {
      id: "uuid3",
      createdAt: now,
      title: "Masse salariale du secteur privé",
      description:
        "Masse salariale telle que calculée par l'Urssaf et publiée dans le Baromètre économique.",
      formats: ["file_tabular"],
    },
  ];

  test("The list has the expected number of items", () => {
    const { getAllByRole } = render(DatasetList, {
      props: { datasets: fakeDatasets },
    });
    expect(getAllByRole("listitem")).toHaveLength(3);
  });
});

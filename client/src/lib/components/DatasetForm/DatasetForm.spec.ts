import "@testing-library/jest-dom";

import DatasetForm from "./DatasetForm.svelte";
import { render, fireEvent } from "@testing-library/svelte";
import type { DataFormat, DatasetFormData } from "src/definitions/datasets";
import { login, logout } from "$lib/stores/auth";
import { buildFakeTag } from "src/tests/factories/tags";

describe("Test the dataset form", () => {
  test('The "title" field is present', () => {
    const { getByLabelText } = render(DatasetForm);
    const title = getByLabelText("Nom du jeu de la donnée", { exact: false });
    expect(title).toBeInTheDocument();
    expect(title).toBeRequired();
  });

  test('The "description" field is present', () => {
    const { getByLabelText } = render(DatasetForm);
    const description = getByLabelText("Description", { exact: false });
    expect(description).toBeInTheDocument();
    expect(description).toBeRequired();
  });

  test('The "formats" field is present', async () => {
    const { getAllByRole } = render(DatasetForm);
    const checkboxes = getAllByRole("checkbox");
    expect(checkboxes.length).toBeGreaterThan(0);
  });

  test('The "geographicalCoverage" field is present', async () => {
    const { getByLabelText } = render(DatasetForm);
    const geographicalCoverage = getByLabelText("Couverture géographique", {
      exact: false,
    });
    expect(geographicalCoverage).toBeInTheDocument();
    expect(geographicalCoverage).toBeRequired();
  });

  test('The "technicalSource" field is present', async () => {
    const { getByLabelText } = render(DatasetForm);
    const technicalSource = getByLabelText("Système d'information source", {
      exact: false,
    });
    expect(technicalSource).toBeInTheDocument();
    expect(technicalSource).not.toBeRequired();
  });

  test('The "tags" field is present', async () => {
    const { getByLabelText } = render(DatasetForm);
    const tags = getByLabelText("Mot-clés", {
      exact: false,
    });
    expect(tags).toBeInTheDocument();
  });

  test("At least one format is required", async () => {
    const { getAllByRole } = render(DatasetForm);
    const checkboxes = getAllByRole("checkbox", { checked: false });
    checkboxes.forEach((checkbox) => expect(checkbox).toBeRequired());
    await fireEvent.click(checkboxes[0]);
    expect(checkboxes[0]).toBeChecked();
    checkboxes
      .slice(1)
      .forEach((checkbox) => expect(checkbox).not.toBeChecked());
    checkboxes.forEach((checkbox) => expect(checkbox).not.toBeRequired());
  });

  test('The "producerEmail" field is present', () => {
    const { getByLabelText } = render(DatasetForm);
    const producerEmail = getByLabelText(
      "Adresse e-mail du service producteur",
      {
        exact: false,
      }
    );
    expect(producerEmail).toBeInTheDocument();
    expect(producerEmail).not.toBeRequired();
    expect(producerEmail).toHaveAttribute("type", "email");
  });

  test('The "contact emails" field is present', () => {
    const { getAllByLabelText } = render(DatasetForm);
    const inputs = getAllByLabelText(/Contact \d/);
    expect(inputs.length).toBe(1);
    expect(inputs[0]).toBeRequired();
    expect(inputs[0]).toHaveAttribute("type", "email");
  });

  test('The "publishedUrl" field is present', async () => {
    const { getByLabelText } = render(DatasetForm);
    const publishedUrl = getByLabelText("Page open data", {
      exact: false,
    });
    expect(publishedUrl).toBeInTheDocument();
    expect(publishedUrl).not.toBeRequired();
  });

  test("The submit button is present", () => {
    const { getByRole } = render(DatasetForm);
    expect(getByRole("button", { name: /Publier/i })).toBeInTheDocument();
  });

  test("The submit button displays a loading text when loading", async () => {
    const props = { submitLabel: "Envoyer", loadingLabel: "Ça charge..." };

    const { getByRole, rerender } = render(DatasetForm, { props });
    expect(getByRole("button", { name: "Envoyer" })).toBeInTheDocument();

    rerender({ props: { ...props, loading: true } });
    expect(getByRole("button", { name: /Ça charge/i })).toBeInTheDocument();
  });

  test("The fields are initialized with initial values", async () => {
    const fakeTag = buildFakeTag({ name: "Architecture" });
    const initial: DatasetFormData = {
      title: "Titre initial",
      description: "Description initiale",
      formats: ["website"],
      producerEmail: "service.initial@mydomain.org",
      contactEmails: ["person@mydomain.org"],
      service: "A nice service",
      lastUpdatedAt: new Date("2022-02-01"),
      updateFrequency: "never",
      geographicalCoverage: "europe",
      technicalSource: "foo/bar",
      publishedUrl: "https://data.gouv.fr/datasets/example",
      tags: [fakeTag],
    };
    const props = { initial };

    const { getByLabelText, getAllByLabelText, container, getAllByText } =
      render(DatasetForm, { props });

    const title = getByLabelText("Nom du jeu de la donnée", {
      exact: false,
    }) as HTMLInputElement;
    expect(title.value).toBe("Titre initial");

    const description = getByLabelText("Description", {
      exact: false,
    }) as HTMLInputElement;
    expect(description.value).toBe("Description initiale");

    const getFormatCheckbox = (value: DataFormat) =>
      container.querySelector(`input[value='${value}']`);
    expect(getFormatCheckbox("file_tabular")).not.toBeChecked();
    expect(getFormatCheckbox("file_gis")).not.toBeChecked();
    expect(getFormatCheckbox("api")).not.toBeChecked();
    expect(getFormatCheckbox("database")).not.toBeChecked();
    expect(getFormatCheckbox("website")).toBeChecked();
    expect(getFormatCheckbox("other")).not.toBeChecked();

    const producerEmail = getByLabelText(
      "Adresse e-mail du service producteur",
      {
        exact: false,
      }
    ) as HTMLInputElement;
    expect(producerEmail.value).toBe("service.initial@mydomain.org");

    const contactEmails = getAllByLabelText(/Contact \d/);
    expect(contactEmails.length).toBe(1);
    expect(contactEmails[0]).toHaveValue("person@mydomain.org");
    expect(contactEmails[0]).not.toBeRequired();

    const lastUpdatedAt = getByLabelText("Date de la dernière mise à jour", {
      exact: false,
    }) as HTMLInputElement;
    expect(lastUpdatedAt.value).toBe("2022-02-01");

    const updateFrequency = getByLabelText("Fréquence de mise à jour", {
      exact: false,
    }) as HTMLSelectElement;
    expect(updateFrequency.value).toBe("never");

    const technicalSource = getByLabelText("Système d'information source", {
      exact: false,
    }) as HTMLSelectElement;
    expect(technicalSource.value).toBe("foo/bar");

    const publishedUrl = getByLabelText("Page open data", {
      exact: false,
    }) as HTMLSelectElement;
    expect(publishedUrl.value).toBe("https://data.gouv.fr/datasets/example");
    const tags = getAllByText(fakeTag.name);
    expect(tags).toHaveLength(1);
  });

  test("Null fields are correctly handled in HTML and submitted as null", async () => {
    const initial: DatasetFormData = {
      title: "Titre initial",
      description: "Description initiale",
      formats: ["website"],
      producerEmail: null,
      contactEmails: ["person@mydomain.org"],
      service: "A nice service",
      lastUpdatedAt: null,
      updateFrequency: null,
      geographicalCoverage: "europe",
      technicalSource: "foo/bar",
      publishedUrl: null,
      tags: [buildFakeTag()],
    };
    const props = { initial };
    const { getByLabelText, getByRole, component } = render(DatasetForm, {
      props,
    });

    const lastUpdatedAt = getByLabelText("Date de la dernière mise à jour", {
      exact: false,
    }) as HTMLInputElement;
    expect(lastUpdatedAt.value).toBe("");

    const updateFrequency = getByLabelText("Fréquence de mise à jour", {
      exact: false,
    }) as HTMLSelectElement;

    // Simulate touching the fields. This sends HTML values such as "" (empty date or select value)
    // which should be handled as null.
    await fireEvent.blur(lastUpdatedAt);
    await fireEvent.blur(updateFrequency);

    const form = getByRole("form");
    await fireEvent.submit(form);
    const submittedValue = await new Promise<DatasetFormData>((resolve) => {
      component.$on("save", (event) => resolve(event.detail));
    });
    expect(submittedValue.lastUpdatedAt).toBe(null);
    expect(submittedValue.updateFrequency).toBe(null);
    expect(submittedValue.producerEmail).toBe(null);
    expect(submittedValue.publishedUrl).toBe(null);
  });

  describe("Authenticated tests", () => {
    beforeAll(() =>
      login({ email: "john@domain.org", role: "USER", apiToken: "abcd1234" })
    );

    afterAll(() => logout());

    test("User email is used as default contact email", () => {
      const { getAllByLabelText } = render(DatasetForm);
      const inputs = getAllByLabelText(/Contact \d/) as HTMLInputElement[];
      expect(inputs.length).toBe(1);
      expect(inputs[0].value).toBe("john@domain.org");
      expect(inputs[0]).not.toBeRequired();
    });
  });
});

import "@testing-library/jest-dom";

import ContactEmailsField from "./ContactEmailsField.svelte";
import {
  render,
  fireEvent,
  getByRole as getByRoleIn,
} from "@testing-library/svelte";

describe("ContactEmailsField component", () => {
  test("Only one input is displayed by default", async () => {
    const { getAllByTestId } = render(ContactEmailsField);
    const inputs = getAllByTestId("contactEmails", { exact: false });
    expect(inputs.length).toBe(1);
    expect(inputs[0]).toHaveValue("");
    expect(inputs[0]).toBeRequired();
    expect(inputs[0]).toHaveAttribute("type", "email");
  });

  test("I can fill the input", async () => {
    const { getAllByTestId } = render(ContactEmailsField);
    const inputs = getAllByTestId("contactEmails", { exact: false });
    await fireEvent.input(inputs[0], {
      target: { value: "contact@mydomain.org" },
    });
    const input = inputs[0] as HTMLInputElement;
    expect(input.value).toBe("contact@mydomain.org");
    expect(input).not.toBeRequired();
  });

  test("I can add a few inputs", async () => {
    const { getAllByTestId, getByRole } = render(ContactEmailsField);
    let inputs = getAllByTestId("contactEmails", { exact: false });
    expect(inputs.length).toBe(1);

    const addButton = getByRole("button", { name: /Ajouter/i });

    await fireEvent.click(addButton);
    inputs = getAllByTestId("contactEmails", { exact: false });
    expect(inputs.length).toBe(2);
    expect(inputs[0]).toBeRequired();
    expect(inputs[1]).toBeRequired();

    await fireEvent.click(addButton);
    inputs = getAllByTestId("contactEmails", { exact: false });
    expect(inputs.length).toBe(3);
    expect(inputs[0]).toBeRequired();
    expect(inputs[1]).toBeRequired();
    expect(inputs[2]).toBeRequired();
  });

  test("I can update an input value", async () => {
    const { getAllByTestId, getByRole } = render(ContactEmailsField);
    const addButton = getByRole("button", { name: /Ajouter/i });
    await fireEvent.click(addButton);
    await fireEvent.click(addButton);
    const inputs = getAllByTestId("contactEmails", { exact: false });
    expect(inputs.length).toBe(3);

    await fireEvent.input(inputs[2], {
      target: { value: "contact@mydomain.org" },
    });
    expect((inputs[0] as HTMLInputElement).value).toBe("");
    expect((inputs[2] as HTMLInputElement).value).toBe("contact@mydomain.org");
    expect(inputs[0]).not.toBeRequired();
    expect(inputs[1]).not.toBeRequired();
    expect(inputs[2]).not.toBeRequired();
  });

  test("I can remove an input by clicking on delete button", async () => {
    const { getAllByTestId, getByRole } = render(ContactEmailsField);
    const addButton = getByRole("button", { name: /Ajouter/i });
    await fireEvent.click(addButton);
    await fireEvent.click(addButton);
    await fireEvent.click(addButton);
    let inputs = getAllByTestId("contactEmails", { exact: false });

    await fireEvent.input(inputs[2], {
      target: { value: "contact@mydomain.org" },
    });
    expect(inputs.length).toBe(4);
    const removeButton = getByRoleIn(inputs[2].parentElement!, "button", {
      name: /Supprimer/i,
    });

    await fireEvent.click(removeButton);
    inputs = getAllByTestId("contactEmails", { exact: false });
    expect(inputs.length).toBe(3);

    const values = (inputs as HTMLInputElement[]).map((item) => item.value);
    expect(values.findIndex((item) => item === "contact@mydomain.org")).toBe(
      -1
    );
  });

  test("I can prefill the first input", async () => {
    const { getAllByTestId } = render(ContactEmailsField, {
      contactEmails: ["hello@foo.com"],
    });
    const inputs = getAllByTestId("contactEmails", { exact: false });
    expect((inputs[0] as HTMLInputElement).value).toBe("hello@foo.com");
  });

  test("I can add an input with prefilled input", async () => {
    const { getAllByTestId, getByRole } = render(ContactEmailsField, {
      contactEmails: ["hello@foo.com"],
    });
    let inputs = getAllByTestId("contactEmails", { exact: false });
    expect(inputs.length).toBe(1);
    expect((inputs[0] as HTMLInputElement).value).toBe("hello@foo.com");

    const addButton = getByRole("button", { name: /Ajouter/i });
    await fireEvent.click(addButton);
    inputs = getAllByTestId("contactEmails", { exact: false });
    expect(inputs.length).toBe(2);
    await fireEvent.input(inputs[1], {
      target: { value: "contact@mydomain.org" },
    });

    expect((inputs[1] as HTMLInputElement).value).toBe("contact@mydomain.org");
  });

  test("I can clear sole input by clicking on delete button", async () => {
    const { getAllByTestId } = render(ContactEmailsField, {
      contactEmails: ["hello@foo.com"],
    });

    const inputs = getAllByTestId("contactEmails", {
      exact: false,
    }) as HTMLInputElement[];
    const removeButton = getByRoleIn(inputs[0].parentElement!, "button", {
      name: /Supprimer/i,
    });

    await fireEvent.click(removeButton);
    expect(inputs[0].value).toBe("");
    expect(inputs[0]).toBeRequired();
  });
});

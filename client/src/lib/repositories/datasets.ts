import type {
  Dataset,
  DatasetCreateData,
  DatasetUpdateData,
} from "src/definitions/datasets";
import type { ApiPagination, Fetch } from "src/definitions/fetch";
import { getHeaders, getApiUrl, makeApiRequest } from "$lib/fetch";
import { toQueryString } from "$lib/util/urls";
import { toDataset, toPayload } from "$lib/transformers/dataset";
import { Maybe } from "$lib/util/maybe";

type GetDatasetByID = (opts: {
  fetch: Fetch;
  apiToken: string;
  id: string;
}) => Promise<Maybe<Dataset>>;

export const getDatasetByID: GetDatasetByID = async ({
  fetch,
  apiToken,
  id,
}) => {
  const url = `${getApiUrl()}/datasets/${id}/`;
  const request = new Request(url, {
    headers: new Headers(getHeaders(apiToken)),
  });

  const response = await makeApiRequest(fetch, request);

  return Maybe.map(response, async (response) =>
    toDataset(await response.json())
  );
};

type GetDatasets = (opts: {
  fetch: Fetch;
  apiToken: string;
  q?: string;
}) => Promise<Maybe<Dataset[]>>;

export const getDatasets: GetDatasets = async ({ fetch, apiToken, q }) => {
  const queryItems: [string, string][] = [];
  if (typeof q === "string") {
    queryItems.push(["q", q], ["highlight", "true"]);
  }
  const queryString = toQueryString(queryItems);
  const url = `${getApiUrl()}/datasets/${queryString}`;
  const request = new Request(url, {
    headers: new Headers(getHeaders(apiToken)),
  });

  const response = await makeApiRequest(fetch, request);

  return Maybe.map(response, async (response) => {
    const { items }: ApiPagination = await response.json();
    return items.map((item) => toDataset(item));
  });
};

type CreateDataset = (opts: {
  fetch: Fetch;
  apiToken: string;
  data: DatasetCreateData;
}) => Promise<Maybe<Dataset>>;

export const createDataset: CreateDataset = async ({
  fetch,
  apiToken,
  data,
}) => {
  const body = JSON.stringify(toPayload(data));
  const url = `${getApiUrl()}/datasets/`;
  const request = new Request(url, {
    method: "POST",
    headers: new Headers([
      ["Content-Type", "application/json"],
      ...getHeaders(apiToken),
    ]),
    body,
  });

  const response = await makeApiRequest(fetch, request);

  return Maybe.map(response, async (response) =>
    toDataset(await response.json())
  );
};

type UpdateDataset = (opts: {
  fetch: Fetch;
  apiToken: string;
  id: string;
  data: DatasetUpdateData;
}) => Promise<Maybe<Dataset>>;

export const updateDataset: UpdateDataset = async ({
  fetch,
  apiToken,
  id,
  data,
}) => {
  const body = JSON.stringify(toPayload(data));
  const url = `${getApiUrl()}/datasets/${id}/`;
  const request = new Request(url, {
    method: "PUT",
    headers: new Headers([
      ["Content-Type", "application/json"],
      ...getHeaders(apiToken),
    ]),
    body,
  });

  const response = await makeApiRequest(fetch, request);

  return Maybe.map(response, async (response) =>
    toDataset(await response.json())
  );
};

type DeleteDataset = (opts: {
  fetch: Fetch;
  apiToken: string;
  id: string;
}) => Promise<void>;

export const deleteDataset: DeleteDataset = async ({ fetch, apiToken, id }) => {
  const url = `${getApiUrl()}/datasets/${id}/`;
  const request = new Request(url, {
    method: "DELETE",
    headers: new Headers(getHeaders(apiToken)),
  });
  await makeApiRequest(fetch, request);
};

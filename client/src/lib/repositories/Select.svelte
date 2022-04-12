<script lang="ts">
  import type { SelectOption } from "src/definitions/selectOption";
  import RequiredMarker from "../components/RequiredMarker/RequiredMarker.svelte";

  export let label: string;
  export let value: string;
  export let options: SelectOption[];
  export let error: string;
  export let required: boolean = false;
</script>

<div class="fr-select-group">
  <label class="fr-label" for="updateFrequency">
    {label}
    {#if required}
      <RequiredMarker />
    {/if}
  </label>
  <select
    class="fr-select"
    {required}
    bind:value
    id="updateFrequency"
    name="updateFrequency"
    on:change
    on:blur
  >
    <option>Selecectionner une option</option>
    {#each options as option}
      <option value={option.value}>{option.label}</option>
    {/each}
  </select>

  {#if error}
    <p id="title-desc-error" class="fr-error-text">
      {error}
    </p>
  {/if}
</div>

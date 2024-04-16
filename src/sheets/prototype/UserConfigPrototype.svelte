<script lang="ts">
  import { FoundryAdapter } from 'src/foundry/foundry-adapter';

  export let data: any;

  const localize = FoundryAdapter.localize;
</script>

<fieldset>
  <legend>{localize('USER.SHEET.HEADERS.INFO')}</legend>
  <div class="form-field">
    {JSON.stringify(data)}
  </div>
</fieldset>

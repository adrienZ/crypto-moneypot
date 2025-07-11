<template>
  <footer>
    <hr />
    <div class="flex items-center justify-between py-2 px-6 bg-black">
      <DevOnly>
        <div class="max-w-5xl mx-auto">
          <button @click="triggerDevTools">
            {{ $t('footer.openDevtools') }}
          </button>
        </div>
      </DevOnly>

      <USelect v-model="locale" :items="localeSelectItems" class="w-48" />
    </div>

  </footer>
</template>

<script lang="ts" setup>
import { DevOnly, USelect } from "#components";
import { watch, computed } from "vue";
import { navigateTo, useI18n, useSwitchLocalePath } from "#imports";

const { locale, locales, loadLocaleMessages } = useI18n()
const localeSelectItems = computed(() => locales.value.map((l) => ({
  label: `${l.emoji} ${l.name}`,
  value: l.code,
})));


const switchLocalePath = useSwitchLocalePath()
watch(locale, async (newLocale) => {
  if (newLocale) {
    await loadLocaleMessages(newLocale);
    const path = switchLocalePath(newLocale);
    navigateTo(path)
  }
});


function triggerDevTools() {
  import("#imports").then(({ useNuxtDevTools }) => {
    const devtoolsClient = useNuxtDevTools();
    devtoolsClient.value?.devtools.open();
  });
}
</script>

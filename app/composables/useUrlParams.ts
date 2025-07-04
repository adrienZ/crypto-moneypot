import { ref, watch } from "vue";
import { useRoute } from "vue-router";

const useUrlParams = (key: string = 'q') => {
  const route = useRoute();
  const urlQuery = route.query?.[key]?.toString() || '';
  const searchQuery = ref(urlQuery);

  if (import.meta.client) {
    watch(searchQuery, (nextQuery) => {
      const url = new URL(window.location.href);
      url.searchParams.set(key, nextQuery);
      window.history.replaceState({}, '', url);
    });
  }

  return searchQuery;
};

export default useUrlParams;

export default defineNuxtRouteMiddleware(async () => {
  const { session, fetchSession, options } = useAuth();
  if (!session.value) {
    await fetchSession();
  }
  if (!session.value) {
    return navigateTo(options.redirectGuestTo || '/');
  }
});

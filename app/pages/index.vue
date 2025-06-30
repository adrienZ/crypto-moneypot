<template>
  <div class="flex min-h-screen items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
      <h2 class="text-2xl font-bold text-center mb-6">Login</h2>
      
      <form @submit.prevent="handleLogin">
        <div class="mb-4">
          <label for="email" class="block text-sm font-medium">Email</label>
          <input 
            v-model="email" 
            type="email" 
            id="email" 
            required 
            class="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <div class="mb-4">
          <label for="password" class="block text-sm font-medium">Password</label>
          <input 
            v-model="password" 
            type="password" 
            id="password" 
            required 
            class="w-full mt-1 p-2 border rounded-md"
          />
        </div>

        <button 
          type="submit" 
          class="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
          :disabled="loading"
        >
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>

        <p v-if="errorMessage" class="text-red-500 text-sm mt-2">{{ errorMessage }}</p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuth } from "#imports";
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");
const auth = useAuth();
const router = useRouter();

const handleLogin = async () => {
	loading.value = true;
	errorMessage.value = "";

	try {
		const register = await auth.signUp.email({
			email: email.value,
			password: password.value,
			name: email.value,
		});
		router.push("/?auth=success"); // Redirect after successful login
		if (register.error) {
			errorMessage.value =
				register.error.message ?? "Invalid login credentials";
		}
	} catch (error) {
		errorMessage.value = "unhandled error";
	} finally {
		loading.value = false;
	}
};
</script>

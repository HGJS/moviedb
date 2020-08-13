<template>
	<div class="pt-60 pb-60">
		<div class="container">
			<h1 class="page-title" v-if="error.statusCode === 404">
				Page not found
			</h1>
			<h1 class="page-title" v-else>An error occurred</h1>
			<nuxt-link class="button" to="/">Home page</nuxt-link>
		</div>
	</div>
</template>

<script>
export default {
	props: ['error']
}
</script>

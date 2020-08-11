<template>
	<div class="pt-60 pb-60">
		<div class="container-fluid">
			<h1 class="page-title">{{ movie.name }}</h1>
			<p>{{ movie.biography }}</p>
			<pre>{{ movie }}</pre>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			movie: ''
		}
	},
	created() {
		this.$axios
			.get(
				`/person/${this.$route.params.id}?api_key=f19c666067ae31ab26cb6225b464a8dc`
			)
			.then(res => {
				console.log(res.data.original_title)
				this.movie = res.data
			})
	},
	validate({ params }) {
		// Must be a number
		return /^\d+$/.test(params.id)
	}
}
</script>

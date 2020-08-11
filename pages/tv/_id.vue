<template>
	<div class="pt-60 pb-60">
		<div class="container-fluid">
			<h1 class="page-title">{{ show.original_name }}</h1>
			<p>{{ show.overview }}</p>
			<pre>{{ show }}</pre>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			show: ''
		}
	},
	created() {
		this.$axios
			.get(
				`/tv/${this.$route.params.id}?api_key=f19c666067ae31ab26cb6225b464a8dc`
			)
			.then(res => {
				this.show = res.data
			})
	},
	validate({ params }) {
		// Must be a number
		return /^\d+$/.test(params.id)
	}
}
</script>

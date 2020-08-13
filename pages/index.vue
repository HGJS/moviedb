<template>
	<div class="pt-60">
		<div class="container-fluid app-container-fluid">
			<h1 class="page-title">Movie Database</h1>
		</div>

		<app-trending-items type="movie" class="pb-30" />
		<app-trending-items type="tv" class="pt-60 pb-30 bg-color-grey" />
		<app-trending-items type="person" class="pt-60 pb-30" />
	</div>
</template>

<script>
import AppTrendingItems from '@/components/AppTrendingItems'
export default {
	components: {
		'app-trending-items': AppTrendingItems
	}
}
</script>

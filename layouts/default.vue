<template>
	<div>
		<app-header />
		<transition name="fade" mode="out-in">
			<nuxt />
		</transition>
		<app-footer />
	</div>
</template>

<script>
import AppHeader from '@/components/AppHeader'
import AppFooter from '@/components/AppFooter'

export default {
	components: {
		'app-header': AppHeader,
		'app-footer': AppFooter
	}
}
</script>

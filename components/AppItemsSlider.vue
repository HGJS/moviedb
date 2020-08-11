<template>
	<div class="items-slider">
		<div class="items-slider__wrap">
			<div class="items-slider__inner">
				<VueSlickCarousel v-bind="settings" ref="slider">
					<slot></slot>
				</VueSlickCarousel>
			</div>
		</div>
		<button @click="showPrev">Previous</button>
		<button @click="showNext">Next</button>
	</div>
</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'

export default {
	props: {
		settings: {
			type: Object
		}
	},
	methods: {
		showPrev() {
			this.$refs.slider.prev()
		},
		showNext() {
			this.$refs.slider.next()
		}
	},
	components: { VueSlickCarousel }
}
</script>

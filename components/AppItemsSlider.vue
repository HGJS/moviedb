<template>
	<div class="items-slider">
		<div class="items-slider__wrap">
			<div class="items-slider__inner">
				<VueSlickCarousel
					v-bind="settings"
					ref="slider"
					@reInit="checkControls"
				>
					<slot></slot>
				</VueSlickCarousel>
			</div>
		</div>
		<div v-if="showControls" class="items-slider__buttons-wrap">
			<button
				class="button items-slider__button items-slider__button--prev"
				@click="showPrev"
			>
				<span class="fal fa-angle-left"></span>
			</button>
			<button
				class="button items-slider__button items-slider__button--next"
				@click="showNext"
			>
				<span class="fal fa-angle-right"></span>
			</button>
		</div>
	</div>
</template>

<script>
import VueSlickCarousel from 'vue-slick-carousel'
import 'vue-slick-carousel/dist/vue-slick-carousel.css'

export default {
	data() {
		return {
			showControls: false
		}
	},
	props: {
		slideOrientation: {
			type: String
		}
	},
	computed: {
		settings() {
			if (this.slideOrientation == 'portrait') {
				return {
					arrows: false,
					slidesToShow: 4,
					slidesToScroll: 1,
					responsive: [
						{
							breakpoint: 1024,
							settings: {
								slidesToShow: 3
							}
						},
						{
							breakpoint: 768,
							settings: {
								slidesToShow: 2
							}
						}
					]
				}
			} else if (this.slideOrientation == 'landscape') {
				return {
					arrows: false,
					slidesToShow: 2,
					slidesToScroll: 1,
					useTransform: true,
					responsive: [
						{
							breakpoint: 768,
							settings: {
								slidesToShow: 1
							}
						}
					]
				}
			}
		}
	},
	methods: {
		checkControls() {
			const slider = this.$refs.slider
			const slides = slider.$slots.default
			const slidesToShow = slider.settings.slidesToShow
			if (slides.length <= slidesToShow) {
				this.showControls = false
			} else {
				this.showControls = true
			}
		},
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

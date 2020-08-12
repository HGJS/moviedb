<template>
	<div class="col image-slider-item">
		<a
			href="#"
			@click.prevent="handleClick"
			class="image-slider-item__link"
		>
			<div
				class="image-slider-item__link-image-wrap"
				:class="{
					'image-slider-item__link-image-wrap--landscape':
						orientation == 'landscape'
				}"
			>
				<div class="image-slider-item__link-image">
					<img
						:src="image"
						:alt="name"
						class="list-item__link-image"
					/>
				</div>
			</div>
		</a>
	</div>
</template>

<script>
export default {
	props: {
		image: {
			type: String,
			required: true
		},
		name: {
			type: String,
			required: true
		},
		orientation: {
			type: String,
			required: true
		}
	},
	methods: {
		handleClick() {
			this.$emit('click')
		}
	}
}
</script>

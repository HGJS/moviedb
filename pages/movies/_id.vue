<template>
	<div>
		<div v-if="$fetchState.pending" class="pt-60 pb-30">
			<div class="container-fluid app-container-fluid">
				<div class="loading-icon">
					<span class="fas fa-circle-notch fa-spin"></span>
				</div>
			</div>
		</div>
		<template v-else>
			<div class="page-banner">
				<div
					class="page-banner__background"
					:style="
						`background-image:url('https://image.tmdb.org/t/p/w1280/${movie.backdrop_path}')`
					"
				></div>
				<div class="page-banner__inner">
					<div class="container-fluid app-container-fluid">
						<div class="row">
							<div class="col-12 col-md-6 col-lg-4 mb-30">
								<img
									:src="
										`https://image.tmdb.org/t/p/w780/${movie.poster_path}`
									"
									:alt="movie.original_title"
									class="img-fluid md-max-400"
								/>
							</div>
							<div class="col-12 col-md-6 col-lg-8 mb-30">
								<h1 class="page-banner__title">
									{{ movie.original_title }}
								</h1>
								<div class="page-banner__content-area">
									<h2>Overview</h2>
									<p>{{ movie.overview }}</p>
									<h2>Rating</h2>

									<p class="page-banner__rating">
										<span class="page-banner__rating-box">{{
											movie.vote_average
										}}</span>
										based on {{ movie.vote_count }} reviews
									</p>
									<h2>Genres</h2>
									<ul>
										<li
											v-for="genre in movie.genres"
											:key="genre.id"
										>
											{{ genre.name }}
										</li>
									</ul>
									<h2>Release date</h2>
									<p>{{ movie.release_date }}</p>
									<h2>Runtime</h2>
									<p>{{ getRuntime(movie.runtime) }}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="pt-60 pb-30">
				<div class="container-fluid app-container-fluid">
					<div class="row items__row">
						<div class="app-col items__title-col mb-30">
							<h2 class="items__title">
								Images
							</h2>
						</div>
						<div class="app-col items__controls-col mb-30">
							<div class="d-flex">
								<button
									:class="{ active: imageTypes == 'posters' }"
									@click="imageTypes = 'posters'"
									class="button"
								>
									Posters
								</button>
								<button
									:class="{
										active: imageTypes == 'backdrops'
									}"
									@click="imageTypes = 'backdrops'"
									class="button"
								>
									Backdrops
								</button>
							</div>
						</div>
					</div>
					<div v-show="imageTypes == 'posters'">
						<div class="row">
							<div
								class="col-6 col-sm-6 col-md-3 mb-30"
								v-for="image in movieImages.posters"
								:key="image.file_path"
							>
								<img
									:src="
										`https://image.tmdb.org/t/p/w780/${image.file_path}`
									"
									:alt="
										`${movie.original_title} Poster Image`
									"
								/>
							</div>
						</div>
					</div>
					<div v-show="imageTypes == 'backdrops'">
						<div class="row">
							<div
								class="col-6 mb-30"
								v-for="image in movieImages.backdrops"
								:key="image.file_path"
							>
								<img
									:src="
										`https://image.tmdb.org/t/p/w780/${image.file_path}`
									"
									:alt="
										`${movie.original_title} Poster Image`
									"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div
				class="pt-60 pb-30 bg-color-grey"
				v-if="movieSimilar.total_results > 0"
			>
				<div class="container-fluid app-container-fluid">
					<h2 class="section-title">Similar</h2>
					<div class="row"></div>
				</div>
			</div>
			<div class="container-fluid app-container-fluid">
				<h1 class="page-title"></h1>
				<pre>{{ movie }}</pre>
			</div>
		</template>
	</div>
</template>

<script>
export default {
	data() {
		return {
			movie: '',
			movieImages: '',
			movieVideos: '',
			movieCredits: '',
			movieSimilar: '',
			imageTypes: 'posters'
		}
	},
	async fetch() {
		const apiKey = 'f19c666067ae31ab26cb6225b464a8dc'

		const movie = await this.$axios
			.get(
				`/movie/${this.$route.params.id}?api_key=${apiKey}&language=en-US&include_image_language=en&append_to_response=images,videos,credits,similar`
			)
			.catch(err => {
				console.log(err)
			})

		this.movie = movie.data
		this.movieImages = movie.data.images
		this.movieVideos = movie.data.videos
		this.movieCredits = movie.data.credits
		this.movieSimilar = movie.data.similar
	},
	methods: {
		getRuntime(time) {
			let hours = Math.floor(time / 60)
			let minutes = Math.round(time - hours * 60)

			return `${hours}h ${minutes}m`
		}
	},
	validate({ params }) {
		// Must be a number
		return /^\d+$/.test(params.id)
	},
	head() {
		return {
			title: `${this.movie.original_title} - MovieDB`
		}
	}
}
</script>

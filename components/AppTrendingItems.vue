<template>
	<section class="items" :class="classNames">
		<div class="container-fluid app-container-fluid">
			<div class="row items__row">
				<div class="app-col items__title-col mb-30">
					<h2 class="items__title">
						Trending {{ itemTypeText }}
						<span class="items__timeframe">{{
							timeframeText
						}}</span>
					</h2>
				</div>
				<div
					v-if="!$fetchState.pending"
					class="app-col items__controls-col mb-30"
				>
					<div class="d-flex">
						<button
							:class="{ active: timeframe == 'day' }"
							class="button"
							@click="timeframe = 'day'"
						>
							Day
						</button>
						<button
							:class="{ active: timeframe == 'week' }"
							class="button"
							@click="timeframe = 'week'"
						>
							Week
						</button>
					</div>
				</div>
			</div>
			<div v-show="$fetchState.pending">
				<div class="loading-icon">
					<span class="fas fa-circle-notch fa-spin"></span>
				</div>
			</div>
			<div v-show="!$fetchState.pending">
				<div v-show="timeframe == 'day'">
					<app-items-slider :settings="sliderSettings">
						<app-list-item
							v-for="item in dailyList"
							:key="item.id"
							:id="item.id"
							:image="item.poster_path || item.profile_path"
							:name="
								item.original_title ||
									item.original_name ||
									item.name
							"
							:mediaType="item.media_type"
							:sliderItem="true"
						/>
					</app-items-slider>
				</div>
				<div v-show="timeframe == 'week'">
					<app-items-slider :settings="sliderSettings">
						<app-list-item
							v-for="item in weeklyList"
							:key="item.id"
							:id="item.id"
							:image="item.poster_path || item.profile_path"
							:name="
								item.original_title ||
									item.original_name ||
									item.name
							"
							:mediaType="item.media_type"
							:sliderItem="true"
						/>
					</app-items-slider>
				</div>
			</div>
		</div>
	</section>
</template>

<script>
import AppItemsSlider from '@/components/AppItemsSlider'
import AppListItem from '@/components/AppListItem'
export default {
	data() {
		return {
			dailyList: [],
			weeklyList: [],
			timeframe: 'day',
			sliderSettings: {
				arrows: false,
				slidesToShow: 4,
				slidesToScroll: 1,
				responsive: [
					{
						breakpoint: 1024,
						settings: {
							slidesToShow: 3
						}
					}
				]
			}
		}
	},
	props: {
		type: {
			type: String,
			required: true
		},
		classNames: {
			type: String
		}
	},
	computed: {
		timeframeText() {
			return this.timeframe == 'day' ? 'today' : 'this week'
		},
		itemTypeText() {
			switch (this.type) {
				case 'movie':
					return 'movies'
					break
				case 'tv':
					return 'TV shows'
					break
				case 'person':
					return 'people'
					break
			}
		}
	},
	async fetch() {
		const apiKey = 'f19c666067ae31ab26cb6225b464a8dc'

		const trendingDaily = await this.$axios
			.get(`/trending/${this.type}/day?api_key=${apiKey}`)
			.catch(err => {
				console.log(err)
			})

		const trendingWeekly = await this.$axios
			.get(`/trending/${this.type}/week?api_key=${apiKey}`)
			.catch(err => {
				console.log(err)
			})

		this.dailyList = trendingDaily.data.results
		this.weeklyList = trendingWeekly.data.results
	},
	components: {
		'app-list-item': AppListItem,
		'app-items-slider': AppItemsSlider
	}
}
</script>

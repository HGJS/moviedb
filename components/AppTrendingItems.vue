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
			<div v-if="$fetchState.pending">
				<div class="loading-icon">
					<span class="fas fa-circle-notch fa-spin"></span>
				</div>
			</div>
			<div v-if="!$fetchState.pending">
				<transition name="fade" mode="out-in">
					<div v-if="timeframe == 'day'" key="dailySlider">
						<app-items-slider slideOrientation="portrait">
							<app-list-item
								v-for="item in dailyList"
								:key="item.id"
								:id="item.id"
								:image="item.imagePath"
								:name="item.name"
								:mediaType="item.mediaType"
								:sliderItem="true"
								orientation="portrait"
							/>
						</app-items-slider>
					</div>
					<div v-if="timeframe == 'week'" key="weeklySlider">
						<app-items-slider slideOrientation="portrait">
							<app-list-item
								v-for="item in weeklyList"
								:key="item.id"
								:id="item.id"
								:image="item.imagePath"
								:name="item.name"
								:mediaType="item.mediaType"
								:sliderItem="true"
								orientation="portrait"
							/>
						</app-items-slider>
					</div>
				</transition>
			</div>
		</div>
	</section>
</template>

<script>
import AppItemsSlider from '@/components/AppItemsSlider'
import AppListItem from '@/components/AppListItem'
import list from '~/assets/js/list'

export default {
	data() {
		return {
			dailyList: [],
			weeklyList: [],
			timeframe: 'day'
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
			.get(`/trending/${this.type}/day?api_key=${apiKey}&language=en`)
			.catch(err => {
				console.log(err)
			})

		const trendingWeekly = await this.$axios
			.get(`/trending/${this.type}/week?api_key=${apiKey}&language=en`)
			.catch(err => {
				console.log(err)
			})

		const dailyList = trendingDaily.data.results
		this.dailyList = list.results(dailyList)

		const weeklyList = trendingWeekly.data.results
		this.weeklyList = list.results(weeklyList)
	},
	components: {
		'app-list-item': AppListItem,
		'app-items-slider': AppItemsSlider
	}
}
</script>

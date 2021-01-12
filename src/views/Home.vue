<template>
	<div class="home layout">
		<div v-for="(step, idx) of data" :key="idx">
			<transition name="route" mode="out-in">
				<div v-if="idx<=userStep">
					<h4 class="p-b-16">
						{{step.title}}
					</h4>
					<div v-for="(variant, index) of step.variants"
					     :key="index"
					     class="home__block"
					     :style="homeBlockColor(variant.color)">

						<div class="flex justify-space-between p-b-16">
							<h4>{{variant.title}}</h4>
							<h5>{{variant.price_default}} ₽</h5>
						</div>

						<div class="home__block__grid">
							<div> {{variant.description}}</div>
							<hr class="home__block__divider"/>
							<div>
								<div v-if="variant.options && variant.options.length" class="m-b-16">
									<div v-for="option of variant.options" :key="option.title">
										<div class="home__block__checkbox__block">
											<label class="flex text-center fullwidth" :for="option.title">
											  <span class="checkbox__input">
											    <input type="checkbox"
											           @change="calculate"
											           class="home__block__checkbox"
											           :value="option.price"
											           v-model="option.isChecked"
											           :id="option.title"
											           name="checkbox">
												    <span class="checkbox__control">
												      <svg viewBox='0 0 24 24' aria-hidden="true" focusable="false">
												        <path fill='none' stroke='currentColor' stroke-width='3'
												              d='M1.73 12.91l6.37 6.37L22.79 4.59'/>
												      </svg>
												     </span>
											    </span>
												<span class="fullwidth">{{option.title}}</span>
											</label>
										</div>
									</div>
								</div>

								<div v-if="variant.select && variant.select.length" class="m-b-16">
									<form>
										<div v-for="(select, selectIdx) of variant.select" :key="selectIdx">
											<div class="m-b-16">{{select.title}}</div>

											<select class="fullwidth home__block__selectbox" @change="calculate"
											        v-model="select.select">
												<option :value="option.price" class="fullwidth"
												        v-for="(option, optionIdx) of select.items"
												        :key="optionIdx">
													{{option.title}}
												</option>
											</select>
										</div>
									</form>
								</div>
								<button class="fullwidth"
								        :class="isTypeSelected(step.title, variant) ? 'button--primary' : 'button--default'"
								        @click="selectType(step.title, variant)">
									<h5 class="flex-center">
										<span v-if="isTypeSelected(step.title, variant)">
											Выбрано
										</span>
										<span v-else>
											Выбрать
										</span>
									</h5>
								</button>
							</div>
						</div>
					</div>
					<hr class="m-y-16"/>
				</div>
			</transition>
		</div>

		<button class="fullwidth button--primary">
			<h4 class="flex justify-space-between">
				<span>ИТОГО К ОПЛАТЕ</span>
				<span>{{price}} ₽</span>
			</h4>
		</button>
	</div>
</template>

<script>
	import jsonData from "../../data.json";

	export default {
		name: 'Home',
		data: () => ({
			data: jsonData,
			price: 0,
			userStep: 0,
			selectedTypes: []
		}),
		components: {},
		methods: {
			homeBlockColor(color) {
				return {
					borderLeft: '8px solid' + color
				}
			},
			calculate() {
				this.price = 0;

				this.selectedTypes.forEach(el => {
					this.price += el.selected.price_default;
					if (el.selected.select) {
						el.selected.select.forEach(select => {
							this.price += select.select
						})
					}

					if (el.selected.options) {
						el.selected.options.forEach(option => {
							if (option.isChecked) this.price += option.price
						})
					}
				});
			},
			selectType(type, selected) {
				let isExist = false;

				this.selectedTypes.forEach(el => {
					if (el.type === type) {
						el.selected = selected;
						isExist = true;
					}
				});

				if (!isExist)
					this.selectedTypes.push({
						type: type,
						selected: selected,
					});
				this.calculate();
			},

			isTypeSelected(type, selected) {
				let isSelected = false;
				this.selectedTypes.forEach(el => {
					if (el.type === type && el.selected.title === selected.title)
						isSelected = true;
				});
				return isSelected;
			},
		},

		watch: {
			selectedTypes() {
				this.userStep = this.selectedTypes.length
			}
		},

		created() {
			this.data.forEach(step => {
				if (step.variants) {
					step.variants.forEach(variant => {
						if (variant.select && variant.select.length) {
							variant.select.forEach(select => {
								select.select = select.items[0].price
							})
						}
					})
				}
			})
		}
	}
</script>

<style lang="scss">
	.home {
		&__block {
			background-color: #f8f8f8;
			padding: 16px 32px;
			margin-bottom: 16px;
			border-radius: $border-radius;

			&__grid {
				@include up($sm) {
					display: grid;
					grid-template-columns: 2fr 1px 1fr;
					grid-gap: 16px;
				}
				@include up($md) {
					display: grid;
					grid-template-columns: 3fr 1px 1fr;
					grid-gap: 16px;
				}
			}

			&__divider {
				height: 100%;
				margin: 0;
				border: none;
				color: $gray;
				background-color: $gray;
				width: 2px;
			}

			&__checkbox__block {
				padding: 8px;
				border-radius: $border-radius;
				border: 1px solid $gray;
				margin: 8px 0;
				color: #9a9a9a;
			}

			&__selectbox {
				padding: 8px 0;
				border-radius: $border-radius;
			}
		}
	}
</style>

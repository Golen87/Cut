const CropType = {
	'Soil': 0,
	'Seed': 1,
	'Sprout': 2,
	'Fruit': 3,
	'Weed': 4,
};

const Crops = {
	'Tomato': {
		'texture': 'tomato',
		'start': 'seeds',
		'stages': {
			'seeds': {
				'type': CropType.Seed,
				'frame': 0,
				'time': [20/10,40/10],
				'next': 'sprout_1',
			},
			'sprout_1': {
				'type': CropType.Sprout,
				'frame': 1,
				'time': [20/10,40/10],
				'next': 'sprout_2',
				'wither': null,
			},
			'sprout_2': {
				'type': CropType.Sprout,
				'frame': 2,
				'time': [30/10,50/10],
				'next': 'sprout_3',
				'wither': null,
			},
			'sprout_3': {
				'type': CropType.Sprout,
				'frame': 3,
				'time': [30/10,50/10],
				'next': 'sprout_4',
				'wither': 'withered_1',
			},
			'sprout_4': {
				'type': CropType.Sprout,
				'frame': 4,
				'time': [30/10,50/10],
				'next': 'fruit',
				'wither': 'withered_1',
			},
			'fruit': {
				'type': CropType.Fruit,
				'frame': 5,
				'harvest': {
					'next': 'harvested',
					'item': Items.Tomato,
					'quantity': 3,
				},
				'wither': 'withered_1',
			},
			'harvested': {
				'type': CropType.Sprout,
				'frame': 6,
				'time': [200/10,600/10],
				'next': 'fruit',
				'wither': 'withered_1',
			},
			'withered_1': {
				'type': CropType.Weed,
				'frame': 7,
				'time': [100/10,1000/10],
				'next': 'withered_2',
			},
			'withered_2': {
				'type': CropType.Weed,
				'frame': 8,
			},
		},
	},
};

const Soils = {
	'texture': 'soil',

	'Watered': {
		'type': CropType.Soil,
		'frame': 0,
		'time': [60/10,180/10],
		'next': 'Wet',
		'fertility': 1,
	},
	'Wet': {
		'type': CropType.Soil,
		'frame': 1,
		'time': [120/10,240/10],
		'next': 'Dry',
		'fertility': 1/2,
	},
	'Dry': {
		'type': CropType.Soil,
		'frame': 2,
		'time': [180/10,600/10],
		'next': 'Weed_1',
		'fertility': 1/8,
	},

	'Weed_1': {
		'type': CropType.Weed,
		'frame': 3,
		'time': [180/10,600/10],
		'next': 'Weed_2',
	},
	'Weed_2': {
		'type': CropType.Weed,
		'frame': 4,
		'time': [180/10,600/10],
		'next': 'Weed_3',
	},
	'Weed_3': {
		'type': CropType.Weed,
		'frame': 5,
	},
};

import { Platform } from 'react-native';

interface Props {
	weight: any;
	family: string;
	familyIOS: string;
}

const font: any = {
	OpenSans: {
		weights: {
			Light: '300',
			Normal: '400',
			SemiBold: '600',
			Bold: '700',
			ExtraBold: '800'
		}
	},
	GoogleSans: {
		weights: {
			Bold: '700',
			SemiBold: '600',
			Normal: '400'
		}
	},
	Moul: {
		weights: {
			Regular: '400'
		}
	},
	Siemreap: {
		weights: {
			Regular: '400'
		}
	},
	Freehand: {
		weights: {
			Regular: '400'
		}
	},
	Khmer: {
		weights: {
			Regular: '400'
		}
	},
	ADaunkeo: {
		weights: {
			Regular: '400'
		}
	},
	KhmerOSMoul: {
		weights: {
			Regular: '400'
		}
	},
	Battambang: {
		weights: {
			Regular: '400',
			Bold: '600'
		}
	}
};

const fontMaker = (options: any) => {
	let { weight, family, familyIOS }: Props = Object.assign(
		{
			weight: '400',
			family: 'OpenSans',
			familyIOS: 'Open Sans'
		},
		options
	);
	const { weights } = font[family];
	if (Platform.OS === 'android') {
		weight = weights[weight] ? weight : '';
		const suffix = weight;
		return {
			fontFamily: family + (suffix.length ? `-${suffix}` : '')
		};
	} else {
		weight = weights[weight] || weights.Normal;
		return {
			fontFamily: familyIOS,
			fontWeight: weight
		};
	}
};

export const fontLight = fontMaker({ weight: 'Light' });
export const fontNormal = fontMaker({ weight: 'Normal' });
export const fontSemiBold = fontMaker({ weight: 'SemiBold' });
export const fontBold = fontMaker({ weight: 'Bold' });
export const fontExtraBold = fontMaker({ weight: 'ExtraBold' });

export const fontGSans = fontMaker({ weight: 'Normal', family: 'GoogleSans', familyIOS: 'Google Sans' });
export const FontGSansSemiBold = fontMaker({ weight: 'SemiBold', family: 'GoogleSans', familyIOS: 'Google Sans' });
export const FontGSansBold = fontMaker({ weight: 'Bold', family: 'GoogleSans', familyIOS: 'Google Sans' });

export const Battambang = fontMaker({ weight: 'Regular', family: 'Battambang', familyIOS: 'Battambang-Regular' });
export const BattambangBold = fontMaker({ weight: 'Bold', family: 'Battambang', familyIOS: 'Battambang-Bold' });

export const Moul = fontMaker({ weight: 'Regular', family: 'Moul', familyIOS: 'KhmerOSMoul' });

export const ADaunkeo = fontMaker({ weight: 'Regular', family: 'ADaunkeo', familyIOS: 'ADaunkeo' });

export const Khmer = fontMaker({ weight: 'Regular', family: 'Khmer', familyIOS: 'Khmer' });
export const Siemreap = fontMaker({ weight: 'Regular', family: 'Siemreap', familyIOS: 'Siemreap-Regular' });
export const Freehand = fontMaker({ weight: 'Regular', family: 'Freehand', familyIOS: 'Freehand-Regular' });

export function createReducer(initialState, reducerMap) {
	return (state = initialState, action) => {
		const reducer = reducerMap[action.type];
		return reducer
			? reducer(state, action.payload)
			: state;
	};
}

export function parseJSON(response) {
	return response.data;
}

export function validateEmail(email) {
	const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
}

export function makeClassList (classDict) {
	const list = Object.keys(classDict).reduce((acc, cur)=> acc + (classDict[cur] ? `${cur} ` : ''), '');
	return list;
}

export function countCapitals(value) {
	const str = value;
	return str.replace(/[^A-Z]/g, '').length;
}

export function countNumbers(value) {
	return /\d/.test(value);
}

export function cloneDeep(obj) {
	let copy;
	// Handle the 3 simple types, and null or undefined
	if ((obj === null) || (typeof obj !== 'object')) return obj;
	// Handle Date
	if (obj instanceof Date) {
		copy = new Date();
		copy.setTime(obj.getTime());
		return copy;
	}
	// Handle Array
	if (obj instanceof Array) {
		copy = [];
		for (let i = 0, len = obj.length; i < len; i = i + 1) {
			copy[i] = cloneDeep(obj[i]);
		}
		return copy;
	}
	// Handle Object
	if (obj instanceof Object) {
		copy = {};
		for (let attr in obj) {
			if (obj.hasOwnProperty(attr)) copy[attr] = cloneDeep(obj[attr]);
		}
		return copy;
	}
	throw new Error("Unable to copy obj! Its type isn't supported.");
}

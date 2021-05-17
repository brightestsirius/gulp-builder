export class User{
	constructor(data){
		this.create(data);
	}

	create(data){
		for(let key in data){
			this[key] = data[key];
		}
	}

	render(){
		return `Hello, my name is ${this.name}!`;
	}
}
import {User} from './user.js';

export class Student extends User{
	constructor(data){
		super(data);
	}

	render(){
		let data = super.render();
		return `${data} I'm student!`;
	}
}
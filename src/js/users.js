import {XHR} from './xhr.js';
import {User} from './user.js';
import {Student} from './student.js';

const ROLES = {
	student: data => new Student(data)
}

export class Users{
	constructor(file){
		this.create(file);
	}

	async create(file){
		let data = await XHR.request(file),
			users = data.users;
		console.log(users);

		users
			.map(user => ROLES[user.role] ? ROLES[user.role](user) : new User(user))
			.forEach(user => {
				console.log(user.render());
			});
	}

}
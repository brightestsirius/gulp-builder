export class XHR{
	static async request(file){
		let request = await fetch(file),
			response = await request.json();

		return response;
	}
}
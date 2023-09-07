const Baza = require("./baza.js");
//jedan, svi, izvrsi

class ZanrDAO {

	constructor() {
		this.baza = new Baza();
	}

	dajSve = async function () {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM zanr;"
		var podaci = await this.baza.izvrsiUpit(sql, "all",null);
		this.baza.zatvoriVezu();
		return podaci;
	}

	daj = async function (id) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM zanr WHERE id=?;"
		var podaci = await this.baza.izvrsiUpit(sql, [id]);
		this.baza.zatvoriVezu();
		if(podaci.length == 1)
			return podaci[0];
		else 
			return null;
	}
    dodaj = async function (zanr) {
		console.log(zanr)
		let sql = "INSERT INTO zanr (id,naziv) VALUES ('" + zanr.id + "','" + zanr.naziv + "')";
        let podaci = [zanr.id, zanr.naziv];
		await this.baza.izvrsiUpit(sql,"exec",null);
		return true;
	}
	obrisiSve = async function () {
		//let sql = "DELETE FROM zanr LEFT JOIN zanr_filma ON zanr_filma.zanr_id = zanr.id WHERE zanr_filma.zanr_id IS NULL)";
		//let sql = "DELETE FROM zanr_filma WHERE zanr_id NOT IN (SELECT z.id FROM zanr z)"
		let sql = "DELETE FROM zanr WHERE id NOT IN (SELECT z.zanr_id FROM zanr_filma z)"
		await this.baza.izvrsiUpit(sql,[]);
		return true;
	}
	azuriraj = async function (id, zanr) {
		let sql = "UPDATE zanr SET naziv='" + zanr.naziv + "' WHERE id=" + id + "";
        let podaci = [zanr.naziv,id];
		await this.baza.izvrsiUpit(sql,"exec",null);
		return true;
	}
	obrisi = async function (id) {
		let sql = "DELETE FROM zanr WHERE id=?";
		await this.baza.izvrsiUpit(sql,[id]);
		return true;
	}

	pridruziZanr = async function (zanr) {
		console.log(zanr)
		let sql = "INSERT INTO zanr_filma (zanr_id,film_id) VALUES ('" + zanr.zanr_id +  "','" + zanr.film_id  + "')";
        let podaci = [zanr.zanr_id, zanr.film_id];
		await this.baza.izvrsiUpit(sql,"exec",null);
		return true;
	}

	obrisiZanrFilma = async function (id) {
		let sql = "DELETE FROM zanr_filma WHERE film_id=" + id + ";"
        let podaci = [id];
		await this.baza.izvrsiUpit(sql,"exec",null);
		return true;
	}
}

module.exports = ZanrDAO;
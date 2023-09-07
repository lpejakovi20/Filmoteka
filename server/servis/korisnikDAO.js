const Baza = require("./baza.js");

class KorisnikDAO {

	constructor() {
		this.baza = new Baza();
	}

	dajSve = async function () {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik;"
		var podaci = await this.baza.izvrsiUpit(sql, []);
		this.baza.zatvoriVezu();
		return podaci;
	}

	daj = async function (korime) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM korisnik WHERE korime='" + korime + "';";
		var podaci = await this.baza.izvrsiUpit(sql, "all", null);
		this.baza.zatvoriVezu();
		if(podaci.length == 1)
			return podaci[0];
		else 
			return null;
	}

	dodaj = async function (korisnik) {
		console.log(korisnik)
		//let sql = `INSERT INTO korisnik (ime,prezime,lozinka,email,korime,tip_korisnika_id,token,aktivacijski_kod) VALUES (?,?,?,?,?,?,?,?);
        let sql = "INSERT INTO korisnik (ime,prezime,lozinka,email,korime,tip_korisnika_id,token,aktivacijski_kod) VALUES ('" + korisnik.ime + "','" + korisnik.prezime + "','" + korisnik.lozinka + "','" + korisnik.email + "','" + korisnik.korime + "','" + 2 + "','" + korisnik.TOTPkljuc + "','" + korisnik.aktivacijskiKod + "')";
		//let podaci = [korisnik.ime,korisnik.prezime,korisnik.lozinka,korisnik.email,korisnik.korime,2,korisnik.TOTPkljuc,korisnik.aktivacijskiKod];
		console.log(sql);
		await this.baza.izvrsiUpit(sql,"exec",null);
		return true;
	}

	obrisi = async function (korime) {
		let sql = "DELETE FROM korisnik WHERE korime=?";
		await this.baza.izvrsiUpit(sql,[korime]);
		return true;
	}

	azuriraj = async function (korime, korisnik) {
		let sql = "UPDATE korisnik SET ime='" + korisnik.ime + "', prezime='" + korisnik.prezime + "', lozinka='" + korisnik.lozinka + "' WHERE korime='" + korime + "'";
        let podaci = [korisnik.ime,korisnik.prezime,korisnik.lozinka,korime];
		await this.baza.izvrsiUpit(sql,"exec",null);
		return true;
	}

	aktiviraj = async function(korime, korisnik) {
		let sql = `UPDATE korisnik SET aktivan=? WHERE korime=?`;
		let podaci = [1,korime];
		await this.baza.izvrsiUpit(sql,podaci);
	}
}

module.exports = KorisnikDAO;
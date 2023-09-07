const Baza = require("./baza.js");

class FilmDAO {

	constructor() {
		this.baza = new Baza();
	}

	dajSveFilmove = async function (odobren) {
		this.baza.spojiSeNaBazu();
        let sql = "SELECT * FROM film WHERE odobren = '" + odobren + "';"
		var podaci = await this.baza.izvrsiUpit(sql, "all", null);
		this.baza.zatvoriVezu();
		return podaci;
	}

	dajSve = async function (id) {
		this.baza.spojiSeNaBazu();
        let sql = "SELECT * FROM film JOIN zanr_filma ON film.id = zanr_filma.film_id JOIN zanr ON zanr_filma.zanr_id = zanr.id WHERE zanr.id = '" + id + "';"
		var podaci = await this.baza.izvrsiUpit(sql, "all", null);
		this.baza.zatvoriVezu();
		console.log("ovako izgleda:");
		console.log(podaci);
		return podaci;
	}

	dodaj = async function (film) {
		console.log(film)
		let date = (new Date()).toISOString().split('T')[0];
		//let sql = "INSERT INTO film (id,naziv_filma,datum_unosa,datum_premijere,trajanje,radnja,ocjena,budzet,prihod,za_odrasle,status,poster_putanja,izvorni_jezik,odobren,tagline,korisnik_id) VALUES ('" + film.id + "','" + film.naziv + "','" + new Date() + "','" + film.datum_premijere + "','" + film.trajanje + "','" + film.radnja + "','" + film.ocjena + "','" + film.budzet + "','" + film.prihod + "','" + film.za_odrasle + "','" + film.status + "','" + film.poster_putanja + "','" + film.izvorni_jezik + "','" + 0 + "','" + film.tagline + "','" + film.id_korisnik + ")";
		//let sql = "INSERT INTO film (id,naziv_filma,datum_unosa,datum_premijere,trajanje,radnja,ocjena,budzet,prihod,za_odrasle,status,poster_putanja,izvorni_jezik,odobren,tagline,korisnik_id) VALUES (" + film.id + ",'" + film.naziv + "','" + new Date() + "','" + film.datum_premijere + "'," + film.trajanje + ",'" + film.radnja + "'," + film.ocjena + "," + film.budzet + "," + film.prihod + "," + film.za_odrasle + ",'" + film.status + "','" + film.poster_putanja + "','" + film.izvorni_jezik + "'," + 0 + ",'" + film.tagline + "'," + film.id_korisnik + ")";
		let sql = "INSERT INTO film (id,naziv_filma,datum_unosa,datum_premijere,trajanje,radnja,ocjena,budzet,prihod,za_odrasle,status,poster_putanja,izvorni_jezik,odobren,tagline,korisnik_id) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
		let podaci = [film.id,film.naziv, date, film.datum_premijere, film.trajanje, film.radnja, film.ocjena,
			 film.budzet, film.prihod, film.za_odrasle, film.status,film.poster_putanja,film.izvorni_jezik,0,film.tagline,film.id_korisnik];
		await this.baza.izvrsiUpit(sql,"prep",podaci);
		return true;
	}

	daj = async function (id) {
		this.baza.spojiSeNaBazu();
		let sql = "SELECT * FROM film WHERE id=" + id + ";"
		var podaci = await this.baza.izvrsiUpit(sql, "get", null);
		this.baza.zatvoriVezu();
		return podaci;
	}
    
	azuriraj = async function (id, film) {
		let sql = "UPDATE film SET odobren=" + film.odobren + " WHERE id="+ id + ";"
        let podaci = [film.odobren, id];
		await this.baza.izvrsiUpit(sql,"exec", null);
		return true;
	}
	
	obrisi = async function (id) {
		let sql = "DELETE FROM film WHERE id=" + id + ";"
		await this.baza.izvrsiUpit(sql,"exec",null);
		return true;
	}
}

module.exports = FilmDAO;
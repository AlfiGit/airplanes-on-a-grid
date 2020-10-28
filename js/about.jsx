import React from 'react'
import { Font } from './utils.jsx';

export default function AboutPage() {
	return <React.Fragment>
		<Font size="2em" style={{margin: "0 8px 0 8px"}}>
		<p>
			<span lang="en">Welcome to Airplanes on a Grid!</span>
			<span lang="ro">Bun venit la Airplanes on a Grid!</span>
		</p>
		<h3 className="underlined">
			<span lang="en">What is it?</span>
			<span lang="ro">Ce este?</span>
		</h3>
		<p>
			<span lang="en">It's a relaxing originally pen-and-paper game turned into an online website. </span>
			<span lang="ro">Este un joc relaxant original cu hartie si creion transformat intr-un website online. </span>
		</p>
		<h3 className="underlined">
			<span lang="en">How to play?</span>
			<span lang="ro">Cum se joaca?</span>
		</h3>
		<p>
			<span lang="en">You can start a public or a private session from the navigation bar at the top of the page. You can also join
			an already open session from the same buttons. Joining a public game randomly connects you to one of the pending ones.
			Joining a private game requires you to enter the session's 12-character id. For the game rules, check out the&nbsp;
			<a href="./how-to-play?lang=en">How to Play</a> section from the navigation bar above.</span>
			<span lang="ro">Poti incepe o sesiune publica sau privata din bara de navigate deasupra paginii. Poti de asemenea sa te
			alaturi unei sesiuni deja creata din aceleasi butoane. Alaturandu-te unui joc public te vei conecta la unul din cele aflate
			in asteptare, ales in mod intamplator. Daca vrei sa te alaturi unui joc privat, va trebui sa introduci id-ul de 
			12 caractere al sesiunii. Pentru reguli, citeste sectiunea <a href="./how-to-play?lang=ro">Cum se Joaca</a> din bara 
			de navigare de deasupra.</span>
		</p>
		</Font>
	</React.Fragment>
}
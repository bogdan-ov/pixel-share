/**
 * @author Bogdanov :D
 * Yee
 */

import Link from "next/link";
import React from "react";
import Page from "../components/Page";

const Home: React.FC = ()=> {
	return (
		<Page title="Home" className="welcome">

			<main className="container">
				<section className="section centered">

					<div className="slot flex-column">
						<div className="slot flex-column gap-4">
							<h1>Pixel share <span className="badge color-blue">Beta!</span></h1>
							<div className="slot flex-column gap-2">
								<button className="button color-blue">
									<Link href="/editor">
										Try now!
									</Link>
								</button>
								<span className="text-muted no-wrap">(Very boring design...)</span>
							</div>
						</div>
					</div>
					
				</section>
			</main>
			
		</Page>	
	);
};

export default Home;
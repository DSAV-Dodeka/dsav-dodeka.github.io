import React, { useState } from "react";
import { Link } from "react-router-dom";
import Nieuwsbericht from "./components/Nieuwsbericht";
import PageTitle from "../../components/PageTitle";
import NieuwsText from "../../content/Nieuws.json";
import spike from "../../images/nieuws/spike.svg";
import "./Nieuws.scss";

function Nieuws() {
    const [nBerichten, setNBerichten] = useState(3);

    return(
        <div class="text-center">
            <PageTitle title="Nieuws"/>
            <Link to="/nieuws/spike" class="linktospike"><img src={spike} alt="" class=""/></Link>
            <div class={"nieuwsberichten1" + (nBerichten >= NieuwsText.nieuwsberichten.length ? "nieuwsberichten2" : "")}>
            {NieuwsText.nieuwsberichten.slice(0, nBerichten).map((bericht, index) =>
                    <Nieuwsbericht position={index % 2 === 0 ? "left" : "right"} page="nieuws" id={bericht.id} titel={bericht.titel} datum={bericht.datum} auteur={bericht.auteur} tekst={bericht.tekst} foto={bericht.foto}/>
                )}
            </div>
            
            <button onClick={() => setNBerichten(nBerichten + 3)} class={"nieuwsberichten3" + (nBerichten >= NieuwsText.nieuwsberichten.length ? " hidden" : "")}>
                LAAD MEER
            </button>
        </div>
        
    )
}

export default Nieuws;
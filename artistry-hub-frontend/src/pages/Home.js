import React from "react";
import Events from "../components/Events";
import Description from "../components/Description";
import Footer from "../components/Footer";
import EventsList from "./EventsList";
export default function Home() {
    return (
        <>
            
            <Description/>
            <EventsList/>
            <Footer/>

        </>

    )
}
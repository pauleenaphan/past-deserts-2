import { Link } from 'react-router-dom'
import { PiCactusFill } from "react-icons/pi";

export const Nav = () => {
  return(
    <div className="flex justify-around items-center p-8 mb-32 font-bold bg-cardcolor">
      <div className="flex items-center gap-2">
        <h1 className="text-4xl"> Past Deserts </h1>
        <PiCactusFill className="text-5xl text-accentcolor"/>
      </div>
      
      <div className="flex gap-6 text-2xl">
        <p className="hover:text-black"> <Link to="/"> Home </Link> </p>
        <p className="hover:text-black"> <Link to="/About"> About </Link> </p>
        <p className="hover:text-black"> <Link to="/Entries"> Entries </Link> </p>
      </div>
    </div>
  )
}

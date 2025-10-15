import { Link } from 'react-router-dom'

export const Nav = (): JSX.Element => {
  return(
    <div>
      <h1> Past Deserts </h1>
      <div>
        <p> <Link to="/"> Home </Link> </p>
        <p> <Link to="/About"> About </Link> </p>
        <p> <Link to="/Entries"> Entries </Link> </p>
      </div>
    </div>
  )
}

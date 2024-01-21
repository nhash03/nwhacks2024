import React, { useState } from "react"
import './header.css';

function Header ()  {
  
  return (
    <header className="div-header">
      
      <nav>


        <ul id="emptybox">
          <li><a href="/">Home</a></li>
          <li><a href="/About">About</a></li>
          {/* <li><a href="/Donate">Donate</a></li> */}
          <li><a href="/">Contact</a></li>
        </ul>
      </nav>

    </header>
  )
}

export default Header
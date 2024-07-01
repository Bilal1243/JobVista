import React from 'react'
import './Style.css'
// import thankYou from '../../../assets/mutlistepForm/icon-thank-you.svg'
import pending from '../../../assets/mutlistepForm/pending-icon.png'
import {useNavigate} from 'react-router-dom'

function Thanks(){

    const navigate = useNavigate()

    return(
          <div className="content thanks">
              <div className="imgBox">
                  <img src={pending} alt="" />
              </div>
              <h2>pending!</h2>
              <p>Your job post will be live after admin accept it.</p>
              <input type="button" className="button" value="Go Back" onClick={()=>navigate('/myJobs')} />
          </div>
    )
}

export default Thanks
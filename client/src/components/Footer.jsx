/* eslint-disable no-unused-vars */
import React from 'react'

const Footer = () => {
  return (
    <footer className='footer'>
      <hr className='footer-line'/>
      <div className='footer-row'>
        <span>&copy; 2025 ElevateTrust.Ai. All rights reserved.</span>
        <a
          href="https://elevatetrust.ai/privacy-policy"
          className='privacy-policy-url'
          target="_blank"
          rel="noopener noreferrer"
        >
          Privacy Policy
        </a>
      </div>
    </footer>
  )
}

export default Footer

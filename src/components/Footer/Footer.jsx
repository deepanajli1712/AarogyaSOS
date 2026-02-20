import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaInstagram } from 'react-icons/fa'
import Logo from '../Logo'

function Footer() {
  return (
    <section className="relative overflow-hidden py-6 lg:py-12 bg-gray-900 text-gray-300">
      <div className="relative z-10 max-w-5xl mx-auto px-4 flex flex-col items-center gap-7 text-center">
        <div className="inline-flex items-center justify-center">
          <Logo width="100px" />
        </div>
        <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
          <div>
            <h3 className="text-sm font-bold uppercase mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link className="hover:text-white" to="/">Features</Link></li>
              <li><Link className="hover:text-white" to="/">Pricing</Link></li>
              <li><Link className="hover:text-white" to="/">Affiliate Program</Link></li>
              <li><Link className="hover:text-white" to="/">Press Kit</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link className="hover:text-white" to="/">Account</Link></li>
              <li><Link className="hover:text-white" to="/">Help</Link></li>
              <li><Link className="hover:text-white" to="/">Contact Us</Link></li>
              <li><Link className="hover:text-white" to="/">Customer Support</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase mb-4">Legals</h3>
            <ul className="space-y-2">
              <li><Link className="hover:text-white" to="/">Terms &amp; Conditions</Link></li>
              <li><Link className="hover:text-white" to="/">Privacy Policy</Link></li>
              <li><Link className="hover:text-white" to="/">Licensing</Link></li>
            </ul>
          </div>
        </div>
        <div className="w-full flex flex-col items-center">
          <div className="mb-4 flex justify-center space-x-6">
            <FaFacebook className="text-2xl hover:text-white cursor-pointer" />
            <FaTwitter className="text-2xl hover:text-white cursor-pointer" />
            <FaInstagram className="text-2xl hover:text-white cursor-pointer" />
          </div>
          <p className="text-sm">© 2023. All Rights Reserved.</p>
        </div>
      </div>
    </section>
  )
}

export default Footer

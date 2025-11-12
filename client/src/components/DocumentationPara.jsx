/* eslint-disable no-unused-vars */
import React from 'react'

const DocumentationPara = (prop) => {
  if (!prop.title && !prop.details) return null;
  return (
    <div className='doc-para-container' id={prop.id}>
      {prop.title && <p className='doc-para-title'>{prop.title}</p>}
      {prop.details && <p className='doc-para-details'>{prop.details}</p>}
    </div>
  )
}

export default DocumentationPara

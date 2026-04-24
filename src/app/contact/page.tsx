import Contact from '@/core/widgets/contact/Contact'
import PageHero from '@/core/widgets/shared/PageHero'
import React from 'react'

function page() {
    
  return (
    <div>
      <PageHero
        title="Contact"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Contact" },
        ]}
      />
    <Contact />
    </div>
  )
}

export default page
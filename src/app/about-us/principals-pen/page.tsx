import Principals_pen from '@/core/widgets/About/Principals-pen'
import PageHero from '@/core/widgets/shared/PageHero'
import React from 'react'

function page() {
  return (
    <div>
            <PageHero
        title="Principal's Pen"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Principal's Pen" },
        ]}
      />
      
      <Principals_pen />
    </div>
  )
}

export default page